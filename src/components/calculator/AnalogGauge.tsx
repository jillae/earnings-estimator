import React from 'react';
import { formatCurrency } from '@/utils/formatUtils';

interface AnalogGaugeProps {
  value: number;
  minValue: number;
  maxValue: number;
  standardValue: number;
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
  label,
  unit = '/månad',
  className = "",
  reversed = false
}) => {
  // Använd de faktiska min/max-värdena direkt
  const normalizedValue = Math.max(0, Math.min(1, (value - minValue) / (maxValue - minValue)));
  const normalizedStandard = (standardValue - minValue) / (maxValue - minValue);
  
  // Konvertera till grader: kl 9 (-90°) till kl 3 (+90°)
  const angle = -90 + (normalizedValue * 180);
  const standardAngle = -90 + (normalizedStandard * 180);
  
  // Beräkna färg baserat på position relativt standard med bredare gult område
  const getColor = (normalized: number) => {
    const standardPos = normalizedStandard;
    const distanceFromStandard = Math.abs(normalized - standardPos);
    
    // Bredare gult område - täcker ungefär 40% av skalan (motsvarar slider pos 1-3)
    const yellowZoneWidth = 0.2; // 20% åt varje håll från standard = 40% totalt
    
    if (distanceFromStandard <= yellowZoneWidth) {
      // Inom gul zon = standard/neutral område
      return 'hsl(50, 70%, 60%)';
    }
    
    // Bestäm om vi är på "bra" eller "dålig" sida baserat på reversed flag
    const isOnGoodSide = reversed ? 
      (normalized < standardPos - yellowZoneWidth) : // För Credits: lägre än gul zon = bra
      (normalized < standardPos - yellowZoneWidth);  // För Leasing: lägre än gul zon = bra
    
    if (isOnGoodSide) {
      // Grön skala för bra sida
      const intensity = (distanceFromStandard - yellowZoneWidth) / (0.5 - yellowZoneWidth);
      return `hsl(${120}, ${70 + intensity * 20}%, ${50 + intensity * 15}%)`;
    } else {
      // Röd skala för dålig sida  
      const intensity = (distanceFromStandard - yellowZoneWidth) / (0.5 - yellowZoneWidth);
      return `hsl(${0 + intensity * 10}, ${70 + intensity * 20}%, ${50 + intensity * 15}%)`;
    }
  };

  const needleColor = getColor(normalizedValue);

  // Skapa gradient för bakgrund
  const createGradient = () => {
    const steps = 20;
    const gradientStops = [];
    for (let i = 0; i <= steps; i++) {
      const pos = i / steps;
      const color = getColor(pos);
      const angle = -90 + (pos * 180);
      gradientStops.push({ angle, color });
    }
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
          
          {/* Standard markering */}
          <circle
            cx={64 + 49 * Math.cos((standardAngle * Math.PI) / 180)}
            cy={64 + 49 * Math.sin((standardAngle * Math.PI) / 180)}
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
            const tickAngle = -90 + (pos * 180);
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
        <div className="text-lg font-bold text-slate-800" style={{ color: needleColor }}>
          {formatCurrency(value)}
        </div>
        <div className="text-xs text-slate-500">{unit}</div>
      </div>
    </div>
  );
};

export default AnalogGauge;