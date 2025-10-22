// Central enum for button `value` identifiers used across the popup
export enum ButtonValue {
  ON_NEXT_STARTUP = "on_next_startup",
  IN_ONE_HOUR = "in_one_hour",
  THIS_MORNING = "this_morning",
  THIS_EVENING = "this_evening",
  TOMORROW_MORNING = "tomorrow_morning",
  TOMORROW_EVENING = "tomorrow_evening",
  SATURDAY = "saturday",
  NEXT_MONDAY = "next_monday",
  NEXT_WEEK = "next_week",
  NEXT_MONTH = "next_month",

  EVERY_STARTUP = "every_startup",
  EVERY_HOUR = "every_hour",
  EVERY_MORNING = "every_morning",
  EVERYDAY_NOW = "everyday_now",
  EVERY_EVENING = "every_evening",
  EVERY_MONDAY = "every_monday",
  EVERY_SATURDAY = "every_saturday",
  EVERY_SUNDAY = "every_sunday",
  EVERY_MONTH = "every_month",
  CUSTOM_INTERVAL = "custom_interval",
}

export default ButtonValue;
