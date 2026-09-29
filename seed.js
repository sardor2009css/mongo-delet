import 'dotenv/config';
import mongoose from 'mongoose';
import Mahsulot from './models/Mahsulot.js';

const namunalar = [
  { name: 'Noutbuk Lenovo', category: 'elektronika', price: 6500000, qty: 3 },
  { name: 'Samsung Galaxy A54', category: 'elektronika', price: 3800000, qty: 5 },
  { name: "Ko'ylak (o'qituvchi)", category: 'kiyim', price: 220000, qty: 8 },
  { name: 'Chiroyli kitob', category: 'kitob', price: 45000, qty: 12 },
  { name: 'Olma (1 kg)', category: 'oziq-ovqat', price: 12000, qty: 40 },
];

try {
  await mongoose.connect(process.env.MONGO_URI);
  const mavjud = await Mahsulot.countDocuments();

  if (mavjud > 0) {
    console.log(`Bazada ${mavjud} ta mahsulot bor — namunalar qayta qo'shilmadi.`);
  } else {
    await Mahsulot.insertMany(namunalar);
    console.log(`${namunalar.length} ta namuna mahsulot qo'shildi.`);
  }

  await mongoose.disconnect();
} catch (err) {
  console.error('Xato:', err.message);
  process.exit(1);
}
