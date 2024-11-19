// src/hooks/projects/usePlanetTransition.ts
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAnimation } from '@/contexts/AnimationContext';

interface PlanetTransitionOptions {
  duration?: number;
  delay?: number;
}

export const usePlanetTransition = (options: PlanetTransitionOptions = {}) => {
  const { duration = 800, delay = 100 } = options;
  const router = useRouter();
  const { setIsTransitioning } = useAnimation();
  const [selectedPlanetId, setSelectedPlanetId] = useState<string | null>(null);

  const transitionToPlanet = useCallback(async (planetId: string) => {
    setIsTransitioning(true);
    setSelectedPlanetId(planetId);

    // Add transition class to all other planets
    document.querySelectorAll('.planet').forEach(planet => {
      if (planet.id !== `planet-${planetId}`) {
        planet.classList.add('planet-fade-out');
      }
    });

    // Add transition class to selected planet
    const selectedPlanet = document.getElementById(`planet-${planetId}`);
    if (selectedPlanet) {
      selectedPlanet.classList.add('planet-transition');
    }

    // Wait for animations to complete
    await new Promise(resolve => setTimeout(resolve, duration));
    
    // Navigate to project detail
    router.push(`/project/${planetId}`);
    
    // Reset transition state after navigation
    setTimeout(() => {
      setIsTransitioning(false);
      setSelectedPlanetId(null);
    }, delay);
  }, [router, duration, delay, setIsTransitioning]);

  return {
    selectedPlanetId,
    transitionToPlanet
  };
};