"""Model utility functions."""
import pickle
from pathlib import Path
from typing import Dict, Any, Optional, Union
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

def save_model(
    model: Any,
    filepath: Union[str, Path],
    metadata: Optional[Dict[str, Any]] = None,
    versioned: bool = True
) -> Path:
    """
    Save a trained model with metadata.
    
    Args:
        model: Trained model object
        filepath: Output file path
        metadata: Optional metadata dictionary
        versioned: If True, also save with timestamp
    
    Returns:
        Path to saved model file
    """
    filepath = Path(filepath)
    filepath.parent.mkdir(parents=True, exist_ok=True)
    
    # Prepare model data
    model_data = {
        'model': model,
        'timestamp': datetime.now().isoformat(),
        'metadata': metadata or {}
    }
    
    try:
        # Save main file
        with open(filepath, 'wb') as f:
            pickle.dump(model_data, f)
        logger.info(f"Saved model to {filepath}")
        
        # Save versioned copy if requested
        if versioned:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            versioned_path = filepath.parent / f"{filepath.stem}_{timestamp}{filepath.suffix}"
            with open(versioned_path, 'wb') as f:
                pickle.dump(model_data, f)
            logger.info(f"Saved versioned model to {versioned_path}")
        
        return filepath
    except Exception as e:
        logger.error(f"Failed to save model to {filepath}: {e}")
        raise IOError(f"Failed to save model: {e}") from e

def load_model(
    filepath: Union[str, Path],
    required: bool = True
) -> Optional[Dict[str, Any]]:
    """
    Load a trained model with metadata.
    
    Args:
        filepath: Input file path
        required: If True, raise error if file not found
    
    Returns:
        Dictionary with 'model' and 'metadata' keys, or None if not found and required=False
    
    Raises:
        FileNotFoundError: If file not found and required=True
    """
    filepath = Path(filepath)
    
    if not filepath.exists():
        if required:
            raise FileNotFoundError(f"Model file not found: {filepath}")
        else:
            logger.warning(f"Optional model file not found: {filepath}")
            return None
    
    try:
        with open(filepath, 'rb') as f:
            model_data = pickle.load(f)
        logger.info(f"Loaded model from {filepath}")
        return model_data
    except Exception as e:
        logger.error(f"Failed to load model from {filepath}: {e}")
        raise IOError(f"Failed to load model: {e}") from e
