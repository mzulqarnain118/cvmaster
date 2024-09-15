export const PRODUCT_ID = "prod_QnihnoExaBUFZa";

export const SUBSCRIPTION_STATUS = {
  incomplete: "incomplete",
  incomplete_expired: "incomplete_expired",
  trialing: "trialing",
  active: "active",
  past_due: "past_due",
  canceled: "canceled",
  unpaid: "unpaid",
  paused: "paused",
};

export const SUBSCRIPTION_ACTIVE_STATUS = [
  SUBSCRIPTION_STATUS.trialing,
  SUBSCRIPTION_STATUS.active,
  SUBSCRIPTION_STATUS.past_due,
  SUBSCRIPTION_STATUS.paused,
];

export const RECURRING_INTERVALS = {
  month: {
    interval: "month",
    interval_count: 1,
  },
  quarterly: {
    interval: "month",
    interval_count: 3,
  },
  sixMonths: {
    interval: "month",
    interval_count: 6,
  },
  year: {
    interval: "year",
    interval_count: 1,
  },
  days: {
    interval: "day",
    interval_count: 1,
  },
};

export type Duration = keyof typeof RECURRING_INTERVALS;
