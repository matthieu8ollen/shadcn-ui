'use client'
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/AuthContext"
import { ContentProvider } from "@/contexts/ContentContext"  // Add this import
import { AuthGuard } from "@/components/auth-guard"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ContentProvider>  {/* Add ContentProvider wrapper */}
        <AuthGuard>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </AuthGuard>
      </ContentProvider>  {/* Close ContentProvider */}
    </AuthProvider>
  )
}
