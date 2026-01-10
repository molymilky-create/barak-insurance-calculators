import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendingUp, DollarSign, Building, FileText } from "lucide-react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import type { CompanyCode } from "../types";

const companyNames: Record<CompanyCode, string> = {
  MENORA: "מנורה",
  HACHSHARA: "הכשרה",
  OTHER: "אחר",
};

const productNames: Record<string, string> = {
  HORSE: "סוס פרטי",
  FARM: "חווה / עסק",
  INSTRUCTOR: "מדריך",
  TRAINER: "מאמן",
  OTHER: "אחר",
};

const Commissions = () => {
  const { commissions, commissionAgreements, policies, clients } = useData();
  const { isAdmin } = useAuth();

  const [filterCompany, setFilterCompany] = useState<CompanyCode | "ALL">("ALL");
  const [filterMonth, setFilterMonth] = useState<string>("ALL");

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">עמלות ודוחות</h1>
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-lg">אין לך הרשאה לצפות בעמודה זו.</p>
            <p className="text-sm mt-2">רק מנהלים יכולים לגשת לדוחות העמלות.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const enrichedCommissions = useMemo(() => {
    return commissions.map((commission) => {
      const policy = policies.find((p) => p.id === commission.policyId);
      const client = clients.find((c) => c.id === commission.clientId);
      return {
        ...commission,
        policyNumber: policy?.policyNumber || "—",
        clientName: client?.businessName || client?.name || "—",
        policyEndDate: policy?.endDate || "",
      };
    });
  }, [commissions, policies, clients]);

  const filteredCommissions = useMemo(() => {
    return enrichedCommissions.filter((c) => {
      const matchesCompany = filterCompany === "ALL" || c.companyId === filterCompany;
      
      let matchesMonth = true;
      if (filterMonth !== "ALL" && c.policyEndDate) {
        const policyMonth = c.policyEndDate.slice(0, 7);
        matchesMonth = policyMonth === filterMonth;
      }
      
      return matchesCompany && matchesMonth;
    });
  }, [enrichedCommissions, filterCompany, filterMonth]);

  const totalCommission = useMemo(() => {
    return filteredCommissions.reduce((sum, c) => sum + (c.finalCommission || 0), 0);
  }, [filteredCommissions]);

  const totalGross = useMemo(() => {
    return filteredCommissions.reduce((sum, c) => sum + (c.grossPremium || 0), 0);
  }, [filteredCommissions]);

  const totalNet = useMemo(() => {
    return filteredCommissions.reduce((sum, c) => sum + (c.netPremium || 0), 0);
  }, [filteredCommissions]);

  const monthOptions = useMemo(() => {
    const options: { value: string; label: string }[] = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const label = date.toLocaleDateString("he-IL", { month: "long", year: "numeric" });
      options.push({ value, label });
    }
    return options;
  }, []);

  const currentMonthValue = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
  
  const currentMonthCommission = useMemo(() => {
    return enrichedCommissions
      .filter((c) => c.policyEndDate && c.policyEndDate.startsWith(currentMonthValue))
      .reduce((sum, c) => sum + (c.finalCommission || 0), 0);
  }, [enrichedCommissions, currentMonthValue]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">עמלות ודוחות</h1>
          <p className="text-muted-foreground mt-1">ניהול ומעקב אחר עמלות הסוכנות</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/30 border-green-200 dark:border-green-800 hover-scale">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">עמלה חודש נוכחי</p>
                <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">
                  {currentMonthCommission.toLocaleString("he-IL")} ₪
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-200 dark:bg-green-800 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-700 dark:text-green-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">סה"כ עמלות (מסונן)</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {totalCommission.toLocaleString("he-IL")} ₪
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">פרמיה ברוטו</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {totalGross.toLocaleString("he-IL")} ₪
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">פרמיה נטו</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {totalNet.toLocaleString("he-IL")} ₪
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <Select value={filterCompany} onValueChange={(v) => setFilterCompany(v as CompanyCode | "ALL")}>
              <SelectTrigger className="w-[180px] text-base">
                <SelectValue placeholder="חברה" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">כל החברות</SelectItem>
                <SelectItem value="MENORA">מנורה</SelectItem>
                <SelectItem value="HACHSHARA">הכשרה</SelectItem>
                <SelectItem value="OTHER">אחר</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterMonth} onValueChange={setFilterMonth}>
              <SelectTrigger className="w-[200px] text-base">
                <SelectValue placeholder="חודש" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">כל החודשים</SelectItem>
                {monthOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Commissions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            עמלות צפויות ({filteredCommissions.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right text-base">חברה</TableHead>
                <TableHead className="text-right text-base">סוג מוצר</TableHead>
                <TableHead className="text-right text-base">מספר פוליסה</TableHead>
                <TableHead className="text-right text-base">לקוח</TableHead>
                <TableHead className="text-right text-base">פרמיה ברוטו</TableHead>
                <TableHead className="text-right text-base">פרמיה נטו</TableHead>
                <TableHead className="text-right text-base">עמלה סופית</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCommissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-base">
                    {commissions.length === 0 ? "אין עמלות במערכת" : "לא נמצאו עמלות התואמות לסינון"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredCommissions.map((commission) => (
                  <TableRow key={commission.id}>
                    <TableCell>
                      <Badge variant="outline" className="text-sm">
                        {companyNames[commission.companyId] || commission.companyId}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-muted text-muted-foreground text-sm">
                        {productNames[commission.productType] || commission.productType}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-base">{commission.policyNumber}</TableCell>
                    <TableCell className="text-base">{commission.clientName}</TableCell>
                    <TableCell className="text-base">
                      {commission.grossPremium.toLocaleString("he-IL")} ₪
                    </TableCell>
                    <TableCell className="text-base">
                      {commission.netPremium.toLocaleString("he-IL")} ₪
                    </TableCell>
                    <TableCell className="text-base font-bold text-green-700 dark:text-green-400">
                      {commission.finalCommission.toLocaleString("he-IL")} ₪
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Commission Agreements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Building className="h-5 w-5" />
            הסכמי עמלות
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right text-base">חברה</TableHead>
                <TableHead className="text-right text-base">סוג מוצר</TableHead>
                <TableHead className="text-right text-base">תיאור</TableHead>
                <TableHead className="text-right text-base">אחוז עמלה</TableHead>
                <TableHead className="text-right text-base">בסיס חישוב</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commissionAgreements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-base">
                    אין הסכמי עמלות במערכת
                  </TableCell>
                </TableRow>
              ) : (
                commissionAgreements.map((agreement) => (
                  <TableRow key={agreement.id}>
                    <TableCell>
                      <Badge variant="outline" className="text-sm">
                        {companyNames[agreement.companyId] || agreement.companyId}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-muted text-muted-foreground text-sm">
                        {productNames[agreement.productType] || agreement.productType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-base">{agreement.description}</TableCell>
                    <TableCell className="text-base font-bold">{agreement.ratePercent}%</TableCell>
                    <TableCell className="text-base">
                      {agreement.baseType === "GROSS" ? "ברוטו" : "נטו"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Commissions;
