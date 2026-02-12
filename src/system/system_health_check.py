import os
import sys
import subprocess
import importlib.util

def check_directory_integrity():
    """
    Verify all required project directories exist and create missing ones.
    
    Ensures the project structure is complete for reliable execution.
    
    Returns:
        dict: Status of directory checks
    """
    required_dirs = [
        'data/raw',
        'data/processed',
        'models',
        'reports',
        'src/data',
        'src/features',
        'src/models',
        'src/validation',
        'src/dqr',
        'src/scoring',
        'src/reporting',
        'src/uncertainty',
        'src/alerts',
        'src/governance',
        'src/scenarios',
        'src/system',
        'app'
    ]
    
    missing_dirs = []
    for dir_path in required_dirs:
        if not os.path.exists(dir_path):
            os.makedirs(dir_path, exist_ok=True)
            missing_dirs.append(dir_path)
    
    return {
        'status': 'PASS' if not missing_dirs else 'FIXED',
        'message': f"Created {len(missing_dirs)} missing directories" if missing_dirs else "All directories present",
        'details': missing_dirs
    }

def check_dependencies():
    """
    Validate that required Python packages are installed.

    Critical for ensuring the system can run without import errors.

    Returns:
        dict: Status of dependency checks
    """
    required_packages = [
        'pandas',
        'numpy',
        'sklearn',  # scikit-learn is imported as sklearn
        'matplotlib',
        'seaborn',
        'streamlit',
        'reportlab',
        'pptx'  # python-pptx is imported as pptx
    ]

    missing_packages = []
    for package in required_packages:
        try:
            importlib.import_module(package)
        except ImportError:
            missing_packages.append(package)

    return {
        'status': 'PASS' if not missing_packages else 'FAIL',
        'message': f"Missing {len(missing_packages)} packages" if missing_packages else "All packages installed",
        'details': missing_packages
    }

def check_data_readiness():
    """
    Confirm presence and basic validity of required input/output files.
    
    Ensures data pipeline components have necessary inputs.
    
    Returns:
        dict: Status of data readiness checks
    """
    required_files = [
        ('data/raw/who_nutrition.csv', 'WHO nutrition data'),
        ('data/raw/unicef_wash.csv', 'UNICEF WASH data'),
        ('data/raw/dhis2_cases.csv', 'DHIS2 case data'),
        ('data/processed/validation_report.csv', 'Validation results'),
        ('data/processed/county_data_quality_scores.csv', 'Quality scores'),
        ('models/random_forest_weighted_model.pkl', 'Trained model')
    ]
    
    missing_files = []
    invalid_files = []
    
    for file_path, description in required_files:
        if not os.path.exists(file_path):
            missing_files.append(f"{file_path} ({description})")
        else:
            # Basic validation for CSV files
            if file_path.endswith('.csv'):
                try:
                    df = pd.read_csv(file_path, nrows=5)  # Read first 5 rows
                    if df.empty:
                        invalid_files.append(f"{file_path} (empty)")
                except Exception as e:
                    invalid_files.append(f"{file_path} (read error: {e})")
    
    status = 'PASS'
    if missing_files or invalid_files:
        status = 'WARN' if missing_files else 'FAIL'
    
    return {
        'status': status,
        'message': f"Data check: {len(missing_files)} missing, {len(invalid_files)} invalid",
        'details': {'missing': missing_files, 'invalid': invalid_files}
    }

def check_pipeline_health():
    """
    Run lightweight health checks on the data processing pipeline.

    Validates that core modules can execute without full processing.

    Returns:
        dict: Status of pipeline health checks
    """
    # Add project root to path for imports
    sys.path.insert(0, os.getcwd())
    
    # Test module imports
    modules_to_test = [
        ('src.data', 'Data loading'),
        ('src.validation', 'Validation'),
        ('src.scoring', 'Scoring'),
        ('src.uncertainty', 'Uncertainty'),
        ('src.scenarios', 'Scenarios')
    ]

    failed_modules = []
    for module_path, description in modules_to_test:
        try:
            importlib.import_module(module_path)
        except Exception as e:
            failed_modules.append(f"{description}: {str(e)}")

    return {
        'status': 'PASS' if not failed_modules else 'FAIL',
        'message': f"Pipeline check: {len(failed_modules)} module issues",
        'details': failed_modules
    }

def generate_health_report():
    """
    Run all system integrity checks and generate comprehensive health report.
    
    Produces a text report suitable for system administrators and developers.
    """
    report_lines = []
    report_lines.append("=" * 60)
    report_lines.append("KENYA MALNUTRITION PREDICTION SYSTEM HEALTH REPORT")
    report_lines.append("=" * 60)
    report_lines.append("")
    
    # Run all checks
    checks = {
        'Directory Integrity': check_directory_integrity(),
        'Dependencies': check_dependencies(),
        'Data Readiness': check_data_readiness(),
        'Pipeline Health': check_pipeline_health()
    }
    
    overall_status = 'PASS'
    for check_name, result in checks.items():
        report_lines.append(f"{check_name}: {result['status']}")
        report_lines.append(f"  {result['message']}")
        
        if result['details']:
            if isinstance(result['details'], list):
                for detail in result['details']:
                    report_lines.append(f"    - {detail}")
            elif isinstance(result['details'], dict):
                for key, values in result['details'].items():
                    report_lines.append(f"    {key.title()}:")
                    for value in values:
                        report_lines.append(f"      - {value}")
        
        report_lines.append("")
        
        if result['status'] in ['FAIL', 'WARN'] and overall_status == 'PASS':
            overall_status = 'WARN' if result['status'] == 'WARN' else 'FAIL'
    
    # Overall assessment
    report_lines.append("=" * 60)
    report_lines.append(f"OVERALL SYSTEM STATUS: {overall_status}")
    report_lines.append("=" * 60)
    
    if overall_status == 'PASS':
        report_lines.append("System is ready for production use.")
    elif overall_status == 'WARN':
        report_lines.append("System has warnings - review and address before production.")
    else:
        report_lines.append("System has critical issues - fix before proceeding.")
    
    report_lines.append("")
    report_lines.append("For technical support: systems@malnutrition-project.org")
    
    # Write report
    os.makedirs('reports', exist_ok=True)
    with open('reports/system_health_report.txt', 'w') as f:
        f.write('\n'.join(report_lines))
    
    # Print summary to console
    print(f"System Health Report generated: {overall_status}")
    print("Full report: reports/system_health_report.txt")

if __name__ == "__main__":
    generate_health_report()