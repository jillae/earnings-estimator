import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import React from "npm:react@18.3.1";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import { InterestNotificationEmail } from "./_templates/interest-notification.tsx";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation and sanitization
const sanitizeString = (input: any): string => {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>&"']/g, ''); // Basic XSS protection
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

const isValidName = (name: string): boolean => {
  const nameRegex = /^[a-zA-ZåäöÅÄÖ\s-']{1,100}$/;
  return nameRegex.test(name);
};

const validateUserInfo = (userInfo: any) => {
  if (!userInfo || typeof userInfo !== 'object') {
    throw new Error('Ogiltig användarinformation');
  }

  const name = sanitizeString(userInfo.name);
  const email = sanitizeString(userInfo.email);
  const company = sanitizeString(userInfo.company || '');
  const message = sanitizeString(userInfo.message || '');

  if (!name || !isValidName(name)) {
    throw new Error('Ogiltigt namn');
  }

  if (!email || !isValidEmail(email)) {
    throw new Error('Ogiltig e-postadress');
  }

  if (company && company.length > 200) {
    throw new Error('Företagsnamn för långt');
  }

  if (message && message.length > 2000) {
    throw new Error('Meddelande för långt');
  }

  return { name, email, company, message };
};

// Rate limiting
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 3; // requests per 5 minutes for interest notifications
const RATE_WINDOW = 5 * 60 * 1000; // 5 minutes

const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const record = requestCounts.get(ip) || { count: 0, resetTime: now + RATE_WINDOW };
  
  if (now > record.resetTime) {
    record.count = 0;
    record.resetTime = now + RATE_WINDOW;
  }
  
  record.count++;
  requestCounts.set(ip, record);
  
  return record.count <= RATE_LIMIT;
};

interface InterestNotificationRequest {
  type: 'interest_signup';
  userInfo: {
    name: string;
    email: string;
    company?: string;
    message?: string;
  };
  timestamp: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting check
    const clientIP = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    if (!checkRateLimit(clientIP)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "För många försök. Försök igen om 5 minuter." 
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const requestBody = await req.json();
    const { type, userInfo: rawUserInfo, timestamp } = requestBody;

    console.log("Processing interest notification:", { type, timestamp });

    // Validate type
    if (type !== 'interest_signup') {
      throw new Error('Ogiltig typ av notification');
    }

    // Validate and sanitize user info
    const userInfo = validateUserInfo(rawUserInfo);

    // Rendera email template
    const html = await renderAsync(
      React.createElement(InterestNotificationEmail, {
        userInfo,
        timestamp,
      })
    );

    // Skicka notifiering till team
    const { error } = await resend.emails.send({
      from: "KlinikOptimering <onboarding@resend.dev>",
      to: ["mailtillgille@gmail.com"], // Team email
      subject: `🎯 Ny intresseanmälan - ${userInfo.name}`,
      html,
    });

    if (error) {
      console.error("Error sending interest notification:", error);
      throw new Error("E-post kunde inte skickas");
    }

    console.log(`Interest notification sent successfully`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Intresseanmälan mottagen" 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-interest-notification function:", error.message);
    
    // Return user-friendly error messages
    const userMessage = error.message.includes('Rate limit') || error.message.includes('För många') ? error.message :
                       error.message.includes('Ogiltig') ? error.message :
                       'Ett fel uppstod. Försök igen eller kontakta support.';
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: userMessage 
      }),
      {
        status: error.message.includes('Rate limit') || error.message.includes('För många') ? 429 : 400,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);