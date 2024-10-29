import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  getProfileContainerVariants,
  profileWaveVariants,
  profileWaveTransition,
  profileRingVariants,
  profileGradientVariants,
  profileGradientTransition,
  profileHoverVariants,
} from "@/lib/animations";

interface ProfilePictureProps {
  src: string;
  className?: string;
  fromLeft?: boolean;
}

interface WaveProps {
  delay?: number;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({
  src,
  className = "",
  fromLeft = true,
}) => {
  const Wave: React.FC<WaveProps> = ({ delay = 0 }) => (
    <motion.div
      className="absolute inset-0"
      style={{
        backgroundColor: "rgba(255, 215, 0, 0.3)",
        borderRadius: "50%",
      }}
      variants={profileWaveVariants}
      initial="initial"
      animate="animate"
      transition={profileWaveTransition(delay)}
    />
  );

  return (
    <motion.div
      variants={getProfileContainerVariants(fromLeft)}
      initial="initial"
      animate="animate"
      whileHover={{
        scale: 1.05,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 10
        }
      }}
      whileTap={{
        scale: 0.95,
      }}
      className={`relative ${className} cursor-pointer`}
    >
      <div className="relative w-full h-full group">
        <div className="absolute inset-0">
          <Wave delay={0} />
          <Wave delay={0.8} />
          <Wave delay={1.6} />
        </div>

        <div className="relative w-full h-full rounded-full overflow-hidden shadow-lg bg-black">
          <Image
            src={src}
            alt="Profile Picture"
            width={200}
            height={200}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            priority
          />

          <motion.div
            className="absolute inset-0 shadow-inner ring-2 ring-yellow-400/30"
            variants={profileRingVariants}
            initial="initial"
            animate="animate"
          />

          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            variants={profileGradientVariants}
            initial="initial"
            animate="animate"
            transition={profileGradientTransition}
          />

          <motion.div
            className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            initial={false}
          />

          <motion.div
            className="absolute inset-0 origin-center"
            variants={profileHoverVariants}
            initial="initial"
            whileHover="hover"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePicture;