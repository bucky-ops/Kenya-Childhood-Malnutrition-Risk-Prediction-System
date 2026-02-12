# Test and Debug System for Kenya Childhood Malnutrition Risk Prediction System

## Overview

This directory contains the complete test and debug infrastructure for the KAM Forecast system.

## Directory Structure

```
tests/
├── README.md                    # Test suite documentation
├── test_runner.py              # Test discovery and execution script
├── test_configuration.py       # Configuration module tests
├── test_data_cleaning.py       # Data cleaning module tests
├── test_data_loading.py        # Data loading module tests
├── test_feature_engineering.py # Feature engineering module tests
├── test_model_training.py      # Model training module tests
├── test_utils.py               # Utility functions tests
└── test_validation.py          # Data validation module tests

debug/
├── README.md                  # Debug scripts documentation
├── debug_system.py            # General system diagnostics
└── debug_data_quality.py      # Data-specific diagnostics
```

## Test Suite

The test suite includes comprehensive unit tests for all major components:

- **Configuration**: Tests for configuration loading and parameter validation
- **Data Loading**: Tests for loading and merging data from multiple sources
- **Data Cleaning**: Tests for data cleaning and imputation
- **Feature Engineering**: Tests for feature creation and transformation
- **Model Training**: Tests for model training and evaluation
- **Utilities**: Tests for file operations and model handling
- **Validation**: Tests for data validation processes

## Running Tests

### All Tests
```bash
python -m unittest discover tests/
```

### Specific Test Module
```bash
python -m unittest tests.test_model_training
```

### With Verbose Output
```bash
python -m unittest discover tests/ -v
```

### Using Test Runner
```bash
python tests/test_runner.py
```

## Debug Scripts

### System Debug
```bash
python debug/debug_system.py
```
Checks:
- Module imports
- Dependencies
- Configuration
- Directory structure
- Sample pipeline execution

### Data Quality Debug
```bash
python debug/debug_data_quality.py
```
Checks:
- Data validation process
- Data loading and merging
- Sample data creation

## Coverage

The test suite covers:
- Core functionality of each module
- Error handling and edge cases
- Integration between components
- Configuration validation
- Data processing pipeline

## Maintenance

When adding new functionality:
1. Add corresponding unit tests
2. Update test documentation if needed
3. Run all tests to ensure no regressions
4. Use debug scripts to verify functionality

## Status

All tests are currently passing, confirming the system is functioning correctly.