# Running the Kenya Childhood Malnutrition Risk Prediction System Locally

This guide provides step-by-step instructions for setting up and running the malnutrition prediction system on your local machine.

## Prerequisites

- **Python 3.10+**: Ensure Python is installed and accessible from command line
- **Git**: For cloning the repository (optional if you have the code)
- **At least 4GB RAM**: Recommended for model training and data processing
- **Data Files**: Raw CSV data files must be placed in `data/raw/`

## Quick Setup

### 1. Clone or Download the Project
```bash
git clone https://github.com/your-org/kam-forecast.git
cd kam-forecast
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

## Running the Complete Pipeline

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
python src/models/train_model_weighted.py
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

## Running Individual Components

### Web Dashboards
```bash
# County-level analysis dashboard
streamlit run app/app.py

# Executive national dashboard with scenarios
streamlit run app/executive_dashboard.py

# Data quality review dashboard
streamlit run app/data_quality_app.py
```

### Automated Reports
```bash
# Generate donor pitch deck
python src/reporting/generate_donor_deck.py

# Generate all monthly PDF reports
python src/reporting/generate_pdf_report.py
```

## Understanding the Output

After running the pipeline, you'll find:

- **Models**: `models/random_forest_weighted_model.pkl`
- **Predictions**: `data/processed/predictions_with_uncertainty.csv`
- **Quality Scores**: `data/processed/county_data_quality_scores.csv`
- **Scenarios**: `data/processed/scenario_simulations.csv`
- **Reports**: `reports/` directory with PDFs and PowerPoint
- **Health Check**: `reports/system_health_report.txt`

## Troubleshooting

### Common Issues

**"Module not found" errors:**
- Ensure virtual environment is activated
- Run `pip install -r requirements.txt` again

**"Data file not found" errors:**
- Check that CSV files are in `data/raw/`
- Verify file names match exactly

**Memory errors during training:**
- Close other applications
- Ensure at least 4GB RAM available

**Streamlit won't start:**
- Try `streamlit run app/app.py --server.port 8501`
- Check if port 8501 is available

### System Health Check

Always run the health check first:
```bash
python src/system/system_health_check.py
```

This will identify missing files, broken dependencies, or configuration issues.

### Getting Help

If you encounter issues:
1. Check the system health report
2. Review error messages in the console
3. Ensure all prerequisites are met
4. Contact the development team

## Performance Notes

- **Initial setup**: ~5-10 minutes
- **Full pipeline**: ~15-30 minutes (depending on data size)
- **Model training**: ~2-5 minutes
- **Dashboard loading**: ~10-30 seconds

## Security Notes

- All processing happens locally - no data is sent externally
- Virtual environment isolates dependencies
- No credentials or sensitive data required
- Safe for air-gapped environments

## Next Steps

After successful setup:
1. Explore the executive dashboard for scenario planning
2. Review PDF reports for stakeholder sharing
3. Customize parameters in configuration files as needed
4. Set up automated monthly runs using cron/Windows Task Scheduler

---

*This system is designed for programmatic decision support only. Not for clinical use.*