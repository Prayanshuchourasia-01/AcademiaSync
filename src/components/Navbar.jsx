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
  Menu,
  X
} from 'lucide-react';
import { addDays, formatDisplayDate } from '../utils/dateUtils';

const Navbar = ({
  onOpenHolidayModal,
  onOpenVacationModal,
  onOpenExamAssignModal,
  onOpenBoostModal,
  onOpenCustomBlockModal
}) => {
  const {
    systemDate,
    setSystemDate,
    activeTab,
    setActiveTab,
    notifications,
    triggerCascadeMissedBlocks,
    resetDefaults
  } = useScheduler();

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handlePrevDay = () => setSystemDate(addDays(systemDate, -1));
  const handleNextDay = () => setSystemDate(addDays(systemDate, 1));

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
              value={systemDate}
              onChange={(e) => e.target.value && setSystemDate(e.target.value)}
            />
            <span className="date-formatted-text">{formatDisplayDate(systemDate)}</span>
          </div>

          <button
            className="btn-date-nav"
            onClick={handleNextDay}
            title="Next Day"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Header Right Actions */}
        <div className="header-actions">
          {/* Notifications Bell */}
          <div className="notif-wrapper">
            <button
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
                  <button className="btn-close-sm" onClick={() => setShowNotifDropdown(false)}><X size={16} /></button>
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
            className="btn-secondary btn-icon-only-mobile"
            onClick={triggerCascadeMissedBlocks}
            title="Scan & Cascade Missed Blocks"
          >
            <RefreshCw size={16} />
            <span className="hide-mobile">Cascade Missed</span>
          </button>

          <button
            className="btn-action-trigger"
            onClick={() => setShowQuickActions(!showQuickActions)}
            title="Dynamic Engine Modals"
          >
            {showQuickActions ? <X size={20} /> : <Zap size={20} />}
          </button>
        </div>
      </div>

      {/* Quick Action Engine Triggers Drawer / Bar */}
      {(showQuickActions || window.innerWidth > 768) && (
        <div className="quick-actions-bar card-glass">
          <span className="quick-action-title">Scheduler Engines:</span>

          <button className="btn-action btn-holiday" onClick={onOpenHolidayModal}>
            <Coffee size={16} />
            <span>Mark Day Off</span>
          </button>

          <button className="btn-action btn-vacation" onClick={onOpenVacationModal}>
            <Umbrella size={16} />
            <span>Vacation Mode</span>
          </button>

          <button className="btn-action btn-urgent" onClick={onOpenExamAssignModal}>
            <AlertTriangle size={16} />
            <span>Exam / Assignment</span>
          </button>

          <button className="btn-action btn-boost" onClick={onOpenBoostModal}>
            <Zap size={16} />
            <span>Boost Subject</span>
          </button>

          <button className="btn-action btn-custom" onClick={onOpenCustomBlockModal}>
            <Plus size={16} />
            <span>Add Study Block</span>
          </button>
        </div>
      )}

      {/* NATIVE MOBILE BOTTOM NAVIGATION DOCK */}
      <nav className="mobile-bottom-dock card-glass">
        <button
          className={`dock-btn ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          <Calendar size={22} />
          <span>Timetable</span>
        </button>

        <button
          className={`dock-btn ${activeTab === 'hud' ? 'active' : ''}`}
          onClick={() => setActiveTab('hud')}
        >
          <Clock size={22} />
          <span>Focus HUD</span>
        </button>

        <button
          className={`dock-btn ${activeTab === 'exams' ? 'active' : ''}`}
          onClick={() => setActiveTab('exams')}
        >
          <Award size={22} />
          <span>Exams</span>
        </button>

        <button
          className={`dock-btn ${activeTab === 'tentative' ? 'active' : ''}`}
          onClick={() => setActiveTab('tentative')}
        >
          <Zap size={22} />
          <span>Soft Events</span>
        </button>

        <button
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
