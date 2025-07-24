import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    gradient: {
      primary: string[];
      secondary: string[];
      accent: string[];
    };
  };
  dark: boolean;
}

const lightTheme: Theme = {
  colors: {
    primary: '#6366F1',
    secondary: '#8B5CF6',
    accent: '#F59E0B',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    card: '#FFFFFF',
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    gradient: {
      primary: ['#6366F1', '#8B5CF6'],
      secondary: ['#8B5CF6', '#EC4899'],
      accent: ['#F59E0B', '#F97316'],
    },
  },
  dark: false,
};

const darkTheme: Theme = {
  colors: {
    primary: '#818CF8',
    secondary: '#A78BFA',
    accent: '#FBBF24',
    background: '#0F172A',
    surface: '#1E293B',
    card: '#334155',
    text: '#F8FAFC',
    textSecondary: '#CBD5E1',
    border: '#475569',
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    gradient: {
      primary: ['#818CF8', '#A78BFA'],
      secondary: ['#A78BFA', '#F472B6'],
      accent: ['#FBBF24', '#FB923C'],
    },
  },
  dark: true,
};

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Default to light mode instead of system preference
  const [isDark, setIsDark] = useState(false);

  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}