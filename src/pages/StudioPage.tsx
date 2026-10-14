import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { AiAssistantDrawer } from '../components/AiAssistantDrawer';
import { CheaperAlternativesModal } from '../components/CheaperAlternativesModal';
import {
  Undo2,
  Redo2,
  History,
  Sparkles,
  Sliders,
  DollarSign,
  ShoppingBag,
  Layers,
  Info,
  ChevronDown,
  ArrowRight,
  TrendingDown,
  Check,
  Palette,
  Sun,
  Layout,
  Tag,
} from 'lucide-react';
import { InteriorStyle, LightingMood, DecorDensity, Product } from '../types';

export const StudioPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const {
    projects,
    activeProject,
    activeRevision,
    selectProject,
    switchVersion,
    undoVersion,
    redoVersion,
    canUndo,
    canRedo,
    generateRevision,
    isAiProcessing,
    processingStage,
    formatPrice,
    totalCost,
    remainingBudget,
    isOverBudget,
    selectedProducts,
    findCheaperAlternativesForHighest,
    approveDesign,
  } = useProject();

  // Active Tab on Mobile / Sidebar
  const [activeTab, setActiveTab] = useState<'controls' | 'copilot' | 'products' | 'analysis'>('controls');

  // Live Controls local state synced to activeRevision
  const [style, setStyle] = useState<InteriorStyle>(activeProject?.style || 'Scandinavian');
  const [wallColor, setWallColor] = useState<string>(activeRevision?.wallColor || '#F5F3EF');
  const [lightingMood, setLightingMood] = useState<LightingMood>(activeRevision?.lightingMood || 'Warm Ambient (2700K)');
  const [decorDensity, setDecorDensity] = useState<DecorDensity>(activeRevision?.decorDensity || 'Balanced');
  const [layoutStrategy, setLayoutStrategy] = useState<string>(activeRevision?.layoutStrategy || 'Central Social Island');

  // Cheaper Alternatives Modal
  const [alternativesModalOpen, setAlternativesModalOpen] = useState(false);
  const [cheaperAlternativesData, setCheaperAlternativesData] = useState<{ original: Product; alternatives: Product[] } | null>(null);

  // Selected Product for quick inspect
  const [inspectedProduct, setInspectedProduct] = useState<Product | null>(null);

  // Ensure current project is active in context
  useEffect(() => {
    if (projectId && (!activeProject || activeProject.id !== projectId)) {
      selectProject(projectId);
    }
  }, [projectId, activeProject, selectProject]);

  // Sync controls whenever active revision changes
  useEffect(() => {
    if (activeRevision) {
      setWallColor(activeRevision.wallColor);
      setLightingMood(activeRevision.lightingMood);
      setDecorDensity(activeRevision.decorDensity);
      setLayoutStrategy(activeRevision.layoutStrategy);
    }
    if (activeProject) {
      setStyle(activeProject.style);
    }
  }, [activeRevision, activeProject]);

  // Check if live controls have unsaved rendering changes
  const hasUnrenderedChanges =
    activeRevision &&
    (wallColor !== activeRevision.wallColor ||
      lightingMood !== activeRevision.lightingMood ||
      decorDensity !== activeRevision.decorDensity ||
      style !== activeProject?.style);

  const curatedWallColors = [
    { label: 'Warm Chalk', hex: '#FAF8F5' },
    { label: 'Travertine Sand', hex: '#EAE4D9' },
    { label: 'Sage Herb', hex: '#8B9B88' },
    { label: 'Earthy Terracotta', hex: '#BA7053' },
    { label: 'Ocean Teal', hex: '#3D6466' },
    { label: 'Deep Charcoal', hex: '#2A2C2B' },
  ];

  const handleApplyControlChanges = async () => {
    await generateRevision({
      prompt: `Harmonious ${style} interior with ${wallColor} walls, ${lightingMood}, and ${decorDensity.toLowerCase()} decor layout.`,
      wallColor,
      furnitureStyle: style,
      lightingMood,
      decorDensity,
    });
  };

  const handleFindCheaper = () => {
    const data = findCheaperAlternativesForHighest();
    if (data) {
      setCheaperAlternativesData(data);
      setAlternativesModalOpen(true);
    }
  };

  if (!activeProject || !activeRevision) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6 text-center">
        <div className="space-y-4">
          <p className="text-sm font-mono text-[#7A756D]">Loading Homie.AI Workspace...</p>
          <Link
            to="/dashboard"
            className="text-xs font-mono uppercase underline text-[#1E1E1E]"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Construct hotspots from selected products
  const hotspots = selectedProducts.slice(0, 4).map((p, idx) => {
    const positions = [
      { x: 55, y: 72 }, // sofa / seating
      { x: 68, y: 80 }, // coffee table
      { x: 82, y: 70 }, // accent chair
      { x: 74, y: 40 }, // lighting / pendant
    ];
    return {
      product: p,
      x: positions[idx]?.x || 60,
      y: positions[idx]?.y || 60,
    };
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E1E1E] flex flex-col">
      {/* SUB-HEADER WORKSPACE TOOLBAR */}
      <div className="bg-white border-b border-[#EAE6DF] px-4 sm:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Project Title & Status */}
          <div className="flex items-center gap-3 min-w-0">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-base sm:text-lg text-[#1E1E1E] truncate">
                  {activeProject.title}
                </h1>
                {activeProject.isApproved && (
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-[#8B9B88]/20 text-[#4E614B] font-semibold border border-[#8B9B88]/40">
                    Approved
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-[#7A756D]">
                <span>{activeProject.style}</span>
                <span aria-hidden="true">·</span>
                <span>{activeProject.dimensions.width}x{activeProject.dimensions.length} {activeProject.dimensions.unit}</span>
                <span aria-hidden="true">·</span>
                <span>{activeProject.roomType.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          {/* Version Switcher, Undo / Redo */}
          <div className="flex items-center gap-3">
            {/* Version dropdown */}
            <div className="flex items-center gap-1.5 bg-[#F2EDE4] px-2.5 py-1 border border-[#DFD9CE] text-xs font-mono">
              <History className="w-3.5 h-3.5 text-[#7A756D]" />
              <select
                value={activeProject.activeVersionIndex}
                onChange={(e) => switchVersion(Number(e.target.value))}
                className="bg-transparent text-xs font-medium focus:outline-none cursor-pointer text-[#1E1E1E]"
              >
                {activeProject.versions.map((ver, idx) => (
                  <option key={ver.id} value={idx}>
                    v{ver.versionNumber}: {ver.name.slice(0, 24)}...
                  </option>
                ))}
              </select>
            </div>

            {/* Undo / Redo Buttons */}
            <div className="flex items-center border border-[#DFD9CE] bg-white">
              <button
                onClick={undoVersion}
                disabled={!canUndo}
                className="p-1.5 hover:bg-[#F2EDE4] disabled:opacity-30 text-[#4A4742] transition-colors"
                title="Undo Revision"
              >
                <Undo2 className="w-3.5 h-3.5" />
              </button>
              <div className="w-px h-4 bg-[#DFD9CE]" />
              <button
                onClick={redoVersion}
                disabled={!canRedo}
                className="p-1.5 hover:bg-[#F2EDE4] disabled:opacity-30 text-[#4A4742] transition-colors"
                title="Redo Revision"
              >
                <Redo2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Direct Link to Checklist & Budget */}
            <Link
              to={`/projects/${activeProject.id}/shortlist`}
              className="px-3 py-1.5 text-xs font-mono bg-[#1E1E1E] text-white hover:bg-[#333333] transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>Shortlist & Checklist</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* MAIN WORKSPACE BODY */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT / CENTER: VISUAL CANVAS & BEFORE/AFTER SLIDER (Col 8) */}
        <div className="lg:col-span-8 space-y-4">
          {/* VISUALIZER CONTAINER */}
          <div className="bg-white p-2 border border-[#DFD9CE] shadow-sm relative">
            <BeforeAfterSlider
              beforeImage={activeProject.roomImage}
              afterImage={activeRevision.renderedImage}
              beforeLabel="Original Photograph"
              afterLabel={`Concept v${activeRevision.versionNumber}: ${activeRevision.furnitureStyle}`}
              isAiGenerating={isAiProcessing}
              stageMessage={processingStage}
              hotspots={hotspots}
              onSelectHotspot={(prod) => setInspectedProduct(prod)}
            />

            {/* Unrendered changes notification banner */}
            {hasUnrenderedChanges && !isAiProcessing && (
              <div className="mt-2 p-2.5 bg-[#BA7053]/10 border border-[#BA7053]/30 flex items-center justify-between text-xs animate-in fade-in">
                <div className="flex items-center gap-2 text-[#BA7053] font-mono">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>Design parameters modified. Visual render update required.</span>
                </div>
                <button
                  onClick={handleApplyControlChanges}
                  className="px-3 py-1 bg-[#1E1E1E] text-white font-mono text-[11px] hover:bg-[#333333] transition-colors flex items-center gap-1 shrink-0"
                >
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  <span>Render New View</span>
                </button>
              </div>
            )}
          </div>

          {/* ARCHITECTURAL SPECS & SPATIAL SUMMARY STRIP */}
          <div className="bg-white border border-[#DFD9CE] p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#EAE6DF] pb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#7A756D]">
                Architectural Diagnostics
              </span>
              <span className="text-xs font-mono text-[#57534E]">
                Est. {activeRevision.aiAnalysis.estimatedSquareFeet || 320} sq ft
              </span>
            </div>

            <p className="text-xs text-[#57534E] leading-relaxed">
              <strong className="text-[#1E1E1E]">Spatial Strategy:</strong> {activeRevision.summary}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
              <div className="p-2.5 bg-[#FAF8F5] border border-[#EAE6DF]">
                <p className="font-mono text-[10px] uppercase text-[#7A756D]">Natural Light Vectors</p>
                <p className="text-[#1E1E1E] mt-0.5">{activeRevision.aiAnalysis.lightingConditions}</p>
              </div>
              <div className="p-2.5 bg-[#FAF8F5] border border-[#EAE6DF]">
                <p className="font-mono text-[10px] uppercase text-[#7A756D]">Circulation Clearance</p>
                <p className="text-[#1E1E1E] mt-0.5">{activeRevision.aiAnalysis.recommendedLayout}</p>
              </div>
            </div>

            {/* Preserved elements tag strip */}
            {activeProject.preserveFurniture.length > 0 && (
              <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] text-[#7A756D]">
                <span className="font-mono uppercase text-[10px]">Preserved:</span>
                {activeProject.preserveFurniture.map((item, idx) => (
                  <span key={idx} className="font-medium text-[#1E1E1E]">
                    {item}{idx < activeProject.preserveFurniture.length - 1 ? ' · ' : ''}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* PERSISTENT LIVE BUDGET & CHEAPER ALTERNATIVES BAR */}
          <div className="bg-[#FAF8F5] border border-[#DFD9CE] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-0.5 w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-[#7A756D]">Estimated Project Spend:</span>
                <span className="text-base font-bold font-mono text-[#1E1E1E]">{formatPrice(totalCost)}</span>
                <span className="text-xs text-[#7A756D] font-mono">/ {formatPrice(activeProject.budget)}</span>
              </div>
              <div className="w-full sm:w-64 h-1.5 bg-[#EAE6DF] mt-1.5">
                <div
                  className={`h-full transition-all duration-300 ${
                    isOverBudget ? 'bg-[#C47B5A]' : 'bg-[#8B9B88]'
                  }`}
                  style={{ width: `${Math.min(100, (totalCost / activeProject.budget) * 100)}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                onClick={handleFindCheaper}
                className="px-3 py-1.5 text-xs font-mono bg-white hover:bg-[#F2EDE4] border border-[#DFD9CE] text-[#1E1E1E] flex items-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <TrendingDown className="w-3.5 h-3.5 text-[#8B9B88]" />
                <span>Find Cheaper Alternatives</span>
              </button>

              <Link
                to={`/projects/${activeProject.id}/shop`}
                className="px-3 py-1.5 text-xs font-mono bg-[#1E1E1E] text-white hover:bg-[#333333] transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Catalog ({selectedProducts.length})</span>
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT: INTERACTIVE CONTROL TABS / AI COPILOT / PRODUCT LIST (Col 4) */}
        <div className="lg:col-span-4 bg-white border border-[#DFD9CE] flex flex-col h-[750px] shadow-sm">
          {/* Tab Selector */}
          <div className="grid grid-cols-3 border-b border-[#DFD9CE] bg-[#FAF8F5] text-xs font-mono">
            <button
              onClick={() => setActiveTab('controls')}
              className={`py-2.5 text-center font-medium transition-colors ${
                activeTab === 'controls'
                  ? 'bg-white text-[#1E1E1E] border-b-2 border-[#1E1E1E]'
                  : 'text-[#7A756D] hover:text-[#1E1E1E]'
              }`}
            >
              Controls
            </button>
            <button
              onClick={() => setActiveTab('copilot')}
              className={`py-2.5 text-center font-medium transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'copilot'
                  ? 'bg-white text-[#1E1E1E] border-b-2 border-[#1E1E1E]'
                  : 'text-[#7A756D] hover:text-[#1E1E1E]'
              }`}
            >
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              <span>Copilot</span>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`py-2.5 text-center font-medium transition-colors ${
                activeTab === 'products'
                  ? 'bg-white text-[#1E1E1E] border-b-2 border-[#1E1E1E]'
                  : 'text-[#7A756D] hover:text-[#1E1E1E]'
              }`}
            >
              Items ({selectedProducts.length})
            </button>
          </div>

          {/* TAB 1: LIVE DESIGN CONTROLS */}
          {activeTab === 'controls' && (
            <div className="p-4 space-y-5 overflow-y-auto flex-1">
              {/* Style selector */}
              <div>
                <label className="block text-xs font-mono uppercase text-[#7A756D] mb-1.5">
                  Interior Style
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value as InteriorStyle)}
                  className="w-full text-xs px-3 py-2 bg-[#FAF8F5] border border-[#DFD9CE] focus:border-[#1E1E1E] focus:outline-none"
                >
                  <option value="Scandinavian">Scandinavian</option>
                  <option value="Japandi">Japandi</option>
                  <option value="Mid-Century Modern">Mid-Century Modern</option>
                  <option value="Contemporary Minimalist">Contemporary Minimalist</option>
                  <option value="Boho Earthy">Boho Earthy</option>
                  <option value="Industrial Chic">Industrial Chic</option>
                </select>
              </div>

              {/* Wall Colors with Hex chips */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono uppercase text-[#7A756D]">
                    Wall Pigment
                  </label>
                  <span className="text-[11px] font-mono text-[#1E1E1E]">{wallColor}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {curatedWallColors.map((c) => {
                    const isSelected = wallColor.toLowerCase() === c.hex.toLowerCase();
                    return (
                      <button
                        key={c.hex}
                        onClick={() => setWallColor(c.hex)}
                        className={`p-2 text-left border flex items-center gap-2 transition-all ${
                          isSelected ? 'border-[#1E1E1E] ring-1 ring-[#1E1E1E] bg-[#FAF8F5]' : 'border-[#DFD9CE] bg-white'
                        }`}
                      >
                        <div
                          className="w-4 h-4 rounded-full border border-black/15 shrink-0"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span className="text-[11px] truncate">{c.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Lighting Mood */}
              <div>
                <label className="block text-xs font-mono uppercase text-[#7A756D] mb-1.5">
                  Lighting Mood & Correlated Color Temp
                </label>
                <div className="space-y-1.5">
                  {[
                    'Warm Ambient (2700K)',
                    'Natural Daylit (4000K)',
                    'Dramatic Dusk',
                    'Cozy Golden Hour',
                  ].map((mood) => {
                    const isSelected = lightingMood === mood;
                    return (
                      <button
                        key={mood}
                        onClick={() => setLightingMood(mood as LightingMood)}
                        className={`w-full p-2 text-left text-xs border flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-[#1E1E1E] text-white border-[#1E1E1E]'
                            : 'bg-[#FAF8F5] text-[#4A4742] border-[#DFD9CE] hover:border-[#8B9B88]'
                        }`}
                      >
                        <span>{mood}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#8B9B88]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Decor Density */}
              <div>
                <label className="block text-xs font-mono uppercase text-[#7A756D] mb-1.5">
                  Decor Density
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Minimalist', 'Balanced', 'Lush / Layered'] as DecorDensity[]).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDecorDensity(d)}
                      className={`p-2 text-xs border text-center font-medium transition-colors ${
                        decorDensity === d
                          ? 'bg-[#1E1E1E] text-white border-[#1E1E1E]'
                          : 'bg-[#FAF8F5] text-[#4A4742] border-[#DFD9CE]'
                      }`}
                    >
                      {d.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Layout Strategy */}
              <div>
                <label className="block text-xs font-mono uppercase text-[#7A756D] mb-1.5">
                  Spatial Arrangement Strategy
                </label>
                <select
                  value={layoutStrategy}
                  onChange={(e) => setLayoutStrategy(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-[#FAF8F5] border border-[#DFD9CE] focus:border-[#1E1E1E] focus:outline-none"
                >
                  <option value="Central Social Island">Central Social Island</option>
                  <option value="Framed Focus Wall">Framed Focus Wall</option>
                  <option value="Low-Horizon Grounding">Low-Horizon Grounding</option>
                  <option value="Perimeter Vista Alignment">Perimeter Vista Alignment</option>
                </select>
              </div>

              {/* Render Changes CTA Button */}
              <div className="pt-2">
                <button
                  onClick={handleApplyControlChanges}
                  disabled={isAiProcessing}
                  className="w-full py-2.5 text-xs font-mono uppercase tracking-wider bg-[#1E1E1E] text-white hover:bg-[#333333] transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Update Visual Rendering</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: AI DESIGN COPILOT */}
          {activeTab === 'copilot' && (
            <div className="flex-1 overflow-hidden">
              <AiAssistantDrawer onSelectProduct={(p) => setInspectedProduct(p)} />
            </div>
          )}

          {/* TAB 3: SELECTED ROOM PRODUCTS */}
          {activeTab === 'products' && (
            <div className="p-4 space-y-3 overflow-y-auto flex-1 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#EAE6DF]">
                <span className="font-mono uppercase text-[10px] text-[#7A756D]">Assigned Room Pieces</span>
                <Link
                  to={`/projects/${activeProject.id}/shop`}
                  className="text-xs font-mono text-[#1E1E1E] hover:underline"
                >
                  + Add More
                </Link>
              </div>

              <div className="space-y-2">
                {selectedProducts.map((p) => {
                  const qty = activeProject.customProductQuantities[p.id] || 1;
                  return (
                    <div
                      key={p.id}
                      className="p-2.5 bg-[#FAF8F5] border border-[#DFD9CE] hover:border-[#8B9B88] transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={p.image}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 object-cover border border-[#DFD9CE] shrink-0"
                        />
                        <div className="truncate">
                          <p className="font-medium text-xs text-[#1E1E1E] truncate">{p.name}</p>
                          <p className="text-[10px] text-[#7A756D] font-mono">
                            {formatPrice(p.price)} {qty > 1 && `(x${qty})`} · {p.retailer}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setInspectedProduct(p)}
                        className="text-[11px] font-mono text-[#1E1E1E] hover:underline shrink-0"
                      >
                        Details
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* QUICK PRODUCT INSPECTION MODAL */}
      {inspectedProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setInspectedProduct(null)}
        >
          <div
            className="bg-[#FAF8F5] border border-[#DFD9CE] max-w-lg w-full p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-3 border-b border-[#EAE6DF]">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#8B9B88]">{inspectedProduct.retailer}</span>
                <h3 className="font-serif font-bold text-lg text-[#1E1E1E] mt-0.5">{inspectedProduct.name}</h3>
              </div>
              <button
                onClick={() => setInspectedProduct(null)}
                className="text-[#7A756D] hover:text-[#1E1E1E] p-1"
              >
                ✕
              </button>
            </div>

            <div className="my-4 aspect-[16/10] overflow-hidden border border-[#DFD9CE] bg-white">
              <img
                src={inspectedProduct.image}
                alt={inspectedProduct.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#EAE6DF]">
                <span className="text-[#7A756D] font-mono">Price</span>
                <span className="font-bold font-mono text-sm text-[#1E1E1E]">{formatPrice(inspectedProduct.price)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EAE6DF]">
                <span className="text-[#7A756D] font-mono">Dimensions</span>
                <span className="font-medium text-[#1E1E1E]">{inspectedProduct.dimensions}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EAE6DF]">
                <span className="text-[#7A756D] font-mono">Material</span>
                <span className="font-medium text-[#1E1E1E]">{inspectedProduct.material}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EAE6DF]">
                <span className="text-[#7A756D] font-mono">Stock Status</span>
                <span className="text-[#8B9B88] font-medium">In Stock · Verified Authorized Retailer</span>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <a
                href={inspectedProduct.productUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 text-center text-xs font-mono uppercase bg-[#1E1E1E] text-white hover:bg-[#333333] transition-colors"
              >
                Open Retailer Website
              </a>
              <button
                onClick={() => {
                  setInspectedProduct(null);
                  handleFindCheaper();
                }}
                className="px-4 py-2.5 text-xs font-mono border border-[#DFD9CE] bg-white hover:bg-[#F2EDE4] text-[#1E1E1E] transition-colors"
              >
                Find Cheaper
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHEAPER ALTERNATIVES MODAL */}
      <CheaperAlternativesModal
        isOpen={alternativesModalOpen}
        onClose={() => setAlternativesModalOpen(false)}
        data={cheaperAlternativesData}
      />
    </div>
  );
};
