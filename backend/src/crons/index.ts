import { startProgramLifecycleCron } from "./programLifecycle.cron";
import { startProgramProgressCron } from "./programProgress.cron";
import { startProgramDayUnlockCron } from "./programDayUnlock.cron";

export const startCrons = (): void => {
  startProgramLifecycleCron();
  startProgramProgressCron();
  startProgramDayUnlockCron();
};
