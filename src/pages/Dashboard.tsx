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
      <h1 className="text-2xl font-bold text-slate-800">דשבורד</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-xs text-slate-500">מספר פוליסות</div>
          <div className="text-2xl font-bold">{policies.length}</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-xs text-slate-500">חידושים פתוחים</div>
          <div className="text-2xl font-bold">
            {renewals.filter((r) => r.status !== "COMPLETED").length}
          </div>
        </div>
        {isAdmin && (
          <>
            <div className="bg-white rounded-2xl shadow p-4">
              <div className="text-xs text-slate-500">
                פרמיה שנתית (סה"כ)
              </div>
              <div className="text-2xl font-bold">
                {totalPremium.toLocaleString("he-IL")} ₪
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow p-4 md:col-span-1">
              <div className="text-xs text-slate-500">עמלה סופית צפויה</div>
              <div className="text-2xl font-bold text-emerald-700">
                {totalCommission.toLocaleString("he-IL")} ₪
              </div>
            </div>
          </>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow p-4">
        <div className="text-sm text-slate-700 font-semibold mb-2">
          תזכורת
        </div>
        <p className="text-sm text-slate-600">
          מכאן תוכל/י להגיע לכל המודולים: מחשבונים, מבוטחים, חידושים, גבייה,
          אישורי קיום, מסמכים, חוקים ועמלות. זה רק שלד – ב-Lovable אפשר עכשיו
          להרחיב לכל כיוון.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
