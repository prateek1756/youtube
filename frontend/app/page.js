import HeroSection from '@/components/HeroSection';

export const metadata = {
  title: 'YTGrab — Free YouTube Video Downloader',
  description:
    'The fastest way to download YouTube videos as MP4 or MP3. No sign-up, no ads, completely free.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
    </div>
  );
}
