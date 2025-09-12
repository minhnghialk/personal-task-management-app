import "./styles/tailwind.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RegisterPage } from "./auth/RegisterPage";
import { LoginPage } from "./auth/LoginPage";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Đăng ký */}
          <Route path="/register" element={<RegisterPage />} />

          {/* Đăng nhập */}
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
