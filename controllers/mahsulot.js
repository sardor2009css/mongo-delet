import Mahsulot from '../models/Mahsulot.js';

// 1. Barcha mahsulotlarni olish
export async function hammasi(req, res) {
  const mahsulotlar = await Mahsulot.find().sort({ createdAt: -1 });
  res.status(200).json(mahsulotlar);
}

// 2. Bitta mahsulotni id bo'yicha olish (ixtiyoriy, qulaylik uchun)
export async function bitta(req, res) {
  const mahsulot = await Mahsulot.findById(req.params.id);
  if (!mahsulot) {
    return res.status(404).json({ xato: 'Mahsulot topilmadi' });
  }
  res.status(200).json(mahsulot);
}

// 3. Yangi mahsulot qo'shish
export async function qoshish(req, res) {
  const yangi = await Mahsulot.create(req.body);
  res.status(201).json(yangi);
}

// 4. Mahsulotni o'chirish (DELETE)
export async function ochirish(req, res) {
  const mahsulot = await Mahsulot.findByIdAndDelete(req.params.id);

  // Agar ID formati to'g'ri bo'lib, lekin bazada topilmasa -> 404
  if (!mahsulot) {
    return res.status(404).json({ xato: 'Mahsulot topilmadi' });
  }

  // Muvaffaqiyatli o'chirilsa -> 200
  res.status(200).json(mahsulot);
}

// 5. Mahsulotni o'zgartirish (PATCH)
export async function ozgartirish(req, res) {
  const { name, category, price, qty } = req.body;

  // Faqat kelgan maydonlarni yangilaymiz
  const yangilanish = {};
  if (name !== undefined) yangilanish.name = name;
  if (category !== undefined) yangilanish.category = category;
  if (price !== undefined) yangilanish.price = price;
  if (qty !== undefined) yangilanish.qty = qty;

  const mahsulot = await Mahsulot.findByIdAndUpdate(req.params.id, yangilanish, {
    new: true, // yangilangan natijani qaytarish
    runValidators: true, // model validatsiyasini tekshirish
  });

  if (!mahsulot) {
    return res.status(404).json({ xato: 'Mahsulot topilmadi' });
  }

  res.status(200).json(mahsulot);
}
