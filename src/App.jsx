
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AboutUs from "./pages/AboutUs";

import { ComputerProvider } from "./context/ComputerContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Computers from "./pages/Computers";

import "./styles/global.css";

export default function App() {
  return (
    <ComputerProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/computers" element={<Computers />} />
            <Route
              path="/about"
              element={<AboutUs />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ComputerProvider>
  );
}
