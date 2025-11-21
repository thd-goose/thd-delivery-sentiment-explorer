
import React, { useState, useMemo } from 'react';
import { DeliveryRecord, TopicData } from '../types';
import { analyzeTopics } from '../utils/sentimentAnalysis';

interface Props {
  deliveries: DeliveryRecord[];
}

const TopicAnalysis: React.FC<Props> = ({ deliveries }) => {
  const [activeTab, setActiveTab] = useState<'keywords' | 'themes'>('keywords');

  // Calculate data based on tab selection
  const topics = useMemo(() => {
    return analyzeTopics(deliveries, activeTab === 'keywords' ? 'word' : 'phrase');
  }, [deliveries, activeTab]);

  if (topics.length === 0) return <div className="text-center text-gray-500 py-4">No topics found in current view</div>;

  const maxVal = Math.max(...topics.map(w => w.count));

  // Helper to determine color
  const getSentimentColor = (score: number) => {
    if (score >= 4) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score <= 2.5) return 'text-red-700 bg-red-50 border-red-200';
    return 'text-amber-700 bg-amber-50 border-amber-200';
  };
  
  // Helper for connection badge color
  const getConnectionColor = (score: number) => {
    if (score >= 4) return 'bg-emerald-100 text-emerald-800';
    if (score <= 2.5) return 'bg-red-100 text-red-800';
    return 'bg-amber-100 text-amber-800';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('keywords')}
          className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
            activeTab === 'keywords' 
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          Keywords
        </button>
        <button
          onClick={() => setActiveTab('themes')}
          className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
            activeTab === 'themes' 
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          Themes
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex flex-wrap gap-2 justify-center">
          {topics.map((topic) => {
            const colorClasses = getSentimentColor(topic.sentimentScore);
            
            // Scaling font size for Keywords, Fixed size chips for Themes
            const fontSize = activeTab === 'keywords' 
               ? 0.75 + ((topic.count) / (maxVal || 1)) * 0.75 
               : 0.85;

            return (
              <div
                key={topic.text}
                className={`relative group flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-200 cursor-default ${colorClasses}`}
                style={activeTab === 'keywords' ? { fontSize: `${fontSize}rem`, border: 'none', background: 'transparent', padding: '2px 6px' } : {}}
                title={`Avg CSAT: ${topic.sentimentScore.toFixed(1)} | Count: ${topic.count}`}
              >
                <span className="font-medium">{topic.text}</span>
                
                {/* Connection Indicator (only if there is a strong correlation) */}
                {topic.topCarrier && (
                  <div className={`hidden group-hover:flex absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap z-50 px-2 py-1 rounded shadow-md text-[10px] font-bold items-center gap-1 ${getConnectionColor(topic.sentimentScore)}`}>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                    {topic.topCarrier} ({Math.round((topic.carrierConcentration || 0) * 100)}%)
                  </div>
                )}
                
                {/* Inline indicator for Themes mode */}
                {activeTab === 'themes' && topic.topCarrier && (
                    <span className="flex h-2 w-2 relative">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${topic.sentimentScore <= 2.5 ? 'bg-red-400' : 'bg-gray-400'}`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${topic.sentimentScore <= 2.5 ? 'bg-red-500' : 'bg-gray-500'}`}></span>
                    </span>
                )}
              </div>
            );
          })}
        </div>
        
        {activeTab === 'themes' && (
             <div className="mt-4 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
                 <span className="flex h-2 w-2 rounded-full bg-gray-400"></span>
                 <span>Indicates strong carrier correlation</span>
             </div>
        )}
      </div>
    </div>
  );
};

export default TopicAnalysis;
