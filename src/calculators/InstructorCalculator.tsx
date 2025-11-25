import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowRight } from 'lucide-react';
import CompanyBadge from '../components/CompanyBadge';

const InstructorCalculator = () => {
  // בחירת חברה
  const [company, setCompany] = useState<'menora' | 'hachshara'>('menora');
  
  // מנורה
  const [policyType, setPolicyType] = useState<'professional' | 'thirdParty'>('professional');
  const [liabilityLimit, setLiabilityLimit] = useState<1000000 | 2000000 | 3000000 | 4000000>(1000000);
  const [includeThirdParty, setIncludeThirdParty] = useState<'no' | 'yes'>('no');
  const [includeAdditionalInstructors, setIncludeAdditionalInstructors] = useState<'no' | 'yes'>('no');
  const [numAdditionalInstructors, setNumAdditionalInstructors] = useState('0');
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [annualPremium, setAnnualPremium] = useState(0);
  const [periodPremium, setPeriodPremium] = useState(0);
  const [days, setDays] = useState(0);
  const [breakdown, setBreakdown] = useState<string[]>([]);

  const calculatePremium = () => {
    let basePremium = 0;
    let total = 0;
    const details: string[] = [];

    if (company === 'menora') {
      if (policyType === 'professional') {
        // אחריות מקצועית
        const professionalPrices = {
          1000000: { without: 2800, with: 4200 },
          2000000: { without: 3500, with: 5250 },
          4000000: { without: 5000, with: 7500 },
        };
        
        const prices = professionalPrices[liabilityLimit as 1000000 | 2000000 | 4000000];
        basePremium = includeThirdParty === 'yes' ? prices.with : prices.without;
        total = basePremium;
        
        details.push(
          `אחריות מקצועית ${(liabilityLimit / 1000000).toLocaleString('he-IL')}M ₪${
            includeThirdParty === 'yes' ? ' + הרחבה לצד ג\'' : ''
          }: ${basePremium.toLocaleString('he-IL')} ₪`
        );
      } else {
        // צד ג'
        const thirdPartyPrices = {
          1000000: 4200,
          2000000: 5250,
          4000000: 7500,
        };
        
        basePremium = thirdPartyPrices[liabilityLimit as 1000000 | 2000000 | 4000000];
        total = basePremium;
        
        details.push(
          `צד ג' ${(liabilityLimit / 1000000).toLocaleString('he-IL')}M ₪ + אחריות מקצועית ${(liabilityLimit / 2000000).toLocaleString('he-IL')}M ₪: ${basePremium.toLocaleString('he-IL')} ₪`
        );
      }
      
      // מדריכים נוספים
      if (includeAdditionalInstructors === 'yes') {
        const additionalCount = parseInt(numAdditionalInstructors) || 0;
        if (additionalCount > 0) {
          const additionalCost = Math.round(basePremium * 0.5 * additionalCount);
          total += additionalCost;
          details.push(
            `${additionalCount} מדריכים נוספים (${additionalCount} × 50%): ${additionalCost.toLocaleString('he-IL')} ₪`
          );
        }
      }
    } else {
      // הכשרה
      const hachsharaPrices = {
        1000000: 2500,
        2000000: 2800,
        3000000: 3500,
        4000000: 4900,
      };
      
      basePremium = hachsharaPrices[liabilityLimit];
      total = basePremium;
      
      details.push(
        `אחריות מקצועית + צד ג' ${(liabilityLimit / 1000000).toLocaleString('he-IL')}M ₪: ${basePremium.toLocaleString('he-IL')} ₪`
      );
    }
    
    setAnnualPremium(Math.round(total));
    setBreakdown(details);
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
  }, [company, policyType, liabilityLimit, includeThirdParty, includeAdditionalInstructors, numAdditionalInstructors]);

  useEffect(() => {
    calculatePeriodPremium();
  }, [startDate, endDate, annualPremium]);

  return (
    <main className="container mx-auto px-6 py-8 animate-fade-in" dir="rtl" id="main-content" role="main" aria-label="מחשבון ביטוח מדריכי רכיבה">

      <Card className="shadow-2xl">
        <CardHeader className="bg-gradient-to-l from-primary/5 to-secondary/5">
          <CardTitle className="text-3xl font-bold">🏇 מחשבון ביטוח מדריכי רכיבה</CardTitle>
          <CardDescription className="text-lg">בחר את סוגי הכיסויים למדריכים</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
          {/* בחירת חברה */}
          <div className="space-y-4 p-6 bg-muted/30 rounded-2xl animate-scale-in">
            <Label className="text-xl font-bold text-primary block">🏢 חברת ביטוח</Label>
            <RadioGroup value={company} onValueChange={(v) => setCompany(v as 'menora' | 'hachshara')} className="grid grid-cols-2 gap-4">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`relative cursor-pointer transition-all duration-300 ${company === 'menora' ? 'scale-105' : ''}`}>
                <RadioGroupItem value="menora" id="company-menora" className="peer sr-only" />
                <Label htmlFor="company-menora" className={`flex items-center justify-center h-20 text-2xl font-bold rounded-2xl border-4 cursor-pointer transition-all duration-300 ${
                  company === 'menora' 
                    ? 'border-menora-secondary bg-menora-primary text-menora-dark' 
                    : 'border-border hover:border-menora-secondary hover:shadow-lg'
                }`}>
                  מנורה 🛡️
                </Label>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`relative cursor-pointer transition-all duration-300 ${company === 'hachshara' ? 'scale-105' : ''}`}>
                <RadioGroupItem value="hachshara" id="company-hachshara" className="peer sr-only" />
                <Label htmlFor="company-hachshara" className={`flex items-center justify-center h-20 text-2xl font-bold rounded-2xl border-4 cursor-pointer transition-all duration-300 ${
                  company === 'hachshara' 
                    ? 'border-hachshara-primary bg-hachshara-primary text-white' 
                    : 'border-border hover:border-hachshara-primary hover:shadow-lg'
                }`}>
                  הכשרה 🏛️
                </Label>
              </motion.div>
            </RadioGroup>
          </div>

          {/* Company Badge */}
          <AnimatePresence mode="wait">
            <motion.div
              key={company}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center text-sm text-slate-600">
                חברה: {company === 'menora' ? 'מנורה' : 'הכשרה'}
              </div>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {company === 'menora' && (
              <motion.div
                key="menora"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
              {/* סוג פוליסה - מנורה */}
              <div className="space-y-4 p-6 bg-muted/30 rounded-2xl">
                <Label className="text-xl font-bold text-primary block">📋 סוג פוליסה</Label>
                <RadioGroup value={policyType} onValueChange={(v) => setPolicyType(v as 'professional' | 'thirdParty')} className="grid grid-cols-2 gap-4">
                  <div className={`relative cursor-pointer transition-all duration-300 ${policyType === 'professional' ? 'scale-105' : 'hover:scale-102'}`}>
                    <RadioGroupItem value="professional" id="type-professional" className="peer sr-only" />
                    <Label htmlFor="type-professional" className="flex items-center justify-center h-20 text-xl font-bold rounded-2xl border-4 cursor-pointer transition-all duration-300 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground peer-data-[state=unchecked]:border-border hover:border-primary/50 hover:shadow-lg">
                      אחריות מקצועית 👨‍🏫
                    </Label>
                  </div>
                  <div className={`relative cursor-pointer transition-all duration-300 ${policyType === 'thirdParty' ? 'scale-105' : 'hover:scale-102'}`}>
                    <RadioGroupItem value="thirdParty" id="type-thirdParty" className="peer sr-only" />
                    <Label htmlFor="type-thirdParty" className="flex items-center justify-center h-20 text-xl font-bold rounded-2xl border-4 cursor-pointer transition-all duration-300 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground peer-data-[state=unchecked]:border-border hover:border-primary/50 hover:shadow-lg">
                      צד ג' 🛡️
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* גבול אחריות */}
              <div className="space-y-4 p-6 bg-muted/30 rounded-2xl">
                <Label className="text-xl font-bold text-primary block">💰 גבול אחריות</Label>
                <RadioGroup 
                  value={liabilityLimit.toString()} 
                  onValueChange={(v) => setLiabilityLimit(parseInt(v) as 1000000 | 2000000 | 3000000 | 4000000)} 
                  className="grid grid-cols-2 gap-4"
                >
                  <div className={`relative cursor-pointer transition-all duration-300 ${liabilityLimit === 1000000 ? 'scale-105' : 'hover:scale-102'}`}>
                    <RadioGroupItem value="1000000" id="limit-1m" className="peer sr-only" />
                    <Label htmlFor="limit-1m" className="flex items-center justify-center h-16 text-lg font-bold rounded-2xl border-4 cursor-pointer transition-all duration-300 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground peer-data-[state=unchecked]:border-border hover:border-primary/50 hover:shadow-lg">
                      1M ₪
                    </Label>
                  </div>
                  <div className={`relative cursor-pointer transition-all duration-300 ${liabilityLimit === 2000000 ? 'scale-105' : 'hover:scale-102'}`}>
                    <RadioGroupItem value="2000000" id="limit-2m" className="peer sr-only" />
                    <Label htmlFor="limit-2m" className="flex items-center justify-center h-16 text-lg font-bold rounded-2xl border-4 cursor-pointer transition-all duration-300 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground peer-data-[state=unchecked]:border-border hover:border-primary/50 hover:shadow-lg">
                      2M ₪
                    </Label>
                  </div>
                  {policyType === 'professional' && (
                    <div className={`relative cursor-pointer transition-all duration-300 ${liabilityLimit === 4000000 ? 'scale-105' : 'hover:scale-102'}`}>
                      <RadioGroupItem value="4000000" id="limit-4m" className="peer sr-only" />
                      <Label htmlFor="limit-4m" className="flex items-center justify-center h-16 text-lg font-bold rounded-2xl border-4 cursor-pointer transition-all duration-300 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground peer-data-[state=unchecked]:border-border hover:border-primary/50 hover:shadow-lg">
                        4M ₪
                      </Label>
                    </div>
                  )}
                  {policyType === 'thirdParty' && (
                    <div className={`relative cursor-pointer transition-all duration-300 ${liabilityLimit === 4000000 ? 'scale-105' : 'hover:scale-102'}`}>
                      <RadioGroupItem value="4000000" id="limit-4m-tp" className="peer sr-only" />
                      <Label htmlFor="limit-4m-tp" className="flex items-center justify-center h-16 text-lg font-bold rounded-2xl border-4 cursor-pointer transition-all duration-300 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground peer-data-[state=unchecked]:border-border hover:border-primary/50 hover:shadow-lg">
                        4M ₪
                      </Label>
                    </div>
                  )}
                </RadioGroup>
              </div>

              {/* הרחבה לצד ג' - רק לאחריות מקצועית */}
              <AnimatePresence>
                {policyType === 'professional' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="space-y-4 p-6 bg-muted/30 rounded-2xl overflow-hidden"
                  >
                    <Label className="text-xl font-bold text-primary block">➕ הרחבה לצד ג'</Label>
                    <RadioGroup value={includeThirdParty} onValueChange={(v) => setIncludeThirdParty(v as 'yes' | 'no')} className="grid grid-cols-2 gap-4">
                      <div className={`relative cursor-pointer transition-all duration-300 ${includeThirdParty === 'yes' ? 'scale-105' : 'hover:scale-102'}`}>
                        <RadioGroupItem value="yes" id="tp-yes" className="peer sr-only" />
                        <Label htmlFor="tp-yes" className="flex items-center justify-center h-16 text-xl font-bold rounded-2xl border-4 cursor-pointer transition-all duration-300 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground peer-data-[state=unchecked]:border-border hover:border-primary/50 hover:shadow-lg">
                          כן ✓
                        </Label>
                      </div>
                      <div className={`relative cursor-pointer transition-all duration-300 ${includeThirdParty === 'no' ? 'scale-105' : 'hover:scale-102'}`}>
                        <RadioGroupItem value="no" id="tp-no" className="peer sr-only" />
                        <Label htmlFor="tp-no" className="flex items-center justify-center h-16 text-xl font-bold rounded-2xl border-4 cursor-pointer transition-all duration-300 peer-data-[state=checked]:border-muted-foreground peer-data-[state=checked]:bg-muted peer-data-[state=checked]:text-foreground peer-data-[state=unchecked]:border-border hover:border-muted-foreground/50 hover:shadow-lg">
                          לא ✗
                        </Label>
                      </div>
                    </RadioGroup>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* מדריכים נוספים */}
              <div className="space-y-4 p-6 bg-muted/30 rounded-2xl">
                <Label className="text-xl font-bold text-primary block">👥 מדריכים נוספים</Label>
                <RadioGroup value={includeAdditionalInstructors} onValueChange={(v) => setIncludeAdditionalInstructors(v as 'yes' | 'no')} className="grid grid-cols-2 gap-4">
                  <div className={`relative cursor-pointer transition-all duration-300 ${includeAdditionalInstructors === 'yes' ? 'scale-105' : 'hover:scale-102'}`}>
                    <RadioGroupItem value="yes" id="add-instructors-yes" className="peer sr-only" />
                    <Label htmlFor="add-instructors-yes" className="flex items-center justify-center h-16 text-xl font-bold rounded-2xl border-4 cursor-pointer transition-all duration-300 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground peer-data-[state=unchecked]:border-border hover:border-primary/50 hover:shadow-lg">
                      כן ✓
                    </Label>
                  </div>
                  <div className={`relative cursor-pointer transition-all duration-300 ${includeAdditionalInstructors === 'no' ? 'scale-105' : 'hover:scale-102'}`}>
                    <RadioGroupItem value="no" id="add-instructors-no" className="peer sr-only" />
                    <Label htmlFor="add-instructors-no" className="flex items-center justify-center h-16 text-xl font-bold rounded-2xl border-4 cursor-pointer transition-all duration-300 peer-data-[state=checked]:border-muted-foreground peer-data-[state=checked]:bg-muted peer-data-[state=checked]:text-foreground peer-data-[state=unchecked]:border-border hover:border-muted-foreground/50 hover:shadow-lg">
                      לא ✗
                    </Label>
                  </div>
                </RadioGroup>
                
                <AnimatePresence>
                  {includeAdditionalInstructors === 'yes' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="space-y-3 pt-4 overflow-hidden"
                    >
                      <Label htmlFor="num-additional" className="text-base font-semibold">מספר מדריכים נוספים (כל מדריך = 50% מהבסיס)</Label>
                      <Input
                        id="num-additional"
                        type="number"
                        min="0"
                        value={numAdditionalInstructors}
                        onChange={(e) => setNumAdditionalInstructors(e.target.value)}
                        className="text-right text-lg"
                        placeholder="0"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              </motion.div>
            )}

            {company === 'hachshara' && (
              <motion.div
                key="hachshara"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
              {/* גבול אחריות - הכשרה */}
              <div className="space-y-4 p-6 bg-muted/30 rounded-2xl">
                <Label className="text-xl font-bold text-primary block">💰 גבול אחריות (אחריות מקצועית + צד ג')</Label>
                <RadioGroup 
                  value={liabilityLimit.toString()} 
                  onValueChange={(v) => setLiabilityLimit(parseInt(v) as 1000000 | 2000000 | 3000000 | 4000000)} 
                  className="grid grid-cols-2 gap-4"
                >
                  <div className={`relative cursor-pointer transition-all duration-300 ${liabilityLimit === 1000000 ? 'scale-105' : 'hover:scale-102'}`}>
                    <RadioGroupItem value="1000000" id="limit-h-1m" className="peer sr-only" />
                    <Label htmlFor="limit-h-1m" className="flex items-center justify-center h-16 text-lg font-bold rounded-2xl border-4 cursor-pointer transition-all duration-300 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground peer-data-[state=unchecked]:border-border hover:border-primary/50 hover:shadow-lg">
                      1M ₪
                    </Label>
                  </div>
                  <div className={`relative cursor-pointer transition-all duration-300 ${liabilityLimit === 2000000 ? 'scale-105' : 'hover:scale-102'}`}>
                    <RadioGroupItem value="2000000" id="limit-h-2m" className="peer sr-only" />
                    <Label htmlFor="limit-h-2m" className="flex items-center justify-center h-16 text-lg font-bold rounded-2xl border-4 cursor-pointer transition-all duration-300 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground peer-data-[state=unchecked]:border-border hover:border-primary/50 hover:shadow-lg">
                      2M ₪
                    </Label>
                  </div>
                  <div className={`relative cursor-pointer transition-all duration-300 ${liabilityLimit === 3000000 ? 'scale-105' : 'hover:scale-102'}`}>
                    <RadioGroupItem value="3000000" id="limit-h-3m" className="peer sr-only" />
                    <Label htmlFor="limit-h-3m" className="flex items-center justify-center h-16 text-lg font-bold rounded-2xl border-4 cursor-pointer transition-all duration-300 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground peer-data-[state=unchecked]:border-border hover:border-primary/50 hover:shadow-lg">
                      3M ₪
                    </Label>
                  </div>
                  <div className={`relative cursor-pointer transition-all duration-300 ${liabilityLimit === 4000000 ? 'scale-105' : 'hover:scale-102'}`}>
                    <RadioGroupItem value="4000000" id="limit-h-4m" className="peer sr-only" />
                    <Label htmlFor="limit-h-4m" className="flex items-center justify-center h-16 text-lg font-bold rounded-2xl border-4 cursor-pointer transition-all duration-300 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground peer-data-[state=unchecked]:border-border hover:border-primary/50 hover:shadow-lg">
                      4M ₪
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* תוצאת חישוב שנתי */}
          <Card className="bg-gradient-to-l from-primary/10 to-secondary/10 border-primary shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">💵 סך הכל לתשלום (שנתי)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-bold text-primary">
                {annualPremium.toLocaleString('he-IL')} ₪
              </div>
              <div className="space-y-2 text-sm">
                {breakdown.map((item, index) => (
                  <div key={index} className="text-muted-foreground">
                    • {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* חישוב לפי תאריכים */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-xl font-bold text-primary">📅 חישוב לתקופה מסוימת</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date" className="text-base font-semibold">תאריך תחילת ביטוח</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="text-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date" className="text-base font-semibold">תאריך סיום ביטוח</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="text-lg"
                />
              </div>
            </div>
            
            {days > 0 && (
              <Card className="bg-gradient-to-l from-secondary/10 to-accent/10 border-secondary shadow-lg animate-scale-in">
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-primary">
                      הפרמיה לתקופה שנבחרה: {periodPremium.toLocaleString('he-IL')} ₪
                    </div>
                    <div className="text-base text-muted-foreground">
                      ({days} ימים מתוך 365)
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <Button className="w-full text-xl py-6" size="lg">
            המשך להזמנה 🚀
          </Button>
        </CardContent>
      </Card>
    </main>
  );
};

export default InstructorCalculator;
