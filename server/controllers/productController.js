import fs from 'fs';
import Product from '../models/productModel.js';
import { errorHandler } from '../utils/error.js';
import multer from 'multer';
import path from 'path';


const __dirname=path.resolve()
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
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return next(errorHandler(500, 'Image upload failed'));
    }

    try {
      if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not allowed to create a product'));
      }
      if (!req.body.title || !req.body.content) {
        return next(errorHandler(400, 'Please provide all required fields'));
      }

      const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

      const newProduct = new Product({
        title: req.body.title,
        content: req.body.content,
        price: req.body.price,
        stock: req.body.stock,
        category: req.body.category,
        userId: req.user.id,
        image: imageUrl,
      });

      const savedProduct = await newProduct.save();
      res.status(201).json(savedProduct);
    } catch (error) {
      next(error);
    }
  });
};

// ✅ ÜRÜN GÜNCELLE
export const updateproduct = async (req, res, next) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return next(errorHandler(500, 'Image upload failed'));
    }

    try {
      if (!req.user.isAdmin || req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to update this product'));
      }

      const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.image;

      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.productId,
        {
          $set: {
            stock: req.body.stock,
            price: req.body.price,
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
            image: imageUrl,
          },
        },
        { new: true }
      );

      res.status(200).json(updatedProduct);
    } catch (error) {
      next(error);
    }
  });
};

// ✅ ÜRÜNLERİ GETİR
export const getproducts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;

    const products = await Product.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      // ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.productId && { _id: req.query.productId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: 'i' } },
          { content: { $regex: req.query.searchTerm, $options: 'i' } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalProducts = await Product.countDocuments();

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
      lastMonthProducts,
    });
  } catch (error) {
    next(error);
  }
};


// ✅ ÜRÜN SİL
// ✅ ÜRÜN SİL
export const deleteproduct = async (req, res, next) => {
  try {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
      return next(errorHandler(403, 'You are not allowed to delete this product'));
    }

    // Ürünü veritabanından bul
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return next(errorHandler(404, 'Product not found'));
    }

    // Ürünün resim dosyasını sil
    const fileName = path.basename(product.image); // Sadece dosya adını al
    const imagePath = path.join(__dirname, '..', 'uploads', fileName); // Tam dosya yolunu oluştur

    fs.unlink(imagePath, (err) => {
      console.log(imagePath,"imagePath")
      if (err) {
        console.error('Resim silinirken hata oluştu:');
        return next(errorHandler(500, 'Image could not be deleted '));
      }

      // Ürünü veritabanından sil
      Product.findByIdAndDelete(req.params.productId)
        .then(() => {
          res.status(200).json('The product has been deleted');
        })
        .catch((error) => {
          next(error);
        });
    });
  } catch (error) {
    next(error);
  }
};