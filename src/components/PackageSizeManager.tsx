import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package } from 'lucide-react';
import { loadPackageSizes, savePackageSizes, loadRecipes } from '@/lib/storage';
import type { PackageSizes } from '@/types/beverage';
import { toast } from 'sonner';

export const PackageSizeManager = () => {
  const [packageSizes, setPackageSizes] = useState<PackageSizes>(loadPackageSizes());
  const [allIngredients, setAllIngredients] = useState<string[]>([]);

  useEffect(() => {
    const recipes = loadRecipes();
    const ingredients = new Set<string>();
    
    Object.keys(recipes.Coffee).forEach(key => ingredients.add(key));
    Object.keys(recipes.Tea).forEach(key => ingredients.add(key));
    
    setAllIngredients(Array.from(ingredients).sort());
  }, []);

  const updatePackageSize = (ingredient: string, size: number) => {
    const newSizes = { ...packageSizes, [ingredient]: size };
    setPackageSizes(newSizes);
    savePackageSizes(newSizes);
    toast.success('Package size updated');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <header className="text-center space-y-3">
        <h1 className="text-4xl font-bold text-foreground">Package Sizes</h1>
        <p className="text-lg text-muted-foreground">
          Configure package sizes for accurate quantity calculations
        </p>
      </header>

      <Card className="overflow-hidden shadow-card">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 px-6 py-4 flex items-center gap-3 border-b">
          <Package className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Package Configurations</h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allIngredients.map((ingredient) => {
              const match = ingredient.match(/^(.+?)\s*\((.+?)\)$/);
              const name = match ? match[1] : ingredient;
              const unit = match ? match[2] : '';
              
              return (
                <div key={ingredient} className="space-y-2">
                  <Label htmlFor={ingredient} className="text-sm font-medium">
                    {name}
                    {unit && <span className="text-muted-foreground ml-1">({unit})</span>}
                  </Label>
                  <Input
                    id={ingredient}
                    type="number"
                    min="0"
                    step="0.1"
                    value={packageSizes[ingredient] || 0}
                    onChange={(e) => updatePackageSize(ingredient, parseFloat(e.target.value) || 0)}
                    className="transition-smooth"
                    placeholder="Package size"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
};
