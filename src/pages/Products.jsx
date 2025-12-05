
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load products (GET)
  const loadProducts = async () => {
    try {
      const res = await api.get("/products/");
      setProducts(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load products");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Clear form
  const clearForm = () => {
    setName("");
    setPrice("");
    setEditing(null);
  };

  // Add / Update Product
  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { name, price: Number(price) };

      if (editing) {
        await api.put(`/products/${editing}/`, payload);
      } else {
        await api.post("/products/", payload);
      }

      await loadProducts();
      clearForm();
    } catch (err) {
      console.log(err.response?.data);
      alert(JSON.stringify(err.response?.data) || "Error occurred while saving product");
    } finally {
      setLoading(false);
    }
  };

  // Edit product
  const handleEdit = (p) => {
    setEditing(p.id);
    setName(p.name);
    setPrice(String(p.price)); // ensure price goes as string into input
    window.scrollTo(0, 0);
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await api.delete(`/products/${id}/`);
    loadProducts();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Products</h1>

      {/* Form */}
      <form onSubmit={handleAddOrUpdate} className="mb-6 space-y-3">
        <input
          type="text"
          placeholder="Product name"
          className="border p-2 w-full rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Price"
          className="border p-2 w-full rounded"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? "Saving..." : editing ? "Update Product" : "Add Product"}
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

      {/* Product Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">#</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center p-3">
                No products found
              </td>
            </tr>
          )}

          {products.map((p, index) => (
            <tr key={p.id}>
              <td className="border p-2 text-center">{index + 1}</td>
              <td className="border p-2">{p.name}</td>
              <td className="border p-2">₹ {p.price}</td>
              <td className="border p-2 text-center space-x-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="bg-yellow-500 text-white py-1 px-3 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="bg-red-600 text-white py-1 px-3 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
