import pandas as pd
import numpy as np
import os

def simulate_funding_increase(predictions_df, increase_percentage):
    """
    Simulate the impact of increased nutrition program funding on malnutrition predictions.
    
    Policy relevance: Funding scenarios help governments and donors understand
    the potential impact of budget allocations on malnutrition prevention outcomes.
    
    Assumptions:
    - 10% funding increase → 5% reduction in predicted cases (conservative)
    - 25% funding increase → 12% reduction
    - 50% funding increase → 22% reduction
    - Effects are immediate and sustained
    
    Args:
        predictions_df (pd.DataFrame): Baseline predictions with uncertainty
        increase_percentage (float): Funding increase (0.1, 0.25, 0.5)
    
    Returns:
        pd.DataFrame: Adjusted predictions for funding scenario
    """
    # Define impact multipliers based on funding increase
    impact_multipliers = {
        0.1: 0.95,   # 10% funding → 5% case reduction
        0.25: 0.88,  # 25% funding → 12% case reduction
        0.5: 0.78    # 50% funding → 22% case reduction
    }
    
    multiplier = impact_multipliers.get(increase_percentage, 1.0)
    
    # Create copy for scenario
    scenario_df = predictions_df.copy()
    scenario_df['scenario'] = f'Funding +{int(increase_percentage*100)}%'
    
    # Adjust predictions and uncertainty bounds
    scenario_df['predicted_cases_adjusted'] = scenario_df['predicted_cases'] * multiplier
    scenario_df['lower_bound_adjusted'] = scenario_df['lower_bound'] * multiplier
    scenario_df['upper_bound_adjusted'] = scenario_df['upper_bound'] * multiplier
    
    # Add explanation
    scenario_df['scenario_description'] = f'Funding increase of {int(increase_percentage*100)}% assumes improved nutrition program coverage and service delivery, leading to reduced malnutrition incidence.'
    
    return scenario_df

def simulate_drought_shock(predictions_df, drought_severity):
    """
    Simulate the impact of drought on malnutrition predictions.
    
    Policy relevance: Drought scenarios prepare governments for climate-related
    shocks that can exacerbate malnutrition through reduced food security and WASH access.
    
    Assumptions:
    - Moderate drought → 15% increase in cases
    - Severe drought → 35% increase in cases
    - Effects are amplified during dry seasons
    
    Args:
        predictions_df (pd.DataFrame): Baseline predictions with uncertainty
        drought_severity (str): 'moderate' or 'severe'
    
    Returns:
        pd.DataFrame: Adjusted predictions for drought scenario
    """
    # Define impact multipliers
    impact_multipliers = {
        'moderate': 1.15,  # 15% increase
        'severe': 1.35     # 35% increase
    }
    
    multiplier = impact_multipliers.get(drought_severity, 1.0)
    
    # Create copy for scenario
    scenario_df = predictions_df.copy()
    scenario_df['scenario'] = f'Drought ({drought_severity.title()})'
    
    # Adjust predictions and uncertainty bounds
    scenario_df['predicted_cases_adjusted'] = scenario_df['predicted_cases'] * multiplier
    scenario_df['lower_bound_adjusted'] = scenario_df['lower_bound'] * multiplier
    scenario_df['upper_bound_adjusted'] = scenario_df['upper_bound'] * multiplier
    
    # Add seasonal amplification for dry months (assuming July-Sept are dry season)
    scenario_df['date'] = pd.to_datetime(scenario_df['date'])
    dry_season_mask = scenario_df['date'].dt.month.isin([7, 8, 9])
    amplification_factor = 1.1 if drought_severity == 'moderate' else 1.2
    scenario_df.loc[dry_season_mask, 'predicted_cases_adjusted'] *= amplification_factor
    scenario_df.loc[dry_season_mask, 'lower_bound_adjusted'] *= amplification_factor
    scenario_df.loc[dry_season_mask, 'upper_bound_adjusted'] *= amplification_factor
    
    # Add explanation
    scenario_df['scenario_description'] = f'{drought_severity.title()} drought assumes reduced food security and WASH access, leading to increased malnutrition incidence, especially during dry seasons.'
    
    return scenario_df

def run_scenario_simulations():
    """
    Run all scenario simulations and save results.
    
    Generates baseline + funding scenarios + drought scenarios.
    """
    # Load baseline predictions with uncertainty
    baseline_path = 'data/processed/predictions_with_uncertainty.csv'
    if not os.path.exists(baseline_path):
        print("Baseline predictions not found. Run uncertainty computation first.")
        return
    
    baseline_df = pd.read_csv(baseline_path)
    baseline_df['scenario'] = 'Baseline'
    baseline_df['predicted_cases_adjusted'] = baseline_df['predicted_cases']
    baseline_df['lower_bound_adjusted'] = baseline_df['lower_bound']
    baseline_df['upper_bound_adjusted'] = baseline_df['upper_bound']
    baseline_df['scenario_description'] = 'Baseline predictions using current data and conditions.'
    
    # Run funding scenarios
    funding_scenarios = []
    for increase in [0.1, 0.25, 0.5]:
        funding_scenarios.append(simulate_funding_increase(baseline_df, increase))
    
    # Run drought scenarios
    drought_scenarios = []
    for severity in ['moderate', 'severe']:
        drought_scenarios.append(simulate_drought_shock(baseline_df, severity))
    
    # Combine all scenarios
    all_scenarios = [baseline_df] + funding_scenarios + drought_scenarios
    combined_df = pd.concat(all_scenarios, ignore_index=True)
    
    # Save results
    os.makedirs('data/processed', exist_ok=True)
    combined_df.to_csv('data/processed/scenario_simulations.csv', index=False)
    
    print("Scenario simulations completed and saved.")
    print(f"Total scenarios: {len(combined_df['scenario'].unique())}")
    print(f"Scenarios: {', '.join(combined_df['scenario'].unique())}")

if __name__ == "__main__":
    run_scenario_simulations()