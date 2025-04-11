import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"
import { ServerAuthProvider } from "@/components/auth/server-auth-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "vrajitor",
  description: "A multivendor freelancer marketplace platform",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <ServerAuthProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">
                  <div className="mx-auto max-w-6xl w-full">{children}</div>
                </main>
                <Footer />
                <Toaster />
              </div>
            </ServerAuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}