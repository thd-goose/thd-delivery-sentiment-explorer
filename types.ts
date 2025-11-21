
export interface DeliveryRecord {
  id: string;
  city: string;
  state: string;
  zip: string;
  carrier: string;
  store: string;
  csat: number; // 1-5
  comment: string;
  lat: number;
  lng: number;
  fulfillmentLat: number;
  fulfillmentLng: number;
  date: string;
}

export interface TopicData {
  text: string;
  count: number;
  sentimentScore: number; // Average CSAT
  topCarrier?: string; // The carrier most associated with this topic
  carrierConcentration?: number; // What % of this topic belongs to that carrier (for correlation)
}

export interface CarrierStats {
  name: string;
  count: number;
  avgCsat: number;
}

export enum SentimentType {
  POSITIVE = 'POSITIVE',
  NEUTRAL = 'NEUTRAL',
  NEGATIVE = 'NEGATIVE'
}
