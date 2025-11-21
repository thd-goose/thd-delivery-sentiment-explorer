
import React, { useState, useMemo } from 'react';
import Map from './components/Map';
import Sidebar from './components/Sidebar';
import { MOCK_DELIVERIES } from './services/mockData';
import { DeliveryRecord } from './types';

const App: React.FC = () => {
  // State for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [carrierFilter, setCarrierFilter] = useState('all');
  
  // State for Map/Sidebar interaction
  const [visibleDeliveries, setVisibleDeliveries] = useState<DeliveryRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 1. Filter Data based on controls
  const filteredDeliveries = useMemo(() => {
    return MOCK_DELIVERIES.filter(d => {
      // Search Filter
      const matchesSearch = 
        d.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.zip.includes(searchQuery);

      // Sentiment Filter
      let matchesSentiment = true;
      if (sentimentFilter === 'positive') matchesSentiment = d.csat >= 4;
      if (sentimentFilter === 'negative') matchesSentiment = d.csat <= 2;
      // 'neutral' isn't explicitly toggled in the simple cycler, but if we added it:
      // if (sentimentFilter === 'neutral') matchesSentiment = d.csat === 3;

      // Carrier Filter
      let matchesCarrier = true;
      if (carrierFilter !== 'all') matchesCarrier = d.carrier === carrierFilter;

      return matchesSearch && matchesSentiment && matchesCarrier;
    });
  }, [searchQuery, sentimentFilter, carrierFilter]);

  // 2. Handle Map updates
  const handleBoundsChanged = (visible: DeliveryRecord[]) => {
    // The map component returns the subset of 'filteredDeliveries' that are currently in view
    setVisibleDeliveries(visible);
  };

  const handleMarkerClick = (id: string) => {
    setSelectedId(id);
  };

  const handleSidebarSelection = (id: string) => {
    setSelectedId(id);
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-gray-50">
      {/* Main Map Area */}
      <div className="flex-1 relative h-full">
        <Map 
          deliveries={filteredDeliveries} 
          onBoundsChanged={handleBoundsChanged}
          onMarkerClick={handleMarkerClick}
          selectedId={selectedId}
          onSearch={setSearchQuery}
          onFilterSentiment={setSentimentFilter}
          onFilterCarrier={setCarrierFilter}
        />
      </div>

      {/* Floating/Fixed Sidebar */}
      <div className="w-[400px] h-full shrink-0 relative z-10 shadow-2xl">
        <Sidebar 
          deliveries={visibleDeliveries}
          selectedId={selectedId}
          onSelectDelivery={handleSidebarSelection}
        />
      </div>
    </div>
  );
};

export default App;
