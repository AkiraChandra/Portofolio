'use client';

import Navbar from '@/components/common/navigations/Navbar';
import { AnimationProvider } from '@/contexts/AnimationContext';
import { ThemeProvider } from '@/features/theme/ThemeProvider';

export default function SectionsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <AnimationProvider>
      <ThemeProvider>
        <main className="min-h-screen overflow-x-hidden">
          <Navbar />
          <div className="h-screen overflow-y-auto snap-y snap-mandatory">
            {children}
          </div>
        </main>
      </ThemeProvider>
    </AnimationProvider>
  );
}