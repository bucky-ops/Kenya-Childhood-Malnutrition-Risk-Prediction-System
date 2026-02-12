"""Data cleaning module for KAM Forecast project."""
import pandas as pd
from sklearn.impute import SimpleImputer
from typing import List, Optional
import sys
from pathlib import Path

# Add project root to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from config.config import config
from src.utils.logging_config import get_logger

logger = get_logger(__name__)

def clean_data(df: pd.DataFrame, target_col: str = 'acute_malnutrition_cases') -> pd.DataFrame:
    """
    Clean missing values in the merged dataframe safely for time series prediction.
    
    NGO relevance: Proper data cleaning ensures reliable predictions for humanitarian
    response planning, avoiding false positives that could waste resources.
    
    Args:
        df: Raw merged dataframe.
        target_col: Name of the target variable column.
    
    Returns:
        Cleaned dataframe with no missing target values.
    
    Raises:
        ValueError: If dataframe is empty or target column is missing.
    """
    if df.empty:
        raise ValueError("Cannot clean empty dataframe")
    
    if target_col not in df.columns:
        raise ValueError(f"Target column '{target_col}' not found in dataframe")
    
    logger.info(f"Starting data cleaning. Initial shape: {df.shape}")
    initial_missing = df.isnull().sum().sum()
    logger.info(f"Initial missing values: {initial_missing}")
    
    # Sort by sub_county and date to ensure temporal order
    df = df.sort_values(['sub_county', 'date']).reset_index(drop=True)
    
    # Identify feature columns (exclude identifiers and target)
    exclude_cols = ['sub_county', 'county', 'date', target_col]
    feature_cols = [col for col in df.columns if col not in exclude_cols]
    
    # Forward fill missing values within each sub_county group
    # This preserves time series integrity without data leakage
    # Using ffill() instead of deprecated fillna(method='ffill')
    logger.info("Applying forward fill within sub-county groups...")
    df[feature_cols] = df.groupby('sub_county')[feature_cols].ffill()
    
    # For any remaining missing values (e.g., at start of series), use median imputation
    # But only for features, not target
    remaining_missing = df[feature_cols].isnull().sum().sum()
    if remaining_missing > 0:
        logger.info(f"Imputing {remaining_missing} remaining missing values with median...")
        imputer = SimpleImputer(strategy='median')
        df[feature_cols] = imputer.fit_transform(df[feature_cols])
        logger.info("Median imputation completed")
    
    # Drop rows where target is still missing (cannot predict without target)
    rows_before_drop = len(df)
    df = df.dropna(subset=[target_col])
    rows_dropped = rows_before_drop - len(df)
    
    if rows_dropped > 0:
        logger.warning(f"Dropped {rows_dropped} rows with missing target values")
    
    final_missing = df.isnull().sum().sum()
    logger.info(f"Cleaned data shape: {df.shape}")
    logger.info(f"Final missing values: {final_missing}")
    
    if final_missing > 0:
        logger.warning(f"Warning: {final_missing} missing values still remain after cleaning")
    
    return df

if __name__ == "__main__":
    from src.utils.logging_config import setup_logging
    from src.data.load_data import load_and_merge_data
    
    setup_logging()
    
    try:
        raw_df = load_and_merge_data()
        clean_df = clean_data(raw_df)
        logger.info(f"Successfully cleaned data")
        print(f"\nCleaned data shape: {clean_df.shape}")
        print(f"Missing values remaining: {clean_df.isnull().sum().sum()}")
        print(f"\nFirst few rows:")
        print(clean_df.head())
    except Exception as e:
        logger.error(f"Failed to clean data: {e}")
        print(f"Error: {e}")
        sys.exit(1)