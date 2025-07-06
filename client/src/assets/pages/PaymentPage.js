import React, { useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
  Box,
  Divider,
  Alert,
  CircularProgress,
  useTheme,
  alpha,
  Tooltip,
  InputAdornment,
} from '@mui/material';
import {
  CreditCard as CreditCardIcon,
  AccountBalance as BankIcon,
  LocalShipping as CashIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PageBackground from '../../components/common/PageBackground';
import cartBg from '../images/cart-bg.jpg';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import VisaLogo from '../../assets/images/visa.png';
import MasterCardLogo from '../../assets/images/mastercard.png';
import AmexLogo from '../../assets/images/amex.png';
import DiscoverLogo from '../../assets/images/discover.png';
import RuPayLogo from '../../assets/images/rupay.png';
import { useSpring, animated } from '@react-spring/web';
import GPayLogo from '../../assets/images/gpay.png';
import PhonePeLogo from '../../assets/images/phonepe.png';
import PaytmLogo from '../../assets/images/paytm.png';
import { QRCodeSVG } from 'qrcode.react';

const API_URL = 'http://localhost:5002/api';

const PaymentPage = () => {
  const { cartItems, getTotal, clearCart } = useCart();
  const { authState } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [upiId, setUpiId] = useState('');
  const [upiVerified, setUpiVerified] = useState(false);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [cardBlurred, setCardBlurred] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const currentYear = new Date().getFullYear();
  const years = Array.from({length: 12}, (_, i) => (currentYear + i).toString().slice(-2));
  const months = Array.from({length: 12}, (_, i) => (i+1).toString().padStart(2, '0'));

  // Card preview and validation helpers
  const formatCardNumber = (value) => value.replace(/[^0-9]/g, '').replace(/(.{4})/g, '$1 ').trim();
  const maskCardNumber = (value) => {
    const clean = value.replace(/\s/g, '');
    if (cardBlurred && clean.length === 16) {
      return '•••• •••• •••• ' + clean.slice(-4);
    }
    return formatCardNumber(value);
  };
  const getCardBrand = (number) => {
    if (/^4/.test(number)) return 'visa';
    if (/^5[1-5]/.test(number)) return 'mastercard';
    if (/^(34|37)/.test(number)) return 'amex';
    if (/^(6011|65|64[4-9])/.test(number)) return 'discover';
    if (/^(60|6521|6522)/.test(number)) return 'rupay';
    return '';
  };
  const isValidCardNumber = (num) => {
    const s = num.replace(/\s/g, '');
    if (!/^\d{16}$/.test(s)) return false;
    let sum = 0, shouldDouble = false;
    for (let i = s.length - 1; i >= 0; i--) {
      let digit = parseInt(s[i]);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };
  const isValidName = (name) => name.length > 2;
  const isValidExpiry = (exp) => {
    if (!expiryMonth || !expiryYear) return false;
    return true;
  };
  const isValidCVV = (cvv) => /^\d{3,4}$/.test(cvv);
  const cardBrand = getCardBrand(cardDetails.cardNumber.replace(/\s/g, ''));
  const cardColors = {
    visa: '#1a1f71',
    mastercard: '#eb001b',
    amex: '#2e77bb',
    discover: '#f79e1b',
    rupay: '#005ba4',
    default: 'rgba(40,40,40,0.9)'
  };
  const cardPreviewBg = cardColors[cardBrand] || cardColors.default;
  const cardSpring = useSpring({
    transform: isCardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
    config: { mass: 1, tension: 300, friction: 30 }
  });

  // UPI validation helpers
  const isValidUpi = (id) => /^[\w.-]+@[\w.-]+$/.test(id);
  const handleVerifyUpi = () => {
    setUpiVerified(isValidUpi(upiId));
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleCardDetailsChange = (field) => (event) => {
    setCardDetails(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const validateCardDetails = () => {
    if (paymentMethod === 'card') {
      if (!cardDetails.cardNumber || !cardDetails.cardHolder || !cardDetails.expiryDate || !cardDetails.cvv) {
        setError('Please fill in all card details');
        return false;
      }
      if (cardDetails.cardNumber.length < 16) {
        setError('Please enter a valid card number');
        return false;
      }
      if (cardDetails.cvv.length < 3) {
        setError('Please enter a valid CVV');
        return false;
      }
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateCardDetails()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData = {
        items: cartItems.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: parseFloat(item.price)
        })),
        total: parseFloat((getTotal() + 40).toFixed(2)),
        paymentMethod: paymentMethod,
        paymentDetails: paymentMethod === 'card' ? {
          cardNumber: cardDetails.cardNumber.slice(-4), // Only store last 4 digits
          cardHolder: cardDetails.cardHolder,
        } : null
      };

      console.log('Sending order data:', orderData);

      const response = await axios.post(
        `${API_URL}/orders`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${authState.token}`
          }
        }
      );

      console.log('Order response:', response.data);

      if (response.data) {
        clearCart();
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate('/orders');
        }, 1500);
      }
    } catch (err) {
      console.error('Order placement error:', err);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'card':
        return <CreditCardIcon />;
      case 'upi':
        return <BankIcon />;
      case 'cod':
        return <CashIcon />;
      default:
        return <CreditCardIcon />;
    }
  };

  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case 'card':
        return 'Credit/Debit Card';
      case 'upi':
        return 'UPI Payment';
      case 'cod':
        return 'Cash on Delivery';
      default:
        return 'Credit/Debit Card';
    }
  };

  if (cartItems.length === 0) {
    return (
      <PageBackground
        imageUrl={cartBg}
        overlayColor="rgba(0, 0, 0, 0.85)"
        blur="0px"
      >
        <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#fff', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
            Your cart is empty
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/menu')}
            sx={{ mt: 2 }}
          >
            Browse Menu
          </Button>
        </Container>
      </PageBackground>
    );
  }

  return (
    <PageBackground
      imageUrl={cartBg}
      overlayColor="rgba(0, 0, 0, 0.85)"
      blur="0px"
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/cart')}
            sx={{ color: '#fff', mr: 2 }}
          >
            Back to Cart
          </Button>
          <Typography variant="h4" sx={{ color: '#fff', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
            Payment Options
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 3, bgcolor: 'rgba(70, 70, 70, 0.7)', color: '#fff' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: '#fff' }}>
                  Select Payment Method
                </Typography>
                <FormControl component="fieldset" fullWidth>
                  <RadioGroup
                    value={paymentMethod}
                    onChange={handlePaymentMethodChange}
                  >
                    <Card 
                      sx={{ 
                        mb: 2, 
                        border: paymentMethod === 'card' ? `2px solid ${theme.palette.primary.main}` : '1px solid #ddd',
                        bgcolor: 'rgba(70, 70, 70, 0.7)',
                        color: '#fff'
                      }}
                    >
                      <CardContent>
                        <FormControlLabel
                          value="card"
                          control={<Radio sx={{ color: '#fff' }} />}
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#fff' }}>
                              <CreditCardIcon sx={{ color: '#fff' }} />
                              <Typography sx={{ color: '#fff' }}>Credit/Debit Card</Typography>
                            </Box>
                          }
                        />
                        {paymentMethod === 'card' && (
                          <Box sx={{ ml: 4, mt: 2 }}>
                            {/* Animated Card Flip */}
                            <Box sx={{ perspective: 1000, mb: 3 }}>
                              <animated.div style={{ ...cardSpring, width: 340, height: 200, position: 'relative' }}>
                                {/* Front Side */}
                                <Box sx={{
                                  width: 340,
                                  height: 200,
                                  borderRadius: 4,
                                  bgcolor: cardPreviewBg,
                                  color: '#fff',
                                  boxShadow: 3,
                                  p: 3,
                                  display: isCardFlipped ? 'none' : 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'space-between',
                                  position: 'absolute',
                                  backfaceVisibility: 'hidden',
                                }}>
                                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                    {cardBrand === 'visa' && <img src={VisaLogo} alt="Visa" style={{ height: 32 }} />}
                                    {cardBrand === 'mastercard' && <img src={MasterCardLogo} alt="MasterCard" style={{ height: 32 }} />}
                                    {cardBrand === 'amex' && <img src={AmexLogo} alt="Amex" style={{ height: 32 }} />}
                                    {cardBrand === 'discover' && <img src={DiscoverLogo} alt="Discover" style={{ height: 32 }} />}
                                    {cardBrand === 'rupay' && <img src={RuPayLogo} alt="RuPay" style={{ height: 32 }} />}
                                  </Box>
                                  <Box sx={{ fontSize: 22, letterSpacing: 2, fontFamily: 'monospace', mb: 2 }}>
                                    {maskCardNumber(cardDetails.cardNumber) || '•••• •••• •••• ••••'}
                                  </Box>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                      <Box sx={{ fontSize: 12, opacity: 0.7 }}>Card Holder</Box>
                                      <Box sx={{ fontWeight: 'bold', fontSize: 16 }}>{(cardDetails.cardHolder || 'NAME SURNAME').toUpperCase()}</Box>
                                    </Box>
                                    <Box>
                                      <Box sx={{ fontSize: 12, opacity: 0.7 }}>Expiry</Box>
                                      <Box sx={{ fontWeight: 'bold', fontSize: 16 }}>{expiryMonth && expiryYear ? `${expiryMonth}/${expiryYear}` : 'MM/YY'}</Box>
                                    </Box>
                                  </Box>
                                </Box>
                                {/* Back Side (CVV) */}
                                <Box sx={{
                                  width: 340,
                                  height: 200,
                                  borderRadius: 4,
                                  bgcolor: cardPreviewBg,
                                  color: '#fff',
                                  boxShadow: 3,
                                  p: 3,
                                  display: isCardFlipped ? 'flex' : 'none',
                                  flexDirection: 'column',
                                  justifyContent: 'flex-end',
                                  alignItems: 'flex-end',
                                  position: 'absolute',
                                  backfaceVisibility: 'hidden',
                                  transform: 'rotateY(180deg)'
                                }}>
                                  <Box sx={{ width: '100%', height: 32, bgcolor: '#222', mb: 2, borderRadius: 1 }} />
                                  <Box sx={{ width: 80, height: 32, bgcolor: '#fff', color: '#222', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 18 }}>
                                    {cardDetails.cvv || '•••'}
                                  </Box>
                                </Box>
                              </animated.div>
                            </Box>
                            <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <TextField
                                  fullWidth
                                  label="Card Number"
                                  value={formatCardNumber(cardDetails.cardNumber)}
                                  onChange={e => setCardDetails(prev => ({ ...prev, cardNumber: e.target.value.replace(/[^0-9]/g, '').slice(0,16) }))}
                                  onBlur={() => setCardBlurred(true)}
                                  onFocus={() => setCardBlurred(false)}
                                  placeholder="1234 5678 9012 3456"
                                  inputProps={{ maxLength: 19 }}
                                  InputProps={{
                                    sx: { color: '#fff',
                                      '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#fff',
                                      },
                                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#fff',
                                      },
                                    },
                                    endAdornment: (
                                      isValidCardNumber(cardDetails.cardNumber) ?
                                        <InputAdornment position="end"><CheckCircleIcon sx={{ color: 'limegreen' }} /></InputAdornment>
                                      : cardDetails.cardNumber ?
                                        <InputAdornment position="end"><ErrorIcon sx={{ color: 'red' }} /></InputAdornment>
                                      : null
                                    )
                                  }}
                                  InputLabelProps={{
                                    sx: { color: '#fff',
                                      '&.Mui-focused': {
                                        color: '#fff',
                                      }
                                    }
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <TextField
                                  fullWidth
                                  label="Card Holder Name"
                                  value={cardDetails.cardHolder.toUpperCase()}
                                  onChange={e => setCardDetails(prev => ({ ...prev, cardHolder: e.target.value.toUpperCase() }))}
                                  placeholder="John Doe"
                                  InputProps={{
                                    sx: { color: '#fff',
                                      '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#fff',
                                      },
                                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#fff',
                                      },
                                    },
                                    endAdornment: (
                                      isValidName(cardDetails.cardHolder) ?
                                        <InputAdornment position="end"><CheckCircleIcon sx={{ color: 'limegreen' }} /></InputAdornment>
                                      : cardDetails.cardHolder ?
                                        <InputAdornment position="end"><ErrorIcon sx={{ color: 'red' }} /></InputAdornment>
                                      : null
                                    )
                                  }}
                                  InputLabelProps={{
                                    sx: { color: '#fff',
                                      '&.Mui-focused': {
                                        color: '#fff',
                                      }
                                    }
                                  }}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <TextField
                                    select
                                    label="MM"
                                    value={expiryMonth}
                                    onChange={e => setExpiryMonth(e.target.value)}
                                    InputProps={{
                                      sx: { color: '#fff',
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#fff' },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#fff' },
                                      }
                                    }}
                                    InputLabelProps={{ sx: { color: '#fff', '&.Mui-focused': { color: '#fff' } } }}
                                    SelectProps={{ native: true }}
                                    sx={{ minWidth: 70 }}
                                  >
                                    <option value="">MM</option>
                                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                                  </TextField>
                                  <TextField
                                    select
                                    label="YY"
                                    value={expiryYear}
                                    onChange={e => setExpiryYear(e.target.value)}
                                    InputProps={{
                                      sx: { color: '#fff',
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#fff' },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#fff' },
                                      }
                                    }}
                                    InputLabelProps={{ sx: { color: '#fff', '&.Mui-focused': { color: '#fff' } } }}
                                    SelectProps={{ native: true }}
                                    sx={{ minWidth: 70 }}
                                  >
                                    <option value="">YY</option>
                                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                                  </TextField>
                                  {isValidExpiry() ?
                                    <CheckCircleIcon sx={{ color: 'limegreen', alignSelf: 'center' }} /> :
                                    (expiryMonth || expiryYear) ? <ErrorIcon sx={{ color: 'red', alignSelf: 'center' }} /> : null}
                                </Box>
                              </Grid>
                              <Grid item xs={6}>
                                <TextField
                                  fullWidth
                                  label="CVV"
                                  value={cardDetails.cvv}
                                  onChange={handleCardDetailsChange('cvv')}
                                  placeholder="123"
                                  inputProps={{ maxLength: 4 }}
                                  type="password"
                                  InputProps={{
                                    sx: { color: '#fff',
                                      '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#fff',
                                      },
                                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#fff',
                                      },
                                    },
                                    endAdornment: (
                                      <Tooltip title="3 or 4 digit code on the back of your card">
                                        <span>
                                          {isValidCVV(cardDetails.cvv) ?
                                            <CheckCircleIcon sx={{ color: 'limegreen' }} /> :
                                            cardDetails.cvv ? <ErrorIcon sx={{ color: 'red' }} /> : null}
                                        </span>
                                      </Tooltip>
                                    )
                                  }}
                                  InputLabelProps={{
                                    sx: { color: '#fff',
                                      '&.Mui-focused': {
                                        color: '#fff',
                                      }
                                    }
                                  }}
                                  onFocus={() => setIsCardFlipped(true)}
                                  onBlur={() => setIsCardFlipped(false)}
                                />
                              </Grid>
                            </Grid>
                          </Box>
                        )}
                      </CardContent>
                    </Card>

                    <Card 
                      sx={{ 
                        mb: 2, 
                        border: paymentMethod === 'upi' ? `2px solid ${theme.palette.primary.main}` : '1px solid #ddd',
                        bgcolor: 'rgba(70, 70, 70, 0.7)',
                        color: '#fff'
                      }}
                    >
                      <CardContent>
                        <FormControlLabel
                          value="upi"
                          control={<Radio sx={{ color: '#fff' }} />}
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#fff' }}>
                              <BankIcon sx={{ color: '#fff' }} />
                              <Typography sx={{ color: '#fff' }}>UPI Payment</Typography>
                            </Box>
                          }
                        />
                        {paymentMethod === 'upi' && (
                          <Box sx={{ ml: 4, mt: 2 }}>
                            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                              <img src={GPayLogo} alt="Google Pay" style={{ height: 32 }} />
                              <img src={PhonePeLogo} alt="PhonePe" style={{ height: 32 }} />
                              <img src={PaytmLogo} alt="Paytm" style={{ height: 32 }} />
                            </Box>
                            <Typography variant="body2" sx={{ color: '#fff', mb: 2 }}>
                              Pay using UPI apps like Google Pay, PhonePe, Paytm, etc.
                            </Typography>
                            {upiId && upiVerified && (
                              <Box sx={{ mt: 2, mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Typography variant="caption" sx={{ color: '#fff', mb: 1 }}>Scan to pay (simulated):</Typography>
                                <QRCodeSVG value={upiId} size={96} bgColor="#fff" fgColor="#222" />
                              </Box>
                            )}
                          </Box>
                        )}
                      </CardContent>
                    </Card>

                    <Card 
                      sx={{ 
                        mb: 2, 
                        border: paymentMethod === 'cod' ? `2px solid ${theme.palette.primary.main}` : '1px solid #ddd',
                        bgcolor: 'rgba(70, 70, 70, 0.7)',
                        color: '#fff'
                      }}
                    >
                      <CardContent>
                        <FormControlLabel
                          value="cod"
                          control={<Radio sx={{ color: '#fff' }} />}
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#fff' }}>
                              <CashIcon sx={{ color: '#fff' }} />
                              <Typography sx={{ color: '#fff' }}>Cash on Delivery</Typography>
                            </Box>
                          }
                        />
                        {paymentMethod === 'cod' && (
                          <Box sx={{ ml: 4, mt: 2 }}>
                            <Typography variant="body2" sx={{ color: '#fff', fontStyle: 'italic', mb: 1 }}>
                              Please keep the exact amount ready. Pay your delivery agent upon receiving your order. Enjoy your coffee!
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </RadioGroup>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: 'rgba(70, 70, 70, 0.7)', color: '#fff' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: '#fff' }}>
                  Order Summary
                </Typography>
                <Divider sx={{ my: 2 }} />
                
                {cartItems.map((item) => (
                  <Box key={item._id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: '#fff' }}>
                      {item.name} x {item.quantity}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#fff' }}>
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
                
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography sx={{ color: '#fff' }}>Subtotal</Typography>
                  <Typography sx={{ color: '#fff' }}>₹{getTotal().toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography sx={{ color: '#fff' }}>Delivery Fee</Typography>
                  <Typography sx={{ color: '#fff' }}>₹40.00</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ color: '#fff' }}>Total</Typography>
                  <Typography variant="h6" sx={{ color: '#fff' }}>₹{(getTotal() + 40).toFixed(2)}</Typography>
                </Box>
                
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                  sx={{ mt: 2 }}
                >
                  {showSuccess ? (
                    <CheckCircleIcon sx={{ color: 'limegreen', fontSize: 32 }} />
                  ) : loading ? 'Processing...' : `Pay ₹${(getTotal() + 40).toFixed(2)}`}
                </Button>
                
                <Typography variant="caption" sx={{ display: 'block', mt: 2, textAlign: 'center', color: '#fff' }}>
                  By placing this order, you agree to our terms and conditions
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </PageBackground>
  );
};

export default PaymentPage; 