
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import { HelmetProvider } from 'react-helmet-async';
import Index from './pages/Index';
import Contact from './pages/Contact';
import Manual from './pages/Manual';
import DealerRevenue from './pages/DealerRevenue';
import AdminLogin from './pages/AdminLogin';
import Admin from './pages/Admin';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/manual" element={<Manual />} />
          <Route path="/dealer-revenue" element={<DealerRevenue />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <Admin />
              </AdminProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </HelmetProvider>
  );
}

export default App;
