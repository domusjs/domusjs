# Cron Package Test Suite

This directory contains the comprehensive test suite for the `@domusjs/cron` package using Vitest.

## Test Structure

### Files

- **`cron.scheduler.test.ts`** - Tests for the `CronScheduler` class

  - Job registration functionality
  - Job scheduling and execution
  - Multiple job handling
  - Edge cases and error scenarios

- **`register.test.ts`** - Tests for the `registerCronModule` function

  - Dependency injection registration
  - Container integration
  - Registration strategy validation

- **`start.test.ts`** - Tests for the `startSchedulers` function

  - Scheduler resolution from container
  - Start functionality
  - Error handling

- **`integration.test.ts`** - End-to-end integration tests

  - Complete workflow testing
  - Multiple job scenarios
  - Error handling in real scenarios
  - Module export validation

- **`setup.ts`** - Global test configuration
  - Test environment setup
  - Global mocks and utilities

## Running Tests

### Prerequisites

Make sure you have the required dependencies installed:

```bash
pnpm install
```

### Test Commands

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### Individual Test Files

You can run specific test files:

```bash
# Run only scheduler tests
pnpm vitest cron.scheduler.test.ts

# Run only integration tests
pnpm vitest integration.test.ts
```

## Test Coverage

The test suite covers:

- ✅ **CronScheduler Class**

  - Job registration
  - Job scheduling
  - Task execution
  - Multiple job handling
  - Empty job list scenarios

- ✅ **Registration Module**

  - Container registration
  - Dependency injection setup
  - Registration strategy validation

- ✅ **Start Module**

  - Scheduler resolution
  - Start functionality
  - Error handling

- ✅ **Integration Scenarios**
  - Complete workflow testing
  - Real-world usage patterns
  - Error scenarios
  - Module exports

## Mocking Strategy

The tests use comprehensive mocking to isolate units:

- **`node-cron`** - Mocked to avoid actual cron execution during tests
- **`tsyringe`** - Mocked container for dependency injection testing
- **Task functions** - Mocked to verify execution without side effects

## Best Practices

1. **Isolation**: Each test is isolated with proper setup/teardown
2. **Mocking**: External dependencies are properly mocked
3. **Coverage**: All public APIs and edge cases are covered
4. **Readability**: Tests are descriptive and well-organized
5. **Maintainability**: Tests are structured for easy maintenance

## Adding New Tests

When adding new functionality to the cron package:

1. Add unit tests for the new functionality
2. Update integration tests to include new scenarios
3. Ensure proper mocking of new dependencies
4. Update this README if needed

## Troubleshooting

### Common Issues

1. **Vitest not found**: Ensure `vitest` is installed in devDependencies
2. **Type errors**: Check that TypeScript configuration includes test files
3. **Mock failures**: Verify mock implementations match actual APIs

### Debug Mode

Run tests in debug mode for more verbose output:

```bash
pnpm vitest --reporter=verbose
```
