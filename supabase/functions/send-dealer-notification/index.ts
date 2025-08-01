import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import React from "npm:react@18.3.1";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import { DealerNotificationEmail } from "./_templates/dealer-notification.tsx";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  type: 'new_session' | 'session_update';
  userData: {
    name: string;
    email: string;
    sessionId: string;
  };
  sessionId: string;
  action?: string;
  data?: any;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, userData, sessionId, action, data }: NotificationRequest = await req.json();

    // Förbered e-postinnehåll baserat på typ av notifikation
    let subject = "";
    let emailData = {};

    if (type === 'new_session') {
      subject = `Ny kalkylatorsession startad - ${userData.name}`;
      emailData = {
        type: 'new_session',
        userName: userData.name,
        userEmail: userData.email,
        sessionId,
        timestamp: new Date().toISOString(),
      };
    } else if (type === 'session_update') {
      subject = `Kalkylatorsession uppdaterad - ${userData.name}`;
      emailData = {
        type: 'session_update',
        userName: userData.name,
        userEmail: userData.email,
        sessionId,
        action,
        data,
        timestamp: new Date().toISOString(),
      };
    }

    // Rendera e-postmallen
    const html = await renderAsync(
      React.createElement(DealerNotificationEmail, emailData)
    );

    // Skicka e-post
    const { error } = await resend.emails.send({
      from: "Kalkylator <onboarding@resend.dev>",
      to: ["mailtillgille@gmail.com"],
      subject,
      html,
    });

    if (error) {
      console.error("Error sending email:", error);
      throw error;
    }

    console.log(`Dealer notification logged for ${type}: ${sessionId}`);

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in send-dealer-notification function:", error);
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