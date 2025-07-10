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
    const action = pathSegments[pathSegments.length - 1];

    switch (req.method) {
      case 'GET':
        if (action === 'profile') {
          // Get current user profile
          const { data: { user }, error: authError } = await supabase.auth.getUser();
          if (authError || !user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
              status: 401,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') { // Not found is ok
            console.error('Error fetching profile:', error);
            return new Response(JSON.stringify({ error: error.message }), {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          // If no profile exists, return user data with empty profile
          const result = profile || {
            user_id: user.id,
            display_name: user.user_metadata?.display_name || null,
            phone: null,
            address: null,
            preferences: {}
          };

          return new Response(JSON.stringify({ ...result, email: user.email }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else if (action === 'orders') {
          // Get user order history
          const { data: orders, error } = await supabase
            .from('orders')
            .select(`
              *,
              order_items (
                *,
                products (name, image_url)
              )
            `)
            .order('created_at', { ascending: false });

          if (error) {
            console.error('Error fetching user orders:', error);
            return new Response(JSON.stringify({ error: error.message }), {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          return new Response(JSON.stringify(orders), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else {
          return new Response(JSON.stringify({ error: 'Invalid endpoint' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

      case 'POST':
        if (action === 'profile') {
          if (!authHeader) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
              status: 401,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          const { data: { user }, error: authError } = await supabase.auth.getUser();
          if (authError || !user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
              status: 401,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          const profileData = await req.json();
          
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .upsert([{
              user_id: user.id,
              ...profileData
            }])
            .select()
            .single();

          if (createError) {
            console.error('Error creating/updating profile:', createError);
            return new Response(JSON.stringify({ error: createError.message }), {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          return new Response(JSON.stringify(newProfile), {
            status: 201,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else {
          return new Response(JSON.stringify({ error: 'Invalid endpoint' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

      case 'PUT':
        if (action === 'profile') {
          if (!authHeader) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
              status: 401,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          const { data: { user }, error: authError } = await supabase.auth.getUser();
          if (authError || !user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
              status: 401,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          const updateData = await req.json();
          
          const { data: updatedProfile, error: updateError } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('user_id', user.id)
            .select()
            .single();

          if (updateError) {
            console.error('Error updating profile:', updateError);
            return new Response(JSON.stringify({ error: updateError.message }), {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          return new Response(JSON.stringify(updatedProfile), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else {
          return new Response(JSON.stringify({ error: 'Invalid endpoint' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

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