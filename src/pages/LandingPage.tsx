import React from 'react';
import { Link } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { Sparkles, ArrowRight, Check, Compass, Sliders, ShieldCheck, Coffee } from 'lucide-react';
import { STUDIO_LOCATIONS } from '../data/locations';

export const LandingPage: React.FC = () => {
  const { projects, formatPrice } = useProject();
  const sampleProject = projects[0];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E1E1E]">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 px-4 sm:px-8 border-b border-[#EAE6DF] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Top Kicker */}
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#7A756D] mb-4">
            <span>HOMIE.AI STUDIO</span>
            <span aria-hidden="true">·</span>
            <span>AI SPATIAL ARCHITECTURE & PROCUREMENT</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            {/* Left Headline & Action */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium tracking-tight text-[#1E1E1E] leading-[1.08] text-balance">
                  Architectural room design, tailored to your budget.
                </h1>
                <p className="mt-6 text-base sm:text-lg text-[#57534E] leading-relaxed max-w-xl">
                  Upload a photograph of your existing room. Our vision AI maps spatial dimensions, harmonizes colors, and styles real furniture from authorized retailers with instant live budget tracking.
                </p>
              </div>

              {/* Metrics strip */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#EAE6DF]">
                <div>
                  <p className="text-2xl sm:text-3xl font-serif font-bold text-[#1E1E1E]">100%</p>
                  <p className="text-xs text-[#7A756D] font-mono mt-0.5">Real Retailer Items</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-serif font-bold text-[#1E1E1E]">₹0</p>
                  <p className="text-xs text-[#7A756D] font-mono mt-0.5">Hidden Markups</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-serif font-bold text-[#8B9B88]">Live</p>
                  <p className="text-xs text-[#7A756D] font-mono mt-0.5">Budget Balance</p>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/projects/new"
                  className="px-6 py-3.5 text-sm font-medium bg-[#1E1E1E] text-[#FAF8F5] hover:bg-[#333333] transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap"
                >
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>Analyze Your Room</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  to="/onboarding"
                  className="px-6 py-3.5 text-sm font-medium bg-[#F2EDE4] text-[#1E1E1E] hover:bg-[#EAE4D9] border border-[#DFD9CE] transition-colors whitespace-nowrap"
                >
                  Style Calibration Quiz
                </Link>
              </div>
            </div>

            {/* Right Interactive Before/After Showcase */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <div className="shadow-xl border border-[#DFD9CE] bg-white p-2">
                <BeforeAfterSlider
                  beforeImage="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
                  afterImage="/src/assets/images/hero_scandinavian_interior_1791952558825.jpg"
                  beforeLabel="Empty Space"
                  afterLabel="Curated Scandinavian"
                />
                <div className="p-3 bg-[#FAF8F5] border-t border-[#EAE6DF] flex items-center justify-between text-xs text-[#7A756D] font-mono">
                  <span>Interactive Split View: Slide left/right</span>
                  <span className="text-[#1E1E1E] font-medium">Concept Alpha · Warm Travertine</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THREE PILLAR ARCHITECTURE */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-mono uppercase tracking-widest text-[#7A756D] mb-2">THE METHODOLOGY</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-medium text-[#1E1E1E]">
            How Homie.AI transforms your living environment
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="p-8 bg-white border border-[#DFD9CE] flex flex-col justify-between space-y-6 hover:border-[#8B9B88] transition-colors">
            <div className="space-y-4">
              <div className="w-10 h-10 bg-[#F2EDE4] flex items-center justify-center text-[#1E1E1E]">
                <Compass className="w-5 h-5 text-[#8B9B88]" />
              </div>
              <h3 className="text-lg font-serif font-semibold text-[#1E1E1E]">1. Vision Room Analysis</h3>
              <p className="text-xs leading-relaxed text-[#57534E]">
                Our multimodal vision AI detects room geometry, natural window exposure, lighting vectors, and architectural details while respecting existing furniture you wish to preserve.
              </p>
            </div>
            <div className="pt-4 border-t border-[#EAE6DF] text-[11px] font-mono text-[#7A756D]">
              Architectural Elements · Daylight Vectors · Circulation
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-8 bg-white border border-[#DFD9CE] flex flex-col justify-between space-y-6 hover:border-[#8B9B88] transition-colors">
            <div className="space-y-4">
              <div className="w-10 h-10 bg-[#F2EDE4] flex items-center justify-center text-[#1E1E1E]">
                <Sliders className="w-5 h-5 text-[#C47B5A]" />
              </div>
              <h3 className="text-lg font-serif font-semibold text-[#1E1E1E]">2. Live Conversational Studio</h3>
              <p className="text-xs leading-relaxed text-[#57534E]">
                Fine-tune wall pigments, lighting temperature, and layout configurations. Talk naturally to the AI Copilot to modify elements like &ldquo;Change walls to sage green&rdquo; or &ldquo;Show a Japandi version&rdquo;.
              </p>
            </div>
            <div className="pt-4 border-t border-[#EAE6DF] text-[11px] font-mono text-[#7A756D]">
              Version History · Undo/Redo · Dynamic Re-rendering
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-8 bg-white border border-[#DFD9CE] flex flex-col justify-between space-y-6 hover:border-[#8B9B88] transition-colors">
            <div className="space-y-4">
              <div className="w-10 h-10 bg-[#F2EDE4] flex items-center justify-center text-[#1E1E1E]">
                <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <h3 className="text-lg font-serif font-semibold text-[#1E1E1E]">3. Verified Catalog & Budget</h3>
              <p className="text-xs leading-relaxed text-[#57534E]">
                Every item is matched with authenticated retailer links, real prices, and delivery costs. Use our &ldquo;Find Cheaper Alternatives&rdquo; engine to guarantee your room stays strictly within budget.
              </p>
            </div>
            <div className="pt-4 border-t border-[#EAE6DF] text-[11px] font-mono text-[#7A756D]">
              Real Dimensions · Instant Swap · Shopping Checklist
            </div>
          </div>
        </div>
      </section>

      {/* SAMPLE PROJECTS SHOWCASE */}
      <section className="py-16 bg-[#F2EDE4] border-y border-[#DFD9CE] px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-[#7A756D] mb-1">CURATED SPACES</p>
              <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1E1E1E]">
                Explore Real Interactive Room Projects
              </h2>
            </div>
            <Link
              to="/dashboard"
              className="text-xs font-mono font-medium text-[#1E1E1E] hover:underline flex items-center gap-1.5"
            >
              <span>View All Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.slice(0, 3).map((proj) => (
              <Link
                key={proj.id}
                to={`/projects/${proj.id}`}
                className="group bg-[#FAF8F5] border border-[#DFD9CE] overflow-hidden hover:border-[#1E1E1E] transition-all flex flex-col"
              >
                <div className="aspect-[4/3] overflow-hidden relative bg-[#EAE6DF]">
                  <img
                    src={proj.versions[0]?.renderedImage || proj.roomImage}
                    alt={proj.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-[#1E1E1E]/80 text-white backdrop-blur-sm">
                      {proj.style}
                    </span>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif font-semibold text-sm text-[#1E1E1E] group-hover:text-[#8B9B88] transition-colors">
                      {proj.title}
                    </h4>
                    <p className="text-xs text-[#57534E] line-clamp-2 mt-1">
                      {proj.designInstructions || proj.versions[0]?.summary}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#EAE6DF] flex items-center justify-between text-xs font-mono">
                    <span className="text-[#7A756D]">Budget: {formatPrice(proj.budget)}</span>
                    <span className="text-[#1E1E1E] font-medium flex items-center gap-1">
                      <span>Open Studio</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* DELTA CAFES INSPIRED DESIGN ATELIER & COFFEE LOUNGE SECTION */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#7A756D]">
              <Coffee className="w-4 h-4 text-[#BA7053]" />
              <span>THE TACTILE ATELIER EXPERIENCE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-medium text-[#1E1E1E] leading-tight">
              Where coffee culture meets tactile spatial design.
            </h2>
            <p className="text-sm text-[#57534E] leading-relaxed">
              Inspired by Delta Cafés heritage of European hospitality and sensorial discovery, visit our flagship design lounges in Lisbon, London, Bengaluru, and New York. Touch authentic travertine stone slabs, feel bouclé fabric weights, and sample artisanal roasts with resident architects.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-white border border-[#DFD9CE]">
                <p className="text-xs font-mono uppercase text-[#7A756D]">Tactile Archive</p>
                <p className="font-serif font-semibold text-sm text-[#1E1E1E] mt-1">400+ Swatches</p>
                <p className="text-[11px] text-[#57534E] mt-0.5">Wood finishes, bouclé, linen, and honed marble.</p>
              </div>
              <div className="p-4 bg-white border border-[#DFD9CE]">
                <p className="text-xs font-mono uppercase text-[#7A756D]">Consultation</p>
                <p className="font-serif font-semibold text-sm text-[#1E1E1E] mt-1">1-on-1 Spatial Review</p>
                <p className="text-[11px] text-[#57534E] mt-0.5">Finalize checklist & delivery schedule over single-origin roast.</p>
              </div>
            </div>
            <div>
              <Link
                to="/settings"
                className="inline-flex items-center gap-2 text-xs font-mono font-medium px-4 py-2.5 bg-[#F2EDE4] hover:bg-[#EAE4D9] border border-[#DFD9CE] text-[#1E1E1E] transition-colors"
              >
                <span>Explore Studio Locations & Tasting Lounges</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img
                src={STUDIO_LOCATIONS[0].image}
                alt={STUDIO_LOCATIONS[0].name}
                referrerPolicy="no-referrer"
                className="w-full aspect-[4/5] object-cover border border-[#DFD9CE]"
              />
              <div className="p-2 text-xs">
                <p className="font-semibold text-[#1E1E1E]">{STUDIO_LOCATIONS[0].city}</p>
                <p className="text-[11px] text-[#7A756D]">{STUDIO_LOCATIONS[0].highlight}</p>
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <img
                src={STUDIO_LOCATIONS[1].image}
                alt={STUDIO_LOCATIONS[1].name}
                referrerPolicy="no-referrer"
                className="w-full aspect-[4/5] object-cover border border-[#DFD9CE]"
              />
              <div className="p-2 text-xs">
                <p className="font-semibold text-[#1E1E1E]">{STUDIO_LOCATIONS[1].city}</p>
                <p className="text-[11px] text-[#7A756D]">{STUDIO_LOCATIONS[1].highlight}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-20 bg-[#1E1E1E] text-[#FAF8F5] px-4 sm:px-8 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-serif font-medium tracking-tight">
            Ready to reimagine your living space?
          </h2>
          <p className="text-sm text-white/70 leading-relaxed">
            Upload your room photograph now. Get personalized spatial concepts, verified furniture choices, and live budget balances in seconds.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              to="/projects/new"
              className="px-6 py-3 text-xs font-mono uppercase tracking-wider bg-[#FAF8F5] text-[#1E1E1E] hover:bg-white transition-colors"
            >
              Start Room Project
            </Link>
            <Link
              to="/dashboard"
              className="px-6 py-3 text-xs font-mono uppercase tracking-wider bg-transparent border border-white/20 text-[#FAF8F5] hover:bg-white/10 transition-colors"
            >
              Open Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
