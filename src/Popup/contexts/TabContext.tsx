import React, { createContext, useContext, ReactNode } from "react";
import { useTabs, TabInfo, TabSummary } from "../hooks/useTabs";

interface TabContextType {
  selectedMode: string;
  setSelectedMode: (mode: string) => void;
  tabSummary: TabSummary;
  selectedTabs: TabInfo[];
  setSelectedTabs: (tabs: TabInfo[]) => void;
  hasSelectedTabs: boolean;
  refreshTabs: () => Promise<void>;
  getCurrentTab: () => Promise<TabInfo | null>;
  getAllTabs: () => Promise<TabInfo[]>;
  getSelectedTabs: () => Promise<TabInfo[]>;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

interface TabProviderProps {
  children: ReactNode;
}

export const TabProvider = ({ children }: TabProviderProps) => {
  const tabData = useTabs();

  return <TabContext.Provider value={tabData}>{children}</TabContext.Provider>;
};

export const useTabContext = () => {
  const context = useContext(TabContext);
  if (context === undefined) {
    throw new Error("useTabContext must be used within a TabProvider");
  }
  return context;
};
