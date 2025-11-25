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
  // State for inputs
  const [thirdParty, setThirdParty] = useState<'yes' | 'no'>('no');
  const [thirdPartyType, setThirdPartyType] = useState<'pleasure' | 'competition'>('pleasure');
  
  const [lifeInsurance, setLifeInsurance] = useState<'yes' | 'no'>('no');
  const [horseValue, setHorseValue] = useState('0');
  const [horseType, setHorseType] = useState<'pleasure' | 'jumping' | 'western'>('pleasure');
  const [theftCoverage, setTheftCoverage] = useState<'yes' | 'no'>('yes');
  
  const [healthInsurance, setHealthInsurance] = useState<'yes' | 'no'>('no');
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Calculated values
  const [annualPremium, setAnnualPremium] = useState(0);
  const [breakdown, setBreakdown] = useState<{label: string, amount: number}[]>([]);
  const [periodPremium, setPeriodPremium] = useState(0);
  const [days, setDays] = useState(0);

  // Calculate annual premium
  useEffect(() => {
    let total = 0;
    const items: {label: string, amount: number}[] = [];
    
    // Third party insurance
    if (thirdParty === 'yes') {
      const tpAmount = thirdPartyType === 'pleasure' ? 700 : 800;
      total += tpAmount;
      items.push({
        label: `ביטוח צד ג' (${thirdPartyType === 'pleasure' ? 'הנאה בלבד' : 'תחרויות'})`,
        amount: tpAmount
      });
    }
    
    // Life insurance
    if (lifeInsurance === 'yes') {
      const value = parseFloat(horseValue) || 0;
      let percentage = 0;
      if (horseType === 'pleasure') percentage = 0.05; // 5%
      else if (horseType === 'jumping') percentage = 0.06; // 6%
      else if (horseType === 'western') percentage = 0.065; // 6.5%
      
      let lifeAmount = value * percentage;
      
      // Apply theft coverage discount
      if (theftCoverage === 'no') {
        lifeAmount = lifeAmount * 0.9; // 10% discount
      }
      
      total += lifeAmount;
      
      const typeLabel = horseType === 'pleasure' ? 'הנאה/דרסאז' : 
                       horseType === 'jumping' ? 'קפיצות' : 'מערבי';
      const theftLabel = theftCoverage === 'no' ? ' (עם הנחת 10%)' : '';
      items.push({
        label: `ביטוח חיים (${typeLabel}, ${percentage * 100}% מערך הסוס${theftLabel})`,
        amount: Math.round(lifeAmount)
      });
    }
    
    // Health insurance
    if (healthInsurance === 'yes') {
      const healthAmount = lifeInsurance === 'yes' ? 700 : 1200;
      total += healthAmount;
      items.push({
        label: `ביטוח בריאות${lifeInsurance === 'yes' ? ' (עם ביטוח חיים)' : ''}`,
        amount: healthAmount
      });
    }
    
    setAnnualPremium(Math.round(total));
    setBreakdown(items);
  }, [thirdParty, thirdPartyType, lifeInsurance, horseValue, horseType, theftCoverage, healthInsurance]);

  // Calculate period premium
  useEffect(() => {
    if (startDate && endDate && annualPremium > 0) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      
      if (daysDiff > 0) {
        setDays(daysDiff);
        setPeriodPremium(Math.round((annualPremium / 365) * daysDiff));
      } else {
        setDays(0);
        setPeriodPremium(0);
      }
    } else {
      setDays(0);
      setPeriodPremium(0);
    }
  }, [startDate, endDate, annualPremium]);

  return (
    <main className="container mx-auto px-6 py-8 animate-fade-in" dir="rtl" id="main-content" role="main" aria-label="מחשבון ביטוח סוסים">
      <Button 
        variant="outline" 
        onClick={onBack} 
        className="mb-6 hover-scale focus:ring-4 focus:ring-primary/50 focus:outline-none"
        aria-label="חזרה למסך בחירת מחשבונים"
      >
        <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
        חזרה למסך בחירה
      </Button>

      <Card className="shadow-2xl">
        <CardHeader className="bg-gradient-to-l from-primary/5 to-secondary/5">
          <CardTitle className="text-3xl font-bold">🐴 מחשבון ביטוח סוסים</CardTitle>
          <CardDescription className="text-lg">בחר את סוגי הכיסויים הרצויים</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
          {/* Third Party Insurance */}
          <fieldset className="space-y-4 p-6 bg-muted/30 rounded-2xl animate-scale-in">
            <legend className="text-xl font-bold text-primary block"><span role="img" aria-label="מאזניים">⚖️</span> ביטוח צד ג'</legend>
            <RadioGroup 
              value={thirdParty} 
              onValueChange={(v) => setThirdParty(v as 'yes' | 'no')} 
              className="grid grid-cols-2 gap-4"
              aria-label="בחר האם לכלול ביטוח צד ג'"
            >
              <div className={`relative cursor-pointer transition-all duration-300 ${thirdParty === 'yes' ? 'scale-105' : 'hover:scale-102'}`}>
                <RadioGroupItem value="yes" id="tp-yes" className="peer sr-only" />
                <Label htmlFor="tp-yes" className="flex items-center justify-center h-20 text-2xl font-bold rounded-2xl border-4 cursor-pointer transition-all duration-300 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground peer-data-[state=unchecked]:border-border hover:border-primary/50 hover:shadow-lg">
                  כן ✓
                </Label>
              </div>
              <div className={`relative cursor-pointer transition-all duration-300 ${thirdParty === 'no' ? 'scale-105' : 'hover:scale-102'}`}>
                <RadioGroupItem value="no" id="tp-no" className="peer sr-only" />
                <Label htmlFor="tp-no" className="flex items-center justify-center h-20 text-2xl font-bold rounded-2xl border-4 cursor-pointer transition-all duration-300 peer-data-[state=checked]:border-muted-foreground peer-data-[state=checked]:bg-muted peer-data-[state=checked]:text-foreground peer-data-[state=unchecked]:border-border hover:border-muted-foreground/50 hover:shadow-lg">
                  לא ✗
                </Label>
              </div>
            </RadioGroup>
            
            {thirdParty === 'yes' && (
              <div className="space-y-3 mt-4 animate-fade-in">
                <Label className="text-lg font-semibold">למה משמש הסוס?</Label>
                <RadioGroup 
                  value={thirdPartyType} 
                  onValueChange={(v) => setThirdPartyType(v as 'pleasure' | 'competition')} 
                  className="space-y-3"
                  aria-label="בחר למה משמש הסוס"
                >
                  <div className="flex items-center justify-between p-4 border-2 rounded-xl hover:border-primary transition-colors">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="pleasure" id="tp-pleasure" />
                      <Label htmlFor="tp-pleasure" className="cursor-pointer font-medium">הנאה בלבד</Label>
                    </div>
                    <span className="font-bold text-primary">700 ₪</span>
                  </div>
                  <div className="flex items-center justify-between p-4 border-2 rounded-xl hover:border-primary transition-colors">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="competition" id="tp-competition" />
                      <Label htmlFor="tp-competition" className="cursor-pointer font-medium">תחרויות</Label>
                    </div>
                    <span className="font-bold text-primary">800 ₪</span>
                  </div>
                </RadioGroup>
              </div>
            )}
          </fieldset>

          {/* Life Insurance */}
          <fieldset className="space-y-4 p-6 bg-muted/30 rounded-2xl animate-scale-in">
            <legend className="text-xl font-bold text-primary block"><span role="img" aria-label="סוס">🐴</span> ביטוח חיים</legend>
            <RadioGroup 
              value={lifeInsurance} 
              onValueChange={(v) => setLifeInsurance(v as 'yes' | 'no')} 
              className="grid grid-cols-2 gap-4"
              aria-label="בחר האם לכלול ביטוח חיים"
            >
              <div className={`relative cursor-pointer transition-all duration-300 ${lifeInsurance === 'yes' ? 'scale-105' : 'hover:scale-102'}`}>
                <RadioGroupItem value="yes" id="life-yes" className="peer sr-only" />
                <Label htmlFor="life-yes" className="flex items-center justify-center h-20 text-2xl font-bold rounded-2xl border-4 cursor-pointer transition-all duration-300 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground peer-data-[state=unchecked]:border-border hover:border-primary/50 hover:shadow-lg">
                  כן ✓
                </Label>
              </div>
              <div className={`relative cursor-pointer transition-all duration-300 ${lifeInsurance === 'no' ? 'scale-105' : 'hover:scale-102'}`}>
                <RadioGroupItem value="no" id="life-no" className="peer sr-only" />
                <Label htmlFor="life-no" className="flex items-center justify-center h-20 text-2xl font-bold rounded-2xl border-4 cursor-pointer transition-all duration-300 peer-data-[state=checked]:border-muted-foreground peer-data-[state=checked]:bg-muted peer-data-[state=checked]:text-foreground peer-data-[state=unchecked]:border-border hover:border-muted-foreground/50 hover:shadow-lg">
                  לא ✗
                </Label>
              </div>
            </RadioGroup>
            
            {lifeInsurance === 'yes' && (
              <div className="space-y-6 mt-4 animate-fade-in">
                <div>
                  <Label htmlFor="horse-value" className="text-lg font-semibold mb-3 block">💰 ערך הסוס (₪)</Label>
                  <Input
                    id="horse-value"
                    type="number"
                    value={horseValue}
                    onChange={(e) => setHorseValue(e.target.value)}
                    className="text-right text-xl h-14"
                    placeholder="0"
                    aria-label="הזן את ערך הסוס בשקלים"
                    aria-describedby="horse-value-desc"
                  />
                  <span id="horse-value-desc" className="sr-only">הזן את ערך הסוס בשקלים חדשים</span>
                </div>
                
                <div>
                  <Label className="text-lg font-semibold mb-3 block">סוג הסוס</Label>
                  <RadioGroup 
                    value={horseType} 
                    onValueChange={(v) => setHorseType(v as 'pleasure' | 'jumping' | 'western')} 
                    className="space-y-3"
                    aria-label="בחר סוג הסוס"
                  >
                    <div className="flex items-center justify-between p-4 border-2 rounded-xl hover:border-primary transition-colors">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="pleasure" id="type-pleasure" />
                        <Label htmlFor="type-pleasure" className="cursor-pointer font-medium">סוס הנאה / דרסאז</Label>
                      </div>
                      <span className="font-bold text-primary">5% מערך הסוס</span>
                    </div>
                    <div className="flex items-center justify-between p-4 border-2 rounded-xl hover:border-primary transition-colors">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="jumping" id="type-jumping" />
                        <Label htmlFor="type-jumping" className="cursor-pointer font-medium">סוס קפיצות</Label>
                      </div>
                      <span className="font-bold text-primary">6% מערך הסוס</span>
                    </div>
                    <div className="flex items-center justify-between p-4 border-2 rounded-xl hover:border-primary transition-colors">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="western" id="type-western" />
                        <Label htmlFor="type-western" className="cursor-pointer font-medium">סוס מערבי</Label>
                      </div>
                      <span className="font-bold text-primary">6.5% מערך הסוס</span>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="p-4 bg-background rounded-xl border-2">
                  <Label className="text-lg font-semibold mb-3 block">🔒 כיסוי פריצה/גניבה</Label>
                  <p className="text-sm text-muted-foreground mb-3">ללא כיסוי זה תקבל הנחה של 10%</p>
                  <RadioGroup 
                    value={theftCoverage} 
                    onValueChange={(v) => setTheftCoverage(v as 'yes' | 'no')} 
                    className="grid grid-cols-2 gap-4"
                    aria-label="בחר האם לכלול כיסוי פריצה וגניבה"
                  >
                    <div>
                      <RadioGroupItem value="yes" id="theft-yes" className="peer sr-only" />
                      <Label htmlFor="theft-yes" className="flex items-center justify-center h-16 text-xl font-bold rounded-xl border-4 cursor-pointer transition-all duration-300 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=unchecked]:border-border hover:border-primary/50">
                        כן
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="no" id="theft-no" className="peer sr-only" />
                      <Label htmlFor="theft-no" className="flex items-center justify-center h-16 text-xl font-bold rounded-xl border-4 cursor-pointer transition-all duration-300 peer-data-[state=checked]:border-secondary peer-data-[state=checked]:bg-secondary/10 peer-data-[state=unchecked]:border-border hover:border-secondary/50">
                        לא (הנחה 10%)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}
          </div>

          {/* Health Insurance */}
          <div className="space-y-4 p-6 bg-muted/30 rounded-2xl animate-scale-in">
            <Label className="text-xl font-bold text-primary block">🏥 ביטוח בריאות</Label>
            <p className="text-sm text-muted-foreground">
              {lifeInsurance === 'yes' ? 'עם ביטוח חיים: 700 ₪' : 'ללא ביטוח חיים: 1,200 ₪'}
            </p>
            <RadioGroup value={healthInsurance} onValueChange={(v) => setHealthInsurance(v as 'yes' | 'no')} className="grid grid-cols-2 gap-4">
              <div className={`relative cursor-pointer transition-all duration-300 ${healthInsurance === 'yes' ? 'scale-105' : 'hover:scale-102'}`}>
                <RadioGroupItem value="yes" id="health-yes" className="peer sr-only" />
                <Label htmlFor="health-yes" className="flex items-center justify-center h-20 text-2xl font-bold rounded-2xl border-4 cursor-pointer transition-all duration-300 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground peer-data-[state=unchecked]:border-border hover:border-primary/50 hover:shadow-lg">
                  כן ✓
                </Label>
              </div>
              <div className={`relative cursor-pointer transition-all duration-300 ${healthInsurance === 'no' ? 'scale-105' : 'hover:scale-102'}`}>
                <RadioGroupItem value="no" id="health-no" className="peer sr-only" />
                <Label htmlFor="health-no" className="flex items-center justify-center h-20 text-2xl font-bold rounded-2xl border-4 cursor-pointer transition-all duration-300 peer-data-[state=checked]:border-muted-foreground peer-data-[state=checked]:bg-muted peer-data-[state=checked]:text-foreground peer-data-[state=unchecked]:border-border hover:border-muted-foreground/50 hover:shadow-lg">
                  לא ✗
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Annual Premium Summary */}
          {annualPremium > 0 && (
            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary shadow-xl animate-scale-in">
              <CardHeader>
                <CardTitle className="text-2xl">סך הכל לתשלום (שנתי)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-4xl font-bold bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent">
                  {annualPremium.toLocaleString('he-IL')} ₪
                </div>
                {breakdown.length > 0 && (
                  <div className="space-y-2 pt-4 border-t-2">
                    {breakdown.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-base">
                        <span className="text-muted-foreground">• {item.label}</span>
                        <span className="font-bold">{item.amount.toLocaleString('he-IL')} ₪</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Period Calculation */}
          {annualPremium > 0 && (
            <div className="space-y-4 p-6 bg-muted/20 rounded-2xl border-2 border-dashed border-primary/30">
              <h3 className="text-xl font-bold text-primary">חישוב לתקופה מסוימת</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date" className="font-semibold">תאריך תחילת ביטוח</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date" className="font-semibold">תאריך סיום ביטוח</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="text-right"
                  />
                </div>
              </div>
              
              {days > 0 && periodPremium > 0 && (
                <Card className="bg-gradient-to-br from-secondary/20 to-secondary/5 border-2 border-secondary animate-fade-in">
                  <CardContent className="pt-6 text-center space-y-2">
                    <div className="text-2xl font-bold text-secondary">
                      הפרמיה לתקופה שנבחרה: {periodPremium.toLocaleString('he-IL')} ₪
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ({days} ימים מתוך 365)
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <Button className="w-full bg-gradient-to-l from-primary to-secondary hover:from-secondary hover:to-primary text-white text-xl py-7" size="lg">
            המשך להזמנה
          </Button>
        </CardContent>
      </Card>
    </main>
  );
};

export default HorseCalculator;