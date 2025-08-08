// src/components/sections/Experience/components/TimeLineGlow.tsx - ENHANCED WITH ACTIVITY SUPPORT
// Modifikasi minimal untuk mendukung activity-aware visual effects

import React, { memo } from "react";
import { motion } from "framer-motion";

interface TimelineGlowProps {
  isActive: boolean;
  color?: string;
  isActivityEnabled?: boolean; // ✅ TAMBAH: Activity-aware prop
}

const TimelineGlow = memo<TimelineGlowProps>(({ 
  isActive, 
  color = '#3b82f6',
  isActivityEnabled = true // ✅ TAMBAH: Default enabled
}) => {
  // ✅ MODIFIKASI: Activity-aware glow intensity
  const glowIntensity = isActivityEnabled ? 1 : 0.3;
  const pulseEnabled = isActivityEnabled && isActive;

  const glowVariants = {
    inactive: {
      opacity: 0.2 * glowIntensity,
      scale: 1,
      transition: { duration: 0.3 }
    },
    active: {
      opacity: [0.4 * glowIntensity, 0.8 * glowIntensity, 0.4 * glowIntensity],
      scale: [1, 1.2, 1],
      transition: {
        duration: pulseEnabled ? 2 : 0.3,
        repeat: pulseEnabled ? Infinity : 0,
        ease: "easeInOut"
      }
    }
  };

  return (
    <>
      {/* Primary Glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ 
          background: `radial-gradient(circle, ${color}40, transparent 70%)`,
          filter: `blur(8px)` 
        }}
        variants={glowVariants}
        animate={isActive ? "active" : "inactive"}
      />
      
      {/* Secondary Glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ 
          background: `radial-gradient(circle, ${color}60, transparent 50%)`,
          filter: `blur(4px)` 
        }}
        variants={{
          inactive: {
            opacity: 0.1 * glowIntensity,
            scale: 0.8,
            transition: { duration: 0.3 }
          },
          active: {
            opacity: [0.2 * glowIntensity, 0.6 * glowIntensity, 0.2 * glowIntensity],
            scale: [0.8, 1.1, 0.8],
            transition: {
              duration: pulseEnabled ? 2 : 0.3,
              repeat: pulseEnabled ? Infinity : 0,
              ease: "easeInOut",
              delay: 0.1
            }
          }
        }}
        animate={isActive ? "active" : "inactive"}
      />

      {/* Core Glow */}
      {isActive && isActivityEnabled && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ 
            background: `radial-gradient(circle, ${color}80, transparent 30%)`,
            filter: `blur(2px)` 
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: [0, 0.8 * glowIntensity, 0],
            scale: [0.5, 1.3, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeOut",
            delay: 0.2
          }}
        />
      )}

      {/* Subtle Ring Effect */}
      <motion.div
        className="absolute inset-0 rounded-full border-2"
        style={{ 
          borderColor: `${color}30`,
          filter: `drop-shadow(0 0 6px ${color}40)` 
        }}
        variants={{
          inactive: {
            opacity: 0.3 * glowIntensity,
            scale: 1,
            rotate: 0
          },
          active: {
            opacity: 0.7 * glowIntensity,
            scale: 1.05,
            rotate: pulseEnabled ? 360 : 0
          }
        }}
        animate={isActive ? "active" : "inactive"}
        transition={{
          duration: pulseEnabled ? 8 : 0.3,
          repeat: pulseEnabled ? Infinity : 0,
          ease: "linear"
        }}
      />
    </>
  );
});

TimelineGlow.displayName = "TimelineGlow";

export default TimelineGlow;