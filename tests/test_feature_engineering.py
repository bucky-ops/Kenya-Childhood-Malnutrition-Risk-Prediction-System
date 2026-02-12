"""
Unit tests for the feature engineering module.
"""
import unittest
import pandas as pd
import numpy as np
from src.features.build_features import build_features


class TestFeatureEngineering(unittest.TestCase):
    def test_build_features_basic(self):
        """Test basic feature engineering functionality."""
        # Create test data
        df = pd.DataFrame({
            'sub_county': ['A', 'A', 'A', 'B', 'B', 'B'],
            'county': ['X', 'X', 'X', 'Y', 'Y', 'Y'],
            'date': pd.date_range('2023-01-01', periods=6, freq='M'),
            'feature1': [1, 2, 3, 4, 5, 6],
            'feature2': [10, 20, 30, 40, 50, 60],
            'acute_malnutrition_cases': [100, 120, 110, 90, 95, 105]
        })
        
        feature_df = build_features(df, lag_periods=[1, 2])
        
        # Check that new features were created
        expected_cols = ['month', 'year']
        for col in expected_cols:
            self.assertIn(col, feature_df.columns)
        
        # Check that lag features were created for the target
        for lag in [1, 2]:
            self.assertIn(f'acute_malnutrition_cases_lag_{lag}', feature_df.columns)

    def test_build_features_empty_dataframe(self):
        """Test feature building with empty dataframe raises error."""
        df = pd.DataFrame()
        with self.assertRaises(ValueError):
            build_features(df)

    def test_build_features_missing_date_column(self):
        """Test feature building with missing date column raises error."""
        df = pd.DataFrame({
            'sub_county': ['A', 'B'],
            'county': ['X', 'Y'],
            'feature1': [1, 2],
            'acute_malnutrition_cases': [100, 120]
        })
        with self.assertRaises(ValueError):
            build_features(df)


if __name__ == '__main__':
    unittest.main()