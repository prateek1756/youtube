import { Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { Toaster } from 'react-hot-toast';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata = {
  title: 'YTGrab — YouTube Video Downloader',
  description:
    'Download YouTube videos as MP4 or MP3 for free. Supports up to 1080p HD quality. No sign-up required.',
  keywords: ['youtube downloader', 'download youtube video', 'youtube to mp3', 'youtube to mp4', 'free video downloader'],
  authors: [{ name: 'YTGrab' }],
  openGraph: {
    title: 'YTGrab — YouTube Video Downloader',
    description: 'Download YouTube videos as MP4 or MP3 for free. Supports up to 1080p HD.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YTGrab — YouTube Video Downloader',
    description: 'Download YouTube videos as MP4 or MP3 for free. Supports up to 1080p HD.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="font-outfit bg-[#080810] text-white antialiased min-h-screen">
        <Navbar />
        <main>{children}</main>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              borderRadius: '16px',
              fontSize: '14px',
              fontFamily: 'var(--font-outfit)',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
      </body>
    </html>
  );
}
