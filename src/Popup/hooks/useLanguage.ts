import { useState, useEffect } from "react";

type Language = "en" | "fa";

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    "options.this_tab": "This Tab",
    "options.window": "Window",
    "options.selected": "Selected",
    "tabs.snooze": "Snooze Tabs",
    "tabs.snoozed": "Snoozed Tabs",
    "tabs.settings": "Settings",
    "snooze.title": "Snooze Your Tabs",
    "snooze.subtitle": "Select tabs to snooze for later",
    "snooze.button": "Snooze Selected",
    "snooze.duration.15min": "15 minutes",
    "snooze.duration.1hour": "1 hour",
    "snooze.duration.tomorrow": "Tomorrow",
    "snooze.duration.nextweek": "Next week",
    "snooze.duration.custom": "Custom",
    "snoozed.title": "Snoozed Tabs",
    "snoozed.empty": "No snoozed tabs",
    "snoozed.restore": "Restore",
    "snoozed.delete": "Delete",
    "settings.language": "Language",
    "settings.theme": "Theme",
    "settings.notifications": "Notifications",
  },
  fa: {
    "options.this_tab": "همین صفحه",
    "options.window": "پنجره",
    "options.selected": "انتخاب‌شده",
    "tabs.snooze": "خواباندن تب‌ها",
    "tabs.snoozed": "تب‌های خوابیده",
    "tabs.settings": "تنظیمات",
    "snooze.title": "تب‌های خود را بخوابانید",
    "snooze.subtitle": "تب‌هایی را انتخاب کنید که بعداً بیدار شوند",
    "snooze.button": "خواباندن انتخاب شده‌ها",
    "snooze.duration.15min": "\u06f1\u06f5 دقیقه",
    "snooze.duration.1hour": "\u06f1 ساعت",
    "snooze.duration.tomorrow": "فردا",
    "snooze.duration.nextweek": "هفته آینده",
    "snooze.duration.custom": "دلخواه",
    "snoozed.title": "تب‌های خوابیده",
    "snoozed.empty": "تب خوابیده‌ای وجود ندارد",
    "snoozed.restore": "بازگردانی",
    "snoozed.delete": "حذف",
    "settings.language": "زبان",
    "settings.theme": "تم",
    "settings.notifications": "اعلان‌ها",
  },
};

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    // Load saved language
    const savedLanguage = localStorage.getItem("dozetab-language") as Language;
    if (savedLanguage && ["en", "fa"].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem("dozetab-language", newLanguage);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  return {
    language,
    changeLanguage,
    t,
    isRTL: language === "fa",
  };
};
