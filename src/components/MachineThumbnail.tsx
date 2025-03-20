
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
    const placeholders: {[key: string]: string} = {
      "emerald": "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=300&h=200&q=80",
      "zerona": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&h=200&q=80",
      "fx-635": "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=300&h=200&q=80",
      "fx-405": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=300&h=200&q=80",
      "xlr8": "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=300&h=200&q=80",
      "evrl": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=300&h=200&q=80",
      "gvl": "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=300&h=200&q=80",
      "base-station": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&h=200&q=80",
      "lunula": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=300&h=200&q=80"
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
            className="w-full h-full object-cover"
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
