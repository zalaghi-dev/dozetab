import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Globe } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";

interface Tab {
  id: number;
  title: string;
  url: string;
  favIconUrl?: string;
}

export const SnoozeTab = () => {
  const { t, isRTL } = useLanguage();
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [selectedTabs, setSelectedTabs] = useState<number[]>([]);
  const [snoozeDuration, setSnoozeDuration] = useState('15min');

  useEffect(() => {
    // Load current tab list - currently sample data
    setTabs([
      { id: 1, title: "GitHub - Sample Repository", url: "https://github.com/sample" },
      { id: 2, title: "React Documentation", url: "https://react.dev" },
      { id: 3, title: "Tailwind CSS", url: "https://tailwindcss.com" },
      { id: 4, title: "TypeScript Handbook", url: "https://typescriptlang.org" }
    ]);
  }, []);

  const handleTabSelection = (tabId: number, checked: boolean) => {
    if (checked) {
      setSelectedTabs(prev => [...prev, tabId]);
    } else {
      setSelectedTabs(prev => prev.filter(id => id !== tabId));
    }
  };

  const handleSnoozeSelected = () => {
    if (selectedTabs.length > 0) {
      // Here we will call background script later
      console.log('Snoozing tabs:', selectedTabs, 'for:', snoozeDuration);
      setSelectedTabs([]);
    }
  };

  const durations = [
    { value: '15min', label: t('snooze.duration.15min') },
    { value: '1hour', label: t('snooze.duration.1hour') },
    { value: 'tomorrow', label: t('snooze.duration.tomorrow') },
    { value: 'nextweek', label: t('snooze.duration.nextweek') },
    { value: 'custom', label: t('snooze.duration.custom') }
  ];

  return (
    <div className={`p-4 space-y-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="text-center space-y-2">
        <h2 className="text-lg font-semibold">{t('snooze.title')}</h2>
        <p className="text-sm text-muted-foreground">{t('snooze.subtitle')}</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Duration
        </label>
        <Select value={snoozeDuration} onValueChange={setSnoozeDuration}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {durations.map(duration => (
              <SelectItem key={duration.value} value={duration.value}>
                {duration.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {tabs.map(tab => (
          <div key={tab.id} className="flex items-center space-x-2 p-2 rounded-lg border hover:bg-accent/50">
            <Checkbox
              checked={selectedTabs.includes(tab.id)}
              onCheckedChange={(checked: boolean) => handleTabSelection(tab.id, checked)}
            />
            <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{tab.title}</p>
              <p className="text-xs text-muted-foreground truncate">{tab.url}</p>
            </div>
          </div>
        ))}
      </div>

      <Button 
        className="w-full" 
        onClick={handleSnoozeSelected}
        disabled={selectedTabs.length === 0}
      >
        {t('snooze.button')} ({selectedTabs.length})
      </Button>
    </div>
  );
};