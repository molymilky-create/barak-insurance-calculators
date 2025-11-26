import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Calculators from "./pages/Calculators";
import Clients from "./pages/Clients";
import ClientDetails from "./pages/ClientDetails";
import Renewals from "./pages/Renewals";
import Collections from "./pages/Collections";
import Certificates from "./pages/Certificates";
import Documents from "./pages/Documents";
import Regulations from "./pages/Regulations";
import Commissions from "./pages/Commissions";
import Employees from "./pages/Employees";
import Leads from "./pages/Leads";
import Tasks from "./pages/Tasks";
import Marketing from "./pages/Marketing";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "calculators", element: <Calculators /> },
      { path: "clients", element: <Clients /> },
      { path: "clients/:clientId", element: <ClientDetails /> },
      { path: "leads", element: <Leads /> },
      { path: "tasks", element: <Tasks /> },
      { path: "renewals", element: <Renewals /> },
      { path: "collections", element: <Collections /> },
      { path: "certificates", element: <Certificates /> },
      { path: "documents", element: <Documents /> },
      { path: "regulations", element: <Regulations /> },
      { path: "employees", element: <Employees /> },
      { path: "marketing", element: <Marketing /> },
      { path: "commissions", element: <Commissions /> },
    ],
  },
]);
