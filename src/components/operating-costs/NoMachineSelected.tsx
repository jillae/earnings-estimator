
import React from 'react';
import { Info } from 'lucide-react';

const NoMachineSelected: React.FC = () => {
  return (
    <div className="glass-card mt-4 animate-slide-in" style={{ animationDelay: '300ms' }}>
      <h3 className="text-lg font-semibold mb-4">Detaljer Driftskostnad</h3>
      <div className="flex items-center justify-center p-6 bg-gray-50 border border-gray-200 rounded-md">
        <div className="flex items-center gap-2 text-gray-600">
          <Info className="h-5 w-5 text-blue-500" />
          <p>Välj en maskin för att se driftskostnader</p>
        </div>
      </div>
    </div>
  );
};

export default NoMachineSelected;
