import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "The Wall | Facebook (2008)",
  description: 'A nostalgic 2008-era Facebook Wall built with Next.js 15, React 19, Tailwind CSS, and Supabase Realtime.',
  keywords: ['Facebook Wall', 'Supabase', 'Next.js', 'React', 'Tailwind CSS', 'Realtime'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f7f7f7] text-[#333333]">
        {children}
      </body>
    </html>
  );
}
