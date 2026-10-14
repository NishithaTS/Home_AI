import React, { useState, useRef, useCallback } from 'react';
import { Maximize2, Minimize2, Sparkles, SlidersHorizontal, Eye } from 'lucide-react';
import { Product } from '../types';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  isAiGenerating?: boolean;
  stageMessage?: string;
  hotspots?: { product: Product; x: number; y: number }[];
  onSelectHotspot?: (product: Product) => void;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'Original Space',
  afterLabel = 'AI Design Concept',
  isAiGenerating = false,
  stageMessage = 'Synthesizing spatial lighting...',
  hotspots = [],
  onSelectHotspot,
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [activeHotspot, setActiveHotspot] = useState<Product | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percentage);
    },
    []
  );

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      className={`relative select-none overflow-hidden transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-black flex items-center justify-center p-4'
          : 'w-full aspect-[16/10] sm:aspect-[16/9] bg-[#1E1E1E] border border-[#DFD9CE]'
      }`}
    >
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-hidden cursor-ew-resize group"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
      >
        {/* AFTER IMAGE (AI Rendered Design - Base Layer) */}
        <img
          src={afterImage}
          alt={afterLabel}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* BEFORE IMAGE (Original Uploaded Room - Clipped Layer) */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={beforeImage}
            alt={beforeLabel}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover max-w-none"
            style={{ width: containerRef.current?.clientWidth || '100%' }}
          />
        </div>

        {/* SLIDER DIVIDER LINE */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.6)] pointer-events-none z-20 flex items-center justify-center"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="w-8 h-8 rounded-full bg-white/95 text-[#1E1E1E] shadow-xl flex items-center justify-center border border-black/10 backdrop-blur-sm pointer-events-auto cursor-ew-resize transform -translate-x-1/2 hover:scale-110 active:scale-95 transition-transform">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* LABELS OVERLAY */}
        <div className="absolute top-3 left-3 z-10 pointer-events-none">
          <span className="text-[11px] font-mono tracking-wider uppercase px-2.5 py-1 bg-black/60 text-white/90 backdrop-blur-md border border-white/10">
            {beforeLabel}
          </span>
        </div>
        <div className="absolute top-3 right-3 z-10 pointer-events-none">
          <span className="text-[11px] font-mono tracking-wider uppercase px-2.5 py-1 bg-[#8B9B88]/90 text-white font-medium backdrop-blur-md border border-white/20 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#FAF8F5]" />
            {afterLabel}
          </span>
        </div>

        {/* INTERACTIVE PRODUCT HOTSPOTS (On AI Side) */}
        {showHotspots && !isAiGenerating && hotspots.map((spot, idx) => {
          // Only show if the slider reveals this side
          if (spot.x < sliderPosition) return null;
          return (
            <div
              key={idx}
              className="absolute z-30 transform -translate-x-1/2 -translate-y-1/2 group/pin pointer-events-auto"
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              onClick={(e) => {
                e.stopPropagation();
                setActiveHotspot(spot.product);
                if (onSelectHotspot) onSelectHotspot(spot.product);
              }}
            >
              <button
                className="w-5 h-5 rounded-full bg-white/90 text-[#1E1E1E] shadow-lg flex items-center justify-center border border-black/20 hover:scale-125 transition-transform"
                title={spot.product.name}
              >
                <span className="w-2 h-2 rounded-full bg-[#1E1E1E]" />
              </button>

              {/* Pin Tooltip Card */}
              <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 hidden group-hover/pin:block w-48 p-2.5 bg-[#1E1E1E]/95 text-white shadow-xl text-left border border-white/10 backdrop-blur-md pointer-events-auto">
                <p className="text-[10px] font-mono text-[#8B9B88] uppercase">{spot.product.retailer}</p>
                <p className="text-xs font-semibold leading-tight truncate">{spot.product.name}</p>
                <p className="text-xs text-white/80 font-mono mt-1">₹{spot.product.price.toLocaleString('en-IN')}</p>
              </div>
            </div>
          );
        })}

        {/* AI GENERATION SKELETON / LOADING OVERLAY */}
        {isAiGenerating && (
          <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-white text-center animate-in fade-in duration-300">
            <div className="w-12 h-12 mb-4 border-2 border-white/20 border-t-[#8B9B88] rounded-full animate-spin" />
            <h4 className="text-base font-serif font-medium tracking-wide">Refining Spatial Design</h4>
            <p className="text-xs text-white/70 max-w-sm mt-1.5 font-mono">{stageMessage}</p>
            <div className="mt-4 flex items-center gap-2 text-[11px] text-white/50 font-mono">
              <span>Lighting calibration</span>
              <span>·</span>
              <span>Material rendering</span>
              <span>·</span>
              <span>Catalog alignment</span>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER BAR OF THE SLIDER */}
      <div className="absolute bottom-3 right-3 z-30 flex items-center gap-2">
        <button
          onClick={() => setShowHotspots(!showHotspots)}
          className={`px-2.5 py-1 text-xs font-mono flex items-center gap-1.5 backdrop-blur-md transition-colors ${
            showHotspots
              ? 'bg-white/90 text-[#1E1E1E]'
              : 'bg-black/60 text-white/70 hover:text-white'
          }`}
          title="Toggle Product Hotspots"
        >
          <Eye className="w-3 h-3" />
          <span>{showHotspots ? 'Pins On' : 'Pins Off'}</span>
        </button>

        <button
          onClick={toggleFullscreen}
          className="p-1.5 bg-black/60 text-white/80 hover:text-white backdrop-blur-md transition-colors"
          title={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
