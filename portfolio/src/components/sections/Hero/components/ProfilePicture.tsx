// src/components/sections/Hero/components/ProfilePicture.tsx - OPTIMIZED
"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { config } from "@/config";

interface ProfilePictureProps {
  src: string;
  className?: string;
  fromLeft?: boolean;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({
  src,
  className = "",
  fromLeft = false,
}) => {
  const { animations } = config;

  return (
    <div className={`relative ${className}`}>
      {/* OPTIMIZATION 1: Simplified container animation with hardware acceleration */}
      <motion.div
        className="relative w-full h-full"
        variants={animations.profile.container(fromLeft)}
        initial="initial"
        animate="animate"
        // OPTIMIZATION 2: Replace infinite wave with efficient hover effect
        whileHover={{
          y: -5,
          transition: { duration: 0.2, ease: "easeOut" }
        }}
        style={{ 
          willChange: 'transform',
          transform: 'translateZ(0)' // Force hardware acceleration
        }}
      >
        {/* OPTIMIZATION 3: Optimized Profile Image with performance settings */}
        <motion.div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/20 dark:border-white/10">
          <Image
            src={src}
            alt="Profile"
            fill
            className="object-cover"
            // OPTIMIZATION 4: Responsive sizes based on actual display dimensions
            sizes="(max-width: 480px) 140px, (max-width: 768px) 160px, (max-width: 1024px) 160px, 220px"
            priority
            quality={85} // Balanced quality vs file size
            // OPTIMIZATION 5: Add blur placeholder for smooth loading
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAgDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyLli2Qc7bk/wANVdVzBZFmgjmTM080OoKCKu0HS0T41LbZVPdS/I0gTthV"
            loading="eager" // Since it's above fold
            style={{ 
              objectFit: 'cover',
              width: '100%',
              height: '100%'
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProfilePicture;