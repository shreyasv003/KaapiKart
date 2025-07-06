import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import PaymentPage from '../assets/pages/PaymentPage';
import theme from '../theme';

// Mock the payment gateway
jest.mock('../utils/paymentGateway', () => ({
  processCardPayment: jest.fn(),
  processUPIPayment: jest.fn(),
  validateCardNumber: jest.fn(),
  validateUPIId: jest.fn(),
}));

// Mock QR code component
jest.mock('qrcode.react', () => ({
  QRCodeSVG: ({ value }) => <div data-testid="qr-code">{value}</div>,
}));

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <CartProvider>
            {component}
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('PaymentPage Component', () => {
  const mockCartItems = [
    {
      _id: '1',
      name: 'Espresso',
      price: 120,
      quantity: 2,
      image: 'espresso.jpg'
    },
    {
      _id: '2',
      name: 'Cappuccino',
      price: 150,
      quantity: 1,
      image: 'cappuccino.jpg'
    }
  ];

  const mockUser = {
    _id: 'user1',
    name: 'Test User',
    email: 'test@example.com',
    phone: '1234567890',
    address: 'Test Address'
  };

  beforeEach(() => {
    // Mock localStorage
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === 'cart') return JSON.stringify(mockCartItems);
      if (key === 'user') return JSON.stringify(mockUser);
      return null;
    });

    // Mock window.location
    delete window.location;
    window.location = { href: '' };
  });

  describe('Payment Method Selection', () => {
    test('should render all payment methods', () => {
      renderWithProviders(<PaymentPage />);
      
      expect(screen.getByText('Card Payment')).toBeInTheDocument();
      expect(screen.getByText('UPI Payment')).toBeInTheDocument();
      expect(screen.getByText('Cash on Delivery')).toBeInTheDocument();
    });

    test('should switch between payment methods', async () => {
      const user = userEvent.setup();
      renderWithProviders(<PaymentPage />);

      // Initially card payment should be selected
      expect(screen.getByText('Card Number')).toBeInTheDocument();

      // Switch to UPI
      await user.click(screen.getByText('UPI Payment'));
      expect(screen.getByText('UPI ID')).toBeInTheDocument();
      expect(screen.queryByText('Card Number')).not.toBeInTheDocument();

      // Switch to COD
      await user.click(screen.getByText('Cash on Delivery'));
      expect(screen.getByText('Pay when you receive your order')).toBeInTheDocument();
      expect(screen.queryByText('UPI ID')).not.toBeInTheDocument();
    });
  });

  describe('Card Payment Tests', () => {
    test('should validate card number format', async () => {
      const user = userEvent.setup();
      renderWithProviders(<PaymentPage />);

      const cardNumberInput = screen.getByLabelText('Card Number');
      await user.type(cardNumberInput, '1234567890123456');

      // Invalid card number should show error
      expect(screen.getByText('Invalid card number')).toBeInTheDocument();

      // Valid card number should not show error
      await user.clear(cardNumberInput);
      await user.type(cardNumberInput, '4242424242424242');
      expect(screen.queryByText('Invalid card number')).not.toBeInTheDocument();
    });

    test('should format card number with spaces', async () => {
      const user = userEvent.setup();
      renderWithProviders(<PaymentPage />);

      const cardNumberInput = screen.getByLabelText('Card Number');
      await user.type(cardNumberInput, '4242424242424242');

      expect(cardNumberInput.value).toBe('4242 4242 4242 4242');
    });

    test('should detect card brand from number', async () => {
      const user = userEvent.setup();
      renderWithProviders(<PaymentPage />);

      const cardNumberInput = screen.getByLabelText('Card Number');
      
      // Visa card
      await user.type(cardNumberInput, '4242424242424242');
      expect(screen.getByAltText('Visa')).toBeInTheDocument();

      // MasterCard
      await user.clear(cardNumberInput);
      await user.type(cardNumberInput, '5555555555554444');
      expect(screen.getByAltText('MasterCard')).toBeInTheDocument();
    });

    test('should validate expiry date', async () => {
      const user = userEvent.setup();
      renderWithProviders(<PaymentPage />);

      const monthSelect = screen.getByLabelText('Month');
      const yearSelect = screen.getByLabelText('Year');

      // Select past date
      await user.selectOptions(monthSelect, '01');
      await user.selectOptions(yearSelect, '2020');

      expect(screen.getByText('Card has expired')).toBeInTheDocument();

      // Select future date
      await user.selectOptions(yearSelect, '2025');
      expect(screen.queryByText('Card has expired')).not.toBeInTheDocument();
    });

    test('should validate CVV format', async () => {
      const user = userEvent.setup();
      renderWithProviders(<PaymentPage />);

      const cvvInput = screen.getByLabelText('CVV');
      
      // Invalid CVV (less than 3 digits)
      await user.type(cvvInput, '12');
      expect(screen.getByText('CVV must be 3-4 digits')).toBeInTheDocument();

      // Valid CVV
      await user.clear(cvvInput);
      await user.type(cvvInput, '123');
      expect(screen.queryByText('CVV must be 3-4 digits')).not.toBeInTheDocument();
    });

    test('should auto-uppercase cardholder name', async () => {
      const user = userEvent.setup();
      renderWithProviders(<PaymentPage />);

      const nameInput = screen.getByLabelText('Cardholder Name');
      await user.type(nameInput, 'john doe');

      expect(nameInput.value).toBe('JOHN DOE');
    });
  });

  describe('UPI Payment Tests', () => {
    test('should validate UPI ID format', async () => {
      const user = userEvent.setup();
      renderWithProviders(<PaymentPage />);

      // Switch to UPI
      await user.click(screen.getByText('UPI Payment'));

      const upiInput = screen.getByLabelText('UPI ID');
      
      // Invalid UPI ID
      await user.type(upiInput, 'invalid-upi');
      expect(screen.getByText('Invalid UPI ID format')).toBeInTheDocument();

      // Valid UPI ID
      await user.clear(upiInput);
      await user.type(upiInput, 'test@upi');
      expect(screen.queryByText('Invalid UPI ID format')).not.toBeInTheDocument();
    });

    test('should show UPI app icons', async () => {
      const user = userEvent.setup();
      renderWithProviders(<PaymentPage />);

      await user.click(screen.getByText('UPI Payment'));

      expect(screen.getByAltText('Google Pay')).toBeInTheDocument();
      expect(screen.getByAltText('PhonePe')).toBeInTheDocument();
      expect(screen.getByAltText('Paytm')).toBeInTheDocument();
    });

    test('should generate QR code for UPI', async () => {
      const user = userEvent.setup();
      renderWithProviders(<PaymentPage />);

      await user.click(screen.getByText('UPI Payment'));
      
      const upiInput = screen.getByLabelText('UPI ID');
      await user.type(upiInput, 'test@upi');

      expect(screen.getByTestId('qr-code')).toBeInTheDocument();
    });
  });

  describe('Payment Processing Tests', () => {
    test('should process card payment successfully', async () => {
      const user = userEvent.setup();
      const mockProcessCardPayment = require('../utils/paymentGateway').processCardPayment;
      mockProcessCardPayment.mockResolvedValue({
        success: true,
        transactionId: 'txn_123456',
        status: 'completed'
      });

      renderWithProviders(<PaymentPage />);

      // Fill card details
      await user.type(screen.getByLabelText('Card Number'), '4242424242424242');
      await user.selectOptions(screen.getByLabelText('Month'), '12');
      await user.selectOptions(screen.getByLabelText('Year'), '2025');
      await user.type(screen.getByLabelText('CVV'), '123');
      await user.type(screen.getByLabelText('Cardholder Name'), 'Test User');

      // Submit payment
      await user.click(screen.getByText('Pay Now'));

      await waitFor(() => {
        expect(mockProcessCardPayment).toHaveBeenCalledWith({
          cardNumber: '4242424242424242',
          expiryMonth: '12',
          expiryYear: '2025',
          cvv: '123',
          cardholderName: 'TEST USER',
          amount: 390 // 2*120 + 1*150
        });
      });
    });

    test('should process UPI payment successfully', async () => {
      const user = userEvent.setup();
      const mockProcessUPIPayment = require('../utils/paymentGateway').processUPIPayment;
      mockProcessUPIPayment.mockResolvedValue({
        success: true,
        transactionId: 'txn_789012',
        status: 'completed'
      });

      renderWithProviders(<PaymentPage />);

      // Switch to UPI and fill details
      await user.click(screen.getByText('UPI Payment'));
      await user.type(screen.getByLabelText('UPI ID'), 'test@upi');

      // Submit payment
      await user.click(screen.getByText('Pay Now'));

      await waitFor(() => {
        expect(mockProcessUPIPayment).toHaveBeenCalledWith({
          upiId: 'test@upi',
          amount: 390
        });
      });
    });

    test('should handle payment failure', async () => {
      const user = userEvent.setup();
      const mockProcessCardPayment = require('../utils/paymentGateway').processCardPayment;
      mockProcessCardPayment.mockRejectedValue(new Error('Payment failed'));

      renderWithProviders(<PaymentPage />);

      // Fill card details with test failure card
      await user.type(screen.getByLabelText('Card Number'), '4000000000000002');
      await user.selectOptions(screen.getByLabelText('Month'), '12');
      await user.selectOptions(screen.getByLabelText('Year'), '2025');
      await user.type(screen.getByLabelText('CVV'), '123');
      await user.type(screen.getByLabelText('Cardholder Name'), 'Test User');

      // Submit payment
      await user.click(screen.getByText('Pay Now'));

      await waitFor(() => {
        expect(screen.getByText('Payment failed. Please try again.')).toBeInTheDocument();
      });
    });
  });

  describe('Test Mode Features', () => {
    test('should show test mode indicator', () => {
      renderWithProviders(<PaymentPage />);
      
      expect(screen.getByText('TEST MODE')).toBeInTheDocument();
      expect(screen.getByText('Use test card numbers for payment')).toBeInTheDocument();
    });

    test('should display test card numbers', () => {
      renderWithProviders(<PaymentPage />);
      
      expect(screen.getByText('4242 4242 4242 4242')).toBeInTheDocument();
      expect(screen.getByText('4000 0000 0000 0002')).toBeInTheDocument();
    });

    test('should show sandbox environment info', () => {
      renderWithProviders(<PaymentPage />);
      
      expect(screen.getByText('Sandbox Environment')).toBeInTheDocument();
      expect(screen.getByText('No real charges will be made')).toBeInTheDocument();
    });
  });

  describe('Order Summary', () => {
    test('should display correct order summary', () => {
      renderWithProviders(<PaymentPage />);
      
      expect(screen.getByText('Order Summary')).toBeInTheDocument();
      expect(screen.getByText('Espresso x2')).toBeInTheDocument();
      expect(screen.getByText('Cappuccino x1')).toBeInTheDocument();
      expect(screen.getByText('₹390')).toBeInTheDocument(); // Total amount
    });

    test('should show delivery address', () => {
      renderWithProviders(<PaymentPage />);
      
      expect(screen.getByText('Delivery Address')).toBeInTheDocument();
      expect(screen.getByText('Test Address')).toBeInTheDocument();
    });
  });

  describe('Accessibility Tests', () => {
    test('should have proper ARIA labels', () => {
      renderWithProviders(<PaymentPage />);
      
      expect(screen.getByLabelText('Card Number')).toBeInTheDocument();
      expect(screen.getByLabelText('Cardholder Name')).toBeInTheDocument();
      expect(screen.getByLabelText('CVV')).toBeInTheDocument();
    });

    test('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      renderWithProviders(<PaymentPage />);

      // Tab through form elements
      await user.tab();
      expect(screen.getByLabelText('Card Number')).toHaveFocus();
      
      await user.tab();
      expect(screen.getByLabelText('Cardholder Name')).toHaveFocus();
    });
  });
}); 