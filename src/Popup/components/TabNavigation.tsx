import { Button } from "@/components/ui/button";
import { useLanguage } from "../hooks/useLanguage";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  const { t } = useLanguage();

  const tabs = [
    { id: 'snooze', label: t('tabs.snooze') },
    { id: 'snoozed', label: t('tabs.snoozed') },
    { id: 'settings', label: t('tabs.settings') }
  ];

  return (
    <div className="flex w-full border-b border-border">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? "default" : "ghost"}
          className={`flex-1 rounded-none border-b-2 ${
            activeTab === tab.id 
              ? "border-primary bg-primary/5" 
              : "border-transparent"
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
};