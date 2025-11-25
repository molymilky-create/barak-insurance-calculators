import { useParams } from "react-router-dom";
import { useData } from "../context/DataContext";
import { useState } from "react";
import Certificates from "./Certificates";

const ClientDetails = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const { clients, policies } = useData();
  const [selectedPolicyForCertificate, setSelectedPolicyForCertificate] =
    useState<string | null>(null);

  const client = clients.find((c) => c.id === clientId);
  const clientPolicies = policies.filter((p) => p.clientId === clientId);

  if (!client) {
    return <div>לא נמצא מבוטח.</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">
        {client.businessName || client.name}
      </h1>

      <section className="bg-white rounded-2xl shadow p-4 text-sm space-y-1">
        <div>ת"ז / ח"פ: {client.idNumber}</div>
        {client.businessAddress && <div>כתובת עסק: {client.businessAddress}</div>}
        {client.homeAddress && <div>כתובת מגורים: {client.homeAddress}</div>}
        {client.phone && <div>טלפון: {client.phone}</div>}
        {client.email && <div>מייל: {client.email}</div>}
      </section>

      <section className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold mb-3">פוליסות</h2>
        <table className="w-full text-right text-xs">
          <thead>
            <tr className="border-b">
              <th className="py-2">מס' פוליסה</th>
              <th className="py-2">חברה</th>
              <th className="py-2">מוצר</th>
              <th className="py-2">תוקף</th>
              <th className="py-2">פרמיה</th>
              <th className="py-2">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {clientPolicies.map((p) => (
              <tr key={p.id} className="border-b last:border-0">
                <td className="py-2">{p.policyNumber}</td>
                <td className="py-2">{p.companyId}</td>
                <td className="py-2">{p.productType}</td>
                <td className="py-2">
                  {p.startDate} – {p.endDate}
                </td>
                <td className="py-2">
                  {p.annualPremium.toLocaleString("he-IL")} ₪
                </td>
                <td className="py-2">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => setSelectedPolicyForCertificate(p.id)}
                  >
                    הפק אישור קיום →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {selectedPolicyForCertificate && (
        <section className="bg-white rounded-2xl shadow p-4">
          <h2 className="text-lg font-semibold mb-3">
            יצירת אישור קיום מהפוליסה
          </h2>
          <Certificates
            presetClient={client.id}
            presetPolicy={selectedPolicyForCertificate}
          />
        </section>
      )}
    </div>
  );
};

export default ClientDetails;
