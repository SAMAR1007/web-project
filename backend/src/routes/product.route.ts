import { Router } from 'express';
import {
  createProduct,
  listAdminProducts,
  updateProduct,
  deleteProduct,
  getProduct,
} from '../controller/product.controller';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware';
import { upload } from '../config/multer';

const router = Router();

router.post('/', verifyToken, isAdmin, upload.single('image'), createProduct);
router.get('/', verifyToken, isAdmin, listAdminProducts);
router.get('/:id', getProduct);
router.put('/:id', verifyToken, isAdmin, upload.single('image'), updateProduct);
router.delete('/:id', verifyToken, isAdmin, deleteProduct);

export default router;
