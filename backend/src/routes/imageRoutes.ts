// src/routes/imageRoutes.ts
import { Router } from 'express';
import multer from 'multer';
import { analyzeImages } from '../controllers/imageController';

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10
  }
});

router.post('/analyze', upload.array('images', 10), analyzeImages);

export default router;
