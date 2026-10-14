import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { InteriorStyle, RoomType } from '../types';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { currency, formatPrice } = useProject();

  const [step, setStep] = useState(1);
  const [selectedStyle, setSelectedStyle] = useState<InteriorStyle>('Scandinavian');
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType>('living_room');
  const [budgetTier, setBudgetTier] = useState<number>(65000);
  const [selectedColors, setSelectedColors] = useState<string[]>(['#FAF8F5', '#8B9B88', '#EAE4D9', '#2A2C2B']);
  const [spatialPriority, setSpatialPriority] = useState<string>('Spacious & Airy Flow');

  const styles: { name: InteriorStyle; desc: string; image: string }[] = [
    {
      name: 'Scandinavian',
      desc: 'Light woods, warm neutrals, organic forms, and functional simplicity.',
      image: '/src/assets/images/hero_scandinavian_interior_1791952558825.jpg',
    },
    {
      name: 'Japandi',
      desc: 'Wabi-sabi aesthetics, low-profile furniture, muted tones, and paper lighting.',
      image: '/src/assets/images/project_japandi_living_room_1791952559603.jpg',
    },
    {
      name: 'Mid-Century Modern',
      desc: 'Rich walnut, tapered legs, sculptural silhouettes, and playful accents.',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Contemporary Minimalist',
      desc: 'Clean lines, architectural negative space, neutral monochrome, and monolithic forms.',
      image: '/src/assets/images/project_modern_terrace_patio_1791952560447.jpg',
    },
    {
      name: 'Boho Earthy',
      desc: 'Natural jute, terracotta pots, abundant indoor plants, and layered textiles.',
      image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Industrial Chic',
      desc: 'Raw metal accents, exposed brick, reclaimed wood, and utilitarian fixtures.',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const roomTypes: { type: RoomType; label: string; defaultSqFt: string }[] = [
    { type: 'living_room', label: 'Living Room', defaultSqFt: '300 – 450 sq ft' },
    { type: 'bedroom', label: 'Master Bedroom', defaultSqFt: '200 – 320 sq ft' },
    { type: 'dining_room', label: 'Dining Space', defaultSqFt: '160 – 260 sq ft' },
    { type: 'home_office', label: 'Home Studio / Office', defaultSqFt: '120 – 200 sq ft' },
    { type: 'patio_terrace', label: 'Patio & Balcony Terrace', defaultSqFt: '180 – 400 sq ft' },
  ];

  const colorPalettes = [
    { name: 'Warm Nordic (Chalk & Sage)', colors: ['#FAF8F5', '#8B9B88', '#EAE4D9', '#2A2C2B'] },
    { name: 'Earth & Clay (Terracotta & Sand)', colors: ['#F5EFE6', '#BA7053', '#DFD3C3', '#4A3E3D'] },
    { name: 'Serene Plaster (Japandi Ash)', colors: ['#F2EEE6', '#C7BCAB', '#4A463F', '#8C9A86'] },
    { name: 'Deep Oceanic (Teal & Brass)', colors: ['#FAF8F5', '#3D6466', '#D4AF37', '#1E2322'] },
  ];

  const handleFinishOnboarding = () => {
    // Navigate to new project page with query state
    const params = new URLSearchParams({
      style: selectedStyle,
      roomType: selectedRoomType,
      budget: budgetTier.toString(),
      palette: JSON.stringify(selectedColors),
      priority: spatialPriority,
    });
    navigate(`/projects/new?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E1E1E] py-12 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between text-xs font-mono text-[#7A756D] mb-2 uppercase">
            <span>Step {step} of 4</span>
            <span>
              {step === 1 && 'Architectural Style'}
              {step === 2 && 'Room Dimensions'}
              {step === 3 && 'Palette & Mood'}
              {step === 4 && 'Budget Alignment'}
            </span>
          </div>
          <div className="w-full h-1 bg-[#EAE6DF]">
            <div
              className="h-full bg-[#1E1E1E] transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: STYLE */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1E1E1E]">
                What architectural aesthetic resonates with you?
              </h2>
              <p className="text-xs text-[#57534E] mt-1">
                Select your primary style philosophy. Homie.AI will tailor spatial volumes and materials accordingly.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {styles.map((s) => {
                const isSelected = selectedStyle === s.name;
                return (
                  <button
                    key={s.name}
                    onClick={() => setSelectedStyle(s.name)}
                    className={`p-3 text-left border transition-all flex flex-col justify-between bg-white group ${
                      isSelected
                        ? 'border-[#1E1E1E] ring-1 ring-[#1E1E1E] shadow-sm'
                        : 'border-[#DFD9CE] hover:border-[#8B9B88]'
                    }`}
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-[#EAE6DF] mb-3 relative">
                      <img
                        src={s.image}
                        alt={s.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-[#1E1E1E] text-white flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-serif font-semibold text-sm text-[#1E1E1E]">{s.name}</p>
                      <p className="text-[11px] text-[#57534E] mt-1 leading-relaxed">{s.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: ROOM TYPE & SPATIAL GOAL */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1E1E1E]">
                Which room are we designing today?
              </h2>
              <p className="text-xs text-[#57534E] mt-1">
                Tell us about your space. We balance clearance, door swings, and focal orientation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {roomTypes.map((r) => {
                const isSelected = selectedRoomType === r.type;
                return (
                  <button
                    key={r.type}
                    onClick={() => setSelectedRoomType(r.type)}
                    className={`p-4 text-left border transition-all flex items-center justify-between bg-white ${
                      isSelected
                        ? 'border-[#1E1E1E] ring-1 ring-[#1E1E1E]'
                        : 'border-[#DFD9CE] hover:border-[#8B9B88]'
                    }`}
                  >
                    <div>
                      <p className="font-serif font-semibold text-sm text-[#1E1E1E]">{r.label}</p>
                      <p className="text-xs text-[#7A756D] font-mono mt-0.5">{r.defaultSqFt}</p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#8B9B88]" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-[#EAE6DF]">
              <p className="text-xs font-mono uppercase text-[#7A756D] mb-3">Primary Spatial Priority:</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {['Spacious & Airy Flow', 'Cozy Social Gatherings', 'Multi-Functional Work & Rest'].map((priority) => (
                  <button
                    key={priority}
                    onClick={() => setSpatialPriority(priority)}
                    className={`p-3 text-xs border text-left font-medium transition-colors ${
                      spatialPriority === priority
                        ? 'bg-[#1E1E1E] text-white border-[#1E1E1E]'
                        : 'bg-white text-[#4A4742] border-[#DFD9CE] hover:border-[#8B9B88]'
                    }`}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: COLOR PALETTE */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1E1E1E]">
                Select your color harmony and material palette
              </h2>
              <p className="text-xs text-[#57534E] mt-1">
                Colors are balanced using the 60-30-10 interior rule: 60% dominant walls, 30% upholstery, 10% accent metals.
              </p>
            </div>

            <div className="space-y-3">
              {colorPalettes.map((p) => {
                const isSelected = JSON.stringify(selectedColors) === JSON.stringify(p.colors);
                return (
                  <button
                    key={p.name}
                    onClick={() => setSelectedColors(p.colors)}
                    className={`w-full p-4 text-left border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white ${
                      isSelected
                        ? 'border-[#1E1E1E] ring-1 ring-[#1E1E1E]'
                        : 'border-[#DFD9CE] hover:border-[#8B9B88]'
                    }`}
                  >
                    <div>
                      <p className="font-serif font-semibold text-sm text-[#1E1E1E]">{p.name}</p>
                      <p className="text-[11px] text-[#7A756D] font-mono mt-0.5">Harmonized pigments</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {p.colors.map((c, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded border border-black/10 shadow-xs"
                          style={{ backgroundColor: c }}
                          title={c}
                        />
                      ))}
                      {isSelected && <Check className="w-4 h-4 text-[#8B9B88] ml-2" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: BUDGET RANGE */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1E1E1E]">
                Set your project investment budget
              </h2>
              <p className="text-xs text-[#57534E] mt-1">
                Our engine ensures 100% of selected furnishings, delivery, and taxes remain within this figure.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Essential Comfort', amount: 35000, desc: 'Smart durable essentials from IKEA & Article' },
                { label: 'Architectural Balance', amount: 65000, desc: 'Curated mix of Muuto, West Elm & solid hardwoods' },
                { label: 'Luxury Direct-to-Consumer', amount: 110000, desc: 'Honed travertine, bouclé, and heirloom joinery' },
              ].map((tier) => {
                const isSelected = budgetTier === tier.amount;
                return (
                  <button
                    key={tier.amount}
                    onClick={() => setBudgetTier(tier.amount)}
                    className={`p-5 text-left border transition-all flex flex-col justify-between bg-white ${
                      isSelected
                        ? 'border-[#1E1E1E] ring-1 ring-[#1E1E1E] bg-[#FAF8F5]'
                        : 'border-[#DFD9CE] hover:border-[#8B9B88]'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#7A756D]">Tier</span>
                      <p className="font-serif font-semibold text-sm text-[#1E1E1E] mt-0.5">{tier.label}</p>
                      <p className="text-xs text-[#57534E] mt-2 leading-relaxed">{tier.desc}</p>
                    </div>
                    <div className="pt-4 border-t border-[#EAE6DF] mt-4 font-mono font-bold text-base text-[#1E1E1E]">
                      {formatPrice(tier.amount)}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-4 bg-[#F2EDE4] border border-[#DFD9CE]">
              <label className="block text-xs font-mono uppercase text-[#7A756D] mb-1.5">
                Or enter custom budget:
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono font-bold">{currency === 'INR' ? '₹' : '$'}</span>
                <input
                  type="number"
                  value={budgetTier}
                  onChange={(e) => setBudgetTier(Math.max(5000, Number(e.target.value)))}
                  className="w-full text-sm font-mono px-3 py-2 bg-white border border-[#DFD9CE] focus:border-[#1E1E1E] focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* NAVIGATION BUTTONS */}
        <div className="mt-10 pt-6 border-t border-[#EAE6DF] flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs font-mono uppercase text-[#57534E] hover:text-[#1E1E1E] flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-2.5 text-xs font-mono uppercase tracking-wider bg-[#1E1E1E] text-white hover:bg-[#333333] transition-colors flex items-center gap-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinishOnboarding}
              className="px-6 py-2.5 text-xs font-mono uppercase tracking-wider bg-[#1E1E1E] text-white hover:bg-[#333333] transition-colors flex items-center gap-2 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Proceed to Room Upload</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
