'use client'

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import MovingStars from "@/components/ui/Movingstars";
import TypeWriter from "./components/TypeWritter";
import { useAstronautSize } from "@/hooks/useMediaQuery";
import ProfilePicture from "@/components/common/ProfilePicture";

const Hero: React.FC = () => {
  const words = ["Web Developer", "UI/UX Designer", "Full Stack Developer"];
  const { width, height } = useAstronautSize();

  return (
    <section className="relative min-h-screen bg-[var(--background)] overflow-hidden pt-24">
      {}
      <div className="absolute inset-0 z-0">
        <MovingStars />
      </div>

      {}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/50 to-[#0a0a0a] z-1" />

      {}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10"
          >
            <div className="md:flex md:items-center">
              {}
              <div className="hidden md:block lg:hidden mr-6">
                <ProfilePicture 
                  src="/profile.png" 
                  className="w-[220px] h-[220px]"
                  fromLeft={false}
                />
              </div>

              {}
              <div className="md:hidden mb-6">
                <ProfilePicture 
                  src="/profile.png" 
                  className="w-[220px] h-[220px]"
                  fromLeft={true}
                />
              </div>

              <div className="flex-1">
                {}
                <div className="lg:hidden bg-purple-800/20 text-white px-6 py-2 rounded-lg inline-block mb-3 backdrop-blur-sm">
                  Welcome to my Portfolio
                </div>

                {}
                <div className="hidden lg:block">
                  <div className="mb-6">
                    <ProfilePicture 
                      src="/profile.png" 
                      className="w-[220px] h-[220px]"
                      fromLeft={true}
                    />
                  </div>
                  <div className="bg-purple-800/20 text-white px-6 py-2 rounded-lg inline-block mb-6 backdrop-blur-sm">
                    Welcome to my Portfolio
                  </div>
                </div>

                <h1 className="font-bold text-white mb-3">
                  <div className="text-5xl lg:text-5xl mb-1">
                    Hi! I'm{" "}
                    <span className="text-yellow-400 text-glow">Akira Chandra</span>
                  </div>
                  <div className="w-full md:w-[560px] min-h-[50px] overflow-visible text-5xl lg:text-5xl">
                    I'm a <TypeWriter words={words} />
                  </div>
                </h1>

                <p className="text-gray-400 mb-8 max-w-lg text-lg">
                  Passionate about creating beautiful, functional, and user-centered
                  digital experiences. Specializing in modern web technologies and
                  creative solutions.
                </p>

                <div className="flex flex-wrap gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2"
                  >
                    Let's Connect
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 border border-white/20 text-yellow-400 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Download CV
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="relative z-10 flex items-center justify-center min-h-[400px] lg:min-h-[600px] "
          >
            {}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute w-full max-w-[800px] aspect-square rounded-full bg-[var(--glow-outer)] blur-3xl" />
              <div className="absolute w-full max-w-[600px] aspect-square rounded-full bg-[var(--glow-middle)] blur-2xl" />
              <div className="absolute w-full max-w-[500px] aspect-square rounded-full bg-[var(--glow-inner)] blur-xl" />
            </div>

            {}
            <motion.div
              animate={{
                y: [-30, 0, -30],
                rotate: [-5, 5, -5],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative z-20 w-full h-full flex items-center justify-center"
            >
              <Image
                src="/astronaut.png"
                alt="Astronaut"
                width={width}
                height={height}
                className="w-full h-full object-contain transform scale-110"
                priority
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white/50"
      >
        <span className="text-sm mb-2">Scroll to explore</span>
        <motion.div
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;