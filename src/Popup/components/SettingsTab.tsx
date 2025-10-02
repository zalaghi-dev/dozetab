import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Globe, Palette, Bell, Sun, Moon } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { useTheme } from "@/components/theme-provider";

export const SettingsTab = () => {
  const { t, language, changeLanguage, isRTL } = useLanguage();
  const { theme, setTheme } = useTheme();

  return (
    <div className={`p-4 space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="space-y-4">
        {/* Language Setting */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Globe className="w-4 h-4" />
            {t('settings.language')}
          </label>
          <Select value={language} onValueChange={changeLanguage}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="fa">فارسی</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Theme Setting */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Palette className="w-4 h-4" />
            {t('settings.theme')}
          </label>
          <div className="flex gap-2">
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTheme('light')}
              className="flex items-center gap-1"
            >
              <Sun className="w-3 h-3" />
              Light
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTheme('dark')}
              className="flex items-center gap-1"
            >
              <Moon className="w-3 h-3" />
              Dark
            </Button>
            <Button
              variant={theme === 'system' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTheme('system')}
              className="flex items-center gap-1"
            >
              System
            </Button>
          </div>
        </div>

        {/* Notifications Setting */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium flex items-center gap-2">
            <Bell className="w-4 h-4" />
            {t('settings.notifications')}
          </label>
          <Switch defaultChecked />
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="text-center space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">DozeTab v1.0.0</h3>
          <p className="text-xs text-muted-foreground">
            Snooze your tabs for better productivity
          </p>
        </div>
      </div>
    </div>
  );
};