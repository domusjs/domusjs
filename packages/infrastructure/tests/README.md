# Infrastructure Package Test Suite

This directory contains the comprehensive test suite for the `@domusjs/infrastructure` package using Vitest.

## Test Structure

### Files

- **`validation/from-zod.test.ts`** - Tests for the Zod validation integration
  - Schema validation functionality
  - Error handling and validation details
  - Edge cases and complex schemas

- **`logger/pino-logger.test.ts`** - Tests for the PinoLogger class
  - Logging functionality across all levels
  - Metadata handling
  - Pino configuration and integration

- **`config/dependency-injection.test.ts`** - Tests for the DI configuration
  - Service registration with defaults
  - Override functionality
  - Container integration

- **`bus/command-bus/in-memory-command-bus.test.ts`** - Tests for the command bus
  - Command handler registration
  - Command dispatch functionality
  - Error handling and edge cases

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
# Run only validation tests
pnpm vitest validation/from-zod.test.ts

# Run only logger tests
pnpm vitest logger/pino-logger.test.ts

# Run only command bus tests
pnpm vitest bus/command-bus/in-memory-command-bus.test.ts
```

## Test Coverage

The test suite covers:

- ✅ **Validation Module**
  - Zod schema validation
  - Error handling with ValidationError
  - Complex nested schemas
  - Edge cases and type safety

- ✅ **Logger Module**
  - PinoLogger implementation
  - All log levels (info, error, warn, debug)
  - Metadata handling
  - Pino configuration

- ✅ **Dependency Injection**
  - Service registration with defaults
  - Override functionality
  - Container integration
  - Error handling

- ✅ **Command Bus**
  - Handler registration and resolution
  - Command dispatch
  - Error handling
  - Concurrent execution

## Mocking Strategy

The tests use comprehensive mocking to isolate units:

- **`tsyringe`** - Mocked container for dependency injection testing
- **`pino`** - Mocked logger to avoid actual logging during tests
- **`zod`** - Real Zod schemas for validation testing
- **`@domusjs/core`** - Mocked core interfaces

## Best Practices

1. **Isolation**: Each test is isolated with proper setup/teardown
2. **Mocking**: External dependencies are properly mocked
3. **Coverage**: All public APIs and edge cases are covered
4. **Readability**: Tests are descriptive and well-organized
5. **Maintainability**: Tests are structured for easy maintenance

## Adding New Tests

When adding new functionality to the infrastructure package:

1. Add unit tests for the new functionality
2. Update integration tests to include new scenarios
3. Ensure proper mocking of new dependencies
4. Update this README if needed

## Module-Specific Testing

### Validation Testing

Validation tests focus on:
- Schema validation success cases
- Error handling with proper error types
- Complex nested object validation
- Edge cases like null/undefined inputs

### Logger Testing

Logger tests focus on:
- All log level methods
- Metadata handling
- Pino configuration
- Integration scenarios

### Command Bus Testing

Command bus tests focus on:
- Handler registration and resolution
- Command dispatch functionality
- Error handling for missing handlers
- Concurrent execution scenarios

### Dependency Injection Testing

DI tests focus on:
- Default service registration
- Override functionality
- Container integration
- Error scenarios

## Troubleshooting

### Common Issues

1. **Vitest not found**: Ensure `vitest` is installed in devDependencies
2. **Type errors**: Check that TypeScript configuration includes test files
3. **Mock failures**: Verify mock implementations match actual APIs
4. **Core module imports**: Ensure `@domusjs/core` is properly mocked

### Debug Mode

Run tests in debug mode for more verbose output:

```bash
pnpm vitest --reporter=verbose
```

### Coverage Analysis

Generate coverage reports to identify untested code:

```bash
pnpm test:coverage
```

This will generate HTML coverage reports in the `coverage/` directory. 