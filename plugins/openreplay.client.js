import Tracker from '@openreplay/tracker';
import trackerAxios from '@openreplay/tracker-axios';
import { v4 as uuidV4 } from 'uuid';
function defaultGetUserId() {
  return uuidV4();
}

export default (context, inject) => {
  const app = context.app;
  inject('openReplayTracker', () => {
    const config = app.$config.openreplay;
    if (config.projectKey.length > 0) {
      return false;
    }
    console.log('Starting OpenReplay tracker...', config);
    const getUserId =
      config?.userIdEnabled && config?.getUserId
        ? config.getUserId
        : defaultGetUserId;
    let userId = null;
    const trackerConfig = {
      projectKey: config?.projectKey,
    };

    const tracker = new Tracker(trackerConfig);
    if (config?.userIdEnabled) {
      userId = getUserId();
      tracker.setUserID(userId);
    }
    // const axiosOptions = {}
    tracker.use(trackerAxios()); // check list of available options below
    tracker.start();
    return {
      tracker,
      userId,
    };
  });
};
