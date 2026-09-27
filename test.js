// Sinov uchun: marshrutlarni tekshirish (MongoDB memory server bilan)
// Ishga tushirish:  node test.js
require('dotenv').config();

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

(async () => {
  const mongo = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongo.getUri('sahifa');

  await mongoose.connect(process.env.MONGO_URI);

  const Mahsulot = require('./models/Mahsulot');
  await Mahsulot.create({ name: 'Test telefon', category: 'elektronika', price: 1000, qty: 2 });

  // server.js o'z-o'zidan ishlaydi va shu MONGO_URI ga ulanadi
  require('./server.js');

  setTimeout(async () => {
    const base = `http://localhost:${process.env.PORT || 3000}`;
    const id = (await Mahsulot.find().lean())[0]._id.toString();
    const yoqId = '66f000000000000000000000';

    async function tekshir(nomi, url, usul, kutilganKod, body) {
      const javob = await fetch(base + url, {
        method: usul,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await javob.json().catch(() => ({}));
      const holat = javob.status === kutilganKod ? 'OK  ' : 'FAIL';
      console.log(
        `${holat} | ${nomi.padEnd(28)} -> ${javob.status} (kutilgan ${kutilganKod}) | ${JSON.stringify(data).slice(0, 90)}`
      );
    }

    console.log("\n--- O'CHIRISH (DELETE) ---");
    await tekshir("O'z mahsulotini o'chirish", `/mahsulotlar/${id}`, 'DELETE', 200);
    await tekshir("Mavjud bo'lmagan _id", `/mahsulotlar/${yoqId}`, 'DELETE', 404);
    await tekshir("Buzilgan _id (abc)", '/mahsulotlar/abc', 'DELETE', 400);

    console.log("\n--- O'ZGARTIRISH (PATCH) ---");
    const ikkinchi = await Mahsulot.create({ name: 'Test kitob', category: 'kitob', price: 5000, qty: 1 });
    const id2 = ikkinchi._id.toString();
    await tekshir('qty ni 1 ga oshirish', `/mahsulotlar/${id2}`, 'PATCH', 200, { qty: 2 });
    await tekshir("Begona kategoriya", `/mahsulotlar/${id2}`, 'PATCH', 400, { category: 'mashina' });
    await tekshir("Mavjud bo'lmagan _id", `/mahsulotlar/${yoqId}`, 'PATCH', 404, { qty: 5 });
    await tekshir("Buzilgan _id (abc)", '/mahsulotlar/abc', 'PATCH', 400, { qty: 5 });

    await mongoose.disconnect();
    await mongo.stop();
    process.exit(0);
  }, 1500);
})();
