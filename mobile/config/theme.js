/**
 * ResumeIQ Design Tokens
 * Replicating the premium dark AI / Career Intelligence theme from the web app.
 */
export const THEME = {
  colors: {
    // Backgrounds
    background: '#08090D',
    surface: '#10121A',
    surface2: '#151824',
    surfaceBorder: 'rgba(255, 255, 255, 0.08)',
    surfaceBorderHover: 'rgba(255, 255, 255, 0.16)',

    // Accents
    primary: '#6C63FF',
    primaryHover: '#5B52E0',
    secondary: '#38BDF8',
    secondaryMuted: 'rgba(56, 189, 248, 0.15)',

    // Functional
    success: '#34D399',
    successBg: 'rgba(52, 211, 153, 0.12)',
    warning: '#FBBF24',
    warningBg: 'rgba(251, 191, 36, 0.12)',
    danger: '#F87171',
    dangerBg: 'rgba(248, 113, 113, 0.12)',
    info: '#60A5FA',

    // Typography
    textPrimary: '#F5F7FA',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    textInverse: '#08090D',
  },

  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },

  typography: {
    hero: {
      fontSize: 28,
      fontWeight: '700',
      letterSpacing: -0.5,
    },
    h1: {
      fontSize: 22,
      fontWeight: '700',
      letterSpacing: -0.3,
    },
    h2: {
      fontSize: 18,
      fontWeight: '600',
      letterSpacing: -0.2,
    },
    h3: {
      fontSize: 16,
      fontWeight: '600',
    },
    body: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
    },
    small: {
      fontSize: 12,
      fontWeight: '400',
    },
    caption: {
      fontSize: 11,
      fontWeight: '600',
      letterSpacing: 0.8,
      textTransform: 'uppercase',
    },
  },
};

