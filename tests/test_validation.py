"""
Unit tests for the validation module.
"""
import unittest
import pandas as pd
import numpy as np
from src.validation.validate_data import run_validation


class TestValidation(unittest.TestCase):
    def test_run_validation_basic(self):
        """Test basic validation functionality."""
        # Create test data
        df = pd.DataFrame({
            'sub_county': ['A', 'A', 'A', 'B', 'B', 'B'],
            'county': ['X', 'X', 'X', 'Y', 'Y', 'Y'],
            'date': pd.date_range('2023-01-01', periods=6, freq='M'),
            'acute_malnutrition_cases': [100, 120, 110, 90, 95, 105],
            'other_indicator': [10, 20, 30, 40, 50, 60]
        })
        
        # Run validation
        validation_results = run_validation(df)
        
        # Check that results are returned as a dictionary (based on actual function behavior)
        self.assertIsNotNone(validation_results)
        self.assertIsInstance(validation_results, dict)
        self.assertIn('schema', validation_results)
        self.assertIn('dates', validation_results)
        self.assertIn('geography', validation_results)
        self.assertIn('numeric_sanity', validation_results)

    def test_run_validation_empty_dataframe(self):
        """Test validation with empty dataframe that has required columns."""
        # Create an empty dataframe with required columns and proper dtypes
        df = pd.DataFrame({
            'sub_county': pd.Series([], dtype='object'),
            'county': pd.Series([], dtype='object'),
            'date': pd.Series([], dtype='datetime64[ns]'),
            'acute_malnutrition_cases': pd.Series([], dtype='float64')
        })
        validation_results = run_validation(df)
        
        # Should return a dictionary with validation results
        self.assertIsInstance(validation_results, dict)
        self.assertIn('schema', validation_results)
        self.assertIn('dates', validation_results)
        self.assertIn('geography', validation_results)
        self.assertIn('numeric_sanity', validation_results)


if __name__ == '__main__':
    unittest.main()