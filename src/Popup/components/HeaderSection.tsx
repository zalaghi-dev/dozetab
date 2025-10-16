import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "../hooks/useLanguage";
import { TabNavigation } from "./TabNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  return (
    <header>
      <h1 className="text-center uppercase font-extrabold">what should I?</h1>
      <div className="grid gap-3 p-4 grid-cols-2">
        <div>
          <Tabs defaultValue={configOption[1].value} className=" w-full">
            <TabsList className="p-1 h-auto w-full bg-background gap-1 border">
              {configOption.map(({ label, value }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
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
              <AvatarImage src="/icons/main/window.png" alt="window" />
              <AvatarFallback>Wi</AvatarFallback>
            </Avatar>
            <p className="font-semibold">Lorem ipsum dolor sit amet consectetur</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderSection;
