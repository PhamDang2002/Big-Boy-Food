import type { Metadata } from 'next';
import { Inter as FontSans, Poppins as FontDisplay } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import AppProvider from '@/components/app-provider';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const fontDisplay = FontDisplay({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: {
    default: 'Big Boy Restaurant - Hương vị ẩm thực tuyệt hảo',
    template: '%s | Big Boy Restaurant',
  },
  description:
    'Khám phá hương vị ẩm thực độc đáo với những món ăn được chế biến từ nguyên liệu tươi ngon nhất. Nhà hàng Big Boy - Vị ngon, trọn khoảnh khắc.',
  keywords: ['nhà hàng', 'ẩm thực', 'đồ ăn', 'restaurant', 'food', 'dining'],
  authors: [{ name: 'Big Boy Restaurant' }],
  creator: 'Big Boy Restaurant',
  publisher: 'Big Boy Restaurant',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://bigboy-restaurant.com'),
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://bigboy-restaurant.com',
    title: 'Big Boy Restaurant - Hương vị ẩm thực tuyệt hảo',
    description:
      'Khám phá hương vị ẩm thực độc đáo với những món ăn được chế biến từ nguyên liệu tươi ngon nhất.',
    siteName: 'Big Boy Restaurant',
    images: [
      {
        url: '/banner.png',
        width: 1200,
        height: 630,
        alt: 'Big Boy Restaurant',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Big Boy Restaurant - Hương vị ẩm thực tuyệt hảo',
    description:
      'Khám phá hương vị ẩm thực độc đáo với những món ăn được chế biến từ nguyên liệu tươi ngon nhất.',
    images: ['/banner.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <meta name="theme-color" content="#ea580c" />
        <meta name="msapplication-TileColor" content="#ea580c" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Big Boy Restaurant" />
        <link rel="icon" href="/icon.svg" />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased selection:bg-orange-200 selection:text-orange-900 dark:selection:bg-orange-800 dark:selection:text-orange-100',
          fontSans.variable,
          fontDisplay.variable,
        )}
      >
        <AppProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative">
              {/* Background Pattern */}
              <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

              {children}
            </div>
            <Toaster />
          </ThemeProvider>
        </AppProvider>
      </body>
    </html>
  );
}
