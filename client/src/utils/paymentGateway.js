// Test Payment Gateway Configuration
const PAYMENT_CONFIG = {
  testMode: true,
  currency: 'INR'
};

// Card validation utilities
export const validateCardNumber = (number) => {
  const clean = number.replace(/\s/g, '');
  if (!/^\d{16}$/.test(clean)) return false;
  
  // Luhn algorithm
  let sum = 0, shouldDouble = false;
  for (let i = clean.length - 1; i >= 0; i--) {
    let digit = parseInt(clean[i]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
};

export const validateUPIId = (upiId) => {
  return /^[\w.-]+@[\w.-]+$/.test(upiId);
};

export const getCardBrand = (number) => {
  const clean = number.replace(/\s/g, '');
  if (/^4/.test(clean)) return 'visa';
  if (/^5[1-5]/.test(clean)) return 'mastercard';
  if (/^(34|37)/.test(clean)) return 'amex';
  if (/^(6011|65|64[4-9])/.test(clean)) return 'discover';
  if (/^(60|6521|6522)/.test(clean)) return 'rupay';
  return '';
};

// Card-specific validation rules
export const getCardValidationRules = (cardNumber) => {
  const brand = getCardBrand(cardNumber);
  const clean = cardNumber.replace(/\s/g, '');
  
  const rules = {
    visa: {
      nameMinLength: 3,
      nameMaxLength: 26,
      cvvLength: 3,
      namePattern: /^[A-Z\s]+$/,
      description: 'Visa cards require 3-digit CVV and names with only letters and spaces'
    },
    mastercard: {
      nameMinLength: 3,
      nameMaxLength: 26,
      cvvLength: 3,
      namePattern: /^[A-Z\s]+$/,
      description: 'MasterCard requires 3-digit CVV and names with only letters and spaces'
    },
    amex: {
      nameMinLength: 3,
      nameMaxLength: 20,
      cvvLength: 4,
      namePattern: /^[A-Z\s]+$/,
      description: 'American Express requires 4-digit CVV and shorter names'
    },
    discover: {
      nameMinLength: 3,
      nameMaxLength: 26,
      cvvLength: 3,
      namePattern: /^[A-Z\s]+$/,
      description: 'Discover cards require 3-digit CVV and names with only letters and spaces'
    },
    rupay: {
      nameMinLength: 3,
      nameMaxLength: 26,
      cvvLength: 3,
      namePattern: /^[A-Z\s]+$/,
      description: 'RuPay cards require 3-digit CVV and names with only letters and spaces'
    }
  };
  
  return rules[brand] || rules.visa; // Default to Visa rules if brand not recognized
};

// Enhanced validation functions
export const validateCardHolderName = (name, cardNumber) => {
  const rules = getCardValidationRules(cardNumber);
  
  if (!name || name.length < rules.nameMinLength || name.length > rules.nameMaxLength) {
    return { valid: false, message: `Name must be ${rules.nameMinLength}-${rules.nameMaxLength} characters` };
  }
  
  if (!rules.namePattern.test(name)) {
    return { valid: false, message: 'Name can only contain letters and spaces' };
  }
  
  return { valid: true, message: 'Valid name' };
};

export const validateCVV = (cvv, cardNumber) => {
  const rules = getCardValidationRules(cardNumber);
  
  if (!cvv || cvv.length !== rules.cvvLength) {
    return { 
      valid: false, 
      message: `${getCardBrand(cardNumber).toUpperCase()} requires ${rules.cvvLength}-digit CVV` 
    };
  }
  
  if (!/^\d+$/.test(cvv)) {
    return { valid: false, message: 'CVV must contain only numbers' };
  }
  
  return { valid: true, message: 'Valid CVV' };
};

export const validateExpiryDate = (month, year, cardNumber) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const expiryYear = parseInt('20' + year);
  const expiryMonth = parseInt(month);
  
  if (!month || !year) {
    return { valid: false, message: 'Please select both month and year' };
  }
  
  if (expiryYear < currentYear) {
    return { valid: false, message: 'Card has expired' };
  }
  
  if (expiryYear === currentYear && expiryMonth < currentMonth) {
    return { valid: false, message: 'Card has expired' };
  }
  
  // Check for reasonable expiry dates (not too far in future)
  if (expiryYear > currentYear + 10) {
    return { valid: false, message: 'Expiry year seems too far in the future' };
  }
  
  return { valid: true, message: 'Valid expiry date' };
};

export const formatCardNumber = (value) => {
  return value.replace(/[^0-9]/g, '').replace(/(.{4})/g, '$1 ').trim();
};

// Test payment processing functions
export const processCardPayment = async (paymentData) => {
  // Simulate payment processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate payment success/failure based on card number
  const cardNumber = paymentData.cardNumber.replace(/\s/g, '');
  
  // Check if it's a test card number
  const isTestCard = Object.values(TEST_CARDS).includes(cardNumber);
  
  if (isTestCard) {
    throw new Error('Payment failed: Test card numbers are not accepted. Please use a real card number.');
  }
  
  // Validate card number format and Luhn algorithm
  if (!validateCardNumber(cardNumber)) {
    throw new Error('Payment failed: Invalid card number. Please check and try again.');
  }
  
  // Check if it's a realistic card number (starts with valid prefixes)
  const validPrefixes = [
    '4', // Visa
    '5', // MasterCard
    '34', '37', // American Express
    '6' // Discover, RuPay
  ];
  
  const hasValidPrefix = validPrefixes.some(prefix => cardNumber.startsWith(prefix));
  
  if (!hasValidPrefix) {
    throw new Error('Payment failed: Invalid card type. Please use a valid Visa, MasterCard, American Express, or Discover card.');
  }
  
  // Validate expiry date
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const expiryYear = parseInt('20' + paymentData.expiryYear);
  const expiryMonth = parseInt(paymentData.expiryMonth);
  
  if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
    throw new Error('Payment failed: Card has expired. Please use a valid card.');
  }
  
  // Validate CVV
  if (!/^\d{3,4}$/.test(paymentData.cvv)) {
    throw new Error('Payment failed: Invalid CVV. Please enter a valid 3 or 4 digit CVV.');
  }
  
  // For valid card numbers, simulate success
  return {
    success: true,
    transactionId: `txn_real_${Date.now()}`,
    status: 'completed',
    amount: paymentData.amount,
    currency: 'INR',
    message: 'Payment processed successfully with real card'
  };
};

export const processUPIPayment = async (paymentData) => {
  // Simulate payment processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check if it's a test UPI ID
  const isTestUPI = Object.values(TEST_UPI_IDS).includes(paymentData.upiId);
  
  if (isTestUPI) {
    throw new Error('Payment failed: Test UPI IDs are not accepted. Please use a real UPI ID.');
  }
  
  // For real-looking UPI IDs, simulate success
  if (validateUPIId(paymentData.upiId)) {
    return {
      success: true,
      transactionId: `upi_real_${Date.now()}`,
      status: 'completed',
      amount: paymentData.amount,
      currency: 'INR',
      upiId: paymentData.upiId,
      message: 'UPI payment processed successfully'
    };
  } else {
    throw new Error('Payment failed: Invalid UPI ID format');
  }
};

// Test card numbers for development
export const TEST_CARDS = {
  success: '4242424242424242',
  failure: '4000000000000002',
  insufficientFunds: '4000000000009995',
  expired: '4000000000000069',
  incorrectCvc: '4000000000000127',
  processingError: '4000000000000119',
  stolen: '4000000000009979',
  lost: '4000000000009987',
};

// Test UPI IDs
export const TEST_UPI_IDS = {
  valid: 'test@upi',
  gpay: 'test@gpay',
  phonepe: 'test@phonepe',
  paytm: 'test@paytm',
};

export default {
  validateCardNumber,
  validateUPIId,
  validateCardHolderName,
  validateCVV,
  validateExpiryDate,
  getCardValidationRules,
  getCardBrand,
  formatCardNumber,
  processCardPayment,
  processUPIPayment,
  TEST_CARDS,
  TEST_UPI_IDS,
  PAYMENT_CONFIG
}; 