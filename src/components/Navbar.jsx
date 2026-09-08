import React, { useState } from 'react';
import { useScheduler } from '../context/SchedulerContext';
import {
  Calendar,
  Clock,
  Zap,
  Coffee,
  Umbrella,
  AlertTriangle,
  Award,
  BarChart3,
  Bell,
  RefreshCw,
  Plus,
  ChevronLeft,
  ChevronRight,
  Download,
  Flame,
  X
} from 'lucide-react';
import { addDays, formatDisplayDate, formatDate } from '../utils/dateUtils';
import { calculateStreakStats } from '../utils/habitTracker';

const Navbar = ({
  onOpenHolidayModal,
  onOpenVacationModal,
  onOpenExamAssignModal,
  onOpenBoostModal,
  onOpenCustomBlockModal,
  onOpenBackupModal
}) => {
  const {
    systemDate,
    setSystemDate,
    activeTab,
    setActiveTab,
    notifications,
    triggerCascadeMissedBlocks
  } = useScheduler();

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const streakStats = calculateStreakStats(schedule, systemDate);

  const handlePrevDay = () => setSystemDate(addDays(systemDate, -1));
  const handleNextDay = () => setSystemDate(addDays(systemDate, 1));

  const handleDateChange = (e) => {
    const val = e.target.value;
    if (val) {
      setSystemDate(formatDate(val));
    }
  };

  return (
    <header className="navbar-container">
      {/* Mobile & Desktop Header Bar */}
      <div className="navbar-top card-glass">
        <div className="brand-section">
          <div className="logo-badge">
            <Zap className="logo-icon" />
          </div>
          <div className="brand-titles">
            <h1 className="brand-title">AcademiaSync</h1>
            <span className="app-version-badge">NATIVE APP</span>
          </div>
        </div>

        {/* Custom Reference System Date Controller */}
        <div className="date-control-card">
          <button
            type="button"
            className="btn-date-nav"
            onClick={handlePrevDay}
            title="Previous Day"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="date-display-group">
            <input
              type="date"
              className="date-input"
              value={formatDate(systemDate)}
              onChange={handleDateChange}
            />
            <span className="date-formatted-text">{formatDisplayDate(systemDate)}</span>
          </div>

          <button
            type="button"
            className="btn-date-nav"
            onClick={handleNextDay}
            title="Next Day"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Header Right Actions */}
        <div className="header-actions">
          {/* Streak Flame Badge */}
          <div className="streak-badge-pill flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold text-xs" title={`${streakStats.currentStreak} Day Study Streak Active!`}>
            <Flame size={14} className="text-amber-400 fill-amber-400" />
            <span>{streakStats.currentStreak}d</span>
          </div>

          {/* Notifications Bell */}
          <div className="notif-wrapper">
            <button
              type="button"
              className="btn-icon"
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              title="System Alarms & Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
            </button>

            {showNotifDropdown && (
              <div className="notif-dropdown card-glass">
                <div className="notif-header">
                  <h4>Alarms & Schedule Shifts</h4>
                  <button type="button" className="btn-close-sm" onClick={() => setShowNotifDropdown(false)}>
                    <X size={16} />
                  </button>
                </div>
                <div className="notif-list">
                  {notifications.length === 0 ? (
                    <p className="notif-empty">No active notifications.</p>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className={`notif-item notif-${n.type}`}>
                        <div className="notif-item-title">{n.title}</div>
                        <div className="notif-item-msg">{n.message}</div>
                        <div className="notif-item-time">Ref Date: {n.time}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            className="btn-secondary btn-icon-only-mobile"
            onClick={triggerCascadeMissedBlocks}
            title="Scan & Cascade Missed Blocks"
          >
            <RefreshCw size={16} />
            <span className="hide-mobile">Cascade Missed</span>
          </button>

          <button
            type="button"
            className="btn-action-trigger"
            onClick={() => setShowQuickActions(!showQuickActions)}
            title="Scheduler Engine Tools"
          >
            {showQuickActions ? <X size={20} /> : <Zap size={20} />}
          </button>
        </div>
      </div>

      {/* Quick Action Engine Triggers Drawer */}
      {showQuickActions && (
        <div className="quick-actions-bar card-glass">
          <span className="quick-action-title">Scheduler Engines:</span>

          <button type="button" className="btn-action btn-holiday" onClick={() => { onOpenHolidayModal(); setShowQuickActions(false); }}>
            <Coffee size={16} />
            <span>Mark Day Off</span>
          </button>

          <button type="button" className="btn-action btn-vacation" onClick={() => { onOpenVacationModal(); setShowQuickActions(false); }}>
            <Umbrella size={16} />
            <span>Vacation Mode</span>
          </button>

          <button type="button" className="btn-action btn-urgent" onClick={() => { onOpenExamAssignModal(); setShowQuickActions(false); }}>
            <AlertTriangle size={16} />
            <span>Exam / Assignment</span>
          </button>

          <button type="button" className="btn-action btn-boost" onClick={() => { onOpenBoostModal(); setShowQuickActions(false); }}>
            <Zap size={16} />
            <span>Boost Subject</span>
          </button>

          <button type="button" className="btn-action btn-custom" onClick={() => { onOpenCustomBlockModal(); setShowQuickActions(false); }}>
            <Plus size={16} />
            <span>Add Study Block</span>
          </button>

          <button type="button" className="btn-action btn-boost" onClick={() => { onOpenBackupModal(); setShowQuickActions(false); }}>
            <Download size={16} />
            <span>Backup / Restore</span>
          </button>
        </div>
      )}

      {/* NATIVE MOBILE BOTTOM NAVIGATION DOCK (100% Interactive Button Items) */}
      <nav className="mobile-bottom-dock card-glass">
        <button
          type="button"
          className={`dock-btn ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          <Calendar size={22} />
          <span>Timetable</span>
        </button>

        <button
          type="button"
          className={`dock-btn ${activeTab === 'hud' ? 'active' : ''}`}
          onClick={() => setActiveTab('hud')}
        >
          <Clock size={22} />
          <span>Focus HUD</span>
        </button>

        <button
          type="button"
          className={`dock-btn ${activeTab === 'exams' ? 'active' : ''}`}
          onClick={() => setActiveTab('exams')}
        >
          <Award size={22} />
          <span>Exams</span>
        </button>

        <button
          type="button"
          className={`dock-btn ${activeTab === 'tentative' ? 'active' : ''}`}
          onClick={() => setActiveTab('tentative')}
        >
          <Zap size={22} />
          <span>Soft Events</span>
        </button>

        <button
          type="button"
          className={`dock-btn ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          <BarChart3 size={22} />
          <span>Reports</span>
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
