// Native Mobile Phone & Browser Notification Engine

import { LocalNotifications } from '@capacitor/local-notifications';
import { playAlarmSound } from './audioAlarmEngine';

/**
 * Request Native Mobile Phone (Android/iOS) + Desktop Browser Notification Permissions
 */
export const requestNativeNotificationPermission = async () => {
  let mobileGranted = false;
  let browserGranted = false;

  // 1. Mobile Phone Native Permission (Capacitor)
  try {
    const permStatus = await LocalNotifications.requestPermissions();
    if (permStatus.display === 'granted') {
      mobileGranted = true;
    }
  } catch (err) {
    console.log('Mobile Capacitor native notification check skipped (web environment)');
  }

  // 2. Desktop Browser Native Permission
  if ('Notification' in window) {
    try {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        browserGranted = true;
      }
    } catch (err) {
      console.warn('Browser Notification request error:', err);
    }
  }

  if (mobileGranted || browserGranted) {
    return 'granted';
  }
  return 'denied';
};

/**
 * Trigger System Alarm Notification with Audio & Vibration
 */
export const triggerSystemAlarmNotification = async (title, body, soundType = 'chime') => {
  // 1. Play synthesized audio alarm
  playAlarmSound(soundType);

  // 2. Trigger Mobile Phone Native Notification (Capacitor)
  try {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: `🔔 AcademiaSync: ${title}`,
          body: body || 'Study block notification',
          id: Math.floor(Math.random() * 1000000),
          schedule: { at: new Date(Date.now() + 100) },
          sound: null,
          actionTypeId: '',
          extra: null
        }
      ]
    });
  } catch (err) {
    // 3. Fallback to Desktop Browser Notification API
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`🔔 AcademiaSync: ${title}`, {
          body,
          icon: '/vite.svg',
          tag: 'academiasync-alarm'
        });
      } catch (e) {
        console.warn('Desktop Notification error:', e);
      }
    }
  }
};
