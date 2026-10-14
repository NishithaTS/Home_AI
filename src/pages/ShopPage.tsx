import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { PRODUCTS } from '../data/catalog';
import { Product } from '../types';
import {
  Search,
  Filter,
  Heart,
  Plus,
  Check,
  ArrowRight,
  Sparkles,
  ExternalLink,
  SlidersHorizontal,
  Layers,
  ArrowLeftRight,
  TrendingDown,
  X,
} from 'lucide-react';
import { CheaperAlternativesModal } from '../components/CheaperAlternativesModal';

export const ShopPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const {
    activeProject,
    addProductToProject,
    removeProductFromProject,
    replaceProductInProject,
    toggleFavorite,
    formatPrice,
    totalCost,
    remainingBudget,
    isOverBudget,
  } = useProject();

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRetailer, setSelectedRetailer] = useState<string>('All');
  const [selectedStyleTag, setSelectedStyleTag] = useState<string>('All');
  const [sortOption, setSortOption] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating'>('featured');
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(70000);

  // Comparison State
  const [compareItems, setCompareItems] = useState<Product[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Cheaper Alternatives Modal
  const [alternativesModalOpen, setAlternativesModalOpen] = useState(false);
  const [cheaperData, setCheaperData] = useState<{ original: Product; alternatives: Product[] } | null>(null);

  const categories = [
    'All',
    'Sofas & Seating',
    'Tables & Desks',
    'Storage & Credenzas',
    'Lighting',
    'Rugs & Textiles',
    'Decor & Plants',
    'Outdoor',
  ];

  const retailers = ['All', 'Muuto Studio', 'West Elm Studio', 'Article', 'HAY Design', 'IKEA Design', 'Design Within Reach', 'Urban Ladder Heritage'];
  const styles = ['All', 'Scandinavian', 'Japandi', 'Mid-Century Modern', 'Contemporary Minimalist', 'Boho Earthy', 'Industrial Chic'];

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      // Category filter
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
      // Retailer filter
      if (selectedRetailer !== 'All' && p.retailer !== selectedRetailer) return false;
      // Style tag
      if (selectedStyleTag !== 'All' && !p.styleTags.includes(selectedStyleTag)) return false;
      // Price filter
      if (p.price > maxPriceFilter) return false;
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          p.retailer.toLowerCase().includes(q) ||
          p.color.toLowerCase().includes(q) ||
          p.dimensions.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortOption === 'price_asc') return a.price - b.price;
      if (sortOption === 'price_desc') return b.price - a.price;
      if (sortOption === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [selectedCategory, selectedRetailer, selectedStyleTag, maxPriceFilter, searchQuery, sortOption]);

  const handleToggleCompare = (product: Product) => {
    if (compareItems.some((item) => item.id === product.id)) {
      setCompareItems((prev) => prev.filter((item) => item.id !== product.id));
    } else {
      if (compareItems.length >= 3) {
        setCompareItems([compareItems[1], compareItems[2], product]);
      } else {
        setCompareItems((prev) => [...prev, product]);
      }
    }
  };

  const handleOpenCheaper = (product: Product) => {
    const alternatives = PRODUCTS.filter(
      (p) => p.category === product.category && p.id !== product.id && p.price < product.price
    ).sort((a, b) => a.price - b.price);

    setCheaperData({ original: product, alternatives });
    setAlternativesModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E1E1E] py-8 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#EAE6DF] gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#7A756D] uppercase">
              <Link to={`/projects/${projectId}`} className="hover:underline text-[#1E1E1E]">
                Studio
              </Link>
              <span>/</span>
              <span>Authorized Retailer Discovery</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1E1E1E] mt-1">
              Curated Furniture Catalog
            </h1>
            <p className="text-xs text-[#57534E] mt-0.5">
              Explore authentic pieces with real verified dimensions, trade materials, and direct retailer checkout links.
            </p>
          </div>

          {/* Quick Project Spend Bar */}
          <div className="p-3 bg-white border border-[#DFD9CE] flex items-center gap-4 text-xs font-mono">
            <div>
              <p className="text-[10px] text-[#7A756D] uppercase">Project Spent</p>
              <p className={`font-bold ${isOverBudget ? 'text-[#C47B5A]' : 'text-[#1E1E1E]'}`}>
                {formatPrice(totalCost)}
              </p>
            </div>
            <div className="w-px h-8 bg-[#DFD9CE]" />
            <div>
              <p className="text-[10px] text-[#7A756D] uppercase">Room Pieces</p>
              <p className="font-bold text-[#1E1E1E]">{activeProject?.selectedProductIds.length || 0} selected</p>
            </div>
            <Link
              to={`/projects/${projectId}/budget`}
              className="px-3 py-1.5 bg-[#1E1E1E] text-white hover:bg-[#333333] transition-colors ml-2"
            >
              View Budget
            </Link>
          </div>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="bg-white border border-[#DFD9CE] p-4 space-y-4">
          {/* Search Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-[#7A756D] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by furniture name, material (e.g. travertine, oak, bouclé)..."
                className="w-full text-xs pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#DFD9CE] focus:border-[#1E1E1E] focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7A756D]"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Retailer filter */}
            <div className="md:col-span-3">
              <select
                value={selectedRetailer}
                onChange={(e) => setSelectedRetailer(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-[#FAF8F5] border border-[#DFD9CE] focus:border-[#1E1E1E] focus:outline-none"
              >
                {retailers.map((r) => (
                  <option key={r} value={r}>
                    Retailer: {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort order */}
            <div className="md:col-span-3">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                className="w-full text-xs px-3 py-2 bg-[#FAF8F5] border border-[#DFD9CE] focus:border-[#1E1E1E] focus:outline-none"
              >
                <option value="featured">Sort: Curated Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Category Tabs (Functional buttons with clean segmented style) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-t border-[#EAE6DF] pt-3">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'bg-[#1E1E1E] text-white shadow-xs'
                      : 'bg-[#F2EDE4] text-[#57534E] hover:text-[#1E1E1E] hover:bg-[#EAE4D9]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Secondary filter chips & Price Slider */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs border-t border-[#EAE6DF]">
            <div className="flex items-center gap-2">
              <span className="text-[#7A756D] font-mono uppercase text-[10px]">Style Filter:</span>
              <div className="flex items-center gap-1">
                {styles.slice(0, 4).map((st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedStyleTag(st)}
                    className={`px-2 py-0.5 text-[11px] font-mono transition-colors ${
                      selectedStyleTag === st
                        ? 'bg-[#8B9B88] text-white'
                        : 'bg-[#FAF8F5] text-[#7A756D] hover:text-[#1E1E1E] border border-[#DFD9CE]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[#7A756D] font-mono text-[11px]">
                Max Price: <strong className="text-[#1E1E1E]">{formatPrice(maxPriceFilter)}</strong>
              </span>
              <input
                type="range"
                min="5000"
                max="70000"
                step="2500"
                value={maxPriceFilter}
                onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                className="w-28 sm:w-40 accent-[#1E1E1E] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* COMPARISON FLOATING DRAWER TRIGGER */}
        {compareItems.length > 0 && (
          <div className="sticky top-16 z-30 bg-[#1E1E1E] text-white p-3 shadow-xl flex items-center justify-between animate-in slide-in-from-top-2">
            <div className="flex items-center gap-3 text-xs">
              <ArrowLeftRight className="w-4 h-4 text-[#8B9B88]" />
              <span className="font-mono">
                {compareItems.length} {compareItems.length === 1 ? 'item' : 'items'} selected for comparison
              </span>
              <div className="flex items-center gap-2">
                {compareItems.map((c) => (
                  <span key={c.id} className="text-[11px] bg-white/10 px-2 py-0.5 truncate max-w-[120px]">
                    {c.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCompareModalOpen(true)}
                className="px-3 py-1 bg-white text-[#1E1E1E] text-xs font-mono font-medium hover:bg-[#FAF8F5] transition-colors"
              >
                Compare Side-by-Side
              </button>
              <button
                onClick={() => setCompareItems([])}
                className="text-white/60 hover:text-white text-xs p-1"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* PRODUCT GRID */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 bg-white border border-[#DFD9CE] text-center space-y-3">
            <p className="text-base font-serif text-[#1E1E1E]">No catalog pieces match your criteria</p>
            <p className="text-xs text-[#7A756D]">Try broadening your price slider or searching for general materials like &ldquo;oak&rdquo; or &ldquo;linen&rdquo;.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedRetailer('All');
                setSelectedStyleTag('All');
                setMaxPriceFilter(70000);
              }}
              className="px-4 py-2 text-xs font-mono uppercase bg-[#1E1E1E] text-white hover:bg-[#333333] transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const isSelectedInRoom = activeProject?.selectedProductIds.includes(product.id);
              const isFav = activeProject?.favorites.includes(product.id);
              const isComparing = compareItems.some((c) => c.id === product.id);

              return (
                <div
                  key={product.id}
                  className="bg-white border border-[#DFD9CE] hover:border-[#1E1E1E] transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Lead Product Image */}
                  <div className="aspect-[4/3] bg-[#F2EDE4] overflow-hidden relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />

                    {/* Retailer & Tier tags */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-black/75 text-white backdrop-blur-sm">
                        {product.retailer}
                      </span>
                      {product.tier && (
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 bg-white/90 text-[#1E1E1E] backdrop-blur-sm">
                          {product.tier}
                        </span>
                      )}
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-sm transition-colors ${
                        isFav ? 'bg-white text-[#C47B5A]' : 'bg-black/40 text-white hover:bg-white hover:text-[#1E1E1E]'
                      }`}
                      title={isFav ? 'Favorited' : 'Add to Favorites'}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs text-[#7A756D] font-mono">
                        <span>{product.category}</span>
                        <span className="text-[#8B9B88]">★ {product.rating}</span>
                      </div>
                      <h3 className="font-serif font-semibold text-sm text-[#1E1E1E] mt-1 leading-snug group-hover:text-[#8B9B88] transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-xs text-[#57534E] mt-1 line-clamp-1">{product.material}</p>
                      <p className="text-[11px] font-mono text-[#7A756D] mt-0.5">{product.dimensions}</p>
                    </div>

                    {/* Price and Add/Remove Button */}
                    <div className="pt-3 border-t border-[#EAE6DF] space-y-2">
                      <div className="flex items-center justify-between font-mono">
                        <span className="text-base font-bold text-[#1E1E1E]">{formatPrice(product.price)}</span>
                        <span className="text-[10px] text-[#8B9B88] font-medium">In Stock</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {isSelectedInRoom ? (
                          <button
                            onClick={() => removeProductFromProject(product.id)}
                            className="py-2 text-xs font-mono bg-[#8B9B88] text-white hover:bg-[#C47B5A] transition-colors flex items-center justify-center gap-1 shadow-xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>In Room</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => addProductToProject(product.id)}
                            className="py-2 text-xs font-mono bg-[#1E1E1E] text-white hover:bg-[#333333] transition-colors flex items-center justify-center gap-1 shadow-xs"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add to Design</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleToggleCompare(product)}
                          className={`py-2 text-xs font-mono border transition-colors flex items-center justify-center gap-1 ${
                            isComparing
                              ? 'bg-[#1E1E1E] text-white border-[#1E1E1E]'
                              : 'bg-[#FAF8F5] text-[#57534E] border-[#DFD9CE] hover:text-[#1E1E1E]'
                          }`}
                        >
                          <ArrowLeftRight className="w-3 h-3" />
                          <span>{isComparing ? 'Comparing' : 'Compare'}</span>
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono text-[#7A756D] pt-1">
                        <button
                          onClick={() => handleOpenCheaper(product)}
                          className="hover:underline text-[#8B9B88] flex items-center gap-1"
                        >
                          <TrendingDown className="w-3 h-3" />
                          <span>Cheaper alternatives</span>
                        </button>
                        <a
                          href={product.productUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline flex items-center gap-1 text-[#1E1E1E]"
                        >
                          <span>Store</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* COMPARISON MODAL */}
        {isCompareModalOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
            onClick={() => setIsCompareModalOpen(false)}
          >
            <div
              className="bg-[#FAF8F5] border border-[#DFD9CE] max-w-4xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between pb-3 border-b border-[#EAE6DF]">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#8B9B88]">Spatial Specifications</span>
                  <h3 className="font-serif font-bold text-lg text-[#1E1E1E]">Product Side-by-Side Comparison</h3>
                </div>
                <button
                  onClick={() => setIsCompareModalOpen(false)}
                  className="text-[#7A756D] hover:text-[#1E1E1E] p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                {compareItems.map((item) => (
                  <div key={item.id} className="p-4 bg-white border border-[#DFD9CE] space-y-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full aspect-[4/3] object-cover border border-[#DFD9CE]"
                    />
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#7A756D]">{item.retailer}</span>
                      <h4 className="font-serif font-semibold text-sm text-[#1E1E1E]">{item.name}</h4>
                      <p className="font-mono font-bold text-base text-[#1E1E1E] mt-1">{formatPrice(item.price)}</p>
                    </div>

                    <div className="space-y-1.5 text-xs border-t border-[#EAE6DF] pt-3">
                      <p><span className="text-[#7A756D] font-mono">Category:</span> {item.category}</p>
                      <p><span className="text-[#7A756D] font-mono">Dimensions:</span> {item.dimensions}</p>
                      <p><span className="text-[#7A756D] font-mono">Material:</span> {item.material}</p>
                      <p><span className="text-[#7A756D] font-mono">Color:</span> {item.color}</p>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => {
                          addProductToProject(item.id);
                          setIsCompareModalOpen(false);
                        }}
                        className="w-full py-2 text-xs font-mono uppercase bg-[#1E1E1E] text-white hover:bg-[#333333] transition-colors"
                      >
                        Add to Room
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CHEAPER ALTERNATIVES MODAL */}
        <CheaperAlternativesModal
          isOpen={alternativesModalOpen}
          onClose={() => setAlternativesModalOpen(false)}
          data={cheaperData}
        />
      </div>
    </div>
  );
};
