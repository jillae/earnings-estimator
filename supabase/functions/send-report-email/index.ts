import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import React from "npm:react@18.3.1";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import { ReportEmail } from "./_templates/report-email.tsx";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReportEmailRequest {
  reportData: {
    machineName: string;
    monthlyCost: number;
    monthlyRevenue: number;
    monthlyNet: number;
    yearlyNet: number;
    roi: number;
    paybackMonths: number;
    leasingCost: number;
    insurance: number;
    slaLevel: string;
    treatmentsPerDay: number;
    customerPrice: number;
  };
  recipientEmail: string;
  format: string;
  customNotes?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reportData, recipientEmail, format, customNotes }: ReportEmailRequest = await req.json();

    const html = await renderAsync(
      React.createElement(ReportEmail, {
        reportData,
        format,
        customNotes,
        timestamp: new Date().toISOString(),
      })
    );

    const { error } = await resend.emails.send({
      from: "Finansiell Rapport <onboarding@resend.dev>",
      to: [recipientEmail],
      subject: `Finansiell analysrapport - ${reportData.machineName}`,
      html,
    });

    if (error) {
      console.error("Error sending report email:", error);
      throw error;
    }

    console.log(`Report email sent to ${recipientEmail} for machine ${reportData.machineName}`);

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in send-report-email function:", error);
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