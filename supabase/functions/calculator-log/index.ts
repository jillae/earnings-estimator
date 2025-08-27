import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation and sanitization
const sanitizeString = (input: any): string => {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>&"']/g, ''); // Basic XSS protection
};

const validateLogData = (data: any) => {
  if (!data || typeof data !== 'object') {
    throw new Error('Ogiltig data');
  }

  const action = sanitizeString(data.action);
  const sessionId = sanitizeString(data.sessionId);
  const timestamp = sanitizeString(data.timestamp);

  if (!action || action.length > 100) {
    throw new Error('Ogiltig action');
  }

  if (!sessionId || sessionId.length > 200) {
    throw new Error('Ogiltigt session ID');
  }

  if (!timestamp) {
    throw new Error('Ogiltig timestamp');
  }

  // Validate userData if present
  if (data.userData) {
    const userData = data.userData;
    if (userData.name && (typeof userData.name !== 'string' || userData.name.length > 100)) {
      throw new Error('Ogiltigt användarnamn');
    }
    if (userData.email && (typeof userData.email !== 'string' || userData.email.length > 254)) {
      throw new Error('Ogiltig e-post');
    }
  }

  return {
    action,
    sessionId,
    timestamp,
    userData: data.userData,
    data: data.data
  };
};

// Rate limiting
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 20; // requests per minute for logging
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

interface LogRequest {
  action: string;
  sessionId: string;
  userData?: {
    name: string;
    email: string;
    sessionId: string;
  };
  data?: any;
  timestamp: string;
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
        JSON.stringify({ error: "För många loggförsök" }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const supabase = createClient(
      "https://ejwbhvzmkmuimfqlishm.supabase.co",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const requestBody = await req.json();
    const validatedData = validateLogData(requestBody);

    // Logga till databas (utan PII-data)
    const { error: dbError } = await supabase
      .from("calculator_logs")
      .insert({
        session_id: validatedData.sessionId,
        action: validatedData.action,
        // Redact PII: do not store names or emails in logs
        user_name: null,
        user_email: null,
        data: validatedData.data || null,
        timestamp: new Date(validatedData.timestamp).toISOString(),
      });

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error("Databasfel");
    }

    console.log(`Calculator log saved: ${validatedData.action} for session ${validatedData.sessionId}`);

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in calculator-log function:", error.message);
    
    const userMessage = error.message.includes('Rate limit') || error.message.includes('För många') ? error.message :
                       error.message.includes('Ogiltig') ? error.message :
                       'Loggningsfel';
    
    return new Response(
      JSON.stringify({ error: userMessage }),
      {
        status: error.message.includes('Rate limit') || error.message.includes('För många') ? 429 : 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);