'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface FavoritesButtonProps {
  specialistId: string;
  className?: string;
}

export default function FavoritesButton({ specialistId, className = '' }: FavoritesButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Load favorites from localStorage
  useEffect(() => {
    const favorites = localStorage.getItem('yodo_favorites');
    if (favorites) {
      const favoritesArray = JSON.parse(favorites);
      setIsFavorite(favoritesArray.includes(specialistId));
    }
  }, [specialistId]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const favorites = localStorage.getItem('yodo_favorites');
    let favoritesArray = favorites ? JSON.parse(favorites) : [];
    
    if (isFavorite) {
      // Remove from favorites
      favoritesArray = favoritesArray.filter((id: string) => id !== specialistId);
    } else {
      // Add to favorites
      favoritesArray.push(specialistId);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
    }
    
    localStorage.setItem('yodo_favorites', JSON.stringify(favoritesArray));
    setIsFavorite(!isFavorite);

    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('favoritesChanged', { 
      detail: { specialistId, isFavorite: !isFavorite } 
    }));
  };

  return (
    <motion.button
      onClick={toggleFavorite}
      className={`
        relative p-2 rounded-full transition-all duration-300
        ${isFavorite 
          ? 'bg-red-50 text-red-500 hover:bg-red-100' 
          : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-red-400'
        }
        ${className}
      `}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
    >
      <Heart 
        className={`w-5 h-5 transition-all ${isFavorite ? 'fill-current' : ''}`} 
      />
      
      {/* Animated particles on favorite */}
      {isAnimating && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 1, scale: 0 }}
              animate={{ 
                opacity: 0, 
                scale: 2,
                x: Math.cos((i * Math.PI * 2) / 6) * 20,
                y: Math.sin((i * Math.PI * 2) / 6) * 20,
              }}
              transition={{ duration: 0.6 }}
            >
              <Heart className="w-3 h-3 fill-red-400 text-red-400" />
            </motion.div>
          ))}
        </>
      )}
    </motion.button>
  );
}



