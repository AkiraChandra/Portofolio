// src/hooks/common/useScrollNavigation.ts - MOBILE OPTIMIZED
"use client";

import { useEffect, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useMediaQuery } from "./useMediaQuery";

const SECTIONS = [
  { id: "home", path: "/" },
  { id: "projects", path: "/projects" },
  { id: "experience", path: "/experience" },
  { id: "certifications", path: "/certifications" },
  { id: "skills", path: "/skills" },
];

export const useScrollNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Reduced navigation lock time for mobile
  const isNavigating = useRef(false);
  const lastNavigationTime = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout>();

  const getCurrentSectionIndex = useCallback(() => {
    return SECTIONS.findIndex((section) => section.path === pathname);
  }, [pathname]);

  const navigateToSection = useCallback(
    (direction: "up" | "down") => {
      const now = Date.now();
      
      // Shorter lock time for mobile (300ms) vs desktop (600ms)
      const lockDuration = isMobile ? 300 : 600;
      
      if (isNavigating.current || (now - lastNavigationTime.current) < lockDuration) {
        return;
      }

      const currentIndex = getCurrentSectionIndex();
      let targetIndex = currentIndex;

      if (direction === "down" && currentIndex < SECTIONS.length - 1) {
        targetIndex = currentIndex + 1;
      } else if (direction === "up" && currentIndex > 0) {
        targetIndex = currentIndex - 1;
      }

      if (targetIndex !== currentIndex) {
        isNavigating.current = true;
        lastNavigationTime.current = now;
        
        // Immediate navigation for mobile
        if (isMobile) {
          router.push(SECTIONS[targetIndex].path);
          
          // Shorter reset time for mobile
          setTimeout(() => {
            isNavigating.current = false;
          }, 200);
        } else {
          router.push(SECTIONS[targetIndex].path);
          
          setTimeout(() => {
            isNavigating.current = false;
          }, 500);
        }
      }
    },
    [getCurrentSectionIndex, router, isMobile]
  );

  const navigateDirectly = useCallback(
    (targetPath: string) => {
      const now = Date.now();
      const lockDuration = isMobile ? 200 : 400;
      
      if (isNavigating.current || (now - lastNavigationTime.current) < lockDuration) {
        return;
      }

      const targetIndex = SECTIONS.findIndex(
        (section) => section.path === targetPath
      );
      
      if (targetIndex !== -1) {
        isNavigating.current = true;
        lastNavigationTime.current = now;
        router.push(SECTIONS[targetIndex].path);

        const resetTime = isMobile ? 150 : 300;
        setTimeout(() => {
          isNavigating.current = false;
        }, resetTime);
      }
    },
    [router, isMobile]
  );

  // Enhanced wheel/touch handling for mobile
  useEffect(() => {
    let accumulatedDelta = 0;
    let lastWheelTime = 0;
    const wheelThreshold = isMobile ? 100 : 150; // Lower threshold for mobile touch
    const timeThreshold = isMobile ? 150 : 300; // Faster response on mobile

    const handleWheel = (e: WheelEvent) => {
      // Skip if navigation is locked
      if (isNavigating.current) {
        e.preventDefault();
        return;
      }

      const now = Date.now();
      const timeDelta = now - lastWheelTime;

      // Reset accumulation if too much time has passed
      if (timeDelta > timeThreshold) {
        accumulatedDelta = 0;
      }

      accumulatedDelta += e.deltaY;
      lastWheelTime = now;

      // Navigate when threshold is reached
      if (Math.abs(accumulatedDelta) > wheelThreshold) {
        if (accumulatedDelta > 0) {
          navigateToSection("down");
        } else {
          navigateToSection("up");
        }
        accumulatedDelta = 0;
      }
    };

    // Enhanced touch handling for mobile
    let touchStartY = 0;
    let touchStartTime = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isNavigating.current) return;
      
      const touchEndY = e.changedTouches[0].clientY;
      const touchEndTime = Date.now();
      const deltaY = touchStartY - touchEndY;
      const deltaTime = touchEndTime - touchStartTime;
      
      // Swipe detection - more sensitive on mobile
      const minSwipeDistance = 50; // Reduced for mobile
      const maxSwipeTime = 500; // Increased time window
      
      if (Math.abs(deltaY) > minSwipeDistance && deltaTime < maxSwipeTime) {
        // Check if it's a fast swipe
        const velocity = Math.abs(deltaY) / deltaTime;
        
        if (velocity > 0.3) { // Velocity threshold
          if (deltaY > 0) {
            navigateToSection("down");
          } else {
            navigateToSection("up");
          }
        }
      }
    };

    // Enhanced keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isNavigating.current) return;
      
      switch (e.key) {
        case "ArrowDown":
        case "PageDown":
        case " ": // Space bar
          e.preventDefault();
          navigateToSection("down");
          break;
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          navigateToSection("up");
          break;
        case "Home":
          e.preventDefault();
          navigateDirectly("/");
          break;
        case "End":
          e.preventDefault();
          navigateDirectly("/skills");
          break;
      }
    };

    // Add event listeners with passive option for better performance
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    
    if (isMobile) {
      window.addEventListener("touchstart", handleTouchStart, { passive: true });
      window.addEventListener("touchend", handleTouchEnd, { passive: true });
    }

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      
      if (isMobile) {
        window.removeEventListener("touchstart", handleTouchStart);
        window.removeEventListener("touchend", handleTouchEnd);
      }
      
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [navigateToSection, navigateDirectly, isMobile]);

  return {
    navigateToSection,
    navigateDirectly,
    getCurrentSectionIndex,
    isNavigating: isNavigating.current,
    isMobile,
  };
};