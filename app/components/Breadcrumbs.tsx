import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils/cn';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn("flex items-center space-x-2 text-sm", className)}
    >
      <ol className="flex items-center space-x-2">
        {/* Home link */}
        <li>
          <Link 
            href="/" 
            className="flex items-center text-stone-400 hover:text-white transition-colors"
            aria-label="Home"
          >
            <HomeIcon className="w-4 h-4" />
          </Link>
        </li>

        {items.map((item, index) => (
          <li key={index} className="flex items-center space-x-2">
            <ChevronRightIcon className="w-4 h-4 text-stone-500" />
            
            {item.current || !item.href ? (
              <span 
                className="text-white font-medium"
                aria-current={item.current ? "page" : undefined}
              >
                {item.label}
              </span>
            ) : (
              <Link 
                href={item.href}
                className="text-stone-400 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Utility function to generate breadcrumbs for different page types
export function generateBreadcrumbs(type: string, data?: { 
  name?: string; 
  title?: string; 
  category?: string; 
}): BreadcrumbItem[] {
  switch (type) {
    case 'video-prompt':
      return [
        { label: 'Video Prompts', href: '/' },
        { label: data?.category || 'Category', href: `/category/${data?.category?.toLowerCase().replace(/\s+/g, '-')}` },
        { label: data?.title || 'Video Prompt', current: true }
      ];
    
    case 'category':
      return [
        { label: 'Video Prompts', href: '/' },
        { label: 'Categories', href: '/categories' },
        { label: data?.name || 'Category', current: true }
      ];
    
    case 'tag':
      return [
        { label: 'Video Prompts', href: '/' },
        { label: 'Tags', href: '/tags' },
        { label: `#${data?.name || 'Tag'}`, current: true }
      ];
    
    case 'blog-post':
      return [
        { label: 'Video Prompts', href: '/' },
        { label: 'Blog', href: '/blog' },
        { label: data?.title || 'Post', current: true }
      ];
    
    case 'about':
      return [
        { label: 'Video Prompts', href: '/' },
        { label: 'About', current: true }
      ];
    
    case 'categories':
      return [
        { label: 'Video Prompts', href: '/' },
        { label: 'Categories', current: true }
      ];
    
    case 'tags':
      return [
        { label: 'Video Prompts', href: '/' },
        { label: 'Tags', current: true }
      ];
    
    case 'blog':
      return [
        { label: 'Video Prompts', href: '/' },
        { label: 'Blog', current: true }
      ];
    
    default:
      return [];
  }
}