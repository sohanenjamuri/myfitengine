// src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Diabetes from "./pages/disease/Diabetes";
import Kidney from "./pages/disease/Kidney";
import PCOS from "./pages/disease/PCOS";
import Hypertension from "./pages/disease/Hypertension";
import Cardiac from "./pages/disease/Cardiac";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/diabetes" element={<Diabetes />} />
        <Route path="/kidney" element={<Kidney />} />
        <Route path="/pcos" element={<PCOS />} />
        <Route path="/hypertension" element={<Hypertension />} />
        <Route path="/cardiac" element={<Cardiac />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
