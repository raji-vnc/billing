import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Products from "./pages/Products";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Customers from "./pages/Customer";
import Invoice from "./pages/Invoice";
import InvoiceList from "./pages/InvoiceList";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import Layout from "./components/Layout";
export default function App() {
  return (
    
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/products" element={<ProtectedRoute><Products/></ProtectedRoute>}></Route>
       <Route path="*" element={<Navigate to="/login"/>}></Route>
       <Route path="/customers" element={<ProtectedRoute><Customers/></ProtectedRoute>}></Route>
       <Route path="/invoices" element={<ProtectedRoute><Invoice/></ProtectedRoute>}></Route>
      <Route path="/invoicelist" element={<ProtectedRoute><InvoiceList /></ProtectedRoute>} />
<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Layout><Dashboard /></Layout>
    </ProtectedRoute>
  }
/>

<Route
  path="/products"
  element={
    <ProtectedRoute>
      <Layout><Products /></Layout>
    </ProtectedRoute>
  }
/>

<Route
  path="/customers"
  element={
    <ProtectedRoute>
      <Layout><Customers /></Layout>
    </ProtectedRoute>
  }
/>

<Route
  path="/invoices/"
  element={
    <ProtectedRoute>
      <Layout><InvoiceList /></Layout>
    </ProtectedRoute>
  }
/>

<Route
  path="/invoice/create"
  element={
    <ProtectedRoute>
      <Layout><Invoice /></Layout>
    </ProtectedRoute>
  }
/>

<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Navbar />
      <Dashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/products"
  element={
    <ProtectedRoute>
      <Navbar />
      <Products />
    </ProtectedRoute>
  }
/>

<Route
  path="/customers"
  element={
    <ProtectedRoute>
      <Navbar />
      <Customers />
    </ProtectedRoute>
  }
/>

<Route
  path="/invoices"
  element={
    <ProtectedRoute>
      <Navbar />
      <InvoiceList />
    </ProtectedRoute>
  }
/>

<Route
  path="/invoice/create"
  element={
    <ProtectedRoute>
      <Navbar />
      <Invoice />
    </ProtectedRoute>
  }
/>

      </Routes>
      </BrowserRouter>
  )
}
