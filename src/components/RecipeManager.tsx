import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Coffee, Leaf, Plus, X } from 'lucide-react';
import { loadRecipes, saveRecipes, loadStoreMap, saveStoreMap } from '@/lib/storage';
import type { Recipes, StoreMap, IngredientData } from '@/types/beverage';
import { toast } from 'sonner';

export const RecipeManager = () => {
  const [recipes, setRecipes] = useState<Recipes>(loadRecipes());
  const [storeMap, setStoreMap] = useState<StoreMap>(loadStoreMap());

  const parseRecipeToIngredients = (recipe: { [key: string]: number }, recipeType: 'Coffee' | 'Tea'): IngredientData[] => {
    return Object.entries(recipe).map(([key, amount]) => {
      const match = key.match(/^(.+?)\s*\((.+?)\)$/);
      const ingredient = match ? match[1] : key;
      const unit = match ? match[2] : '';
      
      const storeCategory = storeMap[key] || 'other';
      let store = 'Other';
      let prepStep = 'N/A';
      
      if (storeCategory.startsWith('costco')) {
        store = 'Costco';
        prepStep = storeCategory.includes('Decoction') ? 'Decoction' : 'Prep';
      } else if (storeCategory.startsWith('indianStore')) {
        store = 'Indian Store';
        prepStep = storeCategory.includes('Decoction') ? 'Decoction' : 'Prep';
      } else if (storeCategory === 'amazonPrep') {
        store = 'Amazon';
        prepStep = 'Prep';
      }
      
      return { ingredient, amount, unit, store, prepStep };
    });
  };

  const coffeeIngredients = parseRecipeToIngredients(recipes.Coffee, 'Coffee');
  const teaIngredients = parseRecipeToIngredients(recipes.Tea, 'Tea');

  const updateIngredient = (
    recipeType: 'Coffee' | 'Tea',
    index: number,
    field: keyof IngredientData,
    value: string | number
  ) => {
    const ingredients = recipeType === 'Coffee' ? [...coffeeIngredients] : [...teaIngredients];
    ingredients[index] = { ...ingredients[index], [field]: value };
    
    saveIngredientsToRecipe(recipeType, ingredients);
  };

  const saveIngredientsToRecipe = (recipeType: 'Coffee' | 'Tea', ingredients: IngredientData[]) => {
    const newRecipe: { [key: string]: number } = {};
    const newStoreMap: StoreMap = { ...storeMap };
    
    ingredients.forEach(({ ingredient, amount, unit, store, prepStep }) => {
      if (!ingredient || !unit) return;
      
      const key = `${ingredient} (${unit})`;
      newRecipe[key] = Number(amount);
      
      // Update store map
      if (store === 'Costco' && prepStep === 'Decoction') {
        newStoreMap[key] = 'costcoDecoction';
      } else if (store === 'Costco' && prepStep === 'Prep') {
        newStoreMap[key] = 'costcoPrep';
      } else if (store === 'Indian Store' && prepStep === 'Decoction') {
        newStoreMap[key] = 'indianStoreDecoction';
      } else if (store === 'Indian Store' && prepStep === 'Prep') {
        newStoreMap[key] = 'indianStorePrep';
      } else if (store === 'Amazon') {
        newStoreMap[key] = 'amazonPrep';
      } else {
        newStoreMap[key] = 'other';
      }
    });
    
    const newRecipes = { ...recipes, [recipeType]: newRecipe };
    setRecipes(newRecipes);
    setStoreMap(newStoreMap);
    saveRecipes(newRecipes);
    saveStoreMap(newStoreMap);
    toast.success('Recipe updated successfully');
  };

  const addIngredient = (recipeType: 'Coffee' | 'Tea') => {
    const ingredients = recipeType === 'Coffee' ? [...coffeeIngredients] : [...teaIngredients];
    ingredients.push({
      ingredient: 'New Ingredient',
      amount: 0,
      unit: 'g',
      store: 'Costco',
      prepStep: 'Prep',
    });
    saveIngredientsToRecipe(recipeType, ingredients);
  };

  const removeIngredient = (recipeType: 'Coffee' | 'Tea', index: number) => {
    const ingredients = recipeType === 'Coffee' ? [...coffeeIngredients] : [...teaIngredients];
    ingredients.splice(index, 1);
    saveIngredientsToRecipe(recipeType, ingredients);
    toast.success('Ingredient removed');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <header className="text-center space-y-3">
        <h1 className="text-4xl font-bold text-foreground">Customize Recipes</h1>
        <p className="text-lg text-muted-foreground">
          Add, remove, or edit ingredients. Changes are saved automatically.
        </p>
      </header>

      {/* Coffee Recipe */}
      <Card className="overflow-hidden shadow-card">
        <div className="gradient-coffee px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Coffee className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Coffee Recipe</h2>
          </div>
          <Button onClick={() => addIngredient('Coffee')} variant="secondary" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Ingredient
          </Button>
        </div>
        
        <div className="p-6 space-y-4">
          {coffeeIngredients.map((ing, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-6 gap-3 p-4 rounded-lg bg-secondary/30">
              <div>
                <Label className="text-xs">Ingredient</Label>
                <Input
                  value={ing.ingredient}
                  onChange={(e) => updateIngredient('Coffee', idx, 'ingredient', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Amount</Label>
                <Input
                  type="number"
                  value={ing.amount}
                  onChange={(e) => updateIngredient('Coffee', idx, 'amount', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Unit</Label>
                <Input
                  value={ing.unit}
                  onChange={(e) => updateIngredient('Coffee', idx, 'unit', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Store</Label>
                <Select value={ing.store} onValueChange={(val) => updateIngredient('Coffee', idx, 'store', val)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Costco">Costco</SelectItem>
                    <SelectItem value="Indian Store">Indian Store</SelectItem>
                    <SelectItem value="Amazon">Amazon</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Prep Step</Label>
                <Select value={ing.prepStep} onValueChange={(val) => updateIngredient('Coffee', idx, 'prepStep', val)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Decoction">Decoction</SelectItem>
                    <SelectItem value="Prep">Prep</SelectItem>
                    <SelectItem value="N/A">N/A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeIngredient('Coffee', idx)}
                  className="w-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Tea Recipe */}
      <Card className="overflow-hidden shadow-card">
        <div className="gradient-tea px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Leaf className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Tea Recipe</h2>
          </div>
          <Button onClick={() => addIngredient('Tea')} variant="secondary" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Ingredient
          </Button>
        </div>
        
        <div className="p-6 space-y-4">
          {teaIngredients.map((ing, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-6 gap-3 p-4 rounded-lg bg-secondary/30">
              <div>
                <Label className="text-xs">Ingredient</Label>
                <Input
                  value={ing.ingredient}
                  onChange={(e) => updateIngredient('Tea', idx, 'ingredient', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Amount</Label>
                <Input
                  type="number"
                  value={ing.amount}
                  onChange={(e) => updateIngredient('Tea', idx, 'amount', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Unit</Label>
                <Input
                  value={ing.unit}
                  onChange={(e) => updateIngredient('Tea', idx, 'unit', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Store</Label>
                <Select value={ing.store} onValueChange={(val) => updateIngredient('Tea', idx, 'store', val)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Costco">Costco</SelectItem>
                    <SelectItem value="Indian Store">Indian Store</SelectItem>
                    <SelectItem value="Amazon">Amazon</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Prep Step</Label>
                <Select value={ing.prepStep} onValueChange={(val) => updateIngredient('Tea', idx, 'prepStep', val)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Decoction">Decoction</SelectItem>
                    <SelectItem value="Prep">Prep</SelectItem>
                    <SelectItem value="N/A">N/A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeIngredient('Tea', idx)}
                  className="w-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
