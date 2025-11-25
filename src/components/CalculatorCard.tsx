import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';

interface CalculatorCardProps {
  title: string;
  description: string;
  icon: string;
  image: string;
  onSelect: () => void;
}

const CalculatorCard = ({ title, description, icon, image, onSelect }: CalculatorCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border-2 hover:border-primary">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
        <div className="absolute bottom-4 right-4 text-5xl drop-shadow-lg filter brightness-110">{icon}</div>
      </div>
      <CardHeader dir="rtl">
        <CardTitle className="text-2xl text-primary">{title}</CardTitle>
        <CardDescription className="text-right text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent dir="rtl">
        <Button onClick={onSelect} className="w-full bg-secondary hover:bg-secondary/90 text-lg py-6">
          כניסה למחשבון
          <ChevronLeft className="mr-2 h-5 w-5" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default CalculatorCard;
