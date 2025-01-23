import path from 'path';
import express from 'express'
import { verifyToken } from '../utils/verifyUser.js';
import { create, deletecategory, getcategory, updatecategory } from '../controllers/categoryController.js';

const router = express.Router();

// Routes
router.post('/create',verifyToken, create);
router.put('/updatecategory/:categoryId/:userId',  verifyToken, updatecategory);
router.get('/getcategory', getcategory);
router.delete('/deletecategory/:categoryId/:userId', verifyToken, deletecategory);

export default router;
