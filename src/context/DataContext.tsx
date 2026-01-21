import React, { createContext, useContext, useState } from "react";
import {
  Client,
  Policy,
  Renewal,
  Collection,
  Certificate,
  DocumentMeta,
  Regulation,
  CommissionAgreement,
  CommissionEntry,
  Employee,
  EmployeeTimeOff,
  Lead,
  Task,
  LeadStatus,
  TaskStatus,
} from "../types";

interface DataContextValue {
  clients: Client[];
  policies: Policy[];
  renewals: Renewal[];
  collections: Collection[];
  certificates: Certificate[];
  documents: DocumentMeta[];
  regulations: Regulation[];
  commissionAgreements: CommissionAgreement[];
  commissions: CommissionEntry[];
  employees: Employee[];
  timeOffRequests: EmployeeTimeOff[];

  leads: Lead[];
  tasks: Task[];

  addCertificate: (c: Omit<Certificate, "id" | "createdAt">) => void;
  addTimeOffRequest: (t: Omit<EmployeeTimeOff, "id" | "createdAt">) => void;

  addLead: (input: Omit<Lead, "id" | "createdAt" | "status">) => void;
  updateLeadStatus: (id: string, status: LeadStatus) => void;

  addTask: (t: Omit<Task, "id" | "createdAt" | "createdByUserId">) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [clients] = useState<Client[]>([
    {
      id: "c1",
      name: "ישראל ישראלי",
      idNumber: "123456789",
      businessName: 'חוות לדוגמה בע"מ',
      companyNumber: "515555555",
      businessAddress: "רח' החווה 1, מושב לדוגמה",
      phone: "050-0000000",
      email: "farm@example.com",
    },
  ]);

  const [policies] = useState<Policy[]>([
    {
      id: "p1",
      clientId: "c1",
      companyId: "MENORA",
      productType: "FARM",
      policyNumber: "MN-123456",
      startDate: "2025-01-01",
      endDate: "2025-12-31",
      annualPremium: 10000,
      notes: "חוות סוסים - פוליסת עסק",
    },
  ]);

  const [renewals] = useState<Renewal[]>([
    {
      id: "r1",
      policyId: "p1",
      clientId: "c1",
      assignedToUserId: "u2",
      expectedRenewalDate: "2025-12-01",
      previousPremium: 9000,
      expectedPremium: 10000,
      status: "NEW",
    },
  ]);

  const [collections] = useState<Collection[]>([
    {
      id: "col1",
      policyId: "p1",
      clientId: "c1",
      amountToCollect: 10000,
      status: "NEW",
      assignedToUserId: "u2",
      dueDate: "2025-02-10",
    },
  ]);

  const [certificates, setCertificates] = useState<Certificate[]>([]);

  const [documents] = useState<DocumentMeta[]>([
    {
      id: "d1",
      title: "ג'קט פוליסת עסק - מנורה",
      companyId: "MENORA",
      productTypes: ["FARM"],
      source: "COMPANY",
      kind: "JACKET",
      fileUrl: "/docs/menora/business-jacket.pdf",
    },
    {
      id: "d2",
      title: "כללי בטיחות בחווה",
      source: "AGENCY",
      kind: "SAFETY",
      productTypes: ["FARM", "HORSE"],
      fileUrl: "/docs/agency/farm-safety.pdf",
    },
  ]);

  const [regulations] = useState<Regulation[]>([
    {
      id: "reg1",
      title: "הנחיות ביטוח חוות סוסים",
      domainTags: ["סוסים", "חוות", "אחריות"],
      fileUrl: "/docs/regulations/farm.pdf",
    },
  ]);

  const [commissionAgreements] = useState<CommissionAgreement[]>([
    {
      id: "ca1",
      companyId: "MENORA",
      productType: "FARM",
      description: "חוות סוסים - מנורה",
      ratePercent: 15,
      baseType: "NET",
    },
  ]);

  const [commissions] = useState<CommissionEntry[]>([
    {
      id: "ce1",
      policyId: "p1",
      clientId: "c1",
      companyId: "MENORA",
      productType: "FARM",
      grossPremium: 10000,
      netPremium: 9500,
      finalCommission: 1425,
    },
  ]);

  const [employees] = useState<Employee[]>([
    {
      id: "u1",
      name: "מנהל",
      email: "admin@barak-korb.co.il",
      role: "admin",
      position: "מנהל סוכנות",
      hireDate: "2010-01-01",
    },
    {
      id: "u2",
      name: "עובד",
      email: "user@barak-korb.co.il",
      role: "user",
      position: "מטפל חידושים",
      hireDate: "2022-05-10",
      managerId: "u1",
    },
  ]);

  const [timeOffRequests, setTimeOffRequests] = useState<EmployeeTimeOff[]>([
    {
      id: "to1",
      employeeId: "u2",
      from: "2025-03-01",
      to: "2025-03-05",
      status: "APPROVED",
      reason: "חופשה משפחתית",
      createdAt: "2025-01-15",
    },
  ]);

  const [leads, setLeads] = useState<Lead[]>([
    {
      id: "lead1",
      name: "אורן חוות השדה",
      phone: "052-1111111",
      email: "oren@example.com",
      source: "פייסבוק - קמפיין חוות",
      status: "CONTACTED",
      estimatedAnnualPremium: 15000,
      createdAt: "2025-01-20",
      nextActionDate: "2025-01-25",
      nextActionNotes: "לחזור עם הצעת מחיר מנורה + הכשרה",
      lastChannel: "WHATSAPP",
      assignedToUserId: "u2",
      notes: "רוצה כיסוי לטיולים וקייטנות בקיץ",
    },
    {
      id: "lead2",
      name: "הילה - סוס פרטי",
      phone: "054-2222222",
      source: "הפניה מרוכב קיים",
      status: "NEW",
      createdAt: "2025-01-22",
      lastChannel: "PHONE",
      assignedToUserId: "u2",
      notes: "סוס אחד, ערך משוער 60,000, גם צד ג' וגם חיים",
    },
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "task1",
      title: "לצלצל לאורן לגבי חידוש + הרחבת קייטנות",
      description: "להדגיש כיסוי צד ג' בטיולים",
      kind: "LEAD",
      status: "OPEN",
      priority: "NORMAL",
      assignedToUserId: "u2",
      createdByUserId: "u1",
      createdAt: "2025-01-15",
      dueDate: "2025-01-25",
      relatedClientName: "אורן חוות השדה",
    },
    {
      id: "task2",
      title: "לשלוח תזכורת חידוש לחוות לדוגמה",
      description: "תזכורת במייל + בקשה לעדכון פעילות",
      kind: "RENEWAL",
      status: "IN_PROGRESS",
      priority: "HIGH",
      assignedToUserId: "u2",
      createdByUserId: "u1",
      createdAt: "2025-10-15",
      dueDate: "2025-11-20",
      relatedClientName: "ישראל ישראלי",
      requiresManagerReview: true,
    },
  ]);

  const addCertificate = (c: Omit<Certificate, "id" | "createdAt">) => {
    const id = `cert_${Date.now()}`;
    const createdAt = new Date().toISOString();
    setCertificates((prev) => [...prev, { ...c, id, createdAt }]);
  };

  const addTimeOffRequest = (
    t: Omit<EmployeeTimeOff, "id" | "createdAt">
  ) => {
    const id = `to_${Date.now()}`;
    const createdAt = new Date().toISOString();
    setTimeOffRequests((prev) => [...prev, { ...t, id, createdAt }]);
  };

  const addLead = (input: Omit<Lead, "id" | "createdAt" | "status">) => {
    const id = `lead_${Date.now()}`;
    const createdAt = new Date().toISOString().slice(0, 10);
    setLeads((prev) => [
      {
        ...input,
        id,
        createdAt,
        status: "NEW",
      },
      ...prev,
    ]);
  };

  const updateLeadStatus = (id: string, status: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status } : l))
    );
  };

  const addTask = (t: Omit<Task, "id" | "createdAt" | "createdByUserId">) => {
    const id = `task_${Date.now()}`;
    const createdAt = new Date().toISOString().slice(0, 10);
    setTasks((prev) => [
      ...prev,
      {
        ...t,
        id,
        createdAt,
        createdByUserId: "u1",
      },
    ]);
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, status } : task))
    );
  };

  return (
    <DataContext.Provider
      value={{
        clients,
        policies,
        renewals,
        collections,
        certificates,
        documents,
        regulations,
        commissionAgreements,
        commissions,
        employees,
        timeOffRequests,
        leads,
        tasks,
        addCertificate,
        addTimeOffRequest,
        addLead,
        updateLeadStatus,
        addTask,
        updateTaskStatus,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used inside DataProvider");
  return ctx;
};
