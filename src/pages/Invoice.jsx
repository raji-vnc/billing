import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Invoice() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [customer, setCustomer] = useState("");
  const [items, setItems] = useState([]);
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Load customers + products
  const loadData = async () => {
    try {
      const c = await api.get("/customers/");
      const p = await api.get("/products/");
      setCustomers(c.data);
      setProducts(p.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Add item row
  const addItem = () => {
    setItems([...items, { product: "", price: 0, qty: 1 }]);
  };

  // Update item
  const updateItem = (index, key, value) => {
    const updated = [...items];
    updated[index][key] = value;

    if (key === "product") {
      const selected = products.find((p) => p.id == value);
      if (selected) {
        updated[index].price = Number(selected.price);
        updated[index].qty = 1;
      }
    }

    if (key === "qty") {
      updated[index].qty = Number(value);
    }

    setItems(updated);
  };

  // Remove item
  const removeItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  // Calculations
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const taxAmount = (subtotal * tax) / 100;
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal + taxAmount - discountAmount;

  // Save Invoice
  const handleSave = async () => {
    if (!customer || items.length === 0) {
      alert("Select customer and add at least 1 item");
      return;
    }

    setLoading(true);
    try {
      await api.post("/invoices/", {
        customer,
        items: items.map((i) => ({
          product: i.product,
          quantity: i.qty,
          unit_price: i.price,
        })),
        tax,
        discount,
      });

      alert("Invoice saved successfully!");

      setCustomer("");
      setItems([]);
      setTax(0);
      setDiscount(0);
    } catch (err) {
      console.log(err.response?.data);
      alert("Error saving invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Create Invoice</h1>

      {/* Customer Selection */}
      <label className="block mb-1">Select Customer</label>
      <select
        className="border p-2 rounded w-full mb-5"
        value={customer}
        onChange={(e) => setCustomer(e.target.value)}
      >
        <option value="">-- choose a customer --</option>
        {customers.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* Items */}
      <h2 className="text-lg font-medium mb-2">Items</h2>

      {items.map((item, index) => (
        <div key={index} className="flex gap-2 mb-3">
          {/* Product Select */}
          <select
            className="border p-2 rounded w-1/2"
            value={item.product}
            onChange={(e) => updateItem(index, "product", e.target.value)}
          >
            <option value="">Select product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Qty */}
          <input
            type="number"
            className="border p-2 rounded w-1/4"
            value={item.qty}
            min="1"
            onChange={(e) => updateItem(index, "qty", e.target.value)}
          />

          {/* Price * Qty */}
          <input
            type="text"
            className="border p-2 rounded w-1/4 bg-gray-100"
            value={item.price * item.qty}
            readOnly
          />

          {/* Remove */}
          <button
            onClick={() => removeItem(index)}
            className="bg-red-600 text-white px-3 rounded"
          >
            X
          </button>
        </div>
      ))}

      <button onClick={addItem} className="bg-blue-600 text-white px-4 py-2 rounded">
        + Add Item
      </button>

      {/* Summary */}
      <div className="mt-6 space-y-2">
        <p>Subtotal: ₹ {subtotal.toFixed(2)}</p>

        <div>
          <label>Tax (%)</label>
          <input
            type="number"
            className="border p-2 rounded w-full"
            value={tax}
            onChange={(e) => setTax(Number(e.target.value))}
          />
        </div>

        <div>
          <label>Discount (%)</label>
          <input
            type="number"
            className="border p-2 rounded w-full"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
          />
        </div>

        <h2 className="text-xl font-semibold mt-3">
          Grand Total: ₹ {total.toFixed(2)}
        </h2>
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="mt-6 bg-green-600 text-white px-6 py-2 rounded"
      >
        {loading ? "Saving..." : "Save Invoice"}
      </button>
    </div>
  );
}
