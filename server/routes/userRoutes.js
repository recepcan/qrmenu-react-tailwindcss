import express from 'express';
import {
  deleteUser,
  getUser,
  getUsers,
  signout,
  test,
  updateUser,
} from '../controllers/userController.js';
import { verifyToken } from '../utils/verifyUser.js';
import { verifyOwner } from '../utils/verifyOwner.js';
import { verifyAdmin } from '../utils/verifyAdmin.js';

const router = express.Router();

router.get('/test', test);
router.put('/update/:userId', verifyToken,verifyAdmin, updateUser);
router.delete('/delete/:userId', verifyToken,verifyAdmin, deleteUser);
router.post('/signout', signout);
router.get('/getusers',verifyToken,verifyAdmin,verifyOwner, getUsers);
router.get('/:userId', getUser);
router.get('/username/:username', getUser);
export default router;