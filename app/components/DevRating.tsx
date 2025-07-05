'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import toast from 'react-hot-toast';

interface DevRatingProps {
  promptId: string;
  currentRating: number;
  isFeatured: boolean;
}

export default function DevRating({ promptId, currentRating, isFeatured }: DevRatingProps) {
  const [rating, setRating] = useState(currentRating);
  const [featured, setFeatured] = useState(isFeatured);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleRatingChange = async (newRating: number) => {
    if (isUpdating) return;
    
    // Update UI immediately for better UX
    setRating(newRating);
    setIsUpdating(true);
    
    try {
      const response = await fetch('/api/prompts/rate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          promptId: promptId,
          rating: newRating,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        // Update with the actual server rating if different
        if (data.newRating !== newRating) {
          setRating(data.newRating);
        }
        toast.success(`Rating updated to ${newRating} stars`);
      } else {
        // Revert on error
        setRating(currentRating);
        toast.error('Failed to update rating');
      }
    } catch (error) {
      console.error('Error updating rating:', error);
      // Revert on error
      setRating(currentRating);
      toast.error('Failed to update rating');
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleFeaturedToggle = async () => {
    if (isUpdating) return;
    
    const newFeatured = !featured;
    setFeatured(newFeatured);
    setIsUpdating(true);
    
    try {
      const response = await fetch('/api/prompts/featured', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          promptId: promptId,
          featured: newFeatured,
        }),
      });
      
      if (response.ok) {
        toast.success(newFeatured ? 'Added to featured' : 'Removed from featured');
      } else {
        // Revert on error
        setFeatured(!newFeatured);
        toast.error('Failed to update featured status');
      }
    } catch (error) {
      console.error('Error updating featured status:', error);
      // Revert on error
      setFeatured(!newFeatured);
      toast.error('Failed to update featured status');
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Only show on localhost
  if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
    return null;
  }
  
  return (
    <div className="mt-3 p-3 bg-stone-900 border border-stone-800 rounded-lg">
      <div className="text-xs text-stone-500 mb-2 font-mono">DEV: Rate this prompt</div>
      <div className="flex gap-1 justify-center mb-3">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            onClick={() => handleRatingChange(value)}
            disabled={isUpdating}
            className="p-1 hover:scale-110 transition-transform disabled:opacity-50"
            aria-label={`Rate ${value} stars`}
          >
            <Star 
              className={`
                w-4 h-4 cursor-pointer
                ${value <= rating 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'fill-none text-stone-400'
                }
              `}
            />
          </button>
        ))}
      </div>
      
      <div className="flex items-center justify-center">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={featured}
            onChange={handleFeaturedToggle}
            disabled={isUpdating}
            className="w-4 h-4 rounded border-stone-600 bg-stone-800 text-yellow-400 focus:ring-yellow-400 focus:ring-offset-0"
          />
          <span className="text-xs text-stone-400">Featured</span>
        </label>
      </div>
    </div>
  );
}