import fs from 'fs';
import Category from '../models/categoryModel.js';
import User from '../models/userModel.js';
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

// ✅ category OLUŞTUR
export const create = async (req, res, next) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return next(errorHandler(500, 'Image upload failed'));
    }

    try {
      if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not allowed to create a category'));
      }
      if (!req.body.title || !req.body.name) {
        return next(errorHandler(400, 'Please provide all required fields'));
      }

      const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

      const newCategory = new Category({
        title: req.body.title,
        name:req.body.name,
        userId: req.user.id,
        image: imageUrl,
      });

      const savedCategory = await newCategory.save();
      res.status(201).json(savedCategory);
    } catch (error) {
      next(error);
    }
  });
};

// ✅ KATEGORİ GÜNCELLEME
export const updatecategory = async (req, res, next) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      return next(errorHandler(500, "Image upload failed"));
    }

    try {
      if (!req.user.isAdmin || req.user.id !== req.params.userId) {
        return next(errorHandler(403, "You are not allowed to update this category"));
      }

      // Eski kategoriyi bul
      const category = await Category.findById(req.params.categoryId);
      if (!category) {
        return next(errorHandler(404, "Category not found"));
      }

      let imageUrl = category.image; // Varsayılan olarak eski resim kalır

      // Eğer yeni bir resim yüklenirse
      if (req.file) {
        // Eski resmi sil
        if (category.image) {
          const fileName = path.basename(category.image); // Dosya adını al
          const imagePath = path.join(uploadDir, fileName); // Dosya yolunu oluştur

          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            console.log(`Old image deleted: ${imagePath}`);
          }
        }

        // Yeni resim yolunu belirle
        imageUrl = `/uploads/${req.file.filename}`;
      }

      // Kategoriyi güncelle
      const updatedCategory = await Category.findByIdAndUpdate(
        req.params.categoryId,
        {
          $set: {
            title: req.body.title,
            name: req.body.name,
            image: imageUrl,
          },
        },
        { new: true }
      );

      res.status(200).json(updatedCategory);
    } catch (error) {
      next(error);
    }
  });
};




// ✅  CATEGORİLERİ  GETİR
export const getcategory = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;

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
      ...(req.query.categoryId && { _id: req.query.categoryId }), // categoryId filtreleme
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: 'i' } },
          { content: { $regex: req.query.searchTerm, $options: 'i' } },
        ],
      }),
    };

    const category = await Category.find(filter)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalCategory = await Category.countDocuments(filter);

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthCategory = await Category.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      category,
      totalCategory,
      lastMonthCategory,
    });
  } catch (error) {
    next(error);
  }
};





// ✅ KATEGORİ SİLME
export const deletecategory = async (req, res, next) => {
  try {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
      return next(errorHandler(403, "You are not allowed to delete this Category"));
    }

    // Kategoriyi bul
    const category = await Category.findById(req.params.categoryId);
    if (!category) {
      return next(errorHandler(404, "Category not found"));
    }

    // Eğer resim varsa, dosyayı sil
    if (category.image) {
      const fileName = path.basename(category.image);
      const imagePath = path.join(uploadDir, fileName);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log(`Image deleted: ${imagePath}`);
      }
    }

    // Kategoriyi veritabanından sil
    await Category.findByIdAndDelete(req.params.categoryId);
    res.status(200).json({ message: "The Category has been deleted" });

  } catch (error) {
    next(error);
  }
};