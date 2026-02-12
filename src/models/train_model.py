"""Model training module for KAM Forecast project."""
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from typing import Dict, Tuple, Optional
import sys
from pathlib import Path

# Add project root to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from config.config import config
from src.utils.logging_config import get_logger
from src.utils.model_utils import save_model

logger = get_logger(__name__)

def train_model(
    df: pd.DataFrame,
    target_col: str = 'acute_malnutrition_cases',
    test_size: Optional[float] = None,
    model_params: Optional[Dict] = None
) -> Tuple[RandomForestRegressor, Dict]:
    """
    Train a RandomForestRegressor baseline model for malnutrition prediction.
    
    Uses time-based splitting for time series data (not random split).
    
    NGO relevance: Baseline ML model provides quantitative risk scores to inform
    resource allocation decisions in malnutrition prevention initiatives.
    
    Args:
        df: Feature engineered dataframe.
        target_col: Name of the target variable column.
        test_size: Proportion of data for testing (default: from config).
        model_params: Model hyperparameters (default: from config).
    
    Returns:
        Tuple of (trained model, metrics dictionary).
    
    Raises:
        ValueError: If dataframe is empty or insufficient data.
    """
    if df.empty:
        raise ValueError("Cannot train model on empty dataframe")
    
    if 'date' not in df.columns:
        raise ValueError("Date column is required for time-based splitting")
    
    if test_size is None:
        test_size = config.MODEL_PARAMS['test_size']
    if model_params is None:
        model_params = config.MODEL_PARAMS.copy()
    
    logger.info(f"Starting model training. Data shape: {df.shape}")
    
    # Prepare features and target
    exclude_cols = ['sub_county', 'county', 'date', target_col]
    feature_cols = [col for col in df.columns if col not in exclude_cols]

    if not feature_cols:
        raise ValueError("No feature columns found for training")

    logger.info(f"Using {len(feature_cols)} features for training")

    # Time-based split (important for time series - no random split!)
    df_sorted = df.sort_values('date').reset_index(drop=True)
    split_idx = int(len(df_sorted) * (1 - test_size))
    split_date = df_sorted.iloc[split_idx]['date']

    # Create masks based on the sorted dataframe
    train_mask = df_sorted['date'] < split_date
    test_mask = df_sorted['date'] >= split_date

    # Extract X and y from the sorted dataframe to ensure alignment
    X_sorted = df_sorted[feature_cols]
    y_sorted = df_sorted[target_col]
    
    X_train, X_test = X_sorted[train_mask], X_sorted[test_mask]
    y_train, y_test = y_sorted[train_mask], y_sorted[test_mask]
    
    logger.info(f"Training set: {len(X_train)} samples (before {split_date})")
    logger.info(f"Test set: {len(X_test)} samples (from {split_date} onwards)")
    
    if len(X_train) == 0 or len(X_test) == 0:
        raise ValueError("Insufficient data for train/test split")
    
    # Train RandomForest model
    logger.info("Training RandomForest model...")
    model = RandomForestRegressor(
        n_estimators=model_params['n_estimators'],
        random_state=model_params['random_state'],
        max_depth=model_params.get('max_depth'),
        min_samples_split=model_params.get('min_samples_split', 2),
        min_samples_leaf=model_params.get('min_samples_leaf', 1)
    )
    
    model.fit(X_train, y_train)
    logger.info("Model training completed")
    
    # Evaluate on test set
    logger.info("Evaluating model on test set...")
    y_pred = model.predict(X_test)
    
    mse = mean_squared_error(y_test, y_pred)
    metrics = {
        'mae': mean_absolute_error(y_test, y_pred),
        'mse': mse,
        'rmse': mse ** 0.5,  # Calculate RMSE manually since squared param may not be available
        'r2': r2_score(y_test, y_pred),
        'feature_importance': dict(zip(feature_cols, model.feature_importances_)),
        'n_train': len(X_train),
        'n_test': len(X_test),
        'split_date': str(split_date)
    }
    
    logger.info(f"Model evaluation - MAE: {metrics['mae']:.2f}, RMSE: {metrics['rmse']:.2f}, R²: {metrics['r2']:.3f}")
    
    # Save model with metadata
    model_path = config.MODELS_DIR / 'random_forest_model.pkl'
    metadata = {
        'metrics': metrics,
        'model_params': model_params,
        'features': feature_cols,
        'target_col': target_col,
        'test_size': test_size
    }
    
    save_model(model, model_path, metadata=metadata, versioned=True)
    logger.info(f"Model saved to {model_path}")
    
    return model, metrics

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
        model, metrics = train_model(feature_df)
        logger.info("Model training completed successfully")
        print(f"\nModel saved to {config.MODELS_DIR / 'random_forest_model.pkl'}")
        print(f"MAE: {metrics['mae']:.2f}")
        print(f"RMSE: {metrics['rmse']:.2f}")
        print(f"R²: {metrics['r2']:.3f}")
    except Exception as e:
        logger.error(f"Failed to train model: {e}")
        print(f"Error: {e}")
        sys.exit(1)