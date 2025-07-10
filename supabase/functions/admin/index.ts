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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Set auth header from request for user verification
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const resource = pathSegments[pathSegments.length - 2]; // e.g., 'products', 'orders'
    const action = pathSegments[pathSegments.length - 1]; // e.g., 'analytics', specific ID

    switch (req.method) {
      case 'GET':
        if (resource === 'analytics') {
          // Get dashboard analytics
          const [
            { count: totalProducts },
            { count: totalOrders },
            { count: totalUsers },
            { data: recentOrders }
          ] = await Promise.all([
            supabase.from('products').select('*', { count: 'exact', head: true }),
            supabase.from('orders').select('*', { count: 'exact', head: true }),
            supabase.from('profiles').select('*', { count: 'exact', head: true }),
            supabase
              .from('orders')
              .select(`
                *,
                profiles (display_name),
                order_items (
                  quantity,
                  products (name)
                )
              `)
              .order('created_at', { ascending: false })
              .limit(10)
          ]);

          const analytics = {
            totalProducts,
            totalOrders,
            totalUsers,
            recentOrders
          };

          return new Response(JSON.stringify(analytics), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else if (resource === 'products') {
          // Get all products (including inactive)
          const { data: products, error } = await supabase
            .from('products')
            .select(`
              *,
              categories (name),
              product_badges (badge_name)
            `)
            .order('created_at', { ascending: false });

          if (error) {
            console.error('Error fetching products:', error);
            return new Response(JSON.stringify({ error: error.message }), {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          return new Response(JSON.stringify(products), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else if (resource === 'orders') {
          // Get all orders with filters
          const status = url.searchParams.get('status');
          const limit = parseInt(url.searchParams.get('limit') || '100');
          const offset = parseInt(url.searchParams.get('offset') || '0');

          let query = supabase
            .from('orders')
            .select(`
              *,
              profiles (display_name),
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
        } else if (resource === 'users') {
          // Get all users
          const { data: users, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) {
            console.error('Error fetching users:', error);
            return new Response(JSON.stringify({ error: error.message }), {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          return new Response(JSON.stringify(users), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else if (resource === 'merchants') {
          // Get all merchants
          const { data: merchants, error } = await supabase
            .from('merchants')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) {
            console.error('Error fetching merchants:', error);
            return new Response(JSON.stringify({ error: error.message }), {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          return new Response(JSON.stringify(merchants), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        break;

      case 'PUT':
        if (resource === 'orders' && action) {
          // Update order status
          const updateData = await req.json();
          
          const { data: updatedOrder, error } = await supabase
            .from('orders')
            .update(updateData)
            .eq('id', action)
            .select()
            .single();

          if (error) {
            console.error('Error updating order:', error);
            return new Response(JSON.stringify({ error: error.message }), {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          return new Response(JSON.stringify(updatedOrder), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else if (resource === 'merchants' && action) {
          // Update merchant status
          const updateData = await req.json();
          
          const { data: updatedMerchant, error } = await supabase
            .from('merchants')
            .update(updateData)
            .eq('id', action)
            .select()
            .single();

          if (error) {
            console.error('Error updating merchant:', error);
            return new Response(JSON.stringify({ error: error.message }), {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          return new Response(JSON.stringify(updatedMerchant), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        break;

      case 'DELETE':
        if (resource === 'products' && action) {
          // Hard delete product (admin only)
          const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', action);

          if (error) {
            console.error('Error deleting product:', error);
            return new Response(JSON.stringify({ error: error.message }), {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          return new Response(JSON.stringify({ message: 'Product deleted successfully' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        break;

      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    return new Response(JSON.stringify({ error: 'Invalid endpoint' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});