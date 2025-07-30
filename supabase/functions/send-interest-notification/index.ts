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
    const { type, userInfo, timestamp }: InterestNotificationRequest = await req.json();

    console.log("Processing interest notification:", { type, userInfo: { ...userInfo, email: "[REDACTED]" } });

    // Validering
    if (!userInfo.name || !userInfo.email) {
      throw new Error("Namn och e-post krävs");
    }

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
      throw error;
    }

    console.log(`Interest notification sent for ${userInfo.email}`);

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
    console.error("Error in send-interest-notification function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);