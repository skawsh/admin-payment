
import React from 'react';
import { Shirt, Zap } from 'lucide-react';
import { ClothingItem } from './types';

interface ClothingItemViewProps {
  item: ClothingItem;
  serviceIndex?: number;
  subserviceIndex?: number;
  itemIndex?: number;
}

const ClothingItemView: React.FC<ClothingItemViewProps> = ({ 
  item,
  serviceIndex = 1,
  subserviceIndex = 1,
  itemIndex = 1
}) => {
  return (
    <div className="flex items-center justify-between bg-white rounded-md p-3 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <div className="flex items-center">
        <Shirt className="h-4 w-4 text-gray-400 mr-2" />
        <div className="font-medium text-gray-700">
          {item.name}
          <span className="sr-only">{serviceIndex}.{subserviceIndex}.{itemIndex}</span>
        </div>
      </div>
      <div className="flex flex-col text-right">
        <div className="text-gray-800">
          <span className="text-xs text-gray-500 mr-1">Standard:</span>
          <span className="font-semibold">₹{item.price}</span>
        </div>
        {item.expressPrice && (
          <div className="flex items-center justify-end text-amber-600">
            <span className="text-xs text-amber-500 mr-1">Express:</span>
            <Zap className="h-3 w-3 mr-1" />
            <span className="font-semibold">₹{item.expressPrice}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClothingItemView;
