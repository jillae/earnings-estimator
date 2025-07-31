
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import { HelmetProvider } from 'react-helmet-async';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import GrowthForecast from './pages/GrowthForecast';
import BreakEvenAnalysisWithProvider from './pages/BreakEvenAnalysisWithProvider';
import ROIAnalysisWithProvider from './pages/ROIAnalysisWithProvider';
import Contact from './pages/Contact';
import Manual from './pages/Manual';
import AdminLogin from './pages/AdminLogin';
import KlinikOptimeringComingSoon from './pages/KlinikOptimeringComingSoon';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import { CalculatorProvider } from './context/CalculatorContext';

import './App.css';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/calculator" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/growth-forecast" element={
            <CalculatorProvider>
              <GrowthForecast />
            </CalculatorProvider>
          } />
          <Route path="/roi-analysis" element={<ROIAnalysisWithProvider />} />
          <Route path="/break-even" element={<BreakEvenAnalysisWithProvider />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/manual" element={<Manual />} />
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <Admin />
              </AdminProtectedRoute>
            }
          />
          <Route path="/klinik-optimering-coming-soon" element={<KlinikOptimeringComingSoon />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </HelmetProvider>
  );
}

export default App;