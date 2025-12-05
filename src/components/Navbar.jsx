import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between">
      <h2 className="text-xl font-semibold">Billing System</h2>
      <div className="space-x-6">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/products">Products</Link>
        <Link to="/customers">Customers</Link>
        <Link to="/invoices">Invoices</Link>
        <Link to="/invoice/create">Create Invoice</Link>
        <button
          onClick={logout}
          className="bg-red-500 px-3 py-1 rounded ml-4"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
