# Kenya Childhood Malnutrition Risk Prediction System

An open-source Digital Public Good for predicting acute childhood malnutrition risk in Kenya using machine learning and WHO Data Quality Review standards.

## 🌍 Overview

This system provides county and sub-county level predictions of acute childhood malnutrition cases one month ahead, incorporating rigorous data quality monitoring and automated governance features. Designed for use by UNICEF, USAID, NGOs, and government health ministries.

**⚠️ Important Disclaimer:** This tool is for programmatic decision support only. Not for clinical diagnosis or individual health assessments.

## ✨ Key Features

- **Machine Learning Predictions**: Random Forest model trained on WHO and UNICEF indicators
- **Data Quality Monitoring**: WHO DQR-compliant validation with automated scoring
- **Quality-Weighted Training**: Models prioritize high-quality data sources
- **Automated Reporting**: Monthly PDF reports for stakeholders
- **Alert System**: Email notifications for data quality deterioration
- **Interactive Dashboards**: Streamlit apps for data exploration and quality review
- **Scenario Analysis**: Policy impact simulations
- **Uncertainty Quantification**: Confidence intervals for predictions

## 📋 Prerequisites

- **Python 3.10+**: Ensure Python is installed and accessible from command line
- **Git**: For cloning the repository (optional if you have the code)
- **At least 4GB RAM**: Recommended for model training and data processing
- **Data Files**: Raw CSV data files must be placed in `data/raw/`

## 🚀 Quick Installation

### 1. Clone or Download the Project
```bash
git clone https://github.com/your-org/kam-forecast.git
cd kam-forecast
```

### 2. System Launcher (NEW!)
The system includes a launcher that can run the complete pipeline:

```bash
# Run the complete system pipeline with test data
python system_launcher.py --pipeline

# Launch the Streamlit dashboards
python system_launcher.py --dashboards

# Run pipeline and launch dashboards
python system_launcher.py --all

# Show help
python system_launcher.py
```

### 2. Set Up Virtual Environment
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Place Raw Data Files
Place the following CSV files in the `data/raw/` directory:
- `who_nutrition.csv` - WHO child nutrition indicators
- `unicef_wash.csv` - UNICEF WASH & nutrition indicators
- `dhis2_cases.csv` - DHIS2 malnutrition case data

**Note**: If you don't have real data, the system will still run but with limited functionality.

## ⚙️ Complete System Pipeline

Execute the scripts in order to build the full system:

### 1. Data Processing
```bash
# Load and merge data from all sources
python src/data/load_data.py

# Clean missing values
python src/data/clean_data.py

# Engineer features (lags, seasonal)
python src/features/build_features.py
```

### 2. Model Training
```bash
# Train Random Forest model with quality weighting
python src/models/train_model.py
```

### 3. Generate Predictions
```bash
# Make predictions with uncertainty bands
python src/models/predict.py
python src/uncertainty/compute_uncertainty.py
```

### 4. Quality Assurance
```bash
# Validate data quality
python src/validation/validate_data.py
python src/scoring/compute_scores.py
python src/reporting/generate_pdf_report.py

# Run data quality alerts
python src/alerts/data_quality_alerts.py
```

### 5. Scenario Analysis
```bash
# Generate policy scenarios
python src/scenarios/simulate_scenarios.py
```

### 6. System Health Check
```bash
# Validate system integrity
python src/system/system_health_check.py
```

## 🖥️ Dashboard Applications

### Main Prediction Dashboard
```bash
streamlit run app/app.py
```
- County-level malnutrition case predictions
- Interactive visualization of actual vs predicted cases
- Summary statistics and MAE metric

### Executive Dashboard
```bash
streamlit run app/executive_dashboard.py
```
- National overview for decision-makers
- Scenario planning capabilities
- County risk ranking and insights

### Data Quality Dashboard
```bash
streamlit run app/data_quality_app.py
```
- DHIS2-style data quality review
- Issue tracking and filtering
- Quality trend visualizations

## 📊 Understanding the Output

After running the pipeline, you'll find:

- **Models**: `models/random_forest_model.pkl` (with metadata)
- **Predictions**: `data/processed/predictions.csv`
- **Predictions with Uncertainty**: `data/processed/predictions_with_uncertainty.csv`
- **Quality Scores**: `data/processed/county_data_quality_scores.csv`
- **Scenarios**: `data/processed/scenario_simulations.csv`
- **Validation Report**: `data/processed/validation_report.csv`
- **Reports**: `reports/` directory with PDFs and PowerPoint
- **Health Check**: `reports/system_health_report.txt`

## ⚙️ Configuration Management

All system parameters are centralized in `config/config.py`. You can customize:

- File paths and directory structure
- Model hyperparameters (n_estimators, random_state, etc.)
- Data quality thresholds
- DQR dimension weights
- Alert thresholds
- Feature engineering parameters

Example usage:
```python
from config.config import config

# Access configuration
data_dir = config.RAW_DATA_DIR
model_params = config.MODEL_PARAMS
thresholds = config.QUALITY_THRESHOLDS

# Modify parameters
config.MODEL_PARAMS['n_estimators'] = 200
```

## 🛡️ Ethical Safeguards

- **No Clinical Use**: Explicit disclaimers on all outputs
- **Privacy Protection**: No personal identifiable information
- **Bias Mitigation**: Quality-weighted training reduces poor data influence
- **Transparency**: Open-source code and methodology
- **Accountability**: Automated monitoring and alerts

## 🏗️ Project Structure

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
└── requirements.txt  # Dependencies
```

## 🤝 Contributing

We welcome contributions to improve the system:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the existing style and includes appropriate tests.

## 📄 License

Apache License 2.0 - see [LICENSE](LICENSE)

## 👥 Partners

Developed with support from:
- UNICEF
- USAID
- Kenya Ministry of Health
- Digital Public Good Alliance

## 📞 Contact

For technical support or reuse inquiries:
- Email: support@malnutrition-project.org
- Issues: GitHub repository

---

*Built for humanitarian impact through ethical AI and open data.*

*This system is compliant with Digital Public Good Alliance standards.*