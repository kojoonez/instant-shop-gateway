import { useState } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { DemoSection } from '@/components/DemoSection';
import { TikTokFeed } from '@/components/TikTokFeed';
import { CreatorDashboard } from '@/components/CreatorDashboard';
import { BlogDemo } from '@/components/BlogDemo';
import { MapDemo } from '@/components/MapDemo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type DemoType = 'hero' | 'tiktok' | 'creator' | 'blog' | 'map';

const Index = () => {
  const [currentDemo, setCurrentDemo] = useState<DemoType>('hero');

  const renderDemo = () => {
    switch (currentDemo) {
      case 'tiktok':
        return (
          <div className="relative h-screen">
            <TikTokFeed />
            <Button 
              variant="ghost"
              className="absolute top-4 left-4 z-40 bg-black/20 backdrop-blur-sm text-white hover:bg-black/40"
              onClick={() => setCurrentDemo('hero')}
            >
              ← Back to Demos
            </Button>
          </div>
        );
      case 'creator':
        return (
          <div className="min-h-screen bg-background">
            <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
              <div className="max-w-4xl mx-auto px-6 py-4">
                <Button 
                  variant="ghost"
                  onClick={() => setCurrentDemo('hero')}
                >
                  ← Back to Demos
                </Button>
              </div>
            </div>
            <CreatorDashboard />
          </div>
        );
      case 'blog':
        return (
          <div className="min-h-screen bg-background">
            <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
              <div className="max-w-4xl mx-auto px-6 py-4">
                <Button 
                  variant="ghost"
                  onClick={() => setCurrentDemo('hero')}
                >
                  ← Back to Demos
                </Button>
              </div>
            </div>
            <BlogDemo />
          </div>
        );
      case 'map':
        return (
          <div className="h-screen bg-background">
            <div className="absolute top-4 left-4 z-40">
              <Button 
                variant="ghost"
                className="bg-white/90 backdrop-blur-sm shadow-lg"
                onClick={() => setCurrentDemo('hero')}
              >
                ← Back to Demos
              </Button>
            </div>
            <MapDemo />
          </div>
        );
      default:
        return (
          <div className="min-h-screen bg-background">
            <HeroSection />
            <DemoSection />
            
            {/* Demo Selection Section */}
            <section className="py-16 px-6">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4">
                    CraveTray in Action
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Experience how CraveTray seamlessly integrates across different contexts - 
                    from social videos to blogs and location-based discovery.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* TikTok Demo */}
                  <div className="group cursor-pointer" onClick={() => setCurrentDemo('tiktok')}>
                    <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-2xl p-6 border border-pink-500/20 hover:border-pink-500/40 transition-all hover:scale-[1.02]">
                      <div className="text-4xl mb-4">🎵</div>
                      <h3 className="text-xl font-bold mb-2">TikTok-Style Feed</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Auto-triggering CraveTray on promotional videos from creators
                      </p>
                      <Badge className="bg-pink-500 text-white">
                        Auto-Trigger
                      </Badge>
                    </div>
                  </div>

                  {/* Creator Dashboard */}
                  <div className="group cursor-pointer" onClick={() => setCurrentDemo('creator')}>
                    <div className="bg-gradient-to-br from-crave-orange/10 to-crave-purple/10 rounded-2xl p-6 border border-crave-orange/20 hover:border-crave-orange/40 transition-all hover:scale-[1.02]">
                      <div className="text-4xl mb-4">🎨</div>
                      <h3 className="text-xl font-bold mb-2">Creator Dashboard</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Upload content and opt-in to CraveTray commerce features
                      </p>
                      <Badge className="bg-crave-orange text-white">
                        Opt-In Control
                      </Badge>
                    </div>
                  </div>

                  {/* Blog Demo */}
                  <div className="group cursor-pointer" onClick={() => setCurrentDemo('blog')}>
                    <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-2xl p-6 border border-green-500/20 hover:border-green-500/40 transition-all hover:scale-[1.02]">
                      <div className="text-4xl mb-4">📝</div>
                      <h3 className="text-xl font-bold mb-2">Blog Integration</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Embedded product recommendations within content articles
                      </p>
                      <Badge className="bg-green-500 text-white">
                        Content-Aware
                      </Badge>
                    </div>
                  </div>

                  {/* Map Demo */}
                  <div className="group cursor-pointer" onClick={() => setCurrentDemo('map')}>
                    <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-6 border border-blue-500/20 hover:border-blue-500/40 transition-all hover:scale-[1.02]">
                      <div className="text-4xl mb-4">🗺️</div>
                      <h3 className="text-xl font-bold mb-2">Location-Based</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Restaurant discovery with instant ordering through map pins
                      </p>
                      <Badge className="bg-blue-500 text-white">
                        Location-Aware
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-12">
                  <div className="bg-gradient-to-r from-crave-orange/10 to-crave-purple/10 rounded-2xl p-8 border border-crave-orange/20">
                    <h3 className="text-2xl font-bold mb-4">Universal SDK</h3>
                    <p className="text-muted-foreground mb-6">
                      CraveTray works across all contexts with a single embeddable component. 
                      Creators control when it appears, ensuring zero intrusion while maximizing conversions.
                    </p>
                    <div className="flex justify-center gap-4 text-sm">
                      <Badge variant="outline">React SDK</Badge>
                      <Badge variant="outline">Cross-Platform</Badge>
                      <Badge variant="outline">Creator-Controlled</Badge>
                      <Badge variant="outline">Context-Aware</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        );
    }
  };

  return renderDemo();
};

export default Index;
