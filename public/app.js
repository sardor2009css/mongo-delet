const royxat = document.getElementById('royxat');
const bosq = document.getElementById('bosq');
const forma = document.getElementById('forma');
const umumiySoni = document.getElementById('umumiySoni');
const yangilash = document.getElementById('yangilash');
const maydon = {
  name: document.getElementById('name'),
  category: document.getElementById('category'),
  price: document.getElementById('price'),
  qty: document.getElementById('qty'),
};

let mahsulotlar = [];

function xabar(matn, xato = false) {
  const div = document.createElement('div');
  div.className =
    'animate-toast rounded-2xl border px-4 py-3 text-sm font-semibold shadow-2xl backdrop-blur-xl ' +
    (xato
      ? 'border-rose-500/40 bg-rose-500/10 text-rose-300'
      : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300');
  div.textContent = matn;
  document.getElementById('toastlar').appendChild(div);

  setTimeout(() => {
    div.classList.add('opacity-0', 'translate-x-full', 'transition');
    setTimeout(() => div.remove(), 300);
  }, 2500);
}

function narxniYoz(son) {
  return new Intl.NumberFormat('uz-UZ').format(son) + " so'm";
}

function kategoriyaRangi(kategoriya) {
  return (
    {
      elektronika: { emoji: '💻', rang: 'text-cyan-300', bg: 'bg-cyan-500/10 border-cyan-400/20' },
      kiyim: { emoji: '👕', rang: 'text-fuchsia-300', bg: 'bg-fuchsia-500/10 border-fuchsia-400/20' },
      kitab: { emoji: '📚', rang: 'text-amber-300', bg: 'bg-amber-500/10 border-amber-400/20' },
      'oziq-ovqat': { emoji: '🍎', rang: 'text-emerald-300', bg: 'bg-emerald-500/10 border-emerald-400/20' },
    }[kategoriya] || { emoji: '📦', rang: 'text-slate-300', bg: 'bg-slate-500/10 border-slate-400/20' }
  );
}

function qatorYasash(mahsulot) {
  const k = kategoriyaRangi(mahsulot.category);

  const div = document.createElement('div');
  div.id = mahsulot._id;
  div.className =
    'animate-pop hover-glow group rounded-2xl border border-white/10 bg-white/[.04] p-4 transition duration-200 hover:-translate-y-0.5';

  div.innerHTML = `
    <div class="flex items-start gap-3">
      <div class="grid h-11 w-11 shrink-0 place-items-center rounded-xl border text-xl ${k.bg}">${k.emoji}</div>

      <div class="min-w-0 flex-1">
        <h3 class="truncate font-bold text-slate-100">${mahsulot.name}</h3>
        <p class="mt-0.5 text-xs font-medium capitalize ${k.rang}">${mahsulot.category}</p>
      </div>

      <div class="text-right">
        <p class="font-extrabold text-emerald-300">${narxniYoz(mahsulot.price)}</p>
        <p class="text-xs text-slate-500">${mahsulot.qty} dona</p>
      </div>
    </div>

    <div class="mt-4 flex items-center gap-2 border-t border-white/10 pt-3">
      <button data-ortirish="${mahsulot._id}"
        class="active:scale-95 flex-1 rounded-lg bg-emerald-500/15 px-3 py-2 text-sm font-bold text-emerald-300 transition hover:bg-emerald-500/25">+1</button>

      <button data-ochirish="${mahsulot._id}"
        class="active:scale-95 flex-1 rounded-lg bg-rose-500/15 px-3 py-2 text-sm font-bold text-rose-300 transition hover:bg-rose-500/25">O'chirish</button>
    </div>
  `;

  return div;
}

function royxatniChiz() {
  royxat.innerHTML = '';
  umumiySoni.textContent = `${mahsulotlar.length} ta mahsulot`;
  bosq.classList.toggle('hidden', mahsulotlar.length > 0);
  mahsulotlar.forEach((mahsulot) => royxat.appendChild(qatorYasash(mahsulot)));
}

async function mahsulotlarniOlish() {
  mahsulotlar = await (await fetch('/mahsulotlar')).json();
  royxatniChiz();
}

async function mahsulotQoShish(qator) {
  const javob = await fetch('/mahsulotlar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(qator),
  });

  if (!javob.ok) return xabar((await javob.json()).xato, true);

  mahsulotlar.unshift(await javob.json());
  royxatniChiz();
  xabar('Mahsulot qo\'shildi');
}

async function mahsulotniOchirish(id) {
  if (!confirm('Bu mahsulotni o\'chirishni tasdiqlaysizmi?')) return;

  const javob = await fetch('/mahsulotlar/' + id, { method: 'DELETE' });

  if (!javob.ok) return xabar((await javob.json()).xato, true);

  const ochirilgan = await javob.json();
  mahsulotlar = mahsulotlar.filter((m) => m._id !== ochirilgan._id);
  royxatniChiz();
  xabar('Mahsulot o\'chirildi');
}

async function qtyniOshirish(id) {
  const mahsulot = mahsulotlar.find((m) => m._id === id);
  if (!mahsulot) return;

  const javob = await fetch('/mahsulotlar/' + id, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ qty: mahsulot.qty + 1 }),
  });

  if (!javob.ok) return xabar((await javob.json()).xato, true);

  const yangilangan = await javob.json();
  mahsulotlar = mahsulotlar.map((m) => (m._id === yangilangan._id ? yangilangan : m));
  royxatniChiz();
  xabar('Soni bittaga oshdi');
}

royxat.addEventListener('click', (e) => {
  const ochirish = e.target.closest('[data-ochirish]');
  if (ochirish) return mahsulotniOchirish(ochirish.dataset.ochirish);

  const ortirish = e.target.closest('[data-ortirish]');
  if (ortirish) return qtyniOshirish(ortirish.dataset.ortirish);
});

forma.addEventListener('submit', async (e) => {
  e.preventDefault();
  await mahsulotQoShish({
    name: maydon.name.value.trim(),
    category: maydon.category.value,
    price: Number(maydon.price.value),
    qty: Number(maydon.qty.value),
  });
  forma.reset();
  maydon.qty.value = 1;
});

yangilash.addEventListener('click', mahsulotlarniOlish);

mahsulotlarniOlish();
