import PromptCard from './PromptCard';
import { ImagePrompt } from '@/lib/types';

interface PromptGridProps {
  prompts: ImagePrompt[];
  loading: boolean;
}

export default function PromptGrid({ prompts, loading }: PromptGridProps) {
  if (loading) {
    return (
      <div role="status" aria-busy="true" aria-label="Loading prompts">
        <span className="sr-only">Loading prompts...</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-stone-800 rounded-lg h-64"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (prompts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-stone-400 text-lg">
          No prompts found. Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {prompts.map((prompt) => (
        <PromptCard key={prompt.id} prompt={prompt} />
      ))}
    </div>
  );
}