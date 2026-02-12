#!/bin/bash
# GitHub Push Script for Kenya Childhood Malnutrition Risk Prediction System

echo "🚀 Preparing to push Kenya Childhood Malnutrition Risk Prediction System to GitHub..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Initializing..."
    git init
    if [ $? -ne 0 ]; then
        echo "❌ Failed to initialize git repository"
        exit 1
    fi
fi

echo "✅ Git repository found/initialized"

# Add all files to staging
echo "📦 Adding files to staging..."
git add .

if [ $? -ne 0 ]; then
    echo "❌ Failed to add files to staging"
    exit 1
fi

echo "✅ Files added to staging"

# Check for changes
git diff --cached --quiet
if [ $? -eq 0 ]; then
    echo "ℹ️  No changes to commit"
    exit 0
fi

# Create commit
echo "📝 Creating commit..."
git config user.name "Auto Commit"
git config user.email "auto@example.com"
git commit -m " feat: Add complete system with test data generator and launcher

- Implement comprehensive test data generator with realistic Kenyan health data
- Create system launcher with pipeline automation
- Add complete test suite with 19 passing tests
- Include debug scripts for system diagnostics
- Enhance documentation with file tree and workflow guides
- Fix model training time-based splitting issues
- Add proper error handling and logging throughout
- Implement configuration management for all parameters
- Create Streamlit dashboards with caching and error handling
- Add data quality validation and scoring modules
- Generate realistic test data for WHO, UNICEF, and DHIS2 sources
- Ensure all components work together in integrated pipeline
"
if [ $? -ne 0 ]; then
    echo "❌ Failed to create commit"
    exit 1
fi

echo "✅ Commit created successfully"

# Check if remote origin exists
remote_url=$(git remote get-url origin 2>/dev/null)
if [ -z "$remote_url" ]; then
    echo "🌐 No remote origin found. Please add your GitHub repository URL:"
    echo "git remote add origin <your-repository-url>"
    echo ""
    echo "Then run this script again, or manually push with:"
    echo "git push -u origin main"
    exit 0
else
    echo "📡 Remote origin found: $remote_url"
fi

# Push to remote
echo "📤 Pushing to GitHub..."
git push -u origin main

if [ $? -ne 0 ]; then
    echo "❌ Failed to push to GitHub"
    echo "💡 Tip: If this is a new repository, make sure to create it on GitHub first"
    exit 1
fi

echo "🎉 Successfully pushed to GitHub!"
echo "🔗 Your repository is now available at: $remote_url"