# Quick Start Guide - Updated Codebase

This guide helps you get started with the improved codebase.

## 🚀 Quick Setup

```bash
# 1. Install/update dependencies
pip install -r requirements.txt --upgrade

# 2. Ensure directories exist (now automatic, but you can verify)
python -c "from config.config import config; config.ensure_directories()"
```

## 📝 Basic Usage

### Running the Pipeline

```python
from src.utils.logging_config import setup_logging
from config.config import config
from src.data.load_data import load_and_merge_data
from src.data.clean_data import clean_data
from src.features.build_features import build_features
from src.models.train_model import train_model
from src.models.predict import make_predictions

# Setup logging (optional - enabled by default)
setup_logging()

# Ensure directories exist
config.ensure_directories()

# Run pipeline
raw_df = load_and_merge_data()
clean_df = clean_data(raw_df)
feature_df = build_features(clean_df, save_features=True)
model, metrics = train_model(feature_df)
predictions = make_predictions(feature_df)

print(f"Model MAE: {metrics['mae']:.2f}")
print(f"Model R²: {metrics['r2']:.3f}")
```

### Using Configuration

```python
from config.config import config

# Access paths
print(f"Data directory: {config.RAW_DATA_DIR}")
print(f"Models directory: {config.MODELS_DIR}")

# Access parameters
print(f"Model estimators: {config.MODEL_PARAMS['n_estimators']}")
print(f"Quality threshold: {config.QUALITY_THRESHOLDS['critical_score']}")

# Modify if needed
config.MODEL_PARAMS['n_estimators'] = 200
```

### Running Streamlit Apps

```bash
# Main dashboard
streamlit run app/app.py

# Data quality dashboard
streamlit run app/data_quality_app.py

# Executive dashboard
streamlit run app/executive_dashboard.py
```

## 🔧 Key Improvements

### 1. Configuration
All settings centralized in `config/config.py`

### 2. Logging
Automatic logging - no need for print statements

### 3. Error Handling
Better error messages and validation

### 4. Type Hints
Better IDE support and code clarity

### 5. Model Versioning
Models saved with metadata and timestamps

## 📚 Module Structure

```
config/              # Configuration
src/
  data/              # Data loading & cleaning
  features/          # Feature engineering
  models/            # Model training & prediction
  validation/        # Data validation
  scoring/           # Quality scoring
  utils/             # Utility functions
  alerts/            # Alert system
  dqr/               # DQR mapping
app/                 # Streamlit dashboards
```

## 🐛 Troubleshooting

### Import Errors
```python
# Make sure you're in the project root
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
```

### Missing Files
- Check that data files are in `data/raw/`
- Run `config.ensure_directories()` to create directories

### Logging Issues
```python
from src.utils.logging_config import setup_logging
setup_logging(level=logging.DEBUG)  # For more verbose output
```

## 📖 More Information

- See `IMPLEMENTATION_SUMMARY.md` for detailed changes
- See `PROJECT_REVIEW.md` for original recommendations
- See `README.md` for project overview
