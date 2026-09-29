process.env.NODE_ENV = 'test';
import 'dotenv/config';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

(async () => {
  let mongo;
  try {
    mongo = await MongoMemoryServer.create();
    process.env.MONGO_URI = mongo.getUri('sahifa_test');
  } catch (e) {
    console.log('.env dagi bazadan foydalaniladi');
  }

  const PORT = 3999;
  process.env.PORT = PORT;

  await mongoose.connect(process.env.MONGO_URI);

  const { default: Mahsulot } = await import('./models/Mahsulot.js');
  const mahsulot = await Mahsulot.create({ name: 'Test telefon', category: 'elektronika', price: 1000, qty: 2 });
  const id = mahsulot._id.toString();

  const { default: app } = await import('./server.js');
  const server = app.listen(PORT);

  const base = `http://localhost:${PORT}`;
  const yoqId = '66f000000000000000000000';

  async function tekshir(nomi, url, usul, kutilganKod, body) {
    const javob = await fetch(base + url, {
      method: usul,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await javob.json().catch(() => ({}));
    const holat = javob.status === kutilganKod ? 'PASS' : 'FAIL';
    console.log(
      `[${holat}] | ${nomi.padEnd(32)} -> Javob: ${javob.status} (Kutilgan: ${kutilganKod}) | ${JSON.stringify(data).slice(0, 75)}`
    );
    return javob.status === kutilganKod;
  }

  console.log('\n================ MD VAZIFASIDAGI ASOSIY 3 TA TEKSHIRUV ================');
  await tekshir("1) O'z mahsulotini o'chirish", `/mahsulotlar/${id}`, 'DELETE', 200);
  await tekshir("2) Mavjud bo'lmagan to'g'ri _id", `/mahsulotlar/${yoqId}`, 'DELETE', 404);
  await tekshir("3) Noto'g'ri _id ('abc')", '/mahsulotlar/abc', 'DELETE', 400);

  console.log("\n================ QO'SHIMCHA TEKSHIRUVLAR ================");
  const yangi = await Mahsulot.create({ name: 'Test kitob', category: 'kitob', price: 5000, qty: 1 });
  await tekshir('Barcha mahsulotlarni olish', '/mahsulotlar', 'GET', 200);
  await tekshir('PATCH qty ni oshirish', `/mahsulotlar/${yangi._id}`, 'PATCH', 200, { qty: 3 });
  await tekshir("PATCH noto'g'ri kategoriya", `/mahsulotlar/${yangi._id}`, 'PATCH', 400, { category: 'avtomobil' });

  server.close();
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
  console.log('\nBarcha testlar muvaffaqiyatli yakunlandi!\n');
  process.exit(0);
})();
