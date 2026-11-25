// Mesure le début/fin de parole de chaque fichier de voix off (WAV PCM 16 bits)
// et écrit src/audio/vo-timings.generated.json (utilisé pour caler la timeline).
const fs = require('fs');
const path = require('path');
const dir = path.resolve(__dirname, '..', process.argv[2] || path.join('public', 'audio', 'vo'));
const outFile = path.resolve(__dirname, '..', process.argv[3] || path.join('src', 'audio', 'vo-timings.generated.json'));
const out = {};
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.wav')).sort()) {
  const b = fs.readFileSync(path.join(dir, f));
  let off = 12, dOff, dSz, sr = 16000, ch = 1;
  while (off < b.length) {
    const id = b.toString('ascii', off, off + 4), sz = b.readUInt32LE(off + 4);
    if (id === 'fmt ') { ch = b.readUInt16LE(off + 10); sr = b.readUInt32LE(off + 12); }
    if (id === 'data') { dOff = off + 8; dSz = sz; }
    off += 8 + sz;
  }
  const n = dSz / 2 / ch, win = Math.round(sr / 100);
  let first = -1, last = -1;
  for (let i = 0; i < n; i += win) {
    let m = 0;
    for (let j = i; j < Math.min(n, i + win); j++) m = Math.max(m, Math.abs(b.readInt16LE(dOff + j * 2 * ch)));
    if (m > 800) { if (first < 0) first = i; last = i + win; }
  }
  out[f.replace('.wav', '')] = { fileSec: +(n / sr).toFixed(3), speechStartSec: +(first / sr).toFixed(3), speechEndSec: +(last / sr).toFixed(3) };
}
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(out, null, 2));
console.log(out);
