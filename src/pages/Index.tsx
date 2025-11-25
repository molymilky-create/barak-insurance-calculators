import { useState } from 'react';
import Header from '@/components/Header';
import CalculatorCard from '@/components/CalculatorCard';
import HorseCalculator from '@/components/HorseCalculator';
import FarmCalculator from '@/components/FarmCalculator';
import InstructorCalculator from '@/components/InstructorCalculator';
import TrainerCalculator from '@/components/TrainerCalculator';
import LawsDatabase from '@/components/LawsDatabase';
import horseImage from '@/assets/horse.jpg';
import farmImage from '@/assets/farm.jpg';
import instructorImage from '@/assets/instructor.jpg';
import trainerImage from '@/assets/trainer.jpg';

type CalculatorType = 'horse' | 'farm' | 'instructor' | 'trainer' | null;

const Index = () => {
  const [selectedCalculator, setSelectedCalculator] = useState<CalculatorType>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background" dir="rtl">
      {/* Skip to main content link for keyboard users */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:shadow-xl focus:outline-none focus:ring-4 focus:ring-primary/50"
        aria-label="דלג לתוכן הראשי"
      >
        דלג לתוכן הראשי
      </a>
      
      <Header />
      
      {selectedCalculator === null ? (
        <>
          {/* מסך בחירת מחשבון */}
          <main id="main-content" className="container mx-auto px-6 py-12" role="main" aria-label="מחשבוני ביטוח">
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-6xl font-bold bg-gradient-to-l from-primary via-secondary to-primary bg-clip-text text-transparent mb-4 animate-scale-in">
                מחשבוני ביטוח מתקדמים
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                בחרו מחשבון, הזינו נתונים, וקבלו פרמיה שנתית ופרמיה לתקופה חלקית
              </p>
            </div>

            <section 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
              aria-label="רשימת מחשבונים זמינים"
            >
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
              
              <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <CalculatorCard
                  title="מאמני כושר ואומנויות לחימה"
                  description="ביטוח אחריות צד ג' + ביטול חריג אחריות מקצועית למאמני כושר ולחימה"
                  icon="🏋️‍♂️"
                  image={trainerImage}
                  onSelect={() => setSelectedCalculator('trainer')}
                />
              </div>
            </section>
          </main>

          {/* מודול חוקים וחוזרים */}
          <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
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
          {selectedCalculator === 'trainer' && (
            <TrainerCalculator onBack={() => setSelectedCalculator(null)} />
          )}
        </>
      )}
    </div>
  );
};

export default Index;
