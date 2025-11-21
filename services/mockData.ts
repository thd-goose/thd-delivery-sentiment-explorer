
import { DeliveryRecord } from '../types';

// Helper to generate random jitter so points don't overlap perfectly
const jitter = (coord: number) => coord + (Math.random() - 0.5) * 0.02;

// --- FDC (Distribution Center) Data from Page 1 ---
const FDC_LOCATIONS: Record<string, { lat: number; lng: number; name: string; region: string }> = {
  '5865': { name: 'ATLANTA BDC/FDC', lat: 33.697, lng: -84.123, region: 'South' }, // Stonecrest
  '5830': { name: 'BALTIMORE BDC/FDC', lat: 39.219, lng: -76.488, region: 'North' }, // Sparrows Point
  '5928': { name: 'BEDFORD PARK/CHICAGO', lat: 41.764, lng: -87.791, region: 'North' },
  '5898': { name: 'BRIDGEPORT/PHILA', lat: 39.803, lng: -75.344, region: 'North' }, // Bridgeport, NJ
  '5955': { name: 'CHARLOTTE FDC/BDC', lat: 35.164, lng: -80.964, region: 'South' },
  '5824': { name: 'DALLAS BDC/FDC', lat: 32.753, lng: -96.902, region: 'West' },
  '5943': { name: 'DENVER BDC/FDC', lat: 40.023, lng: -104.663, region: 'West' },
  '5978': { name: 'DETROIT BDC/FDC', lat: 42.476, lng: -83.038, region: 'North' }, // Warren, MI
  '5897': { name: 'HARTFORD/BLOOMFIELD', lat: 41.863, lng: -72.729, region: 'North' },
  '5859': { name: 'HOUSTON BDC/FDC', lat: 30.332, lng: -95.433, region: 'South' }, // Conroe, TX
  '5987': { name: 'IRWINDALE FDC', lat: 34.114, lng: -117.983, region: 'West' },
  '5840': { name: 'MIAMI FDC', lat: 25.872, lng: -80.332, region: 'South' }, // Hialeah
  '5942': { name: 'MINNEAPOLIS BDC/FDC', lat: 44.739, lng: -93.074, region: 'West' }, // Rosemount
  '5853': { name: 'NEWARK/PERTH AMBOY', lat: 40.521, lng: -74.286, region: 'North' },
  '5914': { name: 'PERRIS BDC/FDC', lat: 33.799, lng: -117.222, region: 'West' },
  '5977': { name: 'SAN ANTONIO FDC', lat: 29.244, lng: -98.323, region: 'South' }, // Elmendorf
  '5856': { name: 'TAMPA BDC/FDC', lat: 27.842, lng: -82.375, region: 'South' }, // Gibsonton
};

// --- Store Data from Pages 101-220 (Representative Sample) ---
const STORES = [
  // South / Florida
  { id: '0218', city: 'Deerfield Beach, FL', lat: 26.318, lng: -80.099 },
  { id: '0210', city: 'Kendall, FL', lat: 25.679, lng: -80.317 },
  { id: '0232', city: 'Southland (Orlando), FL', lat: 28.453, lng: -81.397 },
  { id: '0233', city: 'Daytona Beach, FL', lat: 29.210, lng: -81.022 },
  { id: '0260', city: 'Melbourne, FL', lat: 28.083, lng: -80.608 },
  { id: '0221', city: 'Jensen Beach, FL', lat: 27.254, lng: -80.229 },
  { id: '0270', city: 'Gainesville, FL', lat: 29.651, lng: -82.324 },
  { id: '0243', city: 'Brandon, FL', lat: 27.937, lng: -82.285 },
  { id: '0224', city: 'Boynton Beach, FL', lat: 26.531, lng: -80.090 },
  { id: '0280', city: 'Naples, FL', lat: 26.142, lng: -81.794 },
  { id: '0208', city: 'Pompano Beach, FL', lat: 26.237, lng: -80.124 },
  { id: '0205', city: 'Lake Worth, FL', lat: 26.616, lng: -80.068 },
  { id: '0245', city: 'Carrollwood (Tampa), FL', lat: 28.053, lng: -82.502 },
  { id: '0204', city: 'Boca Raton, FL', lat: 26.368, lng: -80.128 },
  { id: '0247', city: 'Palm Harbor, FL', lat: 28.078, lng: -82.763 },
  { id: '0207', city: 'Cutler Ridge, FL', lat: 25.597, lng: -80.353 },
  { id: '6335', city: 'South Florida Ave (Lakeland), FL', lat: 27.981, lng: -81.974 },
  { id: '6934', city: 'Port St. Lucie, FL', lat: 27.273, lng: -80.350 },
  
  // Georgia / South Atlantic
  { id: '0105', city: 'Duluth, GA', lat: 34.002, lng: -84.144 },
  { id: '0106', city: 'Kennesaw, GA', lat: 34.023, lng: -84.615 },
  { id: '0111', city: 'Merchants Walk (Marietta), GA', lat: 33.983, lng: -84.425 },
  { id: '0110', city: 'Stone Mountain, GA', lat: 33.808, lng: -84.170 },
  { id: '0114', city: 'Mount Zion (Morrow), GA', lat: 33.582, lng: -84.342 },
  { id: '0115', city: 'Tilly Mill (Atlanta), GA', lat: 33.926, lng: -84.269 },
  { id: '0159', city: 'Mid-town (Atlanta), GA', lat: 33.773, lng: -84.366 },
  { id: '0134', city: 'Cumming, GA', lat: 34.207, lng: -84.140 },
  { id: '0121', city: 'Cumberland (Atlanta), GA', lat: 33.882, lng: -84.470 },
  { id: '0145', city: 'Canton, GA', lat: 34.236, lng: -84.490 },
  { id: '0174', city: 'Dawsonville, GA', lat: 34.420, lng: -84.119 },
  
  // Texas / Gulf
  { id: '0571', city: 'Katy Freeway (Houston), TX', lat: 29.785, lng: -95.468 },
  { id: '0542', city: 'Fort Worth, TX', lat: 32.755, lng: -97.330 },
  { id: '0541', city: 'Arlington, TX', lat: 32.735, lng: -97.108 },
  { id: '0539', city: 'Plano, TX', lat: 33.019, lng: -96.698 },
  { id: '0574', city: 'Sugarland, TX', lat: 29.619, lng: -95.634 },
  { id: '0537', city: 'Euless, TX', lat: 32.837, lng: -97.081 },
  { id: '0580', city: 'Windcrest, TX', lat: 29.513, lng: -98.383 },
  { id: '0352', city: 'New Orleans East, LA', lat: 30.048, lng: -89.963 },
  { id: '0349', city: 'Kenner, LA', lat: 30.020, lng: -90.241 },
  { id: '0356', city: 'Shreveport, LA', lat: 32.525, lng: -93.750 },
  { id: '0363', city: 'Lake Charles, LA', lat: 30.226, lng: -93.217 },
  { id: '0367', city: 'North Baton Rouge, LA', lat: 30.451, lng: -91.187 },
  
  // North / East
  { id: '4132', city: 'Lower Pottsgrove, PA', lat: 40.242, lng: -75.613 },
  { id: '4134', city: 'Neshaminy, PA', lat: 40.154, lng: -74.954 },
  { id: '2562', city: 'Bowie, MD', lat: 38.961, lng: -76.729 },
  { id: '2587', city: 'Baltimore (Golden Ring), MD', lat: 39.336, lng: -76.509 },
  { id: '4127', city: 'Stroudsburg, PA', lat: 40.986, lng: -75.194 },
  { id: '3807', city: 'Westgate (Rochester), NY', lat: 43.156, lng: -77.608 },
  { id: '1267', city: 'Farmingdale, NY', lat: 40.732, lng: -73.445 },
  { id: '4645', city: 'Harrisonburg, VA', lat: 38.449, lng: -78.868 },
  
  // West / Pacific
  { id: '6612', city: 'Escondido, CA', lat: 33.119, lng: -117.086 },
  { id: '0660', city: 'Encinitas, CA', lat: 33.036, lng: -117.291 },
  { id: '6614', city: 'Lakewood, CA', lat: 33.853, lng: -118.134 },
  { id: '0652', city: 'Rancho Cordova, CA', lat: 38.589, lng: -121.302 },
  { id: '6604', city: 'San Ramon, CA', lat: 37.779, lng: -121.978 },
  { id: '3303', city: 'E. Las Vegas, NV', lat: 36.169, lng: -115.139 },
  { id: '0469', city: 'Mesa, AZ', lat: 33.415, lng: -111.831 },
  { id: '4712', city: 'Bothell, WA', lat: 47.760, lng: -122.205 },
  { id: '4705', city: 'Southcenter (Seattle), WA', lat: 47.446, lng: -122.263 },
  { id: '0471', city: 'Gilbert, AZ', lat: 33.352, lng: -111.789 },
  { id: '1701', city: 'Honolulu (Dole), HI', lat: 21.306, lng: -157.858 },
];

// Calculates distance between two coordinates to find nearest hub
const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  return Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2));
};

// Helper to find the closest FDC for a given store location
const getNearestHub = (lat: number, lng: number) => {
  let nearestHub = FDC_LOCATIONS['5865']; // Default to Atlanta
  let minDist = Number.MAX_VALUE;

  Object.values(FDC_LOCATIONS).forEach(hub => {
    const dist = getDistance(lat, lng, hub.lat, hub.lng);
    if (dist < minDist) {
      minDist = dist;
      nearestHub = hub;
    }
  });

  return nearestHub;
};

// Carrier names from the PDF data or typical carriers
export const CARRIERS = [
  'THD FLEET', 
  'ESTES EXPRESS', 
  'RXO Last Mile', 
  'TRULINE CORP', 
  'AIT Home Deliv', 
  'Annett Holding', 
  'JB HUNT TRAN'
];

const COMMENTS_POSITIVE = [
  "Driver was very professional and came early.",
  "Excellent service! The staff was very professional and helpful.",
  "Everything was good all the way from store to my home.",
  "Driver was very helpful and polite. Thank you.",
  "The delivery man was respectful of property, courteous, friendly.",
  "Great delivery! Driver was professional.",
  "These two were very friendly. They greeted us with kindness.",
  "Handled with care. Good job.",
  "Excellent communication.",
  "Driver was extremely nice and helpful."
];

const COMMENTS_NEGATIVE = [
  "Bunch drywall was dropped off on my lawn and not the clear and visible driveway.",
  "Gotta get better. This happens every time I fall for the Home Depot delivery trick.",
  "Driver did not follow my explicit instructions given twice.",
  "The product was EXTREMELY damaged, I had to throw it away.",
  "5/8 drywall damaged on corners.",
  "I did not receive a call when the driver was on the way.",
  "Was told I would get a call 30 minutes before delivery. Product was delivered with no contact.",
  "Delivery window given was 14 hrs. Not exactly a window.",
  "Quite literally the worst experience.",
  "Damaged goods. Driver refused to help."
];

const COMMENTS_NEUTRAL = [
  "Good overall but box was dirty.",
  "Okay service, nothing special.",
  "Delivered on time but left at curb.",
  "No issues, standard delivery.",
  "Driver was fine, truck was loud."
];

// Generate mock deliveries based on real store locations
export const MOCK_DELIVERIES: DeliveryRecord[] = Array.from({ length: 150 }).map((_, index) => {
  // Pick a random store from our real list
  const store = STORES[Math.floor(Math.random() * STORES.length)];
  
  // Weighted sentiment generation (mostly positive/neutral, some negative)
  const rand = Math.random();
  let csat, comment;
  
  if (rand > 0.85) {
    csat = Math.floor(Math.random() * 2) + 1; // 1 or 2
    comment = COMMENTS_NEGATIVE[Math.floor(Math.random() * COMMENTS_NEGATIVE.length)];
  } else if (rand > 0.6) {
    csat = 3;
    comment = COMMENTS_NEUTRAL[Math.floor(Math.random() * COMMENTS_NEUTRAL.length)];
  } else {
    csat = Math.floor(Math.random() * 2) + 4; // 4 or 5
    comment = COMMENTS_POSITIVE[Math.floor(Math.random() * COMMENTS_POSITIVE.length)];
  }

  // Find the logical FDC hub for this store
  const hub = getNearestHub(store.lat, store.lng);

  return {
    id: `DEL-${1000 + index}`,
    city: store.city,
    state: store.city.split(', ')[1] || 'USA',
    zip: '00000',
    carrier: CARRIERS[Math.floor(Math.random() * CARRIERS.length)],
    store: `${store.id} - ${store.city.split(',')[0]}`,
    csat: csat,
    comment: comment,
    lat: jitter(store.lat),
    lng: jitter(store.lng),
    fulfillmentLat: hub.lat,
    fulfillmentLng: hub.lng,
    date: new Date(2025, 9, Math.floor(Math.random() * 30) + 1).toISOString(),
  };
});
