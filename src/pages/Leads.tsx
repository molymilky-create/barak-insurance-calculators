import { useState } from "react";
import { useData } from "../context/DataContext";
import { LeadStatus } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const statusLabels: Record<LeadStatus, string> = {
  NEW: "חדש",
  CONTACTED: "יצרנו קשר",
  QUOTED: "נשלח הצעת מחיר",
  WON: "סגור (הצלחה)",
  LOST: "אבד",
};

const statusColors: Record<LeadStatus, string> = {
  NEW: "bg-primary text-primary-foreground",
  CONTACTED: "bg-secondary text-secondary-foreground",
  QUOTED: "bg-accent text-accent-foreground",
  WON: "bg-green-600 text-white",
  LOST: "bg-destructive text-destructive-foreground",
};

const Leads = () => {
  const { leads, addLead, updateLeadStatus } = useData();
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // New lead form state
  const [newLead, setNewLead] = useState({
    name: "",
    phone: "",
    email: "",
    source: "",
    notes: "",
    estimatedAnnualPremium: "",
    nextActionDate: "",
    nextActionNotes: "",
    lastChannel: "PHONE" as const,
  });

  const filtered = leads.filter((lead) => {
    if (statusFilter !== "ALL" && lead.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        lead.name.toLowerCase().includes(q) ||
        (lead.phone || "").toLowerCase().includes(q) ||
        (lead.email || "").toLowerCase().includes(q) ||
        (lead.source || "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleAddLead = () => {
    if (!newLead.name) {
      alert("חובה להזין שם ליד");
      return;
    }

    addLead({
      name: newLead.name,
      phone: newLead.phone || undefined,
      email: newLead.email || undefined,
      source: newLead.source || undefined,
      notes: newLead.notes || undefined,
      estimatedAnnualPremium: newLead.estimatedAnnualPremium
        ? Number(newLead.estimatedAnnualPremium)
        : undefined,
      nextActionDate: newLead.nextActionDate || undefined,
      nextActionNotes: newLead.nextActionNotes || undefined,
      lastChannel: newLead.lastChannel,
    });

    setNewLead({
      name: "",
      phone: "",
      email: "",
      source: "",
      notes: "",
      estimatedAnnualPremium: "",
      nextActionDate: "",
      nextActionNotes: "",
      lastChannel: "PHONE",
    });
    setIsAddDialogOpen(false);
  };

  const statusCount = (status: LeadStatus) =>
    leads.filter((l) => l.status === status).length;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">לידים</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>+ הוסף ליד חדש</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>הוסף ליד חדש</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">שם מלא *</Label>
                <Input
                  id="name"
                  value={newLead.name}
                  onChange={(e) =>
                    setNewLead({ ...newLead, name: e.target.value })
                  }
                  placeholder="שם הליד"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">טלפון</Label>
                  <Input
                    id="phone"
                    value={newLead.phone}
                    onChange={(e) =>
                      setNewLead({ ...newLead, phone: e.target.value })
                    }
                    placeholder="050-1234567"
                  />
                </div>
                <div>
                  <Label htmlFor="email">מייל</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newLead.email}
                    onChange={(e) =>
                      setNewLead({ ...newLead, email: e.target.value })
                    }
                    placeholder="example@email.com"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="source">מקור</Label>
                <Input
                  id="source"
                  value={newLead.source}
                  onChange={(e) =>
                    setNewLead({ ...newLead, source: e.target.value })
                  }
                  placeholder="פייסבוק, הפניה, אתר..."
                />
              </div>
              <div>
                <Label htmlFor="estimatedPremium">פרמיה משוערת (₪)</Label>
                <Input
                  id="estimatedPremium"
                  type="number"
                  value={newLead.estimatedAnnualPremium}
                  onChange={(e) =>
                    setNewLead({
                      ...newLead,
                      estimatedAnnualPremium: e.target.value,
                    })
                  }
                  placeholder="10000"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nextActionDate">תאריך פעולה הבאה</Label>
                  <Input
                    id="nextActionDate"
                    type="date"
                    value={newLead.nextActionDate}
                    onChange={(e) =>
                      setNewLead({ ...newLead, nextActionDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="channel">אמצעי תקשורת</Label>
                  <Select
                    value={newLead.lastChannel}
                    onValueChange={(value: any) =>
                      setNewLead({ ...newLead, lastChannel: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PHONE">טלפון</SelectItem>
                      <SelectItem value="WHATSAPP">וואטסאפ</SelectItem>
                      <SelectItem value="EMAIL">מייל</SelectItem>
                      <SelectItem value="SMS">SMS</SelectItem>
                      <SelectItem value="MEETING">פגישה</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="nextActionNotes">פרטי פעולה הבאה</Label>
                <Textarea
                  id="nextActionNotes"
                  value={newLead.nextActionNotes}
                  onChange={(e) =>
                    setNewLead({ ...newLead, nextActionNotes: e.target.value })
                  }
                  placeholder="מה צריך לעשות בפעולה הבאה..."
                />
              </div>
              <div>
                <Label htmlFor="notes">הערות כלליות</Label>
                <Textarea
                  id="notes"
                  value={newLead.notes}
                  onChange={(e) =>
                    setNewLead({ ...newLead, notes: e.target.value })
                  }
                  placeholder="הערות נוספות..."
                />
              </div>
              <Button onClick={handleAddLead} className="w-full">
                הוסף ליד
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {(["NEW", "CONTACTED", "QUOTED", "WON", "LOST"] as LeadStatus[]).map(
          (status) => (
            <button
              key={status}
              onClick={() =>
                setStatusFilter(statusFilter === status ? "ALL" : status)
              }
              className={`p-3 rounded-xl border transition ${
                statusFilter === status
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:bg-muted"
              }`}
            >
              <div className="text-xs text-muted-foreground">
                {statusLabels[status]}
              </div>
              <div className="text-2xl font-bold">{statusCount(status)}</div>
            </button>
          )
        )}
      </div>

      {/* Filters */}
      <div className="bg-card rounded-2xl shadow p-4 space-y-3">
        <div className="flex gap-3">
          <Input
            placeholder="חפש לפי שם, טלפון, מייל, מקור..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button
            variant={statusFilter === "ALL" ? "default" : "outline"}
            onClick={() => setStatusFilter("ALL")}
          >
            הכל ({leads.length})
          </Button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-card rounded-2xl shadow p-4 overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-2">שם</th>
              <th className="py-2 px-2">טלפון</th>
              <th className="py-2 px-2">מקור</th>
              <th className="py-2 px-2">סטטוס</th>
              <th className="py-2 px-2">פרמיה משוערת</th>
              <th className="py-2 px-2">פעולה הבאה</th>
              <th className="py-2 px-2">הערות</th>
              <th className="py-2 px-2">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead) => (
              <tr key={lead.id} className="border-b last:border-0 hover:bg-muted/50">
                <td className="py-3 px-2 font-medium">{lead.name}</td>
                <td className="py-3 px-2">{lead.phone || "-"}</td>
                <td className="py-3 px-2 text-xs text-muted-foreground">
                  {lead.source || "-"}
                </td>
                <td className="py-3 px-2">
                  <Select
                    value={lead.status}
                    onValueChange={(value: LeadStatus) =>
                      updateLeadStatus(lead.id, value)
                    }
                  >
                    <SelectTrigger className="w-[140px] h-8">
                      <Badge className={statusColors[lead.status]}>
                        {statusLabels[lead.status]}
                      </Badge>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="py-3 px-2">
                  {lead.estimatedAnnualPremium
                    ? `${lead.estimatedAnnualPremium.toLocaleString("he-IL")} ₪`
                    : "-"}
                </td>
                <td className="py-3 px-2 text-xs">
                  {lead.nextActionDate ? (
                    <div>
                      <div className="font-medium">{lead.nextActionDate}</div>
                      {lead.nextActionNotes && (
                        <div className="text-muted-foreground truncate max-w-[200px]">
                          {lead.nextActionNotes}
                        </div>
                      )}
                    </div>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="py-3 px-2 text-xs text-muted-foreground max-w-[200px] truncate">
                  {lead.notes || "-"}
                </td>
                <td className="py-3 px-2">
                  <Button variant="ghost" size="sm">
                    פרטים →
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            לא נמצאו לידים
          </div>
        )}
      </div>
    </div>
  );
};

export default Leads;
