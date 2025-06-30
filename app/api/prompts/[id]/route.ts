import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const PROMPTS_FILE = path.join(process.cwd(), 'lib', 'database', 'prompts.json');

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid prompt data' },
        { status: 400 }
      );
    }

    // Read the current prompts
    const fileContent = await fs.readFile(PROMPTS_FILE, 'utf-8');
    const promptsData = JSON.parse(fileContent);

    // Find and update the prompt
    const promptIndex = promptsData.prompts.findIndex((p: { id: string }) => p.id === id);
    
    if (promptIndex === -1) {
      return NextResponse.json(
        { error: 'Prompt not found' },
        { status: 404 }
      );
    }

    // Update the prompt text and updatedAt timestamp
    promptsData.prompts[promptIndex].prompt = prompt;
    promptsData.prompts[promptIndex].updatedAt = new Date().toISOString();

    // Save the updated data back to the file
    await fs.writeFile(
      PROMPTS_FILE,
      JSON.stringify(promptsData, null, 2),
      'utf-8'
    );

    return NextResponse.json({ 
      success: true,
      prompt: promptsData.prompts[promptIndex]
    });

  } catch (error) {
    console.error('Error updating prompt:', error);
    return NextResponse.json(
      { error: 'Failed to update prompt' },
      { status: 500 }
    );
  }
}