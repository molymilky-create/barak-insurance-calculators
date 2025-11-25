import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";

const Commissions = () => {
  const { commissions, policies, clients, commissionAgreements } = useData();
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return (
      <div className="text-center text-muted-foreground mt-10">
        אין לך הרשאה לצפות בעמלות.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-foreground">עמלות ודוחות</h1>
      <p className="text-sm text-muted-foreground">
        מעקב אחר עמלות, הסכמי עמלות עם חברות ביטוח, דוחות תקופתיים.
      </p>

      <section className="bg-card rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold mb-3">עמלות צפויות</h2>
        <table className="w-full text-right text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">מבוטח</th>
              <th className="py-2">פוליסה</th>
              <th className="py-2">חברה</th>
              <th className="py-2">מוצר</th>
              <th className="py-2">פרמיה ברוטו</th>
              <th className="py-2">פרמיה נטו</th>
              <th className="py-2">עמלה סופית</th>
            </tr>
          </thead>
          <tbody>
            {commissions.map((c) => {
              const policy = policies.find((p) => p.id === c.policyId);
              const client = clients.find((cl) => cl.id === c.clientId);
              return (
                <tr key={c.id} className="border-b last:border-0">
                  <td className="py-2">{client?.businessName || client?.name}</td>
                  <td className="py-2">{policy?.policyNumber}</td>
                  <td className="py-2">{c.companyId}</td>
                  <td className="py-2">{c.productType}</td>
                  <td className="py-2">
                    {c.grossPremium.toLocaleString("he-IL")} ₪
                  </td>
                  <td className="py-2">
                    {c.netPremium.toLocaleString("he-IL")} ₪
                  </td>
                  <td className="py-2 font-semibold text-primary">
                    {c.finalCommission.toLocaleString("he-IL")} ₪
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section className="bg-card rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold mb-3">הסכמי עמלות</h2>
        <table className="w-full text-right text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">חברה</th>
              <th className="py-2">מוצר</th>
              <th className="py-2">תיאור</th>
              <th className="py-2">אחוז עמלה</th>
              <th className="py-2">בסיס חישוב</th>
            </tr>
          </thead>
          <tbody>
            {commissionAgreements.map((ca) => (
              <tr key={ca.id} className="border-b last:border-0">
                <td className="py-2">{ca.companyId}</td>
                <td className="py-2">{ca.productType}</td>
                <td className="py-2">{ca.description}</td>
                <td className="py-2">{ca.ratePercent}%</td>
                <td className="py-2">{ca.baseType === "GROSS" ? "ברוטו" : "נטו"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Commissions;
