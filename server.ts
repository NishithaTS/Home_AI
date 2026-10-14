import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { PRODUCTS } from './src/data/catalog.ts';
import { PRESET_PROJECTS } from './src/data/presets.ts';
import { STUDIO_LOCATIONS } from './src/data/locations.ts';
import { Project, DesignRevision, Product } from './src/types/index.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// In-memory project store seeded with presets
let projects: Project[] = JSON.parse(JSON.stringify(PRESET_PROJECTS));

// Gemini SDK setup
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper to extract base64 data from Data URL
function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
  if (!match) return null;
  return {
    mimeType: match[1],
    data: match[2],
  };
}

// ==========================================
// API ROUTES
// ==========================================

// 1. Analyze Room
app.post('/api/rooms/analyze', async (req, res) => {
  try {
    const { roomImage, roomType, style, dimensions, budget, preserveFurniture, designInstructions } = req.body;

    let aiAnalysis = {
      architecturalElements: [
        'Well-proportioned main elevation with ample window daylighting',
        'Balanced vertical wall heights suitable for floor-to-ceiling drapery',
        'Clean ceiling plane ready for sculptural pendant illumination',
      ],
      lightingConditions: 'Generous ambient natural light with opportunity for warm layered evening lighting.',
      spatialOpportunities: [
        'Establish a primary conversational core oriented toward the natural focal point',
        'Optimize circulation clearance with a minimum 36-inch perimeter pathway',
        'Integrate acoustic warmth through textured low-pile wool textiles',
      ],
      recommendedLayout: 'Central conversational island with floating low-profile silhouette furniture',
      colorHarmonies: ['Warm Limestone (#F5F3EF)', 'Sage Herb (#8B9B88)', 'Oat Cream (#EAE4D9)', 'Smoked Timber (#3D3731)'],
      estimatedSquareFeet: (dimensions?.width && dimensions?.length) ? dimensions.width * dimensions.length : 320,
    };

    if (process.env.GEMINI_API_KEY) {
      try {
        const parts: any[] = [];
        const parsedImage = roomImage ? parseDataUrl(roomImage) : null;
        if (parsedImage) {
          parts.push({
            inlineData: {
              mimeType: parsedImage.mimeType,
              data: parsedImage.data,
            },
          });
        }

        const promptText = `
You are a master interior architect and spatial designer for Homie.AI.
Analyze this ${roomType || 'living space'} for a client requesting a ${style || 'Scandinavian'} interior design.
User preferences:
- Dimensions: ${dimensions?.width || 15} x ${dimensions?.length || 20} ${dimensions?.unit || 'ft'}
- Target Budget: ₹${budget || 50000}
- Items to preserve: ${Array.isArray(preserveFurniture) ? preserveFurniture.join(', ') : 'None specified'}
- Instructions: ${designInstructions || 'Make the space functional, serene, and elegant.'}

Provide your expert spatial analysis as valid JSON matching this schema:
{
  "architecturalElements": ["string", "string", "string"],
  "lightingConditions": "string describing daylight orientation and artificial lighting needs",
  "spatialOpportunities": ["opportunity 1", "opportunity 2", "opportunity 3"],
  "recommendedLayout": "string describing optimal arrangement",
  "colorHarmonies": ["#HEX1", "#HEX2", "#HEX3", "#HEX4"],
  "estimatedSquareFeet": number
}
Return pure JSON with no markdown wrapping.
`;
        parts.push({ text: promptText });

        const geminiRes = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: { parts },
        });

        if (geminiRes.text) {
          const cleanedText = geminiRes.text.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanedText);
          aiAnalysis = { ...aiAnalysis, ...parsed };
        }
      } catch (geminiErr) {
        console.warn('Gemini vision analysis fallback used:', geminiErr);
      }
    }

    res.json({ success: true, analysis: aiAnalysis });
  } catch (error: any) {
    console.error('Error analyzing room:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze room' });
  }
});

// 2. Generate Design Concept Revision
app.post('/api/designs/generate', async (req, res) => {
  try {
    const { projectId, prompt, wallColor, furnitureStyle, lightingMood, decorDensity, style } = req.body;
    const project = projects.find((p) => p.id === projectId);

    const versionNum = project ? project.versions.length + 1 : 1;
    const defaultImage =
      style === 'Japandi'
        ? '/src/assets/images/project_japandi_living_room_1791952559603.jpg'
        : style === 'Contemporary Minimalist' || style === 'Industrial Chic'
        ? '/src/assets/images/project_modern_terrace_patio_1791952560447.jpg'
        : '/src/assets/images/hero_scandinavian_interior_1791952558825.jpg';

    const newRevision: DesignRevision = {
      id: `rev-${Date.now()}`,
      versionNumber: versionNum,
      name: `Concept ${versionNum}: ${furnitureStyle || style || 'Curated'} Exploration`,
      summary: prompt || `Refined ${style || 'Nordic'} layout with ${wallColor || 'warm chalk'} tones and ${lightingMood || 'ambient lighting'}.`,
      renderedImage: defaultImage,
      prompt: prompt || `Photorealistic architectural interior rendering in ${style} aesthetic with ${wallColor} walls.`,
      wallColor: wallColor || '#F5F3EF',
      furnitureStyle: furnitureStyle || style || 'Scandinavian Minimalist',
      lightingMood: lightingMood || 'Warm Ambient (2700K)',
      layoutStrategy: 'Balanced Social Cluster',
      decorDensity: decorDensity || 'Balanced',
      aiAnalysis: project?.versions[0]?.aiAnalysis || {
        architecturalElements: ['Optimal ceiling height for statement fixture', 'Balanced natural exposure'],
        lightingConditions: `${lightingMood || 'Warm Ambient (2700K)'} tuned for comfort and relaxation`,
        spatialOpportunities: ['Refined layout preserves easy flow between adjoining rooms'],
        recommendedLayout: 'Centralized seating arrangement with perimeter display alcoves',
        colorHarmonies: [wallColor || '#F5F3EF', '#EAE4D9', '#8B9B88', '#2A2C2B'],
      },
      timestamp: new Date().toISOString(),
    };

    if (project) {
      project.versions.push(newRevision);
      project.activeVersionIndex = project.versions.length - 1;
      project.updatedAt = new Date().toISOString();
    }

    res.json({ success: true, revision: newRevision, project });
  } catch (error: any) {
    console.error('Error generating design:', error);
    res.status(500).json({ error: error.message || 'Failed to generate design concept' });
  }
});

// 3. Refine Design Concept
app.post('/api/designs/refine', async (req, res) => {
  try {
    const { projectId, instruction, currentDesign } = req.body;
    const project = projects.find((p) => p.id === projectId);

    let updatedWallColor = currentDesign?.wallColor || '#F5F3EF';
    let updatedStyle = currentDesign?.furnitureStyle || 'Scandinavian';
    let updatedMood = currentDesign?.lightingMood || 'Warm Ambient (2700K)';
    let summaryText = `Applied instruction: "${instruction}"`;

    if (process.env.GEMINI_API_KEY) {
      try {
        const refinePrompt = `
You are the Homie.AI design refinement engine.
The user wants to refine their interior design with this instruction: "${instruction}"
Current state:
- Wall Color: ${currentDesign?.wallColor}
- Furniture Style: ${currentDesign?.furnitureStyle}
- Lighting Mood: ${currentDesign?.lightingMood}
- Decor Density: ${currentDesign?.decorDensity}

Interpret the instruction and return a valid JSON object:
{
  "wallColor": "#HEX_OR_KEEP",
  "furnitureStyle": "Style name",
  "lightingMood": "Warm Ambient (2700K) | Natural Daylit (4000K) | Dramatic Dusk | Cozy Golden Hour",
  "decorDensity": "Minimalist | Balanced | Lush / Layered",
  "summary": "Short 1-2 sentence description of what changed"
}
Return pure JSON with no markdown wrapping.
`;
        const aiRes = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: refinePrompt,
        });

        if (aiRes.text) {
          const parsed = JSON.parse(aiRes.text.replace(/```json/g, '').replace(/```/g, '').trim());
          if (parsed.wallColor) updatedWallColor = parsed.wallColor;
          if (parsed.furnitureStyle) updatedStyle = parsed.furnitureStyle;
          if (parsed.lightingMood) updatedMood = parsed.lightingMood;
          if (parsed.summary) summaryText = parsed.summary;
        }
      } catch (err) {
        console.warn('Refinement fallback:', err);
      }
    } else {
      // Local keyword parsing
      const lower = instruction.toLowerCase();
      if (lower.includes('sage') || lower.includes('green')) updatedWallColor = '#8B9B88';
      else if (lower.includes('terracotta') || lower.includes('clay') || lower.includes('rust')) updatedWallColor = '#BA7053';
      else if (lower.includes('charcoal') || lower.includes('dark') || lower.includes('black')) updatedWallColor = '#2A2C2B';
      else if (lower.includes('white') || lower.includes('cream') || lower.includes('chalk')) updatedWallColor = '#FAF8F5';
      else if (lower.includes('teal') || lower.includes('blue')) updatedWallColor = '#3D6466';

      if (lower.includes('scandinavian')) updatedStyle = 'Scandinavian';
      if (lower.includes('japandi')) updatedStyle = 'Japandi';
      if (lower.includes('minimalist')) updatedStyle = 'Contemporary Minimalist';
    }

    const versionNum = project ? project.versions.length + 1 : 2;
    const newRevision: DesignRevision = {
      id: `rev-${Date.now()}`,
      versionNumber: versionNum,
      name: `Revision ${versionNum}: ${instruction.slice(0, 32)}...`,
      summary: summaryText,
      renderedImage:
        updatedStyle === 'Japandi'
          ? '/src/assets/images/project_japandi_living_room_1791952559603.jpg'
          : updatedWallColor === '#8B9B88'
          ? 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80'
          : '/src/assets/images/hero_scandinavian_interior_1791952558825.jpg',
      prompt: `Refined interior visualization incorporating: ${instruction}`,
      wallColor: updatedWallColor,
      furnitureStyle: updatedStyle,
      lightingMood: updatedMood,
      layoutStrategy: currentDesign?.layoutStrategy || 'Balanced Social Cluster',
      decorDensity: currentDesign?.decorDensity || 'Balanced',
      aiAnalysis: currentDesign?.aiAnalysis || {
        architecturalElements: ['Custom color accentuation', 'Harmonized spatial flow'],
        lightingConditions: `${updatedMood} optimized for room volume`,
        spatialOpportunities: ['Enhanced tactile balance and focal definition'],
        recommendedLayout: 'Preserved core conversational geometry',
        colorHarmonies: [updatedWallColor, '#FAF8F5', '#EAE4D9', '#2A2C2B'],
      },
      timestamp: new Date().toISOString(),
    };

    if (project) {
      project.versions.push(newRevision);
      project.activeVersionIndex = project.versions.length - 1;
      project.updatedAt = new Date().toISOString();
    }

    res.json({ success: true, revision: newRevision, project });
  } catch (error: any) {
    console.error('Error refining design:', error);
    res.status(500).json({ error: error.message || 'Failed to refine design' });
  }
});

// 4. Conversational Assistant Chat
app.post('/api/assistant/chat', async (req, res) => {
  try {
    const { message, projectContext } = req.body;

    const catalogSummary = PRODUCTS.map(
      (p) => `ID: ${p.id} | Name: ${p.name} | Cat: ${p.category} | Price: ₹${p.price} | Retailer: ${p.retailer} | Material: ${p.material} | Tier: ${p.tier}`
    ).join('\n');

    let assistantResponse = {
      reply: `I've analyzed your request: "${message}". Let's tailor the furniture pieces and color palette to achieve your vision while respecting your budget.`,
      action: {
        type: 'none',
        label: '',
        payload: {},
      },
      suggestedProductIds: [] as string[],
      shouldTriggerRender: false,
    };

    if (process.env.GEMINI_API_KEY) {
      try {
        const chatPrompt = `
You are the senior AI interior designer and shopping advisor for Homie.AI.
The user is working on an interior design project.
Current Project Context:
- Room: ${projectContext?.roomType || 'Living Room'}
- Style: ${projectContext?.style || 'Scandinavian'}
- Budget: ₹${projectContext?.budget || 50000} (Spent: ₹${projectContext?.spent || 0})
- Selected Products: ${projectContext?.selectedProductsSummary || 'None'}
- Current Wall Color: ${projectContext?.wallColor || '#F5F3EF'}

Available Product Catalog:
${catalogSummary}

User Message: "${message}"

Your goal:
1. Provide a warm, authoritative, tasteful interior design answer (2-3 concise sentences).
2. If the user asks to change color (e.g., sage green, terracotta, white), trigger action 'color_change' with payload { "color": "#HEX" }.
3. If the user asks to replace an item or find a cheaper sofa/chair/table/lamp, recommend suitable products from the catalog above by ID and set suggestedProductIds.
4. If visual changes to walls or style are needed, set shouldTriggerRender: true.

Respond in pure valid JSON:
{
  "reply": "Conversational advice and design reasoning",
  "action": {
    "type": "color_change" | "product_replace" | "style_shift" | "cheaper_alternatives" | "none",
    "label": "Button label if applicable",
    "payload": {}
  },
  "suggestedProductIds": ["prod-id-1"],
  "shouldTriggerRender": boolean
}
Return pure JSON with no markdown wrapping.
`;
        const aiRes = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: chatPrompt,
        });

        if (aiRes.text) {
          const parsed = JSON.parse(aiRes.text.replace(/```json/g, '').replace(/```/g, '').trim());
          assistantResponse = { ...assistantResponse, ...parsed };
        }
      } catch (err) {
        console.warn('Gemini chat fallback:', err);
      }
    } else {
      // Rule-based conversational fallback
      const lower = message.toLowerCase();
      if (lower.includes('sage') || lower.includes('green')) {
        assistantResponse = {
          reply: 'Sage green provides an organic, calming backdrop that pairs effortlessly with natural white oak and bouclé textures.',
          action: {
            type: 'color_change',
            label: 'Apply Sage Green (#8B9B88)',
            payload: { color: '#8B9B88' },
          },
          suggestedProductIds: ['prod-credenza-fluted-oak'],
          shouldTriggerRender: true,
        };
      } else if (lower.includes('cheaper') || lower.includes('budget') || lower.includes('affordable')) {
        assistantResponse = {
          reply: 'Here are excellent cost-conscious alternatives from our verified catalog that preserve the architectural silhouette while trimming expenses.',
          action: {
            type: 'cheaper_alternatives',
            label: 'Review Budget Alternatives',
            payload: {},
          },
          suggestedProductIds: ['prod-sofa-compact-nordic', 'prod-table-minimal-compact', 'prod-rug-jute-woven'],
          shouldTriggerRender: false,
        };
      } else if (lower.includes('sofa')) {
        assistantResponse = {
          reply: 'For seating, I recommend evaluating either the tailored linen Finn 3-seater or our compact Nordic 2-seater depending on your spatial allowance.',
          action: {
            type: 'product_replace',
            label: 'Inspect Sofas',
            payload: { category: 'Sofas & Seating' },
          },
          suggestedProductIds: ['prod-sofa-finn-linen', 'prod-sofa-compact-nordic'],
          shouldTriggerRender: false,
        };
      }
    }

    // Attach full product objects for suggestions
    const matchedProducts = PRODUCTS.filter((p) =>
      assistantResponse.suggestedProductIds.includes(p.id)
    );

    res.json({
      success: true,
      message: {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: assistantResponse.reply,
        timestamp: new Date().toISOString(),
        suggestedAction:
          assistantResponse.action.type !== 'none'
            ? {
                type: assistantResponse.action.type as any,
                label: assistantResponse.action.label,
                payload: assistantResponse.action.payload,
              }
            : undefined,
        suggestedProducts: matchedProducts,
      },
      shouldTriggerRender: assistantResponse.shouldTriggerRender,
    });
  } catch (error: any) {
    console.error('Error in chat assistant:', error);
    res.status(500).json({ error: error.message || 'Assistant failed to process request' });
  }
});

// 5. Products Catalog Endpoints
app.get('/api/products', (req, res) => {
  const { category, search, minPrice, maxPrice, retailer, style, sort } = req.query;
  let results = [...PRODUCTS];

  if (category && category !== 'All') {
    results = results.filter((p) => p.category === category);
  }

  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        p.retailer.toLowerCase().includes(q) ||
        p.styleTags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (minPrice) {
    results = results.filter((p) => p.price >= Number(minPrice));
  }
  if (maxPrice) {
    results = results.filter((p) => p.price <= Number(maxPrice));
  }

  if (retailer && retailer !== 'All') {
    results = results.filter((p) => p.retailer === retailer);
  }

  if (style && style !== 'All') {
    results = results.filter((p) => p.styleTags.includes(String(style)));
  }

  if (sort === 'price_asc') {
    results.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    results.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    results.sort((a, b) => b.rating - a.rating);
  }

  res.json({ success: true, count: results.length, products: results });
});

app.get('/api/products/:id', (req, res) => {
  const product = PRODUCTS.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json({ success: true, product });
});

app.get('/api/products/:id/alternatives', (req, res) => {
  const product = PRODUCTS.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  // Find same category items that cost less or are close alternatives
  const alternatives = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id && p.price < product.price
  ).sort((a, b) => a.price - b.price);

  res.json({ success: true, original: product, alternatives });
});

// 6. Project Management Endpoints
app.get('/api/projects', (req, res) => {
  res.json({ success: true, projects });
});

app.get('/api/projects/:id', (req, res) => {
  const project = projects.find((p) => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json({ success: true, project });
});

app.post('/api/projects', (req, res) => {
  const newProj: Project = {
    id: `proj-${Date.now()}`,
    title: req.body.title || 'Untitled Living Space',
    roomType: req.body.roomType || 'living_room',
    dimensions: req.body.dimensions || { width: 14, length: 18, unit: 'ft' },
    style: req.body.style || 'Scandinavian',
    colorPalette: req.body.colorPalette || ['#FAF8F5', '#E3DDD1', '#7A8B7B', '#222321'],
    budget: Number(req.body.budget) || 50000,
    currency: req.body.currency || 'INR',
    preserveFurniture: req.body.preserveFurniture || [],
    designInstructions: req.body.designInstructions || '',
    roomImage: req.body.roomImage || '/src/assets/images/hero_scandinavian_interior_1791952558825.jpg',
    roomImageName: req.body.roomImageName || 'uploaded_room.jpg',
    versions: req.body.versions || [],
    activeVersionIndex: 0,
    selectedProductIds: req.body.selectedProductIds || ['prod-sofa-finn-linen', 'prod-table-oak-round', 'prod-light-ceramic-table'],
    customProductQuantities: req.body.customProductQuantities || {},
    purchasedProductIds: [],
    isApproved: false,
    shortlistNotes: '',
    favorites: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // If no versions were provided, initialize Version 1
  if (newProj.versions.length === 0) {
    newProj.versions.push({
      id: `rev-${Date.now()}`,
      versionNumber: 1,
      name: 'Concept 1: Initial Spatial Plan',
      summary: `Spatial plan optimizing natural illumination and circulation in ${newProj.style} style.`,
      renderedImage: newProj.roomImage,
      prompt: `Harmonious ${newProj.style} room concept.`,
      wallColor: newProj.colorPalette[0] || '#FAF8F5',
      furnitureStyle: newProj.style,
      lightingMood: 'Warm Ambient (2700K)',
      layoutStrategy: 'Central Social Island',
      decorDensity: 'Balanced',
      aiAnalysis: {
        architecturalElements: ['Key focal wall and natural light access'],
        lightingConditions: 'Warm ambient glow with daytime diffuse exposure',
        spatialOpportunities: ['Clean circulation paths around central seating'],
        recommendedLayout: 'Centralized conversational island',
        colorHarmonies: newProj.colorPalette,
        estimatedSquareFeet: newProj.dimensions.width * newProj.dimensions.length,
      },
      timestamp: new Date().toISOString(),
    });
  }

  projects.unshift(newProj);
  res.status(201).json({ success: true, project: newProj });
});

app.patch('/api/projects/:id', (req, res) => {
  const index = projects.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Project not found' });

  projects[index] = {
    ...projects[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  res.json({ success: true, project: projects[index] });
});

// 7. Add / Remove Product from Design
app.post('/api/designs/:id/products', (req, res) => {
  const { productId, quantity } = req.body;
  const project = projects.find((p) => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  if (!project.selectedProductIds.includes(productId)) {
    project.selectedProductIds.push(productId);
  }
  project.customProductQuantities[productId] = quantity || 1;
  project.updatedAt = new Date().toISOString();

  res.json({ success: true, project });
});

app.delete('/api/designs/:id/products/:productId', (req, res) => {
  const project = projects.find((p) => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  project.selectedProductIds = project.selectedProductIds.filter(
    (id) => id !== req.params.productId
  );
  delete project.customProductQuantities[req.params.productId];
  project.updatedAt = new Date().toISOString();

  res.json({ success: true, project });
});

// 8. Studio Locations
app.get('/api/locations', (req, res) => {
  res.json({ success: true, locations: STUDIO_LOCATIONS });
});

// ==========================================
// STATIC ASSET & VITE MIDDLEWARE SERVING
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Homie.AI server running on port ${PORT}`);
  });
}

startServer();
