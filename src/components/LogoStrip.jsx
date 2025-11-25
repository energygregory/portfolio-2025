// src/components/LogoStrip.jsx

const logos = [
  "Nike",
  "Adobe",
  "Spotify",
  "Apple",
  "Google",
  "Figma",
];

export default function LogoStrip() {
  return (
    <div className="w-full border-b border-neutral-800 bg-black">
      <div className="logo-marquee overflow-hidden">
        <div className="logo-marquee-inner">
          {logos.concat(logos).map((label, index) => (
            <span key={index} className="logo-pill">
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
