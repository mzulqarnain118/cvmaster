import { SUBSCRIPTION_ACTIVE_STATUS } from "./constants";

export const subscriptionActive = (subscription: any): boolean => {
  if (!subscription) return false;
  return SUBSCRIPTION_ACTIVE_STATUS.includes(subscription.status);
};
