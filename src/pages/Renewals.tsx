import { useData } from "../context/DataContext";

const Renewals = () => {
  const { renewals, policies, clients } = useData();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-foreground">חידושים</h1>
      <p className="text-sm text-muted-foreground">
        כאן תוכל/י לנהל חידושים של פוליסות קיימות – תזכורות, הצעות מחיר,
        טיפול בסטטוס ושיוך לעובדים.
      </p>
      <div className="bg-card rounded-2xl shadow p-4">
        <table className="w-full text-right text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">מבוטח</th>
              <th className="py-2">פוליסה</th>
              <th className="py-2">תאריך חידוש צפוי</th>
              <th className="py-2">פרמיה קודמת</th>
              <th className="py-2">פרמיה צפויה</th>
              <th className="py-2">סטטוס</th>
            </tr>
          </thead>
          <tbody>
            {renewals.map((r) => {
              const policy = policies.find((p) => p.id === r.policyId);
              const client = clients.find((c) => c.id === r.clientId);
              return (
                <tr key={r.id} className="border-b last:border-0">
                  <td className="py-2">{client?.businessName || client?.name}</td>
                  <td className="py-2">{policy?.policyNumber}</td>
                  <td className="py-2">{r.expectedRenewalDate}</td>
                  <td className="py-2">
                    {r.previousPremium
                      ? `${r.previousPremium.toLocaleString("he-IL")} ₪`
                      : "-"}
                  </td>
                  <td className="py-2">
                    {r.expectedPremium
                      ? `${r.expectedPremium.toLocaleString("he-IL")} ₪`
                      : "-"}
                  </td>
                  <td className="py-2">{r.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Renewals;
