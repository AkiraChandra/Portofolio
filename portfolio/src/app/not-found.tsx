// src/app/not-found.tsx - Handle missing assets
import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center space-y-6">
        <div className="relative w-32 h-32 mx-auto">
          <Image
            src="/astronaut.png"
            alt="Lost in space"
            fill
            className="object-contain"
          />
        </div>
        <h1 className="text-4xl font-bold text-white">404 - Lost in Space</h1>
        <p className="text-gray-400 max-w-md">
          The page you're looking for has drifted into the cosmic void.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-yellow-500 text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors"
        >
          Return to Earth
        </Link>
      </div>
    </div>
  );
}