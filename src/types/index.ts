export type RoomType =
  | 'living_room'
  | 'bedroom'
  | 'dining_room'
  | 'home_office'
  | 'patio_terrace'
  | 'kitchen';

export type InteriorStyle =
  | 'Scandinavian'
  | 'Japandi'
  | 'Mid-Century Modern'
  | 'Contemporary Minimalist'
  | 'Boho Earthy'
  | 'Industrial Chic';

export type LightingMood =
  | 'Warm Ambient (2700K)'
  | 'Natural Daylit (4000K)'
  | 'Dramatic Dusk'
  | 'Cozy Golden Hour';

export type DecorDensity = 'Minimalist' | 'Balanced' | 'Lush / Layered';

export interface RoomAnalysis {
  architecturalElements: string[];
  lightingConditions: string;
  spatialOpportunities: string[];
  recommendedLayout: string;
  colorHarmonies: string[];
  estimatedSquareFeet?: number;
}

export interface DesignRevision {
  id: string;
  versionNumber: number;
  name: string;
  summary: string;
  renderedImage: string;
  prompt: string;
  wallColor: string;
  furnitureStyle: string;
  lightingMood: LightingMood;
  layoutStrategy: string;
  decorDensity: DecorDensity;
  aiAnalysis: RoomAnalysis;
  timestamp: string;
}

export interface Product {
  id: string;
  name: string;
  category:
    | 'Sofas & Seating'
    | 'Tables & Desks'
    | 'Storage & Credenzas'
    | 'Lighting'
    | 'Rugs & Textiles'
    | 'Decor & Plants'
    | 'Outdoor';
  image: string;
  price: number; // in INR
  dimensions: string;
  material: string;
  color: string;
  retailer: string;
  productUrl: string;
  inStock: boolean;
  rating: number;
  styleTags: string[];
  ecoFriendly?: boolean;
  tier?: 'Budget' | 'Designer' | 'Luxury';
}

export interface Project {
  id: string;
  title: string;
  roomType: RoomType;
  dimensions: {
    width: number;
    length: number;
    height?: number;
    unit: 'ft' | 'm';
  };
  style: InteriorStyle;
  colorPalette: string[];
  budget: number; // in INR
  currency: 'INR' | 'USD';
  preserveFurniture: string[];
  designInstructions: string;
  roomImage: string;
  roomImageName?: string;
  isPreset?: boolean;
  versions: DesignRevision[];
  activeVersionIndex: number;
  selectedProductIds: string[];
  customProductQuantities: Record<string, number>;
  purchasedProductIds: string[];
  isApproved: boolean;
  approvedAt?: string;
  shortlistNotes: string;
  favorites: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedAction?: {
    type: 'color_change' | 'product_replace' | 'style_shift' | 'budget_adjust' | 'cheaper_alternatives';
    label: string;
    payload: Record<string, any>;
  };
  suggestedProducts?: Product[];
}

export interface StudioLocation {
  id: string;
  city: string;
  country: string;
  name: string;
  address: string;
  hours: string;
  phone: string;
  highlight: string;
  experienceNotes: string;
  image: string;
  coordinates: { lat: number; lng: number };
}
