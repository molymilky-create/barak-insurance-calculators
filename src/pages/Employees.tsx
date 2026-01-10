import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Calendar } from "@/components/ui/calendar";
import { Plus, Search, Phone, Mail, Calendar as CalendarIcon, Users, Briefcase, Clock } from "lucide-react";

type EmployeeRole = "AGENT" | "ASSISTANT" | "MANAGER" | "ADMIN";
type TimeOffStatus = "PENDING" | "APPROVED" | "REJECTED";
type TimeOffType = "VACATION" | "SICK" | "PERSONAL" | "OTHER";

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: EmployeeRole;
  department: string;
  startDate: string;
  vacationDaysTotal: number;
  vacationDaysUsed: number;
  sickDaysUsed: number;
  isActive: boolean;
}

interface TimeOff {
  id: string;
  employeeId: string;
  employeeName: string;
  type: TimeOffType;
  startDate: string;
  endDate: string;
  status: TimeOffStatus;
  reason: string;
  createdAt: string;
}

const initialEmployees: Employee[] = [
  {
    id: "1",
    name: "יוסי כהן",
    email: "yossi@barak-ins.co.il",
    phone: "052-1234567",
    role: "AGENT",
    department: "מכירות",
    startDate: "2020-03-15",
    vacationDaysTotal: 18,
    vacationDaysUsed: 5,
    sickDaysUsed: 2,
    isActive: true,
  },
  {
    id: "2",
    name: "מיכל לוי",
    email: "michal@barak-ins.co.il",
    phone: "052-2345678",
    role: "ASSISTANT",
    department: "שירות לקוחות",
    startDate: "2021-07-01",
    vacationDaysTotal: 15,
    vacationDaysUsed: 8,
    sickDaysUsed: 1,
    isActive: true,
  },
  {
    id: "3",
    name: "דני אברהם",
    email: "dani@barak-ins.co.il",
    phone: "052-3456789",
    role: "MANAGER",
    department: "ניהול",
    startDate: "2018-01-10",
    vacationDaysTotal: 22,
    vacationDaysUsed: 12,
    sickDaysUsed: 0,
    isActive: true,
  },
  {
    id: "4",
    name: "שרה גולד",
    email: "sara@barak-ins.co.il",
    phone: "052-4567890",
    role: "AGENT",
    department: "מכירות",
    startDate: "2022-09-01",
    vacationDaysTotal: 12,
    vacationDaysUsed: 3,
    sickDaysUsed: 4,
    isActive: true,
  },
];

const initialTimeOffs: TimeOff[] = [
  {
    id: "1",
    employeeId: "1",
    employeeName: "יוסי כהן",
    type: "VACATION",
    startDate: "2026-01-15",
    endDate: "2026-01-20",
    status: "APPROVED",
    reason: "חופשה משפחתית",
    createdAt: "2026-01-05",
  },
  {
    id: "2",
    employeeId: "2",
    employeeName: "מיכל לוי",
    type: "SICK",
    startDate: "2026-01-12",
    endDate: "2026-01-13",
    status: "APPROVED",
    reason: "מחלה",
    createdAt: "2026-01-12",
  },
  {
    id: "3",
    employeeId: "3",
    employeeName: "דני אברהם",
    type: "PERSONAL",
    startDate: "2026-01-25",
    endDate: "2026-01-25",
    status: "PENDING",
    reason: "יום אישי",
    createdAt: "2026-01-10",
  },
];

const roleLabels: Record<EmployeeRole, string> = {
  AGENT: "סוכן",
  ASSISTANT: "עוזר/ת",
  MANAGER: "מנהל/ת",
  ADMIN: "מנהל מערכת",
};

const roleColors: Record<EmployeeRole, string> = {
  AGENT: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  ASSISTANT: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  MANAGER: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  ADMIN: "bg-destructive/20 text-destructive",
};

const timeOffTypeLabels: Record<TimeOffType, string> = {
  VACATION: "חופשה",
  SICK: "מחלה",
  PERSONAL: "אישי",
  OTHER: "אחר",
};

const timeOffTypeColors: Record<TimeOffType, string> = {
  VACATION: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  SICK: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  PERSONAL: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  OTHER: "bg-muted text-muted-foreground",
};

const statusLabels: Record<TimeOffStatus, string> = {
  PENDING: "ממתין",
  APPROVED: "מאושר",
  REJECTED: "נדחה",
};

const statusColors: Record<TimeOffStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  APPROVED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  REJECTED: "bg-destructive/20 text-destructive",
};

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [timeOffs, setTimeOffs] = useState<TimeOff[]>(initialTimeOffs);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("employees");
  const [employeeDialogOpen, setEmployeeDialogOpen] = useState(false);
  const [timeOffDialogOpen, setTimeOffDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({
    name: "",
    email: "",
    phone: "",
    role: "AGENT",
    department: "",
    vacationDaysTotal: 18,
  });

  const [newTimeOff, setNewTimeOff] = useState<Partial<TimeOff>>({
    employeeId: "",
    type: "VACATION",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.includes(search) ||
      emp.email.includes(search) ||
      emp.department.includes(search)
  );

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.email) return;

    const employee: Employee = {
      id: Date.now().toString(),
      name: newEmployee.name,
      email: newEmployee.email,
      phone: newEmployee.phone || "",
      role: newEmployee.role as EmployeeRole,
      department: newEmployee.department || "",
      startDate: new Date().toISOString().split("T")[0],
      vacationDaysTotal: newEmployee.vacationDaysTotal || 18,
      vacationDaysUsed: 0,
      sickDaysUsed: 0,
      isActive: true,
    };

    setEmployees([...employees, employee]);
    setNewEmployee({
      name: "",
      email: "",
      phone: "",
      role: "AGENT",
      department: "",
      vacationDaysTotal: 18,
    });
    setEmployeeDialogOpen(false);
  };

  const handleAddTimeOff = () => {
    if (!newTimeOff.employeeId || !newTimeOff.startDate || !newTimeOff.endDate) return;

    const employee = employees.find((e) => e.id === newTimeOff.employeeId);
    if (!employee) return;

    const timeOff: TimeOff = {
      id: Date.now().toString(),
      employeeId: newTimeOff.employeeId,
      employeeName: employee.name,
      type: newTimeOff.type as TimeOffType,
      startDate: newTimeOff.startDate,
      endDate: newTimeOff.endDate,
      status: "PENDING",
      reason: newTimeOff.reason || "",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setTimeOffs([timeOff, ...timeOffs]);
    setNewTimeOff({
      employeeId: "",
      type: "VACATION",
      startDate: "",
      endDate: "",
      reason: "",
    });
    setTimeOffDialogOpen(false);
  };

  const updateTimeOffStatus = (id: string, status: TimeOffStatus) => {
    setTimeOffs(
      timeOffs.map((t) => (t.id === id ? { ...t, status } : t))
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2);
  };

  const getStats = () => {
    const totalEmployees = employees.filter((e) => e.isActive).length;
    const onVacation = timeOffs.filter(
      (t) => t.status === "APPROVED" && t.type === "VACATION"
    ).length;
    const pendingRequests = timeOffs.filter((t) => t.status === "PENDING").length;
    const onSick = timeOffs.filter(
      (t) => t.status === "APPROVED" && t.type === "SICK"
    ).length;
    return { totalEmployees, onVacation, pendingRequests, onSick };
  };

  const stats = getStats();

  // Get dates with time off for calendar highlighting
  const timeOffDates = timeOffs
    .filter((t) => t.status === "APPROVED")
    .flatMap((t) => {
      const dates: Date[] = [];
      const start = new Date(t.startDate);
      const end = new Date(t.endDate);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d));
      }
      return dates;
    });

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">עובדים וחופשות</h1>
          <p className="text-muted-foreground">ניהול צוות הסוכנות ולוח חופשות</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={timeOffDialogOpen} onOpenChange={setTimeOffDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <CalendarIcon className="h-4 w-4" />
                בקשת חופשה
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md" dir="rtl">
              <DialogHeader>
                <DialogTitle>בקשת חופשה/היעדרות</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>עובד</Label>
                  <Select
                    value={newTimeOff.employeeId}
                    onValueChange={(v) => setNewTimeOff({ ...newTimeOff, employeeId: v })}
                  >
                    <SelectTrigger>
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
                <div>
                  <Label>סוג היעדרות</Label>
                  <Select
                    value={newTimeOff.type}
                    onValueChange={(v) => setNewTimeOff({ ...newTimeOff, type: v as TimeOffType })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VACATION">חופשה</SelectItem>
                      <SelectItem value="SICK">מחלה</SelectItem>
                      <SelectItem value="PERSONAL">אישי</SelectItem>
                      <SelectItem value="OTHER">אחר</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>מתאריך</Label>
                    <Input
                      type="date"
                      value={newTimeOff.startDate}
                      onChange={(e) => setNewTimeOff({ ...newTimeOff, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>עד תאריך</Label>
                    <Input
                      type="date"
                      value={newTimeOff.endDate}
                      onChange={(e) => setNewTimeOff({ ...newTimeOff, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label>סיבה</Label>
                  <Input
                    value={newTimeOff.reason}
                    onChange={(e) => setNewTimeOff({ ...newTimeOff, reason: e.target.value })}
                    placeholder="סיבת ההיעדרות"
                  />
                </div>
                <Button onClick={handleAddTimeOff} className="w-full">
                  שלח בקשה
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={employeeDialogOpen} onOpenChange={setEmployeeDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                עובד חדש
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md" dir="rtl">
              <DialogHeader>
                <DialogTitle>הוספת עובד חדש</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>שם מלא</Label>
                  <Input
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    placeholder="שם העובד"
                  />
                </div>
                <div>
                  <Label>אימייל</Label>
                  <Input
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <Label>טלפון</Label>
                  <Input
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                    placeholder="052-1234567"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>תפקיד</Label>
                    <Select
                      value={newEmployee.role}
                      onValueChange={(v) => setNewEmployee({ ...newEmployee, role: v as EmployeeRole })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AGENT">סוכן</SelectItem>
                        <SelectItem value="ASSISTANT">עוזר/ת</SelectItem>
                        <SelectItem value="MANAGER">מנהל/ת</SelectItem>
                        <SelectItem value="ADMIN">מנהל מערכת</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>מחלקה</Label>
                    <Input
                      value={newEmployee.department}
                      onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                      placeholder="מכירות"
                    />
                  </div>
                </div>
                <div>
                  <Label>ימי חופשה שנתיים</Label>
                  <Input
                    type="number"
                    value={newEmployee.vacationDaysTotal}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, vacationDaysTotal: parseInt(e.target.value) })
                    }
                  />
                </div>
                <Button onClick={handleAddEmployee} className="w-full">
                  הוסף עובד
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-3xl font-bold text-foreground">{stats.totalEmployees}</div>
            <div className="text-sm text-muted-foreground">עובדים פעילים</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CalendarIcon className="h-8 w-8 mx-auto mb-2 text-green-600 dark:text-green-400" />
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.onVacation}</div>
            <div className="text-sm text-muted-foreground">בחופשה</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-amber-600 dark:text-amber-400" />
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.pendingRequests}</div>
            <div className="text-sm text-muted-foreground">בקשות ממתינות</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Briefcase className="h-8 w-8 mx-auto mb-2 text-destructive" />
            <div className="text-3xl font-bold text-destructive">{stats.onSick}</div>
            <div className="text-sm text-muted-foreground">במחלה</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="employees">עובדים</TabsTrigger>
          <TabsTrigger value="timeoff">בקשות חופשה</TabsTrigger>
          <TabsTrigger value="calendar">לוח שנה</TabsTrigger>
        </TabsList>

        {/* Employees Tab */}
        <TabsContent value="employees" className="mt-4 space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="חיפוש עובדים..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pr-10"
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredEmployees.map((emp) => (
              <Card key={emp.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(emp.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">{emp.name}</h3>
                        <Badge className={roleColors[emp.role]}>{roleLabels[emp.role]}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{emp.department}</p>
                      <div className="mt-2 space-y-1 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {emp.email}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {emp.phone}
                        </div>
                      </div>
                      <div className="mt-3 flex gap-4 text-xs">
                        <div>
                          <span className="text-muted-foreground">חופשה: </span>
                          <span className="font-medium">
                            {emp.vacationDaysTotal - emp.vacationDaysUsed}/{emp.vacationDaysTotal}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">מחלה: </span>
                          <span className="font-medium">{emp.sickDaysUsed} ימים</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Time Off Requests Tab */}
        <TabsContent value="timeoff" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">עובד</TableHead>
                    <TableHead className="text-right">סוג</TableHead>
                    <TableHead className="text-right">מתאריך</TableHead>
                    <TableHead className="text-right">עד תאריך</TableHead>
                    <TableHead className="text-right">סיבה</TableHead>
                    <TableHead className="text-right">סטטוס</TableHead>
                    <TableHead className="text-right">פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timeOffs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        אין בקשות חופשה
                      </TableCell>
                    </TableRow>
                  ) : (
                    timeOffs.map((timeOff) => (
                      <TableRow key={timeOff.id}>
                        <TableCell className="font-medium">{timeOff.employeeName}</TableCell>
                        <TableCell>
                          <Badge className={timeOffTypeColors[timeOff.type]}>
                            {timeOffTypeLabels[timeOff.type]}
                          </Badge>
                        </TableCell>
                        <TableCell>{timeOff.startDate}</TableCell>
                        <TableCell>{timeOff.endDate}</TableCell>
                        <TableCell className="text-muted-foreground">{timeOff.reason || "—"}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[timeOff.status]}>
                            {statusLabels[timeOff.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {timeOff.status === "PENDING" && (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs text-green-600 hover:text-green-700"
                                onClick={() => updateTimeOffStatus(timeOff.id, "APPROVED")}
                              >
                                אשר
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs text-destructive hover:text-destructive"
                                onClick={() => updateTimeOffStatus(timeOff.id, "REJECTED")}
                              >
                                דחה
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calendar Tab */}
        <TabsContent value="calendar" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">לוח חופשות</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  modifiers={{
                    timeOff: timeOffDates,
                  }}
                  modifiersStyles={{
                    timeOff: {
                      backgroundColor: "hsl(var(--primary) / 0.2)",
                      borderRadius: "50%",
                    },
                  }}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">היעדרויות מאושרות</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {timeOffs
                  .filter((t) => t.status === "APPROVED")
                  .map((timeOff) => (
                    <div
                      key={timeOff.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div>
                        <div className="font-medium">{timeOff.employeeName}</div>
                        <div className="text-sm text-muted-foreground">
                          {timeOff.startDate} - {timeOff.endDate}
                        </div>
                      </div>
                      <Badge className={timeOffTypeColors[timeOff.type]}>
                        {timeOffTypeLabels[timeOff.type]}
                      </Badge>
                    </div>
                  ))}
                {timeOffs.filter((t) => t.status === "APPROVED").length === 0 && (
                  <p className="text-center text-muted-foreground py-4">אין היעדרויות מאושרות</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Employees;
