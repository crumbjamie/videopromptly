import { NextResponse } from 'next/server';
import { getAllPrompts, getPromptsByCategory, getPromptsByTag } from '@/lib/database';

export async function GET(request: Request) {
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