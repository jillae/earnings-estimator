import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Machine } from '@/data/machines/types';
import { Computer } from 'lucide-react';

interface MachineThumbnailProps {
  machine: Machine;
  isSelected: boolean;
  onClick: () => void;
}

const MachineThumbnail: React.FC<MachineThumbnailProps> = ({
  machine,
  isSelected,
  onClick
}) => {
  const [imageError, setImageError] = useState(false);

  const getPlaceholderImageForMachine = (machineId: string) => {
    const placeholders: {[key: string]: string} = {
      "emerald": "https://i.imgur.com/IRED95Z.png",
      "zerona": "https://i.imgur.com/2LGOVPB.png",
      "fx-635": "https://i.imgur.com/TQK3vZ3.png", 
      "fx-405": "https://i.imgur.com/pYqFUUT.png",
      "evrl": "https://i.imgur.com/pYqFUUT.png",
      "xlr8": "https://i.imgur.com/8G0fOsI.png",
      "gvl": "https://i.imgur.com/8G0fOsI.png",
      "base-station": "https://i.imgur.com/lnCem77.png",
      "lunula": "https://i.imgur.com/QHbeZpX.jpg"
    };

    return placeholders[machineId] || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=300&h=200&q=80";
  };

  return (
    <button
      type="button"
      className={cn(
        "w-full p-3 rounded-lg border-2 transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
        isSelected
          ? "border-blue-500 bg-blue-50 shadow-md"
          : "border-slate-200 hover:border-blue-300 bg-white"
      )}
      onClick={onClick}
    >
      <div className="relative w-full h-24 mb-2 rounded overflow-hidden bg-slate-100 flex items-center justify-center">
        {imageError ? (
          <Computer className="h-10 w-10 text-slate-400" />
        ) : (
          <img 
            src={machine.imageUrl || getPlaceholderImageForMachine(machine.id)} 
            alt={machine.name}
            className="w-full h-full object-contain"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        )}
      </div>
      <div className="text-center w-full">
        <h3 className="font-medium text-sm truncate">{machine.name}</h3>
        {machine.modelCode && (
          <p className="text-xs text-slate-500">({machine.modelCode})</p>
        )}
      </div>
    </button>
  );
};

export default MachineThumbnail;