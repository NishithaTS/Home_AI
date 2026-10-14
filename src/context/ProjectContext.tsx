import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Project, Product, DesignRevision } from '../types';
import { PRODUCTS } from '../data/catalog';
import { PRESET_PROJECTS } from '../data/presets';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface ProjectContextType {
  projects: Project[];
  activeProject: Project | null;
  activeRevision: DesignRevision | null;
  currency: 'INR' | 'USD';
  toasts: Toast[];
  isLoading: boolean;
  isAiProcessing: boolean;
  processingStage: string;
  setCurrency: (c: 'INR' | 'USD') => void;
  formatPrice: (amountInInr: number) => string;
  selectProject: (id: string) => void;
  createProject: (proj: Partial<Project>) => Promise<Project>;
  updateActiveProject: (updates: Partial<Project>) => void;
  switchVersion: (index: number) => void;
  undoVersion: () => void;
  redoVersion: () => void;
  canUndo: boolean;
  canRedo: boolean;
  addProductToProject: (productId: string, quantity?: number) => void;
  removeProductFromProject: (productId: string) => void;
  replaceProductInProject: (oldProductId: string, newProductId: string) => void;
  setProductQuantity: (productId: string, qty: number) => void;
  toggleFavorite: (productId: string) => void;
  togglePurchased: (productId: string) => void;
  approveDesign: (approved: boolean) => void;
  generateRevision: (params: { prompt?: string; wallColor?: string; furnitureStyle?: string; lightingMood?: any; decorDensity?: any }) => Promise<void>;
  refineWithAiInstruction: (instruction: string) => Promise<string>;
  findCheaperAlternativesForHighest: () => { original: Product; alternatives: Product[] } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  dismissToast: (id: string) => void;
  // Derived budget values
  selectedProducts: Product[];
  subtotal: number;
  deliveryFee: number;
  estimatedTax: number;
  totalCost: number;
  remainingBudget: number;
  isOverBudget: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'homie_ai_projects_v1';
const CURRENCY_KEY = 'homie_ai_currency';

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse local storage projects:', e);
    }
    return PRESET_PROJECTS;
  });

  const [activeProjectId, setActiveProjectId] = useState<string>(() => {
    return projects[0]?.id || 'proj-scandinavian-sanctuary';
  });

  const [currency, setCurrencyState] = useState<'INR' | 'USD'>(() => {
    return (localStorage.getItem(CURRENCY_KEY) as 'INR' | 'USD') || 'INR';
  });

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);
  const [processingStage, setProcessingStage] = useState<string>('');

  // Redo stack for active project
  const [redoStack, setRedoStack] = useState<DesignRevision[]>([]);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.warn('Error saving to local storage:', e);
    }
  }, [projects]);

  const setCurrency = (c: 'INR' | 'USD') => {
    setCurrencyState(c);
    localStorage.setItem(CURRENCY_KEY, c);
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const activeProject = useMemo(() => {
    return projects.find((p) => p.id === activeProjectId) || projects[0] || null;
  }, [projects, activeProjectId]);

  const activeRevision = useMemo(() => {
    if (!activeProject || !activeProject.versions || activeProject.versions.length === 0) return null;
    const index = Math.max(0, Math.min(activeProject.activeVersionIndex, activeProject.versions.length - 1));
    return activeProject.versions[index] || activeProject.versions[0];
  }, [activeProject]);

  const selectProject = (id: string) => {
    setActiveProjectId(id);
    setRedoStack([]);
  };

  const updateActiveProject = (updates: Partial<Project>) => {
    if (!activeProject) return;
    setProjects((prev) =>
      prev.map((p) => (p.id === activeProject.id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p))
    );
  };

  const createProject = async (projData: Partial<Project>): Promise<Project> => {
    setIsLoading(true);
    setProcessingStage('Creating project record...');
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projData),
      });
      const data = await res.json();
      const newProj = data.project || {
        ...projData,
        id: `proj-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        versions: projData.versions || [],
        selectedProductIds: projData.selectedProductIds || [],
        customProductQuantities: {},
        purchasedProductIds: [],
        favorites: [],
        activeVersionIndex: 0,
        isApproved: false,
      };

      setProjects((prev) => [newProj, ...prev]);
      setActiveProjectId(newProj.id);
      showToast(`Project "${newProj.title}" created successfully!`, 'success');
      return newProj;
    } catch (err) {
      console.error(err);
      const fallback: Project = {
        id: `proj-${Date.now()}`,
        title: projData.title || 'New Interior Space',
        roomType: projData.roomType || 'living_room',
        dimensions: projData.dimensions || { width: 14, length: 18, unit: 'ft' },
        style: projData.style || 'Scandinavian',
        colorPalette: projData.colorPalette || ['#FAF8F5', '#E3DDD1', '#7A8B7B', '#222321'],
        budget: projData.budget || 50000,
        currency: projData.currency || 'INR',
        preserveFurniture: projData.preserveFurniture || [],
        designInstructions: projData.designInstructions || '',
        roomImage: projData.roomImage || '/src/assets/images/hero_scandinavian_interior_1791952558825.jpg',
        roomImageName: projData.roomImageName,
        versions: projData.versions || [],
        activeVersionIndex: 0,
        selectedProductIds: projData.selectedProductIds || ['prod-sofa-finn-linen'],
        customProductQuantities: {},
        purchasedProductIds: [],
        isApproved: false,
        shortlistNotes: '',
        favorites: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setProjects((prev) => [fallback, ...prev]);
      setActiveProjectId(fallback.id);
      showToast(`Project created!`, 'success');
      return fallback;
    } finally {
      setIsLoading(false);
      setProcessingStage('');
    }
  };

  const switchVersion = (index: number) => {
    if (!activeProject) return;
    if (index >= 0 && index < activeProject.versions.length) {
      updateActiveProject({ activeVersionIndex: index });
      showToast(`Switched to Version ${index + 1}: ${activeProject.versions[index].name}`, 'info');
    }
  };

  const canUndo = (activeProject?.activeVersionIndex || 0) > 0;
  const canRedo = redoStack.length > 0;

  const undoVersion = () => {
    if (!activeProject || !canUndo) return;
    const current = activeProject.versions[activeProject.activeVersionIndex];
    setRedoStack((prev) => [current, ...prev]);
    const newIndex = activeProject.activeVersionIndex - 1;
    updateActiveProject({ activeVersionIndex: newIndex });
    showToast(`Undid to Version ${newIndex + 1}`, 'info');
  };

  const redoVersion = () => {
    if (!activeProject || !canRedo) return;
    const [nextRev, ...rest] = redoStack;
    setRedoStack(rest);
    const existingIndex = activeProject.versions.findIndex((v) => v.id === nextRev.id);
    if (existingIndex !== -1) {
      updateActiveProject({ activeVersionIndex: existingIndex });
    } else {
      const newVersions = [...activeProject.versions, nextRev];
      updateActiveProject({
        versions: newVersions,
        activeVersionIndex: newVersions.length - 1,
      });
    }
    showToast(`Redid change: ${nextRev.name}`, 'info');
  };

  const generateRevision = async (params: {
    prompt?: string;
    wallColor?: string;
    furnitureStyle?: string;
    lightingMood?: any;
    decorDensity?: any;
  }) => {
    if (!activeProject) return;
    setIsAiProcessing(true);
    setProcessingStage('Rendering architectural spatial plan...');
    try {
      const res = await fetch('/api/designs/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: activeProject.id,
          style: activeProject.style,
          ...params,
        }),
      });
      const data = await res.json();
      if (data.revision) {
        const updatedVersions = [...activeProject.versions, data.revision];
        updateActiveProject({
          versions: updatedVersions,
          activeVersionIndex: updatedVersions.length - 1,
        });
        setRedoStack([]);
        showToast(`Generated ${data.revision.name}!`, 'success');
      }
    } catch (e) {
      console.error(e);
      showToast('Could not generate new revision', 'error');
    } finally {
      setIsAiProcessing(false);
      setProcessingStage('');
    }
  };

  const refineWithAiInstruction = async (instruction: string): Promise<string> => {
    if (!activeProject || !activeRevision) return '';
    setIsAiProcessing(true);
    setProcessingStage(`Applying instruction: "${instruction}"...`);
    try {
      const res = await fetch('/api/designs/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: activeProject.id,
          instruction,
          currentDesign: activeRevision,
        }),
      });
      const data = await res.json();
      if (data.revision) {
        const updatedVersions = [...activeProject.versions, data.revision];
        updateActiveProject({
          versions: updatedVersions,
          activeVersionIndex: updatedVersions.length - 1,
        });
        setRedoStack([]);
        showToast(`Design updated: ${data.revision.summary}`, 'success');
        return data.revision.summary;
      }
      return 'Design updated';
    } catch (e) {
      console.error(e);
      showToast('Failed to apply design instruction', 'error');
      return 'Failed to refine';
    } finally {
      setIsAiProcessing(false);
      setProcessingStage('');
    }
  };

  // Product Selection & Quantity Handlers
  const addProductToProject = (productId: string, quantity = 1) => {
    if (!activeProject) return;
    const exists = activeProject.selectedProductIds.includes(productId);
    const updatedIds = exists
      ? activeProject.selectedProductIds
      : [...activeProject.selectedProductIds, productId];

    const currentQty = activeProject.customProductQuantities[productId] || 0;
    const updatedQty = exists ? currentQty + quantity : quantity;

    updateActiveProject({
      selectedProductIds: updatedIds,
      customProductQuantities: {
        ...activeProject.customProductQuantities,
        [productId]: updatedQty,
      },
    });

    const prod = PRODUCTS.find((p) => p.id === productId);
    showToast(`Added "${prod?.name || 'Item'}" to room design`, 'success');
  };

  const removeProductFromProject = (productId: string) => {
    if (!activeProject) return;
    const prod = PRODUCTS.find((p) => p.id === productId);
    const updatedIds = activeProject.selectedProductIds.filter((id) => id !== productId);
    const updatedQuantities = { ...activeProject.customProductQuantities };
    delete updatedQuantities[productId];

    updateActiveProject({
      selectedProductIds: updatedIds,
      customProductQuantities: updatedQuantities,
    });
    showToast(`Removed "${prod?.name || 'Item'}" from design`, 'info');
  };

  const replaceProductInProject = (oldProductId: string, newProductId: string) => {
    if (!activeProject) return;
    const oldProd = PRODUCTS.find((p) => p.id === oldProductId);
    const newProd = PRODUCTS.find((p) => p.id === newProductId);
    const qty = activeProject.customProductQuantities[oldProductId] || 1;

    const updatedIds = activeProject.selectedProductIds
      .filter((id) => id !== oldProductId)
      .concat(newProductId);

    const updatedQuantities = { ...activeProject.customProductQuantities };
    delete updatedQuantities[oldProductId];
    updatedQuantities[newProductId] = qty;

    updateActiveProject({
      selectedProductIds: updatedIds,
      customProductQuantities: updatedQuantities,
    });

    const priceDiff = (newProd?.price || 0) - (oldProd?.price || 0);
    const sign = priceDiff > 0 ? `+${formatPrice(priceDiff)}` : `saved ${formatPrice(Math.abs(priceDiff))}`;
    showToast(`Swapped for ${newProd?.name} (${sign})`, 'success');
  };

  const setProductQuantity = (productId: string, qty: number) => {
    if (!activeProject) return;
    if (qty <= 0) {
      removeProductFromProject(productId);
      return;
    }
    updateActiveProject({
      customProductQuantities: {
        ...activeProject.customProductQuantities,
        [productId]: qty,
      },
    });
  };

  const toggleFavorite = (productId: string) => {
    if (!activeProject) return;
    const isFav = activeProject.favorites.includes(productId);
    const updated = isFav
      ? activeProject.favorites.filter((id) => id !== productId)
      : [...activeProject.favorites, productId];
    updateActiveProject({ favorites: updated });
    showToast(isFav ? 'Removed from favorites' : 'Saved to favorites', 'info');
  };

  const togglePurchased = (productId: string) => {
    if (!activeProject) return;
    const isPurchased = activeProject.purchasedProductIds.includes(productId);
    const updated = isPurchased
      ? activeProject.purchasedProductIds.filter((id) => id !== productId)
      : [...activeProject.purchasedProductIds, productId];
    updateActiveProject({ purchasedProductIds: updated });
  };

  const approveDesign = (approved: boolean) => {
    if (!activeProject) return;
    updateActiveProject({
      isApproved: approved,
      approvedAt: approved ? new Date().toISOString() : undefined,
    });
    if (approved) {
      showToast('Design approved! Shopping checklist generated.', 'success');
    } else {
      showToast('Design unapproved for further iteration.', 'info');
    }
  };

  // Find cheaper alternatives action
  const findCheaperAlternativesForHighest = (): { original: Product; alternatives: Product[] } | null => {
    if (!activeProject || activeProject.selectedProductIds.length === 0) return null;

    // Sort selected products by individual price descending
    const items = activeProject.selectedProductIds
      .map((id) => PRODUCTS.find((p) => p.id === id))
      .filter((p): p is Product => !!p)
      .sort((a, b) => b.price - a.price);

    for (const item of items) {
      const alternatives = PRODUCTS.filter(
        (p) => p.category === item.category && p.id !== item.id && p.price < item.price
      ).sort((a, b) => a.price - b.price);

      if (alternatives.length > 0) {
        return { original: item, alternatives };
      }
    }
    return null;
  };

  // Derived calculations
  const selectedProducts = useMemo(() => {
    if (!activeProject) return [];
    return activeProject.selectedProductIds
      .map((id) => PRODUCTS.find((p) => p.id === id))
      .filter((p): p is Product => !!p);
  }, [activeProject]);

  const subtotal = useMemo(() => {
    if (!activeProject) return 0;
    return selectedProducts.reduce((sum, prod) => {
      const qty = activeProject.customProductQuantities[prod.id] || 1;
      return sum + prod.price * qty;
    }, 0);
  }, [activeProject, selectedProducts]);

  const deliveryFee = useMemo(() => {
    if (subtotal === 0) return 0;
    if (subtotal > 45000) return 0; // Free white-glove delivery over ₹45,000
    return Math.min(1800, selectedProducts.length * 450);
  }, [subtotal, selectedProducts.length]);

  const estimatedTax = useMemo(() => {
    // 5% standard furnishings GST / state tax
    return Math.round(subtotal * 0.05);
  }, [subtotal]);

  const totalCost = useMemo(() => {
    return subtotal + deliveryFee + estimatedTax;
  }, [subtotal, deliveryFee, estimatedTax]);

  const remainingBudget = useMemo(() => {
    if (!activeProject) return 0;
    return activeProject.budget - totalCost;
  }, [activeProject, totalCost]);

  const isOverBudget = remainingBudget < 0;

  const formatPrice = (amountInInr: number) => {
    if (currency === 'USD') {
      const inUsd = Math.round(amountInInr / 83);
      return `$${inUsd.toLocaleString()}`;
    }
    return `₹${amountInInr.toLocaleString('en-IN')}`;
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProject,
        activeRevision,
        currency,
        toasts,
        isLoading,
        isAiProcessing,
        processingStage,
        setCurrency,
        formatPrice,
        selectProject,
        createProject,
        updateActiveProject,
        switchVersion,
        undoVersion,
        redoVersion,
        canUndo,
        canRedo,
        addProductToProject,
        removeProductFromProject,
        replaceProductInProject,
        setProductQuantity,
        toggleFavorite,
        togglePurchased,
        approveDesign,
        generateRevision,
        refineWithAiInstruction,
        findCheaperAlternativesForHighest,
        showToast,
        dismissToast,
        selectedProducts,
        subtotal,
        deliveryFee,
        estimatedTax,
        totalCost,
        remainingBudget,
        isOverBudget,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
