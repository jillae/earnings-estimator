import React, { useEffect, useState, useRef } from 'react';
import { formatCurrency } from '@/utils/formatUtils';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import CreditInfoPopover from './CreditInfoPopover';

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
  const animationRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // FIX 5: Credits rolodex ska visa korrekta värden, t.ex. 0 vid slider max höger
    const actualValue = label.includes('Credits') && value === 0 ? 0 : value;
    console.log(`RollingValueDisplay [${label}]: value=${actualValue}, displayValue=${displayValue}`);
    
    // Rensa tidigare timeout och animation
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Om värdet är helt nytt eller första gången, starta animering direkt
    if (displayValue === 0 && actualValue > 0) {
      console.log(`RollingValueDisplay [${label}]: Första värdet, startar animering från 0 till ${actualValue}`);
      setIsAnimating(true);
      // Fortsätt till animeringslogiken istället för att sätta direkt
    }

    // FORCERA UPPDATERING för alla värdeförändringar
    if (Math.abs(displayValue - actualValue) > 0.01) {
      console.log(`RollingValueDisplay [${label}]: Värdeförändring detekterad från ${displayValue} till ${actualValue}, animationStyle=${animationStyle}`);
      
      if (isAnimating) {
        console.log(`RollingValueDisplay [${label}]: Avbryter pågående animering`);
        // Om animering pågår, avbryt och sätt direkt
        setDisplayValue(value);
        setIsAnimating(false);
        return;
      }
      
      // Starta animering direkt
      console.log(`RollingValueDisplay [${label}]: Startar ${animationStyle} animering`);
      setIsAnimating(true);
      
      const animateValue = () => {
          switch (animationStyle) {
            case 'slotmachine': {
              const duration = 800;
              const startTime = Date.now();
              const startValue = displayValue;
              const endValue = value;
              
              const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                if (progress < 0.8) {
                  const randomValue = Math.floor(Math.random() * 50000) + Math.min(startValue, endValue);
                  setDisplayValue(randomValue);
                } else {
                  const finalProgress = (progress - 0.8) / 0.2;
                  const currentValue = startValue + (endValue - startValue) * finalProgress;
                  setDisplayValue(Math.round(currentValue));
                }
                
                if (progress < 1) {
                  animationRef.current = requestAnimationFrame(animate);
                } else {
                  setDisplayValue(endValue);
                  setIsAnimating(false);
                }
              };
              
              animationRef.current = requestAnimationFrame(animate);
              break;
            }
            
            case 'rolodex': {
              const duration = 900; // Längre animation för att dölja hoppen
              const startTime = Date.now();
              const startValue = displayValue;
              const endValue = value;
              console.log(`RollingValueDisplay [${label}]: Startar rolodex-animering från ${startValue} till ${endValue}`);
              const intermediateSteps = 8; // Fler mellansteg för smidigare övergång
              
              const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Avancerad easing-kurva för riktigt smidig animation
                const easeInOutQuint = (t: number) => {
                  return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
                };
                
                const easedProgress = easeInOutQuint(progress);
                
                // Lägg till subtil "bounce" för mer realistisk känsla
                const bounceEffect = progress > 0.7 ? Math.sin((progress - 0.7) * 40) * 0.02 * (1 - progress) : 0;
                const finalProgress = easedProgress + bounceEffect;
                
                // Beräkna mellanvärden som känns naturliga
                const currentValue = startValue + (endValue - startValue) * finalProgress;
                
                // Tillämpa subtle vibration under animationen
                const vibrationX = isAnimating ? Math.sin(elapsed * 0.05) * 0.5 : 0;
                const scaleEffect = 1 + (Math.sin(progress * Math.PI) * 0.02); // Subtil pulsation
                
                setDisplayValue(Math.round(currentValue));
                
                // Förbättrad 3D-transformation med perspektiv
                const containerElement = document.querySelector(`[data-rolling="${label.toLowerCase().replace(/\s+/g, '-')}"]`);
                console.log(`RollingValueDisplay [${label}]: Hittade element:`, containerElement, `data-rolling="${label.toLowerCase().replace(/\s+/g, '-')}"`);
                if (containerElement instanceof HTMLElement) {
                  const rotationY = progress * 180; // Halvera rotationen för stabilitet  
                  const rotationX = Math.sin(progress * Math.PI) * 5; // Lägg till X-rotation för 3D-effekt
                  const translateZ = Math.sin(progress * Math.PI) * 10;
                  
                  containerElement.style.transform = `
                    perspective(1000px) 
                    rotateY(${rotationY}deg) 
                    rotateX(${rotationX}deg) 
                    translateZ(${translateZ}px) 
                    translateX(${vibrationX}px)
                    scale(${scaleEffect})
                  `;
                  containerElement.style.transformStyle = 'preserve-3d';
                }
                
                if (progress < 1) {
                  animationRef.current = requestAnimationFrame(animate);
                } else {
                  setDisplayValue(endValue);
                  setIsAnimating(false);
                  // Mjuk återställning av transformation
                  const containerElement = document.querySelector(`[data-rolling="${label.toLowerCase().replace(/\s+/g, '-')}"]`);
                  if (containerElement instanceof HTMLElement) {
                    containerElement.style.transition = 'transform 0.3s ease-out';
                    containerElement.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0px) scale(1)';
                    
                    // Ta bort transition efter återställning
                    setTimeout(() => {
                      containerElement.style.transition = '';
                    }, 300);
                  }
                }
              };
              
              animationRef.current = requestAnimationFrame(animate);
              break;
            }
            
            case 'digitalflip': {
              const duration = 300;
              const startTime = Date.now();
              const startValue = displayValue;
              const endValue = value;
              
              const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                if (progress < 0.5) {
                  setDisplayValue(startValue);
                } else {
                  setDisplayValue(endValue);
                }
                
                if (progress < 1) {
                  animationRef.current = requestAnimationFrame(animate);
                } else {
                  setIsAnimating(false);
                }
              };
              
              animationRef.current = requestAnimationFrame(animate);
              break;
            }
            
            case 'typewriter': {
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
                  animationRef.current = requestAnimationFrame(animate);
                } else {
                  setDisplayValue(endValue);
                  setIsAnimating(false);
                }
              };
              
              animationRef.current = requestAnimationFrame(animate);
              break;
            }
            
            default: {
              // Standard rolling animation - MER SMOOTH
              const duration = 200; // Långsammare för mindre flimmer
              const startValue = displayValue;
              const endValue = value;
              const startTime = Date.now();
              
              const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Smooth easing
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                const currentValue = startValue + (endValue - startValue) * easeProgress;
                setDisplayValue(Math.round(currentValue));
                
                if (progress < 1) {
                  animationRef.current = requestAnimationFrame(animate);
                } else {
                  setDisplayValue(endValue);
                  setIsAnimating(false);
                }
              };
              
              animationRef.current = requestAnimationFrame(animate);
              break;
            }
          }
        };
        
        animateValue();
    }

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, displayValue, animationStyle, isAnimating]);

  return (
    <div className="relative">
      {showStandardBadge && isStandardPosition && (
        <div className="absolute -top-2 -right-2 z-10">
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium border border-blue-200 shadow-sm">
            Standard
          </span>
        </div>
      )}
      {/* Credits info badge i höger hörn */}
      {label.includes('Credits') && (
        <div className="absolute -top-1 -right-1 z-20">
          <CreditInfoPopover />
        </div>
      )}
      <div 
        data-rolling={label.toLowerCase().replace(/\s+/g, '-')}
        className={`flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg shadow-sm transition-all duration-200 ${className} ${isAnimating ? 'shadow-lg border-blue-300' : ''}`}
        style={{ transformOrigin: 'center' }}
      >
        <div className="flex items-center gap-1 text-xs font-medium text-blue-700 mb-1">
          {showTrendIcon && (
            <ArrowRight className="w-4 h-4 text-blue-600 shrink-0 rotate-90" />
          )}
          <span>{label}</span>
        </div>
        <div className={`text-lg font-bold text-blue-900 transition-all duration-300 select-none ${isAnimating ? 'scale-110 text-blue-800' : 'scale-100'}`}>
          <span>{formatCurrency(displayValue)}</span>
        </div>
        <div className="text-xs text-blue-600">
          {label.includes('Credits') ? '/styck' : label.includes('Styckepris') ? '/st' : '/månad'}
        </div>
      </div>
    </div>
  );
};

export default RollingValueDisplay;