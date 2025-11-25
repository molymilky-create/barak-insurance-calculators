import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowRight, RefreshCw } from 'lucide-react';
import CompanyBadge from './CompanyBadge';

interface FarmCalculatorProps {
  onBack: () => void;
}

const FarmCalculator = ({ onBack }: FarmCalculatorProps) => {
  // Company selection
  const [company, setCompany] = useState<'menora' | 'hachshara'>('menora');
  
  // Menora specific states
  const [menoraLiability, setMenoraLiability] = useState<'1m' | '2m' | '4m'>('1m');
  const [calcMethod, setCalcMethod] = useState<'base' | 'cumulative'>('base');
  const [trips, setTrips] = useState<'yes' | 'no'>('no');
  const [tripsBaseCalc, setTripsBaseCalc] = useState(false);
  const [camp, setCamp] = useState<'yes' | 'no'>('no');
  const [numInstructors, setNumInstructors] = useState<'1-5' | '6-10' | '10+'>('1-5');
  const [numHorses, setNumHorses] = useState<'1-5' | '6-10' | '11-15' | '15+'>('1-5');
  const [horsesBaseCalc, setHorsesBaseCalc] = useState(false);
  const [professionalLiability, setProfessionalLiability] = useState<'yes' | 'no'>('no');
  const [profLiabilityBaseCalc, setProfLiabilityBaseCalc] = useState(false);
  const [employerLiability, setEmployerLiability] = useState<'yes' | 'no'>('no');
  const [adminEmployees, setAdminEmployees] = useState('0');
  const [nonAdminEmployees, setNonAdminEmployees] = useState('0');
  
  // Hachshara specific states
  const [hachsharaLiability, setHachsharaLiability] = useState<'1m' | '2m' | '4m'>('1m');
  const [hachsharaTrips, setHachsharaTrips] = useState<'yes' | 'no'>('no');
  const [hachsharaProfessional, setHachsharaProfessional] = useState<'yes' | 'no'>('no');
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [annualPremium, setAnnualPremium] = useState(0);
  const [breakdown, setBreakdown] = useState<{label: string, amount: number}[]>([]);
  const [periodPremium, setPeriodPremium] = useState(0);
  const [days, setDays] = useState(0);

  // Get base premium
  const getBasePremium = () => {
    if (company === 'menora') {
      if (menoraLiability === '1m') return 4000;
      if (menoraLiability === '2m') return 6500;
      return 9500;
    } else {
      if (hachsharaLiability === '1m') return 8000;
      if (hachsharaLiability === '2m') return 10000;
      return 12000;
    }
  };

  // Get horse percentage based on instructors and horses
  const getHorsePercentage = () => {
    if (numInstructors === '1-5') {
      if (numHorses === '1-5') return 0;
      if (numHorses === '6-10') return 0.15;
      if (numHorses === '11-15') return 0.20;
      return 0.30;
    } else if (numInstructors === '6-10') {
      if (numHorses === '1-5') return 0;
      if (numHorses === '6-10') return 0.30;
      if (numHorses === '11-15') return 0.40;
      return 0.60;
    } else {
      if (numHorses === '1-5') return 0;
      if (numHorses === '6-10') return 0.45;
      if (numHorses === '11-15') return 0.55;
      return 0.80;
    }
  };

  // Calculate annual premium
  useEffect(() => {
    const items: {label: string, amount: number}[] = [];
    const basePremium = getBasePremium();
    let total = basePremium;
    let currentBase = basePremium;

    items.push({
      label: `פרמיית בסיס (גבול אחריות ${company === 'menora' ? menoraLiability : hachsharaLiability})`,
      amount: basePremium
    });

    if (company === 'menora') {
      // Trips
      if (trips === 'yes') {
        const useBase = calcMethod === 'base' || tripsBaseCalc;
        const tripsAmount = Math.round((useBase ? basePremium : currentBase) * 0.10);
        total += tripsAmount;
        if (calcMethod === 'cumulative' && !tripsBaseCalc) currentBase += tripsAmount;
        items.push({
          label: `טיולים מחוץ לחווה (10%${useBase ? ' מהבסיס' : ' מצטבר'})`,
          amount: tripsAmount
        });
      }

      // Camp
      if (camp === 'yes') {
        const campAmount = Math.round(basePremium * 0.50);
        total += campAmount;
        items.push({
          label: 'קייטנות עד 20 ילדים (50% מהבסיס)',
          amount: campAmount
        });
      }

      // Horses
      const horsePercentage = getHorsePercentage();
      if (horsePercentage > 0) {
        const useBase = calcMethod === 'base' || horsesBaseCalc;
        const horsesAmount = Math.round((useBase ? basePremium : currentBase) * horsePercentage);
        total += horsesAmount;
        if (calcMethod === 'cumulative' && !horsesBaseCalc) currentBase += horsesAmount;
        items.push({
          label: `תוספת סוסים (${numInstructors} מדריכים, ${numHorses} סוסים, ${horsePercentage * 100}%${useBase ? ' מהבסיס' : ' מצטבר'})`,
          amount: horsesAmount
        });
      }

      // Professional liability cancellation
      if (professionalLiability === 'yes') {
        const useBase = calcMethod === 'base' || profLiabilityBaseCalc;
        const profAmount = Math.round((useBase ? basePremium : currentBase) * 0.50);
        total += profAmount;
        if (calcMethod === 'cumulative' && !profLiabilityBaseCalc) currentBase += profAmount;
        items.push({
          label: `ביטול חריג אחריות מקצועית (50%${useBase ? ' מהבסיס' : ' מצטבר'})`,
          amount: profAmount
        });
      }

      // Employer liability
      if (employerLiability === 'yes') {
        const admin = parseInt(adminEmployees) || 0;
        const nonAdmin = parseInt(nonAdminEmployees) || 0;
        const employerAmount = (admin * 200) + (nonAdmin * 800);
        total += employerAmount;
        if (admin > 0) {
          items.push({
            label: `עובדים מנהלתיים (${admin} × 200 ₪)`,
            amount: admin * 200
          });
        }
        if (nonAdmin > 0) {
          items.push({
            label: `עובדים לא מנהלתיים (${nonAdmin} × 800 ₪)`,
            amount: nonAdmin * 800
          });
        }
      }
    } else {
      // Hachshara calculations
      if (hachsharaTrips === 'yes') {
        total += 2000;
        items.push({
          label: 'טיולים',
          amount: 2000
        });
      }

      if (hachsharaProfessional === 'yes') {
        let profAmount = 0;
        if (hachsharaLiability === '1m') {
          profAmount = 1800;
        } else if (hachsharaLiability === '2m') {
          profAmount = hachsharaTrips === 'yes' ? 2400 : 2000;
        } else {
          profAmount = hachsharaTrips === 'yes' ? 2800 : 2400;
        }
        total += profAmount;
        items.push({
          label: 'ביטול חריג אחריות מקצועית',
          amount: profAmount
        });
      }
    }

    setAnnualPremium(Math.round(total));
    setBreakdown(items);
  }, [company, menoraLiability, calcMethod, trips, tripsBaseCalc, camp, numInstructors, numHorses, 
      horsesBaseCalc, professionalLiability, profLiabilityBaseCalc, employerLiability, 
      adminEmployees, nonAdminEmployees, hachsharaLiability, hachsharaTrips, hachsharaProfessional]);

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
    <main className="container mx-auto px-6 py-8 animate-fade-in" dir="rtl" id="main-content" role="main" aria-label="מחשבון ביטוח חוות סוסים">
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
          <CardTitle className="text-3xl font-bold">🐎 מחשבון ביטוח חוות סוסים</CardTitle>
          <CardDescription className="text-lg">בחר את סוגי הכיסויים לחווה שלך</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
          {/* Company Selection */}
          <div className="space-y-4 p-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl">
            <Label className="text-xl font-bold block">🏢 בחר חברת ביטוח</Label>
            <RadioGroup value={company} onValueChange={(v) => setCompany(v as 'menora' | 'hachshara')} className="grid grid-cols-2 gap-4">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`relative cursor-pointer transition-all duration-300 ${company === 'menora' ? 'scale-105' : ''}`}>
                <RadioGroupItem value="menora" id="comp-menora" className="peer sr-only" />
                <Label htmlFor="comp-menora" className={`flex items-center justify-center h-20 text-2xl font-bold rounded-2xl border-4 cursor-pointer transition-all duration-300 ${
                  company === 'menora' 
                    ? 'border-menora-secondary bg-menora-primary text-menora-dark' 
                    : 'border-border hover:border-menora-secondary hover:shadow-lg'
                }`}>
                  מנורה
                </Label>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`relative cursor-pointer transition-all duration-300 ${company === 'hachshara' ? 'scale-105' : ''}`}>
                <RadioGroupItem value="hachshara" id="comp-hachshara" className="peer sr-only" />
                <Label htmlFor="comp-hachshara" className={`flex items-center justify-center h-20 text-2xl font-bold rounded-2xl border-4 cursor-pointer transition-all duration-300 ${
                  company === 'hachshara' 
                    ? 'border-hachshara-primary bg-hachshara-primary text-white' 
                    : 'border-border hover:border-hachshara-primary hover:shadow-lg'
                }`}>
                  הכשרה
                </Label>
              </motion.div>
            </RadioGroup>
          </div>

          {/* Company Badge */}
          <AnimatePresence mode="wait">
            <motion.div
              key={company}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <CompanyBadge company={company} />
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {company === 'menora' ? (
              <motion.div
                key="menora-content"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="space-y-8"
              >
              {/* Menora - Liability Limit */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="space-y-4 p-6 bg-muted/30 rounded-2xl"
              >
                <Label className="text-xl font-bold text-primary block">⚖️ גבול אחריות צד ג'</Label>
                <RadioGroup value={menoraLiability} onValueChange={(v) => setMenoraLiability(v as '1m' | '2m' | '4m')} className="space-y-3">
                  <div className="flex items-center justify-between p-4 border-2 rounded-xl hover:border-primary transition-colors">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="1m" id="liability-1m" />
                      <Label htmlFor="liability-1m" className="cursor-pointer font-medium text-lg">1,000,000 ₪</Label>
                    </div>
                    <span className="font-bold text-primary text-lg">4,000 ₪</span>
                  </div>
                  <div className="flex items-center justify-between p-4 border-2 rounded-xl hover:border-primary transition-colors">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="2m" id="liability-2m" />
                      <Label htmlFor="liability-2m" className="cursor-pointer font-medium text-lg">2,000,000 ₪</Label>
                    </div>
                    <span className="font-bold text-primary text-lg">6,500 ₪</span>
                  </div>
                  <div className="flex items-center justify-between p-4 border-2 rounded-xl hover:border-primary transition-colors">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="4m" id="liability-4m" />
                      <Label htmlFor="liability-4m" className="cursor-pointer font-medium text-lg">4,000,000 ₪</Label>
                    </div>
                    <span className="font-bold text-primary text-lg">9,500 ₪</span>
                  </div>
                </RadioGroup>
              </motion.div>

              {/* Calculation Method */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="space-y-4 p-6 bg-muted/30 rounded-2xl"
              >
                <Label className="text-xl font-bold text-primary block">🧮 שיטת חישוב תוספות</Label>
                <RadioGroup value={calcMethod} onValueChange={(v) => setCalcMethod(v as 'base' | 'cumulative')} className="space-y-3">
                  <div className="flex items-center gap-3 p-4 border-2 rounded-xl hover:border-primary transition-colors">
                    <RadioGroupItem value="base" id="calc-base" />
                    <Label htmlFor="calc-base" className="cursor-pointer font-medium">
                      <div className="font-bold">חישוב מהבסיס – חסכוני</div>
                      <div className="text-sm text-muted-foreground">כל התוספות מחושבות על פרמיית הבסיס</div>
                    </Label>
                  </div>
                  <div className="flex items-center gap-3 p-4 border-2 rounded-xl hover:border-primary transition-colors">
                    <RadioGroupItem value="cumulative" id="calc-cumulative" />
                    <Label htmlFor="calc-cumulative" className="cursor-pointer font-medium">
                      <div className="font-bold">חישוב מצטבר – מקיף יותר</div>
                      <div className="text-sm text-muted-foreground">תוספות מחושבות על הסכום המצטבר</div>
                    </Label>
                  </div>
                </RadioGroup>
              </motion.div>

              {/* Trips */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="space-y-4 p-6 bg-muted/30 rounded-2xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xl font-bold text-primary block">🚶 טיולים מחוץ לחווה</Label>
                    <p className="text-sm text-muted-foreground mt-1">תוספת 10%</p>
                  </div>
                  {calcMethod === 'cumulative' && trips === 'yes' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTripsBaseCalc(!tripsBaseCalc)}
                      className={tripsBaseCalc ? 'border-secondary text-secondary' : ''}
                    >
                      <RefreshCw className="ml-2 h-4 w-4" />
                      {tripsBaseCalc ? 'מחושב מהבסיס' : 'חשב מהבסיס'}
                    </Button>
                  )}
                </div>
                <RadioGroup value={trips} onValueChange={(v) => setTrips(v as 'yes' | 'no')} className="grid grid-cols-2 gap-4">
                  <div>
                    <RadioGroupItem value="yes" id="trips-yes" className="peer sr-only" />
                    <Label htmlFor="trips-yes" className="flex items-center justify-center h-16 text-xl font-bold rounded-xl border-4 cursor-pointer transition-all duration-300 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=unchecked]:border-border hover:border-primary/50">
                      כן
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="no" id="trips-no" className="peer sr-only" />
                    <Label htmlFor="trips-no" className="flex items-center justify-center h-16 text-xl font-bold rounded-xl border-4 cursor-pointer transition-all duration-300 peer-data-[state=checked]:border-muted-foreground peer-data-[state=checked]:bg-muted peer-data-[state=unchecked]:border-border hover:border-muted-foreground/50">
                      לא
                    </Label>
                  </div>
                </RadioGroup>
              </motion.div>

              {/* Camp */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="space-y-4 p-6 bg-muted/30 rounded-2xl"
              >
                <div>
                  <Label className="text-xl font-bold text-primary block">👶 הפעלת קייטנות עד 20 ילדים</Label>
                  <p className="text-sm text-muted-foreground mt-1">תוספת 50% מפרמיית הבסיס</p>
                </div>
                <RadioGroup value={camp} onValueChange={(v) => setCamp(v as 'yes' | 'no')} className="grid grid-cols-2 gap-4">
                  <div>
                    <RadioGroupItem value="yes" id="camp-yes" className="peer sr-only" />
                    <Label htmlFor="camp-yes" className="flex items-center justify-center h-16 text-xl font-bold rounded-xl border-4 cursor-pointer transition-all duration-300 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=unchecked]:border-border hover:border-primary/50">
                      כן
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="no" id="camp-no" className="peer sr-only" />
                    <Label htmlFor="camp-no" className="flex items-center justify-center h-16 text-xl font-bold rounded-xl border-4 cursor-pointer transition-all duration-300 peer-data-[state=checked]:border-muted-foreground peer-data-[state=checked]:bg-muted peer-data-[state=unchecked]:border-border hover:border-muted-foreground/50">
                      לא
                    </Label>
                  </div>
                </RadioGroup>
              </motion.div>

              {/* Number of Instructors */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="space-y-4 p-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl"
              >
                <Label className="text-xl font-bold block">👨‍🏫 מספר מדריכי רכיבה בחווה</Label>
                <RadioGroup value={numInstructors} onValueChange={(v) => setNumInstructors(v as '1-5' | '6-10' | '10+')} className="space-y-3">
                  <div className="flex items-center gap-3 p-4 border-2 bg-white rounded-xl hover:border-primary transition-colors">
                    <RadioGroupItem value="1-5" id="instructors-1-5" />
                    <Label htmlFor="instructors-1-5" className="cursor-pointer font-medium text-lg">1-5 מדריכי רכיבה</Label>
                  </div>
                  <div className="flex items-center gap-3 p-4 border-2 bg-white rounded-xl hover:border-primary transition-colors">
                    <RadioGroupItem value="6-10" id="instructors-6-10" />
                    <Label htmlFor="instructors-6-10" className="cursor-pointer font-medium text-lg">6-10 מדריכי רכיבה</Label>
                  </div>
                  <div className="flex items-center gap-3 p-4 border-2 bg-white rounded-xl hover:border-primary transition-colors">
                    <RadioGroupItem value="10+" id="instructors-10plus" />
                    <Label htmlFor="instructors-10plus" className="cursor-pointer font-medium text-lg">מעל 10 מדריכי רכיבה</Label>
                  </div>
                </RadioGroup>
              </motion.div>

              {/* Number of Horses */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="space-y-4 p-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl"
              >
                <div className="flex items-center justify-between">
                  <Label className="text-xl font-bold block">🐴 מספר סוסים בחווה</Label>
                  {calcMethod === 'cumulative' && getHorsePercentage() > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setHorsesBaseCalc(!horsesBaseCalc)}
                      className={horsesBaseCalc ? 'border-secondary text-secondary' : ''}
                    >
                      <RefreshCw className="ml-2 h-4 w-4" />
                      {horsesBaseCalc ? 'מחושב מהבסיס' : 'חשב מהבסיס'}
                    </Button>
                  )}
                </div>
                <RadioGroup value={numHorses} onValueChange={(v) => setNumHorses(v as '1-5' | '6-10' | '11-15' | '15+')} className="space-y-3">
                  <div className="flex items-center gap-3 p-4 border-2 bg-white rounded-xl hover:border-primary transition-colors">
                    <RadioGroupItem value="1-5" id="horses-1-5" />
                    <Label htmlFor="horses-1-5" className="cursor-pointer font-medium text-lg">1-5 סוסים {numInstructors === '1-5' && '(0%)'}</Label>
                  </div>
                  <div className="flex items-center gap-3 p-4 border-2 bg-white rounded-xl hover:border-primary transition-colors">
                    <RadioGroupItem value="6-10" id="horses-6-10" />
                    <Label htmlFor="horses-6-10" className="cursor-pointer font-medium text-lg">
                      6-10 סוסים {numInstructors === '1-5' && '(15%)'}{numInstructors === '6-10' && '(30%)'}{numInstructors === '10+' && '(45%)'}
                    </Label>
                  </div>
                  <div className="flex items-center gap-3 p-4 border-2 bg-white rounded-xl hover:border-primary transition-colors">
                    <RadioGroupItem value="11-15" id="horses-11-15" />
                    <Label htmlFor="horses-11-15" className="cursor-pointer font-medium text-lg">
                      11-15 סוסים {numInstructors === '1-5' && '(20%)'}{numInstructors === '6-10' && '(40%)'}{numInstructors === '10+' && '(55%)'}
                    </Label>
                  </div>
                  <div className="flex items-center gap-3 p-4 border-2 bg-white rounded-xl hover:border-primary transition-colors">
                    <RadioGroupItem value="15+" id="horses-15plus" />
                    <Label htmlFor="horses-15plus" className="cursor-pointer font-medium text-lg">
                      מעל 15 סוסים {numInstructors === '1-5' && '(30%)'}{numInstructors === '6-10' && '(60%)'}{numInstructors === '10+' && '(80%)'}
                    </Label>
                  </div>
                </RadioGroup>
              </motion.div>

              {/* Professional Liability Cancellation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
                className="space-y-4 p-6 bg-muted/30 rounded-2xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xl font-bold text-primary block">📋 ביטול חריג אחריות מקצועית</Label>
                    <p className="text-sm text-muted-foreground mt-1">תוספת 50%</p>
                  </div>
                  {calcMethod === 'cumulative' && professionalLiability === 'yes' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setProfLiabilityBaseCalc(!profLiabilityBaseCalc)}
                      className={profLiabilityBaseCalc ? 'border-secondary text-secondary' : ''}
                    >
                      <RefreshCw className="ml-2 h-4 w-4" />
                      {profLiabilityBaseCalc ? 'מחושב מהבסיס' : 'חשב מהבסיס'}
                    </Button>
                  )}
                </div>
                <RadioGroup value={professionalLiability} onValueChange={(v) => setProfessionalLiability(v as 'yes' | 'no')} className="grid grid-cols-2 gap-4">
                  <div>
                    <RadioGroupItem value="yes" id="prof-yes" className="peer sr-only" />
                    <Label htmlFor="prof-yes" className="flex items-center justify-center h-16 text-xl font-bold rounded-xl border-4 cursor-pointer transition-all duration-300 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=unchecked]:border-border hover:border-primary/50">
                      כן
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="no" id="prof-no" className="peer sr-only" />
                    <Label htmlFor="prof-no" className="flex items-center justify-center h-16 text-xl font-bold rounded-xl border-4 cursor-pointer transition-all duration-300 peer-data-[state=checked]:border-muted-foreground peer-data-[state=checked]:bg-muted peer-data-[state=unchecked]:border-border hover:border-muted-foreground/50">
                      לא
                    </Label>
                  </div>
                </RadioGroup>
              </motion.div>

              {/* Employer Liability */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                className="space-y-4 p-6 bg-muted/30 rounded-2xl"
              >
                <div>
                  <Label className="text-xl font-bold text-primary block">👔 חבות מעבידים</Label>
                  <p className="text-sm text-muted-foreground mt-1">ביטוח חבות כלפי עובדים</p>
                </div>
                <RadioGroup value={employerLiability} onValueChange={(v) => setEmployerLiability(v as 'yes' | 'no')} className="grid grid-cols-2 gap-4">
                  <div>
                    <RadioGroupItem value="yes" id="employer-yes" className="peer sr-only" />
                    <Label htmlFor="employer-yes" className="flex items-center justify-center h-16 text-xl font-bold rounded-xl border-4 cursor-pointer transition-all duration-300 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=unchecked]:border-border hover:border-primary/50">
                      כן
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="no" id="employer-no" className="peer sr-only" />
                    <Label htmlFor="employer-no" className="flex items-center justify-center h-16 text-xl font-bold rounded-xl border-4 cursor-pointer transition-all duration-300 peer-data-[state=checked]:border-muted-foreground peer-data-[state=checked]:bg-muted peer-data-[state=unchecked]:border-border hover:border-muted-foreground/50">
                      לא
                    </Label>
                  </div>
                </RadioGroup>

                <AnimatePresence>
                  {employerLiability === 'yes' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="space-y-4 mt-4 overflow-hidden"
                    >
                      <div>
                        <Label htmlFor="admin-employees" className="font-semibold block mb-2">👨‍💼 עובדים מנהלתיים (מזכירה, פקידה וכו')</Label>
                        <p className="text-sm text-muted-foreground mb-2">200 ₪ לכל עובד</p>
                        <Input
                          id="admin-employees"
                          type="number"
                          min="0"
                          value={adminEmployees}
                          onChange={(e) => setAdminEmployees(e.target.value)}
                          className="text-right text-xl h-14"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="non-admin-employees" className="font-semibold block mb-2">👷 עובדים לא מנהלתיים (מדריכים, תחזוקה וכו')</Label>
                        <p className="text-sm text-muted-foreground mb-2">800 ₪ לכל עובד</p>
                        <Input
                          id="non-admin-employees"
                          type="number"
                          min="0"
                          value={nonAdminEmployees}
                          onChange={(e) => setNonAdminEmployees(e.target.value)}
                          className="text-right text-xl h-14"
                          placeholder="0"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                key="hachshara-content"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="space-y-8"
              >
              {/* Hachshara - Liability Limit */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="space-y-4 p-6 bg-muted/30 rounded-2xl"
              >
                <Label className="text-xl font-bold text-primary block">⚖️ גבול אחריות צד ג'</Label>
                <RadioGroup value={hachsharaLiability} onValueChange={(v) => setHachsharaLiability(v as '1m' | '2m' | '4m')} className="space-y-3">
                  <div className="flex items-center justify-between p-4 border-2 rounded-xl hover:border-primary transition-colors">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="1m" id="hach-liability-1m" />
                      <Label htmlFor="hach-liability-1m" className="cursor-pointer font-medium text-lg">1,000,000 ₪</Label>
                    </div>
                    <span className="font-bold text-primary text-lg">8,000 ₪</span>
                  </div>
                  <div className="flex items-center justify-between p-4 border-2 rounded-xl hover:border-primary transition-colors">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="2m" id="hach-liability-2m" />
                      <Label htmlFor="hach-liability-2m" className="cursor-pointer font-medium text-lg">2,000,000 ₪</Label>
                    </div>
                    <span className="font-bold text-primary text-lg">10,000 ₪</span>
                  </div>
                  <div className="flex items-center justify-between p-4 border-2 rounded-xl hover:border-primary transition-colors">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="4m" id="hach-liability-4m" />
                      <Label htmlFor="hach-liability-4m" className="cursor-pointer font-medium text-lg">4,000,000 ₪</Label>
                    </div>
                    <span className="font-bold text-primary text-lg">12,000 ₪</span>
                  </div>
                </RadioGroup>
              </motion.div>

              {/* Hachshara Trips */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="space-y-4 p-6 bg-muted/30 rounded-2xl"
              >
                <div>
                  <Label className="text-xl font-bold text-primary block">🚶 כולל טיולים</Label>
                  <p className="text-sm text-muted-foreground mt-1">תוספת 2,000 ₪</p>
                </div>
                <RadioGroup value={hachsharaTrips} onValueChange={(v) => setHachsharaTrips(v as 'yes' | 'no')} className="grid grid-cols-2 gap-4">
                  <div>
                    <RadioGroupItem value="yes" id="hach-trips-yes" className="peer sr-only" />
                    <Label htmlFor="hach-trips-yes" className="flex items-center justify-center h-16 text-xl font-bold rounded-xl border-4 cursor-pointer transition-all duration-300 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=unchecked]:border-border hover:border-primary/50">
                      כן
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="no" id="hach-trips-no" className="peer sr-only" />
                    <Label htmlFor="hach-trips-no" className="flex items-center justify-center h-16 text-xl font-bold rounded-xl border-4 cursor-pointer transition-all duration-300 peer-data-[state=checked]:border-muted-foreground peer-data-[state=checked]:bg-muted peer-data-[state=unchecked]:border-border hover:border-muted-foreground/50">
                      לא
                    </Label>
                  </div>
                </RadioGroup>
              </motion.div>

              {/* Hachshara Professional Liability Cancellation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="space-y-4 p-6 bg-muted/30 rounded-2xl"
              >
                <div>
                  <Label className="text-xl font-bold text-primary block">📋 ביטול חריג אחריות מקצועית</Label>
                  <p className="text-sm text-muted-foreground mt-1">תוספות משתנות לפי גבול אחריות וטיולים</p>
                </div>
                <RadioGroup value={hachsharaProfessional} onValueChange={(v) => setHachsharaProfessional(v as 'yes' | 'no')} className="grid grid-cols-2 gap-4">
                  <div>
                    <RadioGroupItem value="yes" id="hach-prof-yes" className="peer sr-only" />
                    <Label htmlFor="hach-prof-yes" className="flex items-center justify-center h-16 text-xl font-bold rounded-xl border-4 cursor-pointer transition-all duration-300 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=unchecked]:border-border hover:border-primary/50">
                      כן
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="no" id="hach-prof-no" className="peer sr-only" />
                    <Label htmlFor="hach-prof-no" className="flex items-center justify-center h-16 text-xl font-bold rounded-xl border-4 cursor-pointer transition-all duration-300 peer-data-[state=checked]:border-muted-foreground peer-data-[state=checked]:bg-muted peer-data-[state=unchecked]:border-border hover:border-muted-foreground/50">
                      לא
                    </Label>
                  </div>
                </RadioGroup>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Annual Premium Summary */}
          <AnimatePresence>
          {annualPremium > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary shadow-xl">
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
            </motion.div>
          )}
          </AnimatePresence>

          {/* Period Calculation */}
          <AnimatePresence>
          {annualPremium > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
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
            </motion.div>
          )}
          </AnimatePresence>

          <Button className="w-full bg-gradient-to-l from-primary to-secondary hover:from-secondary hover:to-primary text-white text-xl py-7" size="lg">
            המשך להזמנה
          </Button>
        </CardContent>
      </Card>
    </main>
  );
};

export default FarmCalculator;