import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './theme-config.css'
import './globals.css'
import NavBar from './NavBar'
import '@radix-ui/themes/styles.css';
import { Container, Theme, ThemePanel } from "@radix-ui/themes";
import AuthProvider from "./auth/Provider";
import { ThemeProvider } from 'next-themes'
import { Providers } from './components/providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <AuthProvider>
          <Providers>
            <Theme accentColor="violet">
              <NavBar />
              <main className="p-5">
                <Container>{children}</Container>
              </main>
            </Theme>
          </Providers>
        </AuthProvider>
      </body>
    </html>
  )
}
