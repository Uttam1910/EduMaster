// controllers/userController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const prisma = require("../config/prismaClient");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper to format user response with backward-compatible _id
const formatUserResponse = (user) => {
  if (!user) return null;
  const { password, forgotPasswordToken, forgotPasswordExpires, ...rest } = user;
  return {
    ...rest,
    _id: user.id,
    avatar: {
      publicId: user.avatarPublicId || "default_avatar_id",
      secureUrl: user.avatarSecureUrl || "default_avatar_url",
    },
  };
};

// Register a new user
exports.register = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please fill in all required fields (username, email, password)." });
    }

    const emailClean = email.toLowerCase().trim();

    const emailExists = await prisma.user.findUnique({
      where: { email: emailClean },
    });

    if (emailExists) {
      return res.status(400).json({ message: "An account with this email address already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username: username.trim(),
        email: emailClean,
        password: hashedPassword,
        role: role || "student",
      },
    });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    console.error("Registration error:", error);
    if (error.code === "P2002") {
      return res.status(400).json({ message: "An account with this email address already exists." });
    }
    res.status(500).json({ message: error.message || "Failed to register user. Please try again." });
  }
};

// Log in a user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide both email and password." });
    }

    const emailClean = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: emailClean },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password. Please check your credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password. Please check your credentials." });
    }

    if (user.isActive === false) {
      return res.status(403).json({ message: "Your account is currently inactive. Please contact support." });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message || "Login failed due to a server error. Please try again." });
  }
};

// Log out a user
exports.logout = (req, res) => {
  res.cookie("token", "", { expires: new Date(0) });
  res.status(200).json({ message: "User logged out successfully" });
};

// View user profile
exports.viewProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(formatUserResponse(user));
  } catch (error) {
    console.error("Error retrieving profile:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Middleware to authenticate user
exports.authenticateUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    res.status(401).json({ message: "Token is not valid" });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.user.id || req.user._id;

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        avatarPublicId: result.public_id,
        avatarSecureUrl: result.secure_url,
      },
    });

    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    const avatar = {
      publicId: updatedUser.avatarPublicId,
      secureUrl: updatedUser.avatarSecureUrl,
    };

    res.status(200).json(avatar);
  } catch (error) {
    console.error("Error uploading avatar:", error);
    res.status(500).json({ message: "Error uploading avatar", error: error.message });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const emailClean = email?.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email: emailClean },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const forgotPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const forgotPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.user.update({
      where: { id: user.id },
      data: {
        forgotPasswordToken,
        forgotPasswordExpires,
      },
    });

    const frontendUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const resetUrl = `${frontendUrl}/resetpassword/${resetToken}`;

    const message = `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset for your EduMaster account.</p>
      <p>Click on the link below to reset your password:</p>
      <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
      <p>If you did not request this, please ignore this email.</p>
    `;

    await transporter.sendMail({
      to: user.email,
      subject: "Password Reset Request",
      html: message,
    });

    res.status(200).json({ message: "Password reset link sent to email" });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  try {
    const user = await prisma.user.findFirst({
      where: {
        forgotPasswordToken: resetPasswordToken,
        forgotPasswordExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid token or token expired" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        forgotPasswordToken: null,
        forgotPasswordExpires: null,
      },
    });

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { username, email, password } = req.body;

    if (email) {
      const emailClean = email.toLowerCase().trim();
      const emailExists = await prisma.user.findUnique({
        where: { email: emailClean },
      });
      if (emailExists && emailExists.id !== userId) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    const updatedFields = {};
    if (username) updatedFields.username = username.trim();
    if (email) updatedFields.email = email.toLowerCase().trim();

    if (password) {
      updatedFields.password = await bcrypt.hash(password, 10);
    }

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });

      updatedFields.avatarPublicId = result.public_id;
      updatedFields.avatarSecureUrl = result.secure_url;

      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updatedFields,
    });

    res.status(200).json(formatUserResponse(updatedUser));
  } catch (error) {
    console.error("Error updating profile:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current password and new password are required" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error in changePassword:", error);
    res.status(500).json({ message: "Server error" });
  }
};
