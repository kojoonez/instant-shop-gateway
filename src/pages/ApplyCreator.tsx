import { Seo } from '@/components/seo/Seo';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function ApplyCreator() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="container mx-auto py-12">
      <Seo title="Apply as Creator" description="Apply to sell live on Cravy." />
      <h1 className="text-3xl font-bold mb-4">Apply as Creator</h1>
      {submitted ? (
        <div className="rounded-xl p-6 border border-white/10 bg-gradient-card">
          <h2 className="text-xl font-semibold mb-2">Application received</h2>
          <p className="text-muted-foreground">We will review your application and email you next steps.</p>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
          <input required className="w-full rounded-md bg-background border border-white/10 px-3 py-2" placeholder="Full name" />
          <input required type="email" className="w-full rounded-md bg-background border border-white/10 px-3 py-2" placeholder="Email" />
          <input className="w-full rounded-md bg-background border border-white/10 px-3 py-2" placeholder="Links (socials, store)" />
          <Button type="submit">Submit application</Button>
        </form>
      )}
    </div>
  );
}


