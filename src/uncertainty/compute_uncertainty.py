import pandas as pd
import numpy as np
import pickle
import os

def compute_prediction_uncertainty():
    """
    Compute prediction uncertainty bands using Random Forest ensemble.
    
    Public-sector relevance: Uncertainty quantification helps decision-makers
    understand prediction reliability, enabling risk-adjusted planning in
    malnutrition prevention programs.
    
    Returns:
        pd.DataFrame: Predictions with uncertainty bounds
    """
    # Load model
    model_path = 'models/random_forest_weighted_model.pkl'
    if not os.path.exists(model_path):
        print("Model not found. Run weighted training first.")
        return None
    
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
    
    # Load feature data
    features_path = 'data/processed/features.csv'
    if not os.path.exists(features_path):
        print("Features not found. Run feature engineering first.")
        return None
    
    features_df = pd.read_csv(features_path)
    
    # Prepare features (same as training)
    feature_cols = [col for col in features_df.columns if col not in 
                   ['sub_county', 'county', 'date', 'month', 'acute_malnutrition_cases', 'score', 'weight']]
    X = features_df[feature_cols]
    
    # Get predictions from each tree
    tree_predictions = np.array([tree.predict(X) for tree in model.estimators_])
    
    # Compute point estimates and uncertainty bounds
    point_estimates = model.predict(X)
    lower_bounds = np.percentile(tree_predictions, 10, axis=0)  # 10th percentile
    upper_bounds = np.percentile(tree_predictions, 90, axis=0)  # 90th percentile
    
    # Create results dataframe
    uncertainty_df = features_df[['sub_county', 'county', 'date', 'acute_malnutrition_cases']].copy()
    uncertainty_df['predicted_cases'] = point_estimates
    uncertainty_df['lower_bound'] = lower_bounds
    uncertainty_df['upper_bound'] = upper_bounds
    
    # Add uncertainty range for communication
    uncertainty_df['uncertainty_range'] = uncertainty_df['upper_bound'] - uncertainty_df['lower_bound']
    
    return uncertainty_df

def save_uncertainty_results(uncertainty_df):
    """
    Save predictions with uncertainty to CSV.
    
    Args:
        uncertainty_df (pd.DataFrame): Uncertainty results
    """
    os.makedirs('data/processed', exist_ok=True)
    uncertainty_df.to_csv('data/processed/predictions_with_uncertainty.csv', index=False)

if __name__ == "__main__":
    uncertainty_df = compute_prediction_uncertainty()
    if uncertainty_df is not None:
        save_uncertainty_results(uncertainty_df)
        print("Prediction uncertainty computed and saved.")
        print(f"Average uncertainty range: {uncertainty_df['uncertainty_range'].mean():.1f} cases")
    else:
        print("Could not compute uncertainty - check model and data availability.")