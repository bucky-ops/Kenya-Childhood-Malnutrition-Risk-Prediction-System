# Kenya Childhood Malnutrition Risk Prediction System - Complete Workflow

## System Overview

The Kenya Childhood Malnutrition Risk Prediction System is an open-source Digital Public Good that provides county and sub-county level predictions of acute childhood malnutrition cases one month ahead. The system incorporates rigorous data quality monitoring and automated governance features, designed for use by UNICEF, USAID, NGOs, and government health ministries.

**Important**: This tool is for programmatic decision support only. Not for clinical diagnosis or individual health assessments.

## System Architecture

```
├── src/
│   ├── data/          # Data loading and cleaning
│   ├── features/      # Feature engineering
│   ├── models/        # ML training and prediction
│   ├── validation/    # Data quality checks
│   ├── dqr/          # WHO DQR mapping
│   ├── scoring/      # Quality scoring
│   ├── reporting/    # PDF generation
│   ├── alerts/       # Alert system
│   ├── uncertainty/  # Uncertainty quantification
│   ├── scenarios/    # Scenario simulation
│   ├── system/       # System health checks
│   ├── governance/   # DPG packaging
│   └── utils/        # Utility functions
├── app/              # Streamlit dashboards
├── config/           # Configuration
├── data/
│   ├── raw/          # Input data
│   └── processed/    # Generated outputs
├── models/           # Saved ML models
├── reports/          # PDF reports
├── venv/             # Virtual environment
└── requirements.txt  # Dependencies
```

## Complete System Workflow

### 1. Data Preparation Phase

#### 1.1. Setup Environment
```bash
# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt
```

#### 1.2. Prepare Input Data
Place the following files in `data/raw/` directory:
- `who_nutrition.csv` - WHO child nutrition indicators
- `unicef_wash.csv` - UNICEF WASH & nutrition indicators  
- `dhis2_cases.csv` - DHIS2 malnutrition case data

Each file should contain columns: `county`, `sub_county`, `date`, and indicator-specific columns.

### 2. Data Processing Pipeline

#### 2.1. Load and Merge Data
```python
from src.data.load_data import load_and_merge_data
from src.utils.logging_config import setup_logging

setup_logging()
df = load_and_merge_data()
```

This step:
- Loads data from all three sources
- Performs outer joins on `county`, `sub_county`, and `date`
- Handles both CSV and Excel formats
- Creates a unified dataset

#### 2.2. Clean Data
```python
from src.data.clean_data import clean_data

clean_df = clean_data(df)
```

This step:
- Applies forward-fill within each sub-county group to preserve time series integrity
- Uses median imputation for remaining missing values
- Removes rows where target variable is missing

#### 2.3. Feature Engineering
```python
from src.features.build_features import build_features

feature_df = build_features(clean_df, save_features=True)
```

This step:
- Creates seasonal features (month, year)
- Generates lag features for all indicators (configurable periods)
- Creates autoregressive features from target variable
- Drops rows with NaN from lagging (requires historical data)

### 3. Model Training Phase

#### 3.1. Train Model
```python
from src.models.train_model import train_model

model, metrics = train_model(feature_df)
```

This step:
- Uses time-based splitting (not random) for time series data
- Trains a Random Forest Regressor with configurable parameters
- Evaluates model on test set (MAE, RMSE, R²)
- Saves model with metadata and versioning

### 4. Prediction Generation Phase

#### 4.1. Generate Predictions
```python
from src.models.predict import make_predictions

predictions_df = make_predictions(feature_df)
```

This step:
- Loads the trained model
- Makes predictions on the feature dataset
- Ensures non-negative predictions
- Saves results to `data/processed/predictions.csv`

#### 4.2. Compute Uncertainty
```python
from src.uncertainty.compute_uncertainty import compute_prediction_uncertainty

uncertainty_df = compute_prediction_uncertainty(predictions_df)
```

This step:
- Calculates prediction intervals using ensemble methods
- Adds confidence bounds to predictions
- Saves results with uncertainty estimates

### 5. Data Quality Assessment Phase

#### 5.1. Run Validation
```python
from src.validation.validate_data import run_validation

validation_results = run_validation(predictions_df)
```

This step:
- Checks for data completeness, timeliness, consistency
- Identifies outliers and anomalies
- Generates validation report

#### 5.2. Compute Quality Scores
```python
from src.scoring.compute_scores import compute_data_quality_scores

scores_df = compute_data_quality_scores(validation_results)
```

This step:
- Calculates WHO DQR-compliant quality scores
- Uses weighted scoring across dimensions
- Generates county-level monthly scores

### 6. Scenario Simulation Phase

#### 6.1. Run Scenario Analysis
```python
from src.scenarios.simulate_scenarios import simulate_policy_scenarios

scenarios_df = simulate_policy_scenarios(predictions_df, scores_df)
```

This step:
- Simulates different intervention scenarios
- Adjusts predictions based on policy assumptions
- Generates scenario comparison reports

### 7. Reporting Phase

#### 7.1. Generate PDF Reports
```python
from src.reporting.generate_pdf_report import generate_comprehensive_report

generate_comprehensive_report(predictions_df, scores_df, validation_results)
```

This step:
- Creates comprehensive PDF reports
- Includes visualizations and key metrics
- Summarizes data quality and predictions

#### 7.2. Generate Donor Deck
```python
from src.reporting.generate_donor_deck import generate_donor_presentation

generate_donor_presentation(predictions_df, scores_df)
```

This step:
- Creates PowerPoint presentation for donors
- Highlights key findings and impact
- Includes visualizations and recommendations

### 8. Alert System

#### 8.1. Run Data Quality Alerts
```python
from src.alerts.data_quality_alerts import run_alerts

run_alerts(scores_df)
```

This step:
- Checks for data quality deterioration
- Sends email alerts to stakeholders
- Flags high-risk areas for attention

### 9. System Health Check

#### 9.1. Run Health Check
```python
from src.system.system_health_check import generate_health_report

generate_health_report()
```

This step:
- Verifies all directories exist
- Checks dependencies are installed
- Validates data file readiness
- Tests pipeline module imports

## Dashboard Applications

### 1. Main Prediction Dashboard
```bash
streamlit run app/app.py
```
- County-level malnutrition case predictions
- Interactive visualization of actual vs predicted cases
- Summary statistics and MAE metric

### 2. Executive Dashboard
```bash
streamlit run app/executive_dashboard.py
```
- National overview for decision-makers
- Scenario planning capabilities
- County risk ranking and insights

### 3. Data Quality Dashboard
```bash
streamlit run app/data_quality_app.py
```
- DHIS2-style data quality review
- Issue tracking and filtering
- Quality trend visualizations

## Configuration Management

All system parameters are centralized in `config/config.py`:

```python
from config.config import config

# Access paths
print(config.RAW_DATA_DIR)
print(config.MODELS_DIR)

# Access model parameters
print(config.MODEL_PARAMS)

# Access quality thresholds
print(config.QUALITY_THRESHOLDS)

# Access DQR weights
print(config.DQR_WEIGHTS)
```

## Logging System

The system uses structured logging throughout:

```python
from src.utils.logging_config import get_logger

logger = get_logger(__name__)
logger.info("Processing completed successfully")
logger.warning("Potential issue detected")
logger.error("Error occurred during processing")
```

## Error Handling

All modules include comprehensive error handling:
- Input validation at function boundaries
- Meaningful error messages
- Proper exception propagation
- Graceful degradation when possible

## Model Versioning

Models are saved with metadata:
- Timestamp of creation
- Training parameters
- Performance metrics
- Feature list
- Both versioned and latest copies maintained

## Data Quality Framework

Based on WHO DQR standards:
1. **Completeness**: Missing data and reporting gaps
2. **Timeliness**: Date and reporting period issues
3. **Internal Consistency**: Logical relationships
4. **External Consistency**: Plausibility checks
5. **Accuracy & Integrity**: Structure and uniqueness

Scores range from 0-100, with 100 indicating perfect quality.

## Ethical Safeguards

- Explicit disclaimers on all outputs
- No personal identifiable information
- Quality-weighted training reduces poor data influence
- Transparency in methodology
- Accountability through monitoring

## Digital Public Good Compliance

- Open source under Apache 2.0 license
- No proprietary dependencies
- Serves public purpose (humanitarian health response)
- Designed to do no harm
- Transparent governance process