"""
Unit tests for the model training module.
"""
import unittest
import pandas as pd
import numpy as np
from src.models.train_model import train_model


class TestModelTraining(unittest.TestCase):
    def test_train_model_basic(self):
        """Test basic model training functionality."""
        # Create test data with sufficient features
        df = pd.DataFrame({
            'sub_county': ['A', 'A', 'A', 'B', 'B', 'B'] * 5,
            'county': ['X', 'X', 'X', 'Y', 'Y', 'Y'] * 5,
            'date': pd.date_range('2023-01-01', periods=30, freq='M'),
            'feature1': np.random.rand(30),
            'feature2': np.random.rand(30) * 100,
            'acute_malnutrition_cases': np.random.randint(50, 150, 30)
        })
        
        # Sort by sub_county and date to ensure proper ordering for lagging
        df = df.sort_values(['sub_county', 'date']).reset_index(drop=True)
        
        # Add some lag features to ensure we have features to train on
        df['feature1_lag_1'] = df.groupby('sub_county')['feature1'].shift(1)
        df['feature2_lag_1'] = df.groupby('sub_county')['feature2'].shift(1)
        
        # Drop rows with NaN from lagging
        df = df.dropna()
        
        if len(df) > 5:  # Ensure we have enough data after dropping NaN
            model, metrics = train_model(df, test_size=0.3)
            
            # Check that model and metrics are returned
            self.assertIsNotNone(model)
            self.assertIsInstance(metrics, dict)
            self.assertIn('mae', metrics)
            self.assertIn('r2', metrics)

    def test_train_model_empty_dataframe(self):
        """Test model training with empty dataframe raises error."""
        df = pd.DataFrame()
        with self.assertRaises(ValueError):
            train_model(df)

    def test_train_model_missing_date_column(self):
        """Test model training with missing date column raises error."""
        df = pd.DataFrame({
            'sub_county': ['A', 'B'],
            'county': ['X', 'Y'],
            'feature1': [1, 2],
            'acute_malnutrition_cases': [100, 120]
        })
        with self.assertRaises(ValueError):
            train_model(df)


if __name__ == '__main__':
    unittest.main()