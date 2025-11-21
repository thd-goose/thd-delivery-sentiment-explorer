
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMapEvents, Polyline } from 'react-leaflet';
import { DeliveryRecord } from '../types';
import { CARRIERS } from '../services/mockData';

interface Props {
  deliveries: DeliveryRecord[];
  onBoundsChanged: (visibleDeliveries: DeliveryRecord[]) => void;
  onMarkerClick: (id: string) => void;
  selectedId: string | null;
  onSearch: (query: string) => void;
  onFilterSentiment: (sentiment: string) => void;
  onFilterCarrier: (carrier: string) => void;
}

// Component to handle map events (zoom, move)
const MapEvents: React.FC<{ 
  deliveries: DeliveryRecord[]; 
  onBoundsChange: (visible: DeliveryRecord[]) => void 
}> = ({ deliveries, onBoundsChange }) => {
  const map = useMapEvents({
    moveend: () => {
      const bounds = map.getBounds();
      const visible = deliveries.filter(d => 
        bounds.contains([d.lat, d.lng])
      );
      onBoundsChange(visible);
    },
    load: () => {
       // Initial load logic if needed
    }
  });
  
  // Trigger initial load when deliveries change or map is ready
  useEffect(() => {
     if(map) {
       const bounds = map.getBounds();
       const visible = deliveries.filter(d => bounds.contains([d.lat, d.lng]));
       onBoundsChange(visible);
     }
  }, [map, deliveries, onBoundsChange]);

  return null;
};

const Map: React.FC<Props> = ({ 
  deliveries, 
  onBoundsChanged, 
  onMarkerClick, 
  selectedId, 
  onSearch,
  onFilterSentiment,
  onFilterCarrier 
}) => {
  
  const [sentimentMode, setSentimentMode] = useState<'all' | 'positive' | 'negative'>('all');
  const [showCarrierDropdown, setShowCarrierDropdown] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState<string>('All Carriers');

  const getMarkerColor = (csat: number) => {
    if (csat >= 4) return '#10B981'; // Green
    if (csat === 3) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  const handleSentimentCycle = () => {
    let nextMode: 'all' | 'positive' | 'negative' = 'all';
    if (sentimentMode === 'all') nextMode = 'positive';
    else if (sentimentMode === 'positive') nextMode = 'negative';
    else nextMode = 'all';
    
    setSentimentMode(nextMode);
    onFilterSentiment(nextMode);
  };

  const handleCarrierSelect = (carrier: string) => {
    setSelectedCarrier(carrier);
    onFilterCarrier(carrier === 'All Carriers' ? 'all' : carrier);
    setShowCarrierDropdown(false);
  };

  return (
    <div className="w-full h-full relative">
        <MapContainer 
          center={[39.8283, -98.5795]} // Center of contiguous USA
          zoom={4} 
          scrollWheelZoom={true}
          className="w-full h-full z-0"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          
          <MapEvents deliveries={deliveries} onBoundsChange={onBoundsChanged} />

          {deliveries.map(d => {
            const isSelected = selectedId === d.id;
            
            return (
              <React.Fragment key={d.id}>
                {/* Connection Route Line */}
                <Polyline 
                  positions={[
                    [d.fulfillmentLat, d.fulfillmentLng],
                    [d.lat, d.lng]
                  ]}
                  pathOptions={{
                    color: getMarkerColor(d.csat),
                    weight: isSelected ? 3 : 1,
                    opacity: isSelected ? 0.8 : 0.2, 
                    dashArray: isSelected ? undefined : '5, 10'
                  }}
                />

                {/* Fulfillment Center Marker */}
                <CircleMarker
                   center={[d.fulfillmentLat, d.fulfillmentLng]}
                   radius={4}
                   pathOptions={{ 
                     color: '#111827', // Gray 900
                     fillColor: '#111827', 
                     fillOpacity: 1, 
                     weight: 1,
                     stroke: true,
                     opacity: 1
                   }}
                >
                  <Popup>
                    <div className="text-xs font-bold">Fulfillment Hub</div>
                  </Popup>
                </CircleMarker>

                {/* Delivery Location Marker */}
                <CircleMarker
                  center={[d.lat, d.lng]}
                  radius={isSelected ? 8 : 5}
                  pathOptions={{
                    color: 'white',
                    weight: 1,
                    fillColor: getMarkerColor(d.csat),
                    fillOpacity: 0.9
                  }}
                  eventHandlers={{
                    click: () => onMarkerClick(d.id)
                  }}
                >
                  <Popup>
                    <div className="p-1">
                      <strong className="block text-sm mb-1">{d.city}</strong>
                      <div className="text-xs mb-2">Carrier: {d.carrier}</div>
                      <div className={`text-xs font-bold ${d.csat >=4 ? 'text-green-600' : d.csat <= 2 ? 'text-red-600' : 'text-yellow-600'}`}>
                        Score: {d.csat}/5
                      </div>
                      <p className="text-xs italic mt-1 border-t pt-1">"{d.comment.substring(0, 50)}..."</p>
                    </div>
                  </Popup>
                </CircleMarker>
              </React.Fragment>
            );
          })}
        </MapContainer>
        
        {/* Floating Search Bar & Filters */}
        <div className="absolute top-4 left-4 z-[1000] w-96 flex flex-col gap-2">
            <div className="bg-white rounded-lg flex items-center p-3 shadow-lg border border-gray-200">
                <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <input 
                  type="text" 
                  placeholder="Search by city, state, or zip..." 
                  className="w-full outline-none text-sm text-gray-900 placeholder-gray-500 bg-transparent"
                  onChange={(e) => onSearch(e.target.value)}
                />
            </div>
            <div className="flex gap-2">
                 <div className="relative">
                   <button 
                      onClick={() => setShowCarrierDropdown(!showCarrierDropdown)}
                      className="bg-white text-xs font-medium px-4 py-2 rounded-full shadow-md text-gray-800 hover:bg-gray-50 border border-gray-200 flex items-center gap-1 transition-colors"
                   >
                     {selectedCarrier === 'All Carriers' ? 'Carrier' : selectedCarrier}
                     <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                   </button>
                   {showCarrierDropdown && (
                     <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden py-1 max-h-60 overflow-y-auto">
                       <button 
                          className="w-full text-left px-4 py-2 text-xs hover:bg-gray-100 text-gray-800"
                          onClick={() => handleCarrierSelect('All Carriers')}
                       >
                         All Carriers
                       </button>
                       {CARRIERS.map(c => (
                         <button 
                           key={c}
                           className="w-full text-left px-4 py-2 text-xs hover:bg-gray-100 text-gray-800"
                           onClick={() => handleCarrierSelect(c)}
                         >
                           {c}
                         </button>
                       ))}
                     </div>
                   )}
                 </div>

                 <button 
                    onClick={handleSentimentCycle}
                    className={`text-xs font-medium px-4 py-2 rounded-full shadow-md border border-gray-200 transition-all ${
                      sentimentMode === 'all' ? 'bg-white text-gray-800 hover:bg-gray-50' :
                      sentimentMode === 'positive' ? 'bg-green-50 text-green-700 border-green-200' :
                      'bg-red-50 text-red-700 border-red-200'
                    }`}
                 >
                   Sentiment: {sentimentMode.charAt(0).toUpperCase() + sentimentMode.slice(1)}
                 </button>
            </div>
        </div>

        {/* Legend Overlay */}
        <div className="absolute bottom-6 left-6 z-[1000] bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-200 text-xs font-medium text-gray-900">
          <h4 className="mb-2 font-bold text-gray-700 uppercase text-[10px] tracking-wider">Map Key</h4>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm"></div>
            <span>Positive Sentiment (4-5)</span>
          </div>
          <div className="flex items-center gap-2 mb-1.5">
             <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm"></div>
             <span>Neutral Sentiment (3)</span>
          </div>
           <div className="flex items-center gap-2 mb-2">
             <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></div>
             <span>Negative Sentiment (1-2)</span>
          </div>
           <div className="flex items-center gap-2 pt-2 border-t border-gray-200 mt-2">
             <div className="w-2.5 h-2.5 bg-gray-900 rounded-full ring-2 ring-gray-300"></div>
             <span>Fulfillment Hub</span>
          </div>
           <div className="flex items-center gap-2 mt-1">
             <div className="w-6 h-0.5 bg-gray-400 border-t border-dashed"></div>
             <span>Logistics Route</span>
          </div>
        </div>
    </div>
  );
};

export default Map;
