import { useState } from "react";
import { useData } from "../context/DataContext";

const Documents = () => {
  const { documents } = useData();
  const [filter, setFilter] = useState<string>("");

  const filtered = documents.filter((d) =>
    d.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-foreground">מסמכים</h1>
      <p className="text-sm text-muted-foreground">
        ג'קטים, תנאי פוליסה, טפסי הצעה, טפסי תביעה, הנחיות בטיחות, טפסי
        אישור קיום ועוד.
      </p>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="חפש מסמך..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-3 py-1 text-sm flex-1"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            className="bg-card rounded-2xl shadow p-4 hover:shadow-lg transition"
          >
            <div className="text-xs text-muted-foreground mb-1">
              {doc.kind} • {doc.source === "COMPANY" ? "חברת ביטוח" : "סוכנות"}
            </div>
            <div className="font-semibold text-foreground">{doc.title}</div>
            {doc.description && (
              <p className="text-xs text-muted-foreground mt-1">{doc.description}</p>
            )}
            <a
              href={doc.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline mt-2 inline-block"
            >
              פתח מסמך →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Documents;
