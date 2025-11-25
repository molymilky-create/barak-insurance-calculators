import { useState } from "react";
import { useData } from "../context/DataContext";

const Regulations = () => {
  const { regulations } = useData();
  const [filter, setFilter] = useState<string>("");

  const filtered = regulations.filter((r) =>
    r.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">חוקים וחוזרים</h1>
      <p className="text-sm text-slate-600">
        הנחיות רגולטוריות, חוקים, חוזרי המפקח על הביטוח ודירקטיבות נוספות.
      </p>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="חפש חוק / הנחיה..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-3 py-1 text-sm flex-1"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((reg) => (
          <div
            key={reg.id}
            className="bg-white rounded-2xl shadow p-4 hover:shadow-lg transition"
          >
            <div className="font-semibold text-slate-800">{reg.title}</div>
            {reg.description && (
              <p className="text-xs text-slate-600 mt-1">{reg.description}</p>
            )}
            <div className="text-xs text-slate-500 mt-2">
              תגיות: {reg.domainTags.join(", ")}
            </div>
            <a
              href={reg.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline mt-2 inline-block"
            >
              פתח מסמך רשמי →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Regulations;
