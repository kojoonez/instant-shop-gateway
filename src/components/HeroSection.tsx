import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, Smartphone, Zap, Globe, Shield } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const scrollToDemo = () => {
    document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5" />
      <div className="absolute top-20 left-10 w-32 h-32 bg-crave-orange/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-crave-purple/10 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-crave-blue/5 rounded-full blur-3xl animate-pulse delay-2000" />
      
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* Badge */}
        <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
          <Zap className="h-3 w-3 mr-1" />
          The Future of Embedded Commerce
        </Badge>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
          Cravy
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-foreground/90">
          Watch, shop, and book — live.
        </h2>

        {/* Description */}
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          One app for live shopping, food, services, events, and more.
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto">
          <div className="text-center p-3">
            <Smartphone className="h-6 w-6 mx-auto mb-2 text-crave-blue" />
            <span className="text-sm font-medium">Universal SDK</span>
          </div>
          <div className="text-center p-3">
            <Zap className="h-6 w-6 mx-auto mb-2 text-crave-orange" />
            <span className="text-sm font-medium">Instant Checkout</span>
          </div>
          <div className="text-center p-3">
            <Globe className="h-6 w-6 mx-auto mb-2 text-crave-purple" />
            <span className="text-sm font-medium">Any Platform</span>
          </div>
          <div className="text-center p-3">
            <Shield className="h-6 w-6 mx-auto mb-2 text-crave-success" />
            <span className="text-sm font-medium">Secure Payments</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button 
            size="lg" 
            className="bg-gradient-hero hover:opacity-90 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 hover:scale-105"
            onClick={scrollToDemo}
          >
            See Live Demo
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="font-semibold px-8 py-3 rounded-xl border-primary/30 hover:bg-primary/5 transition-all duration-200"
          >
            Get Started
          </Button>
        </div>

        {/* Scroll Indicator */}
        <div className="animate-bounce">
          <ArrowDown className="h-6 w-6 mx-auto text-muted-foreground" />
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/4 animate-float">
        <div className="w-3 h-3 bg-crave-orange rounded-full opacity-60" />
      </div>
      <div className="absolute top-1/3 right-1/3 animate-float delay-1000">
        <div className="w-2 h-2 bg-crave-purple rounded-full opacity-60" />
      </div>
      <div className="absolute bottom-1/4 left-1/3 animate-float delay-2000">
        <div className="w-4 h-4 bg-crave-blue rounded-full opacity-60" />
      </div>
    </section>
  );
};