import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
import pickle
import os

def load_training_data_with_weights():
    """
    Load feature-engineered data and join with county data quality scores.
    
    NGO relevance: Incorporating data quality weights ensures model reliability
    for humanitarian decision-making, prioritizing high-quality data sources.
    
    Returns:
        tuple: (X, y, weights) for model training
    """
    # Load feature data (assuming from build_features)
    # For this example, we'll simulate; in practice, load from saved features
    try:
        features_df = pd.read_csv('data/processed/features.csv')  # Assume saved
        scores_df = pd.read_csv('data/processed/county_data_quality_scores.csv')
    except FileNotFoundError:
        print("Training data not found. Run feature engineering first.")
        return None, None, None
    
    # Extract date month for joining
    features_df['date'] = pd.to_datetime(features_df['date'])
    features_df['month'] = features_df['date'].dt.to_period('M').astype(str)
    scores_df['month'] = scores_df['date']
    
    # Join scores by county and month
    features_df = features_df.merge(scores_df[['county', 'month', 'score']], 
                                   on=['county', 'month'], how='left')
    
    # Normalize scores to weights [0.2, 1.0]
    # Higher quality = higher weight
    features_df['weight'] = 0.2 + 0.8 * (features_df['score'] / 100)
    features_df['weight'] = features_df['weight'].fillna(0.5)  # Default for missing scores
    
    # Prepare features and target
    feature_cols = [col for col in features_df.columns if col not in 
                   ['sub_county', 'county', 'date', 'month', 'acute_malnutrition_cases', 'score', 'weight']]
    X = features_df[feature_cols]
    y = features_df['acute_malnutrition_cases']
    weights = features_df['weight']
    
    return X, y, weights

def train_weighted_model(X, y, weights):
    """
    Train RandomForestRegressor with quality-weighted samples.
    
    Weights ensure that high-quality county data influences the model more strongly,
    improving forecast accuracy for malnutrition prevention programs.
    
    Args:
        X (pd.DataFrame): Features
        y (pd.Series): Target
        weights (pd.Series): Sample weights
    
    Returns:
        tuple: (model, metrics)
    """
    # Split data
    X_train, X_test, y_train, y_test, w_train, w_test = train_test_split(
        X, y, weights, test_size=0.2, random_state=42
    )
    
    # Train without weights for comparison
    model_unweighted = RandomForestRegressor(n_estimators=100, random_state=42)
    model_unweighted.fit(X_train, y_train)
    y_pred_unweighted = model_unweighted.predict(X_test)
    mae_unweighted = mean_absolute_error(y_test, y_pred_unweighted)
    
    # Train with weights
    model_weighted = RandomForestRegressor(n_estimators=100, random_state=42)
    model_weighted.fit(X_train, y_train, sample_weight=w_train)
    y_pred_weighted = model_weighted.predict(X_test)
    mae_weighted = mean_absolute_error(y_test, y_pred_weighted)
    
    # Log impact
    improvement = mae_unweighted - mae_weighted
    print(f"Unweighted MAE: {mae_unweighted:.2f}")
    print(f"Weighted MAE: {mae_weighted:.2f}")
    print(f"Improvement: {improvement:.2f} ({improvement/mae_unweighted*100:.1f}%)")
    
    # Save weighted model
    os.makedirs('models', exist_ok=True)
    with open('models/random_forest_weighted_model.pkl', 'wb') as f:
        pickle.dump(model_weighted, f)
    
    metrics = {
        'mae_unweighted': mae_unweighted,
        'mae_weighted': mae_weighted,
        'improvement': improvement,
        'feature_importance': dict(zip(X.columns, model_weighted.feature_importances_))
    }
    
    return model_weighted, metrics

def run_weighted_training():
    """
    Complete pipeline for quality-weighted model training.
    """
    X, y, weights = load_training_data_with_weights()
    if X is None:
        return
    
    model, metrics = train_weighted_model(X, y, weights)
    print("Weighted model trained and saved.")
    return model, metrics

if __name__ == "__main__":
    run_weighted_training()