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
  ChevronRight
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

  const unreadCount = notifications.filter(n => !n.read).length;

  const handlePrevDay = () => setSystemDate(addDays(systemDate, -1));
  const handleNextDay = () => setSystemDate(addDays(systemDate, 1));

  return (
    <header className="navbar-container">
      {/* Brand Header */}
      <div className="navbar-top">
        <div className="brand-section">
          <div className="logo-badge">
            <Zap className="logo-icon" />
          </div>
          <div>
            <h1 className="brand-title">AcademiaSync</h1>
            <p className="brand-subtitle">Module 2: Dynamic Academic & Habit Scheduler</p>
          </div>
        </div>

        {/* Custom Reference System Date Controller */}
        <div className="date-control-card">
          <div className="date-control-label">
            <Clock className="date-icon" />
            <span>Simulated System Reference Date:</span>
          </div>
          <div className="date-picker-group">
            <button
              className="btn-date-nav"
              onClick={handlePrevDay}
              title="Previous Day"
            >
              <ChevronLeft size={16} />
            </button>

            <input
              type="date"
              className="date-input"
              value={systemDate}
              onChange={(e) => e.target.value && setSystemDate(e.target.value)}
            />

            <button
              className="btn-date-nav"
              onClick={handleNextDay}
              title="Next Day"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <span className="date-formatted-text">{formatDisplayDate(systemDate)}</span>
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
                  <span className="notif-count">{notifications.length} alerts</span>
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
            className="btn-secondary"
            onClick={triggerCascadeMissedBlocks}
            title="Scan & Cascade Missed Blocks"
          >
            <RefreshCw size={16} />
            <span>Cascade Missed</span>
          </button>

          <button
            className="btn-outline-danger"
            onClick={resetDefaults}
            title="Reset Mock Data"
          >
            Reset Demo
          </button>
        </div>
      </div>

      {/* Quick Action Engine Triggers */}
      <div className="quick-actions-bar">
        <span className="quick-action-title">Dynamic Scheduling Actions:</span>

        <button className="btn-action btn-holiday" onClick={onOpenHolidayModal}>
          <Coffee size={16} />
          <span>Mark Day as Off (Holiday)</span>
        </button>

        <button className="btn-action btn-vacation" onClick={onOpenVacationModal}>
          <Umbrella size={16} />
          <span>Vacation Mode / Blackout</span>
        </button>

        <button className="btn-action btn-urgent" onClick={onOpenExamAssignModal}>
          <AlertTriangle size={16} />
          <span>Exam / Sudden Assignment</span>
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

      {/* Navigation Tabs */}
      <nav className="tab-nav">
        <button
          className={`tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          <Calendar size={18} />
          <span>Daily & Weekly Timeline</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'hud' ? 'active' : ''}`}
          onClick={() => setActiveTab('hud')}
        >
          <Clock size={18} />
          <span>Focus HUD & Countdown</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'exams' ? 'active' : ''}`}
          onClick={() => setActiveTab('exams')}
        >
          <Award size={18} />
          <span>Exams & Assignments</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'tentative' ? 'active' : ''}`}
          onClick={() => setActiveTab('tentative')}
        >
          <Zap size={18} />
          <span>Soft Events (Tentative)</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          <BarChart3 size={18} />
          <span>Reports & Boundaries</span>
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
