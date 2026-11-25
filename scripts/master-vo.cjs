/*
 * Mastering de la voix off (public/audio/vo/*.wav) pour une voix audible et
 * imposante : filtre passe-haut léger, compression, gain, limiteur doux.
 * Usage : node scripts/master-vo.cjs   (à lancer après la génération / l'import)
 */
const fs = require('fs');
const path = require('path');
const dir = path.resolve(__dirname, '..', process.argv[2] || path.join('public', 'audio', 'vo'));

for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.wav'))) {
  const file = path.join(dir, f);
  const b = fs.readFileSync(file);
  let off = 12, dOff, dSz, sr = 16000, ch = 1;
  while (off < b.length) {
    const id = b.toString('ascii', off, off + 4), sz = b.readUInt32LE(off + 4);
    if (id === 'fmt ') { ch = b.readUInt16LE(off + 10); sr = b.readUInt32LE(off + 12); }
    if (id === 'data') { dOff = off + 8; dSz = sz; break; }
    off += 8 + sz;
  }
  const n = dSz / 2 / ch;
  const x = new Float32Array(n);
  for (let i = 0; i < n; i++) x[i] = b.readInt16LE(dOff + i * 2 * ch) / 32768;

  // 1. passe-haut 80 Hz (retire le grondement)
  { const rc = 1 / (2 * Math.PI * 80), dt = 1 / sr, a = rc / (rc + dt); let y = 0, xp = 0;
    for (let i = 0; i < n; i++) { const v = x[i]; y = a * (y + v - xp); xp = v; x[i] = y; } }
  // 2. compresseur (seuil -20 dB, ratio 4:1, attaque 5 ms, relâche 80 ms)
  { const thr = Math.pow(10, -20 / 20), ratio = 4;
    const att = Math.exp(-1 / (0.005 * sr)), rel = Math.exp(-1 / (0.08 * sr)); let env = 0;
    for (let i = 0; i < n; i++) {
      const a = Math.abs(x[i]); env = a > env ? att * env + (1 - att) * a : rel * env + (1 - rel) * a;
      const g = env > thr ? Math.pow(env / thr, 1 / ratio - 1) : 1; x[i] *= g;
    } }
  // 3. normalisation à -1 dBFS puis limiteur doux (tanh) pour plus de densité
  let peak = 0; for (const v of x) peak = Math.max(peak, Math.abs(v));
  const gain = peak > 0 ? Math.pow(10, -1 / 20) / peak : 1;
  const drive = 1.6;
  let peak2 = 0;
  for (let i = 0; i < n; i++) { x[i] = Math.tanh(x[i] * gain * drive) / Math.tanh(drive); peak2 = Math.max(peak2, Math.abs(x[i])); }
  const g2 = Math.pow(10, -0.8 / 20) / peak2;

  const out = Buffer.alloc(44 + n * 2);
  out.write('RIFF', 0); out.writeUInt32LE(36 + n * 2, 4); out.write('WAVE', 8);
  out.write('fmt ', 12); out.writeUInt32LE(16, 16); out.writeUInt16LE(1, 20); out.writeUInt16LE(1, 22);
  out.writeUInt32LE(sr, 24); out.writeUInt32LE(sr * 2, 28); out.writeUInt16LE(2, 32); out.writeUInt16LE(16, 34);
  out.write('data', 36); out.writeUInt32LE(n * 2, 40);
  let sum = 0;
  for (let i = 0; i < n; i++) { const v = Math.max(-1, Math.min(1, x[i] * g2)); sum += v * v; out.writeInt16LE(Math.round(v * 32767), 44 + i * 2); }
  fs.writeFileSync(file, out);
  console.log(`${f} : RMS ${(20 * Math.log10(Math.sqrt(sum / n))).toFixed(1)} dBFS`);
}
