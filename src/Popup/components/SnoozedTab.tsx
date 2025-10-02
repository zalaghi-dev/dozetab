import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Globe, RotateCcw, Trash2 } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";

interface SnoozedTab {
  id: number;
  title: string;
  url: string;
  snoozeTime: string;
  wakeUpTime: Date;
}

export const SnoozedTab = () => {
  const { t, isRTL } = useLanguage();
  const [snoozedTabs, setSnoozedTabs] = useState<SnoozedTab[]>([]);

  useEffect(() => {
    // Load snoozed tabs - currently sample data
    const sampleSnoozedTabs: SnoozedTab[] = [
      {
        id: 1,
        title: "YouTube - Music Video",
        url: "https://youtube.com/watch?v=sample",
        snoozeTime: "15 minutes",
        wakeUpTime: new Date(Date.now() + 15 * 60 * 1000)
      },
      {
        id: 2,
        title: "Twitter - Social Media",
        url: "https://twitter.com",
        snoozeTime: "1 hour",
        wakeUpTime: new Date(Date.now() + 60 * 60 * 1000)
      }
    ];
    setSnoozedTabs(sampleSnoozedTabs);
  }, []);

  const handleRestore = (tabId: number) => {
    // Restore tab - later background script
    console.log('Restoring tab:', tabId);
    setSnoozedTabs(prev => prev.filter(tab => tab.id !== tabId));
  };

  const handleDelete = (tabId: number) => {
    // Delete snoozed tab
    console.log('Deleting snoozed tab:', tabId);
    setSnoozedTabs(prev => prev.filter(tab => tab.id !== tabId));
  };

  const formatTimeRemaining = (wakeUpTime: Date): string => {
    const now = new Date();
    const diff = wakeUpTime.getTime() - now.getTime();
    
    if (diff <= 0) return "Ready to wake up!";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className={`p-4 space-y-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="text-center space-y-2">
        <h2 className="text-lg font-semibold">{t('snoozed.title')}</h2>
      </div>

      {snoozedTabs.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">{t('snoozed.empty')}</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {snoozedTabs.map(tab => (
            <div key={tab.id} className="p-3 rounded-lg border bg-card space-y-3">
              <div className="flex items-start space-x-2">
                <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{tab.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{tab.url}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{formatTimeRemaining(tab.wakeUpTime)}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRestore(tab.id)}
                    className="h-6 px-2"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    {t('snoozed.restore')}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(tab.id)}
                    className="h-6 px-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};