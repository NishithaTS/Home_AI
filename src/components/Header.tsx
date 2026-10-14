import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { Plus, ChevronDown, Check, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  const { projects, activeProject, selectProject, currency, setCurrency, formatPrice, totalCost, isOverBudget } = useProject();
  const location = useLocation();
  const navigate = useNavigate();
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);

  const currentProjectId = activeProject?.id || 'proj-scandinavian-sanctuary';

  const navLinks = [
    { label: 'Studio', path: `/projects/${currentProjectId}` },
    { label: 'Catalog', path: `/projects/${currentProjectId}/shop` },
    { label: 'Budget', path: `/projects/${currentProjectId}/budget` },
    { label: 'Shortlist', path: `/projects/${currentProjectId}/shortlist` },
    { label: 'Showrooms', path: '/settings' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#EAE6DF] px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Single text element Brand mark */}
        <div className="flex items-center gap-4 shrink-0">
          <Link
            to="/"
            className="text-xl sm:text-2xl font-bold tracking-tight text-[#1E1E1E] whitespace-nowrap shrink-0 flex items-center gap-1.5 font-serif"
          >
            <span>HOMIE</span>
            <span className="text-xs px-1.5 py-0.5 font-mono font-medium tracking-normal bg-[#1E1E1E] text-[#FAF8F5]">
              AI
            </span>
          </Link>

          {/* Active project selector pill */}
          {activeProject && (
            <div className="relative hidden lg:block">
              <button
                onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
                className="flex items-center gap-2 text-xs font-medium text-[#4A4742] bg-[#F2EDE4] hover:bg-[#EAE4D9] px-3 py-1.5 border border-[#DFD9CE] transition-colors whitespace-nowrap"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B9B88]" />
                <span className="truncate max-w-[140px]">{activeProject.title}</span>
                <ChevronDown className="w-3 h-3 text-[#7A756D]" />
              </button>

              {projectDropdownOpen && (
                <div
                  className="absolute left-0 mt-1.5 w-64 bg-[#FAF8F5] border border-[#DFD9CE] shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-3 py-1.5 text-[11px] font-mono uppercase text-[#7A756D] border-b border-[#EAE6DF]">
                    Your Room Projects
                  </div>
                  {projects.map((proj) => (
                    <button
                      key={proj.id}
                      onClick={() => {
                        selectProject(proj.id);
                        setProjectDropdownOpen(false);
                        navigate(`/projects/${proj.id}`);
                      }}
                      className="w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#F2EDE4] transition-colors text-[#1E1E1E]"
                    >
                      <div className="truncate mr-2">
                        <p className="font-medium truncate">{proj.title}</p>
                        <p className="text-[10px] text-[#7A756D]">{proj.style} · {proj.roomType.replace('_', ' ')}</p>
                      </div>
                      {proj.id === activeProject.id && (
                        <Check className="w-3.5 h-3.5 text-[#8B9B88] shrink-0" />
                      )}
                    </button>
                  ))}
                  <div className="border-t border-[#EAE6DF] mt-1 pt-1 px-2">
                    <button
                      onClick={() => {
                        setProjectDropdownOpen(false);
                        navigate('/projects/new');
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-[#1E1E1E] bg-[#EAE4D9] hover:bg-[#DFD9CE] transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      New Room Project
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Zone 2: 4-5 clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-[#57534E]">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#1E1E1E] ${
                  isActive
                    ? 'text-[#1E1E1E] font-semibold border-b-2 border-[#1E1E1E] pb-0.5'
                    : ''
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action + currency & quick budget overview */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick budget chip */}
          {activeProject && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#57534E] font-mono tabular-nums bg-[#F2EDE4] px-2.5 py-1 border border-[#DFD9CE]">
              <span className="text-[10px] text-[#7A756D] uppercase">Est:</span>
              <span className={`font-semibold ${isOverBudget ? 'text-[#C47B5A]' : 'text-[#1E1E1E]'}`}>
                {formatPrice(totalCost)}
              </span>
            </div>
          )}

          {/* Currency Toggle */}
          <button
            onClick={() => setCurrency(currency === 'INR' ? 'USD' : 'INR')}
            className="text-xs font-mono font-medium px-2 py-1 text-[#57534E] hover:text-[#1E1E1E] hover:bg-[#EAE4D9] transition-colors border border-[#DFD9CE]"
            title="Toggle Currency"
          >
            {currency === 'INR' ? '₹ INR' : '$ USD'}
          </button>

          {/* Primary Action Button */}
          <Link
            to="/projects/new"
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs font-medium text-[#FAF8F5] bg-[#1E1E1E] hover:bg-[#333333] transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Analyze Room</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
