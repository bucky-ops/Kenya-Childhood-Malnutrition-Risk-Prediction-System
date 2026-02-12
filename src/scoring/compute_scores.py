"""Data quality scoring module for KAM Forecast project."""
import pandas as pd
from typing import Dict
import sys
from pathlib import Path

# Add project root to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from config.config import config
from src.utils.logging_config import get_logger
from src.utils.file_utils import load_dataframe, save_dataframe
from src.dqr.dqr_mapping import add_dqr_dimensions

logger = get_logger(__name__)

def compute_data_quality_scores() -> pd.DataFrame:
    """
    Compute monthly data quality scores per county using WHO DQR framework.
    
    Scores range from 0-100, where 100 indicates perfect data quality.
    Weighting prioritizes completeness and timeliness as critical for malnutrition
    surveillance, following WHO DQR guidelines for humanitarian health data.
    
    Returns:
        County-level data quality scores with columns: county, date, score
    
    Raises:
        FileNotFoundError: If validation report not found.
    """
    # Load validation report
    validation_path = config.PROCESSED_DATA_DIR / config.VALIDATION_REPORT_FILE
    logger.info(f"Loading validation report from {validation_path}")
    df = load_dataframe(validation_path, required=True)
    
    if df.empty:
        logger.warning("Validation report is empty - returning empty scores")
        return pd.DataFrame(columns=['county', 'date', 'score'])
    
    # Add DQR dimensions
    logger.info("Adding DQR dimensions to validation report")
    df = add_dqr_dimensions(df)
    
    # Use weighting factors from config
    severity_weights = config.SEVERITY_WEIGHTS
    dimension_weights = config.DQR_WEIGHTS
    
    # Calculate penalty for each issue
    df['penalty'] = df.apply(
        lambda row: severity_weights.get(row['severity'], 1) * 
                   dimension_weights.get(row['dqr_dimension'], 1), 
        axis=1
    )
    
    # Aggregate penalties by county and date (month)
    scores_df = df.groupby(['county', 'date'])['penalty'].sum().reset_index()
    scores_df['score'] = (100 - scores_df['penalty']).clip(lower=0, upper=100)
    
    # Select final columns
    scores_df = scores_df[['county', 'date', 'score']]
    
    # Sort for consistency
    scores_df = scores_df.sort_values(['county', 'date']).reset_index(drop=True)
    
    return scores_df

def save_scores(scores_df: pd.DataFrame) -> None:
    """
    Save computed data quality scores to CSV.
    
    Args:
        scores_df: Scores dataframe.
    """
    scores_path = config.PROCESSED_DATA_DIR / config.QUALITY_SCORES_FILE
    save_dataframe(scores_df, scores_path)
    logger.info(f"Data quality scores saved to {scores_path}")

if __name__ == "__main__":
    from src.utils.logging_config import setup_logging
    
    setup_logging()
    config.ensure_directories()
    
    try:
        scores_df = compute_data_quality_scores()
        save_scores(scores_df)
        logger.info("Data quality scores computed and saved successfully")
        print("Data quality scores computed and saved:")
        print(scores_df.head())
        if not scores_df.empty:
            print(f"Score range: {scores_df['score'].min()} - {scores_df['score'].max()}")
    except Exception as e:
        logger.error(f"Failed to compute scores: {e}")
        print(f"Error: {e}")
        sys.exit(1)