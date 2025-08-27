import DOMPurify from 'dompurify';
import { z } from 'zod';

// XSS Protection - sanitize all user inputs
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  // Remove any HTML tags and potentially malicious scripts
  return DOMPurify.sanitize(input.trim(), { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  });
};

// Validation schemas using Zod
export const userRegistrationSchema = z.object({
  name: z.string()
    .min(1, 'Namn är obligatoriskt')
    .max(100, 'Namnet får vara max 100 tecken')
    .regex(/^[a-zA-ZåäöÅÄÖ\s-']+$/, 'Endast bokstäver, mellanslag, bindestreck och apostrofer tillåtna'),
  email: z.string()
    .min(1, 'E-post är obligatorisk')
    .email('Ogiltig e-postadress')
    .max(254, 'E-postadressen är för lång'),
  gdprConsent: z.boolean().refine(val => val === true, 'GDPR-samtycke krävs')
});

export const quoteRequestSchema = z.object({
  name: z.string()
    .min(1, 'Namn är obligatoriskt')
    .max(100, 'Namnet får vara max 100 tecken')
    .regex(/^[a-zA-ZåäöÅÄÖ\s-']+$/, 'Endast bokstäver, mellanslag, bindestreck och apostrofer tillåtna'),
  email: z.string()
    .min(1, 'E-post är obligatorisk')
    .email('Ogiltig e-postadress')
    .max(254, 'E-postadressen är för lång'),
  phone: z.string()
    .regex(/^[+\d\s-()]*$/, 'Endast siffror, mellanslag, bindestreck, parenteser och + tillåtna')
    .max(20, 'Telefonnumret är för långt')
    .optional()
    .or(z.literal('')),
  company: z.string()
    .max(200, 'Företagsnamnet är för långt')
    .optional()
    .or(z.literal('')),
  message: z.string()
    .max(2000, 'Meddelandet är för långt')
    .optional()
    .or(z.literal(''))
});

// Rate limiting helper (simple client-side implementation)
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the time window
    const recentAttempts = attempts.filter(timestamp => now - timestamp < this.windowMs);
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }

    // Add current attempt
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    
    return true;
  }

  getRemainingTime(key: string): number {
    const attempts = this.attempts.get(key) || [];
    if (attempts.length < this.maxAttempts) return 0;
    
    const oldestAttempt = Math.min(...attempts);
    const timeUntilReset = this.windowMs - (Date.now() - oldestAttempt);
    return Math.max(0, timeUntilReset);
  }
}

// Global rate limiter instances
export const formSubmissionLimiter = new RateLimiter(3, 300000); // 3 attempts per 5 minutes
export const apiRequestLimiter = new RateLimiter(10, 60000); // 10 requests per minute

// Validate and sanitize form data
export const validateAndSanitizeRegistration = (data: any) => {
  // First sanitize all string inputs
  const sanitized = {
    name: sanitizeInput(data.name || ''),
    email: sanitizeInput(data.email || '').toLowerCase(),
    gdprConsent: Boolean(data.gdprConsent)
  };

  // Then validate with schema
  const result = userRegistrationSchema.safeParse(sanitized);
  
  return {
    success: result.success,
    data: result.success ? result.data : null,
    errors: result.success ? [] : result.error.errors.map(e => e.message)
  };
};

export const validateAndSanitizeQuoteRequest = (data: any) => {
  // First sanitize all string inputs
  const sanitized = {
    name: sanitizeInput(data.name || ''),
    email: sanitizeInput(data.email || '').toLowerCase(),
    phone: sanitizeInput(data.phone || ''),
    company: sanitizeInput(data.company || ''),
    message: sanitizeInput(data.message || '')
  };

  // Then validate with schema
  const result = quoteRequestSchema.safeParse(sanitized);
  
  return {
    success: result.success,
    data: result.success ? result.data : null,
    errors: result.success ? [] : result.error.errors.map(e => e.message)
  };
};

// Security headers for API requests
export const getSecurityHeaders = (includeAuth: boolean = true) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block'
  };

  if (includeAuth) {
    headers['Authorization'] = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqd2Jodnpta211aW1mcWxpc2htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwODU0NzEsImV4cCI6MjA1ODY2MTQ3MX0.IoF29f8q4G1hOMmU7bP6QqV_rCWPtXcJi9d6Wx0WHEo`;
  }

  return headers;
};

// Error handling that doesn't expose sensitive information
export const handleSecureError = (error: any): string => {
  // Log the full error for debugging (in production this would go to secure logging)
  console.error('Security-filtered error:', error);
  
  // Return user-friendly messages that don't expose system internals
  if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
    return 'Nätverksfel. Kontrollera din internetanslutning och försök igen.';
  }
  
  if (error?.message?.includes('validation') || error?.message?.includes('schema')) {
    return 'Felaktiga data. Kontrollera dina inmatningar och försök igen.';
  }
  
  if (error?.message?.includes('rate limit')) {
    return 'För många försök. Vänta en stund och försök igen.';
  }
  
  // Generic fallback that doesn't reveal system details
  return 'Ett fel uppstod. Försök igen eller kontakta support om problemet kvarstår.';
};