import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Landing from "@/pages/Landing";
import Audit from "@/pages/Audit";
import Admin from "@/pages/Admin";
import DeepAudit from "@/pages/DeepAudit";
import Privacy from "@/pages/Privacy";

function App() {
  return (
    <div className="App grain">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/audit" element={<Audit />} />
          <Route path="/deep-audit" element={<DeepAudit />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
