import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import {
  Check,
  CheckCircle2,
  Printer,
  Edit2,
  Save,
  Sparkles,
  ExternalLink,
  Layers,
  Heart,
  FileText,
  ShoppingBag,
  ArrowRight,
  TrendingDown,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ShortlistPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const {
    activeProject,
    updateActiveProject,
    switchVersion,
    approveDesign,
    selectedProducts,
    togglePurchased,
    formatPrice,
    totalCost,
    subtotal,
    deliveryFee,
    estimatedTax,
    showToast,
  } = useProject();

  // Project title editing
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(activeProject?.title || '');

  // Notes editing
  const [notes, setNotes] = useState(activeProject?.shortlistNotes || '');
  const [isNotesSaved, setIsNotesSaved] = useState(true);

  if (!activeProject) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6 text-center">
        <p className="text-sm font-mono text-[#7A756D]">Loading Shortlist & Checklist...</p>
      </div>
    );
  }

  const handleSaveTitle = () => {
    if (editedTitle.trim()) {
      updateActiveProject({ title: editedTitle.trim() });
      setIsEditingTitle(false);
      showToast('Project title updated', 'success');
    }
  };

  const handleSaveNotes = () => {
    updateActiveProject({ shortlistNotes: notes });
    setIsNotesSaved(true);
    showToast('Design notes saved', 'success');
  };

  const handleToggleApproval = () => {
    const nextApproved = !activeProject.isApproved;
    approveDesign(nextApproved);
    if (nextApproved) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8B9B88', '#FAF8F5', '#BA7053', '#D4AF37'],
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const purchasedCount = activeProject.purchasedProductIds.length;
  const totalItemsCount = selectedProducts.length;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E1E1E] py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Breadcrumbs & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#EAE6DF] gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#7A756D] uppercase">
              <Link to={`/projects/${projectId}`} className="hover:underline text-[#1E1E1E]">
                Studio
              </Link>
              <span>/</span>
              <span>Design Approval & Shopping Procurement</span>
            </div>

            {/* Editable Project Title */}
            <div className="flex items-center gap-2 mt-1">
              {isEditingTitle ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="text-xl sm:text-2xl font-serif font-bold text-[#1E1E1E] px-2 py-1 border border-[#1E1E1E] bg-white focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveTitle}
                    className="p-2 bg-[#1E1E1E] text-white hover:bg-[#333333] transition-colors"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group">
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1E1E1E]">
                    {activeProject.title}
                  </h1>
                  <button
                    onClick={() => {
                      setEditedTitle(activeProject.title);
                      setIsEditingTitle(true);
                    }}
                    className="p-1 text-[#7A756D] hover:text-[#1E1E1E] opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Rename Project"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs text-[#57534E] mt-0.5">
              Review saved concepts, approve your preferred layout, and manage procurement with itemized retailer links.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 text-xs font-mono border border-[#DFD9CE] bg-white hover:bg-[#F2EDE4] text-[#1E1E1E] transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Checklist</span>
            </button>

            <button
              onClick={handleToggleApproval}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all ${
                activeProject.isApproved
                  ? 'bg-[#8B9B88] text-white hover:bg-[#788876]'
                  : 'bg-[#1E1E1E] text-white hover:bg-[#333333]'
              }`}
            >
              {activeProject.isApproved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Design Approved</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>Approve This Design</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* SECTION 1: SAVED DESIGN CONCEPTS COMPARISON */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif font-bold text-lg text-[#1E1E1E]">Saved Design Versions & Concepts</h2>
              <p className="text-xs text-[#57534E]">
                Switch between generated spatial revisions or jump back into the Studio to refine them.
              </p>
            </div>
            <Link
              to={`/projects/${projectId}`}
              className="text-xs font-mono text-[#1E1E1E] hover:underline flex items-center gap-1"
            >
              <span>Open in Studio</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeProject.versions.map((version, idx) => {
              const isActive = idx === activeProject.activeVersionIndex;
              return (
                <div
                  key={version.id}
                  className={`p-4 bg-white border transition-all flex flex-col justify-between ${
                    isActive ? 'border-[#1E1E1E] ring-1 ring-[#1E1E1E] shadow-sm' : 'border-[#DFD9CE]'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="aspect-[16/10] overflow-hidden bg-[#EAE6DF] relative border border-[#EAE6DF]">
                      <img
                        src={version.renderedImage}
                        alt={version.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-black/80 text-white">
                          v{version.versionNumber}
                        </span>
                      </div>
                      {isActive && (
                        <div className="absolute top-2 right-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-[#8B9B88] text-white font-semibold">
                            Current Active
                          </span>
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#1E1E1E]">{version.name}</h4>
                      <p className="text-xs text-[#57534E] mt-1 line-clamp-2 leading-relaxed">
                        {version.summary}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#EAE6DF] text-[11px] font-mono text-[#7A756D] space-y-1">
                      <p>Wall: {version.wallColor} · Style: {version.furnitureStyle}</p>
                      <p>Lighting: {version.lightingMood}</p>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-[#EAE6DF]">
                    {isActive ? (
                      <span className="text-xs font-mono text-[#8B9B88] font-semibold flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        Selected for Procurement
                      </span>
                    ) : (
                      <button
                        onClick={() => switchVersion(idx)}
                        className="w-full py-1.5 text-xs font-mono border border-[#DFD9CE] hover:bg-[#F2EDE4] transition-colors"
                      >
                        Set as Active Concept
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: ARCHITECTURAL DESIGN NOTES */}
        <div className="bg-white border border-[#DFD9CE] p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-[#1E1E1E] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#8B9B88]" />
              <span>Project Architectural Notes & Contractor Guidelines</span>
            </h3>
            <button
              onClick={handleSaveNotes}
              className="text-xs font-mono text-[#1E1E1E] hover:underline flex items-center gap-1"
            >
              <Save className="w-3 h-3" />
              <span>Save Notes</span>
            </button>
          </div>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              setIsNotesSaved(false);
            }}
            placeholder="Record paint contractor codes, electrician socket locations, fabric swatch numbers, or delivery notes..."
            className="w-full text-xs px-3 py-2 bg-[#FAF8F5] border border-[#DFD9CE] focus:border-[#1E1E1E] focus:outline-none leading-relaxed"
          />
          {!isNotesSaved && (
            <p className="text-[10px] font-mono text-[#C47B5A]">Unsaved notes. Click &ldquo;Save Notes&rdquo; above.</p>
          )}
        </div>

        {/* SECTION 3: PERSONALIZED SHOPPING CHECKLIST */}
        <div className="bg-white border border-[#DFD9CE] overflow-hidden">
          <div className="p-4 bg-[#F2EDE4] border-b border-[#DFD9CE] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-[#1E1E1E]">
                  Personalized Shopping & Procurement Checklist
                </h3>
                {activeProject.isApproved && (
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-[#8B9B88] text-white">
                    Approved Concept v{activeProject.activeVersionIndex + 1}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#57534E] mt-0.5">
                Track purchased furnishings and access direct authorized store links.
              </p>
            </div>

            <div className="text-xs font-mono text-[#57534E]">
              <span>Purchased: </span>
              <strong className="text-[#1E1E1E]">{purchasedCount}</strong> / {totalItemsCount} pieces
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#EAE6DF] bg-[#FAF8F5] text-[#7A756D] font-mono text-[10px] uppercase">
                  <th className="py-3 px-4 w-12 text-center">Status</th>
                  <th className="py-3 px-4">Item & Specifications</th>
                  <th className="py-3 px-4">Authorized Retailer</th>
                  <th className="py-3 px-4 text-center">Qty</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE6DF]">
                {selectedProducts.map((prod) => {
                  const qty = activeProject.customProductQuantities[prod.id] || 1;
                  const isPurchased = activeProject.purchasedProductIds.includes(prod.id);
                  const lineTotal = prod.price * qty;

                  return (
                    <tr
                      key={prod.id}
                      className={`hover:bg-[#FAF8F5] transition-colors ${isPurchased ? 'bg-[#F2EDE4]/40' : ''}`}
                    >
                      <td className="py-3 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isPurchased}
                          onChange={() => togglePurchased(prod.id)}
                          className="w-4 h-4 rounded border-[#DFD9CE] accent-[#1E1E1E] cursor-pointer"
                          title="Mark as purchased"
                        />
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 object-cover border border-[#DFD9CE] shrink-0"
                          />
                          <div>
                            <p className={`font-semibold text-[#1E1E1E] ${isPurchased ? 'line-through text-[#7A756D]' : ''}`}>
                              {prod.name}
                            </p>
                            <p className="text-[11px] text-[#7A756D]">{prod.material}</p>
                            <p className="text-[10px] font-mono text-[#9C968B]">{prod.dimensions}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-mono text-xs text-[#1E1E1E]">{prod.retailer}</span>
                        <p className="text-[10px] text-[#8B9B88]">Authorized Dealer</p>
                      </td>

                      <td className="py-3 px-4 text-center font-mono font-medium">
                        {qty}
                      </td>

                      <td className="py-3 px-4 text-right font-mono text-xs tabular-nums text-[#1E1E1E]">
                        {formatPrice(lineTotal)}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <a
                          href={prod.productUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono bg-[#1E1E1E] text-white hover:bg-[#333333] transition-colors"
                        >
                          <span>Buy Now</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Bottom Financial Reconciliation */}
          <div className="p-4 bg-[#FAF8F5] border-t border-[#DFD9CE] flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-xs text-[#57534E]">
              <p className="font-medium text-[#1E1E1E]">100% Direct Retailer Pricing Guarantee</p>
              <p className="text-[11px] text-[#7A756D]">Homie.AI connects directly to brand partners without hidden surcharges.</p>
            </div>

            <div className="text-right font-mono text-xs">
              <p className="text-[#57534E]">Total Procurement: <strong className="text-[#1E1E1E] text-base">{formatPrice(totalCost)}</strong></p>
              <p className="text-[10px] text-[#7A756D]">Includes estimated 5% tax and white-glove shipping</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
