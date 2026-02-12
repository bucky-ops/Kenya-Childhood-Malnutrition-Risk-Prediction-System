"""
Unit tests for the configuration module.
"""
import unittest
from pathlib import Path
from config.config import Config, config


class TestConfiguration(unittest.TestCase):
    def test_config_initialization(self):
        """Test that configuration initializes correctly."""
        cfg = Config()
        
        # Check that paths are Path objects
        self.assertIsInstance(cfg.BASE_DIR, Path)
        self.assertIsInstance(cfg.DATA_DIR, Path)
        self.assertIsInstance(cfg.RAW_DATA_DIR, Path)
        self.assertIsInstance(cfg.PROCESSED_DATA_DIR, Path)
        self.assertIsInstance(cfg.MODELS_DIR, Path)
        self.assertIsInstance(cfg.REPORTS_DIR, Path)
        
        # Check that parameter dictionaries exist
        self.assertIsInstance(cfg.MODEL_PARAMS, dict)
        self.assertIsInstance(cfg.QUALITY_THRESHOLDS, dict)
        self.assertIsInstance(cfg.DQR_WEIGHTS, dict)
        self.assertIsInstance(cfg.SEVERITY_WEIGHTS, dict)
        self.assertIsInstance(cfg.ALERT_THRESHOLDS, dict)
        self.assertIsInstance(cfg.LAG_PERIODS, list)
        self.assertIsInstance(cfg.RECIPIENT_EMAILS, list)

    def test_config_singleton_instance(self):
        """Test that the global config instance exists."""
        self.assertIsInstance(config, Config)
        
        # Check that it has the expected attributes
        self.assertTrue(hasattr(config, 'MODEL_PARAMS'))
        self.assertTrue(hasattr(config, 'QUALITY_THRESHOLDS'))
        self.assertTrue(hasattr(config, 'DQR_WEIGHTS'))

    def test_config_directories_creation(self):
        """Test that ensure_directories method creates directories."""
        cfg = Config()
        
        # Just call the method to ensure it doesn't raise an exception
        # The actual directory creation is tested in integration
        try:
            cfg.ensure_directories()
        except Exception as e:
            self.fail(f"ensure_directories raised an exception: {e}")


if __name__ == '__main__':
    unittest.main()