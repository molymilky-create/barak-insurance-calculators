import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navClasses = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
    isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
  }`;

const Sidebar = () => {
  const { isAdmin } = useAuth();

  return (
    <aside className="w-64 bg-card border-l border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <img
            src="https://barak-korb.co.il/wp-content/uploads/2024/01/logo.png"
            alt="ברק ביטוחים"
            className="h-10 object-contain"
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">מערכת ניהול ומחשבוני ביטוח - ברק ביטוחים</p>
      </div>

      <nav className="flex-1 p-3 space-y-1 text-right">
        <NavLink to="/" className={navClasses} end>
          🏠 דשבורד
        </NavLink>

        <NavLink to="/calculators" className={navClasses}>
          🧮 מחשבונים
        </NavLink>

        <NavLink to="/clients" className={navClasses}>
          👥 מבוטחים
        </NavLink>

        <NavLink to="/leads" className={navClasses}>
          📋 לידים
        </NavLink>

        <NavLink to="/renewals" className={navClasses}>
          🔁 חידושים
        </NavLink>

        <NavLink to="/collections" className={navClasses}>
          💳 גבייה
        </NavLink>

        <NavLink to="/certificates" className={navClasses}>
          📄 אישורי קיום
        </NavLink>

        <NavLink to="/documents" className={navClasses}>
          📂 מסמכים
        </NavLink>

        <NavLink to="/regulations" className={navClasses}>
          ⚖️ חוקים וחוזרים
        </NavLink>

        {isAdmin && (
          <NavLink to="/commissions" className={navClasses}>
            📈 עמלות ודוחות
          </NavLink>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
