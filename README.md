# Sahifa — Mahsulotni o'chirish va o'zgartirish (DZZ 29.09)

Oddiy, ochiq kod bilan yozilgan. Har bir qatorida izoh (comment) bor.

## Fayllar

```
sahifa/
├── server.js          # Express server + yangi DELETE va PATCH marshrutlari
├── models/
│   └── Mahsulot.js    # Mongoose modeli (category enum shu yerda)
├── public/
│   ├── index.html      # Tailwind bilan chiroyli sahifa
│   └── app.js          # «O'chirish» va «+1» tugmalari
├── seed.js            # Namuna mahsulotlar qo'shish
├── test.js            # Marshrutlarni tekshirish (ixtiyoriy)
└── .env               # Sozlashlar (GitHub'ga qo'maymiz!)
```

## Ishga tushirish

```bash
npm install
npm run seed     # namuna mahsulotlar qo'shish (ixtiyoriy)
npm start        # http://localhost:3000
```

MongoDB kerak: kompyuterda `mongod` yoki **MongoDB Atlas** (`.env` dagi `MONGO_URI`).

> `.env` `.gitignore` da turadi — GitHub'ga hech qachon yuklanmaydi. Sizning Atlas
> parolingiz shu faylda saqlanadi, shuning uchun uni hech qayerda kodingga yozmang.

---

## 1. Server: yangi ikkita marshrut

### `DELETE /mahsulotlar/:id` — mahsulotni o'chirish

```js
const mahsulot = await Mahsulot.findByIdAndDelete(req.params.id);

if (!mahsulot) return res.status(404).json({ xato: 'Mahsulot topilmadi' });

res.status(200).json(mahsulot);
```

### `PATCH /mahsulotlar/:id` — mahsulotni o'zgartirish

```js
const mahsulot = await Mahsulot.findByIdAndUpdate(
  req.params.id,
  yangilanish,
  { new: true, runValidators: true }
);

if (!mahsulot) return res.status(404).json({ xato: 'Mahsulot topilmadi' });

res.status(200).json(mahsulot);
```

| So'rov | Natija |
|---|---|
| `DELETE /mahsulotlar/66f000000000000000000000` | **404** — bunday mahsulot bazada yo'q |
| `DELETE /mahsulotlar/abc` | **400** — `abc` MongoDB ObjectId emas |
| `PATCH /mahsulotlar/<id>` + `{"category":"mashina"}` | **400** — kategoriya `enum` da yo'q |

### Nega 404, nega 400? (doskaga tushuntirish uchun)

- **400** — so'rovning o'zi noto'g'ri: id buzilgan yoki ma'lumot qoidaga mos kelmagan
  (`CastError` va `ValidationError` buni aniqlaydi, `sendError` esa 400 qaytaradi).
- **404** — so'rov to'g'ri, lekin bazada shunday ma'lumot yo'q. `findByIdAndDelete` /
  `findByIdAndUpdate` bu holatda **xato bermaydi**, `null` qaytaradi — biz shu `null` ni
  ko'rib 404 beramiz.

### Ikki variant `new: true, runValidators: true`

- `new: true` — eski mahsulotni emas, **yangilangan** mahsulotni qaytaradi
  (aks holda eski ma'lumot qaytarilardi).
- `runValidators: true` — yangilashda ham model qoidalari tekshiriladi
  (masalan `category: "mashina"` -> 400). Aks holda xato jim o'tib ketardi.

---

## 2. Sahifa: «O'chirish» va «+1» tugmalari

Tugmalar `qatorYasash(mahsulot)` ichida yaratiladi — u yerda butun mahsulot
obyekti bor, demak `mahsulot._id` ham bor.

```js
// +1 -> PATCH
fetch('/mahsulotlar/' + id, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ qty: mahsulot.qty + 1 }),
});

// O'chirish -> DELETE
fetch('/mahsulotlar/' + id, { method: 'DELETE' });
```

Server qaytargan **yangilangan** mahsulotni ro'yxatdagi eskisining o'rniga qo'yamiz,
shuning uchun sahifa qayta yuklanmaydi.

---

## 3. Tekshirish (Postman yoki brauzer konsoli F12 → Console)

```js
await fetch('/mahsulotlar/66f000000000000000000000', { method: 'DELETE' }); // 404
await fetch('/mahsulotlar/abc', { method: 'DELETE' });                      // 400
```

Avtomatik tekshirish:

```bash
node test.js
```
