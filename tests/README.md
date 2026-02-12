# Test Suite for Kenya Childhood Malnutrition Risk Prediction System

This directory contains unit and integration tests for the KAM Forecast system.

## Test Structure

The test suite is organized by module:

- `test_data_loading.py` - Tests for data loading functionality
- `test_data_cleaning.py` - Tests for data cleaning functionality  
- `test_feature_engineering.py` - Tests for feature engineering
- `test_model_training.py` - Tests for model training
- `test_configuration.py` - Tests for configuration management
- `test_utils.py` - Tests for utility functions
- `test_validation.py` - Tests for data validation
- `test_runner.py` - Test discovery and execution script

## Running Tests

### Run All Tests
```bash
python tests/test_runner.py
```

### Run Specific Test File
```bash
python tests/test_runner.py tests/test_data_loading.py
```

### Run with Python unittest directly
```bash
python -m unittest tests.test_data_loading
python -m unittest tests.test_data_cleaning
python -m unittest discover tests/
```

## Test Categories

### Unit Tests
- Test individual functions and methods in isolation
- Use mock data to verify specific behaviors
- Fast execution and comprehensive coverage

### Integration Tests
- Test interactions between multiple modules
- Verify end-to-end workflows
- Use sample data to validate system behavior

## Test Coverage

The test suite aims to cover:

1. **Data Pipeline**: Loading, cleaning, and feature engineering
2. **Model Training**: Algorithm functionality and parameter validation
3. **Configuration**: Parameter loading and validation
4. **Utilities**: File operations, model saving/loading
5. **Validation**: Data quality checks and scoring

## Writing New Tests

When adding new functionality to the system, please add corresponding tests:

1. Create a new test file following the naming convention `test_<module>.py`
2. Use appropriate test methods (unittest.TestCase)
3. Test both positive and negative cases
4. Use descriptive test method names
5. Add proper assertions to verify expected behavior

## Debugging Tests

If tests fail, check the debug directory for diagnostic scripts:

- `debug/debug_system.py` - General system diagnostics
- `debug/debug_data_quality.py` - Data-specific diagnostics

## Continuous Integration

The test suite is designed to be used with CI/CD pipelines to ensure code quality and prevent regressions.