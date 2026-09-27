const mongoose = require('mongoose');

const MahsulotSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: {
        values: ['elektronika', 'kiyim', 'kitob', 'oziq-ovqat'],
        message: 'Bunday kategoriya yo\'q',
      },
    },
    price: { type: Number, required: true, min: 0 },
    qty: { type: Number, default: 1, min: 0 },
  },
  { timestamps: true, collection: 'mahsulotlar' }
);

module.exports = mongoose.model('Mahsulot', MahsulotSchema);
