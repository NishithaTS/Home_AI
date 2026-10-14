import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProjectProvider } from './context/ProjectContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { NewProjectPage } from './pages/NewProjectPage';
import { StudioPage } from './pages/StudioPage';
import { ShopPage } from './pages/ShopPage';
import { BudgetPage } from './pages/BudgetPage';
import { ShortlistPage } from './pages/ShortlistPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  return (
    <ProjectProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1E1E1E]">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/projects/new" element={<NewProjectPage />} />
              <Route path="/projects/:projectId" element={<StudioPage />} />
              <Route path="/projects/:projectId/shop" element={<ShopPage />} />
              <Route path="/projects/:projectId/budget" element={<BudgetPage />} />
              <Route path="/projects/:projectId/shortlist" element={<ShortlistPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <ToastContainer />
        </div>
      </BrowserRouter>
    </ProjectProvider>
  );
}
