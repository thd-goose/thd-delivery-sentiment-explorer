
import { DeliveryRecord, TopicData, CarrierStats } from '../types';

const STOP_WORDS = new Set(['the', 'and', 'was', 'very', 'to', 'a', 'in', 'of', 'for', 'is', 'it', 'with', 'my', 'on', 'that', 'had', 'but', 'not', 'at', 'be', 'they', 'were', 'he', 'she', 'i', 'me', 'you', 'this', 'have', 'so', 'as', 'an', 'or']);

/**
 * Helper to calculate the dominant carrier for a specific topic
 */
const calculateAttribution = (records: { carrier: string }[]): { topCarrier: string, concentration: number } | undefined => {
  if (records.length < 3) return undefined; // Not enough data for correlation

  const counts: Record<string, number> = {};
  let maxCount = 0;
  let topCarrier = '';

  records.forEach(r => {
    counts[r.carrier] = (counts[r.carrier] || 0) + 1;
    if (counts[r.carrier] > maxCount) {
      maxCount = counts[r.carrier];
      topCarrier = r.carrier;
    }
  });

  const concentration = maxCount / records.length;
  // Only return if one carrier owns > 40% of this topic to make it statistically interesting
  return concentration > 0.40 ? { topCarrier, concentration } : undefined;
};

export const analyzeTopics = (deliveries: DeliveryRecord[], type: 'word' | 'phrase'): TopicData[] => {
  const topicMap = new Map<string, { 
    count: number; 
    totalCsat: number; 
    carriers: string[]; 
  }>();

  deliveries.forEach(d => {
    // Normalize: lowercase, remove special chars
    const cleanText = d.comment.toLowerCase().replace(/[^\w\s]/g, '');
    const tokens = cleanText.split(/\s+/).filter(w => w.length > 2 && !STOP_WORDS.has(w));

    if (type === 'word') {
      tokens.forEach(word => {
        const current = topicMap.get(word) || { count: 0, totalCsat: 0, carriers: [] };
        topicMap.set(word, {
          count: current.count + 1,
          totalCsat: current.totalCsat + d.csat,
          carriers: [...current.carriers, d.carrier]
        });
      });
    } else {
      // Bigrams (Phrases)
      for (let i = 0; i < tokens.length - 1; i++) {
        const phrase = `${tokens[i]} ${tokens[i + 1]}`;
        const current = topicMap.get(phrase) || { count: 0, totalCsat: 0, carriers: [] };
        topicMap.set(phrase, {
          count: current.count + 1,
          totalCsat: current.totalCsat + d.csat,
          carriers: [...current.carriers, d.carrier]
        });
      }
    }
  });

  const result: TopicData[] = [];
  topicMap.forEach((value, key) => {
    const attribution = calculateAttribution(value.carriers.map(c => ({ carrier: c })));
    
    result.push({
      text: key,
      count: value.count,
      sentimentScore: value.totalCsat / value.count,
      topCarrier: attribution?.topCarrier,
      carrierConcentration: attribution?.concentration
    });
  });

  // Return top 40 by frequency
  return result.sort((a, b) => b.count - a.count).slice(0, 40);
};

export const analyzeCarriers = (deliveries: DeliveryRecord[]): CarrierStats[] => {
  const carrierMap = new Map<string, { count: number; totalCsat: number }>();

  deliveries.forEach(d => {
    const current = carrierMap.get(d.carrier) || { count: 0, totalCsat: 0 };
    carrierMap.set(d.carrier, {
      count: current.count + 1,
      totalCsat: current.totalCsat + d.csat
    });
  });

  const result: CarrierStats[] = [];
  carrierMap.forEach((value, key) => {
    result.push({
      name: key,
      count: value.count,
      avgCsat: value.totalCsat / value.count
    });
  });

  return result.sort((a, b) => b.count - a.count);
};
