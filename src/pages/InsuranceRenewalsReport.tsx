import { useState, useMemo, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload, FileSpreadsheet, Printer, Download } from "lucide-react";
import * as XLSX from "xlsx";

// Types
interface PolicyRecord {
  id: string;
  policyNumber: string;
  insuredName: string;
  insuranceType: string;
  insuranceCompany: InsuranceCompany;
  status: PolicyStatus;
  startDate: string;
  monthlyPremium: number;
  paymentMethod: string;
  notes: string;
  assignedEmployee: string;
}

type InsuranceCompany = "מנורה" | "הכשרה" | "איילון" | "חקלאי" | "שלמה";
type PolicyStatus = "חדש" | "חידוש" | "בתהליך" | "בוטל";

// Company order and colors
const COMPANY_ORDER: InsuranceCompany[] = ["מנורה", "הכשרה", "איילון", "חקלאי", "שלמה"];

const COMPANY_COLORS: Record<InsuranceCompany, { primary: string; secondary: string; gradient: string }> = {
  "מנורה": { primary: "#FFD700", secondary: "#6B21A8", gradient: "linear-gradient(90deg, #FFD700 0%, #6B21A8 100%)" },
  "הכשרה": { primary: "#DC2626", secondary: "#FFFFFF", gradient: "linear-gradient(90deg, #DC2626 0%, #FECACA 100%)" },
  "איילון": { primary: "#2563EB", secondary: "#93C5FD", gradient: "linear-gradient(90deg, #2563EB 0%, #93C5FD 100%)" },
  "חקלאי": { primary: "#16A34A", secondary: "#FFFFFF", gradient: "linear-gradient(90deg, #16A34A 0%, #BBF7D0 100%)" },
  "שלמה": { primary: "#16A34A", secondary: "#F97316", gradient: "linear-gradient(90deg, #16A34A 0%, #F97316 100%)" },
};

const STATUS_LABELS: Record<string, PolicyStatus[]> = {
  "חידושים": ["חידוש"],
  "חדשים": ["חדש"],
  "תוספות/בתהליך": ["בתהליך"],
};

// Employee assignment logic
function calculateAssignedEmployee(record: {
  insuranceType: string;
  insuranceCompany: string;
  monthlyPremium: number;
}): string {
  const type = record.insuranceType.toLowerCase();
  const company = record.insuranceCompany;
  const premium = record.monthlyPremium;

  // Rule 1: רכב/דירה/נגררים/משאיות → מעוז
  if (
    type.includes("רכב") ||
    type.includes("דירה") ||
    type.includes("נגררים") ||
    type.includes("משאיות")
  ) {
    return "מעוז";
  }

  // Rule 2: סוסים באיילון / סוסים חבר מושב / צד ג במנורה או חקלאי עד 800 → אליזבט
  const isHorsesAyalon = type.includes("סוסים") && company === "איילון";
  const isHorsesMoshav = type.includes("סוסים") && type.includes("חבר מושב");
  const isThirdPartyMenoraHaklai =
    type.includes("צד ג") &&
    (company === "מנורה" || company === "חקלאי") &&
    premium <= 800;

  if (isHorsesAyalon || isHorsesMoshav || isThirdPartyMenoraHaklai) {
    return "אליזבט";
  }

  // Rule 3: עסקים/אחריות מקצועית/אחריות מעבידים/פוליסות אחריות/צד ג אחר → יוסי / שגיב / אור
  if (
    type.includes("עסקים") ||
    type.includes("אחריות מקצועית") ||
    type.includes("אחריות מעבידים") ||
    type.includes("פוליסות אחריות") ||
    type.includes("צד ג")
  ) {
    return "יוסי / שגיב / אור";
  }

  return "לא משויך";
}

// Parse Excel file
function parseExcelFile(file: File): Promise<PolicyRecord[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as unknown[][];

        // Skip header row
        const records: PolicyRecord[] = [];
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i] as (string | number | undefined)[];
          if (!row || row.length < 2) continue;

          const policyNumber = String(row[0] || "");
          const insuredName = String(row[1] || "");
          const insuranceType = String(row[2] || "");
          const insuranceCompany = String(row[3] || "") as InsuranceCompany;
          const status = String(row[4] || "חדש") as PolicyStatus;
          const startDate = String(row[5] || "");
          const monthlyPremium = Number(row[6]) || 0;
          const paymentMethod = String(row[7] || "");
          const notes = String(row[8] || "");

          if (!policyNumber && !insuredName) continue;

          const assignedEmployee = calculateAssignedEmployee({
            insuranceType,
            insuranceCompany,
            monthlyPremium,
          });

          records.push({
            id: `record_${i}`,
            policyNumber,
            insuredName,
            insuranceType,
            insuranceCompany,
            status,
            startDate,
            monthlyPremium,
            paymentMethod,
            notes,
            assignedEmployee,
          });
        }

        resolve(records);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

const InsuranceRenewalsReport = () => {
  const [records, setRecords] = useState<PolicyRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const parsed = await parseExcelFile(file);
      setRecords(parsed);
    } catch (error) {
      console.error("Error parsing Excel:", error);
      alert("שגיאה בקריאת קובץ האקסל");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Group records by company and status
  const groupedData = useMemo(() => {
    const result: Record<InsuranceCompany, Record<string, PolicyRecord[]>> = {
      "מנורה": { "חידושים": [], "חדשים": [], "תוספות/בתהליך": [] },
      "הכשרה": { "חידושים": [], "חדשים": [], "תוספות/בתהליך": [] },
      "איילון": { "חידושים": [], "חדשים": [], "תוספות/בתהליך": [] },
      "חקלאי": { "חידושים": [], "חדשים": [], "תוספות/בתהליך": [] },
      "שלמה": { "חידושים": [], "חדשים": [], "תוספות/בתהליך": [] },
    };

    records.forEach((record) => {
      const company = record.insuranceCompany;
      if (!result[company]) return;

      if (record.status === "חידוש") {
        result[company]["חידושים"].push(record);
      } else if (record.status === "חדש") {
        result[company]["חדשים"].push(record);
      } else if (record.status === "בתהליך") {
        result[company]["תוספות/בתהליך"].push(record);
      }
    });

    return result;
  }, [records]);

  // Calculate totals
  const totalSummary = useMemo(() => {
    let renewals = 0, renewalsPremium = 0;
    let newPolicies = 0, newPremium = 0;
    let inProcess = 0, inProcessPremium = 0;

    records.forEach((r) => {
      if (r.status === "חידוש") {
        renewals++;
        renewalsPremium += r.monthlyPremium;
      } else if (r.status === "חדש") {
        newPolicies++;
        newPremium += r.monthlyPremium;
      } else if (r.status === "בתהליך") {
        inProcess++;
        inProcessPremium += r.monthlyPremium;
      }
    });

    return {
      renewals,
      renewalsPremium,
      newPolicies,
      newPremium,
      inProcess,
      inProcessPremium,
      total: renewals + newPolicies + inProcess,
      totalPremium: renewalsPremium + newPremium + inProcessPremium,
    };
  }, [records]);

  return (
    <div className="space-y-6">
      {/* Header - Not printed */}
      <div className="print:hidden">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">דוח חידושי ביטוח</h1>
            <p className="text-muted-foreground mt-1">לפי חברות ביטוח וענפים</p>
          </div>
          <div className="flex gap-3">
            <Label
              htmlFor="excel-upload"
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <Upload className="h-5 w-5" />
              ייבוא אקסל
            </Label>
            <Input
              id="excel-upload"
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={handleFileUpload}
            />
            {records.length > 0 && (
              <Button onClick={handlePrint} variant="outline" className="gap-2">
                <Printer className="h-5 w-5" />
                הדפסה
              </Button>
            )}
          </div>
        </div>

        {/* Upload instructions */}
        {records.length === 0 && (
          <Card className="mt-6">
            <CardContent className="p-8 text-center">
              <FileSpreadsheet className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">העלה קובץ אקסל</h3>
              <p className="text-muted-foreground mb-4">
                הקובץ צריך לכלול את העמודות הבאות בסדר:
              </p>
              <div className="inline-block text-right bg-muted/50 rounded-lg p-4">
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>מספר פוליסה</li>
                  <li>שם מבוטח</li>
                  <li>סוג ביטוח</li>
                  <li>חברת ביטוח (מנורה/הכשרה/איילון/חקלאי/שלמה)</li>
                  <li>סטטוס (חדש/חידוש/בתהליך/בוטל)</li>
                  <li>תאריך תחילה ראשוני</li>
                  <li>פרמיה חודשית (מספר)</li>
                  <li>אמצעי תשלום</li>
                  <li>הערות</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        )}

        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-muted-foreground">טוען נתונים...</p>
          </div>
        )}
      </div>

      {/* Printable Report */}
      {records.length > 0 && (
        <div
          ref={printRef}
          className="bg-[#F7F9FB] print:bg-white"
          style={{ fontFamily: "Assistant, sans-serif" }}
        >
          {/* Report Header */}
          <div
            className="text-center py-6 mb-6 print:py-4 print:mb-4"
            style={{ backgroundColor: "#0077A3" }}
          >
            <h1 className="text-2xl font-bold text-white print:text-xl">
              סוכנות ברק ביטוחים
            </h1>
            <h2 className="text-xl font-semibold text-white mt-2 print:text-lg">
              חידושי ביטוח לפי חברות ביטוח וענפים
            </h2>
            <p className="text-white/80 text-sm mt-1">
              תאריך הפקה: {new Date().toLocaleDateString("he-IL")}
            </p>
          </div>

          {/* Company Blocks */}
          {COMPANY_ORDER.map((company) => {
            const companyData = groupedData[company];
            const hasData = Object.values(companyData).some((arr) => arr.length > 0);
            if (!hasData) return null;

            const colors = COMPANY_COLORS[company];
            const companyRenewals = companyData["חידושים"].length;
            const companyNew = companyData["חדשים"].length;
            const companyProcess = companyData["תוספות/בתהליך"].length;
            const companyTotal = companyRenewals + companyNew + companyProcess;
            const companyPremium =
              companyData["חידושים"].reduce((s, r) => s + r.monthlyPremium, 0) +
              companyData["חדשים"].reduce((s, r) => s + r.monthlyPremium, 0) +
              companyData["תוספות/בתהליך"].reduce((s, r) => s + r.monthlyPremium, 0);

            return (
              <div key={company} className="mb-8 print:mb-6 print:break-inside-avoid">
                {/* Company Header */}
                <div
                  className="h-2 rounded-t-lg"
                  style={{ background: colors.gradient }}
                />
                <div
                  className="px-4 py-3 flex items-center justify-between"
                  style={{ backgroundColor: "#E6F1F6" }}
                >
                  <h3 className="text-lg font-bold" style={{ color: "#0077A3" }}>
                    {company}
                  </h3>
                  <Badge
                    style={{ backgroundColor: colors.primary, color: "#fff" }}
                    className="text-sm"
                  >
                    {companyTotal} פוליסות
                  </Badge>
                </div>

                {/* Status Tables */}
                {(["חידושים", "חדשים", "תוספות/בתהליך"] as const).map((statusGroup) => {
                  const statusRecords = companyData[statusGroup];
                  if (statusRecords.length === 0) return null;

                  const statusPremium = statusRecords.reduce(
                    (s, r) => s + r.monthlyPremium,
                    0
                  );

                  return (
                    <div key={statusGroup} className="mt-4 print:mt-2">
                      <h4
                        className="text-base font-semibold px-4 py-2"
                        style={{ color: "#F7931E" }}
                      >
                        {statusGroup}
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr style={{ backgroundColor: "#E6F1F6" }}>
                              <th className="border border-[#D6DADF] px-2 py-2 text-right font-semibold">
                                #
                              </th>
                              <th className="border border-[#D6DADF] px-2 py-2 text-right font-semibold">
                                מספר פוליסה
                              </th>
                              <th className="border border-[#D6DADF] px-2 py-2 text-right font-semibold">
                                שם מבוטח
                              </th>
                              <th className="border border-[#D6DADF] px-2 py-2 text-right font-semibold">
                                סוג ביטוח
                              </th>
                              <th className="border border-[#D6DADF] px-2 py-2 text-right font-semibold">
                                חברה
                              </th>
                              <th className="border border-[#D6DADF] px-2 py-2 text-right font-semibold">
                                עובד מטפל
                              </th>
                              <th className="border border-[#D6DADF] px-2 py-2 text-right font-semibold">
                                סטטוס
                              </th>
                              <th className="border border-[#D6DADF] px-2 py-2 text-right font-semibold">
                                תאריך תחילה
                              </th>
                              <th className="border border-[#D6DADF] px-2 py-2 text-right font-semibold">
                                פרמיה חודשית
                              </th>
                              <th className="border border-[#D6DADF] px-2 py-2 text-right font-semibold">
                                אמצעי תשלום
                              </th>
                              <th className="border border-[#D6DADF] px-2 py-2 text-right font-semibold">
                                הערות
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {statusRecords.map((record, idx) => (
                              <tr
                                key={record.id}
                                style={{
                                  backgroundColor:
                                    idx % 2 === 0 ? "#FFFFFF" : "#F1F4F6",
                                }}
                              >
                                <td className="border border-[#D6DADF] px-2 py-1.5 text-center">
                                  {idx + 1}
                                </td>
                                <td className="border border-[#D6DADF] px-2 py-1.5">
                                  {record.policyNumber}
                                </td>
                                <td className="border border-[#D6DADF] px-2 py-1.5 font-medium">
                                  {record.insuredName}
                                </td>
                                <td className="border border-[#D6DADF] px-2 py-1.5">
                                  {record.insuranceType}
                                </td>
                                <td className="border border-[#D6DADF] px-2 py-1.5">
                                  {record.insuranceCompany}
                                </td>
                                <td className="border border-[#D6DADF] px-2 py-1.5 font-medium">
                                  {record.assignedEmployee}
                                </td>
                                <td className="border border-[#D6DADF] px-2 py-1.5">
                                  {record.status}
                                </td>
                                <td className="border border-[#D6DADF] px-2 py-1.5">
                                  {record.startDate}
                                </td>
                                <td className="border border-[#D6DADF] px-2 py-1.5 text-center">
                                  {record.monthlyPremium.toLocaleString("he-IL")} ₪
                                </td>
                                <td className="border border-[#D6DADF] px-2 py-1.5">
                                  {record.paymentMethod}
                                </td>
                                <td className="border border-[#D6DADF] px-2 py-1.5 text-xs">
                                  {record.notes}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {/* Status Summary */}
                      <div
                        className="flex justify-between items-center px-4 py-2 text-sm"
                        style={{ backgroundColor: "#F1F4F6" }}
                      >
                        <span>
                          כמות: <strong>{statusRecords.length}</strong>
                        </span>
                        <span>
                          סה"כ פרמיה חודשית:{" "}
                          <strong>{statusPremium.toLocaleString("he-IL")} ₪</strong>
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Company Summary */}
                <div
                  className="mt-4 px-4 py-3 rounded-b-lg"
                  style={{ backgroundColor: "#E6F1F6" }}
                >
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-lg" style={{ color: "#0077A3" }}>
                        {companyRenewals}
                      </div>
                      <div className="text-muted-foreground">חידושים</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg" style={{ color: "#0077A3" }}>
                        {companyNew}
                      </div>
                      <div className="text-muted-foreground">חדשים</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg" style={{ color: "#0077A3" }}>
                        {companyProcess}
                      </div>
                      <div className="text-muted-foreground">תוספות/בתהליך</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg" style={{ color: "#F7931E" }}>
                        {companyPremium.toLocaleString("he-IL")} ₪
                      </div>
                      <div className="text-muted-foreground">סה"כ פרמיה</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Total Summary */}
          <div
            className="mt-8 p-6 rounded-lg print:mt-4 print:p-4"
            style={{ backgroundColor: "#0077A3" }}
          >
            <h3 className="text-xl font-bold text-white text-center mb-4">
              סיכום כללי לסוכנות
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold text-white">
                  {totalSummary.renewals}
                </div>
                <div className="text-white/80 text-sm">חידושים</div>
                <div className="text-[#F7931E] font-semibold mt-1">
                  {totalSummary.renewalsPremium.toLocaleString("he-IL")} ₪
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold text-white">
                  {totalSummary.newPolicies}
                </div>
                <div className="text-white/80 text-sm">חדשים</div>
                <div className="text-[#F7931E] font-semibold mt-1">
                  {totalSummary.newPremium.toLocaleString("he-IL")} ₪
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold text-white">
                  {totalSummary.inProcess}
                </div>
                <div className="text-white/80 text-sm">תוספות/בתהליך</div>
                <div className="text-[#F7931E] font-semibold mt-1">
                  {totalSummary.inProcessPremium.toLocaleString("he-IL")} ₪
                </div>
              </div>
              <div className="bg-white/20 rounded-lg p-4">
                <div className="text-3xl font-bold text-[#F7931E]">
                  {totalSummary.total}
                </div>
                <div className="text-white/80 text-sm">סה"כ פוליסות</div>
                <div className="text-white font-bold mt-1">
                  {totalSummary.totalPremium.toLocaleString("he-IL")} ₪
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center py-4 text-sm text-muted-foreground print:py-2">
            <p>© סוכנות ברק ביטוחים | דוח זה הופק אוטומטית</p>
          </div>
        </div>
      )}

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default InsuranceRenewalsReport;
