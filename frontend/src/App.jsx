import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ToastProvider } from './components/Toast';
import { AnalysisProvider } from './hooks/useAnalysis';

import Landing from './pages/Landing';
import Analyze from './pages/Analyze';
import Dashboard from './pages/Dashboard';
import Compare from './pages/Compare';
import About from './pages/About';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <ToastProvider>
      <AnalysisProvider>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main id="main-content" className="flex-1">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/analyze" element={<Analyze />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AnalysisProvider>
    </ToastProvider>
  );
}
