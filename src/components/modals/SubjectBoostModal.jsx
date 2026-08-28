import React, { useState } from 'react';
import { useScheduler } from '../../context/SchedulerContext';
import { Zap, X } from 'lucide-react';

const SubjectBoostModal = ({ isOpen, onClose }) => {
  const { subjects, boostSubject } = useScheduler();
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [extraHours, setExtraHours] = useState(4);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    boostSubject(selectedSubjectId, Number(extraHours));
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card card-glass">
        <div className="modal-header">
          <div className="modal-title-group">
            <Zap className="text-accent" size={24} />
            <h3>Subject Boosting & Manual Overrides</h3>
          </div>
          <button className="btn-close" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <p className="modal-description">
            PRD Request: <em>"Allocate more blocks for [Specific Subject] this week."</em> The algorithm finds gaps in your timetable and slots them in automatically.
          </p>

          <div className="form-group">
            <label>Select Target Subject:</label>
            <select
              className="form-control"
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Additional Hours to Slot This Week:</label>
            <input
              type="number"
              min="1"
              max="10"
              className="form-control"
              value={extraHours}
              onChange={(e) => setExtraHours(e.target.value)}
              required
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">
              <Zap size={16} />
              <span>Find Gaps & Boost Subject</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubjectBoostModal;
