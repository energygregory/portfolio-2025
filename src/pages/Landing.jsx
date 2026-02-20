import React from 'react';

export default function Landing() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0a0a0a',
      zIndex: 9999
    }}>
      {/* Centered SVG */}
      <div style={{ marginBottom: '3rem' }}>
        <img 
          src="/LOGOS/final.svg" 
          alt="Final" 
          style={{ 
            height: '200px',
            width: 'auto',
            filter: 'invert(1) brightness(1.1)'
          }} 
        />
      </div>

      {/* Social Media Icons */}
      <div style={{
        display: 'flex',
        gap: '1.5rem',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <a
          href="https://instagram.com/0021.studio"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          style={{
            textDecoration: 'none',
            transition: 'transform 0.12s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <img src="https://cdnjs.cloudflare.com/ajax/libs/simple-icons/11.0.0/instagram.svg" alt="Instagram" style={{ width: 24, height: 24, filter: 'invert(1)' }} />
        </a>

        <a
          href="https://behance.net/grega"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Behance"
          style={{
            textDecoration: 'none',
            transition: 'transform 0.12s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <img src="https://cdnjs.cloudflare.com/ajax/libs/simple-icons/11.0.0/behance.svg" alt="Behance" style={{ width: 24, height: 24, filter: 'invert(1)' }} />
        </a>

        <a
          href="https://x.com/energygregory"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X (Twitter)"
          style={{
            textDecoration: 'none',
            transition: 'transform 0.12s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <img src="https://cdnjs.cloudflare.com/ajax/libs/simple-icons/11.0.0/x.svg" alt="X" style={{ width: 24, height: 24, filter: 'invert(1)' }} />
        </a>
      </div>
    </div>
  );
}
