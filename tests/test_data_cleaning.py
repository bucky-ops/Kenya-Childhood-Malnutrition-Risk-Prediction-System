"""
Unit tests for the data cleaning module.
"""
import unittest
import pandas as pd
import numpy as np
from src.data.clean_data import clean_data


class TestDataCleaning(unittest.TestCase):
    def test_clean_data_basic(self):
        """Test basic data cleaning functionality."""
        # Create test data with some missing values
        df = pd.DataFrame({
            'sub_county': ['A', 'A', 'A', 'B', 'B', 'B'],
            'county': ['X', 'X', 'X', 'Y', 'Y', 'Y'],
            'date': pd.date_range('2023-01-01', periods=6, freq='M'),
            'feature1': [1, np.nan, 3, 4, np.nan, 6],
            'feature2': [10, 20, np.nan, 40, 50, np.nan],
            'acute_malnutrition_cases': [100, 120, 110, 90, 95, 105]
        })
        
        cleaned_df = clean_data(df)
        
        # Check that target column has no missing values
        self.assertFalse(cleaned_df['acute_malnutrition_cases'].isna().any())
        
        # Check that result is not empty
        self.assertGreaterEqual(len(cleaned_df), 0)

    def test_clean_data_empty_dataframe(self):
        """Test cleaning with empty dataframe raises error."""
        df = pd.DataFrame()
        with self.assertRaises(ValueError):
            clean_data(df)

    def test_clean_data_missing_target_column(self):
        """Test cleaning with missing target column raises error."""
        df = pd.DataFrame({
            'sub_county': ['A', 'B'],
            'county': ['X', 'Y'],
            'date': pd.date_range('2023-01-01', periods=2, freq='M'),
            'feature1': [1, 2]
        })
        with self.assertRaises(ValueError):
            clean_data(df)


if __name__ == '__main__':
    unittest.main()