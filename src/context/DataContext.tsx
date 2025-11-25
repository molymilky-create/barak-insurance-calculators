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
  addCertificate: (c: Omit<Certificate, "id" | "createdAt">) => void;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [clients] = useState<Client[]>([
    {
      id: "c1",
      name: "חוות לדוגמה",
      idNumber: "515555555",
      businessName: 'חוות לדוגמה בע"מ',
      companyNumber: "515555555",
      businessAddress: "רח' החווה 1, מושב כלשהו",
      phone: "050-0000000",
      email: "example@farm.co.il",
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
      notes: "חווה לדוגמה",
    },
  ]);

  const [renewals] = useState<Renewal[]>([
    {
      id: "r1",
      policyId: "p1",
      clientId: "c1",
      assignedToUserId: "2",
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
      assignedToUserId: "2",
      dueDate: "2025-02-10",
    },
  ]);

  const [certificates, setCertificates] = useState<Certificate[]>([]);

  const [documents] = useState<DocumentMeta[]>([
    {
      id: "d1",
      title: "ג'קט פוליסה עסק - מנורה",
      companyId: "MENORA",
      productTypes: ["FARM"],
      source: "COMPANY",
      kind: "JACKET",
      fileUrl: "/docs/menora-business-jacket.pdf",
      description: "ג'קט פוליסת עסק מנורה",
    },
    {
      id: "d2",
      title: "כללי בטיחות בחווה",
      source: "AGENCY",
      kind: "SAFETY",
      productTypes: ["FARM", "HORSE"],
      fileUrl: "/docs/farm-safety.pdf",
      description: "מסמך סוכנות",
    },
  ]);

  const [regulations] = useState<Regulation[]>([
    {
      id: "reg1",
      title: "הנחיות ביטוח חוות סוסים",
      domainTags: ["סוסים", "חוות", "אחריות"],
      fileUrl: "/docs/regulations-farm.pdf",
    },
  ]);

  const [commissionAgreements] = useState<CommissionAgreement[]>([
    {
      id: "ca1",
      companyId: "MENORA",
      productType: "FARM",
      description: "עסק חוות - מנורה",
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

  const addCertificate = (c: Omit<Certificate, "id" | "createdAt">) => {
    const id = `cert_${Date.now()}`;
    const createdAt = new Date().toISOString();
    setCertificates((prev) => [...prev, { ...c, id, createdAt }]);
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
        addCertificate,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
};
