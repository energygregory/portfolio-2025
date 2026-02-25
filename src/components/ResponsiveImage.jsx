import React from 'react';

// ResponsiveImage: given an original src like '/Images/2025/POSTERS/post00.jpg'
// it will attempt to use generated variants like '/Images/2025/POSTERS/post00@400.avif',
// '/Images/2025/POSTERS/post00@800.avif', '/Images/2025/POSTERS/post00@1200.avif',
// and fall back to the original file. Uses <picture> with AVIF -> WEBP -> img.
export default function ResponsiveImage({ src, alt = '', className = '', loading = 'lazy', sizes, ...imgProps }) {
  if (!src) return null;

  const ext = src.split('.').pop();
  const base = src.replace(/\.[^.]+$/, '');

  // widths should match what the optimization script generates
  const widths = [400, 800, 1200];

  const avifSrcset = widths.map(w => `${base}@${w}.avif ${w}w`).concat(`${base}.avif ${Math.max(...widths)}w`).join(', ');
  const webpSrcset = widths.map(w => `${base}@${w}.webp ${w}w`).concat(`${base}.webp ${Math.max(...widths)}w`).join(', ');
  const jpgSrcset = widths.map(w => `${base}@${w}.jpg ${w}w`).concat(`${src} ${Math.max(...widths)}w`).join(', ');

  const sizesAttr = sizes || '(max-width: 640px) 60vw, 30vw';

  return (
    <picture className="contents">
      <source type="image/avif" srcSet={avifSrcset} sizes={sizesAttr} />
      <source type="image/webp" srcSet={webpSrcset} sizes={sizesAttr} />
      <img src={src} srcSet={jpgSrcset} sizes={sizesAttr} alt={alt} className={className} loading={loading} decoding="async" {...imgProps} />
    </picture>
  );
}
