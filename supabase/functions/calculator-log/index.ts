import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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
    const supabase = createClient(
      "https://ejwbhvzmkmuimfqlishm.supabase.co",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { action, sessionId, userData, data, timestamp }: LogRequest = await req.json();

    // Logga till databas
    const { error: dbError } = await supabase
      .from("calculator_logs")
      .insert({
        session_id: sessionId,
        action,
        user_name: userData?.name || null,
        user_email: userData?.email || null,
        data: data || null,
        timestamp: new Date(timestamp).toISOString(),
      });

    if (dbError) {
      console.error("Database error:", dbError);
      throw dbError;
    }

    // För session_start och betydande interaktioner, skicka e-postnotifikation
    if (action === 'session_start' || action === 'significant_interaction') {
      // TODO: Implementera e-postnotifikation här när Resend är konfigurerat
      console.log(`E-postnotifikation skulle skickas för ${action}:`, { sessionId, userData });
    }

    console.log(`Calculator log saved: ${action} for session ${sessionId}`);

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in calculator-log function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);