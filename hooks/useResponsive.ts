import { useWindowDimensions } from 'react-native';

export const BREAKPOINTS = {
  sm: 0,
  md: 768,
  lg: 1024,
  xl: 1280,
};

export type Breakpoint = keyof typeof BREAKPOINTS;

export function useResponsive() {
  const { width } = useWindowDimensions();

  const getBreakpoint = (): Breakpoint => {
    if (width < BREAKPOINTS.md) {
      return 'sm';
    } else if (width < BREAKPOINTS.lg) {
      return 'md';
    } else if (width < BREAKPOINTS.xl) {
      return 'lg';
    } else {
      return 'xl';
    }
  };

  const breakpoint = getBreakpoint();

  const isMobile = breakpoint === 'sm';
  const isTablet = breakpoint === 'md';
  const isDesktop = breakpoint === 'lg' || breakpoint === 'xl';

  const select = <T>(styles: { [key in Breakpoint]?: T }): T | undefined => {
    if (styles[breakpoint]) {
      return styles[breakpoint];
    }
    // Fallback to the next smaller breakpoint
    if (breakpoint === 'xl' && styles.lg) return styles.lg;
    if (breakpoint === 'lg' && styles.md) return styles.md;
    if (breakpoint === 'md' && styles.sm) return styles.sm;
    return undefined;
  };

  return {
    breakpoint,
    isMobile,
    isTablet,
    isDesktop,
    width,
    select,
  };
}
