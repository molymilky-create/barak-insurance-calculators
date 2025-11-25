import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowRight } from 'lucide-react';

interface HorseCalculatorProps {
  onBack: () => void;
}

const HorseCalculator = ({ onBack }: HorseCalculatorProps) => {
  const [thirdParty, setThirdParty] = useState('yes');
  const [lifeInsurance, setLifeInsurance] = useState('no');
  const [healthInsurance, setHealthInsurance] = useState('no');
  const [horseValue, setHorseValue] = useState('50000');
  const [horseType, setHorseType] = useState('sport');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [annualPremium, setAnnualPremium] = useState(0);
  const [periodPremium, setPeriodPremium] = useState(0);
  const [days, setDays] = useState(0);

  const calculatePremium = () => {
    let total = 0;
    const value = parseInt(horseValue) || 0;
    
    // חישוב בסיסי - יש לעדכן עם הלוגיקה המדויקת שלך
    if (thirdParty === 'yes') {
      total += 1500; // דוגמה
    }
    
    if (lifeInsurance === 'yes') {
      total += value * 0.03; // 3% מערך הסוס
    }
    
    if (healthInsurance === 'yes') {
      total += value * 0.025; // 2.5% מערך הסוס
    }
    
    // תוספת לפי סוג סוס
    if (horseType === 'sport') {
      total *= 1.2;
    } else if (horseType === 'breeding') {
      total *= 1.15;
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
  }, [thirdParty, lifeInsurance, healthInsurance, horseValue, horseType]);

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
          <CardTitle className="text-2xl">מחשבון ביטוח סוסים</CardTitle>
          <CardDescription>הזן את הפרטים לחישוב הפרמיה</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* ביטוח צד ג' */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">ביטוח צד ג'</Label>
            <RadioGroup value={thirdParty} onValueChange={setThirdParty}>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="yes" id="tp-yes" />
                <Label htmlFor="tp-yes" className="cursor-pointer">כן</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="no" id="tp-no" />
                <Label htmlFor="tp-no" className="cursor-pointer">לא</Label>
              </div>
            </RadioGroup>
          </div>

          {/* ביטוח חיים */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">ביטוח חיים</Label>
            <RadioGroup value={lifeInsurance} onValueChange={setLifeInsurance}>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="yes" id="life-yes" />
                <Label htmlFor="life-yes" className="cursor-pointer">כן</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="no" id="life-no" />
                <Label htmlFor="life-no" className="cursor-pointer">לא</Label>
              </div>
            </RadioGroup>
          </div>

          {/* ביטוח בריאות */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">ביטוח בריאות</Label>
            <RadioGroup value={healthInsurance} onValueChange={setHealthInsurance}>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="yes" id="health-yes" />
                <Label htmlFor="health-yes" className="cursor-pointer">כן</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="no" id="health-no" />
                <Label htmlFor="health-no" className="cursor-pointer">לא</Label>
              </div>
            </RadioGroup>
          </div>

          {/* ערך הסוס */}
          <div className="space-y-3">
            <Label htmlFor="horse-value" className="text-base font-semibold">ערך הסוס (₪)</Label>
            <Input
              id="horse-value"
              type="number"
              value={horseValue}
              onChange={(e) => setHorseValue(e.target.value)}
              className="text-right"
            />
          </div>

          {/* סוג סוס */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">סוג סוס</Label>
            <RadioGroup value={horseType} onValueChange={setHorseType}>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="sport" id="type-sport" />
                <Label htmlFor="type-sport" className="cursor-pointer">ספורט</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="breeding" id="type-breeding" />
                <Label htmlFor="type-breeding" className="cursor-pointer">גידול</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="leisure" id="type-leisure" />
                <Label htmlFor="type-leisure" className="cursor-pointer">פנאי</Label>
              </div>
            </RadioGroup>
          </div>

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
                {thirdParty === 'yes' && <div>• ביטוח צד ג' – 1,500 ₪</div>}
                {lifeInsurance === 'yes' && <div>• ביטוח חיים – {Math.round(parseInt(horseValue) * 0.03).toLocaleString('he-IL')} ₪</div>}
                {healthInsurance === 'yes' && <div>• ביטוח בריאות – {Math.round(parseInt(horseValue) * 0.025).toLocaleString('he-IL')} ₪</div>}
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

export default HorseCalculator;
