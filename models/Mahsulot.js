import mongoose from 'mongoose';

// Mahsulot sxemasi: har bir mahsulot qanday maydonlarga ega bo'lishini belgilaydi
const MahsulotSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: {
        values: ['elektronika', 'kiyim', 'kitob', 'oziq-ovqat'],
        message: "Bunday kategoriya yo'q",
      },
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    qty: {
      type: Number,
      default: 1,
      min: 0,
    },
  },
  {
    timestamps: true, // createdAt va updatedAt vaqtlarini avtomatik yozadi
    collection: 'mahsulotlar',
  }
);

// Faqat sxema va modelni export qilamiz
export default mongoose.model('Mahsulot', MahsulotSchema);
