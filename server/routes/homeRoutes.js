import path from 'path';
import express from 'express'
import { verifyToken } from '../utils/verifyUser.js';
import { create, deletehome, gethome, updatehome } from '../controllers/homeController.js';

const router = express.Router();

// Routes
router.post('/create',verifyToken, create);
router.put('/updatehome/:homeId/:userId',  verifyToken, updatehome);
router.get('/gethome', gethome);
router.delete('/deletehome/:homeId/:userId', verifyToken, deletehome);

export default router;
