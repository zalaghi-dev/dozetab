import { ThemeProvider } from "@/components/theme-provider";
import "../index.css";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

const Popup = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="bg-background text-foreground w-md h-96 flex items-center justify-center font-bold text-2xl">
        <div className="flex flex-col gap-4 items-center">
          DozeTab
          <ModeToggle />
          <Button
            variant="destructive"
            onClick={() => alert("hello Extension")}
          >
            Dozyyyy
          </Button>
        </div>
      </div>
    </ThemeProvider>
  );
};
export default Popup;
