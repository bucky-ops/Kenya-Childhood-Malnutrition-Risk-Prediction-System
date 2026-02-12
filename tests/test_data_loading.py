"""
Unit tests for the data loading module.
"""
import unittest
import pandas as pd
import numpy as np
import tempfile
import os
from pathlib import Path

# Add project root to path
import sys
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.data.load_data import load_and_merge_data, load_data_file
from config.config import config


class TestDataLoading(unittest.TestCase):
    def setUp(self):
        """Set up test data in temporary directory."""
        self.temp_dir = tempfile.mkdtemp()
        
        # Create sample data files
        self.raw_data_dir = Path(self.temp_dir) / "raw"
        self.raw_data_dir.mkdir(exist_ok=True)
        
        # Sample WHO nutrition data (using CSV since that's what we can easily create in tests)
        who_data = pd.DataFrame({
            'county': ['Nairobi', 'Mombasa'] * 5,
            'sub_county': ['Westlands', 'Dagoretti'] * 5,
            'date': pd.date_range('2023-01-01', periods=10, freq='M'),
            'nutrition_indicator': np.random.rand(10) * 100
        })
        # Use a CSV file instead of the Excel file from config
        who_path = self.raw_data_dir / "who_nutrition.csv"
        who_data.to_csv(who_path, index=False)
        
        # Sample UNICEF WASH data
        unicef_data = pd.DataFrame({
            'county': ['Nairobi', 'Mombasa'] * 5,
            'sub_county': ['Westlands', 'Dagoretti'] * 5,
            'date': pd.date_range('2023-01-01', periods=10, freq='M'),
            'wash_indicator': np.random.rand(10) * 50
        })
        # Use a CSV file instead of the Excel file from config
        unicef_path = self.raw_data_dir / "unicef_wash.csv"
        unicef_data.to_csv(unicef_path, index=False)
        
        # Sample DHIS2 cases data
        dhis2_data = pd.DataFrame({
            'county': ['Nairobi', 'Mombasa'] * 5,
            'sub_county': ['Westlands', 'Dagoretti'] * 5,
            'date': pd.date_range('2023-01-01', periods=10, freq='M'),
            'acute_malnutrition_cases': np.random.randint(10, 100, 10)
        })
        # Use a CSV file instead of the CSV file from config
        dhis2_path = self.raw_data_dir / "dhis2_cases.csv"
        dhis2_data.to_csv(dhis2_path, index=False)

    def test_load_data_file_csv(self):
        """Test loading a CSV data file."""
        test_file = self.raw_data_dir / "test.csv"
        test_df = pd.DataFrame({'a': [1, 2, 3], 'b': [4, 5, 6]})
        test_df.to_csv(test_file, index=False)
        
        result_df = load_data_file(test_file)
        self.assertEqual(len(result_df), 3)
        self.assertEqual(list(result_df.columns), ['a', 'b'])

    def test_load_and_merge_data(self):
        """Test loading and merging all data sources."""
        # Call load_and_merge_data with explicit file names that match our test files
        df = load_and_merge_data(
            data_dir=self.raw_data_dir,
            who_file="who_nutrition.csv",
            unicef_file="unicef_wash.csv",
            dhis2_file="dhis2_cases.csv"
        )
        self.assertIsNotNone(df)
        self.assertGreaterEqual(len(df), 10)  # At least 10 rows
        self.assertIn('acute_malnutrition_cases', df.columns)

    def tearDown(self):
        """Clean up temporary files."""
        import shutil
        shutil.rmtree(self.temp_dir)


if __name__ == '__main__':
    unittest.main()