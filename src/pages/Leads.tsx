import { useState } from "react";
import { useData } from "../context/DataContext";

const Leads = () => {
  const { leads, addLead, updateLeadStatus } = useData();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [source, setSource] = useState("");
  const [notes, setNotes] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("חובה שם ליד.");
      return;
    }
    addLead({
      name: name.trim(),
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      source: source.trim() || undefined,
      notes: notes.trim() || undefined,
      estimatedAnnualPremium: undefined,
      nextActionDate: undefined,
      nextActionNotes: undefined,
      lastChannel: undefined,
    });
    setName("");
    setPhone("");
    setEmail("");
    setSource("");
    setNotes("");
  };

  const shortStatus = (status: string) => {
    switch (status) {
      case "NEW":
        return "חדש";
      case "CONTACTED":
        return "נוצר קשר";
      case "QUOTED":
        return "נשלחה הצעה";
      case "WON":
        return "נסגר";
      case "LOST":
        return "אבד";
      default:
        return status;
    }
  };

  const statusOptions: { value: any; label: string }[] = [
    { value: "NEW", label: "חדש" },
    { value: "CONTACTED", label: "נוצר קשר" },
    { value: "QUOTED", label: "נשלחה הצעה" },
    { value: "WON", label: "נסגר" },
    { value: "LOST", label: "אבד" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">לידים</h1>

      <section className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-sm font-semibold mb-3">הוספת ליד חדש</h2>
        <form onSubmit={handleAdd} className="flex flex-wrap gap-3 text-xs items-end">
          <div className="flex flex-col">
            <label>שם</label>
            <input className="border rounded-lg px-2 py-1" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex flex-col">
            <label>טלפון</label>
            <input className="border rounded-lg px-2 py-1" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="flex flex-col">
            <label>מייל</label>
            <input className="border rounded-lg px-2 py-1" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="flex flex-col">
            <label>מקור</label>
            <input
              className="border rounded-lg px-2 py-1"
              placeholder="פייסבוק, הפניה, אתר..."
              value={source}
              onChange={(e) => setSource(e.target.value)}
            />
          </div>
          <div className="flex-1 flex flex-col">
            <label>הערות</label>
            <input className="border rounded-lg px-2 py-1" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <div>
            <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 text-white">
              שמור ליד
            </button>
          </div>
        </form>
      </section>

      <section className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-sm font-semibold mb-3">רשימת לידים</h2>
        <table className="w-full text-right text-xs">
          <thead>
            <tr className="border-b">
              <th className="py-2">שם</th>
              <th className="py-2">טלפון</th>
              <th className="py-2">מייל</th>
              <th className="py-2">מקור</th>
              <th className="py-2">סטטוס</th>
              <th className="py-2">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l.id} className="border-b last:border-0">
                <td className="py-2">{l.name}</td>
                <td className="py-2">{l.phone || "-"}</td>
                <td className="py-2">{l.email || "-"}</td>
                <td className="py-2">{l.source || "-"}</td>
                <td className="py-2">{shortStatus(l.status)}</td>
                <td className="py-2">
                  <select
                    className="border rounded-lg px-2 py-1"
                    value={l.status}
                    onChange={(e) => updateLeadStatus(l.id, e.target.value as any)}
                  >
                    {statusOptions.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {leads.length === 0 && (
          <p className="text-xs text-slate-500 mt-2">
            עדיין אין לידים. אפשר להכניס ידנית או לחבר בהמשך לטפסים/באפי/מערכת SMS.
          </p>
        )}
      </section>
    </div>
  );
};

export default Leads;
