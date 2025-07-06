# KaapiKart Testing Guide

This guide covers comprehensive testing for the KaapiKart coffee shop application, including payment testing in test mode and sandbox environments.

## 🚀 Quick Start

### Install Dependencies
```bash
# Install all dependencies (root, client, and server)
npm run install:all

# Or install individually
npm install
cd client && npm install
cd server && npm install
```

### Run Tests
```bash
# Run all tests (frontend + backend)
npm test

# Run frontend tests only
npm run test:client

# Run backend tests only
npm run test:server

# Run payment tests specifically
npm run test:payment

# Run tests with coverage
npm run test:coverage
```

## 🧪 Test Structure

### Frontend Tests (`client/src/__tests__/`)
- **PaymentPage.test.js** - Comprehensive payment flow testing
- **Component tests** - Individual component testing
- **Integration tests** - User flow testing
- **Accessibility tests** - ARIA and keyboard navigation

### Backend Tests (`server/tests/`)
- **payment.test.js** - Payment API testing
- **auth.test.js** - Authentication testing
- **order.test.js** - Order management testing
- **product.test.js** - Product management testing

## 💳 Payment Testing

### Test Mode Configuration

The application is configured to run in test mode by default, using sandbox environments for payment gateways.

#### Test Card Numbers
```javascript
// Success scenarios
'4242424242424242' // Visa - Successful payment
'5555555555554444' // MasterCard - Successful payment
'378282246310005'  // American Express - Successful payment

// Failure scenarios
'4000000000000002' // Declined payment
'4000000000009995' // Insufficient funds
'4000000000000069' // Expired card
'4000000000000127' // Incorrect CVC
'4000000000000119' // Processing error
```

#### Test UPI IDs
```javascript
// Valid UPI IDs
'test@upi'     // Generic UPI
'test@gpay'    // Google Pay
'test@phonepe' // PhonePe
'test@paytm'   // Paytm

// Invalid UPI IDs
'invalid-upi-id'
'test@'
'@upi'
```

### Payment Gateway Test Configuration

#### Razorpay Sandbox
```javascript
// Test API Keys
const razorpayConfig = {
  keyId: 'rzp_test_testkey',
  keySecret: 'test_secret_key',
  currency: 'INR',
  testMode: true
};
```

#### Stripe Sandbox
```javascript
// Test API Keys
const stripeConfig = {
  publishableKey: 'pk_test_testkey',
  secretKey: 'sk_test_testkey',
  currency: 'inr',
  testMode: true
};
```

### Running Payment Tests

#### Frontend Payment Tests
```bash
# Run payment-specific frontend tests
npm run test:payment

# Run with coverage
npm run test:coverage -- --testPathPattern=payment
```

#### Backend Payment Tests
```bash
# Run payment-specific backend tests
cd server && npm run test:payment

# Run with coverage
cd server && npm run test:coverage -- --testPathPattern=payment
```

## 🔧 Test Utilities

### Frontend Test Utilities (`client/src/setupTests.js`)

```javascript
// Payment validation utilities
paymentTestUtils.validateCardNumber('4242424242424242'); // true
paymentTestUtils.validateUPIId('test@upi'); // true
paymentTestUtils.getCardBrand('4242424242424242'); // 'visa'
paymentTestUtils.formatCardNumber('4242424242424242'); // '4242 4242 4242 4242'

// Mock payment responses
paymentTestUtils.mockPaymentResponses.success;
paymentTestUtils.mockPaymentResponses.failure;
paymentTestUtils.mockPaymentResponses.pending;
```

### Backend Test Utilities (`server/tests/setup.js`)

```javascript
// Create test data
const testUser = await testUtils.createTestUser(User);
const testProduct = await testUtils.createTestProduct(Product);
const testOrder = await testUtils.createTestOrder(Order);

// Generate test tokens
const authToken = testUtils.generateTestToken(userId, isAdmin);
```

## 📋 Test Scenarios

### Payment Flow Testing

#### 1. Card Payment Success
```javascript
// Test successful card payment
const paymentData = {
  orderId: testOrder._id,
  paymentMethod: 'card',
  cardDetails: {
    number: '4242424242424242',
    expiryMonth: '12',
    expiryYear: '2025',
    cvv: '123',
    cardholderName: 'Test User'
  },
  amount: 1000
};
```

#### 2. Card Payment Failure
```javascript
// Test failed card payment
const paymentData = {
  orderId: testOrder._id,
  paymentMethod: 'card',
  cardDetails: {
    number: '4000000000000002', // Test failure card
    expiryMonth: '12',
    expiryYear: '2025',
    cvv: '123',
    cardholderName: 'Test User'
  },
  amount: 1000
};
```

#### 3. UPI Payment
```javascript
// Test UPI payment
const paymentData = {
  orderId: testOrder._id,
  paymentMethod: 'upi',
  upiDetails: {
    upiId: 'test@upi',
    app: 'gpay'
  },
  amount: 1000
};
```

#### 4. Cash on Delivery
```javascript
// Test COD payment
const paymentData = {
  orderId: testOrder._id,
  paymentMethod: 'cod',
  amount: 1000
};
```

### Validation Testing

#### Card Number Validation
```javascript
// Test Luhn algorithm
expect(paymentTestUtils.validateCardNumber('4242424242424242')).toBe(true);
expect(paymentTestUtils.validateCardNumber('1234567890123456')).toBe(false);
```

#### UPI ID Validation
```javascript
// Test UPI format
expect(paymentTestUtils.validateUPIId('test@upi')).toBe(true);
expect(paymentTestUtils.validateUPIId('invalid-upi')).toBe(false);
```

#### Expiry Date Validation
```javascript
// Test card expiry
const pastDate = new Date('2020-01-01');
const futureDate = new Date('2025-12-31');
expect(isCardExpired(pastDate)).toBe(true);
expect(isCardExpired(futureDate)).toBe(false);
```

## 🎯 Test Coverage Goals

### Frontend Coverage
- **Lines**: 70%
- **Functions**: 70%
- **Branches**: 70%
- **Statements**: 70%

### Backend Coverage
- **Lines**: 70%
- **Functions**: 70%
- **Branches**: 70%
- **Statements**: 70%

## 🔍 Debugging Tests

### Frontend Test Debugging
```bash
# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- PaymentPage.test.js

# Run tests with verbose output
npm test -- --verbose

# Debug failing tests
npm test -- --detectOpenHandles
```

### Backend Test Debugging
```bash
# Run tests in watch mode
cd server && npm run test:watch

# Run specific test file
cd server && npm test -- payment.test.js

# Run tests with verbose output
cd server && npm test -- --verbose

# Debug database issues
cd server && npm test -- --detectOpenHandles
```

## 🚨 Common Test Issues

### Frontend Issues
1. **Component not rendering**: Check if all required providers are wrapped
2. **Async operations**: Use `waitFor` for async operations
3. **Mock issues**: Ensure mocks are properly set up in `setupTests.js`

### Backend Issues
1. **Database connection**: Ensure MongoDB memory server is running
2. **Authentication**: Check if JWT tokens are properly generated
3. **API endpoints**: Verify route paths and HTTP methods

## 📊 Test Reports

### Generate Coverage Reports
```bash
# Frontend coverage
npm run test:coverage

# Backend coverage
cd server && npm run test:coverage

# Combined coverage
npm run test:coverage
```

### Coverage Reports Location
- **Frontend**: `client/coverage/lcov-report/index.html`
- **Backend**: `server/coverage/lcov-report/index.html`

## 🔐 Environment Variables for Testing

### Frontend (.env.test)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_PAYMENT_TEST_MODE=true
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_testkey
REACT_APP_RAZORPAY_KEY_ID=rzp_test_testkey
```

### Backend (.env.test)
```env
NODE_ENV=test
JWT_SECRET=test-secret-key
MONGODB_URI=mongodb://localhost:27017/test
PAYMENT_TEST_MODE=true
STRIPE_SECRET_KEY=sk_test_testkey
RAZORPAY_KEY_SECRET=test_secret_key
```

## 🎉 Continuous Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm run install:all
      - run: npm run test:ci
      - run: npm run test:coverage
```

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server)

## 🤝 Contributing to Tests

1. Write tests for new features
2. Ensure test coverage meets requirements
3. Use descriptive test names
4. Follow the existing test patterns
5. Update this guide when adding new test utilities

---

**Note**: Always run tests in test mode to avoid real payment processing. The sandbox environment ensures no real charges are made during testing. 