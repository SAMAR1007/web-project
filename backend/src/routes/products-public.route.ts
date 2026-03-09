import { Router } from 'express';
import { listPublicProducts, getProduct, listDealProducts } from '../controller/product.controller';

const router = Router();

router.get('/', listPublicProducts);
router.get('/deals', listDealProducts);
router.get('/:id', getProduct);

export default router;
