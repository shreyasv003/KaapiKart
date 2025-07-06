// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock fetch for API calls
global.fetch = jest.fn();

// Payment testing utilities
global.paymentTestUtils = {
  // Test card numbers for different scenarios
  testCards: {
    success: '4242424242424242',
    failure: '4000000000000002',
    insufficientFunds: '4000000000009995',
    expired: '4000000000000069',
    incorrectCvc: '4000000000000127',
    processingError: '4000000000000119',
    stolen: '4000000000009979',
    lost: '4000000000009987',
  },

  // Test UPI IDs
  testUPIIds: {
    valid: 'test@upi',
    invalid: 'invalid-upi-id',
    gpay: 'test@gpay',
    phonepe: 'test@phonepe',
    paytm: 'test@paytm',
  },

  // Mock payment responses
  mockPaymentResponses: {
    success: {
      success: true,
      transactionId: 'txn_test_123456',
      status: 'completed',
      amount: 1000,
      currency: 'INR',
      timestamp: new Date().toISOString(),
    },
    failure: {
      success: false,
      error: 'Payment failed',
      errorCode: 'PAYMENT_FAILED',
      timestamp: new Date().toISOString(),
    },
    pending: {
      success: true,
      transactionId: 'txn_test_789012',
      status: 'pending',
      amount: 1000,
      currency: 'INR',
      timestamp: new Date().toISOString(),
    },
  },

  // Validate card number using Luhn algorithm
  validateCardNumber: (cardNumber) => {
    const digits = cardNumber.replace(/\D/g, '');
    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  },

  // Validate UPI ID format
  validateUPIId: (upiId) => {
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/;
    return upiRegex.test(upiId);
  },

  // Get card brand from number
  getCardBrand: (cardNumber) => {
    const digits = cardNumber.replace(/\D/g, '');
    
    if (/^4/.test(digits)) return 'visa';
    if (/^5[1-5]/.test(digits)) return 'mastercard';
    if (/^3[47]/.test(digits)) return 'amex';
    if (/^6/.test(digits)) return 'discover';
    if (/^6[0-9]{15}$/.test(digits)) return 'rupay';
    
    return 'unknown';
  },

  // Format card number with spaces
  formatCardNumber: (cardNumber) => {
    const digits = cardNumber.replace(/\D/g, '');
    const groups = digits.match(/.{1,4}/g);
    return groups ? groups.join(' ') : digits;
  },

  // Generate test QR code data
  generateTestQRData: (upiId, amount) => {
    return `upi://pay?pa=${upiId}&pn=KaapiKart&am=${amount}&cu=INR&tn=Coffee Order`;
  },
};

// Mock console methods to reduce noise in tests
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is deprecated')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };

  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: componentWillReceiveProps') ||
       args[0].includes('Warning: componentWillUpdate'))
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});
