import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ExternalLink, FileText } from 'lucide-react';

interface Law {
  id: string;
  type: 'חוק' | 'חוזר' | 'תקנות' | 'הנחיה';
  audience: 'כללי' | 'סוכן/יועץ' | 'גוף מוסדי' | 'נותן שירותים פיננסיים';
  code?: string;
  year: number;
  title: string;
  description: string;
  link: string;
}

// נתוני לדוגמה - יש להחליף ברשימה המלאה שלך
const lawsData: Law[] = [
  {
    id: '1',
    type: 'חוק',
    audience: 'כללי',
    code: 'חוק הפיקוח',
    year: 1981,
    title: 'חוק הפיקוח על שירותים פיננסיים (ביטוח), התשמ"א-1981',
    description: 'חוק זה קובע את המסגרת הרגולטורית להפיקוח על שירותי ביטוח בישראל, כולל רישוי, דרישות הון וניהול סיכונים.',
    link: 'https://www.nevo.co.il/law_html/law01/999_001.htm',
  },
  {
    id: '2',
    type: 'חוזר',
    audience: 'סוכן/יועץ',
    code: 'חוזר גמל 2020-9-11',
    year: 2020,
    title: 'חוזר גופים מוסדיים: תקשורת עם מבוטח בדרכים אלקטרוניות',
    description: 'החוזר קובע כללים לתקשורת דיגיטלית בין חברות ביטוח למבוטחים, כולל דרישות אבטחת מידע והסכמת הלקוח.',
    link: 'https://www.gov.il/he/departments/policies/2020-9-11',
  },
  {
    id: '3',
    type: 'תקנות',
    audience: 'גוף מוסדי',
    code: 'תקנות ביטוח',
    year: 2012,
    title: 'תקנות הפיקוח על שירותים פיננסיים (ביטוח) (דרכי השקעה), התשע"ב-2012',
    description: 'תקנות המסדירות את דרכי ההשקעה המותרות לחברות ביטוח, כולל מגבלות על סוגי נכסים ורמות פיזור.',
    link: 'https://www.nevo.co.il/law_html/law01/501_001.htm',
  },
  {
    id: '4',
    type: 'הנחיה',
    audience: 'סוכן/יועץ',
    year: 2019,
    title: 'הנחיה בנושא חובת גילוי מלא במכירת פוליסות ביטוח',
    description: 'הנחיה המפרטת את חובות הגילוי של סוכני ביטוח ויועצי השקעות כלפי לקוחות, כולל גילוי עמלות וניגודי עניינים.',
    link: 'https://www.gov.il/he/departments/policies/disclosure-2019',
  },
  {
    id: '5',
    type: 'חוזר',
    audience: 'נותן שירותים פיננסיים',
    code: 'חוזר ביטוח 2021-5-8',
    year: 2021,
    title: 'ביטוח אחריות מקצועית לנותני שירותים פיננסיים',
    description: 'החוזר קובע דרישות לביטוח אחריות מקצועית עבור סוכני ביטוח ויועצי פנסיה, כולל סכומי כיסוי מינימליים.',
    link: 'https://www.gov.il/he/departments/policies/2021-5-8',
  },
];

const LawsDatabase = () => {
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [audienceFilter, setAudienceFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('');

  const filteredLaws = useMemo(() => {
    return lawsData.filter(law => {
      const matchesText = searchText === '' || 
        law.title.toLowerCase().includes(searchText.toLowerCase()) ||
        law.description.toLowerCase().includes(searchText.toLowerCase()) ||
        (law.code && law.code.toLowerCase().includes(searchText.toLowerCase()));
      
      const matchesType = typeFilter === 'all' || law.type === typeFilter;
      const matchesAudience = audienceFilter === 'all' || law.audience === audienceFilter;
      const matchesYear = yearFilter === '' || law.year.toString() === yearFilter;
      
      return matchesText && matchesType && matchesAudience && matchesYear;
    });
  }, [searchText, typeFilter, audienceFilter, yearFilter]);

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'חוק': return 'bg-primary text-primary-foreground';
      case 'חוזר': return 'bg-secondary text-secondary-foreground';
      case 'תקנות': return 'bg-accent text-accent-foreground';
      case 'הנחיה': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="bg-muted/30 py-12" dir="rtl">
      <div className="container mx-auto px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <FileText className="h-6 w-6" />
              מאגר חוקים וחוזרים
            </CardTitle>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                לשימוש פנימי בלבד – לא במקום עיון במקור הרשמי
              </AlertDescription>
            </Alert>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* פילטרים */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search-text">חיפוש חופשי</Label>
                <Input
                  id="search-text"
                  placeholder="חפש בכותרת או תיאור..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="text-right"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type-filter">סוג</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger id="type-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">כל הסוגים</SelectItem>
                    <SelectItem value="חוק">חוק</SelectItem>
                    <SelectItem value="חוזר">חוזר</SelectItem>
                    <SelectItem value="תקנות">תקנות</SelectItem>
                    <SelectItem value="הנחיה">הנחיה</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="audience-filter">קהל יעד</Label>
                <Select value={audienceFilter} onValueChange={setAudienceFilter}>
                  <SelectTrigger id="audience-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">כל</SelectItem>
                    <SelectItem value="כללי">כללי</SelectItem>
                    <SelectItem value="סוכן/יועץ">סוכן/יועץ</SelectItem>
                    <SelectItem value="גוף מוסדי">גוף מוסדי</SelectItem>
                    <SelectItem value="נותן שירותים פיננסיים">נותן שירותים פיננסיים</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="year-filter">שנה</Label>
                <Input
                  id="year-filter"
                  type="number"
                  placeholder="לדוגמה: 2020"
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="text-right"
                />
              </div>
            </div>

            {/* תוצאות */}
            <div className="space-y-4 mt-6">
              {filteredLaws.length === 0 ? (
                <Alert>
                  <AlertDescription className="text-center py-8">
                    לא נמצאו תוצאות המתאימות לחיפוש
                  </AlertDescription>
                </Alert>
              ) : (
                filteredLaws.map(law => (
                  <Card key={law.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          <Badge className={getTypeBadgeColor(law.type)}>
                            {law.type}
                          </Badge>
                          <Badge variant="outline">
                            {law.audience}
                          </Badge>
                          {law.code && (
                            <Badge variant="secondary">
                              {law.code}
                            </Badge>
                          )}
                          <Badge variant="outline">
                            {law.year}
                          </Badge>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-foreground">
                          {law.title}
                        </h3>
                        
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {law.description}
                        </p>
                        
                        <Button variant="outline" size="sm" asChild>
                          <a href={law.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="ml-2 h-4 w-4" />
                            פתיחת מסמך רשמי
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LawsDatabase;
