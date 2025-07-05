import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  // Only allow from localhost
  const host = request.headers.get('host') || '';
  if (!host.includes('localhost') && !host.includes('127.0.0.1')) {
    return NextResponse.json(
      { error: 'Only available on localhost' },
      { status: 403 }
    );
  }
  
  try {
    const { promptId, rating } = await request.json();
    
    if (!promptId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }
    
    // Read the prompts file
    const promptsPath = path.join(process.cwd(), 'lib', 'database', 'prompts.json');
    const fileContent = await fs.readFile(promptsPath, 'utf-8');
    const data = JSON.parse(fileContent);
    
    // Find the prompt
    const promptIndex = data.prompts.findIndex((p: { id: string }) => p.id === promptId);
    if (promptIndex === -1) {
      return NextResponse.json(
        { error: 'Prompt not found' },
        { status: 404 }
      );
    }
    
    // Update the rating
    const prompt = data.prompts[promptIndex];
    
    // For development, just set the rating directly without averaging
    prompt.rating = rating;
    prompt.ratingCount = (prompt.ratingCount || 0) + 1;
    
    // Save back to file
    await fs.writeFile(promptsPath, JSON.stringify(data, null, 2));
    
    return NextResponse.json({
      success: true,
      newRating: rating, // Return the exact rating that was set
      newCount: prompt.ratingCount
    });
    
  } catch (error) {
    console.error('Error updating rating:', error);
    return NextResponse.json(
      { error: 'Failed to update rating' },
      { status: 500 }
    );
  }
}