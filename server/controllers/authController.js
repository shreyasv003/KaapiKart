const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    console.log('=== Registration Process Started ===');
    console.log('Request body:', { name, email, passwordLength: password ? password.length : 0 });
    
    // Validate input
    if (!name || !email || !password) {
      console.log('Validation failed - Missing fields:', { 
        hasName: !!name, 
        hasEmail: !!email, 
        hasPassword: !!password 
      });
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user exists
    console.log('Checking if user exists...');
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('User already exists:', { email, userId: userExists._id });
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user (password will be hashed by the pre-save hook)
    console.log('Creating new user...');
    const userData = { 
      name, 
      email, 
      password, // Pass the plain password, it will be hashed by the pre-save hook
      isAdmin: email === 'admin@kaapikart.com'
    };
    console.log('User data to be created:', { ...userData, password: '***' });

    const newUser = await User.create(userData);

    if (!newUser) {
      console.error('User creation failed - no user returned');
      throw new Error('Failed to create user');
    }

    // Verify user was created in database
    const verifiedUser = await User.findById(newUser._id);
    if (!verifiedUser) {
      console.error('User verification failed - user not found in database');
      throw new Error('User creation verification failed');
    }
    console.log('User verified in database:', {
      id: verifiedUser._id,
      email: verifiedUser.email,
      hasPassword: !!verifiedUser.password,
      passwordLength: verifiedUser.password.length,
      isAdmin: verifiedUser.isAdmin
    });

    // Test password comparison
    console.log('Testing password comparison...');
    const passwordMatch = await verifiedUser.comparePassword(password);
    console.log('Password comparison test result:', { passwordMatch });

    console.log('User created successfully:', { 
      id: newUser._id,
      name: newUser.name, 
      email: newUser.email, 
      isAdmin: newUser.isAdmin,
      createdAt: newUser.createdAt
    });

    // Generate token
    console.log('Generating JWT token...');
    const token = jwt.sign(
      { id: newUser._id, isAdmin: newUser.isAdmin }, 
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Send response
    console.log('Sending success response...');
    res.status(201).json({ 
      token, 
      user: { 
        id: newUser._id,
        name: newUser.name, 
        email: newUser.email, 
        isAdmin: newUser.isAdmin 
      } 
    });
    console.log('=== Registration Process Completed ===');
  } catch (err) {
    console.error('=== Registration Error ===');
    console.error('Error details:', {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    res.status(500).json({ 
      message: 'Error creating user',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log('=== Login Process Started ===');
    console.log('Login attempt:', { email, passwordLength: password ? password.length : 0 });
    
    // Validate input
    if (!email || !password) {
      console.log('Missing credentials:', { hasEmail: !!email, hasPassword: !!password });
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    console.log('Finding user...');
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    console.log('User found:', { 
      id: user._id, 
      email: user.email,
      hasPassword: !!user.password,
      passwordLength: user.password ? user.password.length : 0,
      isAdmin: user.isAdmin
    });

    // Verify password
    console.log('Verifying password...');
    console.log('Password comparison:', {
      providedPasswordLength: password.length,
      storedPasswordLength: user.password.length
    });
    
    const isMatch = await user.comparePassword(password);
    console.log('Password verification result:', { isMatch });
    
    if (!isMatch) {
      console.log('Password mismatch for user:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    console.log('Password verified successfully');

    // Set admin status for specific email
    if (email === 'admin@kaapikart.com') {
      user.isAdmin = true;
      await user.save();
      console.log('Set admin status for user:', email);
    }

    // Generate token
    console.log('Generating JWT token...');
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin }, 
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Update last login
    await user.updateLastLogin(req.ip);
    console.log('Updated last login timestamp');

    // Send response
    console.log('Login successful:', { 
      id: user._id,
      name: user.name, 
      email: user.email, 
      isAdmin: user.isAdmin 
    });

    res.json({ 
      token, 
      user: { 
        id: user._id,
        name: user.name, 
        email: user.email, 
        isAdmin: user.isAdmin 
      } 
    });
    console.log('=== Login Process Completed ===');
  } catch (err) {
    console.error('=== Login Error ===');
    console.error('Error details:', {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    res.status(500).json({ 
      message: 'Error during login',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

exports.updateAdminStatus = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isAdmin = true;
    await user.save();
    
    console.log('Updated user admin status:', { email: user.email, isAdmin: user.isAdmin });
    
    res.json({ message: 'Admin status updated successfully', user });
  } catch (err) {
    console.error('Error updating admin status:', err);
    res.status(500).json({ message: err.message });
  }
};
