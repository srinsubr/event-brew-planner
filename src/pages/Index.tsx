import { useState } from 'react';
import { Calculator as CalculatorIcon, BookOpen, Package, Calendar } from 'lucide-react';
import { Calculator } from '@/components/Calculator';
import { RecipeManager } from '@/components/RecipeManager';
import { PackageSizeManager } from '@/components/PackageSizeManager';
import { EventTemplateManager } from '@/components/EventTemplateManager';
import type { EventTemplate } from '@/types/beverage';

type TabType = 'calculator' | 'recipes' | 'packages' | 'templates';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('calculator');
  const [loadedTemplate, setLoadedTemplate] = useState<EventTemplate | undefined>();

  const tabs = [
    { id: 'calculator' as TabType, label: 'Calculator', icon: CalculatorIcon },
    { id: 'recipes' as TabType, label: 'Recipes', icon: BookOpen },
    { id: 'packages' as TabType, label: 'Package Sizes', icon: Package },
    { id: 'templates' as TabType, label: 'Templates', icon: Calendar },
  ];

  const handleLoadTemplate = (template: EventTemplate) => {
    setLoadedTemplate(template);
    setActiveTab('calculator');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-sm sticky top-0 z-50 backdrop-blur-sm bg-card/95">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Event Beverage Planner
              </h1>
              <p className="text-sm text-muted-foreground">Professional batch calculator for events</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-card border-b shadow-sm">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex gap-2 py-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-smooth whitespace-nowrap
                    ${activeTab === tab.id
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'calculator' && <Calculator initialTemplate={loadedTemplate} />}
        {activeTab === 'recipes' && <RecipeManager />}
        {activeTab === 'packages' && <PackageSizeManager />}
        {activeTab === 'templates' && <EventTemplateManager onLoadTemplate={handleLoadTemplate} />}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t bg-card">
        <div className="container max-w-7xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>Event Beverage Planner - Simplifying large-scale beverage preparation</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
