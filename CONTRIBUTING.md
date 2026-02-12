# Contributing to Kenya Childhood Malnutrition Risk Prediction System

Thank you for your interest in contributing to the Kenya Childhood Malnutrition Risk Prediction System! This document outlines the process for contributing to this project.

## Table of Contents
- [Getting Started](#getting-started)
- [Development Environment](#development-environment)
- [Running Tests](#running-tests)
- [Code Style](#code-style)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
   ```bash
   git clone https://github.com/YOUR_USERNAME/Kenya-Childhood-Malnutrition-Risk-Prediction-System.git
   cd Kenya-Childhood-Malnutrition-Risk-Prediction-System
   ```
3. Create a branch for your changes
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Environment

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install the package in development mode:
   ```bash
   pip install -e .[dev]
   ```

3. Install pre-commit hooks (optional but recommended):
   ```bash
   pre-commit install
   ```

## Running Tests

To run all tests:
```bash
pytest
```

To run tests with coverage:
```bash
pytest --cov=kam_forecast
```

## Code Style

- Follow PEP 8 style guidelines
- Use Black for code formatting
- Use Ruff for linting
- Write docstrings for all public functions and classes
- Use type hints where appropriate

To format your code:
```bash
black .
```

To lint your code:
```bash
ruff check .
```

## Pull Request Process

1. Ensure your changes include appropriate tests
2. Update documentation as needed
3. Make sure all tests pass
4. Submit a pull request with a clear description of your changes
5. Link any relevant issues in the pull request description

## Reporting Issues

When reporting issues, please include:
- A clear description of the problem
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Python version and OS information
- Any relevant error messages or logs

## Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## Questions?

If you have questions about contributing, feel free to open an issue for discussion.