import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
from pathlib import Path
import sys

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from config.config import config

# Set page configuration
st.set_page_config(page_title="Kenya Malnutrition Data Quality Dashboard", layout="wide")

@st.cache_data
def load_validation_data():
    """
    Load validation report data with caching.
    
    DHIS2 relevance: Data quality dashboards are core to DHIS2 implementations
    for monitoring health system performance and data reliability.
    """
    validation_path = config.PROCESSED_DATA_DIR / config.VALIDATION_REPORT_FILE
    try:
        df = pd.read_csv(validation_path)
        if 'date' in df.columns:
            df['date'] = pd.to_datetime(df['date'], errors='coerce')
        return df
    except FileNotFoundError:
        st.error(f"Validation report not found at {validation_path}. Run validation pipeline first.")
        return pd.DataFrame()
    except Exception as e:
        st.error(f"Error loading validation data: {e}")
        return pd.DataFrame()

def main():
    st.title("Kenya Childhood Malnutrition Data Quality Dashboard")
    st.markdown("*DHIS2-Style Data Quality Review for Malnutrition Surveillance*")
    
    # Load data
    df = load_validation_data()
    if df.empty:
        return
    
    # Warning banner for high-severity issues
    high_issues = len(df[df['severity'] == 'high'])
    if high_issues > 0:
        st.error(f"⚠️ {high_issues} high-severity data quality issues detected. Immediate review recommended to ensure reliable malnutrition risk predictions.")
    
    # Overview metrics
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("Total Records Validated", len(df))
    
    with col2:
        total_issues = len(df)
        st.metric("Total Issues Detected", total_issues)
    
    with col3:
        high_count = len(df[df['severity'] == 'high'])
        st.metric("High Severity Issues", high_count)
    
    with col4:
        medium_count = len(df[df['severity'] == 'medium'])
        low_count = len(df[df['severity'] == 'low'])
        st.metric("Medium/Low Issues", f"{medium_count}/{low_count}")
    
    st.markdown("---")
    
    # Filters
    st.subheader("Data Quality Filters")
    col1, col2 = st.columns(2)
    
    with col1:
        counties = ['All'] + sorted(df['county'].unique().tolist())
        selected_county = st.selectbox("Select County", counties)
        
        sub_counties = ['All']
        if selected_county != 'All':
            sub_counties += sorted(df[df['county'] == selected_county]['sub_county'].unique().tolist())
        selected_sub_county = st.selectbox("Select Sub-County", sub_counties)
    
    with col2:
        min_date = df['date'].min().date()
        max_date = df['date'].max().date()
        date_range = st.date_input("Date Range", [min_date, max_date], min_value=min_date, max_value=max_date)
        
        severities = ['All'] + sorted(df['severity'].unique().tolist())
        selected_severity = st.selectbox("Issue Severity", severities)
    
    # Apply filters
    filtered_df = df.copy()
    if selected_county != 'All':
        filtered_df = filtered_df[filtered_df['county'] == selected_county]
    if selected_sub_county != 'All':
        filtered_df = filtered_df[filtered_df['sub_county'] == selected_sub_county]
    if len(date_range) == 2:
        filtered_df = filtered_df[(filtered_df['date'].dt.date >= date_range[0]) & 
                                 (filtered_df['date'].dt.date <= date_range[1])]
    if selected_severity != 'All':
        filtered_df = filtered_df[filtered_df['severity'] == selected_severity]
    
    st.markdown(f"**Filtered Results:** {len(filtered_df)} issues matching criteria")
    
    # Visualizations
    st.subheader("Data Quality Visualizations")
    
    col1, col2 = st.columns(2)
    
    with col1:
        # Bar chart: issues by issue_type
        st.markdown("**Issues by Type**")
        if not filtered_df.empty:
            issue_counts = filtered_df['issue_type'].value_counts()
            fig, ax = plt.subplots(figsize=(8, 6))
            issue_counts.plot(kind='bar', ax=ax, color='skyblue')
            ax.set_ylabel('Count')
            ax.set_xlabel('Issue Type')
            plt.xticks(rotation=45, ha='right')
            st.pyplot(fig)
        else:
            st.info("No data to display for selected filters")
    
    with col2:
        # Heatmap: issue count by sub-county vs month
        st.markdown("**Issue Heatmap: Sub-County vs Month**")
        if not filtered_df.empty:
            # Create month column
            filtered_df['month'] = filtered_df['date'].dt.to_period('M').astype(str)
            
            # Pivot for heatmap
            heatmap_data = filtered_df.pivot_table(
                index='sub_county', 
                columns='month', 
                values='issue_type', 
                aggfunc='count', 
                fill_value=0
            )
            
            if not heatmap_data.empty:
                fig, ax = plt.subplots(figsize=(10, 8))
                sns.heatmap(heatmap_data, annot=True, fmt='d', cmap='YlOrRd', ax=ax)
                ax.set_title('Number of Issues')
                plt.xticks(rotation=45, ha='right')
                st.pyplot(fig)
            else:
                st.info("Insufficient data for heatmap")
        else:
            st.info("No data to display for selected filters")
    
    # Line chart: trend over time
    st.markdown("**Trend of Total Issues Over Time**")
    if not filtered_df.empty:
        time_trend = filtered_df.groupby('date').size().reset_index(name='count')
        fig, ax = plt.subplots(figsize=(12, 6))
        ax.plot(time_trend['date'], time_trend['count'], marker='o', linewidth=2)
        ax.set_xlabel('Date')
        ax.set_ylabel('Number of Issues')
        ax.grid(True, alpha=0.3)
        plt.xticks(rotation=45)
        st.pyplot(fig)
    else:
        st.info("No data to display for selected filters")
    
    # Detailed issues table
    st.subheader("Detailed Issues Table")
    if not filtered_df.empty:
        # Display table with relevant columns
        display_cols = ['date', 'county', 'sub_county', 'indicator', 'issue_type', 'issue_description', 'severity']
        st.dataframe(filtered_df[display_cols])
        
        # Export button
        csv = filtered_df[display_cols].to_csv(index=False)
        st.download_button(
            label="Download Filtered Issues as CSV",
            data=csv,
            file_name='filtered_data_quality_issues.csv',
            mime='text/csv'
        )
    else:
        st.info("No issues to display for selected filters")
    
    # Footer explanation
    st.markdown("---")
    st.markdown("""
    **About Data Quality in Malnutrition Surveillance:**
    
    Poor data quality can lead to unreliable risk predictions, potentially causing:
    - Missed malnutrition outbreaks
    - Inefficient resource allocation
    - Reduced trust in health information systems
    
    Regular data quality reviews, following DHIS2 standards, are essential for effective public health programming.
    """)

if __name__ == "__main__":
    main()