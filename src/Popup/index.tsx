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
        {/* Header with Navigation */}
        <div className="bg-black text-white">
          {/* Brand Header */}
          <div className="px-4 py-3 flex items-center justify-center border-b border-border">
            <h1 className="text-lg font-bold">DozeTab 💤</h1>
          </div>
          
          {/* Tab Navigation */}
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {renderTabContent()}
        </div>
        
        {/* Footer */}
        <div className="border-t border-border px-4 py-3 bg-card flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            © 2025 DozeTab - Better tab management
          </p>
          <button 
            onClick={() => setActiveTab('settings')}
            className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            <span>⚙️</span>
            Settings
          </button>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Popup;
