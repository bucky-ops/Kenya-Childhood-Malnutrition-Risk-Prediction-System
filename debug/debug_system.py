"""
Debug script for the Kenya Childhood Malnutrition Risk Prediction System.

This script provides various debugging utilities to help diagnose issues
with the system components.
"""
import sys
import os
from pathlib import Path
import pandas as pd
import numpy as np
import traceback
from datetime import datetime

# Add project root to path
project_root = Path(__file__).parent.parent  # Go up from debug/ to project root
sys.path.insert(0, str(project_root))

def debug_imports():
    """Test importing all major modules."""
    print("=== Testing Module Imports ===")
    
    modules_to_test = [
        ("config.config", "Configuration"),
        ("src.utils.logging_config", "Logging"),
        ("src.data.load_data", "Data Loading"),
        ("src.data.clean_data", "Data Cleaning"),
        ("src.features.build_features", "Feature Engineering"),
        ("src.models.train_model", "Model Training"),
        ("src.models.predict", "Prediction"),
        ("src.validation.validate_data", "Validation"),
        ("src.scoring.compute_scores", "Scoring"),
        ("src.utils.file_utils", "File Utilities"),
        ("src.utils.model_utils", "Model Utilities"),
    ]
    
    success_count = 0
    for module_path, description in modules_to_test:
        try:
            __import__(module_path, fromlist=[''])
            print(f"SUCCESS: {description} ({module_path})")
            success_count += 1
        except ImportError as e:
            print(f"FAILED: {description} ({module_path}): {e}")
    
    print(f"\nImport Success Rate: {success_count}/{len(modules_to_test)}\n")
    return success_count == len(modules_to_test)

def debug_dependencies():
    """Test that all required dependencies are available."""
    print("=== Testing Dependencies ===")
    
    dependencies = [
        ("pandas", "pandas"),
        ("numpy", "numpy"), 
        ("sklearn", "scikit-learn"),
        ("matplotlib", "matplotlib"),
        ("seaborn", "seaborn"),
        ("streamlit", "streamlit"),
        ("reportlab", "reportlab"),
        ("pptx", "python-pptx"),
    ]
    
    success_count = 0
    for import_name, display_name in dependencies:
        try:
            __import__(import_name)
            print(f"SUCCESS: {display_name} ({import_name})")
            success_count += 1
        except ImportError as e:
            print(f"FAILED: {display_name} ({import_name}): {e}")
    
    print(f"\nDependency Success Rate: {success_count}/{len(dependencies)}\n")
    return success_count == len(dependencies)

def debug_config():
    """Test configuration loading."""
    print("=== Testing Configuration ===")
    
    try:
        from config.config import config
        print(f"SUCCESS: Configuration loaded successfully")
        print(f"  Base directory: {config.BASE_DIR}")
        print(f"  Raw data directory: {config.RAW_DATA_DIR}")
        print(f"  Processed data directory: {config.PROCESSED_DATA_DIR}")
        print(f"  Models directory: {config.MODELS_DIR}")
        print(f"  Reports directory: {config.REPORTS_DIR}")
        print(f"  Model parameters: {config.MODEL_PARAMS}")
        print(f"  Quality thresholds: {config.QUALITY_THRESHOLDS}")
        return True
    except Exception as e:
        print(f"FAILED: Configuration error: {e}")
        traceback.print_exc()
        return False

def debug_paths():
    """Test that required directories exist."""
    print("=== Testing Required Directories ===")
    
    from config.config import config
    
    dirs_to_check = [
        ("Base directory", config.BASE_DIR),
        ("Data directory", config.DATA_DIR),
        ("Raw data directory", config.RAW_DATA_DIR),
        ("Processed data directory", config.PROCESSED_DATA_DIR),
        ("Models directory", config.MODELS_DIR),
        ("Reports directory", config.REPORTS_DIR),
    ]
    
    success_count = 0
    for desc, path in dirs_to_check:
        if path.exists():
            print(f"SUCCESS: {desc}: {path}")
            success_count += 1
        else:
            print(f"FAILED: {desc}: {path} (does not exist)")
            # Try to create it
            try:
                path.mkdir(parents=True, exist_ok=True)
                print(f"  Created directory: {path}")
                success_count += 1
            except Exception as e:
                print(f"  Failed to create: {e}")
    
    print(f"\nDirectory Check Success Rate: {success_count}/{len(dirs_to_check)}\n")
    return success_count == len(dirs_to_check)

def debug_sample_pipeline():
    """Run a minimal sample pipeline to test integration."""
    print("=== Testing Sample Pipeline ===")
    
    try:
        from src.utils.logging_config import setup_logging
        setup_logging()
        print("SUCCESS: Logging configured")
        
        # Create minimal sample data
        sample_data = pd.DataFrame({
            'sub_county': ['Test-A', 'Test-B'] * 5,
            'county': ['Test-County'] * 10,
            'date': pd.date_range('2023-01-01', periods=10, freq='M'),
            'acute_malnutrition_cases': [100, 105, 98, 110, 102, 95, 108, 112, 99, 104],
            'population_under_5': [5000, 4800] * 5,
            'water_access_pct': [75, 80] * 5
        })
        print("SUCCESS: Sample data created")
        
        # Test data cleaning
        from src.data.clean_data import clean_data
        cleaned_data = clean_data(sample_data)
        print("SUCCESS: Data cleaning completed")
        
        # Test feature engineering
        from src.features.build_features import build_features
        features_data = build_features(cleaned_data, lag_periods=[1])
        print("SUCCESS: Feature engineering completed")
        
        # Check if we have enough data for training
        if len(features_data) > 3:  # Need at least a few rows for train/test split
            from src.models.train_model import train_model
            # Limit features to numeric for this test
            numeric_cols = features_data.select_dtypes(include=[np.number]).columns.tolist()
            cols_to_keep = ['sub_county', 'county', 'date', 'acute_malnutrition_cases'] + \
                          [col for col in numeric_cols if col not in ['sub_county', 'county']]
            limited_data = features_data[cols_to_keep].dropna()
            
            if len(limited_data) > 3:
                model, metrics = train_model(limited_data, test_size=0.3)
                print("SUCCESS: Model training completed")
                print(f"  Model MAE: {metrics.get('mae', 'N/A')}")
                print(f"  Model R²: {metrics.get('r2', 'N/A')}")
            else:
                print("! Insufficient data for model training after feature engineering")
        else:
            print("! Insufficient data for model training after cleaning")
        
        print("\nSUCCESS: Sample pipeline completed successfully\n")
        return True
        
    except Exception as e:
        print(f"FAILED: Sample pipeline failed: {e}")
        traceback.print_exc()
        return False

def run_full_debug():
    """Run all debug tests."""
    print("KENYA CHILDHOOD MALNUTRITION RISK PREDICTION SYSTEM - DEBUG SCRIPT")
    print("=" * 70)
    print(f"Run at: {datetime.now()}")
    print(f"Python executable: {sys.executable}")
    print(f"Current working directory: {os.getcwd()}")
    print()
    
    results = []
    
    results.append(("Imports", debug_imports()))
    results.append(("Dependencies", debug_dependencies()))
    results.append(("Configuration", debug_config()))
    results.append(("Paths", debug_paths()))
    results.append(("Sample Pipeline", debug_sample_pipeline()))
    
    print("=" * 70)
    print("DEBUG SUMMARY:")
    for test_name, passed in results:
        status = "PASS" if passed else "FAIL"
        print(f"  {test_name}: {status}")
    
    all_passed = all(result[1] for result in results)
    print(f"\nOverall Result: {'ALL TESTS PASSED' if all_passed else 'SOME TESTS FAILED'}")
    
    return all_passed

if __name__ == "__main__":
    run_full_debug()