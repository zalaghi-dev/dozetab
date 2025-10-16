import { useState, useEffect, useCallback } from "react";

export interface TabInfo {
  id: number;
  title: string;
  url: string;
  favIconUrl?: string;
  active: boolean;
}

export interface TabSummary {
  tabs: TabInfo[];
  totalTabs: number;
  totalWebsites: number;
  displayText: string;
  icon: string;
  title: string;
}

export const useTabs = () => {
  const [selectedMode, setSelectedMode] = useState("window");
  const [tabSummary, setTabSummary] = useState<TabSummary>({
    tabs: [],
    totalTabs: 0,
    totalWebsites: 0,
    displayText: "Loading...",
    icon: "/icons/main/window.png",
    title: "Loading...",
  });
  const [selectedTabs, setSelectedTabs] = useState<TabInfo[]>([]);
  const [hasSelectedTabs, setHasSelectedTabs] = useState(false);

  // Function to get domain from URL
  const getDomain = useCallback((url: string): string => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  }, []);

  // Function to get current active tab
  const getCurrentTab = useCallback(async (): Promise<TabInfo | null> => {
    try {
      const [activeTab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (
        activeTab &&
        activeTab.url &&
        !activeTab.url.startsWith("chrome://")
      ) {
        return {
          id: activeTab.id!,
          title: activeTab.title || "Untitled",
          url: activeTab.url,
          favIconUrl: activeTab.favIconUrl,
          active: true,
        };
      }
      return null;
    } catch (error) {
      console.error("Error getting current tab:", error);
      return null;
    }
  }, []);

  // Function to get all tabs in current window
  const getAllTabs = useCallback(async (): Promise<TabInfo[]> => {
    try {
      const tabs = await chrome.tabs.query({ currentWindow: true });
      return tabs
        .filter((tab) => tab.url && !tab.url.startsWith("chrome://"))
        .map((tab) => ({
          id: tab.id!,
          title: tab.title || "Untitled",
          url: tab.url!,
          favIconUrl: tab.favIconUrl,
          active: tab.active || false,
        }));
    } catch (error) {
      console.error("Error getting all tabs:", error);
      return [];
    }
  }, []);

  // Function to get selected tabs
  const getSelectedTabs = useCallback(async (): Promise<TabInfo[]> => {
    // TODO: Implement actual selected tabs detection
    // For now, return the manually selected tabs
    return selectedTabs;
  }, [selectedTabs]);

  // Function to calculate tab summary
  const calculateTabSummary = useCallback(
    (tabs: TabInfo[], mode: string): TabSummary => {
      if (tabs.length === 0) {
        return {
          tabs: [],
          totalTabs: 0,
          totalWebsites: 0,
          displayText:
            mode === "selected" ? "No tabs selected" : "No tabs found",
          icon: "/icons/main/window.png",
          title: "No tabs",
        };
      }

      if (mode === "this_tab") {
        const currentTab = tabs[0]; // For this_tab mode, we pass single tab
        return {
          tabs: [currentTab],
          totalTabs: 1,
          totalWebsites: 1,
          displayText: currentTab.title,
          icon: currentTab.favIconUrl || "/icons/main/window.png",
          title: currentTab.title,
        };
      }

      // For window and selected modes
      const domains = new Set(tabs.map((tab) => getDomain(tab.url)));
      const totalTabs = tabs.length;
      const totalWebsites = domains.size;

      let displayText = "";
      if (mode === "window") {
        displayText =
          totalWebsites === 1
            ? `${totalTabs} different tabs from 1 website`
            : `${totalTabs} different tabs from ${totalWebsites} websites`;
      } else if (mode === "selected") {
        displayText =
          totalWebsites === 1
            ? `${totalTabs} selected tabs from 1 website`
            : `${totalTabs} selected tabs from ${totalWebsites} different websites`;
      }

      return {
        tabs,
        totalTabs,
        totalWebsites,
        displayText,
        icon: "/icons/main/window.png",
        title: displayText,
      };
    },
    [getDomain]
  );

  // Function to refresh tab data
  const refreshTabs = useCallback(async () => {
    let tabs: TabInfo[] = [];

    switch (selectedMode) {
      case "this_tab":
        const currentTab = await getCurrentTab();
        if (currentTab) {
          tabs = [currentTab];
        }
        break;

      case "window":
        tabs = await getAllTabs();
        break;

      case "selected":
        tabs = await getSelectedTabs();
        break;
    }

    const summary = calculateTabSummary(tabs, selectedMode);
    setTabSummary(summary);
  }, [
    selectedMode,
    getCurrentTab,
    getAllTabs,
    getSelectedTabs,
    calculateTabSummary,
  ]);

  // Effect to update tab summary when mode changes
  useEffect(() => {
    refreshTabs();
  }, [refreshTabs]);

  // Effect to check if there are selected tabs (for enabling/disabling selected option)
  useEffect(() => {
    const checkSelectedTabs = async () => {
      const selected = await getSelectedTabs();
      setHasSelectedTabs(selected.length > 0);
    };

    checkSelectedTabs();
  }, [getSelectedTabs]);

  return {
    selectedMode,
    setSelectedMode,
    tabSummary,
    selectedTabs,
    setSelectedTabs,
    hasSelectedTabs,
    refreshTabs,
    getCurrentTab,
    getAllTabs,
    getSelectedTabs,
  };
};
