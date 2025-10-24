'use client';

import { useState, useEffect } from 'react';
import LoadingScreen from './LoadingScreen';
import PuzzleCards from './PuzzleCards';

export default function AppWithLoading() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular tiempo de carga
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading && <LoadingScreen />}
      {!isLoading && <PuzzleCards />}
    </>
  );
}
