import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import {
  UploadCloud,
  X,
  RefreshCw,
  Sparkles,
  Check,
  AlertCircle,
  Image as ImageIcon,
  Sliders,
  HelpCircle,
  Eye,
} from 'lucide-react';
import { RoomType, InteriorStyle, DesignRevision } from '../types';

export const NewProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { createProject, currency, formatPrice } = useProject();

  // Read query params from onboarding if provided
  const queryStyle = (searchParams.get('style') as InteriorStyle) || 'Scandinavian';
  const queryRoomType = (searchParams.get('roomType') as RoomType) || 'living_room';
  const queryBudget = Number(searchParams.get('budget')) || 65000;
  let queryPalette = ['#FAF8F5', '#8B9B88', '#EAE4D9', '#2A2C2B'];
  try {
    if (searchParams.get('palette')) {
      queryPalette = JSON.parse(searchParams.get('palette')!);
    }
  } catch (e) {}

  // Form State
  const [title, setTitle] = useState('My Living Room Transformation');
  const [roomType, setRoomType] = useState<RoomType>(queryRoomType);
  const [style, setStyle] = useState<InteriorStyle>(queryStyle);
  const [budget, setBudget] = useState<number>(queryBudget);
  const [dimensions, setDimensions] = useState({ width: 15, length: 20, height: 9.5, unit: 'ft' as 'ft' | 'm' });
  const [colorPalette, setColorPalette] = useState<string[]>(queryPalette);
  const [preserveItems, setPreserveItems] = useState<string>('Hardwood flooring, floor-to-ceiling balcony windows');
  const [designInstructions, setDesignInstructions] = useState(
    'Emphasize natural morning daylight, comfortable conversational seating, and clean sculptural lines.'
  );

  // Image Upload State
  const [imagePreview, setImagePreview] = useState<string>(
    '/src/assets/images/hero_scandinavian_interior_1791952558825.jpg'
  );
  const [imageName, setImageName] = useState<string>('sample_living_room.jpg');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Analysis Lifecycle Stages
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processingStages = [
    'Validating image format & architectural boundaries...',
    'Analyzing natural daylight orientation & ambient lumens...',
    'Mapping spatial circulation clearance & room geometry...',
    'Synthesizing personalized architectural concepts & catalog...',
  ];

  // Presets for quick selection
  const roomPresets = [
    {
      title: 'Scandinavian Wishbone Living',
      image: '/src/assets/images/hero_scandinavian_interior_1791952558825.jpg',
      style: 'Scandinavian' as InteriorStyle,
      roomType: 'living_room' as RoomType,
      palette: ['#FAF8F5', '#E3DDD1', '#7A8B7B', '#222321'],
    },
    {
      title: 'Serene Japandi Pavilion',
      image: '/src/assets/images/project_japandi_living_room_1791952559603.jpg',
      style: 'Japandi' as InteriorStyle,
      roomType: 'living_room' as RoomType,
      palette: ['#F2EEE6', '#C7BCAB', '#4A463F', '#8C9A86'],
    },
    {
      title: 'Architectural Skyline Terrace',
      image: '/src/assets/images/project_modern_terrace_patio_1791952560447.jpg',
      style: 'Contemporary Minimalist' as InteriorStyle,
      roomType: 'patio_terrace' as RoomType,
      palette: ['#282A2E', '#9E9484', '#D4AF37', '#FAF7F2'],
    },
    {
      title: 'Cozy Sunset Botanical Salon',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
      style: 'Mid-Century Modern' as InteriorStyle,
      roomType: 'living_room' as RoomType,
      palette: ['#FAF8F5', '#C47B5A', '#3D3731', '#7A8B7B'],
    },
    {
      title: 'Teal & Brass Modern Lounge',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
      style: 'Contemporary Minimalist' as InteriorStyle,
      roomType: 'living_room' as RoomType,
      palette: ['#FAF8F5', '#3D6466', '#D4AF37', '#1E2322'],
    },
  ];

  const handleFileChange = (file: File) => {
    setUploadError(null);
    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload an image file (JPEG, PNG, WebP).');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setUploadError('Image size exceeds 20MB limit. Please upload a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImagePreview(reader.result);
        setImageName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSelectPreset = (p: typeof roomPresets[0]) => {
    setImagePreview(p.image);
    setImageName(p.title);
    setStyle(p.style);
    setRoomType(p.roomType);
    setColorPalette(p.palette);
    setTitle(p.title);
  };

  const handleAnalyzeRoom = async () => {
    if (!imagePreview) {
      setUploadError('Please select or upload a room photograph first.');
      return;
    }

    setIsAnalyzing(true);
    setCurrentStageIndex(0);

    // Multi-stage indicator intervals
    const stageTimer1 = setTimeout(() => setCurrentStageIndex(1), 900);
    const stageTimer2 = setTimeout(() => setCurrentStageIndex(2), 2200);
    const stageTimer3 = setTimeout(() => setCurrentStageIndex(3), 3600);

    try {
      // 1. Submit image to /api/rooms/analyze
      const analyzeRes = await fetch('/api/rooms/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomImage: imagePreview,
          roomType,
          style,
          dimensions,
          budget,
          preserveFurniture: preserveItems.split(',').map((s) => s.trim()),
          designInstructions,
        }),
      });

      const analyzeData = await analyzeRes.json();
      const aiAnalysis = analyzeData.analysis || {
        architecturalElements: ['Balanced natural exposure', 'Key focal wall'],
        lightingConditions: 'Generous ambient natural daylight',
        spatialOpportunities: ['Centrally grouped conversational cluster'],
        recommendedLayout: 'Central social island with clear perimeter walkways',
        colorHarmonies: colorPalette,
      };

      // 2. Generate Initial Version 1
      const initialVersion: DesignRevision = {
        id: `rev-${Date.now()}`,
        versionNumber: 1,
        name: `Concept 1: ${style} Master Plan`,
        summary: `Harmonious ${style} interior concept tailored to your ${dimensions.width}x${dimensions.length} ${dimensions.unit} space.`,
        renderedImage: imagePreview,
        prompt: `High-fidelity architectural photograph of a ${style} ${roomType.replace('_', ' ')} with ${colorPalette[0]} walls.`,
        wallColor: colorPalette[0] || '#FAF8F5',
        furnitureStyle: style,
        lightingMood: 'Natural Daylit (4000K)',
        layoutStrategy: 'Central Social Island',
        decorDensity: 'Balanced',
        aiAnalysis,
        timestamp: new Date().toISOString(),
      };

      // 3. Create Project record
      const created = await createProject({
        title: title || `${style} ${roomType.replace('_', ' ')}`,
        roomType,
        dimensions,
        style,
        colorPalette,
        budget,
        currency,
        preserveFurniture: preserveItems.split(',').map((s) => s.trim()),
        designInstructions,
        roomImage: imagePreview,
        roomImageName: imageName,
        versions: [initialVersion],
        activeVersionIndex: 0,
        selectedProductIds:
          style === 'Japandi'
            ? ['prod-chair-japandi-canvas', 'prod-table-oak-round', 'prod-light-washi-lantern', 'prod-rug-jute-woven']
            : style === 'Contemporary Minimalist'
            ? ['prod-outdoor-modular-teak', 'prod-outdoor-fire-bowl', 'prod-decor-fiddle-fig']
            : ['prod-sofa-boucle-cloud', 'prod-chair-wishbone-oak', 'prod-table-travertine-organic', 'prod-light-ceramic-table', 'prod-decor-fiddle-fig'],
        customProductQuantities: {},
      });

      // Clear timers
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      clearTimeout(stageTimer3);

      // Navigate to interactive studio
      navigate(`/projects/${created.id}`);
    } catch (err: any) {
      console.error(err);
      setUploadError('Failed to analyze room. Please try again or choose a preset.');
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E1E1E] py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#7A756D] mb-1">
            <span>HOMIE.AI ENGINE</span>
            <span>·</span>
            <span>SPATIAL ROOM SETUP</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-medium text-[#1E1E1E]">
            Upload & Analyze Your Room
          </h1>
          <p className="text-sm text-[#57534E] mt-1 max-w-2xl">
            Upload a clear photograph of your current space or choose an architectural room template. Homie.AI analyzes dimensions, architectural orientation, and builds a live shopping model.
          </p>
        </div>

        {/* Two-column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: UPLOAD & PREVIEW */}
          <div className="lg:col-span-6 space-y-6">
            {/* Upload Box */}
            <div
              className={`border-2 border-dashed p-6 text-center transition-all bg-white relative ${
                isDragging
                  ? 'border-[#1E1E1E] bg-[#F2EDE4]'
                  : imagePreview
                  ? 'border-[#DFD9CE]'
                  : 'border-[#DFD9CE] hover:border-[#8B9B88]'
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                className="hidden"
              />

              {imagePreview ? (
                <div className="space-y-4">
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#EAE6DF] border border-[#DFD9CE]">
                    <img
                      src={imagePreview}
                      alt="Room Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-2">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2.5 py-1 text-xs font-mono bg-black/75 hover:bg-black text-white backdrop-blur-sm transition-colors"
                      >
                        Replace Photo
                      </button>
                      <button
                        onClick={() => {
                          setImagePreview('');
                          setImageName('');
                        }}
                        className="p-1 bg-black/75 hover:bg-black text-white backdrop-blur-sm transition-colors"
                        title="Remove Photo"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#7A756D] font-mono">
                    <span className="truncate max-w-[240px]">{imageName}</span>
                    <span className="text-[#8B9B88] font-medium flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Ready for AI Analysis
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-10 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#F2EDE4] text-[#1E1E1E] flex items-center justify-center mx-auto">
                    <UploadCloud className="w-6 h-6 text-[#7A756D]" />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-sm font-semibold text-[#1E1E1E] hover:underline"
                    >
                      Click to choose photograph
                    </button>
                    <p className="text-xs text-[#7A756D] mt-1">or drag and drop your room file here</p>
                  </div>
                  <p className="text-[11px] font-mono text-[#9C968B]">PNG, JPG, WebP up to 20MB</p>
                </div>
              )}

              {uploadError && (
                <div className="mt-3 p-2.5 bg-[#C47B5A]/10 border border-[#C47B5A]/30 text-[#C47B5A] text-xs flex items-center gap-2 text-left">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>

            {/* Quick Presets Strip */}
            <div className="p-4 bg-white border border-[#DFD9CE]">
              <p className="text-xs font-mono uppercase text-[#7A756D] mb-3">
                Or select an architectural room template:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {roomPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="p-1.5 text-left border border-[#DFD9CE] hover:border-[#1E1E1E] transition-all bg-[#FAF8F5] group"
                  >
                    <img
                      src={preset.image}
                      alt={preset.title}
                      referrerPolicy="no-referrer"
                      className="w-full aspect-[4/3] object-cover mb-1.5 bg-[#EAE6DF]"
                    />
                    <p className="text-[11px] font-medium text-[#1E1E1E] leading-tight truncate">
                      {preset.title}
                    </p>
                    <p className="text-[9px] font-mono text-[#7A756D]">{preset.style}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: PROJECT ATTRIBUTES & PREFERENCES */}
          <div className="lg:col-span-6 bg-white border border-[#DFD9CE] p-6 space-y-6">
            <h3 className="font-serif font-semibold text-lg text-[#1E1E1E] pb-3 border-b border-[#EAE6DF]">
              Space Specifications & Design Brief
            </h3>

            {/* Project Name */}
            <div>
              <label className="block text-xs font-mono uppercase text-[#7A756D] mb-1.5">
                Project Name
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-[#FAF8F5] border border-[#DFD9CE] focus:border-[#1E1E1E] focus:outline-none"
              />
            </div>

            {/* Room Type & Style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#7A756D] mb-1.5">
                  Room Type
                </label>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value as RoomType)}
                  className="w-full text-xs px-3 py-2 bg-[#FAF8F5] border border-[#DFD9CE] focus:border-[#1E1E1E] focus:outline-none"
                >
                  <option value="living_room">Living Room</option>
                  <option value="bedroom">Master Bedroom</option>
                  <option value="dining_room">Dining Space</option>
                  <option value="home_office">Home Studio / Office</option>
                  <option value="patio_terrace">Patio & Terrace</option>
                  <option value="kitchen">Kitchen Lounge</option>
                </select>
              </div>

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
            </div>

            {/* Dimensions */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono uppercase text-[#7A756D]">
                  Room Dimensions
                </label>
                <div className="flex items-center gap-1 text-[11px] font-mono">
                  <button
                    type="button"
                    onClick={() => setDimensions({ ...dimensions, unit: 'ft' })}
                    className={`px-1.5 py-0.5 ${dimensions.unit === 'ft' ? 'bg-[#1E1E1E] text-white' : 'text-[#7A756D]'}`}
                  >
                    Feet
                  </button>
                  <button
                    type="button"
                    onClick={() => setDimensions({ ...dimensions, unit: 'm' })}
                    className={`px-1.5 py-0.5 ${dimensions.unit === 'm' ? 'bg-[#1E1E1E] text-white' : 'text-[#7A756D]'}`}
                  >
                    Meters
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-[10px] text-[#7A756D] font-mono">Width</span>
                  <input
                    type="number"
                    value={dimensions.width}
                    onChange={(e) => setDimensions({ ...dimensions, width: Number(e.target.value) })}
                    className="w-full text-xs px-2.5 py-1.5 bg-[#FAF8F5] border border-[#DFD9CE] font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-[#7A756D] font-mono">Length</span>
                  <input
                    type="number"
                    value={dimensions.length}
                    onChange={(e) => setDimensions({ ...dimensions, length: Number(e.target.value) })}
                    className="w-full text-xs px-2.5 py-1.5 bg-[#FAF8F5] border border-[#DFD9CE] font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-[#7A756D] font-mono">Ceiling</span>
                  <input
                    type="number"
                    step="0.5"
                    value={dimensions.height}
                    onChange={(e) => setDimensions({ ...dimensions, height: Number(e.target.value) })}
                    className="w-full text-xs px-2.5 py-1.5 bg-[#FAF8F5] border border-[#DFD9CE] font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Target Budget */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono uppercase text-[#7A756D]">
                  Target Investment Budget
                </label>
                <span className="text-xs font-mono font-bold text-[#1E1E1E]">{formatPrice(budget)}</span>
              </div>
              <input
                type="range"
                min="20000"
                max="250000"
                step="5000"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-[#1E1E1E] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#7A756D] mt-1">
                <span>{formatPrice(20000)} (Starter)</span>
                <span>{formatPrice(65000)} (Balanced)</span>
                <span>{formatPrice(250000)} (Luxury)</span>
              </div>
            </div>

            {/* Preserved Furniture */}
            <div>
              <label className="block text-xs font-mono uppercase text-[#7A756D] mb-1.5">
                Existing Elements to Preserve
              </label>
              <input
                type="text"
                value={preserveItems}
                onChange={(e) => setPreserveItems(e.target.value)}
                placeholder="e.g. Existing oak flooring, large balcony door, ceiling fan"
                className="w-full text-xs px-3 py-2 bg-[#FAF8F5] border border-[#DFD9CE] focus:border-[#1E1E1E] focus:outline-none"
              />
            </div>

            {/* Free-text Design Instructions */}
            <div>
              <label className="block text-xs font-mono uppercase text-[#7A756D] mb-1.5">
                Design Instructions & Mood
              </label>
              <textarea
                rows={3}
                value={designInstructions}
                onChange={(e) => setDesignInstructions(e.target.value)}
                placeholder="Describe your desired feeling, textures, and activities in this room..."
                className="w-full text-xs px-3 py-2 bg-[#FAF8F5] border border-[#DFD9CE] focus:border-[#1E1E1E] focus:outline-none"
              />
            </div>

            {/* ANALYZE BUTTON & STAGES */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleAnalyzeRoom}
                disabled={isAnalyzing || !imagePreview}
                className="w-full py-3.5 text-xs font-mono uppercase tracking-wider bg-[#1E1E1E] text-white hover:bg-[#333333] disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#8B9B88]" />
                    <span>Analyzing Room Architecture...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <span>Analyze My Room</span>
                  </>
                )}
              </button>

              {/* Real processing stages breakdown */}
              {isAnalyzing && (
                <div className="mt-4 p-3.5 bg-[#FAF8F5] border border-[#DFD9CE] space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#7A756D]">
                    <span>Stage {currentStageIndex + 1} of 4</span>
                    <span className="text-[#8B9B88] font-medium">Processing multimodal data</span>
                  </div>
                  <div className="w-full h-1 bg-[#EAE6DF]">
                    <div
                      className="h-full bg-[#8B9B88] transition-all duration-500"
                      style={{ width: `${((currentStageIndex + 1) / 4) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs font-mono text-[#1E1E1E] pt-1">
                    {processingStages[currentStageIndex]}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
