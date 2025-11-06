import { useState, useEffect } from 'react';
import { Coffee, Leaf, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingListCard } from './ShoppingListCard';
import { calculateShoppingLists } from '@/lib/calculator';
import { loadRecipes, loadPackageSizes, loadStoreMap, saveTemplate, saveRecipes, savePackageSizes, saveStoreMap } from '@/lib/storage';
import type { ShoppingLists, EventTemplate, Recipes, PackageSizes, StoreMap } from '@/types/beverage';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface CalculatorProps {
  initialTemplate?: EventTemplate;
}

export const Calculator = ({ initialTemplate }: CalculatorProps) => {
  const [coffeeBatches, setCoffeeBatches] = useState(initialTemplate?.coffeeBatches || 0);
  const [teaBatches, setTeaBatches] = useState(initialTemplate?.teaBatches || 0);
  const [shoppingLists, setShoppingLists] = useState<ShoppingLists | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (initialTemplate) {
      setCoffeeBatches(initialTemplate.coffeeBatches);
      setTeaBatches(initialTemplate.teaBatches);
      saveRecipes(initialTemplate.recipes);
      savePackageSizes(initialTemplate.packageSizes);
      saveStoreMap(initialTemplate.storeMap);
    }
  }, [initialTemplate]);

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

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      toast({
        title: 'Name required',
        description: 'Please enter a name for your template.',
        variant: 'destructive',
      });
      return;
    }

    const recipes = loadRecipes();
    const packageSizes = loadPackageSizes();
    const storeMap = loadStoreMap();

    saveTemplate({
      name: templateName,
      coffeeBatches,
      teaBatches,
      recipes,
      packageSizes,
      storeMap,
    });

    toast({
      title: 'Template saved',
      description: `"${templateName}" has been saved successfully.`,
    });

    setShowSaveDialog(false);
    setTemplateName('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <header className="text-center space-y-3">
        <h1 className="text-4xl font-bold text-foreground">Batch Calculator</h1>
        <p className="text-lg text-muted-foreground">
          Enter batch numbers to generate shopping lists
        </p>
      </header>

      <Card className="p-8 shadow-card">
        <div className="flex justify-end mb-4">
          <Button
            onClick={() => setShowSaveDialog(true)}
            variant="outline"
            size="sm"
            disabled={coffeeBatches === 0 && teaBatches === 0}
          >
            <Save className="w-4 h-4 mr-2" />
            Save as Template
          </Button>
        </div>
        
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

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Event Template</DialogTitle>
            <DialogDescription>
              Save your current configuration (batches, recipes, and package sizes) as a reusable template.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="template-name">Template Name</Label>
              <Input
                id="template-name"
                placeholder="e.g., Company Picnic, Monthly Meeting"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveTemplate()}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <div>Coffee Batches: {coffeeBatches}</div>
              <div>Tea Batches: {teaBatches}</div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate}>
              Save Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
