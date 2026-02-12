"""
Test runner for the Kenya Childhood Malnutrition Risk Prediction System.

This script discovers and runs all tests in the tests directory.
"""
import unittest
import sys
import os
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent))

def run_all_tests():
    """Discover and run all tests in the tests directory."""
    print("KENYA CHILDHOOD MALNUTRITION RISK PREDICTION SYSTEM - TEST RUNNER")
    print("=" * 70)
    
    # Discover tests
    loader = unittest.TestLoader()
    start_dir = Path(__file__).parent / "tests"
    
    if not start_dir.exists():
        print(f"Tests directory does not exist: {start_dir}")
        return False
    
    suite = loader.discover(start_dir, pattern='test_*.py')
    
    # Count total tests
    test_count = 0
    for test_group in suite:
        for test_case in test_group:
            test_count += test_case.countTestCases()
    
    print(f"Discovered {test_count} tests in {start_dir}")
    print()
    
    # Run tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # Print summary
    print("\n" + "=" * 70)
    print("TEST RUNNER SUMMARY:")
    print(f"Tests run: {result.testsRun}")
    print(f"Failures: {len(result.failures)}")
    print(f"Errors: {len(result.errors)}")
    print(f"Success rate: {((result.testsRun - len(result.failures) - len(result.errors)) / result.testsRun * 100):.1f}%")
    
    if result.failures:
        print("\nFailures:")
        for test, trace in result.failures:
            print(f"  {test}: {trace}")
    
    if result.errors:
        print("\nErrors:")
        for test, trace in result.errors:
            print(f"  {test}: {trace}")
    
    overall_success = result.wasSuccessful()
    print(f"\nOverall Result: {'ALL TESTS PASSED' if overall_success else 'SOME TESTS FAILED'}")
    
    return overall_success

def run_specific_test(test_file):
    """Run a specific test file."""
    print(f"Running specific test: {test_file}")
    
    # Import the test module
    import importlib.util
    spec = importlib.util.spec_from_file_location("test_module", test_file)
    test_module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(test_module)
    
    # Find and run tests in the module
    loader = unittest.TestLoader()
    suite = loader.loadTestsFromModule(test_module)
    
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    return result.wasSuccessful()

if __name__ == "__main__":
    if len(sys.argv) > 1:
        # Run specific test file
        test_file = Path(sys.argv[1])
        if test_file.exists():
            success = run_specific_test(test_file)
        else:
            print(f"Test file does not exist: {test_file}")
            success = False
    else:
        # Run all tests
        success = run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)