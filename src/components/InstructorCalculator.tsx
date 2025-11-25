import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowRight } from 'lucide-react';

interface InstructorCalculatorProps {
  onBack: () => void;
}

const InstructorCalculator = ({ onBack }: InstructorCalculatorProps) => {
  const [professionalLiability, setProfessionalLiability] = useState('yes');
  const [publicLiability, setPublicLiability] = useState('yes');
  const [numInstructors, setNumInstructors] = useState('1');
  const [coverage, setCoverage] = useState('standard');
  const [annualRevenue, setAnnualRevenue] = useState('200000');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [annualPremium, setAnnualPremium] = useState(0);
  const [periodPremium, setPeriodPremium] = useState(0);
  const [days, setDays] = useState(0);

  const calculatePremium = () => {
    let total = 0;
    const instructors = parseInt(numInstructors) || 0;
    const revenue = parseInt(annualRevenue) || 0;
    
    // חישוב בסיסי - יש לעדכן עם הלוגיקה המדויקת שלך
    if (professionalLiability === 'yes') {
      total += instructors * 2500; // דוגמה
      if (coverage === 'extended') total += instructors * 1000;
    }
    
    if (publicLiability === 'yes') {
      total += 2000; // בסיס
      total += revenue * 0.001; // 0.1% מהמחזור
    }
    
    setAnnualPremium(Math.round(total));
  };

  const calculatePeriodPremium = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      
      if (daysDiff > 0) {
        setDays(daysDiff);
        const periodTotal = Math.round((annualPremium / 365) * daysDiff);
        setPeriodPremium(periodTotal);
      } else {
        setDays(0);
        setPeriodPremium(0);
      }
    } else {
      setDays(0);
      setPeriodPremium(0);
    }
  };

  useEffect(() => {
    calculatePremium();
  }, [professionalLiability, publicLiability, numInstructors, coverage, annualRevenue]);

  useEffect(() => {
    calculatePeriodPremium();
  }, [startDate, endDate, annualPremium]);

  return (
    <div className="container mx-auto px-6 py-8" dir="rtl">
      <Button variant="outline" onClick={onBack} className="mb-6">
        <ArrowRight className="ml-2 h-4 w-4" />
        חזרה למסך בחירה
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">מחשבון ביטוח מדריכי רכיבה</CardTitle>
          <CardDescription>הזן את הפרטים לחישוב הפרמיה</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* חבות מקצועית */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">ביטוח אחריות מקצועית</Label>
            <RadioGroup value={professionalLiability} onValueChange={setProfessionalLiability}>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="yes" id="prof-yes" />
                <Label htmlFor="prof-yes" className="cursor-pointer">כן</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="no" id="prof-no" />
                <Label htmlFor="prof-no" className="cursor-pointer">לא</Label>
              </div>
            </RadioGroup>
          </div>

          {/* מספר מדריכים */}
          <div className="space-y-3">
            <Label htmlFor="num-instructors" className="text-base font-semibold">מספר מדריכים</Label>
            <Input
              id="num-instructors"
              type="number"
              value={numInstructors}
              onChange={(e) => setNumInstructors(e.target.value)}
              className="text-right"
            />
          </div>

          {/* רמת כיסוי */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">רמת כיסוי</Label>
            <RadioGroup value={coverage} onValueChange={setCoverage}>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="standard" id="cov-standard" />
                <Label htmlFor="cov-standard" className="cursor-pointer">סטנדרט (עד 1M ₪)</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="extended" id="cov-extended" />
                <Label htmlFor="cov-extended" className="cursor-pointer">מורחב (עד 2M ₪)</Label>
              </div>
            </RadioGroup>
          </div>

          {/* חבות כלפי ציבור */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">ביטוח צד ג' (חבות כלפי הציבור)</Label>
            <RadioGroup value={publicLiability} onValueChange={setPublicLiability}>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="yes" id="pub-yes" />
                <Label htmlFor="pub-yes" className="cursor-pointer">כן</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="no" id="pub-no" />
                <Label htmlFor="pub-no" className="cursor-pointer">לא</Label>
              </div>
            </RadioGroup>
          </div>

          {/* מחזור שנתי */}
          {publicLiability === 'yes' && (
            <div className="space-y-3">
              <Label htmlFor="annual-revenue" className="text-base font-semibold">מחזור שנתי משוער (₪)</Label>
              <Input
                id="annual-revenue"
                type="number"
                value={annualRevenue}
                onChange={(e) => setAnnualRevenue(e.target.value)}
                className="text-right"
              />
            </div>
          )}

          {/* תוצאת חישוב שנתי */}
          <Card className="bg-primary/5 border-primary">
            <CardHeader>
              <CardTitle>סך הכל לתשלום (שנתי)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-3xl font-bold text-primary">
                {annualPremium.toLocaleString('he-IL')} ₪
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                {professionalLiability === 'yes' && (
                  <div>
                    • אחריות מקצועית ({numInstructors} מדריכים, כיסוי {coverage === 'extended' ? 'מורחב' : 'סטנדרט'}) – 
                    {' '}{(parseInt(numInstructors) * 2500 + (coverage === 'extended' ? parseInt(numInstructors) * 1000 : 0)).toLocaleString('he-IL')} ₪
                  </div>
                )}
                {publicLiability === 'yes' && (
                  <div>
                    • ביטוח צד ג' – {(2000 + parseInt(annualRevenue) * 0.001).toLocaleString('he-IL')} ₪
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* חישוב לפי תאריכים */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold">חישוב לתקופה מסוימת</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">תאריך תחילת ביטוח</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">תאריך סיום ביטוח</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            
            {days > 0 && (
              <Card className="bg-secondary/10 border-secondary">
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <div className="text-xl font-semibold">
                      הפרמיה לתקופה שנבחרה: {periodPremium.toLocaleString('he-IL')} ₪
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ({days} ימים מתוך 365)
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <Button className="w-full" size="lg">
            המשך להזמנה
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstructorCalculator;
