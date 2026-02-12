"""
Test Data Generator for Kenya Childhood Malnutrition Risk Prediction System

This script generates realistic test data for the system to enable testing
and demonstration without requiring real data from WHO, UNICEF, or DHIS2.
"""
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from pathlib import Path
import os

def generate_test_data(output_dir="data/raw", num_months=24):
    """
    Generate realistic test data for the malnutrition prediction system.
    
    Args:
        output_dir (str): Directory to save the generated data files
        num_months (int): Number of months of data to generate
    """
    print("Generating test data for Kenya Childhood Malnutrition Risk Prediction System...")
    
    # Create output directory if it doesn't exist
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    
    # Define Kenyan counties and sub-counties
    counties = [
        "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", 
        "Thika", "Kitale", "Garissa", "Kakamega", "Malindi"
    ]
    
    sub_counties_per_county = {
        "Nairobi": ["Westlands", "Dagoretti", "Kamukunji", "Embakasi", "Kibra"],
        "Mombasa": ["Changamwe", "Jomvu", "Kisauni", "Nyali", "Likoni"],
        "Kisumu": ["Kisumu East", "Kisumu West", "Kisumu Central", "Seme", "Nyando"],
        "Nakuru": ["Nakuru Town West", "Nakuru Town East", "Bahati", "Gilgil", "Kuresoi"],
        "Eldoret": ["Uasin Gishu", "Moiben", "Ainabkoi", "Kapseret", "Turbo"],
        "Thika": ["Thika Town", "Gatundu", "Juja", "Kiambu", "Ruiru"],
        "Kitale": ["Teso North", "Teso South", "Nambale", "Matayos", "Butula"],
        "Garissa": ["Garissa Township", "Balambala", "Lagdera", "Dadaab", "Fafi"],
        "Kakamega": ["Kakamega Central", "Kakamega East", "Kakamega West", "Lugari", "Likuyani"],
        "Malindi": ["Malindi", "Magarini", "Ganze", "Kalifi", "Rabai"]
    }
    
    # Generate date range
    end_date = datetime.today()
    start_date = end_date - timedelta(days=num_months*30)  # Approximate months
    dates = pd.date_range(start=start_date, end=end_date, freq='MS')  # Month start
    
    print(f"Generating data for {len(counties)} counties, {num_months} months...")
    
    # Generate WHO Nutrition Data with the expected filename
    print("Generating WHO Nutrition Data...")
    who_records = []
    for county in counties:
        sub_counties = sub_counties_per_county[county]
        for sub_county in sub_counties:
            for date in dates:
                record = {
                    'county': county,
                    'sub_county': sub_county,
                    'date': date,
                    'population_under_5': np.random.randint(2000, 15000),
                    'nutrition_program_coverage': np.random.uniform(30, 95),
                    'stunting_rate': np.random.uniform(15, 45),
                    'wasting_rate': np.random.uniform(5, 25),
                    'underweight_rate': np.random.uniform(10, 35),
                    'exclusive_breastfeeding_rate': np.random.uniform(20, 70),
                    'mmf_complementarity': np.random.uniform(25, 80),
                    'mdd_diversity': np.random.uniform(30, 85),
                    'micronutrient_supplementation_rate': np.random.uniform(40, 90)
                }
                who_records.append(record)
    
    who_df = pd.DataFrame(who_records)
    # Save with the expected filename from config but as CSV
    who_filename = "who_nutrition.csv"  # Using a simpler name
    who_df.to_csv(Path(output_dir) / who_filename, index=False)
    print(f"WHO Nutrition data saved: {len(who_df)} records as {who_filename}")
    
    # Generate UNICEF WASH Data with the expected filename
    print("Generating UNICEF WASH Data...")
    unicef_records = []
    for county in counties:
        sub_counties = sub_counties_per_county[county]
        for sub_county in sub_counties:
            for date in dates:
                record = {
                    'county': county,
                    'sub_county': sub_county,
                    'date': date,
                    'water_access_pct': np.random.uniform(40, 98),
                    'sanitation_access_pct': np.random.uniform(35, 95),
                    'handwashing_facilities_pct': np.random.uniform(25, 85),
                    'safe_disposal_sanitation_pct': np.random.uniform(30, 90),
                    'basic_drinking_water_pct': np.random.uniform(45, 97),
                    'hygiene_promotion_coverage': np.random.uniform(20, 80),
                    'community_led_total_sanitation': np.random.uniform(10, 70),
                    'school_wash_access': np.random.uniform(30, 85)
                }
                unicef_records.append(record)
    
    unicef_df = pd.DataFrame(unicef_records)
    # Save with the expected filename from config but as CSV
    unicef_filename = "unicef_wash.csv"  # Using a simpler name
    unicef_df.to_csv(Path(output_dir) / unicef_filename, index=False)
    print(f"UNICEF WASH data saved: {len(unicef_df)} records as {unicef_filename}")
    
    # Generate DHIS2 Cases Data with the expected filename
    print("Generating DHIS2 Cases Data...")
    dhis2_records = []
    for county in counties:
        sub_counties = sub_counties_per_county[county]
        for sub_county in sub_counties:
            # Base trend with some seasonality
            base_cases = np.random.uniform(50, 300)  # Base number of cases
            for i, date in enumerate(dates):
                # Add some seasonality and random variation
                seasonal_factor = 1 + 0.3 * np.sin(2 * np.pi * date.month / 12)  # Seasonal effect
                trend = 1 + 0.005 * i  # Slight increasing trend
                noise = np.random.normal(1, 0.1)  # Random noise
                
                # Calculate acute malnutrition cases with some correlation to other factors
                acute_cases = max(10, base_cases * seasonal_factor * trend * noise)
                
                # Severe acute malnutrition cases (typically 10-20% of acute cases)
                sam_cases = acute_cases * np.random.uniform(0.1, 0.25)
                
                # Moderate acute malnutrition cases (the remainder)
                mam_cases = acute_cases - sam_cases
                
                record = {
                    'county': county,
                    'sub_county': sub_county,
                    'date': date,
                    'acute_malnutrition_cases': int(acute_cases),
                    'severe_acute_malnutrition_cases': int(sam_cases),
                    'moderate_acute_malnutrition_cases': int(mam_cases),
                    'admission_rate': np.random.uniform(0.5, 5.0),
                    'cure_rate': np.random.uniform(70, 95),
                    'death_rate': np.random.uniform(1, 5),
                    'default_rate': np.random.uniform(2, 10),
                    'non_cured_rate': np.random.uniform(1, 8),
                    'coverage_rate': np.random.uniform(40, 85)
                }
                dhis2_records.append(record)
    
    dhis2_df = pd.DataFrame(dhis2_records)
    # Save with the expected filename from config but as CSV
    dhis2_filename = "dhis2_cases.csv"  # Using a simpler name
    dhis2_df.to_csv(Path(output_dir) / dhis2_filename, index=False)
    print(f"DHIS2 Cases data saved: {len(dhis2_df)} records as {dhis2_filename}")
    
    # Generate some additional contextual data (these are extra, not required by the system)
    print("Generating additional contextual data...")
    
    # Climate data
    climate_records = []
    for county in counties:
        sub_counties = sub_counties_per_county[county]
        for sub_county in sub_counties:
            for date in dates:
                record = {
                    'county': county,
                    'sub_county': sub_county,
                    'date': date,
                    'rainfall_mm': max(0, np.random.normal(80, 40)),  # Average rainfall
                    'temperature_avg': np.random.normal(22, 5),  # Average temperature
                    'drought_index': np.random.uniform(0, 10),  # Drought severity index
                    'flood_risk': np.random.uniform(0, 10)  # Flood risk index
                }
                climate_records.append(record)
    
    climate_df = pd.DataFrame(climate_records)
    climate_df.to_csv(Path(output_dir) / "climate_data.csv", index=False)
    print(f"Climate data saved: {len(climate_df)} records")
    
    # Economic data
    economic_records = []
    for county in counties:
        sub_counties = sub_counties_per_county[county]
        for sub_county in sub_counties:
            for date in dates:
                record = {
                    'county': county,
                    'sub_county': sub_county,
                    'date': date,
                    'poverty_rate': np.random.uniform(20, 70),
                    'household_income_index': np.random.uniform(30, 90),
                    'food_security_index': np.random.uniform(25, 85),
                    'market_accessibility': np.random.uniform(40, 95),
                    'agricultural_productivity': np.random.uniform(35, 90)
                }
                economic_records.append(record)
    
    economic_df = pd.DataFrame(economic_records)
    economic_df.to_csv(Path(output_dir) / "economic_data.csv", index=False)
    print(f"Economic data saved: {len(economic_df)} records")
    
    print("\nTest data generation completed!")
    print(f"Data files created in: {output_dir}")
    print(f"- {who_filename} ({len(who_df)} records)")
    print(f"- {unicef_filename} ({len(unicef_df)} records)")
    print(f"- {dhis2_filename} ({len(dhis2_df)} records)")
    print("- climate_data.csv (additional)")
    print("- economic_data.csv (additional)")
    
    total_records = len(who_df) + len(unicef_df) + len(dhis2_df) + len(climate_df) + len(economic_df)
    print(f"\nTotal records generated: {total_records:,}")
    
    # Show sample of the data
    print("\nSample of WHO Nutrition Data:")
    print(who_df.head())
    print("\nSample of DHIS2 Cases Data:")
    print(dhis2_df.head())


def main():
    """Main function to run the test data generator."""
    print("Kenya Childhood Malnutrition Risk Prediction - Test Data Generator")
    print("=" * 70)
    
    # Use default parameters directly
    output_dir = "data/raw"  # Use the standard data directory
    num_months = 12
    
    print(f"Generating test data in '{output_dir}' with {num_months} months of data...")
    
    generate_test_data(output_dir=output_dir, num_months=num_months)
    
    print("\nData generation complete! You can now run the system pipeline with this test data.")
    print("Note: You may need to update the config to use these new filenames.")


if __name__ == "__main__":
    main()