import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, LogIn, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthPromptProps {
  onLogin?: () => void;
  onClose?: () => void;
}

export const AuthPrompt: React.FC<AuthPromptProps> = ({ onLogin, onClose }) => {
  const { user, signInWithGoogle, signInWithEmail } = useAuth();

  // Don't show if user is already authenticated
  if (user) return null;

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      onLogin?.();
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const handleEmailSignIn = async () => {
    // For demo purposes, create a simple email/password form
    const email = prompt('Enter your email:');
    const password = prompt('Enter your password:');
    
    if (email && password) {
      try {
        await signInWithEmail(email, password);
        onLogin?.();
      } catch (error) {
        console.error('Error signing in with email:', error);
        alert('Sign in failed. Please try again.');
      }
    }
  };

  const handleDemoSignIn = async () => {
    // Demo user for testing
    try {
      await signInWithEmail('demo@cravy.com', 'demo123');
      onLogin?.();
    } catch (error) {
      console.error('Error with demo sign in:', error);
      alert('Demo sign in failed. Please try again.');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="w-80 shadow-2xl border-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/95">
        <CardHeader className="text-center pb-4 relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-0 right-0 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <MessageCircle className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-lg">Welcome to Cravy Support</CardTitle>
          <CardDescription>
            Sign in to start chatting with our support team
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            onClick={handleGoogleSignIn}
            className="w-full"
            variant="outline"
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>
          
          <Button 
            onClick={handleEmailSignIn}
            className="w-full"
            variant="outline"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Sign in with Email
          </Button>

          <Button 
            onClick={handleDemoSignIn}
            className="w-full"
            variant="default"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Try Demo Chat
          </Button>
          
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              New to Cravy? <button className="text-primary hover:underline">Create account</button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
