import { Seo } from '@/components/seo/Seo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/useTranslation';
import { joinWaitlist, type WaitlistSegment } from '@/services/waitlistService';
import { detectCountryByIp } from '@/services/geoLocationService';
import { WAITLIST_COUNTRY_CODES } from '@/config/waitlistCountries';
import { useToast } from '@/hooks/use-toast';
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, MapPin } from 'lucide-react';

function countryLabel(t: (k: string, o?: { defaultValue?: string }) => string, code: string, fallbackName: string) {
  return t(`waitlist.countries.${code}`, { defaultValue: fallbackName || code });
}

function WaitlistForm({
  segment,
  countryCode,
  countryDisplayName,
  onSuccess,
}: {
  segment: WaitlistSegment;
  countryCode: string;
  countryDisplayName: string;
  onSuccess: () => void;
}) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [pending, setPending] = useState(false);

  const isBusiness = segment === 'business';
  const isDriver = segment === 'driver';

  return (
    <form
      className="space-y-4 max-w-lg"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const fd = new FormData(form);
        const email = String(fd.get('email') ?? '');
        const fullName = String(fd.get('fullName') ?? '');
        const phone = String(fd.get('phone') ?? '');
        const businessName = String(fd.get('businessName') ?? '');
        const vehicleType = String(fd.get('vehicleType') ?? '');
        const notes = String(fd.get('notes') ?? '');

        setPending(true);
        const { error } = await joinWaitlist({
          segment,
          email,
          phone: phone || undefined,
          fullName: fullName || undefined,
          businessName: isBusiness ? businessName || undefined : undefined,
          vehicleType: isDriver ? vehicleType || undefined : undefined,
          notes: notes || undefined,
          countryCode,
          countryName: countryDisplayName,
        });
        setPending(false);

        if (error) {
          toast({
            variant: 'destructive',
            title: t('waitlist.toast.errorTitle'),
            description: error.message || t('waitlist.toast.errorDescription'),
          });
          return;
        }

        onSuccess();
        form.reset();
      }}
    >
      <div className="space-y-2">
        <Label htmlFor={`email-${segment}`}>{t('waitlist.fields.email')}</Label>
        <Input
          id={`email-${segment}`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={t('waitlist.placeholders.email')}
          className="bg-background border-white/10"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`phone-${segment}`}>Phone number</Label>
        <Input
          id={`phone-${segment}`}
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+1234567890"
          className="bg-background border-white/10"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`fullName-${segment}`}>{t('waitlist.fields.fullName')}</Label>
        <Input
          id={`fullName-${segment}`}
          name="fullName"
          autoComplete="name"
          placeholder={t('waitlist.placeholders.fullName')}
          className="bg-background border-white/10"
        />
      </div>
      {isBusiness && (
        <div className="space-y-2">
          <Label htmlFor={`businessName-${segment}`}>{t('waitlist.fields.businessName')}</Label>
          <Input
            id={`businessName-${segment}`}
            name="businessName"
            placeholder={t('waitlist.placeholders.businessName')}
            className="bg-background border-white/10"
          />
        </div>
      )}
      {isDriver && (
        <div className="space-y-2">
          <Label htmlFor={`vehicleType-${segment}`}>{t('waitlist.fields.vehicleType')}</Label>
          <Select name="vehicleType">
            <SelectTrigger id={`vehicleType-${segment}`} className="bg-background border-white/10">
              <SelectValue placeholder={t('waitlist.placeholders.vehicleType')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bicycle">🚲 Bicycle</SelectItem>
              <SelectItem value="motorbike">🏍️ Motorbike / Scooter</SelectItem>
              <SelectItem value="car">🚗 Car</SelectItem>
              <SelectItem value="van">🚐 Van</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor={`notes-${segment}`}>{t('waitlist.fields.notes')}</Label>
        <Textarea
          id={`notes-${segment}`}
          name="notes"
          rows={3}
          placeholder={t('waitlist.placeholders.notes')}
          className="bg-background border-white/10 resize-y min-h-[80px]"
        />
      </div>
      <Button type="submit" disabled={pending} className="bg-gradient-hero text-white">
        {pending ? t('common.loading') : t('waitlist.submit')}
      </Button>
    </form>
  );
}

export default function Waitlist() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const initialTab = useMemo(() => {
    const s = searchParams.get('segment');
    if (s === 'business' || s === 'driver') return s;
    return 'user';
  }, [searchParams]);
  const [tab, setTab] = useState<'business' | 'user' | 'driver'>(initialTab);
  const [businessDone, setBusinessDone] = useState(false);
  const [userDone, setUserDone] = useState(false);
  const [driverDone, setDriverDone] = useState(false);

  const [geoLoading, setGeoLoading] = useState(true);
  const [countryCode, setCountryCode] = useState('OT');
  const [detectedName, setDetectedName] = useState('');

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const r = await detectCountryByIp();
      if (cancelled) return;
      if (r) {
        setCountryCode(r.countryCode);
        setDetectedName(r.countryName);
      } else {
        setCountryCode('OT');
        setDetectedName('');
      }
      setGeoLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const s = searchParams.get('segment');
    if (s === 'business' || s === 'user' || s === 'driver') {
      setTab(s);
    }
  }, [searchParams]);

  const selectCodes = useMemo(() => {
    const codes = [...WAITLIST_COUNTRY_CODES] as string[];
    if (countryCode && !codes.includes(countryCode)) {
      codes.unshift(countryCode);
    }
    return codes;
  }, [countryCode]);

  const regionDisplayName = countryLabel(t, countryCode, detectedName);

  const introBusiness = t(`waitlist.regions.${countryCode}.introBusiness`, { defaultValue: t('waitlist.introBusiness') });
  const introUser = t(`waitlist.regions.${countryCode}.introUser`, { defaultValue: t('waitlist.introUser') });
  const introDriver = t('waitlist.introDriver');

  const confirmBusiness = t(`waitlist.regions.${countryCode}.confirmBusiness`, { defaultValue: t('waitlist.confirmBusiness') });
  const confirmUser = t(`waitlist.regions.${countryCode}.confirmUser`, { defaultValue: t('waitlist.confirmUser') });
  const confirmDriver = t('waitlist.confirmDriver');

  return (
    <div className="container mx-auto py-12">
      <Seo
        title={t('waitlist.seoTitle')}
        description={t('waitlist.seoDescription')}
        path="/waitlist"
      />
      <h1 className="text-4xl font-bold mb-2">{t('waitlist.title')}</h1>
      <p className="text-lg text-muted-foreground mb-6 max-w-2xl">{t('waitlist.subtitle')}</p>

      {geoLoading ? (
        <div className="flex items-center gap-3 py-16 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin shrink-0" />
          <span>{t('waitlist.location.detecting')}</span>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 mb-8 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1 font-normal border-white/20">
                <MapPin className="h-3 w-3" />
                {t('waitlist.location.joiningFor', { country: regionDisplayName })}
              </Badge>
            </div>
            <div className="space-y-2 max-w-md">
              <Label htmlFor="waitlist-country">{t('waitlist.location.countryLabel')}</Label>
              <Select
                value={countryCode}
                onValueChange={(v) => {
                  setCountryCode(v);
                  setDetectedName('');
                }}
              >
                <SelectTrigger id="waitlist-country" className="bg-background border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {selectCodes.map((cc) => (
                    <SelectItem key={cc} value={cc}>
                      {t(`waitlist.countries.${cc}`, {
                        defaultValue: cc === countryCode && detectedName ? detectedName : cc,
                      })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">{t('waitlist.location.hint')}</p>
            </div>
          </div>

          <Tabs
            value={tab}
            onValueChange={(v) => setTab(v as 'business' | 'user' | 'driver')}
            className="max-w-2xl"
          >
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="business">{t('waitlist.tabBusiness')}</TabsTrigger>
              <TabsTrigger value="user">{t('waitlist.tabUser')}</TabsTrigger>
              <TabsTrigger value="driver">{t('waitlist.tabDriver')}</TabsTrigger>
            </TabsList>

            <TabsContent value="business">
              {businessDone ? (
                <div className="rounded-xl p-6 border border-white/10 bg-gradient-card max-w-lg">
                  <h2 className="text-xl font-semibold mb-2">{t('waitlist.confirmTitle')}</h2>
                  <p className="text-muted-foreground">{confirmBusiness}</p>
                </div>
              ) : (
                <>
                  <p className="text-muted-foreground mb-6">{introBusiness}</p>
                  <WaitlistForm segment="business" countryCode={countryCode} countryDisplayName={regionDisplayName} onSuccess={() => setBusinessDone(true)} />
                </>
              )}
            </TabsContent>

            <TabsContent value="user">
              {userDone ? (
                <div className="rounded-xl p-6 border border-white/10 bg-gradient-card max-w-lg">
                  <h2 className="text-xl font-semibold mb-2">{t('waitlist.confirmTitle')}</h2>
                  <p className="text-muted-foreground">{confirmUser}</p>
                </div>
              ) : (
                <>
                  <p className="text-muted-foreground mb-6">{introUser}</p>
                  <WaitlistForm segment="user" countryCode={countryCode} countryDisplayName={regionDisplayName} onSuccess={() => setUserDone(true)} />
                </>
              )}
            </TabsContent>

            <TabsContent value="driver">
              {driverDone ? (
                <div className="rounded-xl p-6 border border-white/10 bg-gradient-card max-w-lg">
                  <h2 className="text-xl font-semibold mb-2">{t('waitlist.confirmTitle')}</h2>
                  <p className="text-muted-foreground">{confirmDriver}</p>
                </div>
              ) : (
                <>
                  <p className="text-muted-foreground mb-6">{introDriver}</p>
                  <WaitlistForm segment="driver" countryCode={countryCode} countryDisplayName={regionDisplayName} onSuccess={() => setDriverDone(true)} />
                </>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
