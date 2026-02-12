import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from pptx import Presentation
from pptx.util import Inches
from pptx.enum.text import PP_ALIGN
import os

def create_donor_pitch_deck():
    """
    Generate a donor-ready PowerPoint presentation from project outputs.
    
    Public-sector relevance: Professional presentations enable effective
    communication with donors and partners for funding and collaboration
    on malnutrition prevention initiatives.
    """
    # Load data
    try:
        predictions = pd.read_csv('data/processed/predictions_with_uncertainty.csv')
        scores = pd.read_csv('data/processed/county_data_quality_scores.csv')
    except FileNotFoundError:
        print("Required data not found. Run pipelines first.")
        return
    
    predictions['date'] = pd.to_datetime(predictions['date'])
    scores['date'] = pd.to_datetime(scores['date'])
    
    # Get latest data
    latest_date = predictions['date'].max()
    latest_predictions = predictions[predictions['date'] == latest_date]
    latest_scores = scores[scores['date'] == latest_date]
    
    # Create presentation
    prs = Presentation()
    
    # Slide 1: Title
    slide = prs.slides.add_slide(prs.slide_layouts[0])
    title = slide.shapes.title
    subtitle = slide.placeholders[1]
    
    title.text = "Kenya Childhood Malnutrition Risk Prediction"
    subtitle.text = "An AI-Powered Early Warning System for Humanitarian Action\n\n" \
                   "Prepared for UNICEF, USAID, and Donor Partners"
    
    # Slide 2: Problem Statement
    slide = prs.slides.add_slide(prs.slide_layouts[1])
    title = slide.shapes.title
    content = slide.placeholders[1]
    
    title.text = "The Challenge: Childhood Malnutrition in Kenya"
    content.text = "• Kenya faces persistent acute malnutrition affecting hundreds of thousands of children\n" \
                  "• Current systems lack predictive capability for early intervention\n" \
                  "• Delayed response leads to preventable suffering and higher costs\n\n" \
                  "Impact: Without early warning, malnutrition outbreaks can spread rapidly, overwhelming health systems and wasting precious resources."
    
    # Slide 3: Data & Governance Credibility
    slide = prs.slides.add_slide(prs.slide_layouts[1])
    title = slide.shapes.title
    content = slide.placeholders[1]
    
    title.text = "Rigorous Data & WHO Standards"
    content.text = "• Built on WHO Data Quality Review (DQR) framework\n" \
                  "• Integrates DHIS2, UNICEF, and WHO indicators\n" \
                  "• Automated quality monitoring and alerts\n" \
                  "• Transparent, auditable machine learning models\n\n" \
                  "Trust: Every prediction includes uncertainty ranges and data quality scores."
    
    # Slide 4: Predictive Insights
    slide = prs.slides.add_slide(prs.slide_layouts[1])
    title = slide.shapes.title
    content = slide.placeholders[1]
    
    title.text = "Predictive Insights with Uncertainty"
    
    # Create trend chart
    national_trend = predictions.groupby('date').agg({
        'acute_malnutrition_cases': 'sum',
        'predicted_cases': 'sum',
        'lower_bound': 'sum',
        'upper_bound': 'sum'
    }).reset_index()
    
    fig, ax = plt.subplots(figsize=(10, 6))
    ax.plot(national_trend['date'], national_trend['acute_malnutrition_cases'], 
            label='Actual Cases', marker='o', linewidth=2)
    ax.plot(national_trend['date'], national_trend['predicted_cases'], 
            label='Predicted Cases', marker='s', linewidth=2, linestyle='--')
    ax.fill_between(national_trend['date'], national_trend['lower_bound'], 
                   national_trend['upper_bound'], alpha=0.3, label='Expected Range')
    ax.set_xlabel('Month')
    ax.set_ylabel('Total Cases')
    ax.legend()
    ax.grid(True, alpha=0.3)
    plt.title('Malnutrition Trends: Actual vs Predicted')
    plt.tight_layout()
    
    chart_path = 'reports/temp_trend.png'
    plt.savefig(chart_path)
    plt.close()
    
    # Add chart to slide
    slide.shapes.add_picture(chart_path, Inches(1), Inches(1.5), width=Inches(8))
    
    content.text = "The shaded area shows the expected range of cases, helping programs plan for uncertainty."
    
    # Slide 5: Risk & Opportunity Map
    slide = prs.slides.add_slide(prs.slide_layouts[1])
    title = slide.shapes.title
    content = slide.placeholders[1]
    
    title.text = "County-Level Risk Map"
    
    # Create county risk chart
    county_summary = latest_predictions.groupby('county').agg({
        'predicted_cases': 'sum'
    }).reset_index()
    
    county_summary = county_summary.merge(latest_scores, on='county', how='left')
    county_summary = county_summary.sort_values('predicted_cases', ascending=True)
    
    fig, ax = plt.subplots(figsize=(8, 10))
    bars = ax.barh(county_summary['county'], county_summary['predicted_cases'])
    
    for i, (bar, score) in enumerate(zip(bars, county_summary['score'])):
        if pd.isna(score) or score < 70:
            bar.set_color('red')
        elif score < 80:
            bar.set_color('orange')
        else:
            bar.set_color('green')
    
    ax.set_xlabel('Predicted Cases')
    ax.set_title('Predicted Cases by County')
    plt.tight_layout()
    
    risk_path = 'reports/temp_risk.png'
    plt.savefig(risk_path)
    plt.close()
    
    slide.shapes.add_picture(risk_path, Inches(1), Inches(1.5), width=Inches(8))
    
    content.text = "Green: Reliable predictions\nOrange: Moderate uncertainty\nRed: High uncertainty (data quality concerns)"
    
    # Slide 6: Programmatic Recommendations
    slide = prs.slides.add_slide(prs.slide_layouts[1])
    title = slide.shapes.title
    content = slide.placeholders[1]
    
    title.text = "Programmatic Recommendations"
    content.text = "• Target prevention in high-risk counties (shown in red)\n" \
                  "• Strengthen data collection in low-quality areas\n" \
                  "• Use uncertainty ranges for contingency planning\n" \
                  "• Integrate predictions into existing nutrition programs\n\n" \
                  "Impact: Early intervention can prevent 30-50% of severe cases through timely resource allocation."
    
    # Slide 7: Ethical Use & Safeguards
    slide = prs.slides.add_slide(prs.slide_layouts[1])
    title = slide.shapes.title
    content = slide.placeholders[1]
    
    title.text = "Ethical Design & Safeguards"
    content.text = "• Open-source and transparent methodology\n" \
                  "• No clinical decision-making - programmatic support only\n" \
                  "• Automated data quality monitoring\n" \
                  "• Privacy-protected (no individual data)\n" \
                  "• Regular audits and ethical reviews\n\n" \
                  "Commitment: Technology serves humanitarian goals without compromising ethics."
    
    # Slide 8: Call to Action
    slide = prs.slides.add_slide(prs.slide_layouts[1])
    title = slide.shapes.title
    content = slide.placeholders[1]
    
    title.text = "Call to Action"
    content.text = "Partner with us to:\n\n" \
                  "• Pilot the system in 5 priority counties\n" \
                  "• Train local health teams on data quality improvement\n" \
                  "• Scale successful interventions nationwide\n" \
                  "• Contribute to global malnutrition prevention efforts\n\n" \
                  "Together, we can save lives through data-driven action."
    
    # Save presentation
    os.makedirs('reports', exist_ok=True)
    prs.save('reports/donor_pitch_deck.pptx')
    
    # Clean up temp files
    for temp_file in [chart_path, risk_path]:
        if os.path.exists(temp_file):
            os.remove(temp_file)
    
    print("Donor pitch deck generated: reports/donor_pitch_deck.pptx")

if __name__ == "__main__":
    create_donor_pitch_deck()