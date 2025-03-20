
import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Computer } from 'lucide-react';
import { Machine } from '@/data/machines/types';

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

  // Förbättrad hantering av placeholder-bilder baserat på maskin-ID
  const getPlaceholderImageForMachine = (machineId: string) => {
    // Använd bilderna från imgur länken
    const placeholders: {[key: string]: string} = {
      "emerald": "https://i.imgur.com/PdFIJxl.png",
      "zerona": "https://i.imgur.com/5GELRUf.png",
      "fx-635": "https://i.imgur.com/u3WGXhO.png",
      "fx-405": "https://i.imgur.com/kIFJq1n.png",
      "xlr8": "https://i.imgur.com/MFvpKrF.png",
      "evrl": "https://i.imgur.com/T5pLQoJ.png",
      "gvl": "https://i.imgur.com/DGbmYP4.png",
      "base-station": "https://i.imgur.com/pNkHV5A.png",
      "lunula": "https://i.imgur.com/W4GvUyU.png"
    };

    return placeholders[machineId] || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=300&h=200&q=80";
  };
  
  return (
    <div 
      className={cn(
        "flex flex-col items-center p-2 rounded-lg transition-all cursor-pointer border",
        isSelected ? "border-2 border-primary bg-slate-50 shadow-md" : "border-slate-200 hover:bg-slate-100"
      )}
      onClick={() => {
        console.log(`Klickade på maskin med ID: ${machine.id}`);
        onClick();
      }}
      data-machine-id={machine.id}
      role="button"
      aria-pressed={isSelected}
    >
      <div className="relative w-full h-24 mb-2 rounded overflow-hidden bg-slate-100 flex items-center justify-center">
        {imageError ? (
          <Computer className="h-10 w-10 text-slate-400" />
        ) : (
          <img 
            src={getPlaceholderImageForMachine(machine.id)} 
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
    </div>
  );
};

export default MachineThumbnail;
