import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "../hooks/useLanguage";
import { TabNavigation } from "./TabNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTabContext } from "../contexts/TabContext";

interface HeaderSectionProps {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const configOption = [
  {
    label: "options.this_tab",
    value: "this_tab",
  },
  {
    label: "options.window",
    value: "window",
  },
  {
    label: "options.selected",
    value: "selected",
  },
];

const HeaderSection = ({ activeTab, setActiveTab }: HeaderSectionProps) => {
  const { t } = useLanguage();
  const { 
    selectedMode, 
    setSelectedMode, 
    tabSummary, 
    hasSelectedTabs
  } = useTabContext();
  return (
    <header>
      <h1 className="text-center uppercase font-extrabold">what should I?</h1>
      <div className="grid gap-3 p-4 grid-cols-2">
        <div>
          <Tabs 
            value={selectedMode} 
            onValueChange={setSelectedMode}
            className="w-full"
          >
            <TabsList className="p-1 h-auto w-full bg-background gap-1 border">
              {configOption.map(({ label, value }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  disabled={value === 'selected' && !hasSelectedTabs}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t(label)}
                </TabsTrigger>
              ))}
            </TabsList>
            {/* {configOption.map(({ value, label }) => (
              <TabsContent key={value} value={value}>
                <div className="h-10 flex items-center justify-between border gap-2 rounded-md pl-3 pr-1.5">
                  Hello world
                </div>
              </TabsContent>
            ))} */}
          </Tabs>
        </div>
        <div>
          <div className="flex bg-muted items-center px-3 p-1 rounded-lg h-full w-full gap-3 border">
            <Avatar className="ring-2 size-6 ring-background">
              <AvatarImage src={tabSummary.icon} alt="tab icon" />
              <AvatarFallback>
                {selectedMode === 'this_tab' ? 'Tab' : 'Win'}
              </AvatarFallback>
            </Avatar>
            <p className="font-semibold text-sm leading-tight flex-1 truncate">
              {tabSummary.displayText}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderSection;
