import { Seo } from '@/components/seo/Seo';
import { Button } from '@/components/ui/button';

export default function Creators() {
  return (
    <div className="container mx-auto py-12">
      <Seo title="For Creators" description="Monetize with live selling, subscriptions, and referrals. Go live and get paid on Cravy." />
      <h1 className="text-4xl font-bold mb-6">For Creators</h1>
      <p className="text-lg text-muted-foreground mb-6">Sell live, partner with brands, and get paid with subscriptions and referrals.</p>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {[
          ['Live selling', 'Host shows and sell products with instant checkout.'],
          ['Monetization', 'Earn from tips, subscriptions, and affiliate referrals.'],
          ['Analytics', 'Track sales, audience, and payouts in one dashboard.'],
        ].map(([title, copy]) => (
          <div key={title} className="rounded-xl p-6 border border-white/10 bg-gradient-card">
            <h2 className="text-xl font-semibold mb-2">{title}</h2>
            <p className="text-muted-foreground">{copy}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl p-6 border border-white/10 bg-gradient-card mb-8">
        <h3 className="text-xl font-semibold mb-3">Application steps</h3>
        <ol className="space-y-2 text-sm text-muted-foreground list-decimal pl-5">
          <li>Submit your profile and content links</li>
          <li>Verification and category selection</li>
          <li>Onboarding and go live</li>
        </ol>
      </div>

      <Button asChild>
        <a href="/apply/creator">Apply as Creator</a>
      </Button>
    </div>
  );
}


