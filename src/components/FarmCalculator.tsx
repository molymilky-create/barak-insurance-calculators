import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowRight } from 'lucide-react';

interface FarmCalculatorProps {
  onBack: () => void;
}

const FarmCalculator = ({ onBack }: FarmCalculatorProps) => {
  const [employerLiability, setEmployerLiability] = useState('no');
  const [publicLiability, setPublicLiability] = useState('no');
  const [propertyInsurance, setPropertyInsurance] = useState('no');
  const [numEmployees, setNumEmployees] = useState('0');
  const [farmSize, setFarmSize] = useState('small');
  const [propertyValue, setPropertyValue] = useState('0');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [annualPremium, setAnnualPremium] = useState(0);
  const [periodPremium, setPeriodPremium] = useState(0);
  const [days, setDays] = useState(0);

  const calculatePremium = () => {
    let total = 0;
    const employees = parseInt(numEmployees) || 0;
    const property = parseInt(propertyValue) || 0;
    
    // חישוב בסיסי - יש לעדכן עם הלוגיקה המדויקת שלך
    if (employerLiability === 'yes') {
      total += employees * 800; // דוגמה
    }
    
    if (publicLiability === 'yes') {
      total += 3000; // בסיס
      if (farmSize === 'large') total += 2000;
      else if (farmSize === 'medium') total += 1000;
    }
    
    if (propertyInsurance === 'yes') {
      total += property * 0.002; // 0.2% מערך הנכס
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
  }, [employerLiability, publicLiability, propertyInsurance, numEmployees, farmSize, propertyValue]);

  useEffect(() => {
    calculatePeriodPremium();
  }, [startDate, endDate, annualPremium]);

  return (
    <div className="container mx-auto px-6 py-8 animate-fade-in" dir="rtl">
      <Button variant="outline" onClick={onBack} className="mb-6 hover-scale">
        <ArrowRight className="ml-2 h-4 w-4" />
        חזרה למסך בחירה
      </Button>

      <Card className="shadow-2xl">
        <CardHeader className="bg-gradient-to-l from-primary/5 to-secondary/5">
          <CardTitle className="text-3xl font-bold">🐎 מחשבון ביטוח חוות סוסים</CardTitle>
          <CardDescription className="text-lg">בחר את סוגי הכיסויים לחווה שלך</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
          {/* חבות מעבידים */}
          <div className="space-y-4 p-6 bg-muted/30 rounded-2xl animate-scale-in">
            <Label className="text-xl font-bold text-primary block">👔 חבות מעבידים</Label>
            <RadioGroup value={employerLiability} onValueChange={setEmployerLiability} className="grid grid-cols-2 gap-4">
              <div className={`relative cursor-pointer transition-all duration-300 ${employerLiability === 'yes' ? 'scale-105' : 'hover:scale-102'}`}>
                <RadioGroupItem value="yes" id="emp-yes" className="peer sr-only" />
                <Label htmlFor="emp-yes" className="flex items-center justify-center h-20 text-2xl font-bold rounded-2xl border-4 cursor-pointer transition-all duration-300 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground peer-data-[state=unchecked]:border-border hover:border-primary/50 hover:shadow-lg">
                  כן ✓
                </Label>
              </div>
              <div className={`relative cursor-pointer transition-all duration-300 ${employerLiability === 'no' ? 'scale-105' : 'hover:scale-102'}`}>
                <RadioGroupItem value="no" id="emp-no" className="peer sr-only" />
                <Label htmlFor="emp-no" className="flex items-center justify-center h-20 text-2xl font-bold rounded-2xl border-4 cursor-pointer transition-all duration-300 peer-data-[state=checked]:border-muted-foreground peer-data-[state=checked]:bg-muted peer-data-[state=checked]:text-foreground peer-data-[state=unchecked]:border-border hover:border-muted-foreground/50 hover:shadow-lg">
                  לא ✗
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* מספר עובדים */}
          {employerLiability === 'yes' && (
            <div className="space-y-3">
              <Label htmlFor="num-employees" className="text-base font-semibold">מספר עובדים</Label>
              <Input
                id="num-employees"
                type="number"
                value={numEmployees}
                onChange={(e) => setNumEmployees(e.target.value)}
                className="text-right"
              />
            </div>
          )}

          {/* ביטוח צד ג' */}
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

          {/* גודל חווה */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">גודל החווה</Label>
            <RadioGroup value={farmSize} onValueChange={setFarmSize}>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="small" id="size-small" />
                <Label htmlFor="size-small" className="cursor-pointer">קטנה (עד 10 סוסים)</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="medium" id="size-medium" />
                <Label htmlFor="size-medium" className="cursor-pointer">בינונית (10-30 סוסים)</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="large" id="size-large" />
                <Label htmlFor="large" className="cursor-pointer">גדולה (מעל 30 סוסים)</Label>
              </div>
            </RadioGroup>
          </div>

          {/* ביטוח רכוש */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">ביטוח רכוש (מבנים וציוד)</Label>
            <RadioGroup value={propertyInsurance} onValueChange={setPropertyInsurance}>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="yes" id="prop-yes" />
                <Label htmlFor="prop-yes" className="cursor-pointer">כן</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="no" id="prop-no" />
                <Label htmlFor="prop-no" className="cursor-pointer">לא</Label>
              </div>
            </RadioGroup>
          </div>

          {/* ערך הרכוש */}
          {propertyInsurance === 'yes' && (
            <div className="space-y-3">
              <Label htmlFor="property-value" className="text-base font-semibold">ערך הרכוש (₪)</Label>
              <Input
                id="property-value"
                type="number"
                value={propertyValue}
                onChange={(e) => setPropertyValue(e.target.value)}
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
                {employerLiability === 'yes' && <div>• חבות מעבידים ({numEmployees} עובדים) – {(parseInt(numEmployees) * 800).toLocaleString('he-IL')} ₪</div>}
                {publicLiability === 'yes' && <div>• ביטוח צד ג' – {(3000 + (farmSize === 'large' ? 2000 : farmSize === 'medium' ? 1000 : 0)).toLocaleString('he-IL')} ₪</div>}
                {propertyInsurance === 'yes' && <div>• ביטוח רכוש – {Math.round(parseInt(propertyValue) * 0.002).toLocaleString('he-IL')} ₪</div>}
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

export default FarmCalculator;
