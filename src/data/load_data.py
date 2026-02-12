"""Data loading module for KAM Forecast project."""
import pandas as pd
from pathlib import Path
from typing import Optional
import sys
import os

# Add project root to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from config.config import config
from src.utils.logging_config import get_logger

logger = get_logger(__name__)

def load_data_file(filepath: Path, required: bool = True) -> Optional[pd.DataFrame]:
    """
    Load a data file, supporting both CSV and Excel formats.
    
    Args:
        filepath: Path to the data file
        required: If True, raise error if file not found
    
    Returns:
        DataFrame or None if file not found and required=False
    
    Raises:
        FileNotFoundError: If file not found and required=True
        ValueError: If file format is not supported
    """
    if not filepath.exists():
        if required:
            raise FileNotFoundError(f"Data file not found: {filepath}")
        else:
            logger.warning(f"Optional data file not found: {filepath}")
            return None
    
    file_ext = filepath.suffix.lower()
    
    try:
        if file_ext == '.csv':
            df = pd.read_csv(filepath)
            logger.info(f"Loaded CSV file: {filepath}")
        elif file_ext in ['.xlsx', '.xls', '.xlsm']:
            # For Excel files, read the first sheet by default
            # You may need to specify sheet_name if your data is in a specific sheet
            df = pd.read_excel(filepath, sheet_name=0, engine='openpyxl' if file_ext == '.xlsx' or file_ext == '.xlsm' else None)
            logger.info(f"Loaded Excel file: {filepath} (sheet 0)")
        else:
            raise ValueError(f"Unsupported file format: {file_ext}. Supported formats: .csv, .xlsx, .xls, .xlsm")
        
        logger.info(f"Loaded data: {df.shape[0]} rows, {df.shape[1]} columns")
        return df
    except Exception as e:
        logger.error(f"Failed to load data file {filepath}: {e}")
        raise IOError(f"Failed to load data file: {e}") from e

def load_and_merge_data(
    data_dir: Optional[Path] = None,
    who_file: Optional[str] = None,
    unicef_file: Optional[str] = None,
    dhis2_file: Optional[str] = None
) -> pd.DataFrame:
    """
    Load data from WHO, UNICEF, and DHIS2 sources (supports CSV and Excel formats),
    merge on sub_county and date.

    NGO relevance: Merging multi-source data enables comprehensive risk assessment
    for malnutrition prevention programs in UN/NGO operations.

    Args:
        data_dir: Directory containing raw data files (default: config.RAW_DATA_DIR)
        who_file: WHO nutrition data filename (default: from config)
        unicef_file: UNICEF WASH data filename (default: from config)
        dhis2_file: DHIS2 cases data filename (default: from config)

    Returns:
        pd.DataFrame: Merged dataframe with all indicators and target variable.

    Raises:
        FileNotFoundError: If required data files are missing
        ValueError: If data structure is invalid
    """
    # Use configuration defaults if not provided
    if data_dir is None:
        data_dir = config.RAW_DATA_DIR
    else:
        data_dir = Path(data_dir)
    
    if who_file is None:
        who_file = config.WHO_NUTRITION_FILE
    if unicef_file is None:
        unicef_file = config.UNICEF_WASH_FILE
    if dhis2_file is None:
        dhis2_file = config.DHIS2_CASES_FILE
    
    # Validate directory exists
    if not data_dir.exists():
        error_msg = f"Data directory not found: {data_dir}"
        logger.error(error_msg)
        raise FileNotFoundError(error_msg)
    
    # Load files with error handling
    files_to_load = {
        'who': (who_file, 'WHO nutrition indicators'),
        'unicef': (unicef_file, 'UNICEF WASH indicators'),
        'dhis2': (dhis2_file, 'DHIS2 malnutrition case data')
    }
    
    dataframes = {}
    for source, (filename, description) in files_to_load.items():
        filepath = data_dir / filename
        logger.info(f"Loading {description} from {filepath}")
        
        try:
            # Use the new load_data_file function that supports both CSV and Excel
            df = load_data_file(filepath, required=True)
            
            if df is None:
                continue
            
            # Validate required columns (check if they exist, case-insensitive)
            required_cols = ['sub_county', 'county', 'date']
            df_columns_lower = [col.lower() for col in df.columns]
            
            # Check for required columns (case-insensitive)
            missing_cols = []
            column_mapping = {}
            for req_col in required_cols:
                # Try exact match first
                if req_col in df.columns:
                    column_mapping[req_col] = req_col
                else:
                    # Try case-insensitive match
                    found = False
                    for col in df.columns:
                        if col.lower() == req_col.lower():
                            column_mapping[req_col] = col
                            found = True
                            break
                    if not found:
                        missing_cols.append(req_col)
            
            if missing_cols:
                logger.warning(f"Missing required columns in {filename}: {missing_cols}")
                logger.info(f"Available columns: {list(df.columns)}")
                # Don't raise error - some files might have different structures
                # We'll handle this in the merge step
            
            # Rename columns to standardize (case-insensitive)
            for standard_col, actual_col in column_mapping.items():
                if standard_col != actual_col:
                    df = df.rename(columns={actual_col: standard_col})
                    logger.info(f"Renamed column '{actual_col}' to '{standard_col}'")
            
            # Convert date column if it exists
            if 'date' in df.columns:
                df['date'] = pd.to_datetime(df['date'], errors='coerce')
                invalid_dates = df['date'].isna().sum()
                if invalid_dates > 0:
                    logger.warning(f"Found {invalid_dates} invalid dates in {filename}")
            
            dataframes[source] = df
            logger.info(f"Loaded {source} data: {df.shape[0]} rows, {df.shape[1]} columns")
            
        except FileNotFoundError:
            raise
        except Exception as e:
            error_msg = f"Failed to load {source} data from {filepath}: {e}"
            logger.error(error_msg)
            raise IOError(error_msg) from e
    
    # Merge datasets with validation
    try:
        logger.info("Merging datasets...")
        
        # Start with DHIS2 as base (contains target variable)
        merged_df = dataframes['dhis2'].merge(
            dataframes['who'],
            on=['sub_county', 'date', 'county'],
            how='outer',
            suffixes=('', '_who')
        )
        
        merged_df = merged_df.merge(
            dataframes['unicef'],
            on=['sub_county', 'date', 'county'],
            how='outer',
            suffixes=('', '_unicef')
        )
        
        # Sort by sub_county and date for time series consistency
        merged_df = merged_df.sort_values(['sub_county', 'date']).reset_index(drop=True)
        
        logger.info(f"Merged data shape: {merged_df.shape[0]} rows, {merged_df.shape[1]} columns")
        logger.info(f"Date range: {merged_df['date'].min()} to {merged_df['date'].max()}")
        
        return merged_df
        
    except Exception as e:
        error_msg = f"Failed to merge data: {e}"
        logger.error(error_msg)
        raise IOError(error_msg) from e

# If this script is run directly (not imported), execute a test load
if __name__ == "__main__":
    from src.utils.logging_config import setup_logging
    setup_logging()
    
    try:
        df = load_and_merge_data()
        logger.info(f"Successfully loaded data with shape: {df.shape}")
        print(f"\nLoaded data with shape: {df.shape}")
        print(f"\nFirst few rows:")
        print(df.head())
        print(f"\nColumn names: {list(df.columns)}")
        print(f"\nDate range: {df['date'].min()} to {df['date'].max()}")
    except Exception as e:
        logger.error(f"Failed to load data: {e}")
        print(f"Error: {e}")
        sys.exit(1)