import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const imagePath = searchParams.get('image');
    
    if (!imagePath) {
      return NextResponse.json({ error: 'Image path is required' }, { status: 400 });
    }

    // Security: Strict path validation to prevent traversal attacks
    const normalizedPath = path.normalize(imagePath);
    
    // Check for path traversal attempts
    if (normalizedPath.includes('..') || !normalizedPath.startsWith('/thumbnails/')) {
      return NextResponse.json({ error: 'Invalid image path' }, { status: 400 });
    }
    
    // Additional validation: only allow specific image extensions
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const fileExtension = path.extname(normalizedPath).toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    const fullPath = path.join(process.cwd(), 'public', normalizedPath);
    
    // Final security check: ensure resolved path is within public/thumbnails
    const resolvedPath = path.resolve(fullPath);
    const expectedBasePath = path.resolve(path.join(process.cwd(), 'public', 'thumbnails'));
    if (!resolvedPath.startsWith(expectedBasePath)) {
      return NextResponse.json({ error: 'Invalid image path' }, { status: 400 });
    }
    
    try {
      await fs.access(fullPath);
    } catch {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Read the image
    const imageBuffer = await fs.readFile(fullPath);
    
    // Get image metadata
    const metadata = await sharp(imageBuffer).metadata();
    const { width = 0, height = 0 } = metadata;
    
    // If already square or portrait, return original
    if (width <= height) {
      const headers = new Headers();
      headers.set('Content-Type', `image/${metadata.format || 'jpeg'}`);
      headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      return new NextResponse(imageBuffer, { headers });
    }
    
    // For landscape images, create square by cropping to center
    const size = Math.min(width, height);
    const squareBuffer = await sharp(imageBuffer)
      .extract({
        left: Math.floor((width - size) / 2),
        top: 0,
        width: size,
        height: size
      })
      .resize(1024, 1024, {
        fit: 'cover',
        position: 'center'
      })
      .toBuffer();
    
    const headers = new Headers();
    headers.set('Content-Type', `image/${metadata.format || 'jpeg'}`);
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    
    return new NextResponse(squareBuffer, { headers });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json({ error: 'Failed to process image' }, { status: 500 });
  }
}