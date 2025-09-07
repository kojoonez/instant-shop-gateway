import { Seo } from '@/components/seo/Seo';
import { siteConfig } from '@/config/site';

export default function Contact() {
  return (
    <div className="container mx-auto py-12">
      <Seo title="Contact" description="Get in touch with the Cravy team." />
      <h1 className="text-4xl font-bold mb-6">Contact</h1>
      <p className="text-muted-foreground">Email us at <a className="underline" href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.</p>
    </div>
  );
}


