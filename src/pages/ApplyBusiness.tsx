import { Seo } from '@/components/seo/Seo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { submitBusinessApplication } from '@/services/businessApplicationService';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function ApplyBusiness() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);

  return (
    <div className="container mx-auto py-12">
      <Seo title="Apply as Business" description="Apply to sell on Cravy as a verified business." />
      <h1 className="text-3xl font-bold mb-4">Apply as Business</h1>
      {submitted ? (
        <div className="rounded-xl p-6 border border-white/10 bg-gradient-card max-w-lg">
          <h2 className="text-xl font-semibold mb-2">Application received</h2>
          <p className="text-muted-foreground">We will review your documents and email you next steps.</p>
        </div>
      ) : (
        <form
          className="space-y-4 max-w-lg"
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            setPending(true);
            const { error } = await submitBusinessApplication({
              businessName: String(fd.get('businessName') || ''),
              contactName: String(fd.get('contactName') || ''),
              email: String(fd.get('email') || ''),
              phone: String(fd.get('phone') || ''),
              category: String(fd.get('category') || ''),
              countryCode: String(fd.get('countryCode') || 'OT'),
              countryName: String(fd.get('countryName') || ''),
              description: String(fd.get('description') || ''),
            });
            setPending(false);

            if (error) {
              toast({ variant: 'destructive', title: 'Submission failed', description: error.message });
              return;
            }

            setSubmitted(true);
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="businessName">Business name</Label>
            <Input id="businessName" name="businessName" required placeholder="Your business name" className="bg-background border-white/10" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactName">Contact name</Label>
            <Input id="contactName" name="contactName" required placeholder="Your full name" className="bg-background border-white/10" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Contact email</Label>
            <Input id="email" name="email" type="email" required placeholder="email@example.com" className="bg-background border-white/10" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone number</Label>
            <Input id="phone" name="phone" type="tel" placeholder="+1234567890" className="bg-background border-white/10" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Business category</Label>
            <Input id="category" name="category" placeholder="e.g. Restaurant, Retail, Services" className="bg-background border-white/10" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={3} placeholder="Tell us about your business" className="bg-background border-white/10 resize-y" />
          </div>
          <input type="hidden" name="countryCode" value="" />
          <input type="hidden" name="countryName" value="" />
          <Button type="submit" disabled={pending} className="bg-gradient-hero text-white">
            {pending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {pending ? 'Submitting...' : 'Submit application'}
          </Button>
        </form>
      )}
    </div>
  );
}
