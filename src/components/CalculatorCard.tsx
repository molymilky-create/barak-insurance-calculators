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
const CalculatorCard = ({
  title,
  description,
  icon,
  image,
  onSelect
}: CalculatorCardProps) => {
  return <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group border-2 hover:border-primary animate-fade-in hover-scale focus-within:ring-4 focus-within:ring-primary/50 focus-within:border-primary" role="article" aria-label={`כרטיס מחשבון: ${title}`}>
      <div className="relative h-56 overflow-hidden" role="img" aria-label={`תמונת נושא: ${title}`}>
        <img src={image} alt={`${title} - תמונת רקע מחשבון`} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-125 group-hover:rotate-2" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute bottom-6 right-6 text-7xl drop-shadow-2xl filter brightness-125 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500" role="presentation" aria-hidden="true">{icon}</div>
      </div>
      <CardHeader dir="rtl" className="pb-4">
        <CardTitle className="text-3xl font-bold text-primary group-hover:text-secondary transition-colors duration-300">{title}</CardTitle>
        <CardDescription className="text-right text-lg leading-relaxed mt-2">{description}</CardDescription>
      </CardHeader>
      <CardContent dir="rtl" className="mx-0 px-0 opacity-100">
        <Button onClick={onSelect} className="w-full bg-gradient-to-l from-primary to-secondary hover:from-secondary hover:to-primary text-white text-xl font-bold py-7 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 focus:ring-4 focus:ring-primary/50 focus:outline-none" aria-label={`פתח את ${title}`}>
          <span className="flex items-center gap-3">
            כניסה למחשבון
            <ChevronLeft className="h-6 w-6" aria-hidden="true" />
          </span>
        </Button>
      </CardContent>
    </Card>;
};
export default CalculatorCard;