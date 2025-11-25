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
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      
      {selectedCalculator === null ? (
        <>
          {/* מסך בחירת מחשבון */}
          <main className="container mx-auto px-6 py-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                מחשבוני ביטוח
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                בחרו מחשבון, הזינו נתונים, וקבלו פרמיה שנתית ופרמיה לתקופה חלקית
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <CalculatorCard
                title="ביטוח סוסים"
                description="חישוב פרמיה עבור ביטוח צד ג', ביטוח חיים ובריאות לסוסים פרטיים"
                icon="🐴"
                image={horseImage}
                onSelect={() => setSelectedCalculator('horse')}
              />
              
              <CalculatorCard
                title="ביטוח חוות סוסים"
                description="חישוב פרמיה עבור ביטוח חבות מעבידים, צד ג' וביטוח רכוש לחוות"
                icon="🐎"
                image={farmImage}
                onSelect={() => setSelectedCalculator('farm')}
              />
              
              <CalculatorCard
                title="ביטוח מדריכי רכיבה"
                description="חישוב פרמיה עבור ביטוח אחריות מקצועית וצד ג' למדריכי רכיבה"
                icon="🏇"
                image={instructorImage}
                onSelect={() => setSelectedCalculator('instructor')}
              />
            </div>
          </main>

          {/* מודול חוקים וחוזרים */}
          <LawsDatabase />
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
