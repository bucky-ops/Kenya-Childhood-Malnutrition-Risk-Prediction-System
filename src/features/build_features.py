"""Feature engineering module for KAM Forecast project."""
import pandas as pd
from typing import List, Optional
import sys
from pathlib import Path

# Add project root to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from config.config import config
from src.utils.logging_config import get_logger
from src.utils.file_utils import save_dataframe

logger = get_logger(__name__)

def build_features(
    df: pd.DataFrame,
    target_col: str = 'acute_malnutrition_cases',
    lag_periods: Optional[List[int]] = None,
    save_features: bool = False
) -> pd.DataFrame:
    """
    Engineer features for malnutrition prediction model.
    
    NGO relevance: Feature engineering transforms raw indicators into predictive
    signals for early warning systems in malnutrition prevention programs.
    
    Args:
        df: Cleaned dataframe.
        target_col: Name of the target variable column.
        lag_periods: List of lag periods to create (default: from config).
        save_features: Whether to save engineered features to file.
    
    Returns:
        Dataframe with engineered features.
    
    Raises:
        ValueError: If dataframe is empty or required columns are missing.
    """
    if df.empty:
        raise ValueError("Cannot build features from empty dataframe")
    
    if 'date' not in df.columns:
        raise ValueError("Date column is required for feature engineering")
    
    if lag_periods is None:
        lag_periods = config.LAG_PERIODS
    
    logger.info(f"Starting feature engineering. Initial shape: {df.shape}")
    
    # Sort by sub_county and date
    df = df.sort_values(['sub_county', 'date']).reset_index(drop=True)
    
    # Seasonal features
    logger.info("Creating seasonal features...")
    df['month'] = df['date'].dt.month
    df['year'] = df['date'].dt.year
    
    # Identify feature columns (exclude target and identifiers)
    exclude_cols = ['sub_county', 'county', 'date', target_col, 'month', 'year']
    feature_cols = [col for col in df.columns if col not in exclude_cols]
    
    if not feature_cols:
        logger.warning("No feature columns found for lagging")
    else:
        logger.info(f"Creating lag features for {len(feature_cols)} columns with lags {lag_periods}")
        
        # Create lag features for each period
        for lag in lag_periods:
            for col in feature_cols:
                df[f'{col}_lag_{lag}'] = df.groupby('sub_county')[col].shift(lag)
        
        # Also lag the target for autoregressive features
        logger.info("Creating autoregressive features from target variable...")
        for lag in lag_periods:
            df[f'{target_col}_lag_{lag}'] = df.groupby('sub_county')[target_col].shift(lag)
    
    # Drop rows with NaN from lagging (can't predict without historical data)
    rows_before_drop = len(df)
    df = df.dropna().reset_index(drop=True)
    rows_dropped = rows_before_drop - len(df)
    
    if rows_dropped > 0:
        logger.info(f"Dropped {rows_dropped} rows with NaN from lagging (need historical data)")
    
    logger.info(f"Feature engineered data shape: {df.shape}")
    logger.info(f"Total features: {len(df.columns)}")
    
    # Save features if requested
    if save_features:
        features_path = config.PROCESSED_DATA_DIR / config.FEATURES_FILE
        save_dataframe(df, features_path)
        logger.info(f"Saved engineered features to {features_path}")
    
    return df

if __name__ == "__main__":
    from src.utils.logging_config import setup_logging
    from src.data.load_data import load_and_merge_data
    from src.data.clean_data import clean_data
    
    setup_logging()
    
    try:
        raw_df = load_and_merge_data()
        clean_df = clean_data(raw_df)
        feature_df = build_features(clean_df, save_features=True)
        logger.info("Successfully built features")
        print(f"\nFeature engineered data shape: {feature_df.shape}")
        lag_features = [col for col in feature_df.columns if 'lag' in col]
        print(f"Created {len(lag_features)} lag features")
        print(f"\nNew features: {lag_features[:10]}...")  # Show first 10
    except Exception as e:
        logger.error(f"Failed to build features: {e}")
        print(f"Error: {e}")
        sys.exit(1)