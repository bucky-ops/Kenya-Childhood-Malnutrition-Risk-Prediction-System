import pandas as pd

def map_issue_to_dqr_dimension(issue_type):
    """
    Map validation issue types to WHO Data Quality Review (DQR) dimensions.
    
    WHO DQR dimensions are standardized frameworks for assessing health data quality
    in LMICs, enabling consistent monitoring across UN and government systems.
    
    Args:
        issue_type (str): The type of validation issue detected.
    
    Returns:
        str: Corresponding WHO DQR dimension.
    """
    # Explicit mapping based on WHO DQR framework
    dqr_mapping = {
        # Completeness: Missing data points or reporting gaps
        'missing_cols': 'Completeness',
        'missing_pct': 'Completeness',
        'zero_streaks': 'Completeness',
        
        # Timeliness: Issues with reporting periods and dates
        'future_dates': 'Timeliness',
        'non_monthly': 'Timeliness',
        
        # Internal Consistency: Logical relationships within the data
        'spikes': 'Internal Consistency',
        
        # External Consistency: Values compared to expected ranges/plausibility
        'negatives': 'External Consistency',
        'extremes': 'External Consistency',
        
        # Accuracy & Integrity: Data structure and uniqueness issues
        'duplicates': 'Accuracy & Integrity',
        'null_geo': 'Accuracy & Integrity',
        'inconsistent_geo': 'Accuracy & Integrity'
    }
    
    return dqr_mapping.get(issue_type, 'Unknown')

def add_dqr_dimensions(df):
    """
    Add WHO DQR dimension column to the validation report dataframe.
    
    This enables aggregation and analysis by standardized data quality dimensions
    used in global health monitoring and WHO assessments.
    
    Args:
        df (pd.DataFrame): Validation report dataframe.
    
    Returns:
        pd.DataFrame: Dataframe with added 'dqr_dimension' column.
    """
    df_copy = df.copy()
    df_copy['dqr_dimension'] = df_copy['issue_type'].apply(map_issue_to_dqr_dimension)
    return df_copy

if __name__ == "__main__":
    # Example usage
    df = pd.read_csv('data/processed/validation_report.csv')
    df_with_dqr = add_dqr_dimensions(df)
    print("WHO DQR dimensions added:")
    print(df_with_dqr[['issue_type', 'dqr_dimension']].head())
    print(f"Unique DQR dimensions: {df_with_dqr['dqr_dimension'].unique()}")