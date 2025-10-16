// DozeTab Background Script - Chrome Extension

// Define types for extension APIs
interface SnoozedTab {
  id: string;
  url: string;
  title: string;
  wakeUpTime: number;
  originalTabId?: number;
}

// Message types
type ExtensionMessage = 
  | { action: 'getTabs' }
  | { action: 'snoozeTabs'; tabIds: number[]; duration: string }
  | { action: 'getSnoozedTabs' }
  | { action: 'restoreTab'; tabId: string }
  | { action: 'deleteTab'; tabId: string };

// Response types
type ExtensionResponse = 
  | { success: true; tabs: chrome.tabs.Tab[] }
  | { success: true; tabs: SnoozedTab[] }
  | { success: boolean }
  | { success: false; error: string };

type SnoozeDuration = '15min' | '1hour' | 'tomorrow' | 'nextweek';

class DozeTabManager {
  private snoozedTabs: Map<string, SnoozedTab> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.init();
  }

  private async init() {
    // Load saved tabs from storage
    const stored = await chrome.storage.local.get(["snoozedTabs"]);
    if (stored.snoozedTabs) {
      this.snoozedTabs = new Map(stored.snoozedTabs);
      this.restoreTimers();
    }

    // Setup listeners
    this.setupListeners();
  }

  private setupListeners(): void {
    // Messaging with popup
    chrome.runtime.onMessage.addListener(
      (
        message: ExtensionMessage,
        sender: chrome.runtime.MessageSender,
        sendResponse: (response: ExtensionResponse) => void
      ): boolean => {
        this.handleMessage(message, sendResponse);
        return true; // Required for async sendResponse
      }
    );

    // Tab removal listener to clean up snoozed tabs
    chrome.tabs.onRemoved.addListener((tabId: number) => {
      this.snoozedTabs.delete(tabId.toString());
      this.saveSnoozedTabs();
    });
  }

  private async handleMessage(
    message: ExtensionMessage,
    sendResponse: (response: ExtensionResponse) => void
  ): Promise<void> {
    try {
      switch (message.action) {
        case "getTabs":
          const tabs = await this.getCurrentTabs();
          sendResponse({ success: true, tabs });
          break;

        case "snoozeTabs":
          const result = await this.snoozeTabs(message.tabIds, message.duration);
          sendResponse({ success: result });
          break;

        case "getSnoozedTabs":
          const snoozed = Array.from(this.snoozedTabs.values());
          sendResponse({ success: true, tabs: snoozed });
          break;

        case "restoreTab":
          const restored = await this.restoreTab(message.tabId);
          sendResponse({ success: restored });
          break;

        case "deleteTab":
          const deleted = this.deleteSnoozedTab(message.tabId);
          sendResponse({ success: deleted });
          break;

        default:
          sendResponse({ success: false, error: "Unknown action" });
      }
    } catch (error) {
      console.error("Error handling message:", error);
      sendResponse({ success: false, error: "Internal error" });
    }
  }

  private async getCurrentTabs(): Promise<chrome.tabs.Tab[]> {
    try {
      const tabs = await chrome.tabs.query({ currentWindow: true });
      return tabs.filter(
        (tab: chrome.tabs.Tab) =>
          tab.url &&
          !tab.url.startsWith("chrome://") &&
          !tab.url.startsWith("moz-extension://")
      );
    } catch (error) {
      console.error("Error getting tabs:", error);
      return [];
    }
  }

  private async snoozeTabs(
    tabIds: number[],
    duration: string
  ): Promise<boolean> {
    try {
      const wakeUpTime = this.calculateWakeUpTime(duration);

      for (const tabId of tabIds) {
        const tab = await chrome.tabs.get(tabId);
        if (tab && tab.url && tab.title) {
          const snoozedTab: SnoozedTab = {
            id: `${Date.now()}-${tabId}`,
            url: tab.url,
            title: tab.title,
            wakeUpTime,
            originalTabId: tabId,
          };

          this.snoozedTabs.set(snoozedTab.id, snoozedTab);
          this.setWakeUpTimer(snoozedTab);

          // Close original tab
          await chrome.tabs.remove(tabId);
        }
      }

      await this.saveSnoozedTabs();
      return true;
    } catch (error) {
      console.error("Error snoozing tabs:", error);
      return false;
    }
  }

  private calculateWakeUpTime(duration: string): number {
    const now = Date.now();
    switch (duration) {
      case "15min":
        return now + 15 * 60 * 1000;
      case "1hour":
        return now + 60 * 60 * 1000;
      case "tomorrow":
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(9, 0, 0, 0);
        return tomorrow.getTime();
      case "nextweek":
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        nextWeek.setHours(9, 0, 0, 0);
        return nextWeek.getTime();
      default:
        return now + 15 * 60 * 1000; // default 15min
    }
  }

  private setWakeUpTimer(snoozedTab: SnoozedTab) {
    const delay = snoozedTab.wakeUpTime - Date.now();

    if (delay > 0) {
      const timer = setTimeout(() => {
        this.wakeUpTab(snoozedTab.id);
      }, delay);

      this.timers.set(snoozedTab.id, timer);
    }
  }

  private async wakeUpTab(tabId: string) {
    const snoozedTab = this.snoozedTabs.get(tabId);
    if (snoozedTab) {
      try {
        // Open tab
        await chrome.tabs.create({
          url: snoozedTab.url,
          active: false,
        });

        // Show notification
        chrome.notifications.create({
          type: "basic",
          iconUrl: "/icon-48.png",
          title: "DozeTab",
          message: `Tab restored: ${snoozedTab.title}`,
        });

        // Remove from list
        this.snoozedTabs.delete(tabId);
        await this.saveSnoozedTabs();
      } catch (error) {
        console.error("Error waking up tab:", error);
      }
    }
  }

  private async restoreTab(tabId: string): Promise<boolean> {
    const snoozedTab = this.snoozedTabs.get(tabId);
    if (snoozedTab) {
      try {
        await chrome.tabs.create({
          url: snoozedTab.url,
          active: true,
        });

        this.deleteSnoozedTab(tabId);
        return true;
      } catch (error) {
        console.error("Error restoring tab:", error);
        return false;
      }
    }
    return false;
  }

  private deleteSnoozedTab(tabId: string): boolean {
    if (this.snoozedTabs.has(tabId)) {
      // Remove timer
      const timer = this.timers.get(tabId);
      if (timer) {
        clearTimeout(timer);
        this.timers.delete(tabId);
      }

      // Remove tab
      this.snoozedTabs.delete(tabId);
      this.saveSnoozedTabs();
      return true;
    }
    return false;
  }

  private async saveSnoozedTabs() {
    const dataToSave = Array.from(this.snoozedTabs.entries());
    await chrome.storage.local.set({ snoozedTabs: dataToSave });
  }

  private restoreTimers() {
    for (const [id, snoozedTab] of this.snoozedTabs) {
      if (snoozedTab.wakeUpTime > Date.now()) {
        this.setWakeUpTimer(snoozedTab);
      } else {
        // If time has passed, wake up immediately
        this.wakeUpTab(id);
      }
    }
  }

  private handleTabClosed(tabId: number) {
    // If a snoozed tab was closed, do nothing
    // We can log or track here
  }
}

// Start manager
const dozeTabManager = new DozeTabManager();

console.log("DozeTab background script loaded");
