"""Centralized configuration for KAM Forecast project."""
from pathlib import Path
from dataclasses import dataclass
from typing import Dict, List

@dataclass
class Config:
    """Application configuration settings."""
    
    # Project paths
    BASE_DIR: Path = Path(__file__).parent.parent
    DATA_DIR: Path = BASE_DIR / "data"
    RAW_DATA_DIR: Path = BASE_DIR / "src" / "data" / "raw"  # Raw data is in src/data/raw
    PROCESSED_DATA_DIR: Path = DATA_DIR / "processed"
    MODELS_DIR: Path = BASE_DIR / "models"
    REPORTS_DIR: Path = BASE_DIR / "reports"
    
    # Data file names (matching actual raw data files)
    WHO_NUTRITION_FILE: str = "Ch11-Nutrition-Figures.xlsx"
    UNICEF_WASH_FILE: str = "JMP_2021_INEQUALITIES_KEN_Kenya_1.xlsm"
    DHIS2_CASES_FILE: str = "metadata-nutrition-indicators-for-kenya.csv"
    
    # Processed data file names
    PREDICTIONS_FILE: str = "predictions.csv"
    PREDICTIONS_WITH_UNCERTAINTY_FILE: str = "predictions_with_uncertainty.csv"
    VALIDATION_REPORT_FILE: str = "validation_report.csv"
    QUALITY_SCORES_FILE: str = "county_data_quality_scores.csv"
    SCENARIOS_FILE: str = "scenario_simulations.csv"
    FEATURES_FILE: str = "features.csv"
    
    # Model parameters
    MODEL_PARAMS: Dict = None
    
    # Data quality thresholds
    QUALITY_THRESHOLDS: Dict = None
    
    # DQR dimension weights
    DQR_WEIGHTS: Dict = None
    
    # Severity weights
    SEVERITY_WEIGHTS: Dict = None
    
    # Alert thresholds
    ALERT_THRESHOLDS: Dict = None
    
    # Feature engineering parameters
    LAG_PERIODS: List[int] = None
    
    # Email configuration (should use environment variables in production)
    SMTP_SERVER: str = "localhost"
    SMTP_PORT: int = 587
    SENDER_EMAIL: str = "alerts@malnutrition-project.org"
    RECIPIENT_EMAILS: List[str] = None
    
    def __post_init__(self):
        """Initialize default values for nested dictionaries."""
        if self.MODEL_PARAMS is None:
            self.MODEL_PARAMS = {
                "n_estimators": 100,
                "random_state": 42,
                "test_size": 0.2,
                "max_depth": None,
                "min_samples_split": 2,
                "min_samples_leaf": 1
            }
        
        if self.QUALITY_THRESHOLDS is None:
            self.QUALITY_THRESHOLDS = {
                "critical_score": 60,
                "sharp_decline": 15,
                "downward_trend": 10,
                "missing_data_threshold": 20,
                "extreme_outlier_threshold": 0.5,  # 50% of population
                "spike_threshold": 300,  # 300% increase
                "zero_streak_threshold": 6  # months
            }
        
        if self.DQR_WEIGHTS is None:
            self.DQR_WEIGHTS = {
                "Completeness": 2,
                "Timeliness": 2,
                "Internal Consistency": 1,
                "External Consistency": 1,
                "Accuracy & Integrity": 1,
                "Unknown": 1
            }
        
        if self.SEVERITY_WEIGHTS is None:
            self.SEVERITY_WEIGHTS = {
                "high": 3,
                "medium": 2,
                "low": 1
            }
        
        if self.ALERT_THRESHOLDS is None:
            self.ALERT_THRESHOLDS = {
                "critical_score": 60,
                "sharp_decline": 15,
                "downward_trend": 10
            }
        
        if self.LAG_PERIODS is None:
            self.LAG_PERIODS = [1, 2, 3]
        
        if self.RECIPIENT_EMAILS is None:
            self.RECIPIENT_EMAILS = [
                "data-officer@county-health.go.ke",
                "ngo-monitor@unicef.org"
            ]
    
    def ensure_directories(self) -> None:
        """Create necessary directories if they don't exist."""
        directories = [
            self.DATA_DIR,
            self.RAW_DATA_DIR,
            self.PROCESSED_DATA_DIR,
            self.MODELS_DIR,
            self.REPORTS_DIR
        ]
        for directory in directories:
            directory.mkdir(parents=True, exist_ok=True)

# Global configuration instance
config = Config()
