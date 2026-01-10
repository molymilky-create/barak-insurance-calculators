import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Search, Users, Building, ChevronLeft } from "lucide-react";
import { useData } from "../context/DataContext";

type ClientTypeFilter = "ALL" | "BUSINESS" | "PRIVATE";

const Clients = () => {
  const { clients, policies } = useData();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<ClientTypeFilter>("ALL");

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch =
        client.name.includes(search) ||
        client.idNumber.includes(search) ||
        client.businessName?.includes(search) ||
        client.companyNumber?.includes(search) ||
        client.phone?.includes(search) ||
        client.email?.includes(search);

      const isBusiness = !!client.businessName || !!client.companyNumber;
      const matchesType =
        filterType === "ALL" ||
        (filterType === "BUSINESS" && isBusiness) ||
        (filterType === "PRIVATE" && !isBusiness);

      return matchesSearch && matchesType;
    });
  }, [clients, search, filterType]);

  const getPoliciesCount = (clientId: string) => {
    return policies.filter((p) => p.clientId === clientId).length;
  };

  const stats = useMemo(() => {
    const total = clients.length;
    const business = clients.filter((c) => c.businessName || c.companyNumber).length;
    const personal = total - business;
    return { total, business, personal };
  }, [clients]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">מבוטחים</h1>
          <p className="text-muted-foreground mt-1">ניהול לקוחות הסוכנות</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="hover-scale">
          <CardContent className="p-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div className="text-3xl font-bold text-foreground">{stats.total}</div>
            <div className="text-sm text-muted-foreground">סה"כ לקוחות</div>
          </CardContent>
        </Card>
        <Card className="hover-scale">
          <CardContent className="p-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Building className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.business}</div>
            <div className="text-sm text-muted-foreground">עסקיים</div>
          </CardContent>
        </Card>
        <Card className="hover-scale">
          <CardContent className="p-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.personal}</div>
            <div className="text-sm text-muted-foreground">פרטיים</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="חיפוש לפי שם, ת״ז, ח״פ, טלפון או מייל..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-10 text-base"
              />
            </div>
            <Select value={filterType} onValueChange={(v) => setFilterType(v as ClientTypeFilter)}>
              <SelectTrigger className="w-[160px] text-base">
                <SelectValue placeholder="סוג לקוח" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">כל הלקוחות</SelectItem>
                <SelectItem value="BUSINESS">עסקיים</SelectItem>
                <SelectItem value="PRIVATE">פרטיים</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right text-base">שם</TableHead>
                <TableHead className="text-right text-base">ת"ז / ח"פ</TableHead>
                <TableHead className="text-right text-base">סוג</TableHead>
                <TableHead className="text-right text-base">טלפון</TableHead>
                <TableHead className="text-right text-base">מייל</TableHead>
                <TableHead className="text-right text-base">פוליסות</TableHead>
                <TableHead className="text-right text-base">פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-base">
                    {clients.length === 0 ? "אין לקוחות במערכת" : "לא נמצאו לקוחות התואמים לחיפוש"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client) => {
                  const isBusiness = !!client.businessName || !!client.companyNumber;
                  const policiesCount = getPoliciesCount(client.id);
                  return (
                    <TableRow key={client.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-base text-foreground">
                            {client.businessName || client.name}
                          </div>
                          {client.businessName && (
                            <div className="text-sm text-muted-foreground">{client.name}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-base font-mono">
                        {client.companyNumber || client.idNumber}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            isBusiness
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          }
                        >
                          {isBusiness ? "עסקי" : "פרטי"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-base">{client.phone || "-"}</TableCell>
                      <TableCell className="text-base">{client.email || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-base">
                          {policiesCount}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Link to={`/clients/${client.id}`}>
                          <Button variant="ghost" size="sm" className="gap-1 text-primary">
                            פרטים ופוליסות
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Clients;
