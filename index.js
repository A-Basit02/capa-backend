import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
dotenv.config();

app.use(express.json()); // Body parser for JSON
app.use(cors());

// Connect to the database
connectDB();

// Dummy test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// API routes
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admins', adminRoutes);

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.message || err);
  res.status(err.status || 500).json({ error: err.message || "Something went wrong!" });
});

app.use(cors({
  origin: [ 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});





// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import { connectDB } from "./config/db.js";
// import userRoutes from "./routes/userRoutes.js";
// import postRoutes from "./routes/postRoutes.js";
// import adminRoutes from "./routes/adminRoutes.js";
// const app = express();
// dotenv.config();
// app.use(express.json()); // Body parser for JSON

// // Middleware
// const allowedOrigins = ["http://localhost:5173", "https://al-rahim-f.vercel.app" ];

// // Configure CORS middleware
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // Allow requests with no origin (like mobile apps, curl requests)
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.indexOf(origin) === -1) {
//         const msg =
//           "The CORS policy for this site does not allow access from the specified Origin.";
//         return callback(new Error(msg), false);
//       }
//       return callback(null, true);
//     },
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
//     allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
//     credentials: true,
//   })
// );

// // Connect to the database
// connectDB();
// app.use("/api/posts", postRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/admins", adminRoutes);
// // Error-handling middleware

// app.use((err, req, res, next) => {
//   console.error(err.message || err);
//   res
//     .status(err.status || 500)
//     .json({ error: err.message || "Something went wrong!" });
// });

// // const PORT = process.env.PORT || 5000;
// // app.listen(PORT, () => {
// //   console.log(`Server running on port ${PORT}`);
// // });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`Server running on port ${PORT}`);
// });