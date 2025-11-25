import React, { createContext, useContext, useState } from "react";
import type { User } from "../types";

interface AuthContextValue {
  user: User | null;
  loginAsAdmin: () => void;
  loginAsUser: () => void;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const mockAdmin: User = {
  id: "1",
  name: "מנהל",
  email: "admin@barak-korb.co.il",
  role: "admin",
};

const mockUser: User = {
  id: "2",
  name: "עובד",
  email: "user@barak-korb.co.il",
  role: "user",
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(mockAdmin);

  const loginAsAdmin = () => setUser(mockAdmin);
  const loginAsUser = () => setUser(mockUser);
  const logout = () => setUser(null);

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{ user, loginAsAdmin, loginAsUser, logout, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
