import { useState, useEffect } from 'react';
import { Save, Trash2, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { loadTemplates, deleteTemplate } from '@/lib/storage';
import type { EventTemplate } from '@/types/beverage';
import { useToast } from '@/hooks/use-toast';

interface EventTemplateManagerProps {
  onLoadTemplate: (template: EventTemplate) => void;
}

export const EventTemplateManager = ({ onLoadTemplate }: EventTemplateManagerProps) => {
  const [templates, setTemplates] = useState<EventTemplate[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setTemplates(loadTemplates());
  }, []);

  const handleDelete = (id: string) => {
    deleteTemplate(id);
    setTemplates(loadTemplates());
    toast({
      title: 'Template deleted',
      description: 'Event template has been removed.',
    });
  };

  const handleLoad = (template: EventTemplate) => {
    onLoadTemplate(template);
    toast({
      title: 'Template loaded',
      description: `Loaded "${template.name}" configuration.`,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <header className="text-center space-y-3">
        <h1 className="text-4xl font-bold text-foreground">Event Templates</h1>
        <p className="text-lg text-muted-foreground">
          Save and reuse event configurations
        </p>
      </header>

      {templates.length === 0 ? (
        <Card className="p-12 text-center">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No templates yet</h3>
          <p className="text-muted-foreground">
            Go to the Calculator tab and save your first event template
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {templates.map((template) => (
            <Card key={template.id} className="p-6 hover:shadow-lg transition-smooth">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div>Coffee Batches: {template.coffeeBatches}</div>
                    <div>Tea Batches: {template.teaBatches}</div>
                    <div className="col-span-2 text-xs mt-1">
                      Created: {new Date(template.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleLoad(template)}
                    variant="default"
                    size="sm"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Load
                  </Button>
                  <Button
                    onClick={() => handleDelete(template.id)}
                    variant="outline"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
