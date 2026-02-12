# Debug Scripts for Kenya Childhood Malnutrition Risk Prediction System

This directory contains diagnostic scripts to help troubleshoot issues with the system.

## Available Debug Scripts

### `debug_system.py`
Comprehensive system diagnostics that tests:
- Module imports
- Dependency availability
- Configuration loading
- Directory structure
- Sample pipeline execution

Run with: `python debug/debug_system.py`

### `debug_data_quality.py`
Data-specific diagnostics that tests:
- Data quality validation process
- Data loading and merging
- Sample data creation
- Issue detection

Run with: `python debug/debug_data_quality.py`

## Using Debug Scripts

### General Diagnostics
```bash
python debug/debug_system.py
```

### Data-Specific Diagnostics
```bash
python debug/debug_data_quality.py
```

## Interpreting Results

Debug scripts provide detailed output about the system's health:
- ✓ indicates successful operations
- ✗ indicates failed operations
- ! indicates warnings or non-critical issues

## Common Issues Addressed

The debug scripts help identify:
- Missing dependencies
- Incorrect configuration
- Missing directories
- Data loading problems
- Module import errors
- Pipeline execution issues

## Adding New Debug Scripts

To add a new debug script:
1. Create a new Python file in the debug directory
2. Follow the pattern of existing scripts
3. Include comprehensive error handling
4. Provide clear output for diagnostics