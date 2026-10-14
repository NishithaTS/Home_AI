import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#FAF8F5] border-t border-[#EAE6DF] mt-16 text-[#57534E] text-xs py-10 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 font-serif font-bold text-base text-[#1E1E1E]">
            <span>HOMIE</span>
            <span className="text-[10px] px-1 py-0.2 font-mono font-medium bg-[#1E1E1E] text-white">AI</span>
          </div>
          <p className="text-xs text-[#7A756D] max-w-sm">
            Intelligent spatial architecture, verified furniture shopping, and real-time project budgeting.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 font-medium text-[#4A4742]">
          <Link to="/" className="hover:text-[#1E1E1E] transition-colors">Home</Link>
          <Link to="/onboarding" className="hover:text-[#1E1E1E] transition-colors">Style Calibration</Link>
          <Link to="/projects/new" className="hover:text-[#1E1E1E] transition-colors">Analyze Room</Link>
          <Link to="/dashboard" className="hover:text-[#1E1E1E] transition-colors">Projects</Link>
          <Link to="/settings" className="hover:text-[#1E1E1E] transition-colors">Showrooms & Lounges</Link>
        </div>

        <div className="text-[11px] font-mono text-[#7A756D]">
          <span>© {new Date().getFullYear()} Homie.AI Spatial Architecture Ltd.</span>
        </div>
      </div>
    </footer>
  );
};
