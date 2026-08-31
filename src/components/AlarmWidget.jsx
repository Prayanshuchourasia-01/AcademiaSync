import React, { useState, useEffect } from 'react';
import { useScheduler } from '../context/SchedulerContext';
import { Bell, Volume2, VolumeX, ShieldCheck, Globe, RefreshCw, Upload, Download, Key, ShieldAlert } from 'lucide-react';
import { playAlarmSound } from '../utils/audioAlarmEngine';
import { requestNativeNotificationPermission, triggerSystemAlarmNotification } from '../utils/mobileNativeNotificationEngine';
import { syncToCloud, exportAppStateJSON, importAppStateJSON, getSyncRoomId, setSyncRoomId } from '../utils/cloudSyncEngine';

const AlarmWidget = () => {
  const { schedule, systemDate, subjects, exams, assignments, addNotification } = useScheduler();
  const [notifPermission, setNotifPermission] = useState('default');
  const [cloudStatus, setCloudStatus] = useState('synced');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [syncRoom, setSyncRoom] = useState(getSyncRoomId());
  const [showSyncModal, setShowSyncModal] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setNotifPermission(Notification.permission);
    }
  }, []);

  const handleEnableNativeNotifications = async () => {
    const res = await requestNativeNotificationPermission();
    setNotifPermission(res);
    if (res === 'granted') {
      triggerSystemAlarmNotification('Device Alarms Active!', 'Native phone notifications & alarm audio enabled.', 'chime');
    } else {
      alert('Notification permissions were not granted by the device OS settings.');
    }
  };

  const handleTestAlarm = (type) => {
    if (soundEnabled) {
      playAlarmSound(type);
    }
    triggerSystemAlarmNotification('Test Alarm Alert', `Synthesized ${type.toUpperCase()} audio alarm fired on phone.`, type);
  };

  const handleCloudSync = async () => {
    setCloudStatus('syncing');
    await syncToCloud({ schedule, systemDate, subjects, exams, assignments });
    setTimeout(() => {
      setCloudStatus('synced');
      addNotification('Cloud Sync Complete', `Synced under Room ID: ${syncRoom}`, 'success');
    }, 500);
  };

  const handleSaveSyncRoom = (e) => {
    e.preventDefault();
    setSyncRoomId(syncRoom);
    setShowSyncModal(false);
    handleCloudSync();
  };

  const handleExportJSON = () => {
    exportAppStateJSON({ schedule, systemDate, subjects, exams, assignments });
  };

  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const res = importAppStateJSON(event.target.result);
      if (res.success) {
        localStorage.setItem('academia_schedule', JSON.stringify(res.data.schedule || schedule));
        localStorage.setItem('academia_system_date', res.data.systemDate || systemDate);
        window.location.reload();
      } else {
        alert('Invalid JSON data file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="alarm-widget-bar card-glass">
      {/* Native Mobile Notification & Alarm Permission Controller */}
      <div className="widget-col">
        <div className="widget-icon icon-bell">
          <Bell size={20} />
        </div>
        <div>
          <div className="widget-title">Device Alarms & Notifications</div>
          <div className="widget-sub">
            {notifPermission === 'granted' ? (
              <span className="status-good"><ShieldCheck size={14} /> Phone Alarms Active</span>
            ) : (
              <span className="status-warn"><ShieldAlert size={14} /> OS Permission Needed</span>
            )}
          </div>
        </div>

        {notifPermission !== 'granted' && (
          <button className="btn-action btn-urgent btn-mobile-touch" onClick={handleEnableNativeNotifications}>
            Grant OS Alarms
          </button>
        )}
      </div>

      {/* Alarm Sound Tester Controls */}
      <div className="widget-col center-col">
        <span className="tester-label">Test Audio Alarms:</span>
        <div className="sound-btns-group">
          <button className="btn-sound-test" onClick={() => handleTestAlarm('chime')} title="Test Chime">
            🔊 Chime
          </button>
          <button className="btn-sound-test" onClick={() => handleTestAlarm('beep')} title="Test Beep">
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
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </div>
      </div>

      {/* Cross-Device Sync Status (Laptop <-> Phone) */}
      <div className="widget-col right-col">
        <div className="cloud-sync-info">
          <Globe size={16} className="text-info" />
          <button className="room-id-chip" onClick={() => setShowSyncModal(true)} title="Pair Devices">
            <Key size={12} />
            <span>Room: {syncRoom}</span>
          </button>
        </div>

        <div className="sync-actions-group">
          <button className="btn-secondary btn-sm" onClick={handleCloudSync}>
            <RefreshCw size={14} className={cloudStatus === 'syncing' ? 'spin' : ''} />
            <span>Sync</span>
          </button>

          <button className="btn-action btn-custom btn-sm" onClick={handleExportJSON} title="Export Data">
            <Download size={14} />
          </button>

          <label className="btn-action btn-boost btn-sm cursor-pointer" title="Import Data">
            <Upload size={14} />
            <input type="file" accept=".json" onChange={handleImportJSON} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      {/* Sync Room Modal */}
      {showSyncModal && (
        <div className="modal-overlay">
          <div className="modal-card card-glass">
            <div className="modal-header">
              <h3>Configure Cross-Device Sync Passcode</h3>
              <button className="btn-close" onClick={() => setShowSyncModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSaveSyncRoom} className="modal-form">
              <p className="modal-description">
                Enter the exact same <strong>Sync Passcode</strong> on your Laptop and Mobile Phone to pair them instantly!
              </p>
              <div className="form-group">
                <label>Sync Passcode / Room ID:</label>
                <input
                  type="text"
                  className="form-control"
                  value={syncRoom}
                  onChange={(e) => setSyncRoom(e.target.value)}
                  placeholder="e.g. prayanshu_sync_2026"
                  required
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowSyncModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Pair & Sync</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlarmWidget;
