import React, { useState } from 'react';
import { useScheduler } from '../../context/SchedulerContext';
import { Coffee, X, Clock, Sparkles } from 'lucide-react';

const HolidayModal = ({ isOpen, onClose }) => {
  const { systemDate, markDayAsOff } = useScheduler();
  const [targetDate, setTargetDate] = useState(systemDate);
  const [startTime, setStartTime] = useState('11:00');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    markDayAsOff(targetDate, startTime);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card card-glass">
        <div className="modal-header">
          <div className="modal-title-group">
            <Coffee className="text-warning" size={24} />
            <h3>The "Unexpected Holiday" Management Engine</h3>
          </div>
          <button className="btn-close" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <p className="modal-description">
            Mark an unexpected college or work holiday. Standard busy hours (9 AM – 4 PM) will be reclaimed, and high-priority learning blocks will auto-populate your timeline!
          </p>

          <div className="form-group">
            <label>Select Holiday Date:</label>
            <input
              type="date"
              className="form-control"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group highlight-box">
            <label className="highlight-label">
              <Clock size={16} />
              <span>PRD Start Prompt: What time will you start your learning blocks today?</span>
            </label>
            <input
              type="time"
              className="form-control time-input-lg"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
            <p className="form-help">e.g. 11:00 AM. Learning blocks will be auto-allocated starting from this time.</p>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary btn-holiday">
              <Sparkles size={16} />
              <span>Reclaim Hours & Auto-Fill</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HolidayModal;
