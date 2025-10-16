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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TabProvider } from "./contexts/TabContext";

const Popup = () => {
  const [activeTab, setActiveTab] = useState("snooze");
  const [isRepeatEnabled, setIsRepeatEnabled] = useState(false);
  const { isRTL } = useLanguage();

  // const renderTabContent = () => {
  //   switch (activeTab) {
  //     case "snooze":
  //       return <SnoozeTab />;
  //     case "snoozed":
  //       return <SnoozedTab />;
  //     case "settings":
  //       return <SettingsTab />;
  //     default:
  //       return <SnoozeTab />;
  //   }
  // };

  const nonRepeatButtonsConfig = [
    {
      icon: "/icons/main/startup.png",
      label: "On Next Startup",
      time: "",
      highlighted: false,
    },
    {
      icon: "/icons/main/in-an-hour.png",
      label: "In One Hour",
      time: "TODAY\n6:09 PM",
      highlighted: true,
    },
    {
      icon: "/icons/main/today-morning.png",
      label: "This Morning",
      time: "TODAY\n9 AM",
      highlighted: false,
    },
    {
      icon: "/icons/main/today-evening.png",
      label: "This Evening",
      time: "TODAY\n6 PM",
      highlighted: false,
    },
    {
      icon: "/icons/main/tom-morning.png",
      label: "Tomorrow Morning",
      time: "MON, 13 OCT\n9 AM",
      highlighted: false,
    },
    {
      icon: "/icons/main/tom-evening.png",
      label: "Tomorrow Evening",
      time: "MON, 13 OCT\n6 PM",
      highlighted: false,
    },
    {
      icon: "/icons/main/weekend.png",
      label: "Saturday",
      time: "SAT, 18 OCT\n9 AM",
      highlighted: false,
    },
    {
      icon: "/icons/main/monday.png",
      label: "Next Monday",
      time: "MON, 13 OCT\n9 AM",
      highlighted: false,
    },
    {
      icon: "/icons/main/week.png",
      label: "Next Week",
      time: "SUN, 19 OCT\n9 AM",
      highlighted: false,
    },
    {
      icon: "/icons/main/month.png",
      label: "Next Month",
      time: "WED, 12 NOV\n9 AM",
      highlighted: false,
    },
  ];

  const repeatButtonsConfig = [
    {
      icon: "/icons/main/startup.png",
      label: "Every Browser Startup",
      time: "",
      highlighted: false,
    },
    {
      icon: "/icons/main/in-an-hour.png",
      label: "Every hour",
      time: "STARTS AT\n6:09 PM",
      highlighted: false,
    },
    {
      icon: "/icons/main/today-morning.png",
      label: "Every Morning",
      time: "STARTS TOM AT\n9:00 AM",
      highlighted: false,
    },
    {
      icon: "/icons/main/today-evening.png",
      label: "Everyday, Now",
      time: "STARTS TOM AT\n5:09 PM",
      highlighted: false,
    },
    {
      icon: "/icons/main/tom-morning.png",
      label: "This Evening",
      time: "STARTS TODAY AT\n6:00 PM",
      highlighted: false,
    },
    {
      icon: "/icons/main/tom-evening.png",
      label: "Every Monday",
      time: "MONDAYS AT\n9 AM",
      highlighted: false,
    },
    {
      icon: "/icons/main/weekend.png",
      label: "Every Saturday",
      time: "SATURDAYS AT\n9 AM",
      highlighted: false,
    },
    {
      icon: "/icons/main/monday.png",
      label: "Every Sunday",
      time: "SUNDAYS AT\n9 AM",
      highlighted: false,
    },
    {
      icon: "/icons/main/week.png",
      label: "Every Month",
      time: "12TH OF MONTH\n9 AM",
      highlighted: false,
    },
    {
      icon: "/icons/main/month.png",
      label: "Choose a custom interval",
      time: "",
      highlighted: false,
    },
  ];

  const currentButtonsConfig = isRepeatEnabled
    ? repeatButtonsConfig
    : nonRepeatButtonsConfig;
  const [showOwnTime, setShowOwnTime] = useState(false);
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TabProvider>
        <div
          className={`bg-background text-foreground w-full h-full min-h-[600px] flex flex-col ${
            isRTL ? "rtl" : "ltr"
          } relative overflow-hidden`}
        >
          {/* Header with Navigation */}
          <HeaderSection activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="p-4">{!showOwnTime ? (
              <div className="grid gap-2 grid-cols-2">
                {currentButtonsConfig.map(
                  ({ icon, label, time, highlighted }) => (
                    <Button
                      className={`cursor-pointer justify-between p-3 h-auto min-h-[60px] ${
                        highlighted
                          ? "bg-orange-500 hover:bg-orange-600 text-white border-orange-500"
                          : "hover:bg-muted/50"
                      }`}
                      key={label}
                      variant={highlighted ? "default" : "outline"}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <Avatar className="rounded-none size-6 flex-shrink-0">
                          <AvatarImage src={icon} alt={label} />
                          <AvatarFallback className="rounded-none text-xs">
                            {label.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-left">
                          {label}
                        </span>
                      </div>
                      {time && (
                        <div
                          className={`text-xs text-right whitespace-pre-line leading-tight ${
                            highlighted
                              ? "text-orange-100"
                              : "text-muted-foreground"
                          }`}
                        >
                          {time}
                        </div>
                      )}
                    </Button>
                  )
                )}
              </div>
            ) : (
              <></>
            )}

            <div className="grid gap-2 p-4 grid-cols-2">
              <div className="flex text-base justify-center gap-2 items-center">
                <Checkbox
                  checked={isRepeatEnabled}
                  onCheckedChange={(checked) => setIsRepeatEnabled(!!checked)}
                />
                Repeat?
              </div>
            </div>
            {/* {!showOwnTime ? (
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
            )} */}
          </div>
          {/* <div className="flex-1 overflow-y-auto custom-scrollbar">
            {renderTabContent()}
          </div> */}

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
      </TabProvider>
    </ThemeProvider>
  );
};

export default Popup;
