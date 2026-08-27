import React from 'react';
import { useScheduler } from '../context/SchedulerContext';
import { Zap, Calendar, MapPin, Clock, Check, X, ShieldAlert } from 'lucide-react';
import { formatDisplayDate, format12Hour } from '../utils/dateUtils';

const SoftEventsTab = ({ onOpenTentativeModal }) => {
  const { tentativeEvents, updateTentativeEventStatus, subjects } = useScheduler();

  const getSubject = (subjectId) => {
    return subjects.find(s => s.id === subjectId) || { name: 'General Study' };
  };

  return (
    <div className="soft-events-container">
      <div className="tab-header card-glass">
        <div>
          <h2>Tentative Events & Soft Blocks</h2>
          <p>Schedule contests or events you might attend. If you decide not to go, backup study tasks activate instantly.</p>
        </div>

        <button className="btn-primary" onClick={onOpenTentativeModal}>
          <Zap size={18} />
          <span>Add Soft Event</span>
        </button>
      </div>

      <div className="soft-events-list">
        {tentativeEvents.length === 0 ? (
          <div className="empty-state card-glass">
            <Zap size={48} className="empty-icon" />
            <h3>No Soft Events Scheduled</h3>
            <p>Add a contest or event with tentative attendance to test shadow backup scheduling.</p>
          </div>
        ) : (
          tentativeEvents.map(event => {
            const isAttending = event.status === 'attending';
            const isSkipped = event.status === 'skipped';
            const isTentative = event.status === 'tentative';

            return (
              <div key={event.id} className={`soft-event-card card-glass status-${event.status}`}>
                <div className="soft-event-header">
                  <div className="title-area">
                    <span className={`status-pill pill-${event.status}`}>
                      {event.status.toUpperCase()}
                    </span>
                    <h3 className="event-title">{event.title}</h3>
                  </div>

                  {/* Attendance Controls */}
                  <div className="attendance-controls">
                    <span className="control-label">Attendance Status:</span>
                    <button
                      className={`btn-attend ${isAttending ? 'active' : ''}`}
                      onClick={() => updateTentativeEventStatus(event.id, 'attending')}
                      title="Attending Event"
                    >
                      <Check size={16} />
                      <span>Attending</span>
                    </button>

                    <button
                      className={`btn-skip ${isSkipped ? 'active' : ''}`}
                      onClick={() => updateTentativeEventStatus(event.id, 'skipped')}
                      title="Skip & Activate Backup Tasks"
                    >
                      <X size={16} />
                      <span>Skip & Run Backup</span>
                    </button>
                  </div>
                </div>

                <div className="event-info-row">
                  <div className="info-item">
                    <Calendar size={16} />
                    <span>{formatDisplayDate(event.date)}</span>
                  </div>
                  <div className="info-item">
                    <Clock size={16} />
                    <span>{format12Hour(event.startTime)} - {format12Hour(event.endTime)}</span>
                  </div>
                  {event.location && (
                    <div className="info-item">
                      <MapPin size={16} />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>

                {/* Shadow Schedule: Backup Learning Tasks */}
                <div className="backup-tasks-section">
                  <div className="backup-header">
                    <ShieldAlert size={16} className="text-warning" />
                    <h4>Shadow Backup Learning Schedule</h4>
                    <span className="sub-tag">Activates instantly if skipped</span>
                  </div>

                  <div className="backup-tasks-grid">
                    {event.backupTasks.map(task => {
                      const subj = getSubject(task.subjectId);
                      return (
                        <div key={task.id} className="backup-task-card">
                          <div className="task-subj">{subj.name}</div>
                          <div className="task-name">{task.title}</div>
                          <div className="task-dur">⏱️ {task.durationMins} minutes</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SoftEventsTab;
