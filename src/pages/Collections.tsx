import { useData } from "../context/DataContext";

const Collections = () => {
  const { collections, policies, clients } = useData();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">גבייה</h1>
      <p className="text-sm text-slate-600">
        מעקב אחר תשלומים והזכרות גבייה. כאן תוכל/י לנהל לקוחות בחוב,
        להזכיר תשלומים ולעדכן סטטוס.
      </p>
      <div className="bg-white rounded-2xl shadow p-4">
        <table className="w-full text-right text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">מבוטח</th>
              <th className="py-2">פוליסה</th>
              <th className="py-2">סכום לגבייה</th>
              <th className="py-2">תאריך יעד</th>
              <th className="py-2">סטטוס</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((col) => {
              const policy = policies.find((p) => p.id === col.policyId);
              const client = clients.find((c) => c.id === col.clientId);
              return (
                <tr key={col.id} className="border-b last:border-0">
                  <td className="py-2">{client?.businessName || client?.name}</td>
                  <td className="py-2">{policy?.policyNumber}</td>
                  <td className="py-2">
                    {col.amountToCollect.toLocaleString("he-IL")} ₪
                  </td>
                  <td className="py-2">{col.dueDate}</td>
                  <td className="py-2">{col.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Collections;
