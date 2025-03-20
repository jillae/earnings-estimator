
import React from 'react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import MachineThumbnail from './MachineThumbnail';
import { Machine } from '@/data/machines/types';

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
  return (
    <div className="w-full py-2">
      <Carousel className="mx-auto w-full">
        <CarouselContent className="-ml-2">
          {machines.map((machine) => (
            <CarouselItem key={`gallery-${machine.id}`} className="pl-2 md:basis-1/3 lg:basis-1/4">
              <MachineThumbnail 
                machine={machine} 
                isSelected={selectedMachineId === machine.id}
                onClick={() => onChange(machine.id)}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-end gap-2 mt-2">
          <CarouselPrevious className="relative static transform-none" />
          <CarouselNext className="relative static transform-none" />
        </div>
      </Carousel>
    </div>
  );
};

export default MachineGallery;
