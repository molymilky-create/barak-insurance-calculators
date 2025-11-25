import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CalculatorCardProps {
  title: string;
  description: string;
  icon: string;
  image: string;
  onSelect: () => void;
}

const CalculatorCard = ({ title, description, icon, image, onSelect }: CalculatorCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-40 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 right-3 text-4xl">{icon}</div>
      </div>
      <CardHeader dir="rtl">
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-right">{description}</CardDescription>
      </CardHeader>
      <CardContent dir="rtl">
        <Button onClick={onSelect} className="w-full">
          כניסה למחשבון
        </Button>
      </CardContent>
    </Card>
  );
};

export default CalculatorCard;
