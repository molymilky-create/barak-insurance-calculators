import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Plus, Search, Calendar, User, Users, ClipboardList } from "lucide-react";

type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
type TaskType = "PERSONAL" | "TEAM" | "AGENT";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  type: TaskType;
  assignee?: string;
  assignedBy: string;
  dueDate?: string;
  createdAt: string;
  relatedTo?: string;
}

const teamMembers = [
  { id: "1", name: "יוסי כהן" },
  { id: "2", name: "מיכל לוי" },
  { id: "3", name: "דני אברהם" },
  { id: "4", name: "שרה גולד" },
];

const initialTasks: Task[] = [
  {
    id: "1",
    title: "להתקשר ללקוח דוד לוי",
    description: "לברר פרטים על פוליסת הרכב החדשה",
    priority: "HIGH",
    status: "TODO",
    type: "AGENT",
    assignee: "יוסי כהן",
    assignedBy: "סוכן ראשי",
    dueDate: "2026-01-12",
    createdAt: "2026-01-10",
    relatedTo: "ליד #1234",
  },
  {
    id: "2",
    title: "לשלוח הצעת מחיר לחווה ירוקה",
    description: "הצעה לביטוח חקלאי מקיף",
    priority: "URGENT",
    status: "IN_PROGRESS",
    type: "TEAM",
    assignee: "מיכל לוי",
    assignedBy: "סוכן ראשי",
    dueDate: "2026-01-11",
    createdAt: "2026-01-09",
  },
  {
    id: "3",
    title: "לעדכן מסמכי פוליסה",
    description: "עדכון מסמכים עבור לקוחות שחידשו",
    priority: "MEDIUM",
    status: "TODO",
    type: "PERSONAL",
    assignedBy: "יוסי כהן",
    createdAt: "2026-01-10",
  },
  {
    id: "4",
    title: "להכין דוח עמלות חודשי",
    description: "סיכום עמלות לחודש דצמבר",
    priority: "LOW",
    status: "DONE",
    type: "AGENT",
    assignee: "דני אברהם",
    assignedBy: "סוכן ראשי",
    dueDate: "2026-01-15",
    createdAt: "2026-01-08",
  },
  {
    id: "5",
    title: "פגישה עם לקוח פוטנציאלי",
    description: "פגישה לסגירת עסקה עם מאמן סוסים",
    priority: "HIGH",
    status: "TODO",
    type: "TEAM",
    assignedBy: "סוכן ראשי",
    dueDate: "2026-01-13",
    createdAt: "2026-01-10",
  },
];

const priorityColors: Record<TaskPriority, string> = {
  LOW: "bg-muted text-muted-foreground",
  MEDIUM: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  HIGH: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  URGENT: "bg-destructive/20 text-destructive",
};

const priorityLabels: Record<TaskPriority, string> = {
  LOW: "נמוכה",
  MEDIUM: "בינונית",
  HIGH: "גבוהה",
  URGENT: "דחוף",
};

const statusColors: Record<TaskStatus, string> = {
  TODO: "bg-muted text-muted-foreground",
  IN_PROGRESS: "bg-primary/20 text-primary",
  DONE: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
};

const statusLabels: Record<TaskStatus, string> = {
  TODO: "לביצוע",
  IN_PROGRESS: "בטיפול",
  DONE: "הושלם",
};

const typeLabels: Record<TaskType, string> = {
  PERSONAL: "אישי",
  TEAM: "צוות",
  AGENT: "מהסוכן",
};

const typeIcons: Record<TaskType, React.ReactNode> = {
  PERSONAL: <User className="h-4 w-4" />,
  TEAM: <Users className="h-4 w-4" />,
  AGENT: <ClipboardList className="h-4 w-4" />,
};

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "ALL">("ALL");
  const [filterPriority, setFilterPriority] = useState<TaskPriority | "ALL">("ALL");
  const [activeTab, setActiveTab] = useState<TaskType | "ALL">("ALL");
  const [dialogOpen, setDialogOpen] = useState(false);

  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    priority: "MEDIUM",
    status: "TODO",
    type: "PERSONAL",
    assignee: "",
    dueDate: "",
  });

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.includes(search) ||
      task.description.includes(search) ||
      task.assignee?.includes(search);
    const matchesStatus = filterStatus === "ALL" || task.status === filterStatus;
    const matchesPriority = filterPriority === "ALL" || task.priority === filterPriority;
    const matchesType = activeTab === "ALL" || task.type === activeTab;
    return matchesSearch && matchesStatus && matchesPriority && matchesType;
  });

  const handleAddTask = () => {
    if (!newTask.title) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description || "",
      priority: newTask.priority as TaskPriority,
      status: newTask.status as TaskStatus,
      type: newTask.type as TaskType,
      assignee: newTask.assignee || undefined,
      assignedBy: "המשתמש הנוכחי",
      dueDate: newTask.dueDate || undefined,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setTasks([task, ...tasks]);
    setNewTask({
      title: "",
      description: "",
      priority: "MEDIUM",
      status: "TODO",
      type: "PERSONAL",
      assignee: "",
      dueDate: "",
    });
    setDialogOpen(false);
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const newStatus: TaskStatus =
            task.status === "TODO"
              ? "IN_PROGRESS"
              : task.status === "IN_PROGRESS"
              ? "DONE"
              : "TODO";
          return { ...task, status: newStatus };
        }
        return task;
      })
    );
  };

  const getTaskStats = () => {
    const todo = tasks.filter((t) => t.status === "TODO").length;
    const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length;
    const done = tasks.filter((t) => t.status === "DONE").length;
    const urgent = tasks.filter((t) => t.priority === "URGENT" && t.status !== "DONE").length;
    return { todo, inProgress, done, urgent };
  };

  const stats = getTaskStats();

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">ניהול משימות</h1>
          <p className="text-muted-foreground">משימות אישיות, צוות ומשימות מהסוכן</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              משימה חדשה
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md" dir="rtl">
            <DialogHeader>
              <DialogTitle>הוספת משימה חדשה</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>כותרת</Label>
                <Input
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="כותרת המשימה"
                />
              </div>
              <div>
                <Label>תיאור</Label>
                <Textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="פרטי המשימה"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>סוג</Label>
                  <Select
                    value={newTask.type}
                    onValueChange={(v) => setNewTask({ ...newTask, type: v as TaskType })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PERSONAL">אישי</SelectItem>
                      <SelectItem value="TEAM">צוות</SelectItem>
                      <SelectItem value="AGENT">מהסוכן</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>עדיפות</Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(v) => setNewTask({ ...newTask, priority: v as TaskPriority })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">נמוכה</SelectItem>
                      <SelectItem value="MEDIUM">בינונית</SelectItem>
                      <SelectItem value="HIGH">גבוהה</SelectItem>
                      <SelectItem value="URGENT">דחוף</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {(newTask.type === "TEAM" || newTask.type === "AGENT") && (
                <div>
                  <Label>שיוך לעובד</Label>
                  <Select
                    value={newTask.assignee}
                    onValueChange={(v) => setNewTask({ ...newTask, assignee: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="בחר עובד" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.name}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div>
                <Label>תאריך יעד</Label>
                <Input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </div>
              <Button onClick={handleAddTask} className="w-full">
                הוסף משימה
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-foreground">{stats.todo}</div>
            <div className="text-sm text-muted-foreground">לביצוע</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-primary">{stats.inProgress}</div>
            <div className="text-sm text-muted-foreground">בטיפול</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.done}</div>
            <div className="text-sm text-muted-foreground">הושלמו</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-destructive">{stats.urgent}</div>
            <div className="text-sm text-muted-foreground">דחופות</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="חיפוש משימות..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as TaskStatus | "ALL")}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="סטטוס" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">כל הסטטוסים</SelectItem>
                <SelectItem value="TODO">לביצוע</SelectItem>
                <SelectItem value="IN_PROGRESS">בטיפול</SelectItem>
                <SelectItem value="DONE">הושלם</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={(v) => setFilterPriority(v as TaskPriority | "ALL")}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="עדיפות" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">כל העדיפויות</SelectItem>
                <SelectItem value="LOW">נמוכה</SelectItem>
                <SelectItem value="MEDIUM">בינונית</SelectItem>
                <SelectItem value="HIGH">גבוהה</SelectItem>
                <SelectItem value="URGENT">דחוף</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TaskType | "ALL")}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ALL">הכל ({tasks.length})</TabsTrigger>
          <TabsTrigger value="PERSONAL" className="gap-1">
            <User className="h-4 w-4" />
            אישי ({tasks.filter((t) => t.type === "PERSONAL").length})
          </TabsTrigger>
          <TabsTrigger value="TEAM" className="gap-1">
            <Users className="h-4 w-4" />
            צוות ({tasks.filter((t) => t.type === "TEAM").length})
          </TabsTrigger>
          <TabsTrigger value="AGENT" className="gap-1">
            <ClipboardList className="h-4 w-4" />
            מהסוכן ({tasks.filter((t) => t.type === "AGENT").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-right"></TableHead>
                    <TableHead className="text-right">משימה</TableHead>
                    <TableHead className="text-right">סוג</TableHead>
                    <TableHead className="text-right">שיוך</TableHead>
                    <TableHead className="text-right">עדיפות</TableHead>
                    <TableHead className="text-right">סטטוס</TableHead>
                    <TableHead className="text-right">תאריך יעד</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        לא נמצאו משימות
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTasks.map((task) => (
                      <TableRow key={task.id} className={task.status === "DONE" ? "opacity-60" : ""}>
                        <TableCell>
                          <Checkbox
                            checked={task.status === "DONE"}
                            onCheckedChange={() => toggleTaskStatus(task.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className={`font-medium ${task.status === "DONE" ? "line-through" : ""}`}>
                              {task.title}
                            </div>
                            <div className="text-sm text-muted-foreground">{task.description}</div>
                            {task.relatedTo && (
                              <div className="text-xs text-primary mt-1">{task.relatedTo}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            {typeIcons[task.type]}
                            {typeLabels[task.type]}
                          </div>
                        </TableCell>
                        <TableCell>
                          {task.assignee ? (
                            <div className="text-sm">{task.assignee}</div>
                          ) : (
                            <span className="text-muted-foreground text-sm">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={priorityColors[task.priority]}>
                            {priorityLabels[task.priority]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`cursor-pointer ${statusColors[task.status]}`}
                            onClick={() => toggleTaskStatus(task.id)}
                          >
                            {statusLabels[task.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {task.dueDate ? (
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="h-3 w-3" />
                              {task.dueDate}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">—</span>
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
      </Tabs>
    </div>
  );
};

export default Tasks;
