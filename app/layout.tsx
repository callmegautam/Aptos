import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ui/theme-provider';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Aptos | AI Interview Platform',
  description: 'Aptos is a platform for creating and managing your interview process'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange enableSystem>
          {children}
          <Toaster position="top-center" reverseOrder={false} />
        </ThemeProvider>
      </body>
    </html>
  );
}
