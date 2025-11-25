import { useAuth } from "../context/AuthContext";

const Topbar = () => {
  const { user, loginAsAdmin, loginAsUser, logout, isAdmin } = useAuth();

  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4">
      <div className="text-sm text-muted-foreground">
        שלום, <span className="font-semibold">{user?.name}</span>{" "}
        {isAdmin ? "(מנהל)" : "(עובד)"}
      </div>
      <div className="flex items-center gap-2 text-xs">
        <button
          onClick={loginAsAdmin}
          className="px-2 py-1 rounded border border-border hover:bg-muted"
        >
          כנס כמנהל
        </button>
        <button
          onClick={loginAsUser}
          className="px-2 py-1 rounded border border-border hover:bg-muted"
        >
          כנס כעובד
        </button>
        <button
          onClick={logout}
          className="px-2 py-1 rounded border border-destructive text-destructive hover:bg-destructive/10"
        >
          התנתק
        </button>
      </div>
    </header>
  );
};

export default Topbar;
