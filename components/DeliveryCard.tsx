import React from 'react';
import { DeliveryRecord } from '../types';
import SentimentBadge from './SentimentBadge';

interface Props {
  delivery: DeliveryRecord;
  onClick?: () => void;
  isSelected?: boolean;
}

const DeliveryCard: React.FC<Props> = ({ delivery, onClick, isSelected }) => {
  return (
    <div 
      onClick={onClick}
      className={`p-4 mb-3 rounded-lg border transition-all cursor-pointer shadow-sm hover:shadow-md bg-white ${isSelected ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'}`}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-semibold text-gray-900">{delivery.city}, {delivery.state}</h4>
          <p className="text-xs text-gray-500">{new Date(delivery.date).toLocaleDateString()}</p>
        </div>
        <SentimentBadge score={delivery.csat} size="sm" />
      </div>
      
      <p className="text-sm text-gray-700 mb-3 italic line-clamp-2">"{delivery.comment}"</p>
      
      <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
        <span className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          {delivery.carrier}
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m8-2a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10v-4a2 2 0 00-2-2z"></path></svg>
          {delivery.store}
        </span>
      </div>
    </div>
  );
};

export default DeliveryCard;
