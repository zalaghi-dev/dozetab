// DozeTab Background Service Worker
// Manages snoozed tabs: store, schedule (via chrome.alarms), and restore

import ButtonValue from "@/Popup/config/buttonValues";

type AlarmName = string; // format: dozetab_<id>

interface TabInfo {
	id?: number;
	url: string;
	title: string;
	favIconUrl?: string;
}

type RepeatKind =
	| "hourly"
	| "daily_morning"
	| "daily_evening"
	| "daily_at_time"
	| "weekly_monday"
	| "weekly_saturday"
	| "weekly_sunday"
	| "monthly_12th_9am"
	| "startup";

interface RepeatSpec {
	kind: RepeatKind;
	// For daily_at_time we persist local time of day
	timeOfDay?: { hour: number; minute: number };
}

interface SnoozedTab {
	id: string;
	url: string;
	title: string;
	favIconUrl?: string;
	createdAt: number;
	wakeUpTime?: number; // epoch ms, optional if startup-based
	atStartup?: boolean;
	repeat?: RepeatSpec;
}

interface SnoozeMessage {
	type: "snoozeTabs";
	value: ButtonValue;
	repeat?: boolean;
	tabs: TabInfo[];
}

interface GetSnoozedMessage {
	type: "getSnoozedTabs";
}

type IncomingMessage = SnoozeMessage | GetSnoozedMessage;

const STORAGE_KEY = "snoozedTabsV1";
const ALARM_PREFIX = "dozetab_";

class SnoozeManager {
	private items = new Map<string, SnoozedTab>();

	constructor() {
		this.init();
		chrome.runtime.onMessage.addListener((message: IncomingMessage, _sender, sendResponse) => {
			if (message.type === "snoozeTabs") {
				this.snooze(message.tabs, message.value, !!message.repeat)
					.then(() => sendResponse({ success: true }))
					.catch((e) => {
						console.error("snooze error", e);
						sendResponse({ success: false, error: String(e) });
					});
				return true; // async
			}
			if (message.type === "getSnoozedTabs") {
				sendResponse({ success: true, items: Array.from(this.items.values()) });
				return false;
			}
			return false;
		});

		chrome.alarms.onAlarm.addListener((alarm) => {
			if (!alarm.name.startsWith(ALARM_PREFIX)) return;
			const id = alarm.name.substring(ALARM_PREFIX.length);
			this.onAlarmFired(id).catch((e) => console.error("onAlarmFired error", e));
		});

		chrome.runtime.onStartup.addListener(() => {
			this.handleStartup().catch((e) => console.error("startup handler error", e));
		});
	}

	private async init() {
		const saved = await chrome.storage.local.get([STORAGE_KEY]);
		const arr: SnoozedTab[] = saved[STORAGE_KEY] || [];
		this.items = new Map(arr.map((it) => [it.id, it]));
		// restore alarms
		for (const item of this.items.values()) {
			await this.ensureAlarm(item);
		}
		// open any missed one-shot items
		await this.openDueOneShots();

			// Session-start fallback for startup items: open them once per browser session
			try {
				// storage.session is ephemeral and resets on browser restart
				const ses = await chrome.storage.session.get(["__dozetab_session_started__"]);
				if (!ses.__dozetab_session_started__) {
					await chrome.storage.session.set({ __dozetab_session_started__: Date.now() });
					await this.handleStartup();
				}
			} catch (e) {
				// If session storage is unavailable, ignore; onStartup listener will still handle
				console.debug("session-start check failed", e);
			}
	}

	private async persist() {
		await chrome.storage.local.set({ [STORAGE_KEY]: Array.from(this.items.values()) });
	}

	private alarmName(id: string): AlarmName {
		return `${ALARM_PREFIX}${id}`;
	}

	private async ensureAlarm(item: SnoozedTab) {
		if (item.atStartup) {
			// No alarm needed; handled by onStartup
			return;
		}
		// Remove existing alarm to reschedule
		await chrome.alarms.clear(this.alarmName(item.id));

		if (item.repeat) {
			const when = this.computeNextFromRepeat(item.repeat);
			const period = this.periodForRepeat(item.repeat);
			if (period) {
				await chrome.alarms.create(this.alarmName(item.id), {
					when,
					periodInMinutes: period,
				});
			} else {
				await chrome.alarms.create(this.alarmName(item.id), { when });
			}
		} else if (item.wakeUpTime && item.wakeUpTime > Date.now()) {
			await chrome.alarms.create(this.alarmName(item.id), { when: item.wakeUpTime });
		}
	}

	private periodForRepeat(rep: RepeatSpec): number | undefined {
		switch (rep.kind) {
			case "hourly":
				return 60;
			case "daily_morning":
			case "daily_evening":
			case "daily_at_time":
				return 60 * 24;
			case "weekly_monday":
			case "weekly_saturday":
			case "weekly_sunday":
				return 60 * 24 * 7;
			case "monthly_12th_9am":
			case "startup":
				return undefined; // handled as one-shot then rescheduled on fire/startup
		}
	}

	private computeNextFromRepeat(rep: RepeatSpec, base = new Date()): number {
		const d = new Date(base.getTime());
		const setTime = (h: number, m: number) => {
			d.setSeconds(0, 0);
			d.setHours(h, m, 0, 0);
			if (d.getTime() <= base.getTime()) d.setDate(d.getDate() + 1);
		};
		switch (rep.kind) {
			case "hourly":
				return base.getTime() + 60 * 60 * 1000;
			case "daily_morning":
				setTime(9, 0);
				return d.getTime();
			case "daily_evening":
				setTime(18, 0);
				return d.getTime();
			case "daily_at_time": {
				const h = rep.timeOfDay?.hour ?? base.getHours();
				const m = rep.timeOfDay?.minute ?? base.getMinutes();
				setTime(h, m);
				return d.getTime();
			}
			case "weekly_monday": {
				d.setSeconds(0, 0);
				d.setHours(9, 0, 0, 0);
				const day = d.getDay(); // 0 Sun .. 6 Sat
				const delta = (1 - day + 7) % 7 || 7; // next Monday
				d.setDate(d.getDate() + delta);
				return d.getTime();
			}
			case "weekly_saturday": {
				d.setSeconds(0, 0);
				d.setHours(9, 0, 0, 0);
				const day = d.getDay();
				const delta = (6 - day + 7) % 7 || 7; // next Saturday
				d.setDate(d.getDate() + delta);
				return d.getTime();
			}
			case "weekly_sunday": {
				d.setSeconds(0, 0);
				d.setHours(9, 0, 0, 0);
				const day = d.getDay();
				const delta = (0 - day + 7) % 7 || 7; // next Sunday
				d.setDate(d.getDate() + delta);
				return d.getTime();
			}
			case "monthly_12th_9am": {
				d.setSeconds(0, 0);
				d.setHours(9, 0, 0, 0);
				if (d.getDate() > 12 || (d.getDate() === 12 && d.getTime() <= base.getTime())) {
					d.setMonth(d.getMonth() + 1);
				}
				d.setDate(12);
				return d.getTime();
			}
			case "startup": {
				// Not scheduled via alarms
				return base.getTime();
			}
		}
	}

	private computeSchedule(value: ButtonValue, repeat: boolean): { atStartup?: boolean; wakeUpTime?: number; repeat?: RepeatSpec } {
		const now = new Date();
		const nextOfClock = (h: number, m: number, today: boolean) => {
			const d = new Date(now.getTime());
			d.setSeconds(0, 0);
			d.setHours(h, m, 0, 0);
			if (!today || d.getTime() <= now.getTime()) d.setDate(d.getDate() + 1);
			return d.getTime();
		};

		switch (value) {
				case ButtonValue.IN_ONE_MINUTE:
					return { wakeUpTime: now.getTime() + 60 * 1000 };
			// Non-repeat mapping
			case ButtonValue.ON_NEXT_STARTUP:
				return repeat ? { repeat: { kind: "startup" } } : { atStartup: true };
			case ButtonValue.IN_ONE_HOUR:
				return repeat
					? { repeat: { kind: "hourly" } }
					: { wakeUpTime: now.getTime() + 60 * 60 * 1000 };
			case ButtonValue.THIS_MORNING:
				return repeat
					? { repeat: { kind: "daily_morning" } }
					: { wakeUpTime: nextOfClock(9, 0, true) };
			case ButtonValue.THIS_EVENING:
				return repeat
					? { repeat: { kind: "daily_evening" } }
					: { wakeUpTime: nextOfClock(18, 0, true) };
			case ButtonValue.TOMORROW_MORNING:
				return { wakeUpTime: nextOfClock(9, 0, false) };
			case ButtonValue.TOMORROW_EVENING:
				return { wakeUpTime: nextOfClock(18, 0, false) };
			case ButtonValue.SATURDAY: {
				const d = new Date(now.getTime());
				d.setSeconds(0, 0);
				d.setHours(9, 0, 0, 0);
				const day = d.getDay();
				const delta = (6 - day + 7) % 7 || 7; // next Saturday
				d.setDate(d.getDate() + delta);
				return { wakeUpTime: d.getTime() };
			}
			case ButtonValue.NEXT_MONDAY: {
				const d = new Date(now.getTime());
				d.setSeconds(0, 0);
				d.setHours(9, 0, 0, 0);
				const day = d.getDay();
				const delta = (1 - day + 7) % 7 || 7; // next Monday
				d.setDate(d.getDate() + delta);
				return { wakeUpTime: d.getTime() };
			}
			case ButtonValue.NEXT_WEEK: {
				const d = new Date(now.getTime());
				d.setSeconds(0, 0);
				d.setHours(9, 0, 0, 0);
				const day = d.getDay();
				const delta = (0 - day + 7) % 7 || 7; // next Sunday
				d.setDate(d.getDate() + delta);
				return { wakeUpTime: d.getTime() };
			}
			case ButtonValue.NEXT_MONTH: {
				const d = new Date(now.getTime());
				d.setSeconds(0, 0);
				d.setHours(9, 0, 0, 0);
				d.setMonth(d.getMonth() + 1);
				d.setDate(12);
				return { wakeUpTime: d.getTime() };
			}

			// Repeat mapping
			case ButtonValue.EVERY_STARTUP:
				return { repeat: { kind: "startup" } };
			case ButtonValue.EVERY_HOUR:
				return { repeat: { kind: "hourly" } };
			case ButtonValue.EVERY_MORNING:
				return { repeat: { kind: "daily_morning" } };
			case ButtonValue.EVERYDAY_NOW: {
				return {
					repeat: {
						kind: "daily_at_time",
						timeOfDay: { hour: now.getHours(), minute: now.getMinutes() },
					},
				};
			}
			case ButtonValue.EVERY_EVENING:
				return { repeat: { kind: "daily_evening" } };
			case ButtonValue.EVERY_MONDAY:
				return { repeat: { kind: "weekly_monday" } };
			case ButtonValue.EVERY_SATURDAY:
				return { repeat: { kind: "weekly_saturday" } };
			case ButtonValue.EVERY_SUNDAY:
				return { repeat: { kind: "weekly_sunday" } };
			case ButtonValue.EVERY_MONTH:
				return { repeat: { kind: "monthly_12th_9am" } };
			case ButtonValue.CUSTOM_INTERVAL:
			default:
				// Fallback: one hour later
				return { wakeUpTime: now.getTime() + 60 * 60 * 1000 };
		}
	}

	async snooze(tabs: TabInfo[], value: ButtonValue, repeat: boolean) {
		for (const t of tabs) {
			if (!t.url || t.url.startsWith("chrome://")) continue;
			const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
			const sched = this.computeSchedule(value, repeat);
			const item: SnoozedTab = {
				id,
				url: t.url,
				title: t.title || t.url,
				favIconUrl: t.favIconUrl,
				createdAt: Date.now(),
				...sched,
			};
			this.items.set(id, item);
			await this.ensureAlarm(item);
		}
		await this.persist();
	}

	private async openDueOneShots() {
		const now = Date.now();
		for (const [id, item] of Array.from(this.items.entries())) {
			if (!item.repeat && !item.atStartup && item.wakeUpTime && item.wakeUpTime <= now) {
				await this.openItem(item);
				this.items.delete(id);
			}
		}
		await this.persist();
	}

	private async onAlarmFired(id: string) {
		const item = this.items.get(id);
		if (!item) return;
		await this.openItem(item);
		if (item.repeat) {
			// reschedule next occurrence
			if (item.repeat.kind === "monthly_12th_9am") {
				// one-shot then schedule next month
				const nextTime = this.computeNextFromRepeat(item.repeat);
				item.wakeUpTime = nextTime;
				await this.ensureAlarm(item);
				await this.persist();
			}
			// for periodic alarms (hourly/daily/weekly), Chrome will re-fire automatically
		} else {
			// one-shot: remove after open
			this.items.delete(id);
			await chrome.alarms.clear(this.alarmName(id));
			await this.persist();
		}
	}

	private async handleStartup() {
		// Open items marked at startup or repeat startup
		for (const [id, item] of Array.from(this.items.entries())) {
			if (item.atStartup || item.repeat?.kind === "startup") {
				await this.openItem(item);
				if (!item.repeat) {
					this.items.delete(id);
				}
			}
		}
		await this.persist();
	}

	private async openItem(item: SnoozedTab) {
		await chrome.tabs.create({ url: item.url, active: false });
		try {
			chrome.notifications.create({
				type: "basic",
				iconUrl: "/icon-48.png",
				title: "DozeTab",
				message: `Tab restored: ${item.title}`,
			});
		} catch {}
	}
}

// Initialize manager
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const __manager = new SnoozeManager();

