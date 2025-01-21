import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NavBar from "./components/Navbar";
import RegisterPage from "./pages/RegisterPage";
import AuthProvider from "./context/Auth/AuthProvider";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoutes";
import CartProvider from "./context/cart/cartProvider";
import CartPage from "./pages/cartPage";
import ProductManagement from "./pages/addProduct";
import AdminDashboard from "./pages/AdminDashboard";
import SupplierDashboard from "./pages/supplierDashboard";
function App() {
  return (
    <AuthProvider>
      <CartProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute/>}>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/products" element={<ProductManagement />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/supplier" element={<SupplierDashboard />} />
          
          </Route>
        </Routes>
      </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
