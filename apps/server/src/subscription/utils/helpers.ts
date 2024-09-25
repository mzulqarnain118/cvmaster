import {
  SUBSCRIPTION_STATUS,
  SUBSCRIPTION_ACTIVE_STATUS,
  RECURRING_INTERVALS,
  Duration,
} from "./constants";
import dayjs from "dayjs";

export const amountToCents = (amount: number) => Math.round(amount * 100);
export const unixToDateTime = (unixTimestamp: any) => new Date(unixTimestamp * 1000);

const unixToReadableDate = (unixTimestamp: any, dateFormat = "DD MMMM YYYY") => {
  if (!unixTimestamp) return "";
  return dayjs(unixToDateTime(unixTimestamp)).format(dateFormat);
};

export const getRecurring = (duration: Duration, days: number) => {
  const recurring = RECURRING_INTERVALS[duration];
  if (duration === "days") recurring.interval_count = days;
  return recurring;
};

export const subscriptionActive = (subscription: any): boolean => {
  if (!subscription) return false;
  return SUBSCRIPTION_ACTIVE_STATUS.includes(subscription.status);
};

export const subscriptionStatusLabel = (subscription: any): string => {
  // const pauseOnPeriodEnd = false;
  const { status, cancel_at_period_end, pause_collection, trial_end, current_period_end } =
    subscription;

  // Cancel at period end
  if (cancel_at_period_end == true)
    return `${status === SUBSCRIPTION_STATUS.trialing ? "On Trial" : "Active"} (Cancel on ${unixToReadableDate(
      current_period_end,
      "MMM DD YYYY",
    )})`;

  if (status === SUBSCRIPTION_STATUS.canceled) return `Inactive`;
  if (status === SUBSCRIPTION_STATUS.past_due) return "Past due";
  if (status === SUBSCRIPTION_STATUS.unpaid) return "Unpaid";

  // on Trial
  if (status === SUBSCRIPTION_STATUS.trialing)
    return `Trial ends ${unixToReadableDate(trial_end, "MMM DD YYYY")}`;

  // paused or will pause
  if (pause_collection && Object.keys(pause_collection).length > 0) return "Paused";
  // return pauseOnPeriodEnd == true
  //   ? `Active (Pause on ${unixToReadableDate(current_period_end, "MMM DD YYYY")})`
  //   : `Paused`;

  return `Active (Renewal on ${unixToReadableDate(current_period_end, "MMM DD YYYY")})`;
};
