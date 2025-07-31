import React, { useEffect, useState } from 'react';
import { formatCurrency } from '@/utils/formatUtils';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface RollingValueDisplayProps {
  value: number;
  label: string;
  className?: string;
  showTrendIcon?: boolean;
  trendDirection?: 'up' | 'down' | 'neutral';
  showStandardBadge?: boolean;
  isStandardPosition?: boolean;
  animationStyle?: 'rolling' | 'slotmachine' | 'rolodex' | 'digitalflip' | 'typewriter';
}

const RollingValueDisplay: React.FC<RollingValueDisplayProps> = ({ 
  value, 
  label, 
  className = "",
  showTrendIcon = false,
  trendDirection = 'up',
  showStandardBadge = false,
  isStandardPosition = false,
  animationStyle = 'rolling'
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (displayValue !== value) {
      setIsAnimating(true);
      
      const animateValue = () => {
        switch (animationStyle) {
          case 'slotmachine': {
            // Slotmaskin - snurrar snabbt genom många värden
            const duration = 800;
            const startTime = Date.now();
            const startValue = displayValue;
            const endValue = value;
            
            const animate = () => {
              const elapsed = Date.now() - startTime;
              const progress = Math.min(elapsed / duration, 1);
              
              if (progress < 0.8) {
                // Snurra snabbt genom slumpmässiga värden
                const randomValue = Math.floor(Math.random() * 50000) + Math.min(startValue, endValue);
                setDisplayValue(randomValue);
              } else {
                // Sakta ner och landa på rätt värde
                const finalProgress = (progress - 0.8) / 0.2;
                const currentValue = startValue + (endValue - startValue) * finalProgress;
                setDisplayValue(Math.round(currentValue));
              }
              
              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                setDisplayValue(endValue);
                setIsAnimating(false);
              }
            };
            
            requestAnimationFrame(animate);
            break;
          }
          
          case 'rolodex': {
            // Rolodex - blädrar genom kort-liknande värden (DUBBELT SNABBARE)
            const duration = 50; // Halverat från 100ms till 50ms för dubbel hastighet
            const startTime = Date.now();
            const startValue = displayValue;
            const endValue = value;
            const steps = 8;
            
            const animate = () => {
              const elapsed = Date.now() - startTime;
              const progress = Math.min(elapsed / duration, 1);
              
              // Skapa "bläddrings" effekt
              const stepProgress = Math.floor(progress * steps) / steps;
              const easing = 1 - Math.pow(1 - stepProgress, 2); // Ease out
              
              const currentValue = startValue + (endValue - startValue) * easing;
              setDisplayValue(Math.round(currentValue));
              
              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                setDisplayValue(endValue);
                setIsAnimating(false);
              }
            };
            
            requestAnimationFrame(animate);
            break;
          }
          
          case 'digitalflip': {
            // Digital flip - som gamla digitala klockor
            const duration = 300;
            const startTime = Date.now();
            const startValue = displayValue;
            const endValue = value;
            
            const animate = () => {
              const elapsed = Date.now() - startTime;
              const progress = Math.min(elapsed / duration, 1);
              
              // Flip-effekt med snabba hopp
              if (progress < 0.5) {
                setDisplayValue(startValue);
              } else {
                setDisplayValue(endValue);
              }
              
              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                setIsAnimating(false);
              }
            };
            
            requestAnimationFrame(animate);
            break;
          }
          
          case 'typewriter': {
            // Typewriter - "skriver" siffrorna
            const duration = 400;
            const startTime = Date.now();
            const endValue = value;
            const endString = endValue.toString();
            
            const animate = () => {
              const elapsed = Date.now() - startTime;
              const progress = Math.min(elapsed / duration, 1);
              
              const charIndex = Math.floor(progress * endString.length);
              const partialValue = parseInt(endString.substring(0, charIndex + 1)) || 0;
              setDisplayValue(partialValue);
              
              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                setDisplayValue(endValue);
                setIsAnimating(false);
              }
            };
            
            requestAnimationFrame(animate);
            break;
          }
          
          default: {
            // Standard rolling animation
            const duration = 150;
            const startValue = displayValue;
            const endValue = value;
            const startTime = Date.now();
            const steps = 3;
            
            const animate = () => {
              const elapsed = Date.now() - startTime;
              const progress = Math.min(elapsed / duration, 1);
              
              const stepProgress = Math.floor(progress * steps) / steps;
              const currentValue = startValue + (endValue - startValue) * stepProgress;
              setDisplayValue(Math.round(currentValue));
              
              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                setDisplayValue(endValue);
                setIsAnimating(false);
              }
            };
            
            requestAnimationFrame(animate);
            break;
          }
        }
      };
      
      animateValue();
    }
  }, [value, displayValue, animationStyle]);

  return (
    <div className="relative">
      {showStandardBadge && isStandardPosition && (
        <div className="absolute -top-2 -right-2 z-10">
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium border border-blue-200 shadow-sm">
            Standard
          </span>
        </div>
      )}
      <div className={`flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg shadow-sm ${className}`}>
        <div className="flex items-center gap-1 text-xs font-medium text-blue-700 mb-1">
          {showTrendIcon && (
            trendDirection === 'up' ? (
              <TrendingUp className="w-4 h-4 text-green-600 shrink-0" />
            ) : trendDirection === 'down' ? (
              <TrendingDown className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <ArrowRight className="w-4 h-4 text-blue-600 shrink-0" />
            )
          )}
          <span>Leasing</span>
        </div>
        <div className={`text-lg font-bold text-blue-900 transition-all duration-300 ${isAnimating ? 'scale-110' : 'scale-100'}`}>
          <span>{formatCurrency(displayValue)}</span>
        </div>
        <div className="text-xs text-blue-600">
          {label.includes('Styckepris') ? '/st' : '/månad'}
        </div>
      </div>
    </div>
  );
};

export default RollingValueDisplay;