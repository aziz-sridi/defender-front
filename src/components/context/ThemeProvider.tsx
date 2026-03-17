'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ThemeProviderProps } from 'next-themes'

/**
 * ThemeProvider wrapper using next-themes
 * This is the same library used by Storybook and provides robust theme management
 * with automatic persistence, SSR support, and cross-tab synchronization
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      storageKey="defendr-theme"
      disableTransitionOnChange={false}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}

// Re-export useTheme from next-themes for consistency
export { useTheme } from 'next-themes'
