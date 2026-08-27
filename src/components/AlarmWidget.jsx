import React, { useState, useEffect } from 'react';
import { useScheduler } from '../context/SchedulerContext';
import { Bell, Volume2, VolumeX, ShieldCheck, Sparkles, Check, Smartphone, Globe, RefreshCw } from 'lucide-react';
import { playAlarmSound, requestNativeNotificationPermission, triggerSystemAlarmNotification } from '../utils/audioAlarmEngine';
import { syncToCloud, exportAppStateJSON } from '../utils/cloudSyncEngine';

const AlarmWidget = () => {
  const { schedule, systemDate, subjects, exams, assignments } = useScheduler();
  const [notifPermission, setNotifPermission] = useState('default');
  const [cloudStatus, setCloudStatus] = useState('synced'); // 'synced' | 'syncing'
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    if ('Notification' in window) {
      setNotifPermission(Notification.permission);
    }
  }, []);

  const handleEnableNativeNotifications = async () => {
    const res = await requestNativeNotificationPermission();
    setNotifPermission(res);
    if (res === 'granted') {
      triggerSystemAlarmNotification('Desktop Alarms Enabled!', 'Native OS background alarm notifications active.', 'chime');
    }
  };

  const handleTestAlarm = (type) => {
    if (soundEnabled) {
      playAlarmSound(type);
    }
    triggerSystemAlarmNotification('Test Alarm Alert', `Synthesized ${type.toUpperCase()} sound played.`, type);
  };

  const handleCloudSync = async () => {
    setCloudStatus('syncing');
    await syncToCloud({ schedule, systemDate, subjects, exams, assignments });
    setTimeout(() => {
      setCloudStatus('synced');
    }, 600);
  };

  const handleExportJSON = () => {
    exportAppStateJSON({ schedule, systemDate, subjects, exams, assignments });
  };

  return (
    <div className="alarm-widget-bar card-glass">
      {/* Native Notification & Sound Alarm Status */}
      <div className="widget-col">
        <div className="widget-icon icon-bell">
          <Bell size={20} />
        </div>
        <div>
          <div className="widget-title">Native App Alarms & Audio Synth</div>
          <div className="widget-sub">
            {notifPermission === 'granted' ? (
              <span className="status-good"><ShieldCheck size={12} /> OS Desktop Notifications Active</span>
            ) : (
              <span className="status-warn">Permission needed for background alarms</span>
            )}
          </div>
        </div>

        {notifPermission !== 'granted' && (
          <button className="btn-action btn-urgent btn-sm" onClick={handleEnableNativeNotifications}>
            Enable OS Alarms
          </button>
        )}
      </div>

      {/* Alarm Sound Tester Controls */}
      <div className="widget-col center-col">
        <span className="tester-label">Test Audio Alarms:</span>
        <button className="btn-sound-test" onClick={() => handleTestAlarm('chime')} title="Test Cyber Chime">
          🔊 Chime
        </button>
        <button className="btn-sound-test" onClick={() => handleTestAlarm('beep')} title="Test Classic Beep">
          🔊 Beep
        </button>
        <button className="btn-sound-test test-urgent" onClick={() => handleTestAlarm('urgent')} title="Test Siren">
          🚨 Siren
        </button>
        <button
          className="btn-icon-sm"
          onClick={() => setSoundEnabled(!soundEnabled)}
          title={soundEnabled ? 'Mute Alarm Sounds' : 'Unmute Alarm Sounds'}
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
      </div>

      {/* Cloud Web Sync Status */}
      <div className="widget-col right-col">
        <div className="cloud-sync-info">
          <Globe size={16} className="text-info" />
          <span>Web & App Cloud Sync:</span>
          <span className="cloud-badge">{cloudStatus === 'synced' ? '🟢 Online Synced' : '🔄 Syncing...'}</span>
        </div>

        <button className="btn-secondary btn-sm" onClick={handleCloudSync}>
          <RefreshCw size={14} className={cloudStatus === 'syncing' ? 'spin' : ''} />
          <span>Sync Cloud</span>
        </button>

        <button className="btn-action btn-custom btn-sm" onClick={handleExportJSON} title="Export Cloud Data JSON">
          Export App Data
        </button>
      </div>
    </div>
  );
};

export default AlarmWidget;
