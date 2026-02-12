"""
Main entry point for the Kenya Childhood Malnutrition Risk Prediction System.
"""
import sys
from pathlib import Path

# Add project root to path for imports
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

def main():
    """Main entry point for the application."""
    print("Kenya Childhood Malnutrition Risk Prediction System")
    print("=" * 50)
    print("Starting the system...")
    
    # Import and run the main Streamlit app
    import streamlit.web.bootstrap as bootstrap
    import streamlit.runtime.secrets as secrets
    from app.app import main as app_main
    
    # Run the main app
    app_main()


if __name__ == "__main__":
    main()