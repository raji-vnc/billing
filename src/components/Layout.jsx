import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  BarChart2, Package, Users, FileText, PlusSquare, LogOut, Menu
} from "lucide-react";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  const menu = [
    { name: "Dashboard", icon: <BarChart2 size={20} />, path: "/dashboard" },
    { name: "Products", icon: <Package size={20} />, path: "/products" },
    { name: "Customers", icon: <Users size={20} />, path: "/customers" },
    { name: "Invoices", icon: <FileText size={20} />, path: "/invoices" },
    { name: "Create Invoice", icon: <PlusSquare size={20} />, path: "/invoice/create" },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={`bg-gray-900 text-white transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        } flex flex-col relative`}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-4 bg-gray-800 text-white p-1 rounded-full shadow"
        >
          <Menu size={18} />
        </button>

        <h2 className={`text-2xl font-semibold text-center py-5 border-b border-gray-700 ${collapsed && "hidden"}`}>
          Billing System
        </h2>

        <nav className="flex-1 px-3 space-y-2 mt-6">
          {menu.map((m) => {
            const active = location.pathname === m.path;
            return (
              <Link
                key={m.path}
                to={m.path}
                className={`flex items-center gap-3 p-3 rounded transition 
                  ${active ? "bg-blue-600" : "hover:bg-gray-700"}
                `}
              >
                {m.icon}
                {!collapsed && <span>{m.name}</span>}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={logout}
          className="flex items-center gap-3 bg-red-600 hover:bg-red-500 p-3 mx-3 mb-5 rounded"
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </aside>

      {/* Page Area */}
      <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
        {children}
      </main>
    </div>
  );
}

