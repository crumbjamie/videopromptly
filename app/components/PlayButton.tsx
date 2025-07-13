import { PlayIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils/cn';

interface PlayButtonProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-10 h-10', // Small for cards
  md: 'w-12 h-12', // Medium for variants
  lg: 'w-16 h-16'  // Large for main preview
};

const iconSizeClasses = {
  sm: 'w-5 h-5',
  md: 'w-6 h-6', 
  lg: 'w-8 h-8'
};

export default function PlayButton({ size = 'md', className }: PlayButtonProps) {
  return (
    <div className={cn(
      "rounded-full bg-white bg-opacity-20 flex items-center justify-center transition-transform duration-200 hover:scale-110",
      sizeClasses[size],
      className
    )}>
      <PlayIcon className={cn(
        "text-white ml-1",
        iconSizeClasses[size]
      )} />
    </div>
  );
}