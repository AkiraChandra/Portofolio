"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import MovingStars from "@/components/ui/animations/Movingstars";
import TypeWriter from "./components/TypeWritter";
import { useAstronautSize } from "@/hooks/common/useMediaQuery";
import ProfilePicture from "@/components/sections/Hero/components/ProfilePicture";
import { config } from "@/config";

const Hero: React.FC = () => {
  const { animations, theme } = config;
  const words = ["Web Developer", "UI/UX Designer", "Full Stack Developer"];
  const { width, height } = useAstronautSize();

  return (
    <section className="relative min-h-screen bg-[var(--background)] overflow-hidden pt-16 sm:pt-20 lg:pt-0">
      {/* Background Stars */}
      <div className="absolute inset-0 z-0">
        <MovingStars />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-1" />

      {/* Main Content */}
      <div className="container mx-auto px-12 relative z-10 md:mt-20 lg:mb-20 xl:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-4 lg:items-center">
          {/* Left Column - Text Content */}
          <motion.div
            id="hero-content"
            variants={animations.hero.leftContent}
            initial="hidden"
            animate="visible"
            className="relative z-10 lg:col-span-6 xl:col-span-6"
          >
            <div className="md:flex md:items-center">
              {/* Profile Picture - Tablet */}
              <div className="hidden md:block lg:hidden mr-4">
                <ProfilePicture
                  src="/profile.png"
                  className="w-[160px] h-[160px] sm:w-[160px] sm:h-[160px]"
                  fromLeft={false}
                />
              </div>

              {/* Profile Picture - Mobile */}
              <div className="md:hidden mb-4 flex justify-center">
                <ProfilePicture
                  src="/profile.png"
                  className="w-[140px] h-[140px] sm:w-[160px] sm:h-[160px]"
                  fromLeft={true}
                />
              </div>

              <div className="flex-1 max-w-[560px] xl:max-w-[640px]">
                {/* Welcome Text - Mobile & Tablet */}
                <motion.div 
                  variants={animations.hero.child}
                  className="lg:hidden bg-purple-800/20 text-white px-4 py-1.5 sm:px-5 sm:py-2 rounded-lg inline-block mb-3 backdrop-blur-sm text-sm sm:text-base mt-4"
                >
                  Welcome to my Portfolio
                </motion.div>

                {/* Desktop Layout */}
                <div className="hidden lg:block">
                  <div className="mb-6 ml-4">
                    <ProfilePicture
                      src="/profile.png"
                      className="w-[200px] h-[200px]"
                      fromLeft={true}
                    />
                  </div>
                  <motion.div 
                    variants={animations.hero.child}
                    className="bg-purple-800/20 text-white px-6 py-2.5 rounded-lg inline-block mb-4 backdrop-blur-sm text-lg"
                  >
                    Welcome to my Portfolio
                  </motion.div>
                </div>

                <motion.h1 
                  variants={animations.hero.child}
                  className="font-bold text-white mb-2"
                >
                  <div className="flex items-baseline space-x-2 whitespace-nowrap text-3xl sm:text-4xl lg:text-5xl xl:text-[3.1rem] mb-2">
                    <span className="whitespace-nowrap">Hi! I'm&nbsp;</span>
                    <span className="text-yellow-400 text-glow whitespace-nowrap">{config.site.author}</span>
                  </div>
                  <div className="min-h-[40px] sm:min-h-[45px] lg:min-h-[60px] overflow-visible text-3xl sm:text-4xl lg:text-5xl xl:text-[3.1rem]">
                    <span className="whitespace-nowrap">I'm a </span>
                    <TypeWriter words={words} />
                  </div>
                </motion.h1>

                <motion.p 
                  variants={animations.hero.child}
                  className="text-gray-400 mb-2 text-base sm:text-lg xl:text-[1.05rem] xl:leading-relaxed"
                >
                  {config.site.description}
                </motion.p>

                <motion.div 
                  variants={animations.hero.child}
                  className="flex flex-wrap gap-3 sm:gap-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 sm:px-8 py-2.5 sm:py-3 lg:px-8 xl:px-10 lg:py-3 xl:py-4 bg-yellow-500 text-black rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2 text-sm sm:text-base lg:text-lg"
                  >
                    Let's Connect
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6"
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
                    className="px-6 sm:px-8 py-2.5 sm:py-3 lg:px-8 xl:px-10 lg:py-3 xl:py-4 border border-white/20 text-yellow-400 rounded-lg hover:bg-white/10 transition-colors text-sm sm:text-base lg:text-lg"
                  >
                    Download CV
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Astronaut */}
          <motion.div
            id="hero-content"
            variants={animations.hero.rightContent}
            initial="hidden"
            animate="visible"
            className="relative z-10 flex items-center justify-center min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] lg:col-span-6 xl:col-span-6"
          >
            {/* Container for both glow and astronaut */}
            <div className="relative flex items-center justify-center lg:translate-y-0">
              {/* Glowing Background */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute w-full max-w-[600px] sm:max-w-[800px] aspect-square rounded-full bg-[var(--glow-outer)] blur-3xl scale-90 lg:scale-100" />
                <div className="absolute w-full max-w-[400px] sm:max-w-[600px] aspect-square rounded-full bg-[var(--glow-middle)] blur-2xl scale-90 lg:scale-100" />
                <div className="absolute w-full max-w-[300px] sm:max-w-[500px] aspect-square rounded-full bg-[var(--glow-inner)] blur-xl scale-90 lg:scale-100" />
              </div>
              
              {/* Floating Astronaut */}
              <motion.div
                animate={animations.astronaut.float.animate}
                transition={animations.astronaut.float.transition}
                className="relative z-20 w-full h-full flex items-center justify-center scale-90 lg:scale-100 xl:scale-110"
              >
                <Image
                  src="/astronaut.png"
                  alt="Astronaut"
                  width={width}
                  height={height}
                  className="w-full h-full object-contain"
                  priority
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        variants={animations.scroll.indicator}
        initial="initial"
        animate="animate"
        className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white/50"
      >
        <span className="text-xs sm:text-sm mb-2">Scroll to explore</span>
        <motion.div
          animate={animations.scroll.arrow.animate}
          transition={animations.scroll.arrow.transition}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-6 sm:w-6"
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