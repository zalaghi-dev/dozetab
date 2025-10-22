import { Button } from "@/components/ui/button";
import { nonRepeatButtonsConfig, repeatButtonsConfig } from "../config/buttons";
import { Icon, XIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTabContext } from "../contexts/TabContext";
import ButtonValue from "../config/buttonValues";
interface MainButtonsProps {
  isRepeatEnabled: boolean;
}
const MainButtons = ({ isRepeatEnabled }: MainButtonsProps) => {
  const { selectedMode, getCurrentTab, getAllTabs } = useTabContext();

  const currentButtonsConfig = isRepeatEnabled
    ? repeatButtonsConfig
    : nonRepeatButtonsConfig;
  const handleButtonClick = async (value: ButtonValue) => {
    switch (selectedMode) {
      case "this_tab":
        const tab = await getCurrentTab();
        if (tab?.id) chrome.tabs.remove(tab.id);

        break;
      case "window":
        const tabs = await getAllTabs();
        const chromeWindow = await chrome.windows.getCurrent();
        if (chromeWindow?.id) chrome.windows.remove(chromeWindow.id);

        break;
      case "selected":
        break;

      default:
        break;
    }
  };

  return (
    <div className="grid gap-2 grid-cols-2">
      {currentButtonsConfig.map(({ value, icon, label, time, highlighted }) => (
        <Button
          onClick={() => handleButtonClick(value)}
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
            <span className="text-sm font-medium text-left">{label}</span>
          </div>
          {time && (
            <div
              className={`text-xs text-right whitespace-pre-line leading-tight ${
                highlighted ? "text-orange-100" : "text-muted-foreground"
              }`}
            >
              {time}
            </div>
          )}
        </Button>
      ))}
    </div>
  );
};

export default MainButtons;
