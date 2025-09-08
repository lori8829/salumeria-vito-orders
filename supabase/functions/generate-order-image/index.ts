import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { orderItems, orderDate } = await req.json()

    // Create a text prompt describing the order
    const itemsList = orderItems.map((item: any) => `${item.quantity}x ${item.dish_name}`).join(', ')
    const orderSummary = `Ordine Salumeria Vito del ${orderDate}: ${itemsList}. Elegante ricevuta di ordine con logo decorativo della salumeria italiana, stile tradizionale con colori rosso e bianco, layout pulito e professionale.`

    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'))

    const image = await hf.textToImage({
      inputs: orderSummary,
      model: 'black-forest-labs/FLUX.1-schnell',
    })

    const arrayBuffer = await image.arrayBuffer()
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))

    return new Response(
      JSON.stringify({ 
        image: `data:image/png;base64,${base64}`,
        orderSummary: itemsList,
        date: orderDate
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error generating order image:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate order image', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})