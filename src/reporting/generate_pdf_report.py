import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.units import inch
import os
from datetime import datetime
from src.dqr.dqr_mapping import add_dqr_dimensions
from src.scoring.compute_scores import compute_data_quality_scores

def generate_monthly_pdf_report(report_month):
    """
    Generate a WHO DQR-style monthly PDF report for data quality.
    
    Follows WHO Data Quality Review framework for standardized health data
    quality reporting, suitable for UN/NGO programmatic decision-making.
    
    Args:
        report_month (str): Month in YYYY-MM format.
    """
    # Load data
    validation_df = pd.read_csv('data/processed/validation_report.csv')
    validation_df['date'] = pd.to_datetime(validation_df['date'])
    validation_df['month'] = validation_df['date'].dt.to_period('M').astype(str)
    
    scores_df = compute_data_quality_scores()
    scores_df['date'] = pd.to_datetime(scores_df['date']).dt.to_period('M').astype(str)
    
    # Filter for the report month
    monthly_validation = validation_df[validation_df['month'] == report_month]
    monthly_scores = scores_df[scores_df['date'] == report_month]
    
    if monthly_validation.empty:
        print(f"No data for month {report_month}")
        return
    
    # Create reports directory
    os.makedirs('reports', exist_ok=True)
    
    # PDF filename
    filename = f"reports/data_quality_report_{report_month}.pdf"
    
    # Create PDF document
    doc = SimpleDocTemplate(filename, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []
    
    # Title page
    title_style = ParagraphStyle('Title', parent=styles['Title'], fontSize=18, spaceAfter=30)
    story.append(Paragraph("Kenya Childhood Malnutrition Surveillance", title_style))
    story.append(Paragraph("Data Quality Review Report", styles['Title']))
    story.append(Paragraph(f"Reporting Month: {report_month}", styles['Heading2']))
    story.append(Spacer(1, 0.5*inch))
    story.append(Paragraph("WHO Data Quality Review Framework", styles['Heading3']))
    story.append(Spacer(1, 0.5*inch))
    story.append(Paragraph("Disclaimer: For programmatic decision support only. Not for clinical use.", styles['Italic']))
    story.append(Spacer(1, 1*inch))
    
    # Executive summary
    story.append(Paragraph("Executive Summary", styles['Heading1']))
    total_issues = len(monthly_validation)
    avg_score = monthly_scores['score'].mean()
    critical_counties = len(monthly_scores[monthly_scores['score'] < 70])
    
    summary_text = f"""
    This report presents data quality assessment for {report_month} using WHO Data Quality Review standards.
    Key findings: {total_issues} data quality issues identified across all counties.
    Average data quality score: {avg_score:.1f}/100. {critical_counties} counties require immediate attention.
    """
    story.append(Paragraph(summary_text, styles['Normal']))
    story.append(Spacer(1, 0.5*inch))
    
    # County scores table
    story.append(Paragraph("County Data Quality Scores", styles['Heading2']))
    table_data = [['County', 'Score']]
    for _, row in monthly_scores.sort_values('score').iterrows():
        table_data.append([row['county'], f"{row['score']:.1f}"])
    
    table = Table(table_data)
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 14),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    story.append(table)
    story.append(Spacer(1, 0.5*inch))
    
    # Generate and add charts
    # Chart 1: Issues by DQR dimension
    plt.figure(figsize=(8, 6))
    validation_with_dqr = add_dqr_dimensions(monthly_validation)
    dimension_counts = validation_with_dqr['dqr_dimension'].value_counts()
    dimension_counts.plot(kind='bar', color='skyblue')
    plt.title(f'Issues by WHO DQR Dimension - {report_month}')
    plt.ylabel('Number of Issues')
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    chart1_path = f'reports/temp_chart1_{report_month}.png'
    plt.savefig(chart1_path)
    plt.close()
    
    story.append(Paragraph("Issues by WHO DQR Dimension", styles['Heading2']))
    story.append(Image(chart1_path, width=6*inch, height=4*inch))
    story.append(Spacer(1, 0.5*inch))
    
    # Chart 2: Score trend (if multiple months available)
    all_scores = compute_data_quality_scores()
    all_scores['date'] = pd.to_datetime(all_scores['date'] + '-01')  # Convert to datetime
    trend_scores = all_scores.groupby('date')['score'].mean().reset_index()
    
    plt.figure(figsize=(8, 6))
    plt.plot(trend_scores['date'], trend_scores['score'], marker='o', linewidth=2)
    plt.title('Data Quality Score Trend')
    plt.ylabel('Average Score')
    plt.xlabel('Month')
    plt.grid(True, alpha=0.3)
    plt.xticks(rotation=45)
    plt.tight_layout()
    chart2_path = f'reports/temp_chart2_{report_month}.png'
    plt.savefig(chart2_path)
    plt.close()
    
    story.append(Paragraph("Data Quality Score Trend", styles['Heading2']))
    story.append(Image(chart2_path, width=6*inch, height=4*inch))
    story.append(Spacer(1, 0.5*inch))
    
    # Key risks section
    story.append(Paragraph("Key Risks and Recommendations", styles['Heading2']))
    critical_counties_list = monthly_scores[monthly_scores['score'] < 70]['county'].tolist()
    if critical_counties_list:
        risks_text = f"Counties with critically low data quality scores (<70): {', '.join(critical_counties_list)}. " \
                    "Immediate follow-up recommended to improve data completeness and accuracy for reliable malnutrition monitoring."
    else:
        risks_text = "No counties identified with critical data quality concerns for this month."
    
    story.append(Paragraph(risks_text, styles['Normal']))
    
    # Footer
    story.append(Spacer(1, 1*inch))
    story.append(Paragraph("For programmatic decision support only. Not for clinical use.", styles['Italic']))
    
    # Build PDF
    doc.build(story)
    
    # Clean up temp files
    for temp_file in [chart1_path, chart2_path]:
        if os.path.exists(temp_file):
            os.remove(temp_file)
    
    print(f"PDF report generated: {filename}")

def generate_all_monthly_reports():
    """
    Generate PDF reports for all available months in the data.
    """
    scores_df = compute_data_quality_scores()
    months = scores_df['date'].unique()
    
    for month in months:
        generate_monthly_pdf_report(month)

if __name__ == "__main__":
    # Generate reports for all months
    generate_all_monthly_reports()