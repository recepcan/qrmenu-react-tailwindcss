import fs from 'fs';
import Category from '../models/categoryModel.js';
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

// ✅ ÜRÜN GÜNCELLE
export const updatecategory = async (req, res, next) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return next(errorHandler(500, 'Image upload failed'));
    }

    try {
      if (!req.user.isAdmin || req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to update this category'));
      }

      const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.image;

      const updatedCategory = await Category.findByIdAndUpdate(
        req.params.categoryId,
        {
          $set: {
            title: req.body.title,
           name:req.body.name,
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

// ✅ ÜRÜNLERİ GETİR
export const getcategory = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;

    const category = await Category.find({
      ...(req.query.userId && { userId: req.query.userId }),
    //   ...(req.query.category && { category: req.query.category }),
      // ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.categoryId && { _id: req.query.categoryId }),
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

    const totalCategory = await Category.countDocuments();

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


// ✅ ÜRÜN SİL
export const deletecategory = async (req, res, next) => {
  try {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
      return next(errorHandler(403, 'You are not allowed to delete this Category'));
    }

    // Ürünü veritabanından bul
    const category = await Category.findById(req.params.categoryId);
    if (!category) {
      return next(errorHandler(404, 'Category not found'));
    }

    // Ürünün resim dosyasını sil
    const fileName = path.basename(category.image); // Sadece dosya adını al
    const imagePath = path.join(__dirname, '..', 'uploads', fileName); // Tam dosya yolunu oluştur

    fs.unlink(imagePath, (err) => {
      console.log(imagePath,"imagePath")
      if (err) {
        console.error('Resim silinirken hata oluştu:');
        return next(errorHandler(500, 'Image could not be deleted '));
      }

      // Ürünü veritabanından sil
      Category.findByIdAndDelete(req.params.categoryId)
        .then(() => {
          res.status(200).json('The Category has been deleted');
        })
        .catch((error) => {
          next(error);
        });
    });
  } catch (error) {
    next(error);
  }
};