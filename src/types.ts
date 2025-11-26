export type Role = "admin" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

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
  startDate: string; // ISO yyyy-mm-dd
  endDate: string;
  annualPremium: number;
  notes?: string;
}

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
  expectedRenewalDate: string;
  previousPremium?: number;
  expectedPremium?: number;
  status: RenewalStatus;
  notes?: string;
}

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
  dueDate: string;
  notes?: string;
}

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
  createdAt: string;
  createdByUserId: string;
}

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

export interface Regulation {
  id: string;
  title: string;
  description?: string;
  year?: number;
  domainTags: string[];
  fileUrl: string;
}

// עובדים וימי חופש
export interface Employee {
  id: string;
  name: string;
  email: string;
  role: Role;
  position?: string;
  hireDate?: string;
  managerId?: string;
}

export type TimeOffStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface EmployeeTimeOff {
  id: string;
  employeeId: string;
  from: string;
  to: string;
  status: TimeOffStatus;
  reason?: string;
  createdAt: string;
}

// CRM / שיווק

export type LeadStatus = "NEW" | "CONTACTED" | "QUOTED" | "WON" | "LOST";

export type Channel = "PHONE" | "WHATSAPP" | "EMAIL" | "SMS" | "MEETING";

export interface Lead {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  source?: string; // מקור הליד: פייסבוק, הפניה, אתר, באפי...
  notes?: string;
  status: LeadStatus;
  estimatedAnnualPremium?: number;
  createdAt: string;
  nextActionDate?: string;
  nextActionNotes?: string;
  lastChannel?: Channel;
}

export interface Task {
  id: string;
  title: string;
  relatedClientId?: string;
  relatedPolicyId?: string;
  relatedLeadId?: string;
  dueDate: string;
  completed: boolean;
  assigneeUserId: string;
  notes?: string;
  channel?: Channel;
  kind?: "RENEWAL" | "COLLECTION" | "LEAD" | "OTHER";
}

export type CampaignChannel = "EMAIL" | "WHATSAPP" | "SMS";

export interface CampaignTemplate {
  id: string;
  name: string;
  channel: CampaignChannel;
  description?: string;
  subject?: string;
  body: string;
  targetTag?: string; // לדוגמה: "חווה", "סוסים פרטיים", "מאמנים"
}
