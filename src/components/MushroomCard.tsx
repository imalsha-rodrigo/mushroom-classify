import { Card } from "@/components/ui/card";

interface MushroomCardProps {
  name: string;
  scientificName: string;
  image: string;
  description: string;
}

export const MushroomCard = ({ name, scientificName, image, description }: MushroomCardProps) => {
  return (
    <Card className="overflow-hidden group hover:shadow-card transition-all duration-300 hover:-translate-y-1">
      <div className="aspect-[4/3] overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-foreground mb-1">{name}</h3>
        <p className="text-sm text-muted-foreground italic mb-3">{scientificName}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </Card>
  );
};