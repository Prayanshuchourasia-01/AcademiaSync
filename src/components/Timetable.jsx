import React, { useState } from 'react';
import { useScheduler } from '../context/SchedulerContext';
import {
  Calendar,
  CheckCircle,
  Clock,
  Coffee,
  AlertTriangle,
  Zap,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';
import { addDays, formatDisplayDate, getWeekDays, format12Hour } from '../utils/dateUtils';

const Timetable = ({ onOpenHolidayModal }) => {
  const {
    systemDate,
    schedule,
    subjects,
    toggleBlockCompletion,
    deleteBlock,
    markDayAsOff
  } = useScheduler();

  const [selectedDate, setSelectedDate] = useState(systemDate);
  const [viewMode, setViewMode] = useState('day'); // 'day' | 'week'

  // Update selectedDate if systemDate changes
  React.useEffect(() => {
    setSelectedDate(systemDate);
  }, [systemDate]);

  const weekDays = getWeekDays(selectedDate);

  // Filter blocks for selectedDate
  const dayBlocks = schedule
    .filter(b => b.date === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const isHolidayReclaimed = dayBlocks.some(b => b.type === 'reclaimed' || b.status === 'reclaimed');

  const getSubject = (subjectId) => {
    return subjects.find(s => s.id === subjectId) || { name: 'General Study', color: '#6366f1' };
  };

  const getBlockBadge = (block) => {
    switch (block.type) {
      case 'college':
        return { label: 'College / Work', className: 'badge-college' };
      case 'reclaimed':
        return { label: '⚡ Reclaimed Holiday', className: 'badge-reclaimed' };
      case 'assignment':
        return { label: '🔥 Urgent Assignment', className: 'badge-assignment' };
      case 'exam':
        return { label: '🎯 Exam Prep', className: 'badge-exam' };
      case 'tentative':
        return { label: '❓ Soft Event', className: 'badge-tentative' };
      case 'cascaded':
        return { label: '🔄 Cascaded Block', className: 'badge-cascaded' };
      default:
        return { label: 'Core Study', className: 'badge-study' };
    }
  };

  return (
    <div className="timetable-container">
      {/* View Toolbar & Date Selector */}
      <div className="timetable-toolbar card-glass">
        <div className="toolbar-left">
          <button
            className="btn-icon"
            onClick={() => setSelectedDate(addDays(selectedDate, -1))}
          >
            <ChevronLeft size={20} />
          </button>
          <div className="current-date-title">
            <h3>{formatDisplayDate(selectedDate)}</h3>
            {selectedDate === systemDate && (
              <span className="pill-today">Active Reference Date</span>
            )}
          </div>
          <button
            className="btn-icon"
            onClick={() => setSelectedDate(addDays(selectedDate, 1))}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="toolbar-right">
          <div className="view-toggle">
            <button
              className={`toggle-btn ${viewMode === 'day' ? 'active' : ''}`}
              onClick={() => setViewMode('day')}
            >
              Day Timeline
            </button>
            <button
              className={`toggle-btn ${viewMode === 'week' ? 'active' : ''}`}
              onClick={() => setViewMode('week')}
            >
              Week Grid
            </button>
          </div>

          {!isHolidayReclaimed && (
            <button
              className="btn-action btn-holiday-sm"
              onClick={onOpenHolidayModal}
            >
              <Coffee size={14} />
              <span>Mark This Day Off</span>
            </button>
          )}
        </div>
      </div>

      {/* Holiday Reclaimed Alert Banner */}
      {isHolidayReclaimed && (
        <div className="reclaimed-banner card-glass">
          <Sparkles className="banner-icon" size={24} />
          <div>
            <h4>Unexpected Holiday Active!</h4>
            <p>Standard college hours were reclaimed and auto-populated with high-priority learning blocks.</p>
          </div>
        </div>
      )}

      {/* DAY TIMELINE VIEW */}
      {viewMode === 'day' && (
        <div className="day-timeline">
          {dayBlocks.length === 0 ? (
            <div className="empty-state card-glass">
              <Calendar size={48} className="empty-icon" />
              <h3>No Study Blocks Scheduled</h3>
              <p>This day is open. Click "Add Study Block" or "Mark Day as Off" to allocate hours.</p>
            </div>
          ) : (
            <div className="blocks-list">
              {dayBlocks.map((block) => {
                const subj = getSubject(block.subjectId);
                const badge = getBlockBadge(block);
                const isCompleted = block.status === 'completed';
                const isMissed = block.status === 'missed';
                const isReclaimed = block.status === 'reclaimed';

                return (
                  <div
                    key={block.id}
                    className={`block-card card-glass ${isCompleted ? 'completed' : ''} ${isMissed ? 'missed' : ''} ${isReclaimed ? 'reclaimed-bg' : ''}`}
                    style={{ borderLeftColor: subj.color }}
                  >
                    <div className="block-time-col">
                      <div className="time-range">
                        <Clock size={14} />
                        <span>{format12Hour(block.startTime)}</span>
                        <span className="time-sep">-</span>
                        <span>{format12Hour(block.endTime)}</span>
                      </div>
                      <span className={`badge ${badge.className}`}>{badge.label}</span>
                    </div>

                    <div className="block-content-col">
                      <div className="block-header">
                        <h4 className="block-title">{block.title}</h4>
                        {subj.name && (
                          <span
                            className="subject-pill"
                            style={{ backgroundColor: `${subj.color}20`, color: subj.color, borderColor: `${subj.color}40` }}
                          >
                            {subj.name}
                          </span>
                        )}
                      </div>

                      {block.note && <p className="block-note">{block.note}</p>}

                      {isMissed && (
                        <div className="missed-warning">
                          <AlertTriangle size={14} />
                          <span>Missed block — auto-cascaded into available future slot.</span>
                        </div>
                      )}
                    </div>

                    <div className="block-actions-col">
                      {block.type !== 'college' && !isReclaimed && (
                        <button
                          className={`btn-checkin ${isCompleted ? 'checked' : ''}`}
                          onClick={() => toggleBlockCompletion(block.id)}
                          title={isCompleted ? 'Mark as Incomplete' : 'Mark Completed'}
                        >
                          <CheckCircle size={20} />
                          <span>{isCompleted ? 'Completed' : 'Check-In'}</span>
                        </button>
                      )}

                      {!block.isFixed && (
                        <button
                          className="btn-icon-danger"
                          onClick={() => deleteBlock(block.id)}
                          title="Delete Block"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* WEEK GRID VIEW */}
      {viewMode === 'week' && (
        <div className="week-grid">
          {weekDays.map(dateStr => {
            const dateBlocks = schedule
              .filter(b => b.date === dateStr)
              .sort((a, b) => a.startTime.localeCompare(b.startTime));
            const isTodayRef = dateStr === systemDate;

            return (
              <div
                key={dateStr}
                className={`week-day-col card-glass ${isTodayRef ? 'active-ref-col' : ''}`}
              >
                <div className="week-day-header">
                  <span className="week-day-name">
                    {new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span className="week-day-num">
                    {new Date(dateStr + 'T00:00:00').getDate()}
                  </span>
                  {isTodayRef && <span className="ref-dot" title="Active Reference Date" />}
                </div>

                <div className="week-day-blocks">
                  {dateBlocks.length === 0 ? (
                    <div className="week-empty">No blocks</div>
                  ) : (
                    dateBlocks.map(b => {
                      const subj = getSubject(b.subjectId);
                      const isCompleted = b.status === 'completed';
                      return (
                        <div
                          key={b.id}
                          className={`week-block-item ${isCompleted ? 'week-completed' : ''} type-${b.type}`}
                          style={{ borderLeftColor: subj.color }}
                          title={`${b.title} (${format12Hour(b.startTime)} - ${format12Hour(b.endTime)})`}
                        >
                          <div className="week-block-time">{format12Hour(b.startTime)}</div>
                          <div className="week-block-title">{b.title}</div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Timetable;
