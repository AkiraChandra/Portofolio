import Navbar from '@/components/common/navigations/Navbar';
import Hero from '@/components/sections/Hero/Hero';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
    </main>
  );
}