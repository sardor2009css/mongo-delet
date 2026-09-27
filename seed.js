// Namuna mahsulotlar qo'shish:  npm run seed
// Xavfsizlik uchun: agar bazada mahsulotlar bo'lsa, hech narsani O'CHIRMAYDIZ.
require('dotenv').config();
const mongoose = require('mongoose');
const Mahsulot = require('./models/Mahsulot');

const namunalar = [
  { name: 'Noutbuk Lenovo', category: 'elektronika', price: 6500000, qty: 3 },
  { name: 'Samsung Galaxy A54', category: 'elektronika', price: 3800000, qty: 5 },
  { name: "Ko'yIlak (o'qituvchi)", category: 'kiyim', price: 220000, qty: 8 },
  { name: 'Chitoy kitob', category: 'kitob', price: 45000, qty: 12 },
  { name: 'Olma (1 kg)', category: 'oziq-ovqat', price: 12000, qty: 40 },
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    const mavjud = await Mahsulot.countDocuments();

    if (mavjud > 0) {
      console.log(`Bazada ${mavjud} ta mahsulot bor — namunalar qo'shilmadi (o'chirilmadi ham).`);
    } else {
      await Mahsulot.insertMany(namunalar);
      console.log(`${namunalar.length} ta namuna mahsulot qo'shildi.`);
    }

    await mongoose.disconnect();
  })
  .catch((xato) => {
    console.error('Xato:', xato.message);
    process.exit(1);
  });
