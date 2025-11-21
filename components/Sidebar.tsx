
import React, { useMemo } from 'react';
import { DeliveryRecord } from '../types';
import { analyzeCarriers } from '../utils/sentimentAnalysis';
import TopicAnalysis from './TopicAnalysis';
import DeliveryCard from './DeliveryCard';

interface Props {
  deliveries: DeliveryRecord[];
  selectedId: string | null;
  onSelectDelivery: (id: string) => void;
}

const Sidebar: React.FC<Props> = ({ deliveries, selectedId, onSelectDelivery }) => {
  const carrierStats = useMemo(() => analyzeCarriers(deliveries), [deliveries]);

  const avgCsat = deliveries.length 
    ? (deliveries.reduce((acc, curr) => acc + curr.csat, 0) / deliveries.length).toFixed(1) 
    : 'N/A';

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200 shadow-xl z-20">
      {/* Header Stats */}
      <div className="p-6 border-b border-gray-100 bg-white">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Delivery Insights</h2>
        <p className="text-sm text-gray-500 mb-4">
          Showing {deliveries.length} deliveries in current view
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <span className="block text-xs text-blue-600 font-semibold uppercase">Avg CSAT</span>
            <span className="text-2xl font-bold text-blue-900">{avgCsat}</span>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <span className="block text-xs text-purple-600 font-semibold uppercase">Top Carrier</span>
            <span className="text-lg font-bold text-purple-900 truncate">
              {carrierStats[0]?.name || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        {/* Section: Sentiment Analysis */}
        <section>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Hot Topics & Themes</h3>
          <TopicAnalysis deliveries={deliveries} />
        </section>

        {/* Section: Carrier Breakdown */}
        <section>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Carrier Performance</h3>
          <div className="space-y-2">
            {carrierStats.slice(0, 5).map(stat => (
              <div key={stat.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${stat.avgCsat >= 4 ? 'bg-green-500' : stat.avgCsat <= 2 ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                  <span className="font-medium text-gray-700">{stat.name}</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-gray-500">{stat.count} orders</span>
                  <span className="font-bold text-gray-900">{stat.avgCsat.toFixed(1)} ★</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Delivery List */}
        <section>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Recent Feedback</h3>
          <div className="space-y-2">
            {deliveries.slice(0, 20).map(delivery => (
              <DeliveryCard 
                key={delivery.id} 
                delivery={delivery} 
                isSelected={selectedId === delivery.id}
                onClick={() => onSelectDelivery(delivery.id)}
              />
            ))}
            {deliveries.length > 20 && (
              <p className="text-center text-xs text-gray-400 py-2">
                + {deliveries.length - 20} more in this area...
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Sidebar;
