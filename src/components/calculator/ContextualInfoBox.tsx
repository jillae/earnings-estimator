
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { X } from 'lucide-react';
import { useCalculator } from '@/context/CalculatorContext';

const ContextualInfoBox: React.FC = () => {
  const { currentInfoText, setCurrentInfoText } = useCalculator();
  
  if (!currentInfoText) {
    return null;
  }
  
  return (
    <Alert className="mb-4 bg-blue-50 border-blue-200 animate-fade-in">
      <div className="flex justify-between items-start">
        <AlertTitle className="text-blue-800">{currentInfoText.title}</AlertTitle>
        <button 
          onClick={() => setCurrentInfoText(null)} 
          className="text-blue-500 hover:text-blue-700"
          aria-label="Stäng"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <AlertDescription className="text-blue-700">
        {currentInfoText.body}
      </AlertDescription>
    </Alert>
  );
};

export default ContextualInfoBox;
