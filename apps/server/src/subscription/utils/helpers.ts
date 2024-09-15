import { SUBSCRIPTION_ACTIVE_STATUS, RECURRING_INTERVALS, Duration } from "./constants";

export const amountToCents = (amount: number) => Math.round(amount * 100);

export const getRecurring = (duration: Duration, days: number) => {
  const recurring = RECURRING_INTERVALS[duration];
  if (duration === "days") recurring.interval_count = days;
  return recurring;
};

export const subscriptionActive = (subscription: any): boolean => {
  if (!subscription) return false;
  return SUBSCRIPTION_ACTIVE_STATUS.includes(subscription.status);
};
