import { Card, CardContent } from "@/components/ui/card";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { 
  FileText, 
  RefreshCw, 
  Users, 
  TrendingUp, 
  Calendar,
  AlertCircle
} from "lucide-react";

const Dashboard = () => {
  const { policies, renewals, leads, tasks, commissions } = useData();
  const { isAdmin } = useAuth();

  const totalPremium = policies.reduce(
    (sum, p) => sum + (p.annualPremium || 0),
    0
  );
  const totalCommission = commissions.reduce(
    (sum, c) => sum + (c.finalCommission || 0),
    0
  );

  // חידושים בחודש הקרוב
  const today = new Date();
  const nextMonth = new Date(today);
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  
  const upcomingRenewals = renewals.filter((r) => {
    const renewalDate = new Date(r.expectedRenewalDate);
    return renewalDate >= today && renewalDate <= nextMonth && r.status !== "COMPLETED";
  });

  // לידים חדשים (סטטוס NEW)
  const newLeads = leads.filter((l) => l.status === "NEW");

  // משימות פתוחות
  const pendingTasks = tasks.filter((t) => !t.completed);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">דשבורד</h1>
          <p className="text-muted-foreground mt-1">סקירה כללית של הסוכנות</p>
        </div>
      </div>

      {/* סטטיסטיקות ראשיות */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover-scale">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">מספר פוליסות</p>
                <p className="text-3xl font-bold text-foreground mt-1">{policies.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">חידושים קרובים</p>
                <p className="text-3xl font-bold text-foreground mt-1">{upcomingRenewals.length}</p>
                <p className="text-xs text-muted-foreground">ב-30 ימים הקרובים</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <RefreshCw className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">לידים חדשים</p>
                <p className="text-3xl font-bold text-foreground mt-1">{newLeads.length}</p>
                <p className="text-xs text-muted-foreground">ממתינים לטיפול</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">משימות פתוחות</p>
                <p className="text-3xl font-bold text-foreground mt-1">{pendingTasks.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* כרטיסים פיננסיים - למנהלים בלבד */}
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">פרמיה שנתית (סה"כ)</p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {totalPremium.toLocaleString("he-IL")} ₪
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">מכלל הפוליסות הפעילות</p>
                </div>
                <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center">
                  <TrendingUp className="h-7 w-7 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/30 border-green-200 dark:border-green-800">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">עמלות צפויות</p>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">
                    {totalCommission.toLocaleString("he-IL")} ₪
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">עמלה סופית צפויה</p>
                </div>
                <div className="h-14 w-14 rounded-full bg-green-200 dark:bg-green-800 flex items-center justify-center">
                  <TrendingUp className="h-7 w-7 text-green-700 dark:text-green-300" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* התראות ותזכורות */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* חידושים קרובים */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <RefreshCw className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">חידושים קרובים</h2>
            </div>
            {upcomingRenewals.length === 0 ? (
              <p className="text-sm text-muted-foreground">אין חידושים ב-30 ימים הקרובים</p>
            ) : (
              <ul className="space-y-3">
                {upcomingRenewals.slice(0, 5).map((r) => (
                  <li key={r.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-foreground">פוליסה #{r.policyId}</p>
                      <p className="text-xs text-muted-foreground">
                        תאריך חידוש: {new Date(r.expectedRenewalDate).toLocaleDateString("he-IL")}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-secondary/20 text-secondary">
                      {r.status === "NEW" ? "חדש" : r.status === "IN_PROGRESS" ? "בטיפול" : r.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* לידים אחרונים */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">לידים אחרונים</h2>
            </div>
            {leads.length === 0 ? (
              <p className="text-sm text-muted-foreground">אין לידים במערכת</p>
            ) : (
              <ul className="space-y-3">
                {leads.slice(0, 5).map((l) => (
                  <li key={l.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-foreground">{l.name}</p>
                      <p className="text-xs text-muted-foreground">{l.source || "ללא מקור"}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      l.status === "NEW" 
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" 
                        : l.status === "WON" 
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : "bg-muted text-muted-foreground"
                    }`}>
                      {l.status === "NEW" ? "חדש" : 
                       l.status === "CONTACTED" ? "נוצר קשר" :
                       l.status === "QUOTED" ? "נשלחה הצעה" :
                       l.status === "WON" ? "נסגר" : "אבד"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* הודעה כללית */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-foreground">ברוכים הבאים למערכת ברק ביטוחים</h3>
              <p className="text-sm text-muted-foreground mt-1">
                מכאן תוכל/י להגיע לכל המודולים: מחשבונים, מבוטחים, לידים, משימות, חידושים, גבייה,
                אישורי קיום, מסמכים, חוקים ועמלות. המערכת תומכת בעברית ומותאמת לסוכני ביטוח.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
