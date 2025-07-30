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
    const { userInfo, configuration }: QuoteRequest = await req.json();

    const html = await renderAsync(
      React.createElement(QuoteRequestEmail, {
        userInfo,
        configuration,
        timestamp: new Date().toISOString(),
      })
    );

    const { error } = await resend.emails.send({
      from: "Kalkylator Offertförfrågan <notifications@lovableproject.com>",
      to: ["gilbert@archacademy.se"],
      subject: `Offertförfrågan från ${userInfo.name} - ${configuration.selectedMachine}`,
      html,
    });

    if (error) {
      console.error("Error sending quote request:", error);
      throw error;
    }

    console.log(`Quote request sent from ${userInfo.email}`);

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in send-quote-request function:", error);
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