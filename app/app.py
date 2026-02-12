# Import necessary libraries for the Streamlit application
import streamlit as st  # For creating the web-based dashboard interface
import pandas as pd  # For data manipulation and analysis
import matplotlib.pyplot as plt  # For creating visualizations
from pathlib import Path
import sys

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from config.config import config

@st.cache_data
def load_predictions():
    """
    Load predictions data for the app with caching.

    NGO relevance: Interactive visualization enables stakeholders to explore
    prediction results for informed decision-making in program implementation.

    Returns:
        pd.DataFrame: Predictions dataframe or None if file not found.
    """
    predictions_path = config.PROCESSED_DATA_DIR / config.PREDICTIONS_FILE
    try:
        # Attempt to read the predictions CSV file from the processed data directory
        df = pd.read_csv(predictions_path)
        return df
    except FileNotFoundError:
        # If the file is not found, display an error message in the Streamlit app
        # This prevents the app from crashing and guides the user to run the pipeline
        st.error(f"Predictions file not found at {predictions_path}. Run the prediction pipeline first.")
        return None
    except Exception as e:
        st.error(f"Error loading predictions: {e}")
        return None

def main():
    # Set the main title of the Streamlit application
    st.title("Kenya Childhood Malnutrition Risk Prediction")
    # Add a subtitle explaining the purpose of the dashboard
    st.markdown("**Decision Support Dashboard** - County-level malnutrition case predictions")

    # Load the predictions data using the helper function
    df = load_predictions()
    # If data loading failed, exit the function early
    if df is None:
        return

    # Convert the 'date' column to datetime format for proper time series handling
    df['date'] = pd.to_datetime(df['date'])

    # Create a dropdown selector for counties
    # Get unique county names and sort them alphabetically
    counties = sorted(df['county'].unique())
    selected_county = st.selectbox("Select County", counties)

    # Filter the dataframe to include only data for the selected county
    county_data = df[df['county'] == selected_county]

    # Aggregate the data by date, summing cases across all sub-counties in the selected county
    # This provides a county-level view of actual vs predicted cases over time
    aggregated = county_data.groupby('date').agg({
        'acute_malnutrition_cases': 'sum',
        'predicted_cases': 'sum'
    }).reset_index()

    # Create a subheader for the visualization section
    st.subheader(f"Malnutrition Cases: Actual vs Predicted ({selected_county})")

    # Create a matplotlib figure for the line chart
    fig, ax = plt.subplots(figsize=(10, 6))
    # Plot actual cases as a solid line with circle markers
    ax.plot(aggregated['date'], aggregated['acute_malnutrition_cases'],
            label='Actual Cases', marker='o', linewidth=2)
    # Plot predicted cases as a dashed line with square markers
    ax.plot(aggregated['date'], aggregated['predicted_cases'],
            label='Predicted Cases', marker='s', linewidth=2, linestyle='--')

    # Set axis labels and add a legend
    ax.set_xlabel('Date')
    ax.set_ylabel('Number of Cases')
    ax.legend()
    # Add a subtle grid for better readability
    ax.grid(True, alpha=0.3)
    # Rotate x-axis labels for better display of dates
    plt.xticks(rotation=45)

    # Display the matplotlib figure in the Streamlit app
    st.pyplot(fig)

    # Create a section for summary statistics
    st.subheader("Summary Statistics")
    # Use Streamlit columns to display metrics side by side
    col1, col2, col3 = st.columns(3)

    with col1:
        # Calculate and display total actual cases for the selected county
        st.metric("Total Actual Cases", int(aggregated['acute_malnutrition_cases'].sum()))

    with col2:
        # Calculate and display total predicted cases for the selected county
        st.metric("Total Predicted Cases", int(aggregated['predicted_cases'].sum()))

    with col3:
        # Calculate Mean Absolute Error (MAE) as a measure of prediction accuracy
        mae = abs(aggregated['acute_malnutrition_cases'] - aggregated['predicted_cases']).mean()
        st.metric("Mean Absolute Error", f"{mae:.1f}")

# This block ensures the main function runs only when the script is executed directly
# (not when imported as a module)
if __name__ == "__main__":
    main()