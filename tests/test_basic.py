"""
Basic tests for the Kenya Childhood Malnutrition Risk Prediction System.
"""
import pytest
import sys
from pathlib import Path

# Add project root to path for imports
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

def test_package_imports():
    """Test that core modules can be imported."""
    try:
        from src.data.load_data import load_and_merge_data
        from src.data.clean_data import clean_data
        from src.features.build_features import build_features
        from src.models.train_model import train_model
        from src.models.predict import make_predictions
        from src.validation.validate_data import run_validation
        from src.scoring.compute_scores import compute_data_quality_scores
        from config.config import config
        
        assert callable(load_and_merge_data)
        assert callable(clean_data)
        assert callable(build_features)
        assert callable(train_model)
        assert callable(make_predictions)
        assert callable(run_validation)
        assert callable(compute_data_quality_scores)
        assert hasattr(config, 'BASE_DIR')
        
    except ImportError as e:
        pytest.fail(f"Failed to import core modules: {e}")

def test_config_available():
    """Test that configuration is available."""
    from config.config import config
    
    assert hasattr(config, 'DATA_DIR')
    assert hasattr(config, 'MODELS_DIR')
    assert hasattr(config, 'REPORTS_DIR')
    assert hasattr(config, 'MODEL_PARAMS')

if __name__ == "__main__":
    test_package_imports()
    test_config_available()
    print("All basic tests passed!")