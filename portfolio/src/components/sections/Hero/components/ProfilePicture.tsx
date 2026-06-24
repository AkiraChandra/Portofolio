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

  // Prevent image download
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div 
      className={`relative ${className}`}
      onContextMenu={handleContextMenu}
    >
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
        {/* OPTIMIZATION 3: Optimized Profile Image with performance settings & download protection */}
        <motion.div 
          className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/20 dark:border-white/10 select-none"
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
        >
          <Image
            src={src}
            alt="Profile"
            fill
            className="object-cover pointer-events-none select-none"
            sizes="(max-width: 480px) 140px, (max-width: 768px) 160px, (max-width: 1024px) 160px, 220px"
            priority={false} 
            loading="lazy"    
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAgDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyLli2Qc7bk/wANVdVzBZFmgjmTM080OoKCKu0HS0T41LbZVPdS/I0gTthV"
            style={{ 
              objectFit: 'cover',
              width: '100%',
              height: '100%'
            }}
            draggable={false}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProfilePicture;