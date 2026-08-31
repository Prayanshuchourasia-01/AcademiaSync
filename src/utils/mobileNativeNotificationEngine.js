// Native Mobile Phone Notification Engine using @capacitor/local-notifications

import { LocalNotifications } from '@capacitor/local-notifications';

/**
 * Request Native Mobile Phone Notification Permissions (Android / iOS)
 */
export const requestMobileNotificationPermission = async () => {
  try {
    const status = await LocalNotifications.requestPermissions();
    return status.display;
  } catch (err) {
    console.warn('Capacitor LocalNotifications not available in browser mode:', err);
    return 'browser_fallback';
  }
};

/**
 * Schedule or Trigger Immediate Mobile Phone Alarm Notification
 */
export const triggerMobileAlarmNotification = async (title, body, id = Math.floor(Math.random() * 100000)) => {
  try {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: `⏰ AcademiaSync: ${title}`,
          body,
          id,
          schedule: { at: new Date(Date.now() + 100) }, // Trigger immediately
          sound: 'alarm.wav',
          actionTypeId: '',
          extra: null
        }
      ]
    });
  } catch (err) {
    // Fallback to Web Audio & Desktop Notification API if running in web view
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`⏰ AcademiaSync: ${title}`, { body });
    }
  }
};
