import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import '../styles/globals.css';
import { Providers } from './providers';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Molecular GPT — AI Molecular Intelligence Platform',
  description:
    'Visualize molecules, simulate reactions, and explore chemistry with AI. Built for students and researchers.',
  keywords: ['chemistry', 'AI', 'molecules', 'drug discovery', 'molecular visualization'],
  openGraph: {
    title: 'Molecular GPT',
    description: 'AI-powered molecular intelligence platform',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${jakarta.variable} font-jakarta antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
