import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js"; // Ensure this path is correct
import User from "../models/users.js";
import { RCAForm } from "../models/rcaModel.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";


dotenv.config();


// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token expires in 30 days
  });
};


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


const sendEmail = async (to, subject,  htmlContent) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html:  htmlContent,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// @desc    Register a new admin
// @route   POST /api/admins/register
// @access  Public
export const registerAdmin = asyncHandler(async (req, res) => {
  const { email, password, role = "admin" } = req.body;

  // Check if the admin already exists
  const adminExists = await Admin.findOne({ where: { email } });

  if (adminExists) {
    res.status(400);
    throw new Error("Admin already exists");
  }

  // Create new admin (password will be hashed by the model's beforeCreate hook)
  const admin = await Admin.create({
    email,
    password, // No manual hashing here
    role,
  });

  if (admin) {
    res.status(201).json({
      _id: admin.id,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin.id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid admin data");
  }
});

// @desc    Authenticate and login an admin
// @route   POST /api/admins/login
// @access  Public
export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ where: { email } });

  if (admin && (await bcrypt.compare(password, admin.password))) {
    res.json({
      id: admin.id,
      email: admin.email,
      token: generateToken(admin.id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

export const adminRefetch = asyncHandler(async (req, res) => {
  const admin = await Admin.findByPk(req.admin.id); // Get the admin by ID

  if (admin) {
    return res.json({
      _id: admin.id,
      name: admin.name,
      email: admin.email,
      isAllowed: admin.isAllowed,
      // You can add any other relevant fields for admin
    });
  } else {
    res.status(404);
    throw new Error("Admin not found");
  }
});


//this controller will bring in the users that are approved by the admin


//  Admin: Fetch All Users
export const fetchAllUsers = asyncHandler(async (req, res) => {
  const users = await User.findAll();

  if (users) {
    res.json(users);
  } else {
    res.status(404);
    throw new Error("No users found");
  }
});


// Admin: Get Pending Users
export const getPendingUsers = asyncHandler(async (req, res) => {
  const users = await User.findAll({ where: { isAllowed: false } });
  res.status(200).json(users);
});


//  Admin: Edit User Info
export const editUserInfo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, employeeCode, department, designation, section, contact, isAllowed } = req.body;

  // Find the user in the database
  const user = await User.findOne({ where: { id } });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const previousIsAllowed = user.isAllowed;

  // Update the user information
  await user.update({
    name: name || user.name,
    email: email || user.email,
    employeeCode: employeeCode || user.employeeCode,
    department: department || user.department,
    designation: designation || user.designation,
    section: section || user.section,
    contact: contact || user.contact,
    isAllowed: isAllowed !== undefined ? isAllowed : user.isAllowed,
  });

  // Prepare the list of updates
  const updatedFields = [];
  if (name) updatedFields.push(`Name: ${name}`);
  if (email) updatedFields.push(`Email: ${email}`);
  if (employeeCode) updatedFields.push(`Employee Code: ${employeeCode}`);
  if (department) updatedFields.push(`Department: ${department}`);
  if (designation) updatedFields.push(`Designation: ${designation}`);
  if (section) updatedFields.push(`Section: ${section}`);
  if (contact) updatedFields.push(`Contact: ${contact}`);
  if (isAllowed !== undefined) updatedFields.push(`Account Status: ${isAllowed ? "Approved" : "Pending"}`);

  // Create email content
  const emailContent = `
  <div style="font-family: 'Poppins', Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet" />
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://media.licdn.com/dms/image/v2/C510BAQEt38vgnN5-rQ/company-logo_100_100/company-logo_100_100/0/1630598962284/al_rahim_textile_industries_logo?e=2147483647&v=beta&t=q2ifOsTCbiro7UzLjX3oevAKJAtlcrMyBYaJidvy9Kc" alt="Company Logo" style="width: 150px; height: auto;" />
    </div>
    <h2 style="text-align: center; color: #4CAF50;">Your Account Has Been Updated</h2>
    <p>Dear ${user.name},</p>
    <p>Your account has been successfully updated with the following changes:</p>
    <ul>
      ${updatedFields.map(field => `<li>${field}</li>`).join('')}
    </ul>
    <p>If you have any questions, feel free to contact us at <a href="mailto:support@yourcompany.com" style="color: #4CAF50;">support@yourcompany.com</a>.</p>
    <br />
    <p style="text-align: center;">
      <a href="https://www.alrahimtextile.com/" style="padding: 10px 20px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 5px;">Visit Our Website</a>
    </p>
    <p style="text-align: center; font-size: 12px; color: #aaa;">&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
  </div>
`;


  // If isAllowed changed to true, send the email notification
  if (previousIsAllowed !== true && isAllowed === true) {
    const subject = "Your Account Updated by Admin";
    await sendEmail(user.email, subject, emailContent);
  }

  // Send the updated user back as a response
  res.json({ message: "User info updated successfully", user });
});





// Create RCA Members
export const createRCAMembers = async (req, res) => {
  try {
    const { name, email, employeeCode } = req.body;

    if (!name || !email || !employeeCode) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }

    const newRCAForm = await RCAForm.create({ name, email, employeeCode });
    res
      .status(201)
      .json({ message: "RCA form created successfully!", data: newRCAForm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while creating RCA form." });
  }
};

// Admin: Get all RCA Menbers
export const getAllRCAMembers = async (req, res) => {
  try {
    const rcaForms = await RCAForm.findAll();
    res.status(200).json({ data: rcaForms });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching RCA forms." });
  }
};
// Delete RCA Member
export const deleteRCAMember = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const member = await RCAForm.findByPk(id);

    if (!member) {
      return res.status(404).json({ message: "RCA Member not found" });
    }

    await member.destroy();
    res.status(200).json({ message: "RCA Member deleted successfully" });
  } catch (error) {
    console.error("Error deleting RCA member:", error);
    res.status(500).json({ message: "Server error while deleting RCA member" });
  }
});

// Update RCA Member
export const updateRCAMember = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, employeeCode } = req.body;

  try {
    const member = await RCAForm.findByPk(id);

    if (!member) {
      return res.status(404).json({ message: "RCA Member not found" });
    }

    member.name = name;
    member.email = email;
    member.employeeCode = employeeCode;

    await member.save();
    res.status(200).json({ message: "RCA Member updated successfully", data: member });
  } catch (error) {
    console.error("Error updating RCA member:", error);
    res.status(500).json({ message: "Server error while updating RCA member" });
  }
});

