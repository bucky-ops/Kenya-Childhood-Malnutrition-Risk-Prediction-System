# 📊 Kenya Childhood Malnutrition Risk Prediction System

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.9%2B-blue.svg)](https://www.python.org/)
[![GitHub Actions CI](https://github.com/your-org/your-repo/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/your-repo/actions)
[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)

> An open-source Digital Public Good for predicting acute childhood malnutrition risk in Kenya using machine learning and WHO Data Quality Review standards.

## Table of Contents
- [Features](#features)  
- [Quick-Start](#quick-start)  
- [Installation](#installation)  
- [Usage](#usage)  
- [Development](#development)  
- [Contributing](#contributing)  
- [License](#license)

## Features
- Machine Learning Predictions using Random Forest model trained on WHO and UNICEF indicators
- Data Quality Monitoring with WHO DQR-compliant validation and automated scoring
- Quality-Weighted Training that prioritizes high-quality data sources
- Automated Reporting with monthly PDF reports for stakeholders
- Alert System for email notifications about data quality deterioration
- Interactive Dashboards with Streamlit apps for data exploration and quality review
- Scenario Analysis for policy impact simulations
- Uncertainty Quantification for confidence intervals in predictions

## Quick-Start
```bash
# clone & cd
git clone https://github.com/your-org/your-repo.git
cd your-repo

# create a virtual environment
python -m venv .venv && source .venv/bin/activate

# install the package and dev tools
pip install -e .[dev]

# run the main app
python -m your_pkg.app.app   # or any other entry-point

# run the complete pipeline with test data
python system_launcher.py --pipeline
```

## Installation
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Install as editable package (optional)
pip install -e .
```

## Usage
The system consists of several interconnected modules:

### 1. Data Pipeline
- `src.data.load_data`: Load and merge data from WHO, UNICEF, and DHIS2 sources
- `src.data.clean_data`: Clean missing values and impute data
- `src.features.build_features`: Engineer features with lagged indicators and seasonal components

### 2. Model Training
- `src.models.train_model`: Train Random Forest model with time-based splitting
- `src.models.predict`: Generate predictions with uncertainty bands

### 3. Validation & Scoring
- `src.validation.validate_data`: Validate data quality against WHO DQR standards
- `src.scoring.compute_scores`: Compute county-level data quality scores

### 4. Dashboards
- `app/app.py`: Main prediction dashboard
- `app/executive_dashboard.py`: Executive national dashboard with scenarios
- `app/data_quality_app.py`: Data quality review dashboard

### 5. Reporting
- `src.reporting.generate_pdf_report`: Generate comprehensive PDF reports
- `src.reporting.generate_donor_deck`: Generate donor presentation decks

## Development
```bash
# Install development dependencies
pip install -e .[dev]

# Run tests
pytest

# Run linting
ruff check .

# Format code
black .

# Run type checking
mypy .
```

## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Built for humanitarian impact through ethical AI and open data.*