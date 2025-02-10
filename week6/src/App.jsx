import { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route, Navigate } from "react-router";
import ProductBackOffice from "./pages/ProductBackOffice";
import Login from "./pages/Login";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AuthWrapper from "./components/auth/AuthWrapper";
import Shop from "./pages/Shop";

const { VITE_API_BASE: API_BASE } = import.meta.env;

function App() {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    async function checkLogin() {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("authToken="))
          ?.split("=")[1];
        if (token === undefined) return;
        axios.defaults.headers.common.Authorization = token;
        const {
          data: { success },
        } = await axios.post(`${API_BASE}/api/user/check`);
        setIsLogin(success);
      } catch (err) {
        console.error(err);
      }
    }
    checkLogin();
  }, []);

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <AuthWrapper isAuth={isLogin} to={"/product-back-office"}>
            <Login setIsLogin={setIsLogin} />
          </AuthWrapper>
        }
      />
      <Route
        path="/product-back-office"
        element={
          <ProtectedRoute isAuth={isLogin}>
            <ProductBackOffice setIsLogin={setIsLogin} />
          </ProtectedRoute>
        }
      />
      <Route path="/shop" element={<Shop />} />
      <Route path="*" element={<Navigate to="/shop" />} />
    </Routes>
  );
}

export default App;
