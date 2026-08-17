import { startSubscriptionLifecycleCron } from "./subscriptionLifecycle.cron";
import { startProgramLifecycleCron } from "./programLifecycle.cron";
import { startProgramProgressCron } from "./programProgress.cron";
import { startProgramDayUnlockCron } from "./programDayUnlock.cron";

export const startCrons = (): void => {
  startSubscriptionLifecycleCron();
  startProgramLifecycleCron();
  startProgramProgressCron();
  startProgramDayUnlockCron();
};
