require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Mahsulot = require('./models/Mahsulot');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function sendError(res, xato) {
  if (xato instanceof mongoose.Error.CastError) {
    return res.status(400).json({ xato: 'Noto\'g\'ri _id formati', malumot: xato.value });
  }

  if (xato instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      xato: 'Ma\'lumot noto\'g\'ri',
      xatolar: Object.values(xato.errors).map((e) => e.message),
    });
  }

  console.error(xato);
  return res.status(500).json({ xato: 'Serverda xato yuz berdi' });
}

app.get('/mahsulotlar', async (req, res) => {
  try {
    res.status(200).json(await Mahsulot.find().sort({ createdAt: -1 }));
  } catch (xato) {
    sendError(res, xato);
  }
});

app.get('/mahsulotlar/:id', async (req, res) => {
  try {
    const mahsulot = await Mahsulot.findById(req.params.id);
    if (!mahsulot) return res.status(404).json({ xato: 'Mahsulot topilmadi' });
    res.status(200).json(mahsulot);
  } catch (xato) {
    sendError(res, xato);
  }
});

app.post('/mahsulotlar', async (req, res) => {
  try {
    res.status(201).json(await Mahsulot.create(req.body));
  } catch (xato) {
    sendError(res, xato);
  }
});

app.delete('/mahsulotlar/:id', async (req, res) => {
  try {
    const mahsulot = await Mahsulot.findByIdAndDelete(req.params.id);
    if (!mahsulot) return res.status(404).json({ xato: 'Mahsulot topilmadi' });
    res.status(200).json(mahsulot);
  } catch (xato) {
    sendError(res, xato);
  }
});

app.patch('/mahsulotlar/:id', async (req, res) => {
  try {
    const { name, category, price, qty } = req.body;
    const yangilanish = {};
    if (name !== undefined) yangilanish.name = name;
    if (category !== undefined) yangilanish.category = category;
    if (price !== undefined) yangilanish.price = price;
    if (qty !== undefined) yangilanish.qty = qty;

    const mahsulot = await Mahsulot.findByIdAndUpdate(req.params.id, yangilanish, {
      new: true,
      runValidators: true,
    });

    if (!mahsulot) return res.status(404).json({ xato: 'Mahsulot topilmadi' });
    res.status(200).json(mahsulot);
  } catch (xato) {
    sendError(res, xato);
  }
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`Server http://localhost:${PORT} da ishlayapti`)))
  .catch((xato) => console.error('MongoDB ga ulanib bo\'lmadi:', xato.message));
