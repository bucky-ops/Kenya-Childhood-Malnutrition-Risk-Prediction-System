"""Model prediction module for KAM Forecast project."""
import pandas as pd
from typing import Optional
import sys
from pathlib import Path

# Add project root to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from config.config import config
from src.utils.logging_config import get_logger
from src.utils.model_utils import load_model
from src.utils.file_utils import save_dataframe

logger = get_logger(__name__)

def make_predictions(
    df: pd.DataFrame,
    target_col: str = 'acute_malnutrition_cases',
    model_path: Optional[Path] = None
) -> pd.DataFrame:
    """
    Generate predictions using trained model and save to CSV.
    
    NGO relevance: Prediction outputs enable scenario planning and early warning
    for malnutrition outbreaks in humanitarian operations.
    
    Args:
        df: Feature engineered dataframe.
        target_col: Name of the target variable column.
        model_path: Path to model file (default: latest model from config).
    
    Returns:
        Predictions dataframe with actual and predicted values.
    
    Raises:
        FileNotFoundError: If model file not found.
        ValueError: If dataframe is empty or features don't match.
    """
    if df.empty:
        raise ValueError("Cannot make predictions on empty dataframe")
    
    # Load trained model
    if model_path is None:
        model_path = config.MODELS_DIR / 'random_forest_model.pkl'
    else:
        model_path = Path(model_path)
    
    logger.info(f"Loading model from {model_path}")
    model_data = load_model(model_path, required=True)
    
    # Handle both old format (just model) and new format (dict with model)
    if isinstance(model_data, dict):
        model = model_data['model']
        metadata = model_data.get('metadata', {})
        expected_features = metadata.get('features', [])
    else:
        # Old format - just the model object
        model = model_data
        expected_features = None
        logger.warning("Using old model format - feature validation skipped")
    
    # Prepare features
    exclude_cols = ['sub_county', 'county', 'date', target_col]
    feature_cols = [col for col in df.columns if col not in exclude_cols]
    
    # Validate features match if metadata available
    if expected_features:
        missing_features = set(expected_features) - set(feature_cols)
        extra_features = set(feature_cols) - set(expected_features)
        
        if missing_features:
            logger.warning(f"Missing features: {missing_features}")
        if extra_features:
            logger.warning(f"Extra features (will be ignored): {extra_features}")
        
        # Use only expected features
        feature_cols = [col for col in feature_cols if col in expected_features]
    
    if not feature_cols:
        raise ValueError("No feature columns found for prediction")
    
    logger.info(f"Using {len(feature_cols)} features for prediction")
    
    X = df[feature_cols]
    
    # Make predictions
    logger.info("Generating predictions...")
    predictions = model.predict(X)
    
    # Create output dataframe
    results_df = df[['sub_county', 'county', 'date', target_col]].copy()
    results_df['predicted_cases'] = predictions
    
    # Ensure non-negative predictions (malnutrition cases can't be negative)
    negative_count = (results_df['predicted_cases'] < 0).sum()
    if negative_count > 0:
        logger.warning(f"Found {negative_count} negative predictions, clipping to 0")
        results_df['predicted_cases'] = results_df['predicted_cases'].clip(lower=0)
    
    # Save to CSV
    predictions_path = config.PROCESSED_DATA_DIR / config.PREDICTIONS_FILE
    save_dataframe(results_df, predictions_path)
    
    logger.info(f"Predictions saved to {predictions_path}")
    logger.info(f"Total predictions: {len(results_df)}")
    logger.info(f"Prediction range: {results_df['predicted_cases'].min():.2f} to {results_df['predicted_cases'].max():.2f}")
    
    return results_df

if __name__ == "__main__":
    from src.utils.logging_config import setup_logging
    from src.features.build_features import build_features
    from src.data.clean_data import clean_data
    from src.data.load_data import load_and_merge_data
    
    setup_logging()
    config.ensure_directories()
    
    try:
        raw_df = load_and_merge_data()
        clean_df = clean_data(raw_df)
        feature_df = build_features(clean_df)
        predictions_df = make_predictions(feature_df)
        logger.info("Predictions completed successfully")
        print(f"\nPredictions saved to {config.PROCESSED_DATA_DIR / config.PREDICTIONS_FILE}")
        print(f"Total predictions: {len(predictions_df)}")
        print(f"\nFirst few predictions:")
        print(predictions_df.head())
    except Exception as e:
        logger.error(f"Failed to generate predictions: {e}")
        print(f"Error: {e}")
        sys.exit(1)