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
  kind: 'חוק' | 'חוזר' | 'תקנות' | 'הנחיה';
  audience: 'כללי' | 'סוכן/יועץ' | 'גוף מוסדי' | 'נותן שירותים פיננסיים';
  code?: string;
  year: number;
  title: string;
  area: string;
  shortSummary: string;
  link: string;
}

const lawsData: Law[] = [
  // חוקים
  {
    id: "law-insurance-contract-1981",
    kind: "חוק",
    audience: "כללי",
    code: "חוק חוזה הביטוח",
    title: 'חוק חוזה הביטוח, תשמ"א-1981',
    year: 1981,
    area: "ביטוח כללי / חיים / בריאות",
    shortSummary:
      "המסגרת העיקרית ליחסים בין מבטח למבוטח: כריתת חוזה, חובת גילוי, אי־התאמה, תרמית, תשלום תגמולים, התיישנות ועוד.",
    link: "https://www.nevo.co.il/law_html/law00/71902.htm"
  },
  {
    id: "law-supervision-insurance-1981",
    kind: "חוק",
    audience: "כללי",
    code: "חוק הפיקוח על הביטוח",
    title: 'חוק הפיקוח על שירותים פיננסיים (ביטוח), תשמ"א-1981',
    year: 1981,
    area: "פיקוח על חברות ביטוח וסוכנים",
    shortSummary:
      "מסדיר את הפיקוח על ענף הביטוח: רישוי, הוראות פיקוח, סמכויות הממונה, הוראות לציבור, חוזרים ועוד.",
    link: "https://www.nevo.co.il/law_html/law00/4643.htm"
  },
  {
    id: "law-supervision-provident-funds-2005",
    kind: "חוק",
    audience: "כללי",
    code: "חוק הפיקוח על קופות גמל",
    title: 'חוק הפיקוח על שירותים פיננסיים (קופות גמל), תשס"ה-2005',
    year: 2005,
    area: "חיסכון פנסיוני / קופות גמל",
    shortSummary:
      "מסגרת הפיקוח על קופות גמל וקרנות השתלמות: רישוי גופים מוסדיים, ניהול כספי חוסכים, דוחות, ממשל תאגידי.",
    link: "https://www.nevo.co.il/law_html/law01/999_470.htm"
  },
  {
    id: "law-supervision-pension-advice-2005",
    kind: "חוק",
    audience: "סוכן/יועץ",
    code: "חוק הייעוץ והשיווק הפנסיוני",
    title:
      'חוק הפיקוח על שירותים פיננסיים (ייעוץ, שיווק ומערכת סליקה פנסיוניים), תשס"ה-2005',
    year: 2005,
    area: "פנסיה / ייעוץ ושיווק",
    shortSummary:
      "מסדיר רישוי יועצים וסוכני שיווק פנסיוניים, חובות נאמנות וזהירות, הפרדה בין ייעוץ לשיווק ועוד.",
    link: "https://www.nevo.co.il/law_html/law00/73928.htm"
  },
  {
    id: "law-supervised-financial-services-2016",
    kind: "חוק",
    audience: "נותן שירותים פיננסיים",
    code: "חוק שירותים פיננסיים מוסדרים",
    title:
      'חוק הפיקוח על שירותים פיננסיים (שירותים פיננסיים מוסדרים), תשע"ו-2016',
    year: 2016,
    area: "שירותים פיננסיים חוץ־בנקאיים",
    shortSummary:
      "מסדיר רישוי ופיקוח על נותני שירותים פיננסיים (אשראי, אשראי חוץ־בנקאי וכו'), סמכויות המפקח וחובות הדיווח.",
    link: "https://www.nevo.co.il/law_html/law01/501_439.htm"
  },

  // חוזרים
  {
    id: "circular-insurance-2016-1-7-join",
    kind: "חוזר",
    audience: "סוכן/יועץ",
    code: "2016-1-7",
    title: "חוזר ביטוח 2016-1-7 – צירוף לביטוח",
    year: 2016,
    area: "ביטוח כללי / בריאות / חיים",
    shortSummary:
      "מסדיר את דרך צירוף מבוטח לביטוח: איסוף מידע רפואי, שאלון בריאות, מסירת הסברים, תיעוד שיחה/פגישה ועוד.",
    link: "https://www.menoramivt.co.il/general/join-insurance"
  },
  {
    id: "circular-insurance-2022-1-15-online-interface",
    kind: "חוזר",
    audience: "סוכן/יועץ",
    code: "2022-1-15",
    title: "חוזר ביטוח 2022-1-15 – ממשק אינטרנטי לאיתור מוצרי ביטוח",
    year: 2022,
    area: "ביטוח כללי / בריאות / חובות סוכן",
    shortSummary:
      "קובע הוראות לממשק אינטרנטי שבו סוכן יכול לאתר מוצרי ביטוח והסדר הרשאות 'מורשי צפייה' לעובדי הסוכנות.",
    link: "https://www.gov.il/BlobFolder/dynamiccollectorresultitem/notice-2023-1-3/he/regulation_%202023-1-3_final_word.docx"
  },
  {
    id: "circular-agents-2012-10-4-service-to-clients",
    kind: "חוזר",
    audience: "סוכן/יועץ",
    code: "2012-10-4",
    title: "חוזר סוכנים ויועצים 2012-10-4 – שירות ללקוחות סוכנים ויועצים",
    year: 2012,
    area: "שירות לקוחות / התנהלות סוכן",
    shortSummary:
      "אמנת שירות לסוכנים ויועצים: חובת רמת שירות נאותה, זמינות, טיפול בתביעות, תיעוד פניות ועוד (עודכן ב-2022-10-10).",
    link: "https://www.gov.il/BlobFolder/dynamiccollectorresultitem/regulation-1708/he/regulation_2012-10-4.doc"
  },
  {
    id: "circular-agents-2022-10-10-service-to-clients-update",
    kind: "חוזר",
    audience: "סוכן/יועץ",
    code: "2022-10-10",
    title: "חוזר שירות ללקוחות סוכנים ויועצים – תיקון (2022-10-10)",
    year: 2022,
    area: "שירות לקוחות / התנהלות סוכן",
    shortSummary:
      "מעדכן את אמנת השירות לסוכנים ויועצים, כולל חיזוק חובות שירות, זמני מענה וחובת תיעוד.",
    link: "https://www.nevo.co.il/FilesFolderPermalink.aspx?b=files&r=הנחיות, הוראות וחוזרים\\חוזרי שוק ההון ביטוח וחיסכון\\חוזרי סוכנים ויועצים\\2022"
  },
  {
    id: "circular-institutions-2021-9-5-pension-join",
    kind: "חוזר",
    audience: "גוף מוסדי",
    code: "2021-9-5",
    title:
      "חוזר גופים מוסדיים 2021-9-5 – הצטרפות לקרן פנסיה או לקופת גמל (תיקון)",
    year: 2021,
    area: "פנסיה / גופים מוסדיים",
    shortSummary:
      "קובע נוסח אחיד לטפסי הצטרפות לקרן פנסיה/קופת גמל וטפסי שינוי – לשיפור בהירות וזכויות העמית.",
    link: "https://www.gov.il/he/pages/pension-provident-fund"
  }
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
        law.shortSummary.toLowerCase().includes(searchText.toLowerCase()) ||
        law.area.toLowerCase().includes(searchText.toLowerCase()) ||
        (law.code && law.code.toLowerCase().includes(searchText.toLowerCase()));
      
      const matchesType = typeFilter === 'all' || law.kind === typeFilter;
      const matchesAudience = audienceFilter === 'all' || law.audience === audienceFilter;
      const matchesYear = yearFilter === '' || law.year.toString() === yearFilter;
      
      return matchesText && matchesType && matchesAudience && matchesYear;
    });
  }, [searchText, typeFilter, audienceFilter, yearFilter]);

  const getTypeBadgeColor = (kind: string) => {
    switch (kind) {
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
                          <Badge className={getTypeBadgeColor(law.kind)}>
                            {law.kind}
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
                        
                        <div className="text-xs text-muted-foreground font-medium mb-1">
                          {law.area}
                        </div>
                        
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {law.shortSummary}
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
