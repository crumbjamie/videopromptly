import { NextRequest } from 'next/server';

// Simple in-memory rate limiter
// For production, use Redis or Vercel KV
const rateLimit = new Map<string, { count: number; resetTime: number }>();

const MAX_REQUESTS_PER_MINUTE = parseInt(process.env.MAX_REQUESTS_PER_MINUTE || '60');
const WINDOW_MS = 60 * 1000; // 1 minute

export function checkRateLimit(request: NextRequest): { allowed: boolean; remaining: number } {
  const identifier = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'anonymous';
  
  const now = Date.now();
  const userLimit = rateLimit.get(identifier);
  
  if (!userLimit || userLimit.resetTime < now) {
    // Create new window
    rateLimit.set(identifier, {
      count: 1,
      resetTime: now + WINDOW_MS
    });
    return { allowed: true, remaining: MAX_REQUESTS_PER_MINUTE - 1 };
  }
  
  if (userLimit.count >= MAX_REQUESTS_PER_MINUTE) {
    return { allowed: false, remaining: 0 };
  }
  
  userLimit.count++;
  return { allowed: true, remaining: MAX_REQUESTS_PER_MINUTE - userLimit.count };
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimit.entries()) {
    if (value.resetTime < now) {
      rateLimit.delete(key);
    }
  }
}, WINDOW_MS);