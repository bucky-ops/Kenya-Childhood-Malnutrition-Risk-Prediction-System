# Kenya Childhood Malnutrition Risk Prediction System - File Tree

## Complete Project Structure

# File Tree: KAM-Forecast

**Root Path:** `c:\Users\Muchi\Desktop\Projects\KAM-Forecast`

```
├── 📁 app
│   ├── 🐍 app.py
│   ├── 🐍 data_quality_app.py
│   └── 🐍 executive_dashboard.py
├── 📁 config
│   ├── 🐍 __init__.py
│   └── 🐍 config.py
├── 📁 data
│   ├── 📁 processed
│   └── 📁 raw
├── 📁 debug
├── 📁 models
├── 📁 reports
│   └── 📄 system_health_report.txt
├── 📁 src
│   ├── 📁 alerts
│   │   ├── 🐍 __init__.py
│   │   └── 🐍 data_quality_alerts.py
│   ├── 📁 data
│   │   ├── 📁 raw
│   │   │   ├── 📄 Ch11-Nutrition-Figures.xlsx
│   │   │   ├── 📄 JMP_2021_INEQUALITIES_KEN_Kenya_1.xlsm
│   │   │   └── 📄 metadata-nutrition-indicators-for-kenya.csv
│   │   ├── 🐍 __init__.py
│   │   ├── 🐍 clean_data.py
│   │   └── 🐍 load_data.py
│   ├── 📁 dqr
│   │   ├── 🐍 __init__.py
│   │   └── 🐍 dqr_mapping.py
│   ├── 📁 features
│   │   ├── 🐍 __init__.py
│   │   └── 🐍 build_features.py
│   ├── 📁 governance
│   │   └── 🐍 dpg_packaging.py
│   ├── 📁 models
│   │   ├── 🐍 __init__.py
│   │   ├── 🐍 predict.py
│   │   ├── 🐍 train_model.py
│   │   └── 🐍 train_model_weighted.py
│   ├── 📁 reporting
│   │   ├── 🐍 generate_donor_deck.py
│   │   └── 🐍 generate_pdf_report.py
│   ├── 📁 scenarios
│   │   └── 🐍 simulate_scenarios.py
│   ├── 📁 scoring
│   │   ├── 🐍 __init__.py
│   │   └── 🐍 compute_scores.py
│   ├── 📁 system
│   │   └── 🐍 system_health_check.py
│   ├── 📁 uncertainty
│   │   └── 🐍 compute_uncertainty.py
│   ├── 📁 utils
│   │   ├── 🐍 __init__.py
│   │   ├── 🐍 file_utils.py
│   │   ├── 🐍 logging_config.py
│   │   └── 🐍 model_utils.py
│   ├── 📁 validation
│   │   ├── 🐍 __init__.py
│   │   └── 🐍 validate_data.py
│   └── 🐍 __init__.py
├── 📁 tests
│   └── 📝 README.md
├── 📝 File-Tree.md
├── 📝 IMPLEMENTATION_SUMMARY.md
├── 📝 PROJECT_REVIEW.md
├── 📝 QUICK_START.md
├── 📝 README.md
├── 📝 RUNNING_LOCALLY.md
├── 📝 SYSTEM_WORKFLOW.md
└── 📄 requirements.txt
```

---

## Directory Descriptions

### Root Directory
- **IMPLEMENTATION_SUMMARY.md**: Summary of all improvements implemented based on project review recommendations
- **PROJECT_REVIEW.md**: Original project review with suggested improvements
- **QUICK_START.md**: Quick setup and usage guide
- **README.md**: Main project documentation
- **RUNNING_LOCALLY.md**: Detailed instructions for running the system locally
- **SYSTEM_WORKFLOW.md**: Complete system workflow and usage instructions
- **requirements.txt**: Python dependencies
- **File-Tree.md**: This file - complete project structure documentation

### Application Directory (`app/`)
Contains Streamlit dashboard applications:
- **app.py**: Main prediction dashboard
- **data_quality_app.py**: Data quality review dashboard
- **executive_dashboard.py**: Executive national dashboard with scenarios

### Configuration Directory (`config/`)
Centralized configuration management:
- **config.py**: Main configuration class with all system parameters
- **__init__.py**: Package initialization

### Data Directory (`data/`)
Data storage organized by processing stage:
- **raw/**: Input data files (WHO, UNICEF, DHIS2)
- **processed/**: Processed and feature-engineered data

### Debug Directory (`debug/`)
Placeholder for debugging utilities and logs

### Models Directory (`models/`)
Storage for trained machine learning models

### Reports Directory (`reports/`)
Generated PDF reports and presentations

### Source Directory (`src/`)
Main source code organized by functionality:

#### Alerts Module (`src/alerts/`)
- **data_quality_alerts.py**: Email alert system for data quality issues

#### Data Module (`src/data/`)
- **load_data.py**: Data loading and merging from multiple sources
- **clean_data.py**: Data cleaning and imputation

#### DQR Module (`src/dqr/`)
- **dqr_mapping.py**: WHO Data Quality Review dimension mapping

#### Features Module (`src/features/`)
- **build_features.py**: Feature engineering with lag features and seasonal components

#### Governance Module (`src/governance/`)
- **dpg_packaging.py**: Digital Public Good compliance packaging

#### Models Module (`src/models/`)
- **train_model.py**: Model training with time-based splitting
- **predict.py**: Prediction generation
- **train_model_weighted.py**: Quality-weighted model training

#### Reporting Module (`src/reporting/`)
- **generate_pdf_report.py**: Comprehensive PDF report generation
- **generate_donor_deck.py**: Donor presentation generation

#### Scenarios Module (`src/scenarios/`)
- **simulate_scenarios.py**: Policy scenario simulation

#### Scoring Module (`src/scoring/`)
- **compute_scores.py**: Data quality scoring using WHO DQR standards

#### System Module (`src/system/`)
- **system_health_check.py**: System integrity verification

#### Uncertainty Module (`src/uncertainty/`)
- **compute_uncertainty.py**: Prediction uncertainty quantification

#### Utils Module (`src/utils/`)
- **logging_config.py**: Centralized logging configuration
- **file_utils.py**: File operations with error handling
- **model_utils.py**: Model save/load with versioning

#### Validation Module (`src/validation/`)
- **validate_data.py**: Data validation against WHO DQR standards

### Tests Directory (`tests/`)
Placeholder for unit and integration tests

### Virtual Environment (`venv/`)
Python virtual environment

## Key System Components

### Core Pipeline Components
1. **Data Loading**: `src/data/load_data.py`
2. **Data Cleaning**: `src/data/clean_data.py`
3. **Feature Engineering**: `src/features/build_features.py`
4. **Model Training**: `src/models/train_model.py`
5. **Prediction**: `src/models/predict.py`
6. **Validation**: `src/validation/validate_data.py`
7. **Scoring**: `src/scoring/compute_scores.py`
8. **Reporting**: `src/reporting/generate_pdf_report.py`

### Configuration Management
- **Centralized**: `config/config.py`
- **Paths**: All file paths managed centrally
- **Parameters**: Model params, thresholds, weights all configurable

### Dashboards
- **Main**: `app/app.py` - County-level predictions
- **Executive**: `app/executive_dashboard.py` - National overview
- **Quality**: `app/data_quality_app.py` - Data quality review

### Utilities
- **Logging**: `src/utils/logging_config.py`
- **File Ops**: `src/utils/file_utils.py`
- **Model Ops**: `src/utils/model_utils.py`

## Dependencies
- **requirements.txt**: Contains all required packages
- **Key Packages**: pandas, numpy, scikit-learn, matplotlib, seaborn, streamlit, reportlab, python-pptx

## File Naming Conventions
- Python files use snake_case
- Configuration uses PascalCase for classes
- Constants in config.py are UPPER_CASE
- All modules have `__init__.py` for proper package structure

## Architecture Patterns
- **Modular Design**: Each functionality in separate module
- **Dependency Injection**: Configuration injected via config module
- **Error Handling**: Comprehensive try-catch throughout
- **Logging**: Structured logging instead of print statements
- **Caching**: Streamlit caching for performance
- **Versioning**: Model and data versioning