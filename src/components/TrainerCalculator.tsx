import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowRight } from 'lucide-react';
import CompanyBadge from './CompanyBadge';

interface TrainerCalculatorProps {
  onBack: () => void;
}

const TrainerCalculator = ({ onBack }: TrainerCalculatorProps) => {
  const [company, setCompany] = useState<'menora' | 'hachshara'>('hachshara');
  const [trainerType, setTrainerType] = useState<'fitness' | 'martial-arts'>('fitness');
  const [liabilityLimit, setLiabilityLimit] = useState<500000 | 750000 | 1000000 | 1500000 | 2000000 | 3000000>(500000);
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [annualPremium, setAnnualPremium] = useState(0);
  const [periodPremium, setPeriodPremium] = useState(0);
  const [days, setDays] = useState(0);

  // Hachshara UP pricing table
  const hachsharaPrices = {
    500000: 750,
    750000: 900,
    1000000: 1100,
    1500000: 1350,
    2000000: 1700,
    3000000: 2000,
  };

  // Calculate annual premium
  useEffect(() => {
    if (company === 'hachshara') {
      setAnnualPremium(hachsharaPrices[liabilityLimit]);
    } else {
      // Menora - use same prices for now (can be updated later)
      setAnnualPremium(hachsharaPrices[liabilityLimit]);
    }
  }, [company, liabilityLimit]);

  // Calculate period premium
  useEffect(() => {
    if (startDate && endDate && annualPremium > 0) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setDays(diffDays);
      const periodAmount = Math.round((annualPremium / 365) * diffDays);
      setPeriodPremium(periodAmount);
    } else {
      setDays(0);
      setPeriodPremium(0);
    }
  }, [startDate, endDate, annualPremium]);

  const themeColors = company === 'menora' 
    ? 'border-menora-secondary hover:bg-menora-bg focus:ring-menora-primary'
    : 'border-hachshara-primary hover:bg-hachshara-bg focus:ring-hachshara-primary';

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="outline"
          onClick={onBack}
          className="mb-6 text-lg"
          aria-label="חזרה למסך הבחירה"
        >
          ← חזרה למסך הבחירה
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="shadow-2xl border-2" aria-label="מחשבון מאמני כושר ואומנויות לחימה">
            <CardHeader className="bg-gradient-to-l from-primary/5 to-secondary/5 border-b-2">
              <CardTitle className="text-4xl font-bold text-center text-foreground">
                🏋️‍♂️ מחשבון מאמני כושר ואומנויות לחימה
              </CardTitle>
              <CardDescription className="text-center text-lg mt-2">
                ביטוח אחריות צד ג' + ביטול חריג אחריות מקצועית
              </CardDescription>
            </CardHeader>

            <CardContent className="p-8 space-y-8">
              {/* Company Selection */}
              <fieldset className="space-y-4">
                <legend className="text-2xl font-semibold text-foreground mb-4">
                  בחירת חברת ביטוח
                </legend>
                <RadioGroup
                  value={company}
                  onValueChange={(value) => setCompany(value as 'menora' | 'hachshara')}
                  className="space-y-3"
                  aria-label="בחירת חברת ביטוח"
                >
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Label
                      htmlFor="company-menora"
                      className={`flex items-center space-x-3 space-x-reverse p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        company === 'menora'
                          ? 'bg-menora-bg border-menora-secondary shadow-lg'
                          : 'bg-muted/30 border-border hover:border-menora-secondary'
                      }`}
                    >
                      <RadioGroupItem value="menora" id="company-menora" />
                      <span className="text-xl font-medium">מנורה – Top Sport</span>
                    </Label>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Label
                      htmlFor="company-hachshara"
                      className={`flex items-center space-x-3 space-x-reverse p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        company === 'hachshara'
                          ? 'bg-hachshara-bg border-hachshara-primary shadow-lg'
                          : 'bg-muted/30 border-border hover:border-hachshara-primary'
                      }`}
                    >
                      <RadioGroupItem value="hachshara" id="company-hachshara" />
                      <span className="text-xl font-medium">הכשרה – מסלול UP</span>
                    </Label>
                  </motion.div>
                </RadioGroup>
              </fieldset>

              <AnimatePresence mode="wait">
                <motion.div
                  key={company}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <CompanyBadge 
                    company={company} 
                    productName={company === 'menora' ? 'Top Sport' : 'מסלול UP'} 
                  />
                </motion.div>
              </AnimatePresence>

              {/* Trainer Type (only for Hachshara) */}
              <AnimatePresence>
                {company === 'hachshara' && (
                  <motion.fieldset
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 overflow-hidden"
                  >
                    <legend className="text-2xl font-semibold text-foreground mb-4">
                      סוג המאמן
                    </legend>
                    <RadioGroup
                      value={trainerType}
                      onValueChange={(value) => setTrainerType(value as 'fitness' | 'martial-arts')}
                      className="space-y-3"
                      aria-label="סוג המאמן"
                    >
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Label
                          htmlFor="trainer-fitness"
                          className={`flex items-center space-x-3 space-x-reverse p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            trainerType === 'fitness'
                              ? `bg-${company}-bg border-${company}-primary shadow-lg`
                              : `bg-muted/30 border-border ${themeColors}`
                          }`}
                        >
                          <RadioGroupItem value="fitness" id="trainer-fitness" />
                          <span className="text-xl font-medium">מאמן כושר</span>
                        </Label>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Label
                          htmlFor="trainer-martial"
                          className={`flex items-center space-x-3 space-x-reverse p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            trainerType === 'martial-arts'
                              ? `bg-${company}-bg border-${company}-primary shadow-lg`
                              : `bg-muted/30 border-border ${themeColors}`
                          }`}
                        >
                          <RadioGroupItem value="martial-arts" id="trainer-martial" />
                          <span className="text-xl font-medium">מאמן אומנויות לחימה</span>
                        </Label>
                      </motion.div>
                    </RadioGroup>
                  </motion.fieldset>
                )}
              </AnimatePresence>

              {/* Liability Limit Selection */}
              <fieldset className="space-y-4">
                <legend className="text-2xl font-semibold text-foreground mb-4">
                  גבול אחריות צד ג' + ביטול חריג מקצועית
                </legend>
                <RadioGroup
                  value={liabilityLimit.toString()}
                  onValueChange={(value) => setLiabilityLimit(parseInt(value) as any)}
                  className="space-y-3"
                  aria-label="בחירת גבול אחריות"
                >
                  {Object.entries(hachsharaPrices).map(([limit, price]) => (
                    <motion.div key={limit} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Label
                        htmlFor={`limit-${limit}`}
                        className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          liabilityLimit.toString() === limit
                            ? company === 'menora'
                              ? 'bg-menora-bg border-menora-secondary shadow-lg'
                              : 'bg-hachshara-bg border-hachshara-primary shadow-lg'
                            : `bg-muted/30 border-border ${themeColors}`
                        }`}
                      >
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <RadioGroupItem value={limit} id={`limit-${limit}`} />
                          <span className="text-lg font-medium">
                            {(parseInt(limit) / 1000).toLocaleString('he-IL')} אלף ₪ צד ג' + מקצועית
                          </span>
                        </div>
                        <span className={`text-xl font-bold ${
                          company === 'menora' ? 'text-menora-dark' : 'text-hachshara-primary'
                        }`}>
                          {price.toLocaleString('he-IL')} ₪
                        </span>
                      </Label>
                    </motion.div>
                  ))}
                </RadioGroup>
              </fieldset>

              {/* Annual Premium Summary */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Card className={`border-2 ${
                  company === 'menora' 
                    ? 'bg-gradient-to-br from-menora-bg to-white border-menora-secondary' 
                    : 'bg-gradient-to-br from-hachshara-bg to-white border-hachshara-primary'
                }`}>
                  <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center">
                      סך הכל לתשלום (שנתי)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className={`text-6xl font-bold text-center ${
                      company === 'menora' ? 'text-menora-dark' : 'text-hachshara-primary'
                    }`}>
                      {annualPremium.toLocaleString('he-IL')} ₪
                    </div>
                    
                    <div className="space-y-2 text-right bg-white/60 p-4 rounded-lg">
                      <div className="flex justify-between text-lg">
                        <span className="font-semibold">חברת ביטוח:</span>
                        <span>{company === 'menora' ? 'מנורה – Top Sport' : 'הכשרה – מסלול UP'}</span>
                      </div>
                      {company === 'hachshara' && (
                        <div className="flex justify-between text-lg">
                          <span className="font-semibold">סוג מאמן:</span>
                          <span>{trainerType === 'fitness' ? 'מאמן כושר' : 'מאמן אומנויות לחימה'}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-lg">
                        <span className="font-semibold">גבול אחריות:</span>
                        <span>{(liabilityLimit / 1000).toLocaleString('he-IL')} אלף ₪</span>
                      </div>
                      <div className="flex justify-between text-xl font-bold border-t-2 pt-2">
                        <span>פרמיה שנתית:</span>
                        <span className={company === 'menora' ? 'text-menora-dark' : 'text-hachshara-primary'}>
                          {annualPremium.toLocaleString('he-IL')} ₪
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Period Calculation */}
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-right">
                    חישוב פרמיה לתקופה חלקית
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-date" className="text-lg">תאריך תחילת ביטוח</Label>
                      <Input
                        id="start-date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="text-lg"
                        aria-label="תאריך תחילת ביטוח"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-date" className="text-lg">תאריך סיום ביטוח</Label>
                      <Input
                        id="end-date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="text-lg"
                        aria-label="תאריך סיום ביטוח"
                      />
                    </div>
                  </div>

                  <AnimatePresence>
                    {periodPremium > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`p-6 rounded-lg border-2 ${
                          company === 'menora'
                            ? 'bg-menora-bg border-menora-secondary'
                            : 'bg-hachshara-bg border-hachshara-primary'
                        }`}
                      >
                        <div className="space-y-3 text-right">
                          <div className="text-lg">
                            <span className="font-semibold">מספר הימים שנבחרו: </span>
                            <span className="text-xl font-bold">{days}</span>
                          </div>
                          <div className={`text-3xl font-bold ${
                            company === 'menora' ? 'text-menora-dark' : 'text-hachshara-primary'
                          }`}>
                            הפרמיה לתקופה שנבחרה: {periodPremium.toLocaleString('he-IL')} ₪
                          </div>
                          <div className="text-base text-muted-foreground">
                            ({days} ימים מתוך 365)
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
};

export default TrainerCalculator;
