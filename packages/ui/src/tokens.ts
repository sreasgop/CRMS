/**
 * Apple Design System Tokens for CRMS
 * Master reference specification derived from DESIGN.md
 */

export const appleTokens = {
  colors: {
    primary: '#0066cc',          // Action Blue
    primaryFocus: '#0071e3',     // Focus ring blue
    primaryOnDark: '#2997ff',    // Sky Link Blue for dark tiles
    ink: '#1d1d1f',              // Near-black text / body
    bodyMuted: '#cccccc',        // Muted text on dark
    inkMuted80: '#333333',       // Subdued black
    inkMuted48: '#7a7a7a',       // Disabled / fine-print
    dividerSoft: '#f0f0f0',      // Soft border ring
    hairline: '#e0e0e0',         // 1px line separator
    canvas: '#ffffff',           // Pure white tile
    canvasParchment: '#f5f5f7',  // Signature Apple off-white
    surfacePearl: '#fafafc',     // Pearl fill
    surfaceTile1: '#272729',     // Near-black tile 1
    surfaceTile2: '#2a2a2c',     // Near-black tile 2
    surfaceTile3: '#252527',     // Near-black tile 3
    surfaceBlack: '#000000',     // Void black
    chipTranslucent: 'rgba(210, 210, 215, 0.64)',
  },
  typography: {
    heroDisplay: 'SF Pro Display, Inter, system-ui, sans-serif',
    bodyText: 'SF Pro Text, Inter, system-ui, sans-serif',
  },
  radii: {
    none: '0px',
    xs: '5px',
    sm: '8px',
    md: '11px',
    lg: '18px',
    pill: '9999px',
    full: '9999px',
  },
  shadows: {
    productShadow: '0px 5px 30px 0px rgba(0, 0, 0, 0.22)',
    hairlineShadow: '0 0 0 1px rgba(0, 0, 0, 0.08)',
  },
  animations: {
    activeScale: 'active:scale-95 transition-transform duration-150 ease-out',
  },
} as const;
