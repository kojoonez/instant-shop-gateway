import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Package, Clock, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface OrderItem {
  id: string;
  quantity: number;
  unit_price: number;
  products: {
    name: string;
    image_url: string;
  };
}

interface Order {
  id: string;
  total_amount: number;
  delivery_fee: number;
  delivery_address: any;
  notes: string;
  status: string;
  created_at: string;
  order_items: OrderItem[];
}

export default function Orders() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            quantity,
            unit_price,
            products (
              name,
              image_url
            )
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error Loading Orders",
        description: "Failed to load your orders. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
      case 'preparing':
        return <Package className="h-4 w-4" />;
      case 'ready':
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'confirmed':
      case 'preparing':
        return 'default';
      case 'ready':
        return 'outline';
      case 'delivered':
        return 'default';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/marketplace')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Button>
          <h1 className="text-3xl font-bold">My Orders</h1>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't placed any orders yet. Start shopping to see your orders here.
              </p>
              <Button onClick={() => navigate('/marketplace')}>
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Order #{order.id.slice(0, 8)}
                        <Badge variant={getStatusColor(order.status)} className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Placed on {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">${order.total_amount.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.order_items.length} item{order.order_items.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Order Items */}
                    <div>
                      <h4 className="font-medium mb-3">Items Ordered</h4>
                      <div className="space-y-3">
                        {order.order_items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <img
                              src={item.products.image_url}
                              alt={item.products.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h5 className="font-medium">{item.products.name}</h5>
                              <p className="text-sm text-muted-foreground">
                                Qty: {item.quantity} × ${item.unit_price.toFixed(2)}
                              </p>
                            </div>
                            <span className="font-medium">
                              ${(item.quantity * item.unit_price).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Delivery Address */}
                    {order.delivery_address && (
                      <div>
                        <h4 className="font-medium mb-2">Delivery Address</h4>
                        <p className="text-sm text-muted-foreground">
                          {order.delivery_address.street}, {order.delivery_address.city}
                          {order.delivery_address.state && `, ${order.delivery_address.state}`}
                          {order.delivery_address.zipCode && ` ${order.delivery_address.zipCode}`}
                        </p>
                        {order.delivery_address.instructions && (
                          <p className="text-sm text-muted-foreground mt-1">
                            <strong>Instructions:</strong> {order.delivery_address.instructions}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Order Notes */}
                    {order.notes && (
                      <div>
                        <h4 className="font-medium mb-2">Order Notes</h4>
                        <p className="text-sm text-muted-foreground">{order.notes}</p>
                      </div>
                    )}

                    <Separator />

                    {/* Order Total Breakdown */}
                    <div>
                      <h4 className="font-medium mb-2">Order Summary</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>${(order.total_amount - order.delivery_fee).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Delivery Fee</span>
                          <span>${order.delivery_fee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-medium text-base pt-1 border-t">
                          <span>Total</span>
                          <span>${order.total_amount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}