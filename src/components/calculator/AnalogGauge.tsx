import React from 'react';
import { formatCurrency } from '@/utils/formatUtils';

interface AnalogGaugeProps {
  value: number;
  minValue: number;
  maxValue: number;
  standardValue: number;
  currentStep: number;
  label: string;
  unit?: string;
  className?: string;
  reversed?: boolean; // true om låga värden är bra (som för Credits)
}

const AnalogGauge: React.FC<AnalogGaugeProps> = ({
  value,
  minValue,
  maxValue,
  standardValue,
  currentStep,
  label,
  unit = '/månad',
  className = "",
  reversed = false
}) => {
  // Enkel mappning från slider steg till vinkel
  const stepToAngle = (step: number): number => {
    if (reversed) {
      // Omvänd rörelse för credits-mätare
      switch (step) {
        case 0: return 0;    // 3 o'clock
        case 1: return -45;  // 1:30
        case 2: return -90;  // 12 o'clock (Standard)
        case 3: return -135; // 10:30
        case 4: return -180; // 9 o'clock
        default: return -90; // Default till standard
      }
    } else {
      // Normal rörelse för leasing-mätare
      switch (step) {
        case 0: return -180; // 9 o'clock
        case 1: return -135; // 10:30
        case 2: return -90;  // 12 o'clock (Standard)
        case 3: return -45;  // 1:30
        case 4: return 0;    // 3 o'clock
        default: return -90; // Default till standard
      }
    }
  };
  
  const angle = stepToAngle(currentStep);
  
  // Beräkna normaliserade värden för färgfunktionen
  const normalizedValue = (value - minValue) / (maxValue - minValue);
  const normalizedStandard = (standardValue - minValue) / (maxValue - minValue);
  
  // Beräkna färg baserat på slider steg
  const getColor = (step: number) => {
    if (step === 2) {
      // Steg 2 = Standard = gul
      return 'hsl(50, 70%, 60%)';
    } else if (step === 1 || step === 3) {
      // Steg 1 och 3 = gul zon
      return 'hsl(50, 70%, 60%)';
    } else {
      // Steg 0 och 4 = röd/grön beroende på reversed
      const isGoodSide = reversed ? (step === 4) : (step === 0);
      return isGoodSide ? 
        'hsl(120, 80%, 55%)' : // Grön för bra sida
        'hsl(0, 80%, 55%)';    // Röd för dålig sida
    }
  };

  const needleColor = getColor(currentStep);

  // Skapa gradient för bakgrund baserat på steg
  const createGradient = () => {
    const gradientStops = [
      { angle: -180, color: reversed ? 'hsl(0, 80%, 55%)' : 'hsl(120, 80%, 55%)' }, // Steg 0
      { angle: -135, color: 'hsl(50, 70%, 60%)' }, // Steg 1 - gul
      { angle: -90,  color: 'hsl(50, 70%, 60%)' }, // Steg 2 - gul
      { angle: -45,  color: 'hsl(50, 70%, 60%)' }, // Steg 3 - gul
      { angle: 0,    color: reversed ? 'hsl(120, 80%, 55%)' : 'hsl(0, 80%, 55%)' }  // Steg 4
    ];
    return gradientStops;
  };

  const gradientStops = createGradient();

  return (
    <div className={`flex flex-col items-center p-4 ${className}`}>
      {/* Mätare container */}
      <div className="relative w-32 h-20 mb-2">
        {/* Bakgrund arc */}
        <svg
          width="128"
          height="80"
          viewBox="0 0 128 80"
          className="absolute inset-0"
        >
          {/* Mätare bakgrund */}
          <defs>
            <linearGradient id={`gauge-gradient-${label.toLowerCase().replace(/\s+/g, '-')}`} x1="0%" y1="0%" x2="100%" y2="0%">
              {gradientStops.map((stop, index) => (
                <stop
                  key={index}
                  offset={`${(index / (gradientStops.length - 1)) * 100}%`}
                  stopColor={stop.color}
                />
              ))}
            </linearGradient>
          </defs>
          
          {/* Yttre ring */}
          <path
            d="M 15 64 A 49 49 0 0 1 113 64"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="8"
          />
          
          {/* Färgad arc */}
          <path
            d="M 15 64 A 49 49 0 0 1 113 64"
            fill="none"
            stroke={`url(#gauge-gradient-${label.toLowerCase().replace(/\s+/g, '-')})`}
            strokeWidth="6"
            strokeLinecap="round"
          />
          
          {/* Standard markering alltid på 12-positionen (-90°) */}
          <circle
            cx={64 + 49 * Math.cos((-90 * Math.PI) / 180)}
            cy={64 + 49 * Math.sin((-90 * Math.PI) / 180)}
            r="3"
            fill="#fbbf24"
            stroke="#ffffff"
            strokeWidth="1"
          />
          
          {/* Nål */}
          <g transform={`translate(64, 64) rotate(${angle})`}>
            <line
              x1="0"
              y1="0"
              x2="40"
              y2="0"
              stroke={needleColor}
              strokeWidth="3"
              strokeLinecap="round"
              style={{
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            />
          </g>
          
          {/* Centrum punkt */}
          <circle
            cx="64"
            cy="64"
            r="4"
            fill="#374151"
            stroke="#ffffff"
            strokeWidth="1"
          />
          
          {/* Skala markeringar */}
          {[0, 0.25, 0.5, 0.75, 1].map((pos, index) => {
            const tickAngle = -180 + (pos * 180);
            const tickX1 = 64 + 45 * Math.cos((tickAngle * Math.PI) / 180);
            const tickY1 = 64 + 45 * Math.sin((tickAngle * Math.PI) / 180);
            const tickX2 = 64 + 49 * Math.cos((tickAngle * Math.PI) / 180);
            const tickY2 = 64 + 49 * Math.sin((tickAngle * Math.PI) / 180);
            
            return (
              <line
                key={index}
                x1={tickX1}
                y1={tickY1}
                x2={tickX2}
                y2={tickY2}
                stroke="#64748b"
                strokeWidth="1"
              />
            );
          })}
        </svg>
      </div>
      
      {/* Värde display */}
      <div className="text-center">
        <div className="text-xs font-medium text-slate-600 mb-1">{label}</div>
        <div className="text-lg font-bold text-slate-800">
          {formatCurrency(value)}
        </div>
        <div className="text-xs text-slate-500">{unit}</div>
      </div>
    </div>
  );
};

export default AnalogGauge;