import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import mahsulotRouter from './routes/mahsulot.js';
import xato from './middleware/xato.js';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Standart middleware'lar
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 2. Yo'nalishlar (Routes)
app.use('/mahsulotlar', mahsulotRouter);

// 3. Xatoliklarni tutuvchi middleware (eng oxirida ulanishi shart!)
app.use(xato);

// 4. Ma'lumotlar bazasiga ulanish va serverni ishga tushirish
if (process.env.NODE_ENV !== 'test' && process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server http://localhost:${PORT} da ishlayapti`);
      });
    })
    .catch((err) => {
      console.error("MongoDB ga ulanib bo'lmadi:", err.message);
    });
}

export default app;
