import { useState } from 'react';
import Header from '@/components/Header';
import CalculatorCard from '@/components/CalculatorCard';
import HorseCalculator from '@/components/HorseCalculator';
import FarmCalculator from '@/components/FarmCalculator';
import InstructorCalculator from '@/components/InstructorCalculator';
import LawsDatabase from '@/components/LawsDatabase';
import horseImage from '@/assets/horse.jpg';
import farmImage from '@/assets/farm.jpg';
import instructorImage from '@/assets/instructor.jpg';

type CalculatorType = 'horse' | 'farm' | 'instructor' | null;

const Index = () => {
  const [selectedCalculator, setSelectedCalculator] = useState<CalculatorType>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background" dir="rtl">
      <Header />
      
      {selectedCalculator === null ? (
        <>
          {/* מסך בחירת מחשבון */}
          <main className="container mx-auto px-6 py-12">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-6xl font-bold bg-gradient-to-l from-primary via-secondary to-primary bg-clip-text text-transparent mb-4 animate-scale-in">
                מחשבוני ביטוח מתקדמים
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                בחרו מחשבון, הזינו נתונים, וקבלו פרמיה שנתית ופרמיה לתקופה חלקית
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <CalculatorCard
                  title="ביטוח סוסים"
                  description="חישוב פרמיה עבור ביטוח צד ג', ביטוח חיים ובריאות לסוסים פרטיים"
                  icon="🐴"
                  image={horseImage}
                  onSelect={() => setSelectedCalculator('horse')}
                />
              </div>
              
              <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <CalculatorCard
                  title="ביטוח חוות סוסים"
                  description="חישוב פרמיה עבור ביטוח חבות מעבידים, צד ג' וביטוח רכוש לחוות"
                  icon="🐎"
                  image={farmImage}
                  onSelect={() => setSelectedCalculator('farm')}
                />
              </div>
              
              <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <CalculatorCard
                  title="ביטוח מדריכי רכיבה"
                  description="חישוב פרמיה עבור ביטוח אחריות מקצועית וצד ג' למדריכי רכיבה"
                  icon="🏇"
                  image={instructorImage}
                  onSelect={() => setSelectedCalculator('instructor')}
                />
              </div>
            </div>
          </main>

          {/* מודול חוקים וחוזרים */}
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <LawsDatabase />
          </div>
        </>
      ) : (
        <>
          {selectedCalculator === 'horse' && (
            <HorseCalculator onBack={() => setSelectedCalculator(null)} />
          )}
          {selectedCalculator === 'farm' && (
            <FarmCalculator onBack={() => setSelectedCalculator(null)} />
          )}
          {selectedCalculator === 'instructor' && (
            <InstructorCalculator onBack={() => setSelectedCalculator(null)} />
          )}
        </>
      )}
    </div>
  );
};

export default Index;
