import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
import {
  ArrowRight,
  User,
  Phone,
  Mail,
  MapPin,
  Building,
  FileText,
  Plus,
  Calendar,
} from "lucide-react";
import { useData } from "../context/DataContext";
import type { Channel } from "../types";

const companyNames: Record<string, string> = {
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

const ClientDetails = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const { clients, policies, addTask, employees } = useData();
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);

  const client = clients.find((c) => c.id === clientId);
  const clientPolicies = policies.filter((p) => p.clientId === clientId);

  const [newTask, setNewTask] = useState({
    title: "",
    notes: "",
    dueDate: "",
    channel: "PHONE" as Channel,
    assigneeUserId: "",
  });

  if (!client) {
    return (
      <div className="space-y-4">
        <Link to="/clients" className="flex items-center gap-2 text-primary hover:underline">
          <ArrowRight className="h-4 w-4" />
          חזרה לרשימת המבוטחים
        </Link>
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            לקוח לא נמצא
          </CardContent>
        </Card>
      </div>
    );
  }

  const isBusiness = !!client.businessName || !!client.companyNumber;

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;

    addTask({
      title: newTask.title.trim(),
      relatedClientId: client.id,
      dueDate: newTask.dueDate || new Date().toISOString().split("T")[0],
      assigneeUserId: newTask.assigneeUserId || employees[0]?.id || "u1",
      notes: newTask.notes.trim() || undefined,
      channel: newTask.channel,
      kind: "OTHER",
    });

    setNewTask({
      title: "",
      notes: "",
      dueDate: "",
      channel: "PHONE",
      assigneeUserId: "",
    });
    setTaskDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link to="/clients" className="flex items-center gap-2 text-primary hover:underline text-base">
        <ArrowRight className="h-5 w-5" />
        חזרה לרשימת המבוטחים
      </Link>

      {/* Client Info Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center gap-3">
              {isBusiness ? (
                <Building className="h-7 w-7 text-primary" />
              ) : (
                <User className="h-7 w-7 text-primary" />
              )}
              {client.businessName || client.name}
            </CardTitle>
            <Badge
              className={
                isBusiness
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-base"
                  : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-base"
              }
            >
              {isBusiness ? "עסקי" : "פרטי"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Personal Info */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground text-lg">פרטים אישיים</h3>
              <div className="space-y-2 text-base">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span className="text-foreground">{client.name}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span className="font-mono text-foreground">{client.idNumber}</span>
                  <span className="text-sm">(ת"ז)</span>
                </div>
                {client.companyNumber && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building className="h-4 w-4" />
                    <span className="font-mono text-foreground">{client.companyNumber}</span>
                    <span className="text-sm">(ח"פ)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground text-lg">פרטי קשר</h3>
              <div className="space-y-2 text-base">
                {client.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <a href={`tel:${client.phone}`} className="text-primary hover:underline">
                      {client.phone}
                    </a>
                  </div>
                )}
                {client.email && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${client.email}`} className="text-primary hover:underline">
                      {client.email}
                    </a>
                  </div>
                )}
                {!client.phone && !client.email && (
                  <span className="text-muted-foreground">לא צוינו פרטי קשר</span>
                )}
              </div>
            </div>

            {/* Address Info */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground text-lg">כתובות</h3>
              <div className="space-y-2 text-base">
                {client.homeAddress && (
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 mt-1" />
                    <div>
                      <div className="text-foreground">{client.homeAddress}</div>
                      <div className="text-sm">(בית)</div>
                    </div>
                  </div>
                )}
                {client.businessAddress && (
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 mt-1" />
                    <div>
                      <div className="text-foreground">{client.businessAddress}</div>
                      <div className="text-sm">(עסק)</div>
                    </div>
                  </div>
                )}
                {!client.homeAddress && !client.businessAddress && (
                  <span className="text-muted-foreground">לא צוינו כתובות</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2 text-base">
              <Plus className="h-5 w-5" />
              יצירת משימה ללקוח זה
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">משימה חדשה - {client.businessName || client.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-base">כותרת המשימה</Label>
                <Input
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="לדוגמה: לחזור ללקוח בנושא חידוש"
                  className="text-base"
                />
              </div>
              <div>
                <Label className="text-base">הערות</Label>
                <Textarea
                  value={newTask.notes}
                  onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                  placeholder="פרטים נוספים..."
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
                      <SelectItem value="MEETING">פגישה</SelectItem>
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

      {/* Policies Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <FileText className="h-5 w-5" />
            פוליסות ({clientPolicies.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right text-base">מספר פוליסה</TableHead>
                <TableHead className="text-right text-base">חברה</TableHead>
                <TableHead className="text-right text-base">סוג מוצר</TableHead>
                <TableHead className="text-right text-base">תוקף</TableHead>
                <TableHead className="text-right text-base">פרמיה שנתית</TableHead>
                <TableHead className="text-right text-base">הערות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientPolicies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-base">
                    אין פוליסות ללקוח זה
                  </TableCell>
                </TableRow>
              ) : (
                clientPolicies.map((policy) => {
                  const isExpired = new Date(policy.endDate) < new Date();
                  return (
                    <TableRow key={policy.id} className={isExpired ? "opacity-60" : ""}>
                      <TableCell className="font-mono text-base">{policy.policyNumber}</TableCell>
                      <TableCell className="text-base">{companyNames[policy.companyId] || policy.companyId}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-sm">
                          {productNames[policy.productType] || policy.productType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-base">
                            {new Date(policy.startDate).toLocaleDateString("he-IL")} -{" "}
                            {new Date(policy.endDate).toLocaleDateString("he-IL")}
                          </span>
                          {isExpired && (
                            <Badge className="bg-destructive/20 text-destructive text-xs">פג תוקף</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-base font-semibold">
                        {policy.annualPremium.toLocaleString("he-IL")} ₪
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                        {policy.notes || "-"}
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

export default ClientDetails;
