import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line
} from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState({
    customers: 0,
    products: 0,
    invoices: 0,
    monthlySales: [],
  });

  const loadStats = async () => {
    try {
      const c = await api.get("/customers/");
      const p = await api.get("/products/");
      const inv = await api.get("/invoices/");

      // Group invoice totals by month
      const monthlyData = {};
      inv.data.forEach((i) => {
        const month = new Date(i.date).toLocaleString("default", { month: "short" });
        monthlyData[month] = (monthlyData[month] || 0) + Number(i.total);
      });

      const monthlySales = Object.keys(monthlyData).map((m) => ({
        month: m,
        total: monthlyData[m],
      }));

      setStats({
        customers: c.data.length,
        products: p.data.length,
        invoices: inv.data.length,
        monthlySales,
      });
    } catch (err) {
      console.log(err);
      alert("Failed to load dashboard data");
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-600 text-white p-5 rounded shadow">
          <h2 className="text-lg">Customers</h2>
          <p className="text-3xl font-bold">{stats.customers}</p>
        </div>

        <div className="bg-green-600 text-white p-5 rounded shadow">
          <h2 className="text-lg">Products</h2>
          <p className="text-3xl font-bold">{stats.products}</p>
        </div>

        <div className="bg-purple-600 text-white p-5 rounded shadow">
          <h2 className="text-lg">Invoices</h2>
          <p className="text-3xl font-bold">{stats.invoices}</p>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="bg-white p-5 shadow rounded">
        <h2 className="text-xl font-semibold mb-3">Monthly Sales</h2>
        <BarChart width={650} height={300} data={stats.monthlySales}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#8884d8" />
        </BarChart>
      </div>
    </div>
  );
}
