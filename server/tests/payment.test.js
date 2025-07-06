const request = require('supertest');
const express = require('express');
const app = require('../server');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

describe('Payment API Tests', () => {
  let testUser, testProduct, testOrder, authToken;

  beforeEach(async () => {
    // Create test data
    testUser = await testUtils.createTestUser(User);
    testProduct = await testUtils.createTestProduct(Product);
    testOrder = await testUtils.createTestOrder(Order, { user: testUser._id });
    authToken = testUtils.generateTestToken(testUser._id);
  });

  describe('Payment Processing Tests', () => {
    test('should process card payment in test mode', async () => {
      const paymentData = {
        orderId: testOrder._id,
        paymentMethod: 'card',
        cardDetails: {
          number: '4242424242424242', // Test card number
          expiryMonth: '12',
          expiryYear: '2025',
          cvv: '123',
          cardholderName: 'Test User'
        },
        amount: testOrder.totalAmount
      };

      const response = await request(app)
        .post('/api/payments/process')
        .set('Authorization', `Bearer ${authToken}`)
        .send(paymentData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('transactionId');
      expect(response.body).toHaveProperty('status', 'completed');
      expect(response.body.paymentMethod).toBe('card');
    });

    test('should process UPI payment in test mode', async () => {
      const paymentData = {
        orderId: testOrder._id,
        paymentMethod: 'upi',
        upiDetails: {
          upiId: 'test@upi',
          app: 'gpay'
        },
        amount: testOrder.totalAmount
      };

      const response = await request(app)
        .post('/api/payments/process')
        .set('Authorization', `Bearer ${authToken}`)
        .send(paymentData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('transactionId');
      expect(response.body).toHaveProperty('status', 'completed');
      expect(response.body.paymentMethod).toBe('upi');
    });

    test('should process COD payment', async () => {
      const paymentData = {
        orderId: testOrder._id,
        paymentMethod: 'cod',
        amount: testOrder.totalAmount
      };

      const response = await request(app)
        .post('/api/payments/process')
        .set('Authorization', `Bearer ${authToken}`)
        .send(paymentData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('status', 'pending');
      expect(response.body.paymentMethod).toBe('cod');
    });

    test('should handle payment failure in test mode', async () => {
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
        amount: testOrder.totalAmount
      };

      const response = await request(app)
        .post('/api/payments/process')
        .set('Authorization', `Bearer ${authToken}`)
        .send(paymentData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });

    test('should validate card number using Luhn algorithm', async () => {
      const paymentData = {
        orderId: testOrder._id,
        paymentMethod: 'card',
        cardDetails: {
          number: '1234567890123456', // Invalid card number
          expiryMonth: '12',
          expiryYear: '2025',
          cvv: '123',
          cardholderName: 'Test User'
        },
        amount: testOrder.totalAmount
      };

      const response = await request(app)
        .post('/api/payments/process')
        .set('Authorization', `Bearer ${authToken}`)
        .send(paymentData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toContain('Invalid card number');
    });

    test('should validate UPI ID format', async () => {
      const paymentData = {
        orderId: testOrder._id,
        paymentMethod: 'upi',
        upiDetails: {
          upiId: 'invalid-upi-id',
          app: 'gpay'
        },
        amount: testOrder.totalAmount
      };

      const response = await request(app)
        .post('/api/payments/process')
        .set('Authorization', `Bearer ${authToken}`)
        .send(paymentData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toContain('Invalid UPI ID');
    });
  });

  describe('Payment Verification Tests', () => {
    test('should verify payment status', async () => {
      const response = await request(app)
        .get(`/api/payments/verify/${testOrder._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('orderId');
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('paymentMethod');
    });

    test('should return payment history for user', async () => {
      const response = await request(app)
        .get('/api/payments/history')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('Test Mode Configuration', () => {
    test('should use test API keys in development', () => {
      expect(process.env.NODE_ENV).toBe('test');
      expect(process.env.PAYMENT_TEST_MODE).toBe('true');
    });

    test('should handle sandbox environment', () => {
      const sandboxConfig = {
        razorpay: {
          keyId: 'rzp_test_testkey',
          keySecret: 'test_secret'
        },
        stripe: {
          publishableKey: 'pk_test_testkey',
          secretKey: 'sk_test_testkey'
        }
      };

      expect(sandboxConfig).toBeDefined();
      expect(sandboxConfig.razorpay.keyId).toContain('test');
      expect(sandboxConfig.stripe.publishableKey).toContain('test');
    });
  });

  describe('Error Handling Tests', () => {
    test('should handle network errors gracefully', async () => {
      // Mock network failure
      jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'));

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
        amount: testOrder.totalAmount
      };

      const response = await request(app)
        .post('/api/payments/process')
        .set('Authorization', `Bearer ${authToken}`)
        .send(paymentData)
        .expect(500);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toContain('Payment processing failed');
    });

    test('should handle invalid order ID', async () => {
      const paymentData = {
        orderId: 'invalid-order-id',
        paymentMethod: 'card',
        cardDetails: {
          number: '4242424242424242',
          expiryMonth: '12',
          expiryYear: '2025',
          cvv: '123',
          cardholderName: 'Test User'
        },
        amount: 100
      };

      const response = await request(app)
        .post('/api/payments/process')
        .set('Authorization', `Bearer ${authToken}`)
        .send(paymentData)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toContain('Order not found');
    });
  });
}); 