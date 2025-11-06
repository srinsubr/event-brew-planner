import { Recipes, PackageSizes, StoreMap, ShoppingLists, ShoppingListItem } from '@/types/beverage';

export const calculateShoppingLists = (
  coffeeBatches: number,
  teaBatches: number,
  recipes: Recipes,
  packageSizes: PackageSizes,
  storeMap: StoreMap
): ShoppingLists => {
  const lists: ShoppingLists = {
    costcoDecoction: [],
    costcoPrep: [],
    indianStoreDecoction: [],
    indianStorePrep: [],
    amazonPrep: [],
    other: [],
  };

  const totals: { [key: string]: number } = {};

  // Calculate totals for coffee
  Object.entries(recipes.Coffee).forEach(([key, amount]) => {
    totals[key] = (totals[key] || 0) + amount * coffeeBatches;
  });

  // Calculate totals for tea
  Object.entries(recipes.Tea).forEach(([key, amount]) => {
    totals[key] = (totals[key] || 0) + amount * teaBatches;
  });

  // Organize by store/category
  Object.entries(totals).forEach(([key, totalAmount]) => {
    const packageSize = packageSizes[key] || 1;
    const packages = Math.ceil(totalAmount / packageSize);
    const category = storeMap[key] || 'other';

    // Extract ingredient name and unit
    const match = key.match(/^(.+?)\s*\((.+?)\)$/);
    const ingredient = match ? match[1] : key;
    const unit = match ? match[2] : '';

    const item: ShoppingListItem = {
      ingredient,
      totalAmount,
      unit,
      packages,
      category,
    };

    lists[category].push(item);
  });

  return lists;
};
