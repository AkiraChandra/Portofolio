// src/app/layout.tsx
import { AnimationProvider } from '@/contexts/AnimationContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AnimationProvider>
          <div className="min-h-screen bg-background-primary dark:bg-background-primary-dark">
            {children}
          </div>
        </AnimationProvider>
      </body>
    </html>
  );
}