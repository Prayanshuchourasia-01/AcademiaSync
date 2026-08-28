import React, { useState } from 'react';
import { useScheduler } from '../../context/SchedulerContext';
import { Umbrella, X, Calendar, RefreshCw } from 'lucide-react';
import { addDays } from '../../utils/dateUtils';

const VacationModal = ({ isOpen, onClose }) => {
  const { systemDate, addVacationBlackout } = useScheduler();
  const [startDate, setStartDate] = useState(systemDate);
  const [endDate, setEndDate] = useState(addDays(systemDate, 2));
  const [mode, setMode] = useState('freeze'); // 'freeze' | 'compress'

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    addVacationBlackout(startDate, endDate, mode);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card card-glass">
        <div className="modal-header">
          <div className="modal-title-group">
            <Umbrella className="text-info" size={24} />
            <h3>Vacation Mode & Schedule Blackouts</h3>
          </div>
          <button className="btn-close" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <p className="modal-description">
            Pause upcoming dates for family trips or events. Choose how the algorithm re-routes your displaced study blocks.
          </p>

          <div className="form-row">
            <div className="form-group">
              <label>Blackout Start Date:</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Blackout End Date:</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Reallocation Strategy Mode:</label>
            <div className="mode-selector">
              <label className={`mode-card ${mode === 'freeze' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="vacationMode"
                  value="freeze"
                  checked={mode === 'freeze'}
                  onChange={() => setMode('freeze')}
                />
                <div>
                  <strong>Freeze & Shift (Post-Vacation)</strong>
                  <p className="mode-desc">Pushes flexible study tasks to dates immediately following the trip.</p>
                </div>
              </label>

              <label className={`mode-card ${mode === 'compress' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="vacationMode"
                  value="compress"
                  checked={mode === 'compress'}
                  onChange={() => setMode('compress')}
                />
                <div>
                  <strong>Front-Load & Compress</strong>
                  <p className="mode-desc">Spreads hours before and after trip to preserve strict exam deadlines.</p>
                </div>
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">
              <RefreshCw size={16} />
              <span>Apply Vacation Blackout</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VacationModal;
