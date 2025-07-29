import React from 'react';
import { Info } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const FlatrateTooltip: React.FC = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors">
            <Info className="w-3 h-3" />
            Flatrate-info
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs p-3">
          <div className="text-xs space-y-2">
            <p className="font-medium">Flatrate för credits:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Kan ändras efter köp med 30 dagars uppsägningstid</li>
              <li>Tillgängligt enligt whitepaper-reglerna</li>
              <li>Påverkar både creditkostnad och total leasingavgift</li>
            </ul>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FlatrateTooltip;