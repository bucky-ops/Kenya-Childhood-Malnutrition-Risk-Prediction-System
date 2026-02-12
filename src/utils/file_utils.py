"""File utility functions."""
import pandas as pd
from pathlib import Path
from typing import Optional, Union
import logging

logger = logging.getLogger(__name__)

def ensure_directory(directory: Union[str, Path]) -> Path:
    """
    Ensure a directory exists, creating it if necessary.
    
    Args:
        directory: Directory path
    
    Returns:
        Path object to the directory
    """
    dir_path = Path(directory)
    dir_path.mkdir(parents=True, exist_ok=True)
    return dir_path

def save_dataframe(
    df: pd.DataFrame,
    filepath: Union[str, Path],
    index: bool = False,
    **kwargs
) -> Path:
    """
    Save a dataframe to CSV with error handling.
    
    Args:
        df: DataFrame to save
        filepath: Output file path
        index: Whether to include index in output
        **kwargs: Additional arguments to pass to to_csv
    
    Returns:
        Path to saved file
    
    Raises:
        ValueError: If dataframe is empty
        IOError: If file cannot be written
    """
    filepath = Path(filepath)
    
    if df.empty:
        raise ValueError(f"Cannot save empty dataframe to {filepath}")
    
    # Ensure directory exists
    filepath.parent.mkdir(parents=True, exist_ok=True)
    
    try:
        df.to_csv(filepath, index=index, **kwargs)
        logger.info(f"Saved dataframe ({df.shape}) to {filepath}")
        return filepath
    except Exception as e:
        logger.error(f"Failed to save dataframe to {filepath}: {e}")
        raise IOError(f"Failed to save dataframe: {e}") from e

def load_dataframe(
    filepath: Union[str, Path],
    required: bool = True,
    **kwargs
) -> Optional[pd.DataFrame]:
    """
    Load a dataframe from CSV with error handling.
    
    Args:
        filepath: Input file path
        required: If True, raise error if file not found; if False, return None
        **kwargs: Additional arguments to pass to read_csv
    
    Returns:
        DataFrame or None if file not found and required=False
    
    Raises:
        FileNotFoundError: If file not found and required=True
    """
    filepath = Path(filepath)
    
    if not filepath.exists():
        if required:
            raise FileNotFoundError(f"Required data file not found: {filepath}")
        else:
            logger.warning(f"Optional data file not found: {filepath}")
            return None
    
    try:
        df = pd.read_csv(filepath, **kwargs)
        logger.info(f"Loaded dataframe ({df.shape}) from {filepath}")
        return df
    except Exception as e:
        logger.error(f"Failed to load dataframe from {filepath}: {e}")
        raise IOError(f"Failed to load dataframe: {e}") from e
