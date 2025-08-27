import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import React from "npm:react@18.3.1";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import { QuoteRequestEmail } from "./_templates/quote-request.tsx";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation functions
const sanitizeString = (input: any): string => {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>&"']/g, ''); // Basic XSS protection
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidName = (name: string): boolean => {
  const nameRegex = /^[a-zA-ZåäöÅÄÖ\s-']{1,100}$/;
  return nameRegex.test(name);
};

const isValidPhone = (phone: string): boolean => {
  if (!phone) return true; // Optional field
  const phoneRegex = /^[+\d\s-()]{0,20}$/;
  return phoneRegex.test(phone);
};

const validateUserInfo = (userInfo: any) => {
  if (!userInfo || typeof userInfo !== 'object') {
    throw new Error('Ogiltig användarinformation');
  }

  const name = sanitizeString(userInfo.name);
  const email = sanitizeString(userInfo.email);
  const phone = sanitizeString(userInfo.phone || '');
  const company = sanitizeString(userInfo.company || '');

  if (!name || !isValidName(name)) {
    throw new Error('Ogiltigt namn');
  }

  if (!email || !isValidEmail(email)) {
    throw new Error('Ogiltig e-postadress');
  }

  if (phone && !isValidPhone(phone)) {
    throw new Error('Ogiltigt telefonnummer');
  }

  if (company && company.length > 200) {
    throw new Error('Företagsnamn för långt');
  }

  return { name, email, phone, company };
};

const validateConfiguration = (config: any) => {
  if (!config || typeof config !== 'object') {
    throw new Error('Ogiltig konfiguration');
  }

  // Validate numeric fields
  const numericFields = ['treatmentsPerDay', 'customerPrice', 'netPerMonth', 'netPerYear'];
  for (const field of numericFields) {
    if (config[field] !== undefined && (!Number.isFinite(config[field]) || config[field] < 0)) {
      throw new Error(`Ogiltigt värde för ${field}`);
    }
  }

  return config;
};

// Rate limiting (simple in-memory store for demo)
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute

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

interface QuoteRequest {
  userInfo: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
  };
  configuration: {
    selectedMachine: string;
    clinicSize: string;
    paymentOption: string;
    leasingPeriod?: string;
    insurance?: string;
    slaLevel: string;
    driftpaket: string;
    treatmentsPerDay: number;
    customerPrice: number;
    leasingCost?: number;
    netPerMonth: number;
    netPerYear: number;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting check
    const clientIP = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    if (!checkRateLimit(clientIP)) {
      return new Response(
        JSON.stringify({ error: "För många försök. Försök igen om en minut." }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const requestBody = await req.json();
    const { userInfo: rawUserInfo, configuration: rawConfiguration } = requestBody;

    console.log("Processing quote request from:", rawUserInfo?.email ? "[REDACTED]" : "unknown");

    // Validate and sanitize inputs
    const userInfo = validateUserInfo(rawUserInfo);
    const configuration = validateConfiguration(rawConfiguration);

    const html = await renderAsync(
      React.createElement(QuoteRequestEmail, {
        userInfo,
        configuration,
        timestamp: new Date().toISOString(),
      })
    );

    const { error } = await resend.emails.send({
      from: "Kalkylator <onboarding@resend.dev>",
      to: ["mailtillgille@gmail.com"],
      subject: `Offertförfrågan från ${userInfo.name} - ${configuration.selectedMachine}`,
      html,
    });

    if (error) {
      console.error("Error sending quote request:", error);
      throw new Error("E-post kunde inte skickas");
    }

    console.log(`Quote request sent successfully`);

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in send-quote-request function:", error.message);
    
    // Return user-friendly error messages
    const userMessage = error.message.includes('Rate limit') ? error.message :
                       error.message.includes('Ogiltig') ? error.message :
                       'Ett fel uppstod vid skickandet. Försök igen.';
    
    return new Response(
      JSON.stringify({ error: userMessage }),
      {
        status: error.message.includes('Rate limit') ? 429 : 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);