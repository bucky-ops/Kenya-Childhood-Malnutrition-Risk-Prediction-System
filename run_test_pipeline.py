"""
Test Data Loader for Kenya Childhood Malnutrition Risk Prediction System

This script loads the generated test data using the system's pipeline.
"""
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from pathlib import Path
import sys
import os

# Add project root to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from src.data.load_data import load_and_merge_data
from config.config import config

def load_test_data():
    """
    Load test data using the system's data loading pipeline with custom filenames.
    """
    print("Loading test data using the system's pipeline...")
    
    # Use the generated test data files
    data_dir = config.DATA_DIR / "raw"  # Use the standard data directory
    
    # Load data with the correct filenames
    df = load_and_merge_data(
        data_dir=data_dir,
        who_file="who_nutrition.csv",
        unicef_file="unicef_wash.csv",
        dhis2_file="dhis2_cases.csv"
    )
    
    print(f"Data loaded successfully. Shape: {df.shape}")
    print(f"Date range: {df['date'].min()} to {df['date'].max()}")
    print(f"Counties: {df['county'].nunique()}")
    print(f"Sub-counties: {df['sub_county'].nunique()}")
    
    return df

def run_full_pipeline():
    """
    Run the complete system pipeline with test data.
    """
    print("\nRunning complete system pipeline with test data...")
    
    # Load data
    df = load_test_data()
    
    # Clean data
    from src.data.clean_data import clean_data
    cleaned_df = clean_data(df)
    print(f"Data cleaned. Shape: {cleaned_df.shape}")
    
    # Build features
    from src.features.build_features import build_features
    features_df = build_features(cleaned_df, save_features=True)
    print(f"Features built. Shape: {features_df.shape}")
    
    # Train model
    from src.models.train_model import train_model
    model, metrics = train_model(features_df)
    print(f"Model trained. Metrics: MAE={metrics['mae']:.2f}, R²={metrics['r2']:.3f}")
    
    # Generate predictions
    from src.models.predict import make_predictions
    predictions_df = make_predictions(features_df)
    print(f"Predictions generated. Shape: {predictions_df.shape}")
    
    print("\nPipeline completed successfully with test data!")

if __name__ == "__main__":
    print("Kenya Childhood Malnutrition Risk Prediction - Test Data Loader")
    print("=" * 70)
    
    try:
        run_full_pipeline()
    except Exception as e:
        print(f"Error running pipeline: {e}")
        import traceback
        traceback.print_exc()