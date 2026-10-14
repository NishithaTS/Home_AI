import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import {
  TrendingDown,
  Trash2,
  Plus,
  Minus,
  AlertCircle,
  CheckCircle2,
  ShoppingBag,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Truck,
  Receipt,
} from 'lucide-react';
import { CheaperAlternativesModal } from '../components/CheaperAlternativesModal';
import { Product } from '../types';

export const BudgetPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const {
    activeProject,
    selectedProducts,
    setProductQuantity,
    removeProductFromProject,
    formatPrice,
    subtotal,
    deliveryFee,
    estimatedTax,
    totalCost,
    remainingBudget,
    isOverBudget,
    findCheaperAlternativesForHighest,
  } = useProject();

  const [cheaperModalOpen, setCheaperModalOpen] = useState(false);
  const [cheaperData, setCheaperData] = useState<{ original: Product; alternatives: Product[] } | null>(null);

  const handleOpenCheaperAction = () => {
    const data = findCheaperAlternativesForHighest();
    if (data) {
      setCheaperData(data);
      setCheaperModalOpen(true);
    }
  };

  if (!activeProject) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6 text-center">
        <p className="text-sm font-mono text-[#7A756D]">Loading Project Budget...</p>
      </div>
    );
  }

  const budgetUsagePercent = Math.min(100, Math.round((totalCost / activeProject.budget) * 100));

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E1E1E] py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#EAE6DF] gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#7A756D] uppercase">
              <Link to={`/projects/${projectId}`} className="hover:underline text-[#1E1E1E]">
                Studio
              </Link>
              <span>/</span>
              <span>Project Economics</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1E1E1E] mt-1">
              Live Budget & Procurement Calculator
            </h1>
            <p className="text-xs text-[#57534E] mt-0.5">
              Derived in real time from selected verified furnishings, white-glove shipping rates, and local taxes.
            </p>
          </div>

          <Link
            to={`/projects/${projectId}/shop`}
            className="px-4 py-2 text-xs font-mono bg-[#1E1E1E] text-white hover:bg-[#333333] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Browse More Furniture</span>
          </Link>
        </div>

        {/* TOP KPI BUDGET OVERVIEW BAR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Target Budget */}
          <div className="p-4 bg-white border border-[#DFD9CE]">
            <span className="text-[10px] font-mono uppercase text-[#7A756D]">Allocated Budget</span>
            <p className="text-2xl font-serif font-bold text-[#1E1E1E] mt-1 tabular-nums">
              {formatPrice(activeProject.budget)}
            </p>
            <p className="text-[11px] text-[#7A756D] font-mono mt-1">Set in Room Setup</p>
          </div>

          {/* 2. Subtotal */}
          <div className="p-4 bg-white border border-[#DFD9CE]">
            <span className="text-[10px] font-mono uppercase text-[#7A756D]">Items Subtotal</span>
            <p className="text-2xl font-serif font-bold text-[#1E1E1E] mt-1 tabular-nums">
              {formatPrice(subtotal)}
            </p>
            <p className="text-[11px] text-[#7A756D] font-mono mt-1">{selectedProducts.length} unique pieces</p>
          </div>

          {/* 3. Total Estimated Project Cost */}
          <div className="p-4 bg-white border border-[#DFD9CE]">
            <span className="text-[10px] font-mono uppercase text-[#7A756D]">Total Est. Project Cost</span>
            <p className={`text-2xl font-serif font-bold mt-1 tabular-nums ${isOverBudget ? 'text-[#C47B5A]' : 'text-[#1E1E1E]'}`}>
              {formatPrice(totalCost)}
            </p>
            <p className="text-[11px] text-[#7A756D] font-mono mt-1">Includes freight & tax</p>
          </div>

          {/* 4. Remaining / Over Budget */}
          <div className={`p-4 border ${isOverBudget ? 'bg-[#C47B5A]/10 border-[#C47B5A]/40' : 'bg-white border-[#DFD9CE]'}`}>
            <span className="text-[10px] font-mono uppercase text-[#7A756D]">
              {isOverBudget ? 'Amount Over Budget' : 'Remaining Budget'}
            </span>
            <p className={`text-2xl font-serif font-bold mt-1 tabular-nums ${isOverBudget ? 'text-[#C47B5A]' : 'text-[#8B9B88]'}`}>
              {isOverBudget ? `+${formatPrice(Math.abs(remainingBudget))}` : formatPrice(remainingBudget)}
            </p>
            <p className="text-[11px] font-mono mt-1 text-[#7A756D]">
              {isOverBudget ? 'Optimization recommended' : `${100 - budgetUsagePercent}% balance available`}
            </p>
          </div>
        </div>

        {/* OVER BUDGET WARNING & ONE-CLICK CHEAPER ALTERNATIVES ACTION */}
        {isOverBudget ? (
          <div className="p-4 bg-[#BA7053]/15 border border-[#BA7053]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#BA7053] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-serif font-semibold text-sm text-[#1E1E1E]">
                  Your current furniture selections exceed the target by {formatPrice(Math.abs(remainingBudget))}
                </h3>
                <p className="text-xs text-[#57534E] mt-0.5">
                  Use our automatic catalog scan to swap high-cost items for identical architectural silhouettes at reduced prices.
                </p>
              </div>
            </div>
            <button
              onClick={handleOpenCheaperAction}
              className="px-4 py-2 text-xs font-mono bg-[#1E1E1E] text-white hover:bg-[#333333] transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm shrink-0"
            >
              <TrendingDown className="w-3.5 h-3.5 text-[#8B9B88]" />
              <span>Find Cheaper Alternatives</span>
            </button>
          </div>
        ) : (
          <div className="p-4 bg-white border border-[#DFD9CE] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#8B9B88] shrink-0" />
              <div>
                <p className="text-xs font-semibold text-[#1E1E1E]">Project is within target budget limits</p>
                <p className="text-[11px] text-[#7A756D]">
                  {formatPrice(remainingBudget)} remaining for accessory styling, art, or delivery buffers.
                </p>
              </div>
            </div>
            <button
              onClick={handleOpenCheaperAction}
              className="px-3 py-1.5 text-xs font-mono border border-[#DFD9CE] hover:bg-[#F2EDE4] transition-colors flex items-center gap-1.5"
            >
              <TrendingDown className="w-3 h-3 text-[#8B9B88]" />
              <span>Scan for additional savings</span>
            </button>
          </div>
        )}

        {/* ITEMIZED TABLE */}
        <div className="bg-white border border-[#DFD9CE] overflow-hidden">
          <div className="p-4 bg-[#F2EDE4] border-b border-[#DFD9CE] flex items-center justify-between">
            <h3 className="font-serif font-bold text-sm text-[#1E1E1E]">Itemized Selected Furnishings</h3>
            <span className="text-xs font-mono text-[#7A756D]">
              {selectedProducts.length} items in design
            </span>
          </div>

          {selectedProducts.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <p className="text-sm font-serif text-[#7A756D]">No furniture items currently assigned to this room.</p>
              <Link
                to={`/projects/${projectId}/shop`}
                className="text-xs font-mono underline text-[#1E1E1E]"
              >
                Browse catalog and add pieces
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#EAE6DF] bg-[#FAF8F5] text-[#7A756D] font-mono text-[10px] uppercase">
                    <th className="py-3 px-4">Item & Retailer</th>
                    <th className="py-3 px-4">Dimensions / Material</th>
                    <th className="py-3 px-4 text-center">Qty</th>
                    <th className="py-3 px-4 text-right">Unit Price</th>
                    <th className="py-3 px-4 text-right">Line Total</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE6DF]">
                  {selectedProducts.map((product) => {
                    const qty = activeProject.customProductQuantities[product.id] || 1;
                    const lineTotal = product.price * qty;

                    return (
                      <tr key={product.id} className="hover:bg-[#FAF8F5] transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 object-cover border border-[#DFD9CE] shrink-0"
                            />
                            <div>
                              <p className="font-semibold text-[#1E1E1E] leading-snug">{product.name}</p>
                              <a
                                href={product.productUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] font-mono text-[#7A756D] hover:underline flex items-center gap-1 mt-0.5"
                              >
                                <span>{product.retailer}</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-[#57534E]">
                          <p className="truncate max-w-[200px]">{product.material}</p>
                          <p className="text-[11px] font-mono text-[#7A756D]">{product.dimensions}</p>
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setProductQuantity(product.id, qty - 1)}
                              className="p-1 border border-[#DFD9CE] hover:bg-[#EAE4D9] text-[#1E1E1E] transition-colors"
                              title="Decrease"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-mono font-medium text-xs w-4 text-center">{qty}</span>
                            <button
                              onClick={() => setProductQuantity(product.id, qty + 1)}
                              className="p-1 border border-[#DFD9CE] hover:bg-[#EAE4D9] text-[#1E1E1E] transition-colors"
                              title="Increase"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-right font-mono text-xs tabular-nums text-[#57534E]">
                          {formatPrice(product.price)}
                        </td>

                        <td className="py-3 px-4 text-right font-mono text-xs font-bold tabular-nums text-[#1E1E1E]">
                          {formatPrice(lineTotal)}
                        </td>

                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => removeProductFromProject(product.id)}
                            className="p-1 text-[#7A756D] hover:text-[#C47B5A] transition-colors"
                            title="Remove from room"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* SUMMARY BOTTOM SHEET */}
          <div className="p-4 bg-[#FAF8F5] border-t border-[#DFD9CE] flex flex-col sm:flex-row justify-end items-end">
            <div className="w-full sm:w-72 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-[#57534E]">
                <span>Items Subtotal:</span>
                <span className="font-medium tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#57534E]">
                <span className="flex items-center gap-1">
                  <Truck className="w-3 h-3 text-[#7A756D]" />
                  <span>Delivery & Freight:</span>
                </span>
                <span className="font-medium tabular-nums">
                  {deliveryFee === 0 ? 'FREE (over ₹45k)' : formatPrice(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-[#57534E]">
                <span className="flex items-center gap-1">
                  <Receipt className="w-3 h-3 text-[#7A756D]" />
                  <span>Estimated Tax (5% GST):</span>
                </span>
                <span className="font-medium tabular-nums">{formatPrice(estimatedTax)}</span>
              </div>
              <div className="pt-2 border-t border-[#DFD9CE] flex justify-between text-sm font-bold text-[#1E1E1E]">
                <span>Total Project Investment:</span>
                <span className="tabular-nums">{formatPrice(totalCost)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* CHEAPER ALTERNATIVES MODAL */}
        <CheaperAlternativesModal
          isOpen={cheaperModalOpen}
          onClose={() => setCheaperModalOpen(false)}
          data={cheaperData}
        />
      </div>
    </div>
  );
};
