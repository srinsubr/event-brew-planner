export interface Recipe {
  [key: string]: number; // ingredient key -> amount per batch
}

export interface Recipes {
  Coffee: Recipe;
  Tea: Recipe;
}

export interface PackageSizes {
  [key: string]: number; // ingredient key -> package size
}

export interface StoreMap {
  [key: string]: 'costcoDecoction' | 'costcoPrep' | 'indianStoreDecoction' | 'indianStorePrep' | 'amazonPrep' | 'other';
}

export interface IngredientData {
  ingredient: string;
  amount: number;
  unit: string;
  store: string;
  prepStep: string;
}

export interface ShoppingListItem {
  ingredient: string;
  totalAmount: number;
  unit: string;
  packages: number;
  category: string;
}

export interface ShoppingLists {
  costcoDecoction: ShoppingListItem[];
  costcoPrep: ShoppingListItem[];
  indianStoreDecoction: ShoppingListItem[];
  indianStorePrep: ShoppingListItem[];
  amazonPrep: ShoppingListItem[];
  other: ShoppingListItem[];
}
