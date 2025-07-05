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
    const { promptId, featured } = await request.json();
    
    if (!promptId || typeof featured !== 'boolean') {
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
    
    // Update the featured status by adding/removing the "featured" tag
    const prompt = data.prompts[promptIndex];
    if (!prompt.tags) {
      prompt.tags = [];
    }
    
    const featuredIndex = prompt.tags.indexOf('featured');
    
    if (featured && featuredIndex === -1) {
      // Add featured tag
      prompt.tags.push('featured');
    } else if (!featured && featuredIndex !== -1) {
      // Remove featured tag
      prompt.tags.splice(featuredIndex, 1);
    }
    
    // Save back to file
    await fs.writeFile(promptsPath, JSON.stringify(data, null, 2));
    
    return NextResponse.json({
      success: true,
      featured: featured
    });
    
  } catch (error) {
    console.error('Error updating featured status:', error);
    return NextResponse.json(
      { error: 'Failed to update featured status' },
      { status: 500 }
    );
  }
}