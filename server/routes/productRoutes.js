import express from 'express';
import multer from 'multer';
import path from 'path';
import { verifyToken } from '../utils/verifyUser.js';
import { create, deleteproduct, getproducts, updateproduct } from '../controllers/productController.js';

const router = express.Router();

// Routes
router.post('/create',verifyToken, create);
router.put('/updateproduct/:productId/:userId',  verifyToken, updateproduct);
router.get('/getproducts', getproducts);

router.delete('/deleteproduct/:productId/:userId', verifyToken, deleteproduct);

export default router;
