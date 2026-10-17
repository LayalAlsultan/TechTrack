
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ComputerProvider } from "./context/ComputerContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Computers from "./pages/Computers";
import "./styles/global.css";

function Placeholder({ title }) {
  return (
    <div className="page-header">
      <h1>{title}</h1>
      <p className="subtitle">
        This page will be implemented
      </p>
    </div>
  );
}

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
              element={<Placeholder title="About Us" />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ComputerProvider>
  );
}
