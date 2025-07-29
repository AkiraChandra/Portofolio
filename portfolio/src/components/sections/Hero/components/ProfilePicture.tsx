// src/components/sections/Hero/components/ProfilePicture.tsx
// ✅ OPTIMIZED VERSION - Remove infinite animation

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { config } from "@/config";
import { useTheme } from "@/hooks/theme/useTheme";

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
      {/* ✅ PERFORMANCE FIX: Simplified container animation */}
      <motion.div
        className="relative w-full h-full"
        variants={animations.profile.container(fromLeft)}
        initial="initial"
        animate="animate"
        // ✅ Replace infinite wave with subtle hover effect
        whileHover={{
          y: -5,
          transition: { duration: 0.2, ease: "easeOut" }
        }}
      >
        {/* Profile Image - Clean & Simple */}
        <motion.div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/20 dark:border-white/10">
          <Image
            src={src}
            alt="Profile"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 200px, 300px"
            priority
          />
        </motion.div>
      </motion.div>
    </div>
    
  );
};

export default ProfilePicture;