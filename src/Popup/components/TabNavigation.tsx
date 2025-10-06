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
    }
  ];

  return (
    <div className="flex w-full bg-transparent">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <Button
            key={tab.id}
            variant="ghost"
            className={`flex-1 rounded-none h-10 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === tab.id 
                ? "text-white border-primary bg-transparent" 
                : "text-gray-400 border-transparent hover:text-white hover:border-gray-600"
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