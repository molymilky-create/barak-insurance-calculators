import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { policies, renewals, collections, commissions } = useData();
  const { isAdmin } = useAuth();

  const totalPremium = policies.reduce(
    (sum, p) => sum + (p.annualPremium || 0),
    0
  );
  const totalCommission = commissions.reduce(
    (sum, c) => sum + (c.finalCommission || 0),
    0
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">דשבורד</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-2xl shadow p-4">
          <div className="text-xs text-muted-foreground">מספר פוליסות</div>
          <div className="text-2xl font-bold">{policies.length}</div>
        </div>
        <div className="bg-card rounded-2xl shadow p-4">
          <div className="text-xs text-muted-foreground">חידושים פתוחים</div>
          <div className="text-2xl font-bold">
            {renewals.filter((r) => r.status !== "COMPLETED").length}
          </div>
        </div>
        {isAdmin && (
          <>
            <div className="bg-card rounded-2xl shadow p-4">
              <div className="text-xs text-muted-foreground">
                פרמיה שנתית (סה"כ)
              </div>
              <div className="text-2xl font-bold">
                {totalPremium.toLocaleString("he-IL")} ₪
              </div>
            </div>
            <div className="bg-card rounded-2xl shadow p-4 md:col-span-1">
              <div className="text-xs text-muted-foreground">עמלה סופית צפויה</div>
              <div className="text-2xl font-bold text-primary">
                {totalCommission.toLocaleString("he-IL")} ₪
              </div>
            </div>
          </>
        )}
      </div>

      <div className="bg-card rounded-2xl shadow p-4">
        <div className="text-sm text-foreground font-semibold mb-2">
          תזכורת
        </div>
        <p className="text-sm text-muted-foreground">
          מכאן תוכל/י להגיע לכל המודולים: מחשבונים, מבוטחים, חידושים, גבייה,
          אישורי קיום, מסמכים, חוקים ועמלות. זה רק שלד – ב-Lovable אפשר עכשיו
          להרחיב לכל כיוון.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
