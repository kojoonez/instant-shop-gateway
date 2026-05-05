import { Seo } from '@/components/seo/Seo';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';

export default function Download() {
  return (
    <div className="container mx-auto py-12">
      <Seo 
        title="Download" 
        description={`Install Cravy on iOS, Android, or web. ${siteConfig.description}`}
        path="/download"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: 'Cravy App',
          description: siteConfig.description,
          applicationCategory: 'MobileApplication',
          operatingSystem: 'iOS, Android, Web'
        }}
      />
      <h1 className="text-4xl font-bold mb-6">Download</h1>
      <div className="flex gap-3">
        <Button asChild><a href={siteConfig.links.ios} target="_blank" rel="noopener noreferrer">App Store</a></Button>
        <Button asChild variant="outline"><a href={siteConfig.links.android} target="_blank" rel="noopener noreferrer">Google Play</a></Button>
      </div>
    </div>
  );
}


