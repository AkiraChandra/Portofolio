import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { config } from "@/config";

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
  const { animations: { profile }, theme } = config;

  const Wave: React.FC<WaveProps> = ({ delay = 0 }) => (
    <motion.div
      className="absolute inset-0"
      style={{
        backgroundColor: theme.colors.primary.dark + "4D", // Adding 30% opacity
        borderRadius: "50%",
      }}
      variants={profile.wave.variants}
      initial="initial"
      animate="animate"
      transition={profile.wave.transition(delay)}
    />
  );

  return (
    <motion.div
      variants={profile.container(fromLeft)}
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
        {/* Wave Effects */}
        <div className="absolute inset-0">
          <Wave delay={0} />
          <Wave delay={0.8} />
          <Wave delay={1.6} />
        </div>

        {/* Profile Image Container */}
        <div className="relative w-full h-full rounded-full overflow-hidden shadow-lg bg-black">
          <Image
            src={src}
            alt="Profile Picture"
            width={200}
            height={200}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            priority
          />

          {/* Ring Effect */}
          <motion.div
            className="absolute inset-0 shadow-inner"
            style={{
              boxShadow: `inset 0 0 0 2px ${theme.colors.primary.dark}1A` // 10% opacity
            }}
            variants={profile.ring}
            initial="initial"
            animate="animate"
          />

          {/* Gradient Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            variants={profile.gradient.variants}
            initial="initial"
            animate="animate"
            transition={profile.gradient.transition}
          />

          {/* Hover Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            initial={false}
          />

          {/* Hover Animation */}
          <motion.div
            className="absolute inset-0 origin-center"
            variants={profile.hover}
            initial="initial"
            whileHover="hover"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePicture;