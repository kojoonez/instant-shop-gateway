import { Seo } from '@/components/seo/Seo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { submitCreatorApplication } from '@/services/creatorApplicationService';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function ApplyCreator() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);

  return (
    <div className="container mx-auto py-12">
      <Seo title="Apply as Creator" description="Apply to sell live on Cravy." />
      <h1 className="text-3xl font-bold mb-4">Apply as Creator</h1>
      {submitted ? (
        <div className="rounded-xl p-6 border border-white/10 bg-gradient-card max-w-lg">
          <h2 className="text-xl font-semibold mb-2">Application received</h2>
          <p className="text-muted-foreground">We will review your application and email you next steps.</p>
        </div>
      ) : (
        <form
          className="space-y-4 max-w-lg"
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            setPending(true);
            const { error } = await submitCreatorApplication({
              fullName: String(fd.get('fullName') || ''),
              email: String(fd.get('email') || ''),
              phone: String(fd.get('phone') || ''),
              socialLinks: String(fd.get('socialLinks') || ''),
              contentType: String(fd.get('contentType') || ''),
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
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" name="fullName" required placeholder="Your full name" className="bg-background border-white/10" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required placeholder="email@example.com" className="bg-background border-white/10" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone number</Label>
            <Input id="phone" name="phone" type="tel" placeholder="+1234567890" className="bg-background border-white/10" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="socialLinks">Social links</Label>
            <Input id="socialLinks" name="socialLinks" placeholder="Instagram, TikTok, YouTube URLs" className="bg-background border-white/10" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contentType">Content type</Label>
            <Input id="contentType" name="contentType" placeholder="e.g. Fashion, Tech, Food, Lifestyle" className="bg-background border-white/10" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={3} placeholder="Tell us about your content and audience" className="bg-background border-white/10 resize-y" />
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
