import { NextRequest } from 'next/server';

// Simple in-memory rate limiter
// For production, use Redis or Vercel KV
const rateLimit = new Map<string, { count: number; resetTime: number }>();

// Different limits for different endpoints
const RATE_LIMITS = {
  '/api/prompts': parseInt(process.env.API_PROMPTS_LIMIT || '10'), // Strict limit for full data access
  '/api/search': parseInt(process.env.API_SEARCH_LIMIT || '30'),   // More lenient for search
  default: parseInt(process.env.MAX_REQUESTS_PER_MINUTE || '20')   // General API limit
};

const WINDOW_MS = 60 * 1000; // 1 minute

export function checkRateLimit(request: NextRequest): { allowed: boolean; remaining: number } {
  const identifier = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'anonymous';
  
  const pathname = new URL(request.url).pathname;
  const limit = RATE_LIMITS[pathname as keyof typeof RATE_LIMITS] || RATE_LIMITS.default;
  
  const now = Date.now();
  const key = `${identifier}:${pathname}`;
  const userLimit = rateLimit.get(key);
  
  if (!userLimit || userLimit.resetTime < now) {
    // Create new window
    rateLimit.set(key, {
      count: 1,
      resetTime: now + WINDOW_MS
    });
    return { allowed: true, remaining: limit - 1 };
  }
  
  if (userLimit.count >= limit) {
    return { allowed: false, remaining: 0 };
  }
  
  userLimit.count++;
  return { allowed: true, remaining: limit - userLimit.count };
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