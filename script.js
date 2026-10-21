(() => {
const $ = id => document.getElementById(id), cfg = window.WEDDING || {};
const song = $('song'), toast = $('toast'); let tt;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = matchMedia('(max-width:820px), (pointer:coarse)').matches, lite = mobile || (navigator.hardwareConcurrency || 8) <= 4;
const names = `${cfg.groom || 'Satish'} & ${cfg.bride || 'Geeta'}`;
const say = m => { toast.textContent = m; toast.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('show'), 4000); };

document.documentElement.dataset.theme = document.body.dataset.theme = cfg.theme || 'royal';
/* ---- fill content ---- */
[['kick','kicker'],['wTitle','welcomeTitle'],['wText','welcomeText'],['cTitle','closingTitle'],['cText','closingText']].forEach(([i,k]) => { if (cfg[k]) $(i).textContent = cfg[k]; });
$('gName').textContent = cfg.groom || 'Satish'; $('bName').textContent = cfg.bride || 'Geeta';
$('tag').textContent = cfg.tagline || ''; $('dLabel').textContent = cfg.dateLabel || '';
$('vName').textContent = cfg.venue || ''; $('vAddr').textContent = cfg.address || '';
$('map').href = cfg.mapsUrl || 'https://maps.google.com/';
$('sNames').replaceChildren(...[cfg.groom || 'Satish', '&', cfg.bride || 'Geeta'].map((t, i) => Object.assign(document.createElement(i === 1 ? 'em' : 'strong'), { textContent: t }))); $('sDate').textContent = cfg.dateLabel || '';

if (lite) document.querySelectorAll('.opening-motion-bg,.stage-bg').forEach(v => v.remove());
const royalOpening = $('royalOpening'), openRoyal = $('openRoyal');
const gateVideo = $('gateVideo');
openRoyal.addEventListener('click', async () => {
  if (royalOpening.classList.contains('doors-open')) return;
  royalOpening.classList.add('doors-open');
  document.querySelector('.opening-motion-bg')?.pause();
  openRoyal.disabled = true;
  openRoyal.innerHTML = '<span>✦</span> THE GATES ARE OPENING <span>✦</span>';
  // The opening tap is a user gesture, so start the bundled soundtrack here.
  try { song.volume = 0.72; await song.play(); } catch (e) { say('Tap Play Music to start the soundtrack.'); }
  try {
    gateVideo.currentTime = 0;
    await gateVideo.play();
  } catch (e) {
    // If playback is blocked, still move into the invitation instead of trapping the guest.
    finishGate();
  }
});
function finishGate() {
  if (royalOpening.dataset.finished === '1') return;
  royalOpening.dataset.finished = '1';
  document.querySelector('.courtyard-bg')?.play().catch(() => {});
  $('cardStage').classList.add('ready'); setTimeout(() => $('cardStage').classList.add('live'), 2300);
  royalOpening.classList.add('opening-away');
  setTimeout(() => { royalOpening.style.display = 'none'; }, 1050);
}
gateVideo.addEventListener('ended', finishGate);
gateVideo.addEventListener('error', () => { if (royalOpening.classList.contains('doors-open')) finishGate(); });
song.src = cfg.song || 'assets/wedding-song.mp3';
if (cfg.photos?.[0]) $('pGroom').src = cfg.photos[0]; if (cfg.photos?.[1]) $('pBride').src = cfg.photos[1];
const kinds = [[/haldi/i,'#d4a43a','❋'],[/mehendi|mehndi/i,'#6f9461','❦'],[/lagan|tilak|sagan|roka|engage/i,'#c27560','✦'],[/vivah|wedding|shaadi|nikah|phera/i,'#b99d6b','♥'],[/reception/i,'#8a78ad','✺'],[/sangeet|cocktail|party/i,'#b0617a','♫']];
(cfg.events || []).forEach((e, i) => {
  const k = kinds.find(k => k[0].test(e.name || '')) || [0, '#b99d6b', '✦'], c = document.createElement('article'); c.className = 'tle'; c.style.setProperty('--ac', k[1]);
  c.innerHTML = '<span class="dot"></span><div class="card"><div class="ic"></div><h3></h3><p class="d"></p><span class="ln" aria-hidden="true"></span><div class="meta"><div><b>Time</b><span class="s"></span></div><div><b>Venue</b><span class="s"></span></div></div></div>'; if (/vivah|wedding|shaadi|nikah|phera/i.test(e.name || '')) c.classList.add('feat');
  c.querySelector('.ic').textContent = k[2];
  const h = c.querySelector('h3'), nm = e.name || 'Event'; h.setAttribute('aria-label', nm);
  let j = 0; nm.split(' ').forEach((w, wi) => { const wd = document.createElement('span'); wd.className = 'wd'; wd.setAttribute('aria-hidden', 'true'); [...w].forEach(ch => { const b = document.createElement('b'); b.className = 'ch'; b.style.setProperty('--d', j++); b.textContent = ch; wd.appendChild(b); }); if (wi) h.append(' '); h.appendChild(wd); j++; });
  const d = c.querySelector('.d'); d.dataset.t = e.date || ''; const s = c.querySelectorAll('.s'); s[0].textContent = e.time || ''; s[1].textContent = e.venue || '';
  $('evGrid').appendChild(c);
});
(cfg.photos || []).forEach((src, i) => {
  const im = document.createElement('img'); im.src = src; im.alt = `Memory ${i + 1}`; im.loading = 'lazy'; im.className = 'tilt';
  im.onerror = () => im.replaceWith(Object.assign(document.createElement('div'), { className: 'ph', textContent: 'Add photo ' + (i + 1) }));
  $('gal').appendChild(im);
});

/* ---- 3D tilt (pointer) ---- */
function tilt(el, max, target = el) {
  el.addEventListener('pointermove', e => {
    if (reduce || e.pointerType === 'touch' && el.id !== 'sCard') return;
    const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    target.style.setProperty('--ry', (x * max).toFixed(1) + 'deg'); target.style.setProperty('--rx', (-y * max).toFixed(1) + 'deg');
    if (target === el && !el.classList.contains('ev') && !el.classList.contains('s-card')) el.style.transform = `rotateX(${-y * max}deg) rotateY(${x * max}deg)`;
    if (el.classList.contains('ev')) el.style.transform = `rotateX(${-y * max}deg) rotateY(${x * max}deg)`;
  });
  el.addEventListener('pointerleave', () => { target.style.setProperty('--rx', '0deg'); target.style.setProperty('--ry', '0deg'); if (!target.classList.contains('pair') && !el.classList.contains('s-card')) el.style.transform = ''; });
}
tilt($('hero'), 16, $('pair'));
document.querySelectorAll('.tilt').forEach(el => tilt(el, 10));

/* ---- scroll reveal ---- */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll('.rv').forEach(el => io.observe(el));

/* ---- scratch heart ---- */
const SVG = 'M50 86C20 62 4 46 4 26 4 12 14 4 27 4c9 0 18 5 23 14C55 9 64 4 73 4c13 0 23 8 23 22 0 20-16 36-46 60z';
$('sHeart').style.setProperty('--heart', `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='100' height='90' viewBox='0 0 100 90'><path d='${SVG}'/></svg>`)}")`);
const cv = $('sCanvas'), cx = cv.getContext('2d', { willReadFrequently: true }), heart = new Path2D(SVG);
let W, H, S, total = 0, drawing = false, done = false, last = 0, sparks = [];
function foil() {
  const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2); W = r.width; H = r.height;
  cv.width = W * d; cv.height = H * d; cx.setTransform(d, 0, 0, d, 0, 0); cx.globalCompositeOperation = 'source-over';
  S = Math.min(W / 100, H / 90);
  cx.save(); cx.translate((W - 100 * S) / 2, (H - 90 * S) / 2); cx.scale(S, S); cx.clip(heart);
  const g = cx.createLinearGradient(0, 0, 100, 90);
  [[0, '#a67c14'], [.25, '#f3df93'], [.5, '#d4af37'], [.75, '#f6e7a8'], [1, '#9a7410']].forEach(([o, c]) => g.addColorStop(o, c));
  cx.fillStyle = g; cx.fillRect(0, 0, 100, 90);
  cx.strokeStyle = '#fff6'; cx.lineWidth = .3;
  for (let i = -90; i < 100; i += 3.2) { cx.beginPath(); cx.moveTo(i, 0); cx.lineTo(i + 90, 90); cx.stroke(); }
  cx.fillStyle = '#fff9'; cx.font = '8px serif'; cx.textAlign = 'center'; cx.fillText('Scratch here', 50, 44); cx.font = '6px serif'; cx.fillText('✦  ♥  ✦', 50, 56);
  cx.restore(); total = count();
}
function count() { // opaque sample points on a coarse grid
  const d = cv.width / W, img = cx.getImageData(0, 0, cv.width, cv.height).data, st = Math.max(6, Math.round(10 * d)); let n = 0;
  for (let y = 0; y < cv.height; y += st) for (let x = 0; x < cv.width; x += st) if (img[(y * cv.width + x) * 4 + 3] > 128) n++;
  return n;
}
function progress() {
  if (done || !total) return; const p = Math.min(1, 1 - count() / total);
  $('sFill').style.width = Math.min(100, p / .55 * 100) + '%';
  $('sHint').textContent = p > .3 ? 'Almost there…' : 'Keep rubbing to uncover';
  if (p > .55) reveal();
}
function pt(e) { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
function erase(x, y, x0, y0) {
  cx.globalCompositeOperation = 'destination-out'; cx.lineCap = cx.lineJoin = 'round'; cx.lineWidth = 40;
  cx.beginPath(); cx.moveTo(x0, y0); cx.lineTo(x, y); cx.stroke();
  if (!lite || Math.random() < .5) sparks.push({ x, y, vx: (Math.random() - .5) * 3, vy: Math.random() * -2 - 1, l: 1, c: '#c9a76e' }); kick();
}
let px, py;
cv.addEventListener('pointerdown', e => { if (done) return; drawing = true; cv.setPointerCapture(e.pointerId); [px, py] = pt(e); erase(px, py, px, py); });
cv.addEventListener('pointermove', e => { if (!drawing || done) return; const [x, y] = pt(e); erase(x, y, px, py); px = x; py = y; const n = performance.now(); if (n - last > 140) { last = n; progress(); } });
['pointerup', 'pointercancel'].forEach(t => cv.addEventListener(t, () => { if (drawing) { drawing = false; progress(); } }));
function reveal() {
  if (done) return; done = true; drawing = false; cv.style.transition = 'opacity .6s'; cv.style.opacity = '0'; cv.style.pointerEvents = 'none';
  $('sFill').style.width = '100%'; $('sHint').textContent = 'Revealed! Your celebration awaits'; burst(); setTimeout(() => $('sCard').classList.add('revealed'), 1000);
}
/* confetti + scratch sparks share one overlay canvas */
const fc = $('confetti'), fx = fc.getContext('2d'); let conf = [];
let fw = 0, fh = 0, running = false;
function burst() { for (let i = 0; i < (lite ? 70 : 120); i++) conf.push({ x: innerWidth / 2, y: innerHeight * .4, vx: (Math.random() - .5) * 14, vy: Math.random() * -13 - 3, s: Math.random() * 6 + 3, r: Math.random() * 6, c: ['#D4AF37', '#f3df93', '#F8F1E0', '#b8922a'][i % 4], l: 1 }); kick(); }
function kick() { if (!running) { running = true; requestAnimationFrame(loop); } }
function loop() {
  if (fw !== innerWidth || fh !== innerHeight) { fw = fc.width = innerWidth; fh = fc.height = innerHeight; } else fx.clearRect(0, 0, fw, fh);
  const r = cv.getBoundingClientRect();
  sparks = sparks.filter(s => s.l > 0); sparks.forEach(s => { s.x += s.vx; s.y += s.vy; s.vy += .12; s.l -= .03; fx.globalAlpha = s.l; fx.fillStyle = s.c; fx.fillRect(r.left + s.x, r.top + s.y, 3, 3); });
  conf = conf.filter(p => p.l > 0 && p.y < innerHeight + 20); conf.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .28; p.vx *= .99; p.r += .2; p.l -= .004; fx.globalAlpha = Math.max(p.l, 0); fx.fillStyle = p.c; fx.save(); fx.translate(p.x, p.y); fx.rotate(p.r); fx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); fx.restore(); });
  if (sparks.length || conf.length) requestAnimationFrame(loop); else { running = false; fx.clearRect(0, 0, fw, fh); }
}
function enter() {
  document.body.classList.remove('locked'); document.body.classList.add('entered');
  $('cardStage').classList.add('off'); document.querySelector('.stage-bg')?.pause(); scrollTo(0, 0);
  if (song && song.paused) song.play().catch(() => say('Tap Play Music if the browser paused the soundtrack.'));
}
$('sGo').addEventListener('click', enter); $('sSkip').addEventListener('click', reveal);
addEventListener('resize', () => { if (!done) foil(); });
(document.fonts?.ready || Promise.resolve()).then(() => { foil(); });

/* ---- music ---- */
const mUI = () => { $('mLabel').textContent = song.paused ? 'Play music' : 'Pause music'; $('mIcon').textContent = song.paused ? '♫' : 'Ⅱ'; $('music').setAttribute('aria-label', song.paused ? 'Play music' : 'Pause music'); };
song.addEventListener('play', mUI); song.addEventListener('pause', mUI);
$('music').addEventListener('click', () => { if (song.paused) { song.play().then(() => say('Wedding music is playing')).catch(() => say('Music could not start. Check assets/wedding-song.mp3')); } else { song.pause(); } });
song.addEventListener('error', () => { if ($('music')) $('mLabel').textContent = 'Music unavailable'; });

/* ---- share ---- */
$('share').addEventListener('click', async () => {
  const d = { title: `${names} — Wedding Invitation`, text: `You are invited to celebrate ${names} on ${cfg.dateLabel || 'our wedding day'}!`, url: location.href };
  try { if (navigator.share) await navigator.share(d); else if (navigator.clipboard && isSecureContext) { await navigator.clipboard.writeText(`${d.text}\n${d.url}`); say('Invitation link copied'); } else prompt('Copy your invitation link:', location.href); }
  catch (e) { if (e.name !== 'AbortError') say('Copy the link from your browser address bar.'); }
});

/* ---- countdown with flip ---- */
const prev = {};
function tick() {
  const diff = Math.max(0, new Date(cfg.weddingDate || '2026-12-10T19:00:00') - Date.now());
  const v = { days: diff / 864e5 | 0, hours: diff % 864e5 / 36e5 | 0, minutes: diff % 36e5 / 6e4 | 0, seconds: diff % 6e4 / 1e3 | 0 };
  for (const k in v) { const s = String(v[k]).padStart(2, '0'), el = $(k); if (prev[k] !== s) { el.textContent = s; if (prev[k] && !reduce) { el.classList.remove('flip'); void el.offsetWidth; el.classList.add('flip'); } prev[k] = s; } }
}
tick(); setInterval(tick, 1000);

/* ---- gold dust (desktop only, paused when tab hidden) ---- */
const dc = $('dust'), dx = dc.getContext('2d'); let dots = [];
function size() { dc.width = innerWidth; dc.height = innerHeight; dots = Array.from({ length: Math.min(40, innerWidth / 24 | 0) }, () => ({ x: Math.random() * dc.width, y: Math.random() * dc.height, r: Math.random() * 1.6 + .4, v: Math.random() * .3 + .08, a: Math.random() * .4 + .15 })); }
function dust() { if (!document.hidden) { dx.clearRect(0, 0, dc.width, dc.height); dots.forEach(p => { p.y -= p.v; if (p.y < -4) { p.y = dc.height + 4; p.x = Math.random() * dc.width; } dx.beginPath(); dx.arc(p.x, p.y, p.r, 0, 6.3); dx.fillStyle = `rgba(201,167,110,${p.a})`; dx.fill(); }); } requestAnimationFrame(dust); }
if (lite || reduce) dc.remove(); else { size(); dust(); addEventListener('resize', size); }

/* ---- hero: letter reveal + WebGL petals ---- */
['gName','bName'].forEach(id => { const el = $(id), t = el.textContent; el.setAttribute('aria-label', t); el.textContent = ''; [...t].forEach((c, i) => { const b = document.createElement('b'); b.className = 'ch'; b.setAttribute('aria-hidden', 'true'); b.style.setProperty('--d', i); b.textContent = c; el.appendChild(b); }); });
if (window.THREE) {
  const T = THREE, hero = $('hero'), cs = getComputedStyle(document.body), col = n => cs.getPropertyValue(n).trim();
  const R = new T.WebGLRenderer({ canvas: $('petals'), alpha: true, antialias: true }); R.setPixelRatio(Math.min(devicePixelRatio, 2));
  const sc = new T.Scene(), cam = new T.PerspectiveCamera(50, 1, .1, 50); cam.position.z = 9;
  const sh = new T.Shape(); sh.moveTo(0, 0); sh.bezierCurveTo(.55, .3, .6, 1.1, 0, 1.5); sh.bezierCurveTo(-.6, 1.1, -.55, .3, 0, 0);
  const geo = new T.ShapeGeometry(sh), cols = [col('--gold'), '#f8f3ea', '#d9a7b0', col('--gold')];
  const n = innerWidth < 700 ? 34 : 64, ps = [];
  for (let i = 0; i < n; i++) {
    const m = new T.Mesh(geo, new T.MeshBasicMaterial({ color: cols[i % 4], transparent: true, opacity: .45 + Math.random() * .4, side: T.DoubleSide, depthWrite: false }));
    const s = .25 + Math.random() * .35; m.scale.set(s, s, s);
    m.position.set((Math.random() - .5) * 20, (Math.random() - .5) * 13, Math.random() * 9 - 5); m.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
    m.userData = { v: .006 + Math.random() * .014, r: (Math.random() - .5) * .02, p: Math.random() * 6 }; sc.add(m); ps.push(m);
  }
  let mx = 0, my = 0, vis = true, t = 0;
  addEventListener('pointermove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; });
  new IntersectionObserver(e => vis = e[0].isIntersecting).observe(hero);
  const fit = () => { const w = hero.clientWidth, h = hero.clientHeight; R.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }; fit(); addEventListener('resize', fit);
  (function frame() {
    requestAnimationFrame(frame); if (!vis) return; t += .01;
    ps.forEach(m => { const d = m.userData; if (!reduce) { m.position.y -= d.v; m.position.x += Math.sin(t + d.p) * .004; m.rotation.x += d.r; m.rotation.y += d.r * 1.3; if (m.position.y < -7) { m.position.y = 7; m.position.x = (Math.random() - .5) * 20; } } });
    cam.position.x += (mx * 1.6 - cam.position.x) * .04; cam.position.y += (-my * 1.0 - cam.position.y) * .04; cam.lookAt(0, 0, 0); R.render(sc, cam);
  })();
}

/* ---- timeline: line draws on scroll, entries animate in, dates type out ---- */
const g = $('evGrid'), sp = () => { const r = g.getBoundingClientRect(); g.style.setProperty('--p', Math.min(1, Math.max(0, (innerHeight * .6 - r.top) / r.height)).toFixed(3)); };
let spq = 0; const spt = () => { if (!spq) spq = requestAnimationFrame(() => { spq = 0; sp(); }); };
addEventListener('scroll', spt, { passive: true }); addEventListener('resize', spt); sp();
const io2 = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return; const el = e.target; el.classList.add('in'); io2.unobserve(el);
  const d = el.querySelector('.d'), t = d.dataset.t; if (reduce) { d.textContent = t; return; }
  setTimeout(() => { let i = 0; const iv = setInterval(() => { d.textContent = t.slice(0, ++i); if (i >= t.length) clearInterval(iv); }, 45); }, 800);
}), { threshold: .35 });
document.querySelectorAll('.tle').forEach(el => io2.observe(el));
/* ---- headings: words slide up from a mask ---- */
document.querySelectorAll('.sec h2').forEach(h => { const t = h.textContent; h.setAttribute('aria-label', t); h.textContent = '';
  t.split(' ').forEach((w, i) => { const o = document.createElement('span'), s = document.createElement('span'); o.className = 'w'; o.setAttribute('aria-hidden', 'true'); s.style.setProperty('--i', i); s.textContent = w; o.appendChild(s); h.append(o, ' '); }); });
/* ---- invitation card: cover, save-the-date, calendar ---- */
const wd = new Date(cfg.weddingDate || '2026-12-10T19:00:00'), L = o => wd.toLocaleDateString('en-IN', o);
$('stWeek').textContent = L({ weekday: 'long' }); $('stDay').textContent = String(wd.getDate()).padStart(2, '0');
$('stMonth').textContent = L({ month: 'long', year: 'numeric' }); $('stNames').textContent = names;
$('stTime').textContent = wd.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }) + ' onwards';
$('cvNames').textContent = names; $('cvDate').textContent = cfg.dateLabel || L({ day: 'numeric', month: 'long', year: 'numeric' });

const cov = $('cover'), fr = $('cvFront'), hl = document.createElement('div'), hr = document.createElement('div'), cl = fr.cloneNode(true);
hl.className = 'half l'; hr.className = 'half r'; cl.querySelectorAll('[id]').forEach(e => e.removeAttribute('id')); cl.removeAttribute('id'); cl.setAttribute('aria-hidden', 'true');
hl.appendChild(fr); hr.appendChild(cl); cov.prepend(hl, hr);
const openCard = () => { const b = $('book'); if (b.classList.contains('open')) return; b.classList.add('open'); $('cover').setAttribute('aria-hidden', 'true'); setTimeout(() => { $('cover').style.visibility = 'hidden'; foil(); }, 2800); if (song.paused) song.play().catch(() => {}); };
$('cover').addEventListener('click', openCard); $('cover').addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCard(); } });
$('calBtn').addEventListener('click', () => {
  const f = d => d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0') + 'T' + String(d.getHours()).padStart(2, '0') + String(d.getMinutes()).padStart(2, '0') + '00', end = new Date(+wd + 4 * 36e5);
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Wedding Invitation//EN', 'BEGIN:VEVENT', 'UID:' + f(wd) + '@wedding', 'DTSTAMP:' + f(new Date()), 'DTSTART:' + f(wd), 'DTEND:' + f(end), 'SUMMARY:' + names + ' Wedding', 'LOCATION:' + (cfg.venue || ''), 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([ics], { type: 'text/calendar' })), download: 'save-the-date.ics' }).click(); say('Save the date added as a calendar file');
});
/* ---- premium touches: card tilt + photo fallback ---- */
const stg = $('cardStage');
stg.addEventListener('pointermove', e => { if (e.pointerType === 'touch' || reduce || $('book').classList.contains('open')) return; stg.style.setProperty('--ry', ((e.clientX / innerWidth - .5) * 9).toFixed(2) + 'deg'); stg.style.setProperty('--rx', (-(e.clientY / innerHeight - .5) * 7).toFixed(2) + 'deg'); });
Promise.all((cfg.photos || []).map(p => new Promise(r => { const m = new Image(); m.onload = () => r(1); m.onerror = () => r(0); m.src = p; }))).then(a => { if (!a.some(Boolean)) $('hero').classList.add('nophoto'); });
$('doorGroom').textContent = cfg.groom || 'Satish'; $('doorBride').textContent = cfg.bride || 'Geeta'; $('doorDate').textContent = cfg.dateLabel || '';
$('heroVenue').textContent = cfg.venue || '';
/* ---- code-drawn marigold petals ---- */
const PET = [['#e0a02a', '#ee7a14', '#f59a2a'], ['#d99524', '#e2640f', '#ef8420'], ['#f0c04a', '#f6a81f', '#fbd25a'], ['#e8ad30', '#f08a18', '#f7b23c']].map(([a, b, c]) => {
  const s = document.createElement('canvas'); s.width = 192; s.height = 256; const x = s.getContext('2d'); x.scale(2, 2); x.translate(48, 122);
  const p = new Path2D(); p.moveTo(0, 0); p.bezierCurveTo(-30, -26, -46, -72, -34, -98); p.quadraticCurveTo(-28, -118, -17, -110); p.quadraticCurveTo(-10, -124, 0, -114); p.quadraticCurveTo(10, -124, 17, -110); p.quadraticCurveTo(28, -118, 34, -98); p.bezierCurveTo(46, -72, 30, -26, 0, 0); p.closePath();
  const g = x.createLinearGradient(0, 0, 0, -118); g.addColorStop(0, a); g.addColorStop(.5, b); g.addColorStop(1, c); x.fillStyle = g; x.fill(p); x.save(); x.clip(p);
  for (let i = -7; i <= 7; i++) { x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(i * 5, -60, i * 6.5, -112); x.strokeStyle = i % 2 ? 'rgba(120,45,0,.2)' : 'rgba(255,225,130,.22)'; x.lineWidth = 1.1; x.stroke(); }
  const h = x.createRadialGradient(-12, -78, 2, -12, -78, 52); h.addColorStop(0, 'rgba(255,236,160,.38)'); h.addColorStop(1, 'rgba(255,236,160,0)'); x.fillStyle = h; x.fillRect(-60, -130, 120, 140);
  const e = x.createLinearGradient(-40, 0, 40, 0); e.addColorStop(0, 'rgba(110,40,0,.3)'); e.addColorStop(.25, 'rgba(110,40,0,0)'); e.addColorStop(.75, 'rgba(110,40,0,0)'); e.addColorStop(1, 'rgba(110,40,0,.3)'); x.fillStyle = e; x.fillRect(-60, -130, 120, 140);
  x.restore(); x.lineWidth = 1.4; x.strokeStyle = 'rgba(120,50,0,.35)'; x.stroke(p); return s;
});
document.querySelectorAll('.petal-cv').forEach(cv => {
  const c = cv.getContext('2d'), host = cv.parentElement, rnd = (a, b) => a + Math.random() * (b - a); let W, H, D, vis = true, last = performance.now(), ps = [];
  const mkp = init => { const z = rnd(.35, 1); return { z, x: rnd(0, W), y: init ? rnd(-100, H) : rnd(-120, -40), vy: 28 + z * 60, sw: rnd(10, 34), f: rnd(.5, 1.3), ph: rnd(0, 6.3), r: rnd(0, 6.3), sp: rnd(-1.2, 1.2), t: rnd(0, 6.3), ts: rnd(1.2, 2.8), u: rnd(0, 6.3), im: PET[Math.random() * PET.length | 0], s: .3 + z * .5, a: .55 + z * .45 }; };
  const fit = () => { D = lite ? 1 : Math.min(devicePixelRatio || 1, 2); W = host.clientWidth; H = host.clientHeight; cv.width = W * D; cv.height = H * D; ps = Array.from({ length: (lite ? 9 : 34) * (+cv.dataset.d || 1) | 0 }, () => mkp(true)).sort((a, b) => a.z - b.z); };
  fit(); addEventListener('resize', fit); new IntersectionObserver(e => vis = e[0].isIntersecting).observe(host);
  (function frame(n) {
    requestAnimationFrame(frame); if (lite && n - last < 33) return; const dt = Math.min(.05, (n - last) / 1000); last = n; if (!vis || document.hidden) return;
    c.setTransform(D, 0, 0, D, 0, 0); c.clearRect(0, 0, W, H);
    for (const p of ps) {
      if (!reduce) { p.t += p.ts * dt; p.u += p.ts * .7 * dt; p.r += p.sp * dt; p.ph += p.f * dt; p.y += p.vy * dt; p.x += Math.sin(p.ph) * p.sw * dt + 8 * dt; if (p.y > H + 90 || p.x > W + 90) Object.assign(p, mkp(false)); }
      const cs = Math.abs(Math.cos(p.t)); c.save(); c.translate(p.x, p.y); c.rotate(p.r + Math.sin(p.ph) * .35); c.scale(p.s * (.25 + .75 * cs), p.s * (.8 + .2 * Math.abs(Math.cos(p.u)))); c.globalAlpha = p.a * (.72 + .28 * cs); c.drawImage(p.im, -48, -64, 96, 128); c.restore();
    }
  })(last);
});

/* ---- pause offscreen videos (saves battery / lag on phones) ---- */
document.querySelectorAll('video.courtyard-bg').forEach(v => new IntersectionObserver(e => { e[0].isIntersecting ? v.play().catch(() => {}) : v.pause(); }, { threshold: 0 }).observe(v));
document.addEventListener('visibilitychange', () => { if (document.hidden) document.querySelectorAll('video.courtyard-bg').forEach(v => v.pause()); });

/* ---- auto re-centre: real viewport height + keep same section in view on rotate/resize ---- */
let anchor = null, rt;
const vh = () => document.documentElement.style.setProperty('--vh', innerHeight * .01 + 'px');
const pick = () => { const mid = innerHeight / 2; let best = null, bd = 1e9; document.querySelectorAll('main > section').forEach(el => { const r = el.getBoundingClientRect(), d = Math.abs((r.top + r.bottom) / 2 - mid); if (r.bottom > 0 && r.top < innerHeight && d < bd) { bd = d; best = el; } }); return best; };
vh(); let lw = innerWidth;
addEventListener('resize', () => { if (!anchor && document.body.classList.contains('entered')) anchor = pick(); clearTimeout(rt); rt = setTimeout(() => { vh(); if (anchor && Math.abs(innerWidth - lw) > 40) anchor.scrollIntoView({ block: 'center' }); lw = innerWidth; anchor = null; }, 200); });
addEventListener('orientationchange', () => { if (document.body.classList.contains('entered')) anchor = pick(); });
})();
