import { X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type FeedType = 'product' | 'service' | 'event' | 'subscription' | 'live_stream';

export interface UniversalFeedItem {
  name: string;
  description?: string;
  price?: number;
  image?: string;
  rating?: number;
  reviews?: number;
  distanceKm?: number;

  // product
  spiceLevel?: string;
  cuisineType?: string;
  restaurant?: string;
  dietaryInfo?: string;
  preparationTime?: string;
  deliveryFee?: number;
  deliveryTime?: string;
  allergens?: string;
  nutritionalInfo?: string;
  specialOffers?: string;
  addOns?: string[];

  // service
  uploaderAddress?: string;
  serviceCategory?: string;
  priceNotes?: string;
  availableSlots?: string[];

  // event
  eventDate?: string;
  eventLocation?: string;
  capacity?: number;
  capacityStatus?: 'Available' | 'Limited' | 'Sold Out';
  statusBadge?: 'Past' | 'Upcoming' | 'Future';
  eventDetails?: string;
  availableTickets?: number;

  // subscription
  subscriptionPlan?: string;
  subscriptionDuration?: string;
  subscriptionFeatures?: string[];
  formattedPrice?: string;
  tier?: string; // e.g., Gold
  trainerAccess?: boolean;
  accessAreas?: string; // e.g., All locations

  // live
  roomName?: string;
  streamDuration?: string;
}

const typeColor: Record<FeedType, string> = {
  product: '#FF6B35',
  service: '#001F4D',
  event: '#4A148C',
  subscription: '#006400',
  live_stream: '#007BFF',
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  item: UniversalFeedItem;
  feedType?: FeedType;
  ctaText: string;
  onAction: () => void;
};

import { useState } from 'react';

export function UniversalInfoTray({ isOpen, onClose, item, feedType = 'product', ctaText, onAction }: Props) {
  const safeFeedType: FeedType = (feedType || 'product');
  const color = typeColor[safeFeedType] || '#FF6B35';
  const [quantity, setQuantity] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const formatEUR = (value: number) => `€${value.toFixed(2)}`;

  return (
    <div
      className={cn(
        'bg-gradient-tray border border-white/10 rounded-2xl shadow-tray h-[45vh] md:h-[35vh] transition-opacity',
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
    >
      <div className="p-4 h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] font-semibold px-2 py-1 rounded-full"
              style={{ backgroundColor: `${color}20`, color, border: `1px solid ${color}40` }}
            >
              {(typeof safeFeedType === 'string' ? safeFeedType : 'product').replace('_', ' ')}
            </span>
            {item.rating ? (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                {item.rating}{item.reviews ? ` (${item.reviews})` : ''}
              </span>
            ) : null}
            {typeof item.distanceKm === 'number' && (
              <span className="text-xs text-muted-foreground">{item.distanceKm.toFixed(1)} km</span>
            )}
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Title + description */}
        <div className="mb-2">
          <div className="font-bold text-base truncate">{item.name}</div>
          {item.description && (
            <div className="text-xs text-muted-foreground line-clamp-3">{item.description}</div>
          )}
        </div>

        {/* Type-specific rows */}
        {safeFeedType === 'product' && (
          <div className="mb-2">
            <div className="flex flex-wrap gap-2 mb-1">
              {item.spiceLevel && <Chip>Spice: {item.spiceLevel}</Chip>}
              {item.cuisineType && <Chip>{item.cuisineType}</Chip>}
              {item.restaurant && <Chip>{item.restaurant}</Chip>}
              {typeof item.deliveryFee === 'number' || item.deliveryTime ? (
                <Chip>Delivery</Chip>
              ) : null}
            </div>
            <div className="text-[11px] text-muted-foreground space-y-1">
              {item.dietaryInfo && <div>Dietary: {item.dietaryInfo}</div>}
              {item.preparationTime && <div>Prep: {item.preparationTime}</div>}
              {typeof item.deliveryFee === 'number' && item.deliveryTime && (
                <div>Delivery: {item.deliveryTime} · {item.deliveryFee === 0 ? 'FREE' : formatEUR(item.deliveryFee)}</div>
              )}
              {item.allergens && <div>Allergens: {item.allergens}</div>}
              {item.specialOffers && <div>{item.specialOffers}</div>}
              {item.addOns && item.addOns.length > 0 && <div>Add‑ons available</div>}
            </div>
          </div>
        )}

        {safeFeedType === 'service' && (
          <div className="mb-2 text-[11px] text-muted-foreground space-y-1">
            {item.restaurant && <div>Provider: {item.restaurant}</div>}
            {item.spiceLevel && <div>Level: {item.spiceLevel}</div>}
            {item.preparationTime && <div>Duration: {item.preparationTime}</div>}
            {item.uploaderAddress && <div>Address: {item.uploaderAddress}</div>}
            {item.serviceCategory && <div>Category: {item.serviceCategory}</div>}
            {item.priceNotes && <div>{item.priceNotes}</div>}
            {item.availableSlots && item.availableSlots.length > 0 && (
              <div className="pt-1">
                <div className="mb-1">Times:</div>
                <div className="flex flex-wrap gap-1.5">
                  {item.availableSlots.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedSlot(t)}
                      className={cn('px-2 py-0.5 rounded-full border text-[10px]', selectedSlot === t ? 'bg-white/20 border-white/40' : 'bg-white/5 border-white/10')}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {safeFeedType === 'event' && (
          <div className="mb-2 text-[11px] text-muted-foreground">
            <div className="space-x-3">
              {item.eventDate && <span>{item.eventDate}</span>}
              {item.eventLocation && <span>{item.eventLocation}</span>}
              {typeof item.capacity === 'number' && <span>Capacity: {item.capacity}</span>}
              {item.capacityStatus && <span>{item.capacityStatus}</span>}
            </div>
            {item.eventDetails && <div className="mt-1">{item.eventDetails}</div>}
            {typeof item.availableTickets === 'number' && (
              <div className="mt-1">Available: {item.availableTickets} tickets</div>
            )}
          </div>
        )}

        {safeFeedType === 'subscription' && (
          <div className="mb-2 text-[11px] text-muted-foreground">
            <div className="space-x-3">
              {item.subscriptionPlan && <span>Plan: {item.subscriptionPlan}</span>}
              {item.tier && <span>Tier: {item.tier}</span>}
              {item.subscriptionDuration && <span>{item.subscriptionDuration}</span>}
              {item.subscriptionFeatures && <span>{item.subscriptionFeatures.length} features</span>}
            </div>
            <div className="space-x-3 mt-1">
              {item.trainerAccess && <span>Instructor access</span>}
              {item.accessAreas && <span>{item.accessAreas}</span>}
            </div>
          </div>
        )}

        {safeFeedType === 'live_stream' && (
          <div className="mb-2 text-[11px] text-muted-foreground space-x-3">
            <span className="text-red-500 font-semibold">LIVE NOW</span>
            {item.roomName && <span>{item.roomName}</span>}
            {item.streamDuration && <span>{item.streamDuration}</span>}
          </div>
        )}

        {/* Footer: price + CTA */}
        <div className="mt-auto flex items-center justify-between gap-3">
          <div className="text-left">
            {typeof item.price === 'number' ? (
              <>
                <div className="text-[11px] text-muted-foreground">Total</div>
                <div className="text-lg font-bold">{formatEUR(item.price * (safeFeedType === 'product' ? quantity : 1))}</div>
              </>
            ) : item.formattedPrice ? (
              <>
                <div className="text-[11px] text-muted-foreground">Price</div>
                <div className="text-lg font-bold">{item.formattedPrice}</div>
              </>
            ) : null}
          </div>
          {feedType === 'product' && (
            <div className="flex items-center gap-2 text-sm">
              <button className="h-8 w-8 rounded-full bg-white/5 border border-white/10" onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
              <div className="w-6 text-center font-medium">{quantity}</div>
              <button className="h-8 w-8 rounded-full bg-white/5 border border-white/10" onClick={() => setQuantity(q => q + 1)}>＋</button>
            </div>
          )}
          <Button
            onClick={() => {
              if (safeFeedType === 'service' && item.availableSlots && item.availableSlots.length > 0 && !selectedSlot) return;
              onAction();
            }}
            className="flex-1 h-11 rounded-xl font-semibold"
            style={{ backgroundColor: color, color: '#fff' }}
            disabled={safeFeedType === 'service' && item.availableSlots && item.availableSlots.length > 0 && !selectedSlot}
          >
            {ctaText}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="text-[10px] px-2 py-1 rounded-full bg-white/5 border border-white/10">{children}</span>;
}


