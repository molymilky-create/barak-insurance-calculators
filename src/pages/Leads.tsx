import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { Plus, Search, Users, TrendingUp, Clock, Trophy, XCircle } from "lucide-react";
import { useData } from "../context/DataContext";
import type { LeadStatus } from "../types";

const statusLabels: Record<LeadStatus, string> = {
  NEW: "חדש",
  CONTACTED: "נוצר קשר",
  QUOTED: "נשלחה הצעה",
  WON: "נסגר",
  LOST: "אבד",
};

const statusColors: Record<LeadStatus, string> = {
  NEW: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  CONTACTED: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  QUOTED: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  WON: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  LOST: "bg-muted text-muted-foreground",
};

const Leads = () => {
  const { leads, addLead, updateLeadStatus, employees } = useData();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<LeadStatus | "ALL">("ALL");
  const [filterAgent, setFilterAgent] = useState<string>("ALL");
  const [dialogOpen, setDialogOpen] = useState(false);

  const [newLead, setNewLead] = useState({
    name: "",
    phone: "",
    email: "",
    source: "",
    notes: "",
    estimatedPremium: "",
  });

  const handleAdd = () => {
    if (!newLead.name.trim()) return;
    
    addLead({
      name: newLead.name.trim(),
      phone: newLead.phone.trim() || undefined,
      email: newLead.email.trim() || undefined,
      source: newLead.source.trim() || undefined,
      notes: newLead.notes.trim() || undefined,
      estimatedAnnualPremium: newLead.estimatedPremium ? Number(newLead.estimatedPremium) : undefined,
      nextActionDate: undefined,
      nextActionNotes: undefined,
      lastChannel: undefined,
    });
    
    setNewLead({
      name: "",
      phone: "",
      email: "",
      source: "",
      notes: "",
      estimatedPremium: "",
    });
    setDialogOpen(false);
  };

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.name.includes(search) ||
        lead.phone?.includes(search) ||
        lead.email?.includes(search) ||
        lead.source?.includes(search);
      const matchesStatus = filterStatus === "ALL" || lead.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [leads, search, filterStatus]);

  const stats = useMemo(() => {
    return {
      total: leads.length,
      new: leads.filter((l) => l.status === "NEW").length,
      contacted: leads.filter((l) => l.status === "CONTACTED").length,
      quoted: leads.filter((l) => l.status === "QUOTED").length,
      won: leads.filter((l) => l.status === "WON").length,
      lost: leads.filter((l) => l.status === "LOST").length,
    };
  }, [leads]);

  const estimatedValue = useMemo(() => {
    return leads
      .filter((l) => l.status !== "LOST")
      .reduce((sum, l) => sum + (l.estimatedAnnualPremium || 0), 0);
  }, [leads]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">לידים</h1>
          <p className="text-muted-foreground mt-1">ניהול לידים ומעקב אחר הזדמנויות מכירה</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2 text-base">
              <Plus className="h-5 w-5" />
              ליד חדש
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">הוספת ליד חדש</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-base">שם *</Label>
                <Input
                  value={newLead.name}
                  onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                  placeholder="שם הליד"
                  className="text-base"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-base">טלפון</Label>
                  <Input
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    placeholder="050-0000000"
                    className="text-base"
                  />
                </div>
                <div>
                  <Label className="text-base">מייל</Label>
                  <Input
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    placeholder="email@example.com"
                    className="text-base"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-base">מקור</Label>
                  <Input
                    value={newLead.source}
                    onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                    placeholder="פייסבוק, הפניה, אתר..."
                    className="text-base"
                  />
                </div>
                <div>
                  <Label className="text-base">פרמיה משוערת</Label>
                  <Input
                    type="number"
                    value={newLead.estimatedPremium}
                    onChange={(e) => setNewLead({ ...newLead, estimatedPremium: e.target.value })}
                    placeholder="₪"
                    className="text-base"
                  />
                </div>
              </div>
              <div>
                <Label className="text-base">הערות</Label>
                <Input
                  value={newLead.notes}
                  onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                  placeholder="פרטים נוספים..."
                  className="text-base"
                />
              </div>
              <Button onClick={handleAdd} className="w-full text-base" size="lg">
                הוסף ליד
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="hover-scale">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.new}</div>
            <div className="text-sm text-muted-foreground">חדשים</div>
          </CardContent>
        </Card>
        <Card className="hover-scale">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.contacted}</div>
            <div className="text-sm text-muted-foreground">נוצר קשר</div>
          </CardContent>
        </Card>
        <Card className="hover-scale">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.quoted}</div>
            <div className="text-sm text-muted-foreground">נשלחה הצעה</div>
          </CardContent>
        </Card>
        <Card className="hover-scale">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.won}</div>
            <div className="text-sm text-muted-foreground">נסגרו</div>
          </CardContent>
        </Card>
        <Card className="hover-scale">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <XCircle className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold text-muted-foreground">{stats.lost}</div>
            <div className="text-sm text-muted-foreground">אבודים</div>
          </CardContent>
        </Card>
      </div>

      {/* Estimated Value */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-medium text-muted-foreground">ערך פרמיה משוער (לידים פעילים)</p>
              <p className="text-3xl font-bold text-foreground mt-1">
                {estimatedValue.toLocaleString("he-IL")} ₪
              </p>
            </div>
            <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center">
              <TrendingUp className="h-7 w-7 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="חיפוש לפי שם, טלפון, מייל או מקור..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-10 text-base"
              />
            </div>
            <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as LeadStatus | "ALL")}>
              <SelectTrigger className="w-[160px] text-base">
                <SelectValue placeholder="סטטוס" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">כל הסטטוסים</SelectItem>
                <SelectItem value="NEW">חדש</SelectItem>
                <SelectItem value="CONTACTED">נוצר קשר</SelectItem>
                <SelectItem value="QUOTED">נשלחה הצעה</SelectItem>
                <SelectItem value="WON">נסגר</SelectItem>
                <SelectItem value="LOST">אבד</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right text-base">שם</TableHead>
                <TableHead className="text-right text-base">טלפון</TableHead>
                <TableHead className="text-right text-base">מייל</TableHead>
                <TableHead className="text-right text-base">מקור</TableHead>
                <TableHead className="text-right text-base">פרמיה משוערת</TableHead>
                <TableHead className="text-right text-base">סטטוס</TableHead>
                <TableHead className="text-right text-base">פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-base">
                    {leads.length === 0 ? "אין לידים במערכת. הוסף ליד חדש כדי להתחיל." : "לא נמצאו לידים התואמים לחיפוש"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-base text-foreground">{lead.name}</div>
                        {lead.notes && (
                          <div className="text-sm text-muted-foreground truncate max-w-[200px]">{lead.notes}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-base">{lead.phone || "-"}</TableCell>
                    <TableCell className="text-base">{lead.email || "-"}</TableCell>
                    <TableCell className="text-base">{lead.source || "-"}</TableCell>
                    <TableCell className="text-base">
                      {lead.estimatedAnnualPremium 
                        ? `${lead.estimatedAnnualPremium.toLocaleString("he-IL")} ₪` 
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-sm ${statusColors[lead.status]}`}>
                        {statusLabels[lead.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={lead.status}
                        onValueChange={(v) => updateLeadStatus(lead.id, v as LeadStatus)}
                      >
                        <SelectTrigger className="w-[130px] text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NEW">חדש</SelectItem>
                          <SelectItem value="CONTACTED">נוצר קשר</SelectItem>
                          <SelectItem value="QUOTED">נשלחה הצעה</SelectItem>
                          <SelectItem value="WON">נסגר</SelectItem>
                          <SelectItem value="LOST">אבד</SelectItem>
                        </SelectContent>
                      </Select>
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

export default Leads;
