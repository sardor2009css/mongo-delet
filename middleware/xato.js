import mongoose from 'mongoose';

// Express xatoliklarni ushlovchi middleware bo'lishi uchun aynan 4 ta parametr talab qiladi:
// (err, req, res, next)
export default function xato(err, req, res, next) {
  // 1) Noto'g'ri formatdagi _id (masalan, /mahsulotlar/abc) -> 400 Bad Request
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      xato: "Noto'g'ri _id formati",
      malumot: err.value,
    });
  }

  // 2) Mongoose validatsiya xatolari (masalan, mavjud bo'lmagan kategoriya) -> 400 Bad Request
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      xato: "Ma'lumot noto'g'ri",
      xatolar: Object.values(err.errors).map((e) => e.message),
    });
  }

  // 3) Kutilmagan boshqa barcha xatolar -> 500 Internal Server Error
  console.error('Ichki server xatoligi:', err);
  return res.status(500).json({
    xato: 'Serverda xato yuz berdi',
  });
}
