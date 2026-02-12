import pandas as pd
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import datetime

def check_data_quality_alerts():
    """
    Check for data quality deterioration and trigger alerts.
    
    NGO relevance: Automated alerts enable rapid response to data quality issues,
    ensuring reliable malnutrition risk predictions for program implementation.
    
    Returns:
        list: List of alerts triggered
    """
    # Load county scores
    scores_df = pd.read_csv('data/processed/county_data_quality_scores.csv')
    scores_df['date'] = pd.to_datetime(scores_df['date'] + '-01')
    scores_df = scores_df.sort_values(['county', 'date'])
    
    alerts = []
    
    for county in scores_df['county'].unique():
        county_data = scores_df[scores_df['county'] == county].copy()
        
        if len(county_data) < 1:
            continue
        
        # Latest score
        latest_score = county_data.iloc[-1]['score']
        
        # Alert 1: Score below 60
        if latest_score < 60:
            alerts.append({
                'county': county,
                'type': 'critical_score',
                'message': f"Data quality score below 60: {latest_score:.1f}",
                'severity': 'high'
            })
        
        # Alert 2: Month-over-month decline > 15 points
        if len(county_data) >= 2:
            prev_score = county_data.iloc[-2]['score']
            decline = prev_score - latest_score
            if decline > 15:
                alerts.append({
                    'county': county,
                    'type': 'sharp_decline',
                    'message': f"Sharp decline: {decline:.1f} points in one month",
                    'severity': 'medium'
                })
        
        # Alert 3: Persistent downward trend over 3 months
        if len(county_data) >= 3:
            recent_scores = county_data.tail(3)['score'].values
            trend = recent_scores[0] - recent_scores[-1]  # Overall decline
            if trend > 10:  # More than 10 points over 3 months
                alerts.append({
                    'county': county,
                    'type': 'downward_trend',
                    'message': f"Downward trend: {trend:.1f} points over 3 months",
                    'severity': 'medium'
                })
    
    return alerts

def send_alert_email(alert):
    """
    Send email alert for data quality issue.
    
    Uses SMTP placeholder configuration - in production, configure with actual SMTP server.
    Currently stubs email sending for local development.
    
    Args:
        alert (dict): Alert details
    """
    # Email configuration (placeholder - DO NOT hardcode credentials)
    SMTP_SERVER = 'localhost'  # Placeholder for local SMTP or actual server
    SMTP_PORT = 587
    SENDER_EMAIL = 'alerts@malnutrition-project.org'
    RECIPIENT_EMAILS = ['data-officer@county-health.go.ke', 'ngo-monitor@unicef.org']
    
    # Create message
    msg = MIMEMultipart()
    msg['From'] = SENDER_EMAIL
    msg['To'] = ', '.join(RECIPIENT_EMAILS)
    msg['Subject'] = f"Data Quality Alert – {alert['county']}"
    
    # Body
    body = f"""
Data Quality Alert for {alert['county']}

Issue: {alert['message']}

Why it matters:
Poor data quality can lead to unreliable malnutrition risk predictions, potentially
causing missed outbreaks or inefficient resource allocation in humanitarian programs.

Recommended action:
1. Review data collection processes in {alert['county']}
2. Verify data entry and transmission systems
3. Contact local health facilities for data validation
4. Update the data quality dashboard and rerun validation

This is an automated alert from the Kenya Malnutrition Risk Prediction system.
For programmatic decision support only. Not for clinical use.

Generated: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
    """
    
    msg.attach(MIMEText(body, 'plain'))
    
    # Send email (stubbed for safety)
    try:
        # Uncomment and configure for actual sending
        # server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        # server.starttls()
        # server.login(SENDER_EMAIL, 'password')  # NEVER hardcode
        # server.sendmail(SENDER_EMAIL, RECIPIENT_EMAILS, msg.as_string())
        # server.quit()
        
        print("ALERT EMAIL (STUBBED):")
        print(f"To: {', '.join(RECIPIENT_EMAILS)}")
        print(f"Subject: {msg['Subject']}")
        print(body)
        print("-" * 50)
        
    except Exception as e:
        print(f"Failed to send email: {e}")

def run_alerts():
    """
    Run data quality alert checks and send notifications.
    """
    alerts = check_data_quality_alerts()
    
    print(f"Data Quality Alert Check - {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Total alerts triggered: {len(alerts)}")
    
    for alert in alerts:
        print(f"[{alert['severity'].upper()}] {alert['county']}: {alert['message']}")
        send_alert_email(alert)
    
    if not alerts:
        print("No alerts triggered - data quality is acceptable.")

if __name__ == "__main__":
    run_alerts()