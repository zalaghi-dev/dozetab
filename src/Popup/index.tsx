import { useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import "../index.css";
import { TabNavigation } from "./components/TabNavigation";
import { SnoozeTab } from "./components/SnoozeTab";
import { SnoozedTab } from "./components/SnoozedTab";
import { SettingsTab } from "./components/SettingsTab";
import { useLanguage } from "./hooks/useLanguage";

const Popup = () => {
  const [activeTab, setActiveTab] = useState('snooze');
  const { isRTL } = useLanguage();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'snooze':
        return <SnoozeTab />;
      case 'snoozed':
        return <SnoozedTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <SnoozeTab />;
    }
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className={`bg-background text-foreground w-full h-full min-h-[500px] flex flex-col ${isRTL ? 'rtl' : 'ltr'} relative overflow-hidden`}>
        {/* Header with brand colors */}
        <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-center">
          <h1 className="text-lg font-bold">DozeTab 💤</h1>
        </div>
        
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {renderTabContent()}
        </div>
        
        {/* Footer */}
        <div className="border-t border-border px-4 py-2 bg-card">
          <p className="text-xs text-muted-foreground text-center">
            DozeTab - Better tab management
          </p>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Popup;
