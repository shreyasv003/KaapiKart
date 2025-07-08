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

// Enhanced card-specific validation rules with stricter requirements
export const getCardValidationRules = (cardNumber) => {
  const brand = getCardBrand(cardNumber);
  const clean = cardNumber.replace(/\s/g, '');
  
  const rules = {
    visa: {
      nameMinLength: 3,
      nameMaxLength: 26,
      cvvLength: 3,
      namePattern: /^[A-Z\s]+$/,
      description: 'Visa cards require 3-digit CVV and names with only letters and spaces',
      cardNumberPattern: /^4\d{15}$/,
      cardNumberDescription: 'Visa cards start with 4 and must be 16 digits'
    },
    mastercard: {
      nameMinLength: 3,
      nameMaxLength: 26,
      cvvLength: 3,
      namePattern: /^[A-Z\s]+$/,
      description: 'MasterCard requires 3-digit CVV and names with only letters and spaces',
      cardNumberPattern: /^5[1-5]\d{14}$/,
      cardNumberDescription: 'MasterCard numbers start with 51-55 and must be 16 digits'
    },
    amex: {
      nameMinLength: 3,
      nameMaxLength: 20,
      cvvLength: 4,
      namePattern: /^[A-Z\s]+$/,
      description: 'American Express requires 4-digit CVV and shorter names',
      cardNumberPattern: /^(34|37)\d{13}$/,
      cardNumberDescription: 'American Express numbers start with 34 or 37 and must be 15 digits'
    },
    discover: {
      nameMinLength: 3,
      nameMaxLength: 26,
      cvvLength: 3,
      namePattern: /^[A-Z\s]+$/,
      description: 'Discover cards require 3-digit CVV and names with only letters and spaces',
      cardNumberPattern: /^(6011|65|64[4-9])\d{12,14}$/,
      cardNumberDescription: 'Discover cards start with 6011, 65, or 64[4-9]'
    },
    rupay: {
      nameMinLength: 3,
      nameMaxLength: 26,
      cvvLength: 3,
      namePattern: /^[A-Z\s]+$/,
      description: 'RuPay cards require 3-digit CVV and names with only letters and spaces',
      cardNumberPattern: /^(60|6521|6522)\d{13,14}$/,
      cardNumberDescription: 'RuPay cards start with 60, 6521, or 6522'
    }
  };
  
  return rules[brand] || rules.visa; // Default to Visa rules if brand not recognized
};

// Enhanced validation functions with format validation only
export const validateCardHolderName = (name, cardNumber) => {
  if (!cardNumber || cardNumber.replace(/\s/g, '').length < 13) {
    return { valid: false, message: 'Please enter a valid card number first' };
  }
  
  const rules = getCardValidationRules(cardNumber);
  
  if (!name || name.trim().length === 0) {
    return { valid: false, message: 'Card holder name is required' };
  }
  
  if (name.trim().length < rules.nameMinLength || name.trim().length > rules.nameMaxLength) {
    return { valid: false, message: `Name must be ${rules.nameMinLength}-${rules.nameMaxLength} characters` };
  }
  
  if (!rules.namePattern.test(name.trim())) {
    return { valid: false, message: 'Name can only contain letters and spaces' };
  }
  
  // Check for consecutive spaces
  if (/\s{2,}/.test(name)) {
    return { valid: false, message: 'Name cannot contain consecutive spaces' };
  }
  
  return { valid: true, message: 'Valid name' };
};

export const validateCVV = (cvv, cardNumber) => {
  if (!cardNumber || cardNumber.replace(/\s/g, '').length < 13) {
    return { valid: false, message: 'Please enter a valid card number first' };
  }
  
  const rules = getCardValidationRules(cardNumber);
  
  if (!cvv || cvv.trim().length === 0) {
    return { valid: false, message: 'CVV is required' };
  }
  
  if (cvv.length !== rules.cvvLength) {
    return { 
      valid: false, 
      message: `${getCardBrand(cardNumber).toUpperCase()} requires exactly ${rules.cvvLength} digits` 
    };
  }
  
  if (!/^\d+$/.test(cvv)) {
    return { valid: false, message: 'CVV must contain only numbers' };
  }
  
  return { valid: true, message: 'Valid CVV' };
};

export const validateExpiryDate = (month, year, cardNumber) => {
  if (!cardNumber || cardNumber.replace(/\s/g, '').length < 13) {
    return { valid: false, message: 'Please enter a valid card number first' };
  }
  
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

// New function to validate card number format for specific brand
export const validateCardNumberFormat = (cardNumber) => {
  const clean = cardNumber.replace(/\s/g, '');
  const brand = getCardBrand(clean);
  const rules = getCardValidationRules(clean);
  
  if (!brand) {
    return { valid: false, message: 'Invalid card type. Please use Visa, MasterCard, American Express, Discover, or RuPay' };
  }
  
  if (!rules.cardNumberPattern.test(clean)) {
    return { valid: false, message: rules.cardNumberDescription };
  }
  
  if (!validateCardNumber(clean)) {
    return { valid: false, message: 'Invalid card number (failed checksum validation)' };
  }
  
  return { valid: true, message: `Valid ${brand.toUpperCase()} card number` };
};

export const formatCardNumber = (value) => {
  return value.replace(/[^0-9]/g, '').replace(/(.{4})/g, '$1 ').trim();
};

// Enhanced payment processing with format validation only
export const processCardPayment = async (paymentData) => {
  // Simulate payment processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const cardNumber = paymentData.cardNumber.replace(/\s/g, '');
  
  // Check if it's a test card number
  const isTestCard = Object.values(TEST_CARDS).includes(cardNumber);
  
  if (isTestCard) {
    throw new Error('Payment failed: Test card numbers are not accepted. Please use a real card number.');
  }
  
  // Validate card number format and brand
  const cardNumberValidation = validateCardNumberFormat(cardNumber);
  if (!cardNumberValidation.valid) {
    throw new Error(`Payment failed: ${cardNumberValidation.message}`);
  }
  
  // Validate card holder name
  const nameValidation = validateCardHolderName(paymentData.cardholderName, cardNumber);
  if (!nameValidation.valid) {
    throw new Error(`Payment failed: ${nameValidation.message}`);
  }
  
  // Validate CVV
  const cvvValidation = validateCVV(paymentData.cvv, cardNumber);
  if (!cvvValidation.valid) {
    throw new Error(`Payment failed: ${cvvValidation.message}`);
  }
  
  // Validate expiry date
  const expiryValidation = validateExpiryDate(paymentData.expiryMonth, paymentData.expiryYear, cardNumber);
  if (!expiryValidation.valid) {
    throw new Error(`Payment failed: ${expiryValidation.message}`);
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
      message: 'UPI payment processed successfully with real UPI ID'
    };
  } else {
    throw new Error('Payment failed: Invalid UPI ID format. Please enter a valid UPI ID (e.g., yourname@upi)');
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
  validateCardNumberFormat,
  getCardValidationRules,
  getCardBrand,
  formatCardNumber,
  processCardPayment,
  processUPIPayment,
  TEST_CARDS,
  TEST_UPI_IDS,
  PAYMENT_CONFIG
}; 