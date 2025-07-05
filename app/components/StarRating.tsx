'use client';

import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function StarRating({ 
  rating, 
  size = 'md'
}: StarRatingProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };
  
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((value) => {
          const filled = value <= rating;
          
          return (
            <div key={value} className="p-0.5">
              <Star 
                className={`
                  ${sizes[size]}
                  ${filled 
                    ? 'fill-stone-500 text-stone-500' 
                    : 'fill-none text-stone-500'
                  }
                  transition-all duration-200
                `}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}