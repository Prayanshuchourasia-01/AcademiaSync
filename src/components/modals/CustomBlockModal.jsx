import React, { useState } from 'react';
import { useScheduler } from '../../context/SchedulerContext';
import { Plus, X } from 'lucide-react';

const CustomBlockModal = ({ isOpen, onClose }) => {
  const { systemDate, subjects, addCustomBlock } = useScheduler();
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [date, setDate] = useState(systemDate);
  const [startTime, setStartTime] = useState('17:00');
  const [endTime, setEndTime] = useState('18:30');
  const [type, setType] = useState('study');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    addCustomBlock({
      title: title || 'Custom Study Block',
      subjectId,
      date,
      startTime,
      endTime,
      type,
      isFixed: false
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card card-glass">
        <div className="modal-header">
          <div className="modal-title-group">
            <Plus className="text-info" size={24} />
            <h3>Add Custom Study Block</h3>
          </div>
          <button className="btn-close" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Block Title:</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Graph Algorithms & LeetCode 75"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Subject:</label>
              <select
                className="form-control"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Date:</label>
              <input
                type="date"
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
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
                required
              />
            </div>

            <div className="form-group">
              <label>End Time:</label>
              <input
                type="time"
                className="form-control"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">
              <Plus size={16} />
              <span>Add Block to Timetable</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomBlockModal;
