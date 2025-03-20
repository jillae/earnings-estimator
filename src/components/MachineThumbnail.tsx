
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
      <div className="relative w-full h-20 mb-2 rounded overflow-hidden bg-slate-100 flex items-center justify-center">
        {machine.imageUrl ? (
          <img 
            src={machine.imageUrl} 
            alt={machine.name}
            className="w-full h-full object-contain p-1"
            onError={(e) => {
              // Om bilden inte kan laddas, visa fallback-ikon
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
              // Lägg till en Computer-ikon som fallback
              const iconElement = document.createElement('div');
              iconElement.className = 'flex items-center justify-center h-full w-full';
              iconElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8 text-slate-400"><rect width="14" height="8" x="5" y="2" rx="2"></rect><rect width="20" height="8" x="2" y="14" rx="2"></rect><path d="M6 18h2"></path><path d="M12 18h6"></path></svg>';
              e.currentTarget.parentElement?.appendChild(iconElement);
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
