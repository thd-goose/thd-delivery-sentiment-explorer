import React from 'react';

interface Props {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

const SentimentBadge: React.FC<Props> = ({ score, size = 'md' }) => {
  let bgColor = 'bg-gray-200';
  let textColor = 'text-gray-800';

  if (score >= 4) {
    bgColor = 'bg-green-100';
    textColor = 'text-green-800';
  } else if (score === 3) {
    bgColor = 'bg-yellow-100';
    textColor = 'text-yellow-800';
  } else {
    bgColor = 'bg-red-100';
    textColor = 'text-red-800';
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${bgColor} ${textColor} ${sizeClasses[size]}`}>
      ★ {score.toFixed(1)}
    </span>
  );
};

export default SentimentBadge;
