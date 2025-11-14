// src/controllers/imageController.ts
import { Request, Response } from 'express';
import { identifyIngredientsFromImage } from '../services/clarifaiService';

export const analyzeImages = async (req: Request, res: Response) => {
  try {
    if (!req.files || !Array.isArray(req.files)) {
      return res.status(400).json({
        success: false,
        message: 'No images provided'
      });
    }

    const files = req.files as Express.Multer.File[];
    
    if (files.length > 10) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 10 images allowed'
      });
    }

    const allIngredients: string[] = [];

    for (const file of files) {
      const base64 = file.buffer.toString('base64');
      const ingredients = await identifyIngredientsFromImage(base64);
      allIngredients.push(...ingredients);
    }

    const uniqueIngredients = [...new Set(allIngredients)];

    res.json({
      success: true,
      ingredients: uniqueIngredients,
      imageCount: files.length
    });
  } catch (error) {
    console.error('Image analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Error analyzing images'
    });
  }
};
