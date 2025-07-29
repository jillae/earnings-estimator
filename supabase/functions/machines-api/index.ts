import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DatabaseMachine {
  id: string
  name: string
  price_eur: number
  is_premium: boolean
  uses_credits: boolean
  credit_min: number
  credit_max: number
  flatrate_amount: number
  default_customer_price: number
  default_leasing_period: number
  leasing_min: number
  leasing_max: number
  credits_per_treatment: number
  description: string | null
  category: string
  is_active: boolean
  leasing_tariffs: Record<string, number>
  created_at: string
}

interface MachineRequest {
  name: string
  price_eur: number
  is_premium?: boolean
  uses_credits?: boolean
  credit_min?: number
  credit_max?: number
  flatrate_amount?: number
  default_customer_price?: number
  default_leasing_period?: number
  leasing_min?: number
  leasing_max?: number
  credits_per_treatment?: number
  description?: string
  category?: string
  is_active?: boolean
  leasing_tariffs?: Record<string, number>
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client with service role key for admin access
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url)
    const pathParts = url.pathname.split('/').filter(Boolean)
    const machineId = pathParts[pathParts.length - 1]

    console.log(`API Request: ${req.method} ${url.pathname}`)

    switch (req.method) {
      case 'GET': {
        if (machineId && machineId !== 'machines-api') {
          // Get specific machine
          const { data, error } = await supabase
            .from('machines')
            .select('*')
            .eq('id', machineId)
            .single()

          if (error) {
            console.error('Error fetching machine:', error)
            return new Response(
              JSON.stringify({ error: 'Machine not found' }),
              { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }

          return new Response(
            JSON.stringify(data),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        } else {
          // Get all machines
          const { data, error } = await supabase
            .from('machines')
            .select('*')
            .order('name')

          if (error) {
            console.error('Error fetching machines:', error)
            return new Response(
              JSON.stringify({ error: 'Failed to fetch machines' }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }

          return new Response(
            JSON.stringify(data || []),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      }

      case 'POST': {
        const body: MachineRequest = await req.json()
        
        // Validate required fields
        if (!body.name || !body.price_eur) {
          return new Response(
            JSON.stringify({ error: 'Name and price_eur are required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Validate business rules
        if (body.credit_min && body.credit_max && body.credit_min >= body.credit_max) {
          return new Response(
            JSON.stringify({ error: 'credit_min must be less than credit_max' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const { data, error } = await supabase
          .from('machines')
          .insert([{
            name: body.name,
            price_eur: body.price_eur,
            is_premium: body.is_premium ?? false,
            uses_credits: body.uses_credits ?? true,
            credit_min: body.credit_min ?? 0,
            credit_max: body.credit_max ?? 1000,
            flatrate_amount: body.flatrate_amount ?? 0,
            default_customer_price: body.default_customer_price ?? 2500,
            default_leasing_period: body.default_leasing_period ?? 60,
            leasing_min: body.leasing_min ?? 24,
            leasing_max: body.leasing_max ?? 120,
            credits_per_treatment: body.credits_per_treatment ?? 1,
            description: body.description,
            category: body.category ?? 'treatment',
            is_active: body.is_active ?? true,
            leasing_tariffs: body.leasing_tariffs ?? {}
          }])
          .select()
          .single()

        if (error) {
          console.error('Error creating machine:', error)
          return new Response(
            JSON.stringify({ error: 'Failed to create machine' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        console.log('Machine created successfully:', data.name)
        return new Response(
          JSON.stringify(data),
          { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'PUT': {
        if (!machineId || machineId === 'machines-api') {
          return new Response(
            JSON.stringify({ error: 'Machine ID is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const body: Partial<MachineRequest> = await req.json()

        // Validate business rules if provided
        if (body.credit_min && body.credit_max && body.credit_min >= body.credit_max) {
          return new Response(
            JSON.stringify({ error: 'credit_min must be less than credit_max' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const { data, error } = await supabase
          .from('machines')
          .update(body)
          .eq('id', machineId)
          .select()
          .single()

        if (error) {
          console.error('Error updating machine:', error)
          return new Response(
            JSON.stringify({ error: 'Failed to update machine' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        console.log('Machine updated successfully:', data.name)
        return new Response(
          JSON.stringify(data),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'DELETE': {
        if (!machineId || machineId === 'machines-api') {
          return new Response(
            JSON.stringify({ error: 'Machine ID is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const { error } = await supabase
          .from('machines')
          .delete()
          .eq('id', machineId)

        if (error) {
          console.error('Error deleting machine:', error)
          return new Response(
            JSON.stringify({ error: 'Failed to delete machine' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        console.log('Machine deleted successfully:', machineId)
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('API Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})