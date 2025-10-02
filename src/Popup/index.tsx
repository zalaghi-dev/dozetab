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
      <div className={`bg-background text-foreground w-full h-full min-h-[500px] flex flex-col ${isRTL ? 'rtl' : 'ltr'}`}>
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 overflow-hidden">
          {renderTabContent()}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Popup;
