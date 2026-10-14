import React from 'react';
import { useProject } from '../context/ProjectContext';
import { X, ArrowRight, TrendingDown, Check, DollarSign } from 'lucide-react';
import { Product } from '../types';

interface CheaperAlternativesModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: { original: Product; alternatives: Product[] } | null;
}

export const CheaperAlternativesModal: React.FC<CheaperAlternativesModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const { replaceProductInProject, formatPrice, activeProject } = useProject();

  if (!isOpen || !data) return null;

  const { original, alternatives } = data;
  const currentQty = activeProject?.customProductQuantities[original.id] || 1;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="bg-[#FAF8F5] border border-[#DFD9CE] max-w-2xl w-full p-6 shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#EAE6DF]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#8B9B88]">
              <TrendingDown className="w-4 h-4" />
              <span>Cost Optimization Assistant</span>
            </div>
            <h2 className="text-lg font-serif font-semibold text-[#1E1E1E] mt-1">
              Cheaper Alternatives for {original.name}
            </h2>
            <p className="text-xs text-[#57534E] mt-0.5">
              Swap with matching verified catalog pieces to preserve your aesthetic while reducing costs.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#7A756D] hover:text-[#1E1E1E] p-1.5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Item Baseline */}
        <div className="my-4 p-3 bg-[#F2EDE4] border border-[#DFD9CE] flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <img
              src={original.image}
              alt={original.name}
              referrerPolicy="no-referrer"
              className="w-12 h-12 object-cover border border-[#DFD9CE]"
            />
            <div>
              <span className="text-[10px] font-mono uppercase text-[#7A756D]">Currently in Design</span>
              <p className="font-semibold text-[#1E1E1E]">{original.name}</p>
              <p className="text-[#7A756D]">{original.retailer} · {original.dimensions}</p>
            </div>
          </div>
          <div className="text-right font-mono">
            <p className="text-sm font-bold text-[#1E1E1E]">{formatPrice(original.price)}</p>
            {currentQty > 1 && <p className="text-[10px] text-[#7A756D]">Qty: {currentQty}</p>}
          </div>
        </div>

        {/* Alternatives List */}
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          <p className="text-xs font-mono uppercase tracking-wider text-[#7A756D]">
            Available Catalog Alternatives ({alternatives.length}):
          </p>
          {alternatives.map((alt) => {
            const savingsPerItem = original.price - alt.price;
            const totalSavings = savingsPerItem * currentQty;

            return (
              <div
                key={alt.id}
                className="p-3.5 bg-white border border-[#DFD9CE] hover:border-[#8B9B88] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={alt.image}
                    alt={alt.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 object-cover border border-[#DFD9CE] shrink-0"
                  />
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#8B9B88]/15 text-[#5F705C] font-semibold">
                        Save {formatPrice(totalSavings)}
                      </span>
                      <span className="text-[10px] font-mono text-[#7A756D]">{alt.retailer}</span>
                    </div>
                    <p className="font-medium text-xs text-[#1E1E1E] truncate mt-0.5">{alt.name}</p>
                    <p className="text-[11px] text-[#7A756D] truncate">{alt.material} · {alt.dimensions}</p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0 gap-2">
                  <div className="text-right font-mono">
                    <p className="text-sm font-semibold text-[#1E1E1E]">{formatPrice(alt.price)}</p>
                    <p className="text-[10px] text-[#8B9B88] font-medium">-{Math.round((savingsPerItem / original.price) * 100)}% cheaper</p>
                  </div>
                  <button
                    onClick={() => {
                      replaceProductInProject(original.id, alt.id);
                      onClose();
                    }}
                    className="px-3 py-1.5 text-xs font-mono bg-[#1E1E1E] text-white hover:bg-[#333333] transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <span>Swap Item</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-[#EAE6DF] flex items-center justify-between text-xs text-[#7A756D] font-mono">
          <span>All alternatives sourced from authorized retailers</span>
          <button
            onClick={onClose}
            className="hover:underline text-[#1E1E1E]"
          >
            Keep current piece
          </button>
        </div>
      </div>
    </div>
  );
};
