import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Users, Clock, CheckCircle } from 'lucide-react';

export const MessagingDemo: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <div className="py-16 px-6 bg-gradient-to-br from-background to-accent/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
            Instant Messaging System
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with your customers in real-time. Our messaging system allows instant communication between users and admin.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* User Experience */}
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="h-6 w-6 text-primary" />
                <span>For Users</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold">One-Click Chat</h4>
                  <p className="text-sm text-muted-foreground">
                    Floating chat button on every page for instant access
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Real-time Messaging</h4>
                  <p className="text-sm text-muted-foreground">
                    Messages appear instantly with delivery confirmation
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Mobile Optimized</h4>
                  <p className="text-sm text-muted-foreground">
                    Perfect experience on all devices and screen sizes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Experience */}
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-primary" />
                <span>For Admins</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Centralized Inbox</h4>
                  <p className="text-sm text-muted-foreground">
                    Manage all conversations from one admin panel
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold">User Management</h4>
                  <p className="text-sm text-muted-foreground">
                    View user details and conversation history
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Analytics & Stats</h4>
                  <p className="text-sm text-muted-foreground">
                    Track conversation metrics and response times
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center p-6">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Real-time Chat</h3>
            <p className="text-sm text-muted-foreground">
              Instant message delivery with read receipts and status indicators
            </p>
          </Card>

          <Card className="text-center p-6">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Multi-user Support</h3>
            <p className="text-sm text-muted-foreground">
              Handle multiple conversations simultaneously with organized inbox
            </p>
          </Card>

          <Card className="text-center p-6">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">24/7 Availability</h3>
            <p className="text-sm text-muted-foreground">
              Always-on messaging system for continuous customer support
            </p>
          </Card>
        </div>

        {/* Status Indicator */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-muted">
            <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <span className="text-sm font-medium">
              {isConnected ? 'Messaging System Active' : 'Messaging System Ready'}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {isConnected 
              ? 'Users can now contact admin instantly from any page'
              : 'Click the chat button to start a conversation'
            }
          </p>
        </div>
      </div>
    </div>
  );
};
