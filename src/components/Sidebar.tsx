import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "@/assets/barak-logo.png";

const navItemClasses = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition 
   ${isActive ? "bg-primary text-white" : "text-slate-700 hover:bg-blue-50"}`;

const Sidebar = () => {
  const { isAdmin } = useAuth();

  return (
    <aside className="w-64 bg-white border-l border-slate-200 flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="ברק ביטוחים"
            className="h-10 object-contain"
          />
        </div>
        <p className="mt-2 text-xs text-slate-500">
          מערכת ניהול ומחשבוני ביטוח – ברק ביטוחים
        </p>
      </div>
      <nav className="flex-1 p-3 space-y-1 text-right">
        <NavLink to="/" className={navItemClasses} end>
          🏠 דשבורד
        </NavLink>
        <NavLink to="/calculators" className={navItemClasses}>
          🧮 מחשבונים
        </NavLink>
        <NavLink to="/clients" className={navItemClasses}>
          👥 מבוטחים
        </NavLink>
        <NavLink to="/renewals" className={navItemClasses}>
          🔁 חידושים
        </NavLink>
        <NavLink to="/collections" className={navItemClasses}>
          💳 גבייה
        </NavLink>
        <NavLink to="/certificates" className={navItemClasses}>
          📄 אישורי קיום ביטוח
        </NavLink>
        <NavLink to="/documents" className={navItemClasses}>
          📂 מסמכים
        </NavLink>
        <NavLink to="/regulations" className={navItemClasses}>
          ⚖️ חוקים וחוזרים
        </NavLink>
        {isAdmin && (
          <NavLink to="/commissions" className={navItemClasses}>
            📈 עמלות ודוחות
          </NavLink>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
