import { NextRequest, NextResponse } from 'next/server';
import { getAllPrompts, getPromptsByCategory, getPromptsByTag } from '@/lib/database';
import { checkRateLimit } from '@/lib/middleware/rate-limit';

export async function GET(request: NextRequest) {
  // Check rate limit
  const { allowed } = checkRateLimit(request);
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Remaining': '0',
          'Retry-After': '60'
        }
      }
    );
  }
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const tag = searchParams.get('tag');

  try {
    let prompts;
    
    if (category) {
      prompts = await getPromptsByCategory(category);
    } else if (tag) {
      prompts = await getPromptsByTag(tag);
    } else {
      prompts = await getAllPrompts();
    }

    return NextResponse.json({ prompts });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch prompts' },
      { status: 500 }
    );
  }
}