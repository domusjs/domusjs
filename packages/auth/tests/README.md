# Auth Module Tests

This directory contains comprehensive unit tests for the auth module using Vitest.

## Test Structure

```
tests/
├── setup.ts                           # Test setup and mocks
├── unit/
│   ├── auth.service.test.ts          # AuthService tests
│   ├── jwt.service.test.ts           # JWTService tests
│   ├── jwt.middleware.test.ts        # JWT middleware tests
│   ├── register.test.ts              # Module registration tests
│   ├── auth-strategy.interface.test.ts # Interface tests
│   ├── authenticated-request.interface.test.ts # Interface tests
│   └── integration.test.ts           # Integration tests
└── README.md                         # This file
```

## Test Coverage

### AuthService Tests
- Strategy registration and management
- Login functionality with different strategies
- Error handling for unregistered strategies
- Complex payload and result type handling
- Integration scenarios

### JWTService Tests
- JWT token signing with different payloads
- Token verification and error handling
- Different expiration time formats
- Type safety with generic payloads
- Error propagation

### JWT Middleware Tests
- Authorization header validation
- Token extraction and verification
- Error handling for invalid tokens
- Request modification with auth data
- Container service resolution
- Type safety with generic payloads

### Register Function Tests
- JWTService registration with configuration
- AuthService registration
- Strategy registration and management
- Container registration order
- Error handling scenarios

### Interface Tests
- AuthStrategy interface compatibility
- StrategyClass type safety
- AuthenticatedRequest interface structure
- Express middleware compatibility
- Real-world usage patterns

### Integration Tests
- Complete authentication flow
- Service registration and resolution
- Multiple strategy support
- Error handling across components
- Type safety integration

## Running Tests

### Install Dependencies
```bash
cd packages/auth
pnpm install
```

### Run Tests
```bash
# Run tests in watch mode
pnpm test

# Run tests once
pnpm test:run

# Run tests with coverage
pnpm test:coverage
```

## Test Configuration

The tests use Vitest with the following configuration:

- **Environment**: Node.js
- **Setup**: `tests/setup.ts` for mocks and configuration
- **Coverage**: V8 provider with HTML, JSON, and text reports
- **Aliases**: `@domusjs/core` mapped to the core package

## Mocking Strategy

### External Dependencies
- **tsyringe**: Container operations are mocked
- **jsonwebtoken**: JWT operations are mocked
- **@domusjs/core**: UnauthorizedError is mocked

### Test Utilities
- Mock strategy implementations for testing
- Request/Response mocks for middleware testing
- Container service resolution mocks

## Best Practices

1. **Isolation**: Each test is isolated with proper setup/teardown
2. **Mocking**: External dependencies are properly mocked
3. **Type Safety**: Tests verify TypeScript type safety
4. **Error Handling**: Both success and failure scenarios are tested
5. **Integration**: End-to-end flows are tested
6. **Edge Cases**: Boundary conditions and error scenarios are covered

## Adding New Tests

When adding new tests:

1. Follow the existing naming convention: `*.test.ts`
2. Use descriptive test names that explain the scenario
3. Mock external dependencies appropriately
4. Test both success and failure cases
5. Include type safety tests for new interfaces
6. Add integration tests for new functionality

## Coverage Goals

The tests aim for high coverage of:
- ✅ All public methods and functions
- ✅ Error handling paths
- ✅ Type safety scenarios
- ✅ Integration flows
- ✅ Edge cases and boundary conditions 