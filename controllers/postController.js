import Post from "../models/postModel.js";
import { validationResult } from "express-validator";
import nodemailer from "nodemailer";
import Admin from "../models/adminModel.js";

import { RCAForm } from "../models/rcaModel.js";
import User from "../models/users.js";
// Create transporter for sending emails
// Create transporter with improved configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send email
// Enhanced sendEmail function to support HTML
const sendEmail = async (to, subject, htmlMessage) => {
  try {
    // Send email with HTML content
    const mailOptions = {
      from: {
        name: "Al-Rahim Textiles", // Optional: Add a display name
        address: process.env.EMAIL_USER,
      },
      to,
      subject,
      html: htmlMessage, // Use html instead of text
      // Optional: Add alternative text version for email clients
      text: htmlMessage.replace(/<[^>]*>?/gm, ""), // Strip HTML tags
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully to ${to}");
    console.log("Message ID: ${info.messageId}");

    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    // Optionally rethrow or handle as needed
    throw new Error("Failed to send email: ${error.message}");
  }
};

// testing new code
// Create Post
export const createPost = async (req, res) => {
  try {
    const { userId, recipients } = req.body;

    // Verify user exists and get user details
    const user = await User.findOne({
      where: { id: userId },
      attributes: [
        "id",
        "name",
        "email",
        "employeeCode",
        "department",
        "designation",
        "section",
        "contact",
      ],
    });

    // Add some debugging to check what we're getting
    console.log("Found user:", user);

    if (!user) {
      return res.status(400).json({
        message: "Invalid userId. No such user exists.",
      });
    }

    // Let's log the user data to make sure we have what we expect
    const userData = {
      userName: user.name,
      userEmail: user.email,
      userEmployeeCode: user.employeeCode,
      userDepartment: user.department,
      userDesignation: user.designation,
      userSection: user.section,
      userContact: user.contact,
    };

    // Before creating the email templat

    // console.log("User data being added to post:", userData);
    // Create the post with all data

    const postData = {
      ...req.body,
      ...userData, // Spread the user data into the post data
    };

    const post = await Post.create(postData);
    console.log(postData);

    // Check if recipients are provided
    if (!recipients || recipients.length === 0) {
      return res.status(400).json({
        message: "Email(s) are required to select RCA members.",
      });
    }

    // Prepare the email subject and message
    const subject = "New Post Created";
    const htmlMessage = `
    <div style="font-family: 'Poppins', Arial, sans-serif; line-height: 1.6; color: #333;">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet" />
      <h2 style="text-align: center; color: #0056b3;">
        <img src="https://media.licdn.com/dms/image/v2/C510BAQEt38vgnN5-rQ/company-logo_100_100/company-logo_100_100/0/1630598962284/al_rahim_textile_industries_logo?e=2147483647&v=beta&t=q2ifOsTCbiro7UzLjX3oevAKJAtlcrMyBYaJidvy9Kc" alt="Logo" style="width: 100px; height: auto;"/>
      </h2>
      <p>Dear RCA Member,</p>
      <p>A new post has been created with the following details:</p>

      <!-- Personal Information -->
      <h3 style="color: #0056b3; border-bottom: 2px solid #0056b3;">Personal Information</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr style="background-color: #f2f2f2;">
          <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Field</th>
          <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Value</th>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">CAPA Number</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${
            post.capaNumber || "N/A"
          }</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Name</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${
            userData.userName || "N/A"
          }</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Email</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${
            userData.userEmail || "N/A"
          }</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Employee Code</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${
            userData.userEmployeeCode || "N/A"
          }</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Department</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${
            userData.userDepartment || "N/A"
          }</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Designation</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${
            userData.userDesignation || "N/A"
          }</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Section</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${
            userData.userSection || "N/A"
          }</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Contact</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${
            userData.userContact || "N/A"
          }</td>
        </tr>
      </table>

      <!-- Product Details -->
      <h3 style="color: #0056b3; border-bottom: 2px solid #0056b3;">Product Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="background-color: #f2f2f2;">
          <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Field</th>
          <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Value</th>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Customer</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${
            post.productDetails_customer || "N/A"
          }</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Brand</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${
            post.productDetails_brand || "N/A"
          }</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Product Type</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${
            post.productDetails_productType || "N/A"
          }</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Towel Type</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${
            post.productDetails_towelType || "N/A"
          }</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Article</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${
            post.productDetails_article || "N/A"
          }</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Size</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${
            post.productDetails_size || "N/A"
          }</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Color</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${
            post.productDetails_color || "N/A"
          }</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Design</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${
            post.productDetails_design || "N/A"
          }</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Product ID</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${
            post.productDetails_productId || "N/A"
          }</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">SOS</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${
            post.productDetails_sos || "N/A"
          }</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Customer PO</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${
            post.productDetails_customerPO || "N/A"
          }</td>
        </tr>
      </table>

      <!-- Event Selection -->
      <h3 style="color: #0056b3; border-bottom: 2px solid #0056b3;">Event Selection</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="background-color: #f2f2f2;">
          <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Field</th>
          <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Value</th>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Root Cause</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${
            post.eventSelection_rootCause || "N/A"
          }</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Cause Category</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${
            post.eventSelection_causeCategory || "N/A"
          }</td>
        </tr>
      </table>

      <!-- Problem Discussion -->
      <h3 style="color: #0056b3; border-bottom: 2px solid #0056b3;">Problem Discussion</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="background-color: #f2f2f2;">
          <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Field</th>
          <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Value</th>
        </tr>
        <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">Date Occurred</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${
            post.problemDiscussion_dateOccurred || "N/A"
          }</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Problem Statement</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${
            post.problemDiscussion_problemStatement || "N/A"
          }</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Containment Action</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${
            post.problemDiscussion_containmentAction || "N/A"
          }</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Member RCA</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${
            JSON.stringify(post.problemDiscussion_memberRCA) || "N/A"
          }</td>
        </tr>
      </table>

      <!-- RCA for 6Ms -->
      <h3 style="color: #0056b3; border-bottom: 2px solid #0056b3;">RCA for 6Ms</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="background-color: #f2f2f2;">
          <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Category</th>
          <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Details</th>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Method</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${
            JSON.stringify(post.rcaFor6Ms_method) || "N/A"
          }</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Material</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${
            JSON.stringify(post.rcaFor6Ms_material) || "N/A"
          }</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Machine</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${
            JSON.stringify(post.rcaFor6Ms_machine) || "N/A"
          }</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Manpower</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${
            JSON.stringify(post.rcaFor6Ms_manpower) || "N/A"
          }</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Measurement</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${
            JSON.stringify(post.rcaFor6Ms_measurement) || "N/A"
          }</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Milieu</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${
            JSON.stringify(post.rcaFor6Ms_milieu) || "N/A"
          }</td>
        </tr>
      </table>
      
      <p style="margin-top: 20px;">Best regards,<br>Team</p>
    </div>
    `;

    // Send email to each recipient
    for (const email of recipients) {
      try {
        const rcaMember = await RCAForm.findOne({ where: { email: email } });
        if (!rcaMember) {
          console.log(`RCA Member with email ${email} not found.`);
          continue; // Skip this email if the RCA member is not found
        }
        await sendEmail(rcaMember.email, subject, htmlMessage);
      } catch (emailError) {
        console.error(`Failed to send email to ${email}:`, emailError);
      }
    }

    // Send success response
    res.status(201).json({
      message:
        "Post created successfully and notification sent to selected RCA Members",
      post,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({
      message: "An error occurred while creating the post",
      error: error.message,
    });
  }
};

// Edit an existing post by ID
// export const editPost = async (req, res) => {
//   const { id } = req.params;

//   try {
//     // Find the post by ID
//     const post = await Post.findByPk(id);
//     if (!post) {
//       return res.status(404).json({ message: "Post not found" });
//     }

//     // Update the post
//     await post.update(req.body);

//     // Refresh the post instance to get the latest data, including auto-generated fields
//     await post.reload();

//     // Fetch admin emails
//     const admins = await Admin.findAll({ attributes: ["email"] });
//     const adminEmails = admins.map((admin) => admin.email);

//     // Send email to all admins
//     if (adminEmails.length > 0) {
//       const subject = "Post Updated Notification";
//       const htmlMessage = `
//         <div style="text-align: center; font-family: Arial, sans-serif;">
//           <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtQTmXOQy13esi9cbl8FXXlkJHkzj-YCjSNw&s" alt="Logo" style="max-width: 150px; margin-bottom: 20px;">
//           <h1 style="color: #333;">Hello Admin</h1>
//           <p>A post has been updated and is waiting for your review.</p>
//           <p><strong>Post ID:</strong> ${id}</p>
//           <p><strong>CAPA Number:</strong> ${post.capaNumber || "N/A"}</p>
//         </div>
//       `;

//       try {
//         await Promise.all(
//           adminEmails.map((email) => sendEmail(email, subject, htmlMessage))
//         );
//         console.log("Notification email sent to admins.");
//       } catch (emailError) {
//         console.error(
//           "Error sending email notification to admins:",
//           emailError
//         );
//       }
//     } else {
//       console.warn("No admin emails found to send the notification.");
//     }

//     // Respond to the client
//     res.status(200).json({
//       message:
//         "Post updated successfully, and the admins have been notified via email.",
//       post,
//     });
//   } catch (error) {
//     console.error("Error updating post:", error);
//     res.status(500).json({
//       message: "An error occurred while updating the post",
//       error: error.message,
//     });
//   }
// };

// Edit an existing post by ID
export const editPost = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the post by ID
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Update the post
    await post.update(req.body);

    // Refresh the post instance to get the latest data, including auto-generated fields
    await post.reload();

    // Respond to the client
    res.status(200).json({
      message: "Post updated successfully.",
      post,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({
      message: "An error occurred while updating the post",
      error: error.message,
    });
  }
};

// Delete a post by ID
export const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await post.destroy();
    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({
      message: "An error occurred while deleting the post",
      error: error.message,
    });
  }
};

export const fetchAllPost = async (req, res) => {
  try {
    // Fetch all posts with associated user details
    const posts = await Post.findAll({
      include: [
        {
          model: User, // Include the User model
          attributes: ["employeeCode", "name", "id"], // Fetch only the required fields
        },
      ],
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      message: "An error occurred while fetching posts",
      error: error.message,
    });
  }
};

export const fetchPostById = async (req, res) => {
  const { id } = req.params;
  try {
    // Fetch post with associated user details
    const post = await Post.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ["employeeCode", "name", "id"], // Include only the necessary fields
        },
      ],
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    res.status(500).json({
      message: "An error occurred while fetching the post",
      error: error.message,
    });
  }
};

// Fetch posts created by the current user
export const fetchMyPosts = async (req, res) => {
  const userId = req.user.id; // Assuming user ID is in the req.user object
  try {
    const posts = await Post.findAll({ where: { userId } });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({
      message: "An error occurred while fetching your posts",
      error: error.message,
    });
  }
};

// Fetch approved posts
export const fetchApprovedPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { status: "closed" },
      include: [
        {
          model: User,
          attributes: ["employeeCode", "name", "id", "email"], // Include only the necessary fields
        },
      ],
    });
    res.json(posts); // Return posts as JSON
  } catch (error) {
    console.error("Error fetching approved posts:", error);
    res.status(500).json({
      message: "An error occurred while fetching approved posts",
      error: error.message,
    });
  }
};

// Fetch unapproved posts
export const fetchUnapprovedPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { status: "open" },
      include: [
        {
          model: User,
          attributes: ["employeeCode", "name", "id", "email"], // Include only the necessary fields
        },
      ],
    });
    res.json(posts); // Return posts as JSON
  } catch (error) {
    console.error("Error fetching unapproved posts:", error);
    res.status(500).json({
      message: "An error occurred while fetching unapproved posts",
      error: error.message,
    });
  }
};





// Fetch rejected posts
// export const fetchRejectPosts = async (req, res) => {
//   try {
//     const posts = await Post.findAll({
//       where: { status: "unapproved" },
//       include: [
//         {
//           model: User,
//           attributes: ["employeeCode", "name", "id", "email"], // Include only the necessary fields
//         },
//       ],
//     });
//     res.json(posts); // Return posts as JSON
//   } catch (error) {
//     console.error("Error fetching rejected posts:", error);
//     res.status(500).json({
//       message: "An error occurred while fetching rejected posts",
//       error: error.message,
//     });
//   }
// };

// approve post
export const approvePost = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the post along with the associated user
    const post = await Post.findByPk(id, {
      include: {
        model: User, // Assuming User is the associated model
        attributes: ["email", "name"], // Only fetch the email
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Update the post status
    post.status = "closed";
    await post.save();

    // Prepare the email content
    const emailMessage = `
      <h1>Post Approved</h1>
      <h2> Dear ${post.User.name} </h2>
      <p>Post ID: ${post.id}</p>
      <p>Your post having problem statement "<strong>${post.problemDiscussion_problemStatement}</strong>" has been approved.</p>
    `;

    // Check if the user email exists and send the email
    const userEmail = post.User?.email;
    if (userEmail) {
      const subject = "Post Approved Notification";
      await sendEmail(userEmail, subject, emailMessage);
      console.log("Notification email sent to the user.");
    } else {
      console.warn("User email not found. No email notification sent.");
    }

    // Respond to the client
    res.status(200).json({
      message:
        "Post approved successfully, and the user has been notified via email.",
      post,
    });
  } catch (error) {
    console.error("Error approving post:", error);
    res.status(500).json({
      message: "An error occurred while approving the post",
      error: error.message,
    });
  }
};

// Unapprove Post
// export const unapprovePost = async (req, res) => {
//   const { id } = req.params;

//   try {
//     // Fetch the post along with the associated user
//     const post = await Post.findByPk(id, {
//       include: {
//         model: User,
//         attributes: ["email"],
//       },
//     });

//     if (!post) {
//       return res.status(404).json({ message: "Post not found" });
//     }

//     // Update the post status
//     post.status = "unapproved";
//     await post.save();

//     // Prepare the email content
//     const emailMessage = `
//       <h1>Post Unapproved</h1>
//       <h2> Dear ${post.User.name} </h2>
//       <p>Post ID: ${post.id}</p>
//       <p>Your post having problem statement "<strong>${post.problemDiscussion_problemStatement}</strong>" has been Rejected.</p>
//     `;

//     // Check if the user email exists and send the email
//     const userEmail = post.User?.email;
//     if (userEmail) {
//       const subject = "Post Unapproved Notification";
//       await sendEmail(userEmail, subject, emailMessage);
//       console.log("Notification email sent to the user.");
//     } else {
//       console.warn("User email not found. No email notification sent.");
//     }

//     // Respond to the client
//     res.status(200).json({
//       message:
//         "Post unapproved successfully, and the user has been notified via email.",
//       post,
//     });
//   } catch (error) {
//     console.error("Error unapproving post:", error);
//     res.status(500).json({
//       message: "An error occurred while unapproving the post",
//       error: error.message,
//     });
//   }
// };

export const unapprovePost = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the post along with the associated user
    const post = await Post.findByPk(id, {
      include: {
        model: User,
        attributes: ["email", "name"],
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Update the post status
    post.status = "open";
    await post.save();

    // Prepare the email content
    const emailMessage = `
      <h1>Post Rejected</h1>
      <h2> Dear ${post.User.name} </h2>
      <p>Post ID: ${post.id}</p>
      <p>Your post having problem statement "<strong>${post.problemDiscussion_problemStatement}</strong>" has been Rejected.</p>
    `;

    // Check if the user email exists and send the email
    const userEmail = post.User?.email;
    if (userEmail) {
      const subject = "Post Rejected Notification";
      await sendEmail(userEmail, subject, emailMessage);
      console.log("Notification email sent to the user.");
    } else {
      console.warn("User email not found. No email notification sent.");
    }

    // Respond to the client
    res.status(200).json({
      message:
        "Post Rejected successfully, and the user has been notified via email.",
      post,
    });
  } catch (error) {
    console.error("Error unapproving post:", error);
    res.status(500).json({
      message: "An error occurred while unapproving the post",
      error: error.message,
    });
  }
};


// send review email
export const sendReviewEmail = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the post
    const post = await Post.findByPk(id, {
      include: [{ model: User, attributes: ["name"] }],
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Fetch admin emails
    const admins = await Admin.findAll({ attributes: ["email"] });
    const adminEmails = admins.map((admin) => admin.email);

    if (adminEmails.length === 0) {
      return res.status(404).json({ message: "No admin emails found" });
    }

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: adminEmails,
      subject: `Review Request: CAPA ${post.capaNumber}`,
      html: `
       <div style="font-family: 'Poppins', Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet" />
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://media.licdn.com/dms/image/v2/C510BAQEt38vgnN5-rQ/company-logo_100_100/company-logo_100_100/0/1630598962284/al_rahim_textile_industries_logo?e=2147483647&v=beta&t=q2ifOsTCbiro7UzLjX3oevAKJAtlcrMyBYaJidvy9Kc" alt="Company Logo" style="width: 150px; height: auto;" />
    </div>
    <h2 style="text-align: center; color: #4CAF50;">Post Review Request</h2>
    <p><strong>From:</strong> ${post.User.name}</p>
    <p><strong>CAPA Number:</strong> ${post.capaNumber}</p>
    <p><strong>Problem Statement:</strong> ${
      post.problemDiscussion_problemStatement
    }</p>
    <br />
    <p style="text-align: center;">
      <a href="https://www.alrahimtextile.com/" style="padding: 10px 20px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 5px;">Visit Our Website</a>
    </p>
    <p style="text-align: center; font-size: 12px; color: #aaa;">&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
  </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Email sent successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
};
