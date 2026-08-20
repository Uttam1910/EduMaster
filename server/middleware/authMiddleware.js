// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const prisma = require('../config/prismaClient');

const authMiddleware = async (req, res, next) => {
  let token;

  // Check if token is provided in the Authorization header or cookies
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the user by ID
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    const { password, forgotPasswordToken, forgotPasswordExpires, ...userWithoutPassword } = user;
    req.user = {
      ...userWithoutPassword,
      _id: user.id,
    };
    
    next();
  } catch (error) {
    console.error('Error while verifying token:', error.message);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = authMiddleware;
