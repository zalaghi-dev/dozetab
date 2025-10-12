import { useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import "../index.css";
import { TabNavigation } from "./components/TabNavigation";
import { SnoozeTab } from "./components/SnoozeTab";
import { SnoozedTab } from "./components/SnoozedTab";
import { SettingsTab } from "./components/SettingsTab";
import { useLanguage } from "./hooks/useLanguage";
import HeaderSection from "./components/HeaderSection";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon, XIcon } from "lucide-react";

const Popup = () => {
  const [activeTab, setActiveTab] = useState("snooze");
  const { isRTL } = useLanguage();

  const renderTabContent = () => {
    switch (activeTab) {
      case "snooze":
        return <SnoozeTab />;
      case "snoozed":
        return <SnoozedTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <SnoozeTab />;
    }
  };
  const buttonsConfig = [{ icon: "", logo: "" }];
  const [showOwnTime, setShowOwnTime] = useState(false);
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div
        className={`bg-background text-foreground w-full h-full min-h-[600px] flex flex-col ${
          isRTL ? "rtl" : "ltr"
        } relative overflow-hidden`}
      >
        {/* Header with Navigation */}
        <HeaderSection activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="p-4">
          {!showOwnTime ? (
            <div className="grid gap-2  grid-cols-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <Button
                  className="cursor-pointer p-5"
                  key={n}
                  variant="outline"
                >
                  Button {n}
                </Button>
              ))}
            </div>
          ) : (
            <></>
          )}
          {!showOwnTime ? (
            <div className="grid gap-2 p-4 grid-cols-2">
              <Button
                onClick={() => {
                  setShowOwnTime(true);
                }}
                className="cursor-pointer p-5"
                variant="outline"
              >
                Choose your own time
              </Button>
              <div className="flex text-base justify-center gap-2 items-center">
                <Checkbox checked />
                Repeat?
              </div>
            </div>
          ) : (
            <div className="border rounded-lg bg-primary p-3 flex items-center gap-3">
              Choose your own time
              <Checkbox checked />
              Repeat?
              <Button
                style={{
                  paddingInline: 0,
                }}
                onClick={() => {
                  setShowOwnTime(false);
                }}
                className="size-4 rounded-sm p-0"
                variant="outline"
              >
                <XIcon className="size-3" />
              </Button>
            </div>
          )}
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
            onClick={() => setActiveTab("settings")}
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
