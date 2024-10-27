import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface ProfilePictureProps {
  src: string;
  className?: string;
  fromLeft?: boolean;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({
  src,
  className = "",
  fromLeft = true,
}) => {
  const containerVariants = {
    initial: {
      x: fromLeft ? -200 : 200,
      opacity: 0,
      scale: 0.5,
      rotate: fromLeft ? -180 : 180,
    },
    animate: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 1.2,
        ease: [0.68, -0.6, 0.32, 1.6],
        opacity: { duration: 0.3 },
        scale: {
          duration: 0.8,
          ease: "easeOut",
        },
        rotate: {
          duration: 1,
          ease: "easeOut",
        },
      },
    },
  };

  const Wave = ({ delay = 0 }) => (
    <motion.div
      className="absolute inset-0"
      style={{
        backgroundColor: "rgba(255, 215, 0, 0.3)",
        borderRadius: "50%",
      }}
      animate={{
        scale: [1, 1.3],
        opacity: [0.5, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        delay,
        ease: "linear",
        times: [0, 1],
        repeatType: "loop",
      }}
    />
  );

  return (
    <motion.div
      variants={containerVariants}
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
        {}
        <div className="absolute inset-0">
          <Wave delay={0} />
          <Wave delay={1.3} />
          <Wave delay={2.6} />
        </div>

        {}
        <div className="relative w-full h-full rounded-full overflow-hidden shadow-lg bg-black ">
          <Image
            src={src}
            alt="Profile Picture"
            width={200}
            height={200}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 "
            priority
          />

          {}
          <motion.div
            className="absolute inset-0 shadow-inner ring-2 ring-yellow-400/30"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { delay: 0.5, duration: 0.5 },
            }}
          />

          {}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            animate={{
              x: ["-100%", "200%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
              repeatType: "loop",
            }}
          />

          {}
          <motion.div
            className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 "
            initial={false}
          />

          {}
          <motion.div
            className="absolute inset-0 origin-center"
            initial={false}
            whileHover={{
              rotate: [0, -5, 5, 0],
              transition: {
                duration: 0.6,
                ease: "easeInOut",
                times: [0, 0.3, 0.6, 3]
              }
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePicture;