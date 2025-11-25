import { useState } from "react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { CertificateMode, ProductType } from "../types";

interface Props {
  presetClient?: string;
  presetPolicy?: string;
}

const Certificates: React.FC<Props> = ({ presetClient, presetPolicy }) => {
  const { clients, policies, addCertificate } = useData();
  const { user } = useAuth();

  const [mode, setMode] = useState<CertificateMode>("NORMAL");
  const [clientId, setClientId] = useState<string>(presetClient || "");
  const [policyId, setPolicyId] = useState<string>(presetPolicy || "");
  const [requestorName, setRequestorName] = useState<string>("");
  const [productType, setProductType] = useState<ProductType | "">("");
  const [codes, setCodes] = useState<string>("");
  const [freeText, setFreeText] = useState<string>("");

  const clientPolicies = policies.filter((p) => p.clientId === clientId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!clientId || !requestorName) {
      alert("חייבים לבחור מבוטח ולהגדיר מבקש אישור.");
      return;
    }

    const codesArray = codes
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    addCertificate({
      clientId,
      policyId: policyId || undefined,
      mode,
      requestorId: undefined,
      requestorName,
      productType: productType || undefined,
      codes: codesArray,
      freeText,
      createdByUserId: user.id,
    });

    alert("אישור קיום נוצר (בדפוס אמיתי יופק PDF).");
  };

  return (
    <div className="space-y-4">
      {!presetClient && (
        <h1 className="text-2xl font-bold text-slate-800">
          יצירת אישור קיום ביטוח
        </h1>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow p-4 space-y-4 text-sm"
      >
        <div className="flex gap-2 text-xs">
          <button
            type="button"
            className={`px-3 py-1 rounded-full border ${
              mode === "NORMAL"
                ? "bg-blue-600 text-white border-blue-600"
                : "border-slate-300"
            }`}
            onClick={() => setMode("NORMAL")}
          >
            מצב רגיל (מבוטח → מבקש אישור)
          </button>
          <button
            type="button"
            className={`px-3 py-1 rounded-full border ${
              mode === "REQUESTOR"
                ? "bg-blue-600 text-white border-blue-600"
                : "border-slate-300"
            }`}
            onClick={() => setMode("REQUESTOR")}
          >
            מצב מבקש (הלקוח הוא מבקש האישור)
          </button>
        </div>

        {!presetClient && (
          <div className="flex flex-col gap-1">
            <label>מבוטח</label>
            <select
              value={clientId}
              onChange={(e) => {
                setClientId(e.target.value);
                setPolicyId("");
              }}
              className="border rounded-lg px-3 py-1"
            >
              <option value="">בחר מבוטח...</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.businessName || c.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label>פוליסה (לא חובה)</label>
          <select
            value={policyId}
            onChange={(e) => setPolicyId(e.target.value)}
            className="border rounded-lg px-3 py-1"
          >
            <option value="">ללא / לבחור...</option>
            {clientPolicies.map((p) => (
              <option key={p.id} value={p.id}>
                {p.policyNumber} – {p.productType} – {p.companyId}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label>מבקש האישור</label>
          <input
            type="text"
            value={requestorName}
            onChange={(e) => setRequestorName(e.target.value)}
            className="border rounded-lg px-3 py-1"
            placeholder='לדוגמה: קופ"ח כללית / עיריית X / קניון Y...'
          />
        </div>

        <div className="flex flex-col gap-1">
          <label>ענף / מוצר (אופציונלי)</label>
          <select
            value={productType}
            onChange={(e) => setProductType(e.target.value as ProductType | "")}
            className="border rounded-lg px-3 py-1"
          >
            <option value="">בחר...</option>
            <option value="HORSE">ביטוח סוסים</option>
            <option value="FARM">חוות סוסים</option>
            <option value="INSTRUCTOR">מדריכי רכיבה</option>
            <option value="TRAINER">מאמני כושר / אומנויות לחימה</option>
            <option value="OTHER">אחר</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label>קודים (מופרדים בפסיקים)</label>
          <input
            type="text"
            value={codes}
            onChange={(e) => setCodes(e.target.value)}
            className="border rounded-lg px-3 py-1"
            placeholder="לדוגמה: C01, C14, C22..."
          />
        </div>

        <div className="flex flex-col gap-1">
          <label>הערות / טקסט חופשי</label>
          <textarea
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            className="border rounded-lg px-3 py-2 min-h-[80px]"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
        >
          הפק אישור קיום (טיוטה)
        </button>
      </form>
    </div>
  );
};

export default Certificates;
