
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import { HelmetProvider } from 'react-helmet-async';
import { CalculatorProvider } from './context/CalculatorContext';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import ROIAnalysis from './pages/ROIAnalysis';
import BreakEvenAnalysis from './pages/BreakEvenAnalysis';
import Contact from './pages/Contact';
import Manual from './pages/Manual';
import AdminLogin from './pages/AdminLogin';
import Admin from './pages/Admin';
import KlinikOptimeringComingSoon from './pages/KlinikOptimeringComingSoon';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <HelmetProvider>
      <CalculatorProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/calculator" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/roi-analysis" element={<ROIAnalysis />} />
            <Route path="/break-even" element={<BreakEvenAnalysis />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/manual" element={<Manual />} />
            <Route path="/admin-login" element={<AdminLogin />} />
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
      </CalculatorProvider>
    </HelmetProvider>
  );
}

export default App;
