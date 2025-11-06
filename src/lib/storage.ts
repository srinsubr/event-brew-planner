import { Recipes, PackageSizes, StoreMap, EventTemplate } from '@/types/beverage';

const STORAGE_KEYS = {
  RECIPES: 'beverage-planner-recipes',
  PACKAGE_SIZES: 'beverage-planner-package-sizes',
  STORE_MAP: 'beverage-planner-store-map',
  TEMPLATES: 'beverage-planner-templates',
};

export const getDefaultRecipes = (): Recipes => ({
  Coffee: {
    'Coffee Powder (g)': 500,
    'Sugar (g)': 1000,
    'Milk (l)': 4,
    'Water (l)': 4,
  },
  Tea: {
    'Tea Powder (g)': 100,
    'Sugar (g)': 1000,
    'Milk (l)': 4,
    'Water (l)': 4,
    'Ginger (g)': 50,
    'Cardamom (g)': 10,
  },
});

export const getDefaultPackageSizes = (): PackageSizes => ({
  'Coffee Powder (g)': 1000,
  'Tea Powder (g)': 500,
  'Sugar (g)': 2000,
  'Milk (l)': 4,
  'Water (l)': 1,
  'Ginger (g)': 100,
  'Cardamom (g)': 50,
});

export const getDefaultStoreMap = (): StoreMap => ({
  'Coffee Powder (g)': 'costcoDecoction',
  'Tea Powder (g)': 'indianStoreDecoction',
  'Sugar (g)': 'costcoPrep',
  'Milk (l)': 'costcoDecoction',
  'Water (l)': 'other',
  'Ginger (g)': 'indianStorePrep',
  'Cardamom (g)': 'indianStorePrep',
});

export const loadRecipes = (): Recipes => {
  const stored = localStorage.getItem(STORAGE_KEYS.RECIPES);
  return stored ? JSON.parse(stored) : getDefaultRecipes();
};

export const saveRecipes = (recipes: Recipes): void => {
  localStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(recipes));
};

export const loadPackageSizes = (): PackageSizes => {
  const stored = localStorage.getItem(STORAGE_KEYS.PACKAGE_SIZES);
  return stored ? JSON.parse(stored) : getDefaultPackageSizes();
};

export const savePackageSizes = (sizes: PackageSizes): void => {
  localStorage.setItem(STORAGE_KEYS.PACKAGE_SIZES, JSON.stringify(sizes));
};

export const loadStoreMap = (): StoreMap => {
  const stored = localStorage.getItem(STORAGE_KEYS.STORE_MAP);
  return stored ? JSON.parse(stored) : getDefaultStoreMap();
};

export const saveStoreMap = (map: StoreMap): void => {
  localStorage.setItem(STORAGE_KEYS.STORE_MAP, JSON.stringify(map));
};

export const loadTemplates = (): EventTemplate[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
  return stored ? JSON.parse(stored) : [];
};

export const saveTemplates = (templates: EventTemplate[]): void => {
  localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
};

export const saveTemplate = (template: Omit<EventTemplate, 'id' | 'createdAt'>): EventTemplate => {
  const templates = loadTemplates();
  const newTemplate: EventTemplate = {
    ...template,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  templates.push(newTemplate);
  saveTemplates(templates);
  return newTemplate;
};

export const deleteTemplate = (id: string): void => {
  const templates = loadTemplates();
  const filtered = templates.filter(t => t.id !== id);
  saveTemplates(filtered);
};

export const loadTemplate = (id: string): EventTemplate | null => {
  const templates = loadTemplates();
  return templates.find(t => t.id === id) || null;
};
