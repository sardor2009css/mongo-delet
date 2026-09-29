import { Router } from 'express';
import { hammasi, bitta, qoshish, ochirish, ozgartirish } from '../controllers/mahsulot.js';

const router = Router();

// Diqqat: '/mahsulotlar' server.js faylidagi app.use('/mahsulotlar', router) da belgilangan
// Shu sababli bu yerda faqat '/' va '/:id' yoziladi

router.get('/', hammasi);           // GET /mahsulotlar
router.get('/:id', bitta);          // GET /mahsulotlar/:id
router.post('/', qoshish);          // POST /mahsulotlar
router.delete('/:id', ochirish);    // DELETE /mahsulotlar/:id
router.patch('/:id', ozgartirish);  // PATCH /mahsulotlar/:id

export default router;
