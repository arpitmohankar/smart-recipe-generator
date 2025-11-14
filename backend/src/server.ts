// src/server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import chatRoutes from './routes/chatRoutes';
import imageRoutes from './routes/imageRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api/chat', chatRoutes);
app.use('/api/images', imageRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
