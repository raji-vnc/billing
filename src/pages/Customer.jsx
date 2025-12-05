
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load customers
  const loadCustomers = async () => {
    try {
      const res = await api.get("/customers/");
      setCustomers(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load customers");
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const clearForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setEditing(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name,
      email: email || "",
      phone: phone.toString(),
      address: address || "",
    };

    try {
      if (editing !==null) {
        await api.put(`/customers/${editing}/`, payload);
      } else {
        await api.post("/customers/", payload);
      }
      await loadCustomers();
      clearForm();
    } catch (error) {
      console.log(error.response?.data);
      alert("Error saving customer");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (c) => {
    setEditing(c.id);
    setName(c.name);
    setEmail(c.email || "");
    setPhone(c.phone || "");
    setAddress(c.address || "");
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this Customer?")) return;
    await api.delete(`/customers/${id}/`);
    loadCustomers();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Customers</h1>

      {/* Add / Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
  <input
    type="text"
    placeholder="Customer name"
    className="border p-2 w-full rounded"
    value={name}
    onChange={(e) => setName(e.target.value)}
    required
  />

  <input
    type="email"
    placeholder="Email (optional)"
    className="border p-2 w-full rounded"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />

  <input
    type="text"
    placeholder="Phone (optional)"
    className="border p-2 w-full rounded"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
  />

  <textarea
    placeholder="Address (optional)"
    className="border p-2 w-full rounded"
    value={address}
    onChange={(e) => setAddress(e.target.value)}
  />

  <button
    type="submit"
    disabled={loading}
    className="bg-green-600 text-white py-2 px-4 rounded"
  >
    {loading ? "Saving..." : editing ? "Update Customer" : "Add Customer"}
  </button>

  {editing && (
    <button
      type="button"
      onClick={clearForm}
      className="ml-2 bg-gray-500 text-white py-2 px-4 rounded"
    >
      Cancel Edit
    </button>
  )}
</form>

      

      {/* Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">#</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Address</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {customers.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center p-3">
                No customers found
              </td>
            </tr>
          ) : (
            customers.map((c, i) => (
              <tr key={c.id}>
                <td className="border p-2 text-center">{i + 1}</td>
                <td className="border p-2">{c.name}</td>
                <td className="border p-2">{c.email || "-"}</td>
                <td className="border p-2">{c.phone || "-"}</td>
                <td className="border p-2">{c.address || "-"}</td>
                <td className="border p-2 text-center space-x-2">
                  <button
                    onClick={() => handleEdit(c)}
                    className="bg-yellow-500 text-white py-1 px-3 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="bg-red-600 text-white py-1 px-3 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
