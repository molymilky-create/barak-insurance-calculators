import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import { Plus, Search, User, Users, ClipboardList, AlertTriangle } from "lucide-react";
import { useData } from "../context/DataContext";

type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
type TaskType = "PERSONAL" | "TEAM" | "AGENT";

interface LocalTask {
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

const priorityLabels: Record<TaskPriority, string> = {
  LOW: "נמוכה",
  MEDIUM: "בינונית",
  HIGH: "גבוהה",
  URGENT: "דחוף",
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

const Tasks = () => {
  const { employees } = useData();
  
  const [tasks, setTasks] = useState<LocalTask[]>([
    {
      id: "1",
      title: "להתקשר ללקוח דוד לוי",
      description: "לברר פרטים על פוליסת הרכב החדשה",
      priority: "HIGH",
      status: "TODO",
      type: "AGENT",
      assignee: "עובד",
      assignedBy: "מנהל",
      dueDate: "2026-01-08",
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
      assignee: "עובד",
      assignedBy: "מנהל",
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
      assignedBy: "עובד",
      createdAt: "2026-01-10",
    },
    {
      id: "4",
      title: "להכין דוח עמלות חודשי",
      description: "סיכום עמלות לחודש דצמבר",
      priority: "LOW",
      status: "DONE",
      type: "AGENT",
      assignee: "עובד",
      assignedBy: "מנהל",
      dueDate: "2026-01-15",
      createdAt: "2026-01-08",
    },
  ]);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "ALL">("ALL");
  const [filterPriority, setFilterPriority] = useState<TaskPriority | "ALL">("ALL");
  const [filterAssignee, setFilterAssignee] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<TaskType | "ALL">("ALL");
  const [dialogOpen, setDialogOpen] = useState(false);

  const [newTask, setNewTask] = useState<Partial<LocalTask>>({
    title: "",
    description: "",
    priority: "MEDIUM",
    status: "TODO",
    type: "PERSONAL",
    assignee: "",
    dueDate: "",
  });

  const today = new Date().toISOString().split("T")[0];

  const isOverdue = (task: LocalTask) => {
    return task.dueDate && task.dueDate < today && task.status !== "DONE";
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.includes(search) ||
        task.description.includes(search) ||
        task.assignee?.includes(search);
      const matchesStatus = filterStatus === "ALL" || task.status === filterStatus;
      const matchesPriority = filterPriority === "ALL" || task.priority === filterPriority;
      const matchesType = activeTab === "ALL" || task.type === activeTab;
      const matchesAssignee = filterAssignee === "ALL" || task.assignee === filterAssignee;
      return matchesSearch && matchesStatus && matchesPriority && matchesType && matchesAssignee;
    });
  }, [tasks, search, filterStatus, filterPriority, activeTab, filterAssignee]);

  const handleAddTask = () => {
    if (!newTask.title) return;

    const task: LocalTask = {
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

  const stats = useMemo(() => {
    const todo = tasks.filter((t) => t.status === "TODO").length;
    const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length;
    const done = tasks.filter((t) => t.status === "DONE").length;
    const overdue = tasks.filter((t) => isOverdue(t)).length;
    return { todo, inProgress, done, overdue };
  }, [tasks]);

  const uniqueAssignees = useMemo(() => {
    const assignees = new Set(tasks.map((t) => t.assignee).filter(Boolean));
    return Array.from(assignees) as string[];
  }, [tasks]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">ניהול משימות</h1>
          <p className="text-muted-foreground mt-1">משימות אישיות, צוות ומשימות מהסוכן</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2 text-base">
              <Plus className="h-5 w-5" />
              משימה חדשה
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">הוספת משימה חדשה</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-base">כותרת</Label>
                <Input
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="כותרת המשימה"
                  className="text-base"
                />
              </div>
              <div>
                <Label className="text-base">תיאור</Label>
                <Textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="פרטי המשימה"
                  className="text-base"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-base">סוג</Label>
                  <Select
                    value={newTask.type}
                    onValueChange={(v) => setNewTask({ ...newTask, type: v as TaskType })}
                  >
                    <SelectTrigger className="text-base">
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
                  <Label className="text-base">עדיפות</Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(v) => setNewTask({ ...newTask, priority: v as TaskPriority })}
                  >
                    <SelectTrigger className="text-base">
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
                  <Label className="text-base">שיוך לעובד</Label>
                  <Select
                    value={newTask.assignee}
                    onValueChange={(v) => setNewTask({ ...newTask, assignee: v })}
                  >
                    <SelectTrigger className="text-base">
                      <SelectValue placeholder="בחר עובד" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.name}>
                          {emp.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div>
                <Label className="text-base">תאריך יעד</Label>
                <Input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="text-base"
                />
              </div>
              <Button onClick={handleAddTask} className="w-full text-base" size="lg">
                הוסף משימה
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="hover-scale">
          <CardContent className="p-5 text-center">
            <div className="text-4xl font-bold text-foreground">{stats.todo}</div>
            <div className="text-base text-muted-foreground mt-1">לביצוע</div>
          </CardContent>
        </Card>
        <Card className="hover-scale">
          <CardContent className="p-5 text-center">
            <div className="text-4xl font-bold text-primary">{stats.inProgress}</div>
            <div className="text-base text-muted-foreground mt-1">בטיפול</div>
          </CardContent>
        </Card>
        <Card className="hover-scale">
          <CardContent className="p-5 text-center">
            <div className="text-4xl font-bold text-green-600 dark:text-green-400">{stats.done}</div>
            <div className="text-base text-muted-foreground mt-1">הושלמו</div>
          </CardContent>
        </Card>
        <Card className={`hover-scale ${stats.overdue > 0 ? "border-destructive" : ""}`}>
          <CardContent className="p-5 text-center">
            <div className="text-4xl font-bold text-destructive">{stats.overdue}</div>
            <div className="text-base text-muted-foreground mt-1">באיחור</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="חיפוש משימות..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-10 text-base"
              />
            </div>
            <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as TaskStatus | "ALL")}>
              <SelectTrigger className="w-[150px] text-base">
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
              <SelectTrigger className="w-[150px] text-base">
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
            <Select value={filterAssignee} onValueChange={setFilterAssignee}>
              <SelectTrigger className="w-[150px] text-base">
                <SelectValue placeholder="עובד אחראי" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">כל העובדים</SelectItem>
                {uniqueAssignees.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TaskType | "ALL")}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ALL" className="text-base">הכל ({tasks.length})</TabsTrigger>
          <TabsTrigger value="PERSONAL" className="gap-2 text-base">
            <User className="h-4 w-4" />
            אישי ({tasks.filter((t) => t.type === "PERSONAL").length})
          </TabsTrigger>
          <TabsTrigger value="TEAM" className="gap-2 text-base">
            <Users className="h-4 w-4" />
            צוות ({tasks.filter((t) => t.type === "TEAM").length})
          </TabsTrigger>
          <TabsTrigger value="AGENT" className="gap-2 text-base">
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
                    <TableHead className="text-right text-base">משימה</TableHead>
                    <TableHead className="text-right text-base">סוג</TableHead>
                    <TableHead className="text-right text-base">אחראי</TableHead>
                    <TableHead className="text-right text-base">עדיפות</TableHead>
                    <TableHead className="text-right text-base">סטטוס</TableHead>
                    <TableHead className="text-right text-base">תאריך יעד</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-base">
                        לא נמצאו משימות
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTasks.map((task) => (
                      <TableRow 
                        key={task.id} 
                        className={`${task.status === "DONE" ? "opacity-60" : ""} ${isOverdue(task) ? "bg-destructive/5" : ""}`}
                      >
                        <TableCell>
                          <Checkbox
                            checked={task.status === "DONE"}
                            onCheckedChange={() => toggleTaskStatus(task.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className={`font-medium text-base ${task.status === "DONE" ? "line-through" : ""}`}>
                              {task.title}
                              {isOverdue(task) && (
                                <AlertTriangle className="inline-block h-4 w-4 text-destructive mr-2" />
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">{task.description}</div>
                            {task.relatedTo && (
                              <div className="text-sm text-primary mt-1">{task.relatedTo}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-sm">
                            {typeLabels[task.type]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-base">{task.assignee || "-"}</TableCell>
                        <TableCell>
                          <Badge 
                            className={`text-sm ${
                              task.priority === "URGENT" 
                                ? "bg-destructive/20 text-destructive border-destructive" 
                                : task.priority === "HIGH"
                                  ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                                  : task.priority === "MEDIUM"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                    : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {priorityLabels[task.priority]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={`text-sm ${
                              task.status === "DONE" 
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : task.status === "IN_PROGRESS"
                                  ? "bg-primary/20 text-primary"
                                  : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {statusLabels[task.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={`text-base ${isOverdue(task) ? "text-destructive font-semibold" : ""}`}>
                            {task.dueDate 
                              ? new Date(task.dueDate).toLocaleDateString("he-IL") 
                              : "-"}
                          </span>
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
