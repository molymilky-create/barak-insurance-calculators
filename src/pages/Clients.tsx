import { Link } from "react-router-dom";
import { useData } from "../context/DataContext";

const Clients = () => {
  const { clients } = useData();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-foreground">מבוטחים</h1>
      <div className="bg-card rounded-2xl shadow p-4">
        <table className="w-full text-right text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">שם</th>
              <th className="py-2">ת"ז / ח"פ</th>
              <th className="py-2">טלפון</th>
              <th className="py-2">מייל</th>
              <th className="py-2">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id} className="border-b last:border-0">
                <td className="py-2">{c.businessName || c.name}</td>
                <td className="py-2">{c.idNumber}</td>
                <td className="py-2">{c.phone || "-"}</td>
                <td className="py-2">{c.email || "-"}</td>
                <td className="py-2">
                  <Link
                    to={`/clients/${c.id}`}
                    className="text-primary hover:underline text-xs"
                  >
                    פרטים / פוליסות / אישור קיום →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Clients;
