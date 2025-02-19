import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/users.js";
import nodemailer from "nodemailer";

// Token generation function
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token expires in 30 days
  });
};

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send email function
const sendEmail = async (to, subject, htmlContent) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    employeeCode,
    department,
    designation,
    section,
    contact,
  } = req.body;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    res.status(400);
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    employeeCode,
    department,
    designation,
    section,
    contact,
  });

  if (user) {
    // HTML email content with company logo and styling
    const emailContent = `
      <div style="font-family: 'Poppins', Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet" />  
      <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtQTmXOQy13esi9cbl8FXXlkJHkzj-YCjSNw&s" alt="Company Logo" style="width: 150px; height: auto;" />
        </div>
        <h2 style="text-align: center; color: #4CAF50;">Registration Successful</h2>
        <p>Dear ${name},</p>
        <p>Thank you for registering with <strong>Alrahim</strong>. Your account is now pending admin approval.</p>
        <p style="color: #555;">If you have any questions, feel free to contact us at <a href="mailto:support@yourcompany.com">support@yourcompany.com</a>.</p>
        <br />
        <p style="text-align: center;">
          <a href="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtQTmXOQy13esi9cbl8FXXlkJHkzj-YCjSNw&s" style="padding: 10px 20px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 5px;">Visit Our Website</a>
        </p>
        <p style="text-align: center; font-size: 12px; color: #aaa;">&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
      </div>
    `;

    // Send styled HTML email
    await sendEmail(user.email, "Registration Successful", emailContent);

    res.status(201).json({
      id: user.id,
      email: user.email,
      message: "User registered successfully. Wait for admin approval.",
    });
  } else {
    res.status(400);
    throw new Error("Failed to register user");
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required.");
  }

  const user = await User.findOne({ where: { email } }); // Use Sequelize query

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      employeeCode: user.employeeCode,
      department: user.department,
      designation: user.designation,
      section: user.section,
      contact: user.contact,
      isAllowed: user.isAllowed,
      token: generateToken(user.id), // Include token
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// Refetch user data
export const userRefetch = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id); // Use findByPk instead of findById

  if (user) {
    return res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      employeeCode: user.employeeCode,
      department: user.department,
      designation: user.designation,
      section: user.section,
      contact: user.contact,
      isAllowed: user.isAllowed,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Reset password
export const resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword, employeeCode } = req.body;

  // Validate input
  if (!email || !newPassword || !employeeCode) {
    res.status(400);
    throw new Error(
      "All fields (email, newPassword, employeeCode) are required."
    );
  }

  // Find user by email and employeeCode
  const user = await User.findOne({ where: { email, employeeCode } });

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or employee code");
  }

  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Optionally, generate a new token or notify the user (not shown in this example)
    const token = generateToken(user.id); // Assuming you have a token generation utility
    res.status(200).json({
      message: "Password updated successfully",
      token,
    });
  } catch (error) {
    console.error("Error while resetting password:", error);
    res.status(500);
    throw new Error("Failed to update password");
  }
});

export const logoutUser = asyncHandler(async (req, res) => {
  console.log("Request body:", req.body); // Debugging line
  res.status(200).json({ message: "User logged out successfully" });
});
