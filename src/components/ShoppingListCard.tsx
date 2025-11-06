import { Card } from '@/components/ui/card';
import { ShoppingListItem } from '@/types/beverage';
import { Package } from 'lucide-react';

interface ShoppingListCardProps {
  title: string;
  items: ShoppingListItem[];
}

export const ShoppingListCard = ({ title, items }: ShoppingListCardProps) => {
  return (
    <Card className="overflow-hidden shadow-card transition-smooth hover:shadow-soft">
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 px-6 py-4 border-b">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
      
      <div className="p-6">
        <ul className="space-y-3">
          {items.map((item, idx) => (
            <li
              key={idx}
              className="flex items-start justify-between p-3 rounded-lg bg-secondary/50 transition-smooth hover:bg-secondary"
            >
              <div className="flex items-start gap-3 flex-1">
                <Package className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">{item.ingredient}</p>
                  <p className="text-sm text-muted-foreground">
                    Total: {item.totalAmount.toFixed(2)} {item.unit}
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <p className="text-xl font-bold text-primary">{item.packages}</p>
                <p className="text-xs text-muted-foreground">packages</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};
