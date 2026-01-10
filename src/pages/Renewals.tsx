import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  RefreshCw,
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
} from "lucide-react";
import { useData } from "../context/DataContext";
import type { RenewalStatus, Channel } from "../types";

const statusLabels: Record<RenewalStatus, string> = {
  NEW: "חדש",
  IN_PROGRESS: "בטיפול",
  QUOTED: "נשלחה הצעה",
  WAITING_CLIENT: "ממתין ללקוח",
  COMPLETED: "הושלם",
  CANCELLED: "בוטל",
};

const statusColors: Record<RenewalStatus, string> = {
  NEW: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  IN_PROGRESS: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  QUOTED: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  WAITING_CLIENT: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  CANCELLED: "bg-muted text-muted-foreground",
};

const Renewals = () => {
  const { renewals, policies, clients, employees, addTask } = useData();
  const [filterStatus, setFilterStatus] = useState<RenewalStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [selectedRenewal, setSelectedRenewal] = useState<string | null>(null);

  const [newTask, setNewTask] = useState({
    title: "",
    dueDate: "",
    channel: "PHONE" as Channel,
    assigneeUserId: "",
  });

  const enrichedRenewals = useMemo(() => {
    return renewals.map((renewal) => {
      const policy = policies.find((p) => p.id === renewal.policyId);
      const client = clients.find((c) => c.id === renewal.clientId);
      const assignee = employees.find((e) => e.id === renewal.assignedToUserId);
      return {
        ...renewal,
        policyNumber: policy?.policyNumber || "—",
        clientName: client?.businessName || client?.name || "—",
        assigneeName: assignee?.name || "—",
      };
    });
  }, [renewals, policies, clients, employees]);

  const filteredRenewals = useMemo(() => {
    return enrichedRenewals.filter((r) => {
      const matchesStatus = filterStatus === "ALL" || r.status === filterStatus;
      const matchesSearch =
        r.clientName.includes(search) ||
        r.policyNumber.includes(search) ||
        r.assigneeName.includes(search);
      return matchesStatus && matchesSearch;
    });
  }, [enrichedRenewals, filterStatus, search]);

  const stats = useMemo(() => {
    return {
      new: renewals.filter((r) => r.status === "NEW").length,
      inProgress: renewals.filter((r) => r.status === "IN_PROGRESS").length,
      quoted: renewals.filter((r) => r.status === "QUOTED").length,
      waiting: renewals.filter((r) => r.status === "WAITING_CLIENT").length,
      completed: renewals.filter((r) => r.status === "COMPLETED").length,
      cancelled: renewals.filter((r) => r.status === "CANCELLED").length,
    };
  }, [renewals]);

  const today = new Date();
  const nextMonth = new Date(today);
  nextMonth.setDate(nextMonth.getDate() + 30);

  const upcomingCount = useMemo(() => {
    return renewals.filter((r) => {
      const renewalDate = new Date(r.expectedRenewalDate);
      return renewalDate >= today && renewalDate <= nextMonth && r.status !== "COMPLETED" && r.status !== "CANCELLED";
    }).length;
  }, [renewals]);

  const handleOpenTaskDialog = (renewalId: string) => {
    setSelectedRenewal(renewalId);
    const renewal = enrichedRenewals.find((r) => r.id === renewalId);
    if (renewal) {
      setNewTask({
        title: `טיפול בחידוש פוליסה ${renewal.policyNumber} - ${renewal.clientName}`,
        dueDate: renewal.expectedRenewalDate,
        channel: "PHONE",
        assigneeUserId: renewal.assignedToUserId,
      });
    }
    setTaskDialogOpen(true);
  };

  const handleAddTask = () => {
    if (!newTask.title.trim() || !selectedRenewal) return;

    const renewal = renewals.find((r) => r.id === selectedRenewal);
    if (!renewal) return;

    addTask({
      title: newTask.title.trim(),
      relatedClientId: renewal.clientId,
      relatedPolicyId: renewal.policyId,
      dueDate: newTask.dueDate || new Date().toISOString().split("T")[0],
      assigneeUserId: newTask.assigneeUserId || employees[0]?.id || "u1",
      channel: newTask.channel,
      kind: "RENEWAL",
    });

    setNewTask({
      title: "",
      dueDate: "",
      channel: "PHONE",
      assigneeUserId: "",
    });
    setTaskDialogOpen(false);
    setSelectedRenewal(null);
  };

  const isUpcoming = (dateStr: string) => {
    const date = new Date(dateStr);
    return date >= today && date <= nextMonth;
  };

  const isPast = (dateStr: string) => {
    return new Date(dateStr) < today;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">חידושים</h1>
          <p className="text-muted-foreground mt-1">צינור עבודה לניהול חידושי פוליסות</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <Card className="hover-scale cursor-pointer" onClick={() => setFilterStatus("NEW")}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.new}</div>
            <div className="text-sm text-muted-foreground">חדשים</div>
          </CardContent>
        </Card>
        <Card className="hover-scale cursor-pointer" onClick={() => setFilterStatus("IN_PROGRESS")}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.inProgress}</div>
            <div className="text-sm text-muted-foreground">בטיפול</div>
          </CardContent>
        </Card>
        <Card className="hover-scale cursor-pointer" onClick={() => setFilterStatus("QUOTED")}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.quoted}</div>
            <div className="text-sm text-muted-foreground">נשלחה הצעה</div>
          </CardContent>
        </Card>
        <Card className="hover-scale cursor-pointer" onClick={() => setFilterStatus("WAITING_CLIENT")}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.waiting}</div>
            <div className="text-sm text-muted-foreground">ממתין ללקוח</div>
          </CardContent>
        </Card>
        <Card className="hover-scale cursor-pointer" onClick={() => setFilterStatus("COMPLETED")}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</div>
            <div className="text-sm text-muted-foreground">הושלמו</div>
          </CardContent>
        </Card>
        <Card className="hover-scale cursor-pointer" onClick={() => setFilterStatus("CANCELLED")}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-muted-foreground">{stats.cancelled}</div>
            <div className="text-sm text-muted-foreground">בוטלו</div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Alert */}
      {upcomingCount > 0 && (
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-semibold text-foreground text-lg">
                    {upcomingCount} חידושים ב-30 ימים הקרובים
                  </p>
                  <p className="text-sm text-muted-foreground">דורשים טיפול מיידי</p>
                </div>
              </div>
              <Button variant="outline" onClick={() => setFilterStatus("ALL")}>
                הצג הכל
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="חיפוש לפי לקוח, פוליסה או עובד..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-10 text-base"
              />
            </div>
            <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as RenewalStatus | "ALL")}>
              <SelectTrigger className="w-[180px] text-base">
                <SelectValue placeholder="סטטוס" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">כל הסטטוסים</SelectItem>
                <SelectItem value="NEW">חדש</SelectItem>
                <SelectItem value="IN_PROGRESS">בטיפול</SelectItem>
                <SelectItem value="QUOTED">נשלחה הצעה</SelectItem>
                <SelectItem value="WAITING_CLIENT">ממתין ללקוח</SelectItem>
                <SelectItem value="COMPLETED">הושלם</SelectItem>
                <SelectItem value="CANCELLED">בוטל</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Renewals Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right text-base">לקוח</TableHead>
                <TableHead className="text-right text-base">מספר פוליסה</TableHead>
                <TableHead className="text-right text-base">תאריך חידוש</TableHead>
                <TableHead className="text-right text-base">פרמיה קודמת</TableHead>
                <TableHead className="text-right text-base">פרמיה צפויה</TableHead>
                <TableHead className="text-right text-base">עובד מטפל</TableHead>
                <TableHead className="text-right text-base">סטטוס</TableHead>
                <TableHead className="text-right text-base">פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRenewals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground text-base">
                    {renewals.length === 0 ? "אין חידושים במערכת" : "לא נמצאו חידושים התואמים לחיפוש"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredRenewals.map((renewal) => (
                  <TableRow
                    key={renewal.id}
                    className={
                      renewal.status === "COMPLETED" || renewal.status === "CANCELLED"
                        ? "opacity-60"
                        : isPast(renewal.expectedRenewalDate)
                        ? "bg-destructive/5"
                        : isUpcoming(renewal.expectedRenewalDate)
                        ? "bg-primary/5"
                        : ""
                    }
                  >
                    <TableCell className="font-medium text-base">{renewal.clientName}</TableCell>
                    <TableCell className="font-mono text-base">{renewal.policyNumber}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span
                          className={`text-base ${
                            isPast(renewal.expectedRenewalDate) && renewal.status !== "COMPLETED"
                              ? "text-destructive font-semibold"
                              : isUpcoming(renewal.expectedRenewalDate)
                              ? "text-primary font-semibold"
                              : ""
                          }`}
                        >
                          {new Date(renewal.expectedRenewalDate).toLocaleDateString("he-IL")}
                        </span>
                        {isPast(renewal.expectedRenewalDate) && renewal.status !== "COMPLETED" && (
                          <Badge className="bg-destructive/20 text-destructive text-xs">עבר</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-base">
                      {renewal.previousPremium
                        ? `${renewal.previousPremium.toLocaleString("he-IL")} ₪`
                        : "-"}
                    </TableCell>
                    <TableCell className="text-base font-semibold">
                      {renewal.expectedPremium
                        ? `${renewal.expectedPremium.toLocaleString("he-IL")} ₪`
                        : "-"}
                    </TableCell>
                    <TableCell className="text-base">{renewal.assigneeName}</TableCell>
                    <TableCell>
                      <Badge className={`text-sm ${statusColors[renewal.status]}`}>
                        {statusLabels[renewal.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-primary"
                        onClick={() => handleOpenTaskDialog(renewal.id)}
                      >
                        <Plus className="h-4 w-4" />
                        פתח משימה
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Task Dialog */}
      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">יצירת משימת חידוש</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-base">כותרת המשימה</Label>
              <Input
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="text-base"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-base">תאריך יעד</Label>
                <Input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="text-base"
                />
              </div>
              <div>
                <Label className="text-base">ערוץ</Label>
                <Select
                  value={newTask.channel}
                  onValueChange={(v) => setNewTask({ ...newTask, channel: v as Channel })}
                >
                  <SelectTrigger className="text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PHONE">טלפון</SelectItem>
                    <SelectItem value="WHATSAPP">ווטסאפ</SelectItem>
                    <SelectItem value="EMAIL">מייל</SelectItem>
                    <SelectItem value="SMS">SMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-base">שיוך לעובד</Label>
              <Select
                value={newTask.assigneeUserId}
                onValueChange={(v) => setNewTask({ ...newTask, assigneeUserId: v })}
              >
                <SelectTrigger className="text-base">
                  <SelectValue placeholder="בחר עובד" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddTask} className="w-full text-base" size="lg">
              צור משימה
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Renewals;
