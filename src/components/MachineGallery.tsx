
import React, { useEffect } from 'react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import MachineThumbnail from './MachineThumbnail';
import { Machine } from '@/data/machines/types';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface MachineGalleryProps {
  machines: Machine[];
  selectedMachineId: string;
  onChange: (machineId: string) => void;
}

const MachineGallery: React.FC<MachineGalleryProps> = ({
  machines,
  selectedMachineId,
  onChange
}) => {
  // Förbättrad loggning för att verifiera att val av maskin fungerar korrekt
  useEffect(() => {
    console.log(`MachineGallery: Aktuell vald maskin i carousel: ${selectedMachineId}`);
  }, [selectedMachineId]);

  const handleMachineClick = (machineId: string) => {
    console.log(`MachineGallery: Klickade på maskin med ID: ${machineId}`);
    onChange(machineId);
  };

  return (
    <div className="w-full py-4">
      <Carousel className="mx-auto w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {machines.map((machine) => (
            <CarouselItem key={machine.id} className="pl-2 md:pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
              <MachineThumbnail 
                machine={machine} 
                isSelected={selectedMachineId === machine.id}
                onClick={() => handleMachineClick(machine.id)}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center gap-4 mt-6">
          <CarouselPrevious className="relative static transform-none" />
          <CarouselNext className="relative static transform-none" />
        </div>
      </Carousel>
    </div>
  );
};

export default MachineGallery;
