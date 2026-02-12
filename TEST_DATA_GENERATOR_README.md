# Test Data Generator for Kenya Childhood Malnutrition Risk Prediction System

This script generates realistic test data for the system to enable testing and demonstration without requiring real data from WHO, UNICEF, or DHIS2.

## Overview

The `generate_test_data_simple.py` script creates synthetic but realistic data for:
- WHO nutrition indicators
- UNICEF WASH indicators  
- DHIS2 malnutrition case data
- Additional contextual data (climate, economic)

## Usage

### Generate Test Data
```bash
python generate_test_data_simple.py
```

By default, this creates:
- `data/raw/who_nutrition.csv` - WHO nutrition indicators
- `data/raw/unicef_wash.csv` - UNICEF WASH indicators
- `data/raw/dhis2_cases.csv` - DHIS2 malnutrition case data
- Additional contextual data files

### Run Full Pipeline with Test Data
```bash
python run_test_pipeline.py
```

This will:
1. Load the generated test data
2. Clean the data
3. Build features
4. Train the model
5. Generate predictions

## Data Characteristics

The generated data includes:
- 10 Kenyan counties with 5 sub-counties each
- 12 months of monthly data
- Realistic correlations between indicators
- Proper data structure matching system requirements
- Geographic identifiers (county, sub_county)
- Temporal identifiers (date)
- Target variable (acute_malnutrition_cases)

## File Structure

```
data/
└── raw/
    ├── who_nutrition.csv
    ├── unicef_wash.csv
    ├── dhis2_cases.csv
    ├── climate_data.csv
    └── economic_data.csv
```

## Parameters

You can customize the data generation by modifying:
- Number of months of data
- Number and names of counties/sub-counties
- Data ranges and distributions

## Integration with System

The generated data follows the exact schema expected by the system:
- Required columns: county, sub_county, date, and indicator variables
- Proper data types
- Consistent geographic and temporal references

## Verification

The `run_test_pipeline.py` script verifies that the generated data works with the complete system pipeline, including:
- Data loading and merging
- Data cleaning
- Feature engineering
- Model training
- Prediction generation

## Notes

- The data is synthetically generated but follows realistic patterns
- Perfect for testing, development, and demonstrations
- Does not contain any real sensitive information
- Can be used to validate system functionality