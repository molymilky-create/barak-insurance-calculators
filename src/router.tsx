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

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "calculators", element: <Calculators /> },
      { path: "clients", element: <Clients /> },
      { path: "clients/:clientId", element: <ClientDetails /> },
      { path: "renewals", element: <Renewals /> },
      { path: "collections", element: <Collections /> },
      { path: "certificates", element: <Certificates /> },
      { path: "documents", element: <Documents /> },
      { path: "regulations", element: <Regulations /> },
      { path: "commissions", element: <Commissions /> },
    ],
  },
]);
