
import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Computer, ExternalLink } from 'lucide-react';
import { Machine } from '@/data/machines/types';
import { Button } from '@/components/ui/button';

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
      "xlr8": "https://i.imgur.com/RZIgGZY.png",
      "evrl": "https://i.imgur.com/cuTXUCb.png",
      "gvl": "https://i.imgur.com/8G0fOsI.png",
      "base-station": "https://i.imgur.com/lnCem77.png",
      "lunula": "https://i.imgur.com/QHbeZpX.jpg"
    };

    return placeholders[machineId] || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=300&h=200&q=80";
  };

  const getProductUrl = (machineId: string) => {
    const productUrls: {[key: string]: string} = {
      "emerald": "https://emeraldnordics.lovable.app/products?tab=emerald",
      "zerona": "https://emeraldnordics.lovable.app/products?tab=zerona", 
      "fx-635": "https://emeraldnordics.lovable.app/products?tab=fx635",
      "fx-405": "https://emeraldnordics.lovable.app/products?tab=fx405",
      "evrl": "https://emeraldnordics.lovable.app/products?tab=evrl",
      "gvl": "https://emeraldnordics.lovable.app/products?tab=gvl",
      "lunula": "https://emeraldnordics.lovable.app/products?tab=lunula"
    };
    
    return productUrls[machineId];
  };
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('MachineThumbnail: Klickar på', machine.name);
    console.log('MachineThumbnail: Anropar onClick...');
    
    try {
      onClick();
      console.log('MachineThumbnail: onClick slutförd');
    } catch (error) {
      console.error('MachineThumbnail: Fel i onClick:', error);
    }
  };

  return (
    <div 
      className={cn(
        "flex flex-col items-center p-2 rounded-lg transition-all cursor-pointer border select-none",
        isSelected ? "border-2 border-primary bg-slate-50 shadow-md" : "border-slate-200 hover:bg-slate-100"
      )}
      onClick={handleClick}
      onMouseDown={(e) => e.preventDefault()}
      data-machine-id={machine.id}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e as any);
        }
      }}
      style={{ 
        userSelect: 'none',
        WebkitUserSelect: 'none',
        pointerEvents: 'auto',
        zIndex: 10
      }}
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
        {getProductUrl(machine.id) && (
          <Button
            variant="outline"
            size="sm"
            className="mt-2 h-7 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              window.open(getProductUrl(machine.id), '_blank');
            }}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Läs mer
          </Button>
        )}
      </div>
    </div>
  );
};

export default MachineThumbnail;
