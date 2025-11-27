// ===== משתמשים / הרשאות =====
export type Role = "admin" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

// ===== חברות ביטוח / מוצרים =====
export type CompanyCode = "MENORA" | "HACHSHARA" | "OTHER";

export interface Company {
  id: CompanyCode;
  name: string;
}

export type ProductType =
  | "HORSE"
  | "FARM"
  | "INSTRUCTOR"
  | "TRAINER"
  | "OTHER";

// ===== מבוטחים / פוליסות =====
export interface Client {
  id: string;
  name: string;
  idNumber: string; // ת"ז / ח"פ
  businessName?: string;
  companyNumber?: string;
  homeAddress?: string;
  businessAddress?: string;
  phone?: string;
  email?: string;
}

export interface Policy {
  id: string;
  clientId: string;
  companyId: CompanyCode;
  productType: ProductType;
  policyNumber: string;
  startDate: string; // yyyy-mm-dd
  endDate: string;
  annualPremium: number;
  notes?: string;
}

// ===== חידושים =====
export type RenewalStatus =
  | "NEW"
  | "IN_PROGRESS"
  | "QUOTED"
  | "WAITING_CLIENT"
  | "COMPLETED"
  | "CANCELLED";

export interface Renewal {
  id: string;
  policyId: string;
  clientId: string;
  assignedToUserId: string;
  expectedRenewalDate: string; // yyyy-mm-dd
  previousPremium?: number;
  expectedPremium?: number;
  status: RenewalStatus;
  notes?: string;
}

// ===== גבייה =====
export type CollectionStatus =
  | "NEW"
  | "REMINDER_SENT"
  | "PARTIAL"
  | "PAID"
  | "WRITTEN_OFF";

export interface Collection {
  id: string;
  policyId: string;
  clientId: string;
  amountToCollect: number;
  status: CollectionStatus;
  assignedToUserId: string;
  dueDate: string; // yyyy-mm-dd
  notes?: string;
}

// ===== עמלות =====
export interface CommissionAgreement {
  id: string;
  companyId: CompanyCode;
  productType: ProductType;
  description: string;
  ratePercent: number;
  baseType: "GROSS" | "NET";
}

export interface CommissionEntry {
  id: string;
  policyId: string;
  clientId: string;
  companyId: CompanyCode;
  productType: ProductType;
  grossPremium: number;
  netPremium: number;
  finalCommission: number;
}

// ===== אישורי קיום =====
export type CertificateMode = "NORMAL" | "REQUESTOR";

export interface Certificate {
  id: string;
  clientId: string;
  policyId?: string;
  mode: CertificateMode;
  requestorId?: string;
  requestorName: string;
  productType?: ProductType;
  codes: string[];
  freeText?: string;
  createdAt: string; // ISO
  createdByUserId: string;
}

// ===== מסמכים / ג'קטים =====
export type DocumentSource = "COMPANY" | "AGENCY";

export type DocumentKind =
  | "JACKET"
  | "POLICY_TERMS"
  | "PROPOSAL_FORM"
  | "CLAIM_FORM"
  | "SAFETY"
  | "CERT_FORM"
  | "OTHER";

export interface DocumentMeta {
  id: string;
  title: string;
  description?: string;
  companyId?: CompanyCode;
  productTypes?: ProductType[];
  source: DocumentSource;
  kind: DocumentKind;
  fileUrl: string;
}

// ===== חוקים / חוזרים =====
export interface Regulation {
  id: string;
  title: string;
  description?: string;
  year?: number;
  domainTags: string[];
  fileUrl: string;
}

// ===== עובדים וימי חופש =====
export interface Employee {
  id: string;
  name: string;
  email: string;
  role: Role;
  position?: string;
  hireDate?: string; // yyyy-mm-dd
  managerId?: string;
}

export type TimeOffStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface EmployeeTimeOff {
  id: string;
  employeeId: string;
  from: string; // yyyy-mm-dd
  to: string; // yyyy-mm-dd
  status: TimeOffStatus;
  reason?: string;
  createdAt: string; // ISO
}

// ===== לידים =====
export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "QUOTED"
  | "WON"
  | "LOST";

export interface Lead {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  source?: string;
  status: LeadStatus;
  estimatedAnnualPremium?: number;
  nextActionDate?: string; // yyyy-mm-dd
  nextActionNotes?: string;
  lastChannel?: "PHONE" | "EMAIL" | "WHATSAPP" | "IN_PERSON" | "OTHER";
  createdAt: string; // yyyy-mm-dd
  assignedToUserId?: string;
  notes?: string;
}

// ===== משימות =====
export type TaskKind =
  | "LEAD"
  | "RENEWAL"
  | "COLLECTION"
  | "CARRIER_REQUEST"
  | "CERTIFICATE"
  | "SERVICE"
  | "OTHER";

export type TaskStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "WAITING_CLIENT"
  | "WAITING_COMPANY"
  | "WAITING_MANAGER_REVIEW"
  | "DONE"
  | "CANCELLED";

export type TaskPriority = "LOW" | "NORMAL" | "HIGH" | "CRITICAL";

export interface Task {
  id: string;
  title: string;
  description?: string;

  kind: TaskKind;
  status: TaskStatus;
  priority: TaskPriority;

  assignedToUserId: string;
  createdByUserId: string;
  createdAt: string; // yyyy-mm-dd
  dueDate: string; // yyyy-mm-dd

  relatedClientName?: string;
  requiresManagerReview?: boolean;
  managerApprovedAt?: string; // yyyy-mm-dd
}
