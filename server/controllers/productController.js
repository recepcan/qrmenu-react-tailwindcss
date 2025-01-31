import fs from 'fs';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';

import { errorHandler } from '../utils/error.js';
import multer from 'multer';
import path from 'path';


const __dirname = path.resolve()
// "uploads" klasörü yoksa oluştur
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer ayarları
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// ✅ ÜRÜN OLUŞTUR
export const create = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, 'You are not allowed to create a product'));
    }
    if (!req.body.title || !req.body.category || !req.body.image) {
      return next(errorHandler(400, 'Please provide all required fields'));
    }

    const newProduct = new Product({
      title: req.body.title,
      price: req.body.price,
      stock: req.body.stock,
      category: req.body.category,
      content: req.body.content,
      userId: req.user.id,
      username: req.user.username,
      image: req.body.image, // Frontend'den gelen URL'yi kullanıyoruz
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    next(error);
  }
};


export const updateproduct = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update this product'));
  }
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          price: req.body.price,
          stock: req.body.stock,
          category: req.body.category,
          image: req.body.image,
          username:req.user.username
        },
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

// ✅ ÜRÜNLERİ GETİR
export const getproducts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    let userId = null;

    // Eğer `username` parametresi varsa, ilgili `userId` değerini bul
    if (req.query.username) {
      const user = await User.findOne({ username: req.query.username });
      if (user) {
        userId = user._id;
      } else {
        return next(errorHandler(404, "User not found"));
      }
    }

    const filter = {
      ...(userId && { userId }), // Eğer username ile eşleşen userId bulunduysa ekle
      ...(req.query.userId && { userId: req.query.userId }), // Alternatif olarak doğrudan userId filtreleme
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.productId && { _id: req.query.productId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    };

    const products = await Product.find(filter)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalProducts = await Product.countDocuments(filter);
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthProducts = await Product.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      products,
      totalProducts,
      lastMonthProducts
    });
  } catch (error) {
    next(error);
  }
};



// ✅ ÜRÜN SİL
export const deleteproduct = async (req, res, next) => {
  try {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
      return next(errorHandler(403, "You are not allowed to delete this product"));
    }

    // Ürünü veritabanından bul
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return next(errorHandler(404, "Product not found"));
    }

    // Ürünün resim dosyasını sil
    if (product.image) {
      const fileName = path.basename(product.image);
      const imagePath = path.join(__dirname, "uploads", fileName);

      try {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log("Image deleted successfully:", imagePath);
        } else {
          console.log("File not found, skipping delete:", imagePath);
        }
      } catch (err) {
        console.error("Error deleting the image:", err);
        return next(errorHandler(500, "Image could not be deleted"));
      }
    }

    // Ürünü veritabanından sil
    await Product.findByIdAndDelete(req.params.productId);
    res.status(200).json("The product has been deleted");
  } catch (error) {
    next(error);
  }
};
