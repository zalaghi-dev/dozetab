import { Button } from "@/components/ui/button";
import { useLanguage } from "../hooks/useLanguage";
import { Clock, History, Settings } from "lucide-react";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  const { t } = useLanguage();

  const tabs = [
    { 
      id: 'snooze', 
      label: t('tabs.snooze'),
      icon: Clock
    },
    { 
      id: 'snoozed', 
      label: t('tabs.snoozed'),
      icon: History
    },
    { 
      id: 'settings', 
      label: t('tabs.settings'),
      icon: Settings
    }
  ];

  return (
    <div className="flex w-full bg-card border-b border-border">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            className={`flex-1 rounded-none h-12 flex items-center gap-2 ${
              activeTab === tab.id 
                ? "bg-primary text-primary-foreground border-b-2 border-primary shadow-sm" 
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{tab.label}</span>
          </Button>
        );
      })}
    </div>
  );
};