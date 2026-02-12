import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path
import sys

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from config.config import config

# Set page configuration
st.set_page_config(page_title="Kenya Malnutrition Executive Dashboard", layout="wide")

@st.cache_data
def load_executive_data():
    """
    Load data for executive dashboard with caching.

    Public-sector relevance: Aggregated insights enable senior leaders to make
    informed decisions about malnutrition prevention resource allocation.
    """
    try:
        predictions_path = config.PROCESSED_DATA_DIR / config.PREDICTIONS_WITH_UNCERTAINTY_FILE
        scores_path = config.PROCESSED_DATA_DIR / config.QUALITY_SCORES_FILE
        scenarios_path = config.PROCESSED_DATA_DIR / config.SCENARIOS_FILE
        
        predictions = pd.read_csv(predictions_path)
        scores = pd.read_csv(scores_path)
        scenarios = pd.read_csv(scenarios_path)
        
        return predictions, scores, scenarios
    except FileNotFoundError as e:
        st.error(f"Required data files not found. Run prediction and scoring pipelines first. Error: {e}")
        return None, None, None
    except Exception as e:
        st.error(f"Error loading executive data: {e}")
        return None, None, None

def main():
    st.title("Kenya Childhood Malnutrition Executive Dashboard")
    st.markdown("*National Overview for Decision-Makers*")

    # Load data
    predictions, scores, scenarios = load_executive_data()
    if predictions is None or scores is None or scenarios is None:
        return

    predictions['date'] = pd.to_datetime(predictions['date'])
    scores['date'] = pd.to_datetime(scores['date'])
    scenarios['date'] = pd.to_datetime(scenarios['date'])

    # Scenario selector
    available_scenarios = scenarios['scenario'].unique().tolist()
    selected_scenario = st.selectbox(
        "Select Scenario",
        available_scenarios,
        help="Choose a scenario to explore how different conditions might affect predictions"
    )

    # Filter data for selected scenario
    scenario_data = scenarios[scenarios['scenario'] == selected_scenario].copy()

    # Use adjusted predictions if not baseline
    if selected_scenario != 'Baseline':
        scenario_data = scenario_data.rename(columns={
            'predicted_cases_adjusted': 'predicted_cases',
            'lower_bound_adjusted': 'lower_bound',
            'upper_bound_adjusted': 'upper_bound'
        })
    else:
        # For baseline, use original predictions
        scenario_data = predictions.copy()

    # Scenario description
    scenario_description = scenario_data['scenario_description'].iloc[0] if 'scenario_description' in scenario_data.columns else ""
    if scenario_description:
        st.info(f"**Scenario Context:** {scenario_description}")

        if "Results are indicative, not forecasts" not in scenario_description:
            st.markdown("*Results are indicative of potential impacts, not guaranteed forecasts.*")
    
    # Get latest month data
    latest_date = scenario_data['date'].max()
    latest_predictions = scenario_data[scenario_data['date'] == latest_date]
    latest_scores = scores[scores['date'] == latest_date]

    # National overview metrics
    col1, col2, col3 = st.columns(3)

    with col1:
        total_predicted = latest_predictions['predicted_cases'].sum()
        st.metric(f"Total Predicted Cases ({selected_scenario})", f"{int(total_predicted):,}")

    with col2:
        high_risk_counties = len(latest_scores[latest_scores['score'] < 70])
        st.metric("High-Risk Counties", high_risk_counties)

    with col3:
        avg_quality = latest_scores['score'].mean()
        st.metric("Average Data Quality Score", f"{avg_quality:.1f}/100")
    
    st.markdown("---")
    
    # Key insights
    st.subheader("Key Insights for Planning")
    
    # Calculate national trends
    national_trend = scenario_data.groupby('date').agg({
        'acute_malnutrition_cases': 'sum',
        'predicted_cases': 'sum',
        'lower_bound': 'sum',
        'upper_bound': 'sum'
    }).reset_index()
    
    # Risk assessment
    risk_counties = latest_scores[latest_scores['score'] < 70]['county'].tolist()
    
    if risk_counties:
        st.warning(f"**Immediate Attention Needed:** {len(risk_counties)} counties have data quality concerns that may affect prediction reliability.")
    else:
        st.success("**Good News:** All counties meet minimum data quality standards for reliable predictions.")
    
    # Visualizations
    st.subheader("National Trends & Forecasts")
    
    col1, col2 = st.columns(2)
    
    with col1:
        # Trend with uncertainty
        st.markdown(f"**Malnutrition Cases: Actual vs Predicted ({selected_scenario})**")
        fig, ax = plt.subplots(figsize=(10, 6))
        ax.plot(national_trend['date'], national_trend['acute_malnutrition_cases'],
                label='Actual Cases', marker='o', linewidth=2)
        ax.plot(national_trend['date'], national_trend['predicted_cases'],
                label='Predicted Cases', marker='s', linewidth=2, linestyle='--')
        ax.fill_between(national_trend['date'], national_trend['lower_bound'],
                       national_trend['upper_bound'], alpha=0.3, label='Uncertainty Range')
        ax.set_xlabel('Month')
        ax.set_ylabel('Total Cases')
        ax.legend()
        ax.grid(True, alpha=0.3)
        plt.xticks(rotation=45)
        st.pyplot(fig)

        st.markdown("*The shaded area shows the expected range of cases based on data quality and model uncertainty.*")
    
    with col2:
        # County risk map (proxy)
        st.markdown(f"**County Risk Overview ({selected_scenario})**")
        county_summary = latest_predictions.groupby('county').agg({
            'predicted_cases': 'sum',
            'acute_malnutrition_cases': 'sum'
        }).reset_index()

        county_summary = county_summary.merge(latest_scores, on='county', how='left')
        
        fig, ax = plt.subplots(figsize=(8, 10))
        bars = ax.barh(county_summary['county'], county_summary['predicted_cases'])
        
        # Color by quality score
        for i, (bar, score) in enumerate(zip(bars, county_summary['score'])):
            if score < 70:
                bar.set_color('red')
            elif score < 80:
                bar.set_color('orange')
            else:
                bar.set_color('green')
        
        ax.set_xlabel('Predicted Cases')
        ax.set_title(f'Predicted Cases by County ({selected_scenario})\n(Red: Low Quality Data)')
        st.pyplot(fig)

    # County ranking table
    st.subheader(f"County Risk Ranking ({selected_scenario})")

    ranking_df = county_summary.sort_values('predicted_cases', ascending=False)[
        ['county', 'predicted_cases', 'score']
    ].rename(columns={
        'predicted_cases': 'Predicted Cases',
        'score': 'Data Quality Score'
    })
    
    st.dataframe(ranking_df)
    
    # Decision messaging
    st.subheader("What This Means for Planning")
    
    st.markdown("""
    **Resource Allocation Guidance:**
    - Focus prevention programs on the highest-risk counties shown in red
    - Counties with low data quality scores may need additional monitoring support
    - The uncertainty bands indicate where predictions are less reliable
    
    **Next Steps:**
    - Review county-specific action plans for the top 5 high-risk areas
    - Coordinate with health facilities to improve data collection where quality is low
    - Use these predictions to inform nutrition supplement distribution and outreach
    
    **Important Note:** These predictions support programmatic planning only. 
    Individual clinical decisions should always be made by qualified health professionals.
    """)
    
    # Footer
    st.markdown("---")
    st.markdown("*Dashboard updated monthly. Contact analytics team for county-specific reports.*")

if __name__ == "__main__":
    main()