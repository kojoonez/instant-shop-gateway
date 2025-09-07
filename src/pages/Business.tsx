import { Seo } from '@/components/seo/Seo';
import { Button } from '@/components/ui/button';

export default function Business() {
  return (
    <div className="container mx-auto py-12">
      <Seo title="For Businesses" description="Reach new buyers with live shopping and instant checkout. Simple onboarding and moderation for verified sellers." />
      <h1 className="text-4xl font-bold mb-6">For Businesses</h1>
      <p className="text-lg text-muted-foreground mb-6">Reach, sell, and grow with live checkout across shopping, food, services, and events.</p>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {[
          ['Reach new audiences', 'Appear in the Universal Feed and go live to convert.'],
          ['Live checkout', 'Shoppers buy without leaving your stream, post, or profile.'],
          ['Simple onboarding', 'Upload catalog, set schedules, and start selling in minutes.'],
        ].map(([title, copy]) => (
          <div key={title} className="rounded-xl p-6 border border-white/10 bg-gradient-card">
            <h2 className="text-xl font-semibold mb-2">{title}</h2>
            <p className="text-muted-foreground">{copy}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl p-6 border border-white/10 bg-gradient-card mb-8">
        <h3 className="text-xl font-semibold mb-3">Supported categories</h3>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-muted-foreground">
          {['Retail & fashion','Electronics','Home & decor','Food & restaurants','Beauty & salons','Wellness & fitness','Barbers & grooming','Services & repairs','Education & digital goods','Events & venues','Artists & creators','Local markets'].map(i => (
            <li key={i} className="">• {i}</li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground mt-3">All sellers are reviewed. Approval required before going live.</p>
      </div>

      <Button asChild>
        <a href="/apply/business">Apply as Business</a>
      </Button>
    </div>
  );
}


