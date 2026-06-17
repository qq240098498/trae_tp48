import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "@/pages/Home";
import BrandInfo from "@/pages/BrandInfo";
import Audience from "@/pages/Audience";
import Strategy from "@/pages/Strategy";
import Channels from "@/pages/Channels";
import KPI from "@/pages/KPI";
import Schedule from "@/pages/Schedule";
import Preview from "@/pages/Preview";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/new" element={<BrandInfo />} />
        <Route path="/project/:id/brand" element={<BrandInfo />} />
        <Route path="/project/:id/audience" element={<Audience />} />
        <Route path="/project/:id/strategy" element={<Strategy />} />
        <Route path="/project/:id/channels" element={<Channels />} />
        <Route path="/project/:id/kpi" element={<KPI />} />
        <Route path="/project/:id/schedule" element={<Schedule />} />
        <Route path="/project/:id/preview" element={<Preview />} />
        <Route path="/project/:id" element={<Navigate to="/project/:id/preview" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
