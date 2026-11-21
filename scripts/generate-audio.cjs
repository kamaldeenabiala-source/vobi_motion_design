/*
 * Générateur audio PROVISOIRE (synthèse procédurale, déterministe).
 * Produit la musique (2 ambiances, 102 BPM) et la bibliothèque d'effets sonores
 * décrites dans le storyboard. À remplacer par des sons sous licence.
 * Usage : node scripts/generate-audio.cjs
 */
const fs = require('fs');
const path = require('path');

const SR = 44100;
const OUT = path.join(__dirname, '..', 'public', 'audio');
fs.mkdirSync(path.join(OUT, 'sfx'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'music'), { recursive: true });

// ---------- utilitaires ----------
let seed = 1234567;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const noise = () => rnd() * 2 - 1;
const buf = (sec) => new Float32Array(Math.ceil(sec * SR));
const TAU = Math.PI * 2;

function writeWav(file, data, gainDb = -1) {
  let peak = 0;
  for (const v of data) peak = Math.max(peak, Math.abs(v));
  const target = Math.pow(10, gainDb / 20);
  const g = peak > 0 ? target / peak : 1;
  const b = Buffer.alloc(44 + data.length * 2);
  b.write('RIFF', 0); b.writeUInt32LE(36 + data.length * 2, 4); b.write('WAVE', 8);
  b.write('fmt ', 12); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22);
  b.writeUInt32LE(SR, 24); b.writeUInt32LE(SR * 2, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34);
  b.write('data', 36); b.writeUInt32LE(data.length * 2, 40);
  for (let i = 0; i < data.length; i++) {
    const v = Math.max(-1, Math.min(1, data[i] * g));
    b.writeInt16LE(Math.round(v * 32767), 44 + i * 2);
  }
  fs.writeFileSync(path.join(OUT, file), b);
  console.log('écrit', file, (data.length / SR).toFixed(2) + 's');
}

const add = (dst, src, atSec, gain = 1) => {
  const o = Math.round(atSec * SR);
  for (let i = 0; i < src.length && o + i < dst.length; i++) if (o + i >= 0) dst[o + i] += src[i] * gain;
};
const lowpass = (d, cutoff) => {
  const rc = 1 / (TAU * cutoff), dt = 1 / SR, a = dt / (rc + dt);
  let y = 0; for (let i = 0; i < d.length; i++) { y += a * (d[i] - y); d[i] = y; } return d;
};
const highpass = (d, cutoff) => {
  const rc = 1 / (TAU * cutoff), dt = 1 / SR, a = rc / (rc + dt);
  let y = 0, xp = 0; for (let i = 0; i < d.length; i++) { const x = d[i]; y = a * (y + x - xp); xp = x; d[i] = y; } return d;
};
const env = (t, a, dcy) => (t < a ? t / a : Math.exp(-(t - a) / dcy));
const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);
const softclip = (x) => Math.tanh(x);

// Karplus-Strong : corde pincée (guitare highlife)
function pluck(freq, sec, bright = 0.5, decay = 0.996) {
  const out = buf(sec);
  const N = Math.max(2, Math.round(SR / freq));
  const ring = new Float32Array(N);
  for (let i = 0; i < N; i++) ring[i] = noise() * (0.6 + 0.4 * bright);
  let idx = 0, prev = 0;
  for (let i = 0; i < out.length; i++) {
    const cur = ring[idx];
    const nxt = ring[(idx + 1) % N];
    const avg = decay * (bright * cur + (1 - bright) * 0.5 * (cur + nxt));
    ring[idx] = avg; out[i] = cur * 0.8 + prev * 0.2; prev = cur;
    idx = (idx + 1) % N;
  }
  return out;
}
function kick() {
  const d = buf(0.45); let ph = 0;
  for (let i = 0; i < d.length; i++) { const t = i / SR; const f = 45 + 95 * Math.exp(-t * 28); ph += TAU * f / SR; d[i] = Math.sin(ph) * Math.exp(-t * 7) + (t < 0.004 ? noise() * 0.4 : 0); }
  return d;
}
function clap() {
  const d = buf(0.3);
  for (let i = 0; i < d.length; i++) { const t = i / SR; const burst = [0, 0.011, 0.022].reduce((s, o) => s + (t >= o ? Math.exp(-(t - o) * 90) : 0), 0); d[i] = noise() * (burst * 0.5 + Math.exp(-t * 18) * 0.5); }
  return highpass(d, 900);
}
function shaker(acc = 1) {
  const d = buf(0.07);
  for (let i = 0; i < d.length; i++) { const t = i / SR; d[i] = noise() * env(t, 0.008, 0.018) * acc; }
  return highpass(d, 5000);
}
function logDrum(note, sec = 0.5) {
  const d = buf(sec); let ph = 0; const f0 = midi(note);
  for (let i = 0; i < d.length; i++) { const t = i / SR; const f = f0 * (1 + 0.6 * Math.exp(-t * 40)); ph += TAU * f / SR; d[i] = softclip(Math.sin(ph) * 2.2) * Math.exp(-t * 6); }
  return lowpass(d, 1400);
}
function bass(note, sec) {
  const d = buf(sec); let ph = 0; const f = midi(note);
  for (let i = 0; i < d.length; i++) { const t = i / SR; ph += TAU * f / SR; d[i] = (Math.sin(ph) + 0.25 * Math.sin(ph * 2)) * env(t, 0.01, sec * 0.6); }
  return d;
}
function pad(notes, sec) {
  const d = buf(sec);
  for (const n of notes) { let p1 = rnd() * TAU, p2 = rnd() * TAU; const f = midi(n);
    for (let i = 0; i < d.length; i++) { const t = i / SR; p1 += TAU * f / SR; p2 += TAU * f * 1.004 / SR; const saw = ((p1 / TAU) % 1) * 2 - 1 + (((p2 / TAU) % 1) * 2 - 1); d[i] += saw * 0.15 * Math.min(1, t / 0.4) * Math.min(1, (sec - t) / 0.4); } }
  return lowpass(lowpass(d, 1500), 1800);
}
function bell(freq, sec, partials = [[1, 1], [2.76, 0.4], [5.4, 0.2]]) {
  const d = buf(sec);
  for (const [r, a] of partials) for (let i = 0; i < d.length; i++) { const t = i / SR; d[i] += Math.sin(TAU * freq * r * t) * a * Math.exp(-t * (3 + r)); }
  return d;
}

// ---------- MUSIQUE ----------
const BPM = 102, BEAT = 60 / BPM, BAR = BEAT * 4, S16 = BEAT / 4;

function groove(bars, chords, opts) {
  const sec = bars * BAR + 2;
  const mix = buf(sec);
  const k = kick(), c = clap();
  for (let b = 0; b < bars; b++) {
    const t0 = b * BAR;
    const ch = chords[b % chords.length];
    // batterie afro : kick 1, 2&, 3 ; clap 2 & 4 ; shaker double-croches
    [0, 1.5, 2, 3.5].forEach((bt, i) => { if (i === 3 && !opts.busy) return; add(mix, k, t0 + bt * BEAT, 0.9); });
    [1, 3].forEach((bt) => add(mix, c, t0 + bt * BEAT, 0.35));
    for (let s = 0; s < 16; s++) add(mix, shaker(s % 4 === 2 ? 1 : 0.55), t0 + s * S16, opts.shaker);
    // log drum / basse syncopée
    const root = ch[0] - 24;
    [[0, 0], [0.75, 0], [1.5, 7], [2.5, 0], [3, 12], [3.5, 10]].forEach(([bt, iv]) => add(mix, logDrum(root + iv, 0.45), t0 + bt * BEAT, 0.5));
    add(mix, bass(root, BAR * 0.95), t0, 0.35);
    // guitare highlife en arpèges
    const arp = opts.arp;
    for (let s = 0; s < arp.length; s++) {
      if (arp[s] < 0) continue;
      const note = ch[arp[s] % ch.length] + (arp[s] >= ch.length ? 12 : 0);
      add(mix, pluck(midi(note), 0.6, opts.bright, 0.994), t0 + s * S16, 0.22);
    }
    if (opts.pad) add(mix, pad(ch.map((n) => n - 12), BAR), t0, 0.18);
    if (opts.lead && b % 2 === 1) opts.lead.forEach(([s, n]) => add(mix, pluck(midi(n), 0.9, 0.85, 0.997), t0 + s * S16, 0.26));
  }
  // compression douce
  for (let i = 0; i < mix.length; i++) mix[i] = softclip(mix[i] * 1.2);
  return mix;
}

// A : tension (la mineur) — Am, F, G, Em
const tension = groove(13, [[57, 60, 64], [53, 57, 60], [55, 59, 62], [52, 55, 59]], {
  arp: [0, -1, 2, 1, -1, 2, 0, -1, 1, -1, 2, 3, -1, 1, 2, -1], bright: 0.45, shaker: 0.22, busy: true,
});
writeWav('music/tension.wav', tension, -3);

// B : positive (do majeur) — C, G, Am, F, plus lumineuse
const positive = groove(17, [[60, 64, 67], [55, 59, 62], [57, 60, 64], [53, 57, 60]], {
  arp: [0, 2, 1, 3, 0, 2, 1, 3, 0, 2, 1, 3, 0, 2, 4, 3], bright: 0.7, shaker: 0.28, busy: false, pad: true,
  lead: [[0, 76], [3, 79], [6, 81], [8, 79], [10, 76], [12, 74]],
});
writeWav('music/positive.wav', positive, -3);

// Motif « détendu ironique » de la rêverie : guitare seule
{
  const sec = 6; const d = buf(sec);
  const notes = [[0, 67], [0.5, 71], [1, 74], [1.5, 71], [2, 72], [2.5, 76], [3, 74], [3.75, 71], [4.5, 67]];
  notes.forEach(([b, n]) => add(d, pluck(midi(n), 1.4, 0.35, 0.998), b * BEAT * 1.2, 0.5));
  [[0, [55, 59, 62]], [2.4, [52, 55, 60]]].forEach(([at, ch]) => ch.forEach((n, i) => add(d, pluck(midi(n), 2, 0.3, 0.998), at + i * 0.03, 0.3)));
  writeWav('music/reverie.wav', d, -4);
}

// ---------- EFFETS SONORES ----------
const sfx = {};
sfx.pop = (() => { const d = buf(0.18); let ph = 0; for (let i = 0; i < d.length; i++) { const t = i / SR; ph += TAU * (500 + 1400 * Math.min(1, t / 0.05)) / SR; d[i] = Math.sin(ph) * Math.exp(-t * 30) + noise() * 0.15 * Math.exp(-t * 80); } return d; })();
sfx.tick = (() => { const d = buf(0.05); for (let i = 0; i < d.length; i++) { const t = i / SR; d[i] = Math.sin(TAU * 2400 * t) * Math.exp(-t * 160) + noise() * 0.2 * Math.exp(-t * 300); } return d; })();
sfx.tap = (() => { const d = buf(0.06); for (let i = 0; i < d.length; i++) { const t = i / SR; d[i] = Math.sin(TAU * 1100 * t) * Math.exp(-t * 120) * 0.7 + noise() * 0.25 * Math.exp(-t * 400); } return lowpass(d, 5000); })();
const whoosh = (sec, f0, f1) => { const d = buf(sec); let y = 0, y2 = 0; for (let i = 0; i < d.length; i++) { const t = i / SR, k = t / sec; const fc = f0 + (f1 - f0) * Math.sin(k * Math.PI / 2); const a = (1 / SR) / (1 / (TAU * fc) + 1 / SR); y += a * (noise() - y); y2 += a * (y - y2); d[i] = (y - y2 * 0.6) * Math.sin(Math.PI * k) ** 1.5; } return d; };
sfx.whoosh = whoosh(0.5, 300, 3500);
sfx.whip = whoosh(0.28, 600, 6000);
sfx.swoosh = whoosh(0.3, 800, 2500);
sfx.riser = (() => { const d = whoosh(0.6, 200, 8000); for (let i = 0; i < d.length; i++) d[i] *= (i / d.length) ** 2 * 3; return d; })();
sfx.cashout = (() => { // caisse inversée : montée métallique puis coupure + pièces qui dégringolent
  const d = buf(0.9);
  for (const f of [2093, 2637, 3136, 4186]) for (let i = 0; i < SR * 0.35; i++) { const t = i / SR; d[i] += Math.sin(TAU * f * t) * (t / 0.35) ** 3 * 0.25; }
  for (let c = 0; c < 6; c++) { const at = 0.36 + c * 0.07; const f = 3200 - c * 320; for (let i = 0; i < SR * 0.12; i++) { const t = i / SR, j = Math.round(at * SR) + i; if (j < d.length) d[j] += Math.sin(TAU * f * t) * Math.exp(-t * 40) * 0.4; } }
  return d; })();
sfx.impact = (() => { const d = buf(1.6); let ph = 0; for (let i = 0; i < d.length; i++) { const t = i / SR; ph += TAU * (32 + 70 * Math.exp(-t * 9)) / SR; d[i] = softclip(Math.sin(ph) * 2.5) * Math.exp(-t * 2.4) + noise() * Math.exp(-t * 25) * 0.6; } return d; })();
sfx.glass = (() => { const d = buf(1.0); for (let i = 0; i < d.length; i++) { const t = i / SR; d[i] = noise() * Math.exp(-t * 14) * 0.5; } highpass(d, 2500); for (let p = 0; p < 26; p++) { const at = rnd() * 0.5, f = 2500 + rnd() * 6000; for (let i = 0; i < SR * 0.25; i++) { const t = i / SR, j = Math.round(at * SR) + i; if (j < d.length) d[j] += Math.sin(TAU * f * t) * Math.exp(-t * 18) * 0.18; } } return d; })();
sfx.cymbal = (() => { const d = buf(2.0); for (let i = 0; i < d.length; i++) { const t = i / SR; d[i] = noise() * env(t, 0.003, 0.6); } return highpass(highpass(d, 3000), 4000); })();
sfx.deflate = (() => { const d = buf(1.3); let ph = 0; for (let i = 0; i < d.length; i++) { const t = i / SR; const f = 950 * Math.exp(-t * 1.5) + 150 + 60 * Math.sin(TAU * 14 * t); ph += TAU * f / SR; d[i] = (Math.sign(Math.sin(ph)) * 0.3 + Math.sin(ph) * 0.7) * Math.min(1, t / 0.03) * (1 - t / 1.3) * 0.6 + noise() * 0.08; } return lowpass(d, 3000); })();
sfx.ding = bell(1318.5, 0.9);
sfx.check = (() => { const d = buf(0.5); add(d, bell(1568, 0.5), 0, 0.7); add(d, bell(2093, 0.45), 0.06, 0.6); return d; })();
sfx.notif = (() => { const d = buf(0.7); add(d, bell(880, 0.6, [[1, 1], [2, 0.2]]), 0, 0.8); add(d, bell(1318.5, 0.6, [[1, 1], [2, 0.2]]), 0.11, 0.8); return d; })();
sfx.stamp = (() => { const d = buf(0.4); let ph = 0; for (let i = 0; i < d.length; i++) { const t = i / SR; ph += TAU * (90 * Math.exp(-t * 20) + 60) / SR; d[i] = Math.sin(ph) * Math.exp(-t * 18) + noise() * Math.exp(-t * 60) * 0.6; } return d; })();
sfx.horn = (() => { const d = buf(0.75); for (const [s, e] of [[0, 0.22], [0.32, 0.66]]) for (let i = Math.round(s * SR); i < e * SR; i++) { const t = i / SR; d[i] = (Math.sign(Math.sin(TAU * 415 * t)) + Math.sign(Math.sin(TAU * 520 * t))) * 0.3 * Math.min(1, (t - s) / 0.01) * Math.min(1, (e - t) / 0.02); } return lowpass(d, 2800); })();
sfx.engine = (() => { const d = buf(3.0); let ph = 0; for (let i = 0; i < d.length; i++) { const t = i / SR; const f = 48 + 10 * Math.sin(TAU * 0.6 * t) + (t < 0.6 ? t * 30 : 18); ph += TAU * f / SR; const saw = ((ph / TAU) % 1) * 2 - 1; d[i] = saw * (0.6 + 0.4 * Math.sin(TAU * f * 0.5 * t)) + noise() * 0.15; } lowpass(d, 900); for (let i = 0; i < d.length; i++) { const t = i / SR; d[i] *= Math.min(1, t / 0.2) * Math.min(1, (3 - t) / 0.4); } return d; })();
sfx.paper = (() => { const d = buf(0.6); for (let c = 0; c < 22; c++) { const at = rnd() * 0.5; for (let i = 0; i < SR * 0.03; i++) { const j = Math.round(at * SR) + i; if (j < d.length) d[j] += noise() * Math.exp(-i / SR * 120) * (0.4 + rnd()); } } return highpass(d, 1500); })();
sfx.goat = (() => { const d = buf(0.9); let ph = 0; for (let i = 0; i < d.length; i++) { const t = i / SR; const f = 380 + 25 * Math.sin(TAU * 7 * t) - t * 60; ph += TAU * f / SR; const saw = ((ph / TAU) % 1) * 2 - 1; d[i] = saw * env(t, 0.05, 0.4) * (0.6 + 0.4 * Math.sin(TAU * 7 * t)); } return lowpass(highpass(d, 400), 2500); })();
sfx.keylock = (() => { const d = buf(0.8); for (const at of [0, 0.12, 0.34]) { for (let i = 0; i < SR * 0.04; i++) { const j = Math.round(at * SR) + i; d[j] += noise() * Math.exp(-i / SR * 200) * 0.8; } add(d, bell(3200, 0.3, [[1, 1], [1.5, 0.3]]), at, 0.15); } return d; })();
sfx.sparkle = (() => { const d = buf(1.1); for (let p = 0; p < 18; p++) { const at = p * 0.05 + rnd() * 0.02, f = 2000 + p * 180 + rnd() * 300; add(d, bell(f, 0.3, [[1, 1]]), at, 0.25); } return d; })();
sfx.signature = (() => { const d = buf(1.8); [[0, 784], [0.16, 1047], [0.32, 1319]].forEach(([at, f]) => add(d, bell(f, 1.4, [[1, 1], [2, 0.35], [3, 0.12]]), at, 0.7)); add(d, pad([72, 76, 79], 1.6), 0.3, 0.25); return d; })();
sfx.roll = (() => { const d = buf(1.0); let t = 0, gap = 0.035; while (t < 0.85) { add(d, sfx.tick, t, 0.6); t += gap; gap *= 1.07; } add(d, bell(1760, 0.3, [[1, 1]]), 0.88, 0.5); return d; })();
sfx.rumble = (() => { const d = buf(0.8); for (let i = 0; i < d.length; i++) { const t = i / SR; d[i] = noise() * env(t, 0.01, 0.25); } return lowpass(lowpass(d, 180), 200); })();
sfx.flash = whoosh(0.35, 1500, 9000);
sfx.bubble = (() => { const d = buf(0.6); add(d, sfx.pop, 0, 1); add(d, sfx.sparkle.subarray(0, Math.round(SR * 0.5)), 0.03, 0.4); return d; })();
sfx.squeak = (() => { const d = buf(1.2); for (let i = 0; i < d.length; i++) { const t = i / SR; const g = Math.max(0, Math.sin(TAU * 1.6 * t)) ** 8; d[i] = Math.sin(TAU * (1500 + 300 * Math.sin(TAU * 1.6 * t)) * t) * g * 0.3; } return d; })();
sfx.whistleDown = sfx.deflate;

for (const [k, v] of Object.entries(sfx)) writeWav(`sfx/${k}.wav`, v, -2);
