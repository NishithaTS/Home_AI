import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { Plus, ArrowRight, Sparkles, Check, Clock, Calendar } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { projects, selectProject, formatPrice } = useProject();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E1E1E] py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#EAE6DF] gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#7A756D]">
              <span>HOMIE.AI STUDIO</span>
              <span>·</span>
              <span>PROJECT PORTFOLIO</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1E1E1E] mt-1">
              Your Architectural Spaces
            </h1>
            <p className="text-xs text-[#57534E] mt-0.5">
              Manage saved room configurations, budget allocations, and approved shopping checklists.
            </p>
          </div>

          <Link
            to="/projects/new"
            className="px-4 py-2.5 text-xs font-mono uppercase tracking-wider bg-[#1E1E1E] text-white hover:bg-[#333333] transition-colors flex items-center gap-2 shadow-sm self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Room</span>
          </Link>
        </div>

        {/* PROJECTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const activeVersion =
              project.versions[project.activeVersionIndex] || project.versions[0];
            const itemCount = project.selectedProductIds.length;

            return (
              <div
                key={project.id}
                onClick={() => {
                  selectProject(project.id);
                  navigate(`/projects/${project.id}`);
                }}
                className="bg-white border border-[#DFD9CE] hover:border-[#1E1E1E] transition-all cursor-pointer flex flex-col justify-between group shadow-xs"
              >
                <div>
                  {/* Room Render / Photograph */}
                  <div className="aspect-[16/10] bg-[#EAE6DF] overflow-hidden relative border-b border-[#EAE6DF]">
                    <img
                      src={activeVersion?.renderedImage || project.roomImage}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-black/80 text-white backdrop-blur-sm">
                        {project.style}
                      </span>
                      {project.isApproved && (
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-[#8B9B88] text-white font-semibold">
                          Approved
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-2.5 right-2.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-white/90 text-[#1E1E1E] backdrop-blur-sm font-semibold">
                        v{activeVersion?.versionNumber || 1}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-serif font-bold text-base text-[#1E1E1E] group-hover:text-[#8B9B88] transition-colors leading-snug">
                      {project.title}
                    </h3>
                    <p className="text-xs text-[#57534E] line-clamp-2 leading-relaxed">
                      {project.designInstructions || activeVersion?.summary}
                    </p>

                    <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-[#7A756D]">
                      <span>{project.roomType.replace('_', ' ')}</span>
                      <span>·</span>
                      <span>{project.dimensions.width}x{project.dimensions.length} {project.dimensions.unit}</span>
                      <span>·</span>
                      <span>{itemCount} furnishings</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-3 border-t border-[#EAE6DF] bg-[#FAF8F5] flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-[#7A756D] uppercase block">Allocated Budget</span>
                    <span className="font-bold text-[#1E1E1E]">{formatPrice(project.budget)}</span>
                  </div>

                  <div className="text-right flex items-center gap-1 font-medium text-[#1E1E1E] group-hover:translate-x-1 transition-transform">
                    <span>Open Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}

          {/* New Room Project Card */}
          <Link
            to="/projects/new"
            className="border-2 border-dashed border-[#DFD9CE] hover:border-[#1E1E1E] bg-[#FAF8F5] p-8 flex flex-col items-center justify-center text-center space-y-3 transition-colors group"
          >
            <div className="w-12 h-12 rounded-full bg-white border border-[#DFD9CE] flex items-center justify-center text-[#1E1E1E] group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <p className="font-serif font-semibold text-sm text-[#1E1E1E]">Add Another Space</p>
              <p className="text-xs text-[#7A756D] mt-0.5">Upload a bedroom, home office, or patio photo.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
