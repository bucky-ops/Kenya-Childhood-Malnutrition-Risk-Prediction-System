"""
Unit tests for the utility functions.
"""
import unittest
import pandas as pd
import numpy as np
import tempfile
import os
from pathlib import Path
from src.utils.file_utils import ensure_directory, save_dataframe, load_dataframe
from src.utils.model_utils import save_model, load_model
from sklearn.ensemble import RandomForestRegressor


class TestUtils(unittest.TestCase):
    def test_ensure_directory(self):
        """Test that ensure_directory creates directories properly."""
        with tempfile.TemporaryDirectory() as temp_dir:
            test_path = Path(temp_dir) / "test_dir"
            result = ensure_directory(test_path)
            
            self.assertEqual(result, test_path)
            self.assertTrue(test_path.exists())

    def test_save_and_load_dataframe(self):
        """Test saving and loading dataframes."""
        with tempfile.TemporaryDirectory() as temp_dir:
            test_path = Path(temp_dir) / "test.csv"
            original_df = pd.DataFrame({
                'a': [1, 2, 3],
                'b': [4, 5, 6]
            })
            
            # Save dataframe
            saved_path = save_dataframe(original_df, test_path)
            self.assertEqual(saved_path, test_path)
            
            # Load dataframe
            loaded_df = load_dataframe(test_path)
            pd.testing.assert_frame_equal(original_df, loaded_df)

    def test_save_and_load_model(self):
        """Test saving and loading models."""
        with tempfile.TemporaryDirectory() as temp_dir:
            test_path = Path(temp_dir) / "test_model.pkl"
            
            # Create a simple model
            model = RandomForestRegressor(n_estimators=2, random_state=42)
            X = np.array([[1, 2], [3, 4]])
            y = np.array([1, 2])
            model.fit(X, y)
            
            # Save model
            metadata = {'test': 'value', 'accuracy': 0.95}
            saved_path = save_model(model, test_path, metadata=metadata)
            self.assertEqual(saved_path, test_path)
            
            # Load model
            loaded_data = load_model(test_path)
            self.assertIsNotNone(loaded_data)
            self.assertIn('model', loaded_data)
            self.assertIn('metadata', loaded_data)
            self.assertEqual(loaded_data['metadata']['test'], 'value')


if __name__ == '__main__':
    unittest.main()