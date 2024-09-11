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
