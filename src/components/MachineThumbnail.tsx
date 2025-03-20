
import React from 'react';
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
  return (
    <div 
      className={cn(
        "flex flex-col items-center p-2 rounded-lg transition-all cursor-pointer hover:bg-slate-100",
        isSelected && "border-2 border-primary bg-slate-50",
        !isSelected && "border border-slate-200"
      )}
      onClick={onClick}
    >
      <div className="relative w-full h-20 mb-2 rounded overflow-hidden bg-slate-100">
        {machine.imageUrl ? (
          <img 
            src={machine.imageUrl} 
            alt={machine.name}
            className="w-full h-full object-contain"
            onError={(e) => {
              // Om bilden inte kan laddas, visa fallback-ikon
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full bg-slate-200">
            <Computer className="h-8 w-8 text-slate-400" />
          </div>
        )}
      </div>
      <div className="text-center">
        <h3 className="font-medium text-xs">{machine.name}</h3>
        {machine.modelCode && (
          <p className="text-xs text-slate-500">({machine.modelCode})</p>
        )}
        <p className="text-xs text-slate-500 line-clamp-1 h-4 mt-1">{machine.description}</p>
      </div>
    </div>
  );
};

export default MachineThumbnail;
