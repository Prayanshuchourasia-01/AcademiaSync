import React, { useState } from 'react';
import { useScheduler } from '../../context/SchedulerContext';
import { Zap, X, ShieldAlert, Plus } from 'lucide-react';
import { addDays } from '../../utils/dateUtils';

const TentativeModal = ({ isOpen, onClose }) => {
  const { systemDate, subjects, addTentativeEvent } = useScheduler();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(addDays(systemDate, 3));
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('15:00');
  const [location, setLocation] = useState('Auditorium / Hybrid');

  const [backup1Title, setBackup1Title] = useState('Graph Algorithms Intensive');
  const [backup1SubjectId, setBackup1SubjectId] = useState(subjects[0]?.id || '');
  const [backup2Title, setBackup2Title] = useState('PyTorch Neural Net Optimization');
  const [backup2SubjectId, setBackup2SubjectId] = useState(subjects[1]?.id || '');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    addTentativeEvent({
      title: title || 'Tentative Inter-College Event',
      date,
      startTime,
      endTime,
      location,
      backupTasks: [
        { id: `b-task-${Date.now()}-1`, title: backup1Title, durationMins: 120, subjectId: backup1SubjectId },
        { id: `b-task-${Date.now()}-2`, title: backup2Title, durationMins: 90, subjectId: backup2SubjectId }
      ]
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card card-glass">
        <div className="modal-header">
          <div className="modal-title-group">
            <Zap className="text-accent" size={24} />
            <h3>Tentative Event (Soft Block) Configuration</h3>
          </div>
          <button className="btn-close" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <p className="modal-description">
            Add a contest or event you <em>might</em> attend. The scheduler tentatively blocks it but keeps shadow backup learning tasks ready.
          </p>

          <div className="form-group">
            <label>Event Name / Title:</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. National Hackathon / College Fest"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Event Date:</label>
              <input
                type="date"
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Location / Venue:</label>
              <input
                type="text"
                className="form-control"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Time:</label>
              <input
                type="time"
                className="form-control"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>End Time:</label>
              <input
                type="time"
                className="form-control"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          {/* Shadow Backup Tasks Configuration */}
          <div className="highlight-box">
            <div className="highlight-label">
              <ShieldAlert size={16} className="text-warning" />
              <span>Define Shadow Backup Tasks (Runs if skipped)</span>
            </div>

            <div className="form-group margin-top">
              <label>Backup Task 1 Title:</label>
              <input
                type="text"
                className="form-control"
                value={backup1Title}
                onChange={(e) => setBackup1Title(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Backup Task 2 Title:</label>
              <input
                type="text"
                className="form-control"
                value={backup2Title}
                onChange={(e) => setBackup2Title(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">
              <Plus size={16} />
              <span>Add Soft Event & Backup Shadow</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TentativeModal;
