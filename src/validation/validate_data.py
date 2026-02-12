"""Data validation module for KAM Forecast project."""
import pandas as pd
import numpy as np
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional
import sys

# Add project root to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from config.config import config
from src.utils.logging_config import get_logger
from src.utils.file_utils import save_dataframe

logger = get_logger(__name__)

def validate_schema(df: pd.DataFrame) -> Dict:
    """
    Check if required columns exist and have correct data types.
    
    Public-health relevance: Ensures data structure integrity for reliable
    malnutrition surveillance and program monitoring.
    
    Args:
        df: Input dataframe.
    
    Returns:
        Validation results with 'passed' boolean and issues list.
    """
    required_cols = ['county', 'sub_county', 'date', 'acute_malnutrition_cases']
    issues = []
    
    # Check required columns
    missing_cols = [col for col in required_cols if col not in df.columns]
    if missing_cols:
        issues.append(f"Missing required columns: {missing_cols}")
    
    # Check data types
    if 'date' in df.columns and not pd.api.types.is_datetime64_any_dtype(df['date']):
        issues.append("Date column must be datetime type")
    
    numeric_cols = ['acute_malnutrition_cases', 'population_under5', 'sam_cases', 'mam_cases', 'rainfall_mm', 'water_access_pct']
    for col in numeric_cols:
        if col in df.columns and not pd.api.types.is_numeric_dtype(df[col]):
            issues.append(f"Column {col} should be numeric")
    
    return {'passed': len(issues) == 0, 'issues': issues}

def validate_dates(df: pd.DataFrame) -> Dict:
    """
    Validate date-related constraints for monthly health data.
    
    Public-health relevance: Ensures temporal consistency for trend analysis
    in malnutrition monitoring systems.
    
    Args:
        df: Input dataframe.
    
    Returns:
        Validation results.
    """
    issues = []
    
    if 'date' not in df.columns:
        return {'passed': False, 'issues': ['Date column missing']}
    
    # Check for future dates
    today = datetime.now().date()
    future_dates = df[df['date'].dt.date > today]
    if not future_dates.empty:
        issues.append(f"Found {len(future_dates)} future dates")
    
    # Check monthly frequency (assuming sorted data)
    # More flexible: allow 28-31 days (month variations) or ~30 days average
    df_sorted = df.sort_values('date')
    date_diffs = df_sorted['date'].diff().dt.days.dropna()
    # Allow 25-35 days to account for month variations and potential gaps
    non_monthly = date_diffs[(date_diffs < 25) | (date_diffs > 35)]
    if not non_monthly.empty:
        issues.append(f"Found {len(non_monthly)} non-monthly date intervals (expected 25-35 days)")
    
    # Check duplicates
    duplicates = df.duplicated(subset=['sub_county', 'date'], keep=False)
    if duplicates.any():
        issues.append(f"Found {duplicates.sum()} duplicate (sub_county, date) rows")
    
    return {'passed': len(issues) == 0, 'issues': issues}

def validate_geography(df):
    """
    Validate geographic data integrity.
    
    Public-health relevance: Ensures accurate geographic targeting for
    localized malnutrition intervention programs.
    
    Args:
        df (pd.DataFrame): Input dataframe.
    
    Returns:
        dict: Validation results.
    """
    issues = []
    
    # Check for null geographic identifiers
    geo_cols = ['county', 'sub_county']
    for col in geo_cols:
        null_count = df[col].isnull().sum()
        if null_count > 0:
            issues.append(f"Found {null_count} null values in {col}")
    
    # Check sub_county to county mapping consistency
    if 'sub_county' in df.columns and 'county' in df.columns:
        mapping = df.groupby('sub_county')['county'].nunique()
        inconsistent = mapping[mapping > 1]
        if not inconsistent.empty:
            issues.append(f"Found {len(inconsistent)} sub_counties mapped to multiple counties")
    
    return {'passed': len(issues) == 0, 'issues': issues}

def validate_numeric_sanity(df):
    """
    Check numeric values for sanity bounds.
    
    Public-health relevance: Identifies data entry errors that could lead to
    incorrect resource allocation in humanitarian responses.
    
    Args:
        df (pd.DataFrame): Input dataframe.
    
    Returns:
        dict: Validation results.
    """
    issues = []
    
    # No negative case counts
    case_cols = ['acute_malnutrition_cases', 'sam_cases', 'mam_cases']
    for col in case_cols:
        if col in df.columns:
            negatives = df[df[col] < 0]
            if not negatives.empty:
                issues.append(f"Found {len(negatives)} negative values in {col}")
    
    # Upper bounds check (extreme outliers)
    if 'acute_malnutrition_cases' in df.columns:
        # Assume reasonable upper bound based on population (if available)
        if 'population_under5' in df.columns:
            # Flag cases > 50% of under5 population (extreme outlier)
            extreme = df[df['acute_malnutrition_cases'] > df['population_under5'] * 0.5]
            if not extreme.empty:
                issues.append(f"Found {len(extreme)} extreme outliers in acute_malnutrition_cases (>50% of under5 pop)")
        else:
            # Generic upper bound: flag > 10000 cases per month per sub_county
            extreme = df[df['acute_malnutrition_cases'] > 10000]
            if not extreme.empty:
                issues.append(f"Found {len(extreme)} extreme values in acute_malnutrition_cases (>10000)")
    
    return {'passed': len(issues) == 0, 'issues': issues}

def validate_missing_data(df):
    """
    Assess missing data patterns.
    
    Public-health relevance: Quantifies data gaps that may affect the reliability
    of malnutrition risk predictions for program planning.
    
    Args:
        df (pd.DataFrame): Input dataframe.
    
    Returns:
        dict: Validation results with missing percentages.
    """
    issues = []
    missing_pct = {}
    
    for col in df.columns:
        pct_missing = df[col].isnull().mean() * 100
        missing_pct[col] = round(pct_missing, 2)
        if pct_missing > 20:
            issues.append(f"Column {col} has {pct_missing:.1f}% missing data (>20% threshold)")
    
    return {'passed': len(issues) == 0, 'issues': issues, 'missing_percentages': missing_pct}

def validate_reporting_consistency(df):
    """
    Check for suspicious reporting patterns.
    
    Public-health relevance: Detects potential under-reporting or data quality
    issues that could undermine malnutrition surveillance effectiveness.
    
    Args:
        df (pd.DataFrame): Input dataframe.
    
    Returns:
        dict: Validation results.
    """
    issues = []
    
    if 'acute_malnutrition_cases' not in df.columns:
        return {'passed': False, 'issues': ['Target column missing for consistency check']}
    
    # Group by sub_county and check for spikes and zero streaks
    for sub_county, group in df.groupby('sub_county'):
        cases = group.sort_values('date')['acute_malnutrition_cases'].values
        
        # Check for month-to-month spikes >300%
        for i in range(1, len(cases)):
            if cases[i-1] > 0:  # Avoid division by zero
                pct_change = (cases[i] - cases[i-1]) / cases[i-1] * 100
                if pct_change > 300:
                    issues.append(f"Spike >300% in {sub_county} from month {i-1} to {i}")
        
        # Check for long zero streaks (>6 months)
        zero_streak = 0
        max_streak = 0
        for case in cases:
            if case == 0:
                zero_streak += 1
                max_streak = max(max_streak, zero_streak)
            else:
                zero_streak = 0
        
        if max_streak > 6:
            issues.append(f"Zero reporting streak of {max_streak} months in {sub_county}")
    
    return {'passed': len(issues) == 0, 'issues': issues}

def run_validation(df: pd.DataFrame) -> Dict:
    """
    Run all validation checks and generate comprehensive report.
    
    Args:
        df: Input dataframe to validate.
    
    Returns:
        Complete validation results.
    """
    logger.info("Starting data validation...")
    results = {
        'schema': validate_schema(df),
        'dates': validate_dates(df),
        'geography': validate_geography(df),
        'numeric_sanity': validate_numeric_sanity(df),
        'missing_data': validate_missing_data(df),
        'reporting_consistency': validate_reporting_consistency(df)
    }
    
    # Log summary
    logger.info("=== DATA VALIDATION SUMMARY ===")
    all_passed = True
    for check_name, result in results.items():
        status = "PASSED" if result['passed'] else "FAILED"
        logger.info(f"{check_name.upper()}: {status}")
        if not result['passed']:
            all_passed = False
            for issue in result['issues']:
                logger.warning(f"  - {issue}")
    
    logger.info(f"OVERALL: {'PASSED' if all_passed else 'FAILED'}")
    
    # Save detailed report
    report_data = []
    for check_name, result in results.items():
        for issue in result.get('issues', []):
            report_data.append({'check': check_name, 'issue': issue})
    
    # Add missing data percentages if available
    if 'missing_percentages' in results['missing_data']:
        for col, pct in results['missing_data']['missing_percentages'].items():
            report_data.append({'check': 'missing_data', 'issue': f"{col}: {pct}% missing"})
    
    if report_data:
        report_df = pd.DataFrame(report_data)
        report_path = config.PROCESSED_DATA_DIR / config.VALIDATION_REPORT_FILE
        save_dataframe(report_df, report_path)
        logger.info(f"Validation report saved to {report_path}")
    else:
        logger.info("No validation issues found - no report generated")
    
    return results

if __name__ == "__main__":
    from src.utils.logging_config import setup_logging
    from src.data.load_data import load_and_merge_data
    
    setup_logging()
    config.ensure_directories()
    
    try:
        df = load_and_merge_data()
        results = run_validation(df)
        logger.info("Validation completed successfully")
    except Exception as e:
        logger.error(f"Validation failed: {e}")
        print(f"Error: {e}")
        sys.exit(1)