import { Project } from '../types';

export const PRESET_PROJECTS: Project[] = [
  {
    id: 'proj-scandinavian-sanctuary',
    title: 'Sunlit Scandinavian Living Room',
    roomType: 'living_room',
    dimensions: {
      width: 16,
      length: 22,
      height: 9.5,
      unit: 'ft',
    },
    style: 'Scandinavian',
    colorPalette: ['#FAF8F5', '#E3DDD1', '#7A8B7B', '#222321'],
    budget: 85000,
    currency: 'INR',
    preserveFurniture: [
      'Original Herringbone Oak Flooring',
      'Floor-to-ceiling sheer linen curtains',
      'Built-in alcove shelving',
    ],
    designInstructions:
      'Maximal natural daylight, tactile bouclé upholstery, organic travertine coffee table, and lush botanical accents.',
    roomImage: '/src/assets/images/hero_scandinavian_interior_1791952558825.jpg',
    roomImageName: 'living_room_original.jpg',
    isPreset: true,
    activeVersionIndex: 0,
    selectedProductIds: [
      'prod-sofa-boucle-cloud',
      'prod-chair-wishbone-oak',
      'prod-table-travertine-organic',
      'prod-light-ceramic-table',
      'prod-decor-fiddle-fig',
    ],
    customProductQuantities: {
      'prod-sofa-boucle-cloud': 1,
      'prod-chair-wishbone-oak': 1,
      'prod-table-travertine-organic': 1,
      'prod-light-ceramic-table': 1,
      'prod-decor-fiddle-fig': 1,
    },
    purchasedProductIds: [],
    isApproved: false,
    shortlistNotes:
      'Client loves the organic travertine coffee table. Requested testing a version with sage green walls and compact seating.',
    favorites: ['prod-sofa-boucle-cloud', 'prod-table-travertine-organic'],
    createdAt: '2026-10-10T14:20:00Z',
    updatedAt: '2026-10-12T09:15:00Z',
    versions: [
      {
        id: 'rev-scan-v1',
        versionNumber: 1,
        name: 'Concept Alpha: Warm Travertine & Bouclé',
        summary:
          'Open conversational layout centered around the low organic travertine table, framing garden daylight with tactile linen textures.',
        renderedImage:
          '/src/assets/images/hero_scandinavian_interior_1791952558825.jpg',
        prompt:
          'Scandinavian warm minimalist living room with curved cream bouclé sofa, travertine coffee table, wishbone chair, terracotta potted fiddle leaf fig, gentle natural sunlight.',
        wallColor: '#F5F3EF',
        furnitureStyle: 'Organic Nordic Modern',
        lightingMood: 'Natural Daylit (4000K)',
        layoutStrategy: 'Central Social Island',
        decorDensity: 'Balanced',
        aiAnalysis: {
          architecturalElements: [
            'Expansive dual-aspect floor-to-ceiling windows with eastern exposure',
            'Solid oak herringbone floor with warm satin polyurethane seal',
            'Recessed ceiling timber beams and recessed picture rail shelving',
          ],
          lightingConditions:
            'Generous indirect eastern morning sun with soft diffused daylight throughout afternoon.',
          spatialOpportunities: [
            'Anchor the 3-seater sofa 18 inches off the wall to establish an airy floating perimeter corridor',
            'Position the sculptural Wishbone chair opposite the window to bounce natural light through open cord backrest',
            'Utilize the built-in alcove for low-heat LED library downlighting',
          ],
          recommendedLayout:
            'Centralized conversational island with unobstructed sightline toward terrace garden.',
          colorHarmonies: [
            'Warm Chalk (#F5F3EF)',
            'Travertine Sand (#E3DDD1)',
            'Sage Botanical (#7A8B7B)',
            'Muted Terracotta (#BA7053)',
          ],
          estimatedSquareFeet: 352,
        },
        timestamp: '2026-10-10T14:25:00Z',
      },
      {
        id: 'rev-scan-v2',
        versionNumber: 2,
        name: 'Concept Beta: Muted Sage & Brass Accents',
        summary:
          'Sage green accent feature wall with brushed brass floor illumination and refined fluted oak credenza storage.',
        renderedImage:
          'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80',
        prompt:
          'Sophisticated Scandinavian living room with sage green accent wall, fluted oak console, warm 2700K ambient lighting and minimalist linen seating.',
        wallColor: '#7A8B7B',
        furnitureStyle: 'Refined Nordic Minimalist',
        lightingMood: 'Warm Ambient (2700K)',
        layoutStrategy: 'Framed Focus Wall',
        decorDensity: 'Minimalist',
        aiAnalysis: {
          architecturalElements: [
            'Feature wall primed for velvety matte lime-wash paint',
            'Direct acoustic dampening via thick textured ribbed wool rug',
          ],
          lightingConditions:
            'Warm 2700K ambient glow balancing cooler natural exterior light.',
          spatialOpportunities: [
            'Credenza provides clean cable management and concealed audio equipment',
          ],
          recommendedLayout: 'Asymmetrical focus wall with floating console',
          colorHarmonies: [
            'Sage Green (#7A8B7B)',
            'Warm Cream (#FAF8F5)',
            'Brushed Brass (#C4A052)',
          ],
          estimatedSquareFeet: 352,
        },
        timestamp: '2026-10-11T16:10:00Z',
      },
    ],
  },
  {
    id: 'proj-japandi-lounge',
    title: 'Serene Japandi Pavilion Lounge',
    roomType: 'living_room',
    dimensions: {
      width: 14,
      length: 18,
      height: 9,
      unit: 'ft',
    },
    style: 'Japandi',
    colorPalette: ['#F2EEE6', '#C7BCAB', '#4A463F', '#8C9A86'],
    budget: 60000,
    currency: 'INR',
    preserveFurniture: ['Sliding shoji screen partitions', 'Polished ash wood bench'],
    designInstructions:
      'Wabi-sabi philosophy, low-profile seating, natural unbleached canvas, washi paper pendant lighting.',
    roomImage: '/src/assets/images/project_japandi_living_room_1791952559603.jpg',
    roomImageName: 'japandi_room_original.jpg',
    isPreset: true,
    activeVersionIndex: 0,
    selectedProductIds: [
      'prod-chair-japandi-canvas',
      'prod-table-oak-round',
      'prod-light-washi-lantern',
      'prod-rug-jute-woven',
      'prod-decor-ceramic-vessels',
    ],
    customProductQuantities: {
      'prod-chair-japandi-canvas': 2,
      'prod-table-oak-round': 1,
      'prod-light-washi-lantern': 1,
      'prod-rug-jute-woven': 1,
      'prod-decor-ceramic-vessels': 1,
    },
    purchasedProductIds: [],
    isApproved: false,
    shortlistNotes: 'Focus on tranquil, uncluttered sightlines and natural fiber mats.',
    favorites: ['prod-light-washi-lantern'],
    createdAt: '2026-10-11T10:00:00Z',
    updatedAt: '2026-10-12T11:30:00Z',
    versions: [
      {
        id: 'rev-japandi-v1',
        versionNumber: 1,
        name: 'Concept 1: Wabi-Sabi Ash & Paper Glow',
        summary:
          'Low seating arrangement paired with suspended mulberry paper pendant, creating an intimate human-scale envelope.',
        renderedImage:
          '/src/assets/images/project_japandi_living_room_1791952559603.jpg',
        prompt:
          'Japandi living room with low-profile oak lounge chairs, organic washi paper pendant light, textured lime-wash beige walls, woven jute rug, serene calm atmosphere.',
        wallColor: '#F2EEE6',
        furnitureStyle: 'Japandi Minimalist',
        lightingMood: 'Cozy Golden Hour',
        layoutStrategy: 'Low-Horizon Grounding',
        decorDensity: 'Minimalist',
        aiAnalysis: {
          architecturalElements: [
            'Expansive garden courtyard glass wall',
            'Plaster-finished lime wash walls',
            'Natural ash plank flooring',
          ],
          lightingConditions:
            'Gently filtered through sheer linen, soft glow from Japanese washi paper shade.',
          spatialOpportunities: [
            'Maintain low horizontal visual line under 34 inches to enhance ceiling height sensation',
            'Leave open space around corners for negative space breathing room',
          ],
          recommendedLayout: 'U-shaped conversation circle centered on low table',
          colorHarmonies: [
            'Sand Plaster (#F2EEE6)',
            'Woven Jute (#C7BCAB)',
            'Smoked Ash (#4A463F)',
          ],
          estimatedSquareFeet: 252,
        },
        timestamp: '2026-10-11T10:15:00Z',
      },
    ],
  },
  {
    id: 'proj-terrace-pergola',
    title: 'Architectural Skyline Terrace & Pergola',
    roomType: 'patio_terrace',
    dimensions: {
      width: 20,
      length: 28,
      unit: 'ft',
    },
    style: 'Contemporary Minimalist',
    colorPalette: ['#282A2E', '#9E9484', '#D4AF37', '#FAF7F2'],
    budget: 95000,
    currency: 'INR',
    preserveFurniture: ['Timber pergola canopy', 'Glass perimeter balustrade'],
    designInstructions:
      'Resilient all-weather teak furniture, integrated atmospheric uplighting, fire lounge centerpiece for evening entertaining.',
    roomImage: '/src/assets/images/project_modern_terrace_patio_1791952560447.jpg',
    roomImageName: 'terrace_original.jpg',
    isPreset: true,
    activeVersionIndex: 0,
    selectedProductIds: [
      'prod-outdoor-modular-teak',
      'prod-outdoor-fire-bowl',
      'prod-decor-fiddle-fig',
    ],
    customProductQuantities: {
      'prod-outdoor-modular-teak': 1,
      'prod-outdoor-fire-bowl': 1,
      'prod-decor-fiddle-fig': 2,
    },
    purchasedProductIds: [],
    isApproved: true,
    approvedAt: '2026-10-12T18:00:00Z',
    shortlistNotes:
      'Design fully approved for production procurement. Fire bowl and teak sectional scheduled for freight delivery.',
    favorites: ['prod-outdoor-modular-teak', 'prod-outdoor-fire-bowl'],
    createdAt: '2026-10-09T08:00:00Z',
    updatedAt: '2026-10-13T12:00:00Z',
    versions: [
      {
        id: 'rev-terrace-v1',
        versionNumber: 1,
        name: 'Concept 1: Dusk Skyline Lounge',
        summary:
          'Teak modular sectional surrounding warm ambient concrete fire bowl with illuminated potted olive trees framing panoramic city vistas.',
        renderedImage:
          '/src/assets/images/project_modern_terrace_patio_1791952560447.jpg',
        prompt:
          'Modern architectural outdoor terrace and pergola patio with teak lounge seating, warm ambient uplighting on potted olive trees, slatted timber ceiling, smooth decking, dusk luxury aesthetic.',
        wallColor: '#282A2E',
        furnitureStyle: 'Architectural Outdoor Minimalist',
        lightingMood: 'Dramatic Dusk',
        layoutStrategy: 'Perimeter Vista Alignment',
        decorDensity: 'Balanced',
        aiAnalysis: {
          architecturalElements: [
            'Cantilevered timber louver pergola with integrated linear LED raceways',
            'Structural glass safety parapet overlooking city panorama',
            'Composite hardwood thermal decking',
          ],
          lightingConditions:
            'Twilight dusk ambiance with focused 3000K tree-well uplights and radiant fire glow.',
          spatialOpportunities: [
            'Group seating toward the wind-sheltered corner while maintaining open view corridors',
            'Integrate outdoor storage under built-in bench seating',
          ],
          recommendedLayout: 'Central fire hearth surrounded by modular L-sectional',
          colorHarmonies: [
            'Charcoal Slat (#282A2E)',
            'Weathered Teak (#9E9484)',
            'Warm Amber (#D4AF37)',
          ],
          estimatedSquareFeet: 560,
        },
        timestamp: '2026-10-09T08:30:00Z',
      },
    ],
  },
];
