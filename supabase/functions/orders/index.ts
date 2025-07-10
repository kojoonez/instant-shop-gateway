import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Set auth header from request
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      supabase.auth.setAuth(authHeader.replace('Bearer ', ''));
    }

    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const orderId = pathSegments[pathSegments.length - 1];

    switch (req.method) {
      case 'GET':
        if (orderId && orderId !== 'orders') {
          // Get single order with items
          const { data: order, error } = await supabase
            .from('orders')
            .select(`
              *,
              order_items (
                *,
                products (name, image_url, price)
              )
            `)
            .eq('id', orderId)
            .single();

          if (error) {
            console.error('Error fetching order:', error);
            return new Response(JSON.stringify({ error: error.message }), {
              status: 404,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          return new Response(JSON.stringify(order), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else {
          // Get all user orders
          const limit = parseInt(url.searchParams.get('limit') || '50');
          const offset = parseInt(url.searchParams.get('offset') || '0');
          const status = url.searchParams.get('status');

          let query = supabase
            .from('orders')
            .select(`
              *,
              order_items (
                *,
                products (name, image_url)
              )
            `)
            .range(offset, offset + limit - 1)
            .order('created_at', { ascending: false });

          if (status) {
            query = query.eq('status', status);
          }

          const { data: orders, error } = await query;

          if (error) {
            console.error('Error fetching orders:', error);
            return new Response(JSON.stringify({ error: error.message }), {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          return new Response(JSON.stringify(orders), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

      case 'POST':
        if (!authHeader) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const orderData = await req.json();
        
        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Create order
        const { data: newOrder, error: createError } = await supabase
          .from('orders')
          .insert([{
            user_id: user.id,
            total_amount: orderData.total_amount,
            delivery_fee: orderData.delivery_fee,
            delivery_address: orderData.delivery_address,
            notes: orderData.notes
          }])
          .select()
          .single();

        if (createError) {
          console.error('Error creating order:', createError);
          return new Response(JSON.stringify({ error: createError.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Add order items
        if (orderData.items && orderData.items.length > 0) {
          const itemInserts = orderData.items.map((item: any) => ({
            order_id: newOrder.id,
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price
          }));

          const { error: itemsError } = await supabase
            .from('order_items')
            .insert(itemInserts);

          if (itemsError) {
            console.error('Error creating order items:', itemsError);
            // Rollback order creation if items fail
            await supabase.from('orders').delete().eq('id', newOrder.id);
            return new Response(JSON.stringify({ error: 'Failed to create order items' }), {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }
        }

        return new Response(JSON.stringify(newOrder), {
          status: 201,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'PUT':
        if (!orderId || orderId === 'orders') {
          return new Response(JSON.stringify({ error: 'Order ID required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const updateData = await req.json();
        
        const { data: updatedOrder, error: updateError } = await supabase
          .from('orders')
          .update(updateData)
          .eq('id', orderId)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating order:', updateError);
          return new Response(JSON.stringify({ error: updateError.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify(updatedOrder), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});