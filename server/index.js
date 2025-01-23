import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import path from 'path'

import userRoutes from './routes/userRoutes.js'
import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import Product from "./models/productModel.js";
import Category from "./models/categoryModel.js";
import User from "./models/userModel.js";

const app = express();

dotenv.config();
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // Tüm modellerin indexlerini kaldır
    await Promise.all([
      Product.collection.dropIndexes(),
      Category.collection.dropIndexes(),
      User.collection.dropIndexes(),
    ]);

    console.log("All indexes dropped successfully");

  } catch (error) {
    console.error("Error:", error);
  }
};

connectDB();
app.use(express.json());
app.use(cookieParser());

const __dirname = path.resolve();

app.use(cors({
  origin: 'http://localhost:5173', // Frontend'in çalıştığı port
  credentials: true, // Eğer yetkilendirme cookies kullanıyorsanız
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/server/auth', authRoutes);
app.use('/server/product', productRoutes);
app.use('/server/user', userRoutes);
app.use('/server/category', categoryRoutes);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "internal server error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
});

app.listen(process.env.PORT || 5000, () => {
  console.log("server is running on port 5000");
});
