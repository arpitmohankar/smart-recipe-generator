/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  IconButton,
  LinearProgress
} from '@mui/material';

// ✅ MUI v7 Grid2 import
import Grid from '@mui/material/GridLegacy';

import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Image as ImageIcon
} from '@mui/icons-material';

interface ImageUploadProps {
  onImagesSelect: (files: File[]) => void;
  onAnalyze: () => void;
  selectedImages: File[];
  isLoading: boolean;
}

const ImageUpload = ({ onImagesSelect, onAnalyze, selectedImages, isLoading }: ImageUploadProps) => {
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length + selectedImages.length > 10) {
      alert('Maximum 10 images allowed');
      return;
    }

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
    onImagesSelect([...selectedImages, ...files]);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    onImagesSelect(newImages);
  };

  return (
    <Paper sx={{ p: 3, bgcolor: 'background.paper' }}>
      <Stack spacing={2}>
        <Typography variant="h6">Upload Ingredient Images</Typography>
        <Typography variant="body2" color="text.secondary">
          Upload up to 10 images of your available ingredients
        </Typography>

        <Button
          component="label"
          variant="outlined"
          startIcon={<UploadIcon />}
          disabled={selectedImages.length >= 10 || isLoading}
        >
          Choose Images
          <input
            type="file"
            hidden
            multiple
            accept="image/*"
            onChange={handleFileSelect}
          />
        </Button>

        {previews.length > 0 && (
          <Grid container spacing={2}>
            {previews.map((preview, index) => (
              <Grid xs={6} sm={4} md={3} key={index}>
                <Box sx={{ position: 'relative' }}>
                  <img
                    src={preview}
                    alt={`Ingredient ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '120px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                  <IconButton
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      bgcolor: 'rgba(0,0,0,0.6)'
                    }}
                    onClick={() => handleRemoveImage(index)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}

        {selectedImages.length > 0 && (
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              onClick={onAnalyze}
              disabled={isLoading}
              fullWidth
            >
              {isLoading ? 'Analyzing...' : `Analyze ${selectedImages.length} Image(s)`}
            </Button>
          </Stack>
        )}

        {isLoading && <LinearProgress />}
      </Stack>
    </Paper>
  );
};

export default ImageUpload;
