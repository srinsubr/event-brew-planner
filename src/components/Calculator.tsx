import { useState, useEffect } from 'react';
import { Coffee, Leaf } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ShoppingListCard } from './ShoppingListCard';
import { calculateShoppingLists } from '@/lib/calculator';
import { loadRecipes, loadPackageSizes, loadStoreMap } from '@/lib/storage';
import type { ShoppingLists } from '@/types/beverage';

export const Calculator = () => {
  const [coffeeBatches, setCoffeeBatches] = useState(0);
  const [teaBatches, setTeaBatches] = useState(0);
  const [shoppingLists, setShoppingLists] = useState<ShoppingLists | null>(null);

  useEffect(() => {
    const recipes = loadRecipes();
    const packageSizes = loadPackageSizes();
    const storeMap = loadStoreMap();
    
    const lists = calculateShoppingLists(
      coffeeBatches,
      teaBatches,
      recipes,
      packageSizes,
      storeMap
    );
    
    setShoppingLists(lists);
  }, [coffeeBatches, teaBatches]);

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <header className="text-center space-y-3">
        <h1 className="text-4xl font-bold text-foreground">Batch Calculator</h1>
        <p className="text-lg text-muted-foreground">
          Enter batch numbers to generate shopping lists
        </p>
      </header>

      <Card className="p-8 shadow-card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="coffee-batches" className="text-base font-semibold flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-coffee flex items-center justify-center">
                <Coffee className="w-4 h-4 text-white" />
              </div>
              Coffee Batches
            </Label>
            <Input
              id="coffee-batches"
              type="number"
              min="0"
              value={coffeeBatches}
              onChange={(e) => setCoffeeBatches(parseInt(e.target.value) || 0)}
              className="text-lg h-14 transition-smooth"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="tea-batches" className="text-base font-semibold flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-tea flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              Tea Batches
            </Label>
            <Input
              id="tea-batches"
              type="number"
              min="0"
              value={teaBatches}
              onChange={(e) => setTeaBatches(parseInt(e.target.value) || 0)}
              className="text-lg h-14 transition-smooth"
            />
          </div>
        </div>
      </Card>

      {shoppingLists && (coffeeBatches > 0 || teaBatches > 0) && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Shopping Lists</h2>
          
          {shoppingLists.costcoDecoction.length > 0 && (
            <ShoppingListCard
              title="Costco - For Decoction"
              items={shoppingLists.costcoDecoction}
            />
          )}
          
          {shoppingLists.costcoPrep.length > 0 && (
            <ShoppingListCard
              title="Costco - For Prep"
              items={shoppingLists.costcoPrep}
            />
          )}
          
          {shoppingLists.indianStoreDecoction.length > 0 && (
            <ShoppingListCard
              title="Indian Store - For Decoction"
              items={shoppingLists.indianStoreDecoction}
            />
          )}
          
          {shoppingLists.indianStorePrep.length > 0 && (
            <ShoppingListCard
              title="Indian Store - For Prep"
              items={shoppingLists.indianStorePrep}
            />
          )}
          
          {shoppingLists.amazonPrep.length > 0 && (
            <ShoppingListCard
              title="Amazon - For Prep"
              items={shoppingLists.amazonPrep}
            />
          )}
          
          {shoppingLists.other.length > 0 && (
            <ShoppingListCard
              title="Other"
              items={shoppingLists.other}
            />
          )}
        </div>
      )}
    </div>
  );
};
