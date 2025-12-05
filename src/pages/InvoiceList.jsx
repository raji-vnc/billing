import { useEffect,useState } from "react";
import api from "../api/axios";

export default function InvoiceList(){
    const [invoices,setInvoices]=useState([]);
    const loadInvoices=async()=>{
        try{
            const res=await api.get("/invoices/");
            setInvoices(res.data);
        }
        catch(err){
            console.log(err);
            alert("failed to load invoices");
        }
    };

    useEffect(()=>{
        loadInvoices();
    },[]);
const downloadPdf = async (id) => {
    try {
        const res = await api.get(`/invoices/${id}/pdf/`, { responseType: "blob" });
        const pdfUrl = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.setAttribute("download", `invoice_${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (err) {
        console.log("PDF ERROR:", err);
        alert("PDF download failed");
    }
};

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Invoice List</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">#</th>
            <th className="border p-2">Customer</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Total</th>
            <th className="border p-2 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {invoices.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center p-3">
                No invoices found
              </td>
            </tr>
          ) : (
            invoices.map((inv, i) => (
              <tr key={inv.id}>
                <td className="border p-2 text-center">{i + 1}</td>
                <td className="border p-2">{inv.customer_detail?.name}</td>
                <td className="border p-2">{inv.date}</td>
                <td className="border p-2">{inv.status}</td>
                <td className="border p-2">₹ {inv.total}</td>
                <td className="border p-2 text-center">
                  <button
                    className="bg-blue-600 text-white py-1 px-3 rounded"
                    onClick={() =>downloadPdf(inv.id)}
                  >
                    Download PDF
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