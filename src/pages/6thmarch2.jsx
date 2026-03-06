import React, { useState, useEffect } from "react";

const COLS = 5;

// Images ordered so specified groups are consecutive / row-aligned
const ALL_IMAGES = [
  // Row 1: the crew (exactly 5 – perfect row)
  'castro d.png', 'ebony.png', 'kojo.png', 'last two.png', 'rawlings.png',
  // Row 2: fronts + solids (3 + 2 = 5)
  'black front.png', 'yellow front.png', 'white front.png', 'white.png', 'black.png',
  // Row 3: pairs + filler (2 + 2 + 1 = 5)
  '5.png', '6.png', 'a gyan.png', 'legend tee.png', '1.png',
  // Row 4
  '2.png', '4 prez 1.png', '4 prez 2.png', 'nkrumah solo.png', '5 cedi.png',
  // Row 5
  'black2.png', 'blue1 copy.png', 'gyan front.png', 'gyan back.png', 'hac.png',
  // Row 6 (partial – 1 item)
  'Layer 1.png',
];

const ROWS = Math.ceil(ALL_IMAGES.length / COLS); // 6

const SIZES = [
  { label: '1080 × 1920', w: 1080, h: 1920 },
  { label: '2000 × 2000', w: 2000, h: 2000 },
];

// Images that need to appear smaller in each grid cell
// Higher padding % = smaller image displayed
const GRID_PAD_OVERRIDE = {
  'black2.png':     '22%',
  'blue1 copy.png': '22%',
  'gyan front.png': '16%',
};
// Scale factor applied to canvas draw size for these images
const CANVAS_SCALE_OVERRIDE = {
  'black2.png':     0.65,
  'blue1 copy.png': 0.65,
  'gyan front.png': 0.82,
};


export default function SixthMarch2() {
  const [sizeIdx, setSizeIdx] = useState(0);
  const [bg, setBg] = useState('black');
  const [scale, setScale] = useState(1);
  const [downloading, setDownloading] = useState(false);
  const { w, h } = SIZES[sizeIdx];
  const textColor = bg === 'black' ? 'white' : 'black';

  useEffect(() => {
    const compute = () => {
      const s = Math.min((window.innerWidth - 32) / w, (window.innerHeight - 120) / h, 1);
      setScale(s);
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [w, h]);

  const handleDownload = async () => {
    setDownloading(true);
    const DW = w, DH = h;
    const PAD = Math.round(DW * 0.05);
    const GAP = Math.round(DW * 0.04);
    const IMG_SCALE = 0.72;
    const cellW = Math.floor((DW - PAD * 2 - GAP * (COLS - 1)) / COLS);
    const cellH = Math.floor((DH - PAD * 2 - GAP * (ROWS - 1)) / ROWS);
    const imgW = Math.round(cellW * IMG_SCALE);
    const imgH = Math.round(cellH * IMG_SCALE);
    const canvas = document.createElement('canvas');
    canvas.width = DW;
    canvas.height = DH;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = bg === 'black' ? '#000000' : '#ffffff';
    ctx.fillRect(0, 0, DW, DH);

    const loaded = await Promise.all(
      ALL_IMAGES.map(f => new Promise(res => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => res(img);
        img.onerror = () => res(null);
        img.src = encodeURI(`/Images/6thMarch/${f}`);
      }))
    );

    loaded.forEach((img, i) => {
      if (!img) return;
      const file = ALL_IMAGES[i];
      const scaleMult = CANVAS_SCALE_OVERRIDE[file] ?? 1;
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const cellX = PAD + col * (cellW + GAP);
      const cellY = PAD + row * (cellH + GAP);
      const eW = Math.round(imgW * scaleMult);
      const eH = Math.round(imgH * scaleMult);
      const cx = cellX + (cellW - eW) / 2;
      const cy = cellY + (cellH - eH) / 2;
      const ar = img.width / img.height;
      const car = eW / eH;
      let dw, dh, dx, dy;
      if (ar > car) { dw = eW; dh = eW / ar; dx = cx; dy = cy + (eH - dh) / 2; }
      else           { dh = eH; dw = eH * ar; dy = cy; dx = cx + (eW - dw) / 2; }
      ctx.drawImage(img, dx, dy, dw, dh);
    });

    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `6thmarch-${DW}x${DH}.png`;
      a.click();
      URL.revokeObjectURL(url);
      setDownloading(false);
    });
  };

  const btnBase = {
    padding: '8px 18px', borderRadius: 6, fontSize: 12,
    fontFamily: '"PT Mono", monospace', letterSpacing: '0.08em', cursor: 'pointer',
    background: bg === 'black' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)',
    color: textColor,
    border: `1px solid ${bg === 'black' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
  };

  const dispPad = Math.round(w * 0.05);
  const dispGap = Math.round(w * 0.028);

  return (
    <div style={{
      minHeight: '100vh', background: bg === 'black' ? '#0a0a0a' : '#f5f5f5',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      paddingTop: 16, paddingBottom: 16,
    }}>
      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
        <button style={btnBase} onClick={() => setSizeIdx(i => (i + 1) % SIZES.length)}>
          {SIZES[sizeIdx].label} ↔ {SIZES[(sizeIdx + 1) % SIZES.length].label}
        </button>
        <button style={btnBase} onClick={() => setBg(b => b === 'black' ? 'white' : 'black')}>
          BG: {bg.toUpperCase()}
        </button>
        <button style={{ ...btnBase, opacity: downloading ? 0.5 : 1 }} onClick={handleDownload} disabled={downloading}>
          {downloading ? 'SAVING…' : `↓ ${SIZES[sizeIdx].label}`}
        </button>
        <span style={{ color: textColor, opacity: 0.4, fontSize: 11, fontFamily: '"PT Mono", monospace' }}>
          {Math.round(scale * 100)}%
        </span>
      </div>

      {/* Canvas – grid fills the full w×h using fr rows */}
      <div style={{
        width: w, height: h, background: bg,
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        marginBottom: h * scale - h,
        padding: dispPad,
        boxSizing: 'border-box',
        display: 'grid',
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        gap: dispGap,
      }}>
        {ALL_IMAGES.map((file, i) => (
            <div key={i} style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: GRID_PAD_OVERRIDE[file] ?? '12%' }}>
            <img
              src={encodeURI(`/Images/6thMarch/${file}`)}
              alt={file.replace('.png', '')}
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
