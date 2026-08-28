import React, { useState } from 'react';
import { useScheduler } from '../../context/SchedulerContext';
import { Award, AlertTriangle, X, Plus } from 'lucide-react';
import { addDays } from '../../utils/dateUtils';

const ExamAssignModal = ({ isOpen, onClose }) => {
  const { systemDate, subjects, addExam, addAssignment } = useScheduler();
  const [entryType, setEntryType] = useState('exam'); // 'exam' | 'assignment'

  // Exam fields
  const [examTitle, setExamTitle] = useState('');
  const [examSubjectId, setExamSubjectId] = useState(subjects[0]?.id || '');
  const [examDate, setExamDate] = useState(addDays(systemDate, 20));
  const [totalTopics, setTotalTopics] = useState(10);
  const [dailyMins, setDailyMins] = useState(90);

  // Assignment fields
  const [assignTitle, setAssignTitle] = useState('');
  const [assignSubjectId, setAssignSubjectId] = useState(subjects[0]?.id || '');
  const [dueDate, setDueDate] = useState(addDays(systemDate, 2));
  const [dueTime, setDueTime] = useState('23:59');
  const [estimatedHours, setEstimatedHours] = useState(4);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (entryType === 'exam') {
      addExam({
        title: examTitle || 'Upcoming Major Exam',
        subjectId: examSubjectId,
        date: examDate,
        totalTopics: Number(totalTopics),
        completedTopics: 0,
        dailyRequiredMins: Number(dailyMins)
      });
    } else {
      addAssignment({
        title: assignTitle || 'Emergency Assignment Report',
        subjectId: assignSubjectId,
        dueDate,
        dueTime,
        estimatedHours: Number(estimatedHours),
        priority: 'Urgent'
      });
    }
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card card-glass">
        <div className="modal-header">
          <div className="modal-title-group">
            {entryType === 'exam' ? <Award className="text-accent" size={24} /> : <AlertTriangle className="text-urgent" size={24} />}
            <h3>Goal & Deadline Routing Input</h3>
          </div>
          <button className="btn-close" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Mode Switch */}
          <div className="entry-type-switch">
            <button
              type="button"
              className={`switch-btn ${entryType === 'exam' ? 'active' : ''}`}
              onClick={() => setEntryType('exam')}
            >
              <Award size={16} />
              <span>Exam Mode (Long-Term Pacing)</span>
            </button>
            <button
              type="button"
              className={`switch-btn ${entryType === 'assignment' ? 'active' : ''}`}
              onClick={() => setEntryType('assignment')}
            >
              <AlertTriangle size={16} />
              <span>Assignment Mode (Sudden Preemption)</span>
            </button>
          </div>

          {entryType === 'exam' ? (
            <>
              <div className="form-group">
                <label>Exam Title:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Mid-Term Neural Networks"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Subject:</label>
                  <select
                    className="form-control"
                    value={examSubjectId}
                    onChange={(e) => setExamSubjectId(e.target.value)}
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Exam Target Date:</label>
                  <input
                    type="date"
                    className="form-control"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Total Syllabus Topics:</label>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    value={totalTopics}
                    onChange={(e) => setTotalTopics(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Daily Prep Target (Mins):</label>
                  <input
                    type="number"
                    min="30"
                    step="15"
                    className="form-control"
                    value={dailyMins}
                    onChange={(e) => setDailyMins(e.target.value)}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label>Assignment Title:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Distributed Database Lab Report"
                  value={assignTitle}
                  onChange={(e) => setAssignTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Subject:</label>
                  <select
                    className="form-control"
                    value={assignSubjectId}
                    onChange={(e) => setAssignSubjectId(e.target.value)}
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Estimated Hours Needed:</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    className="form-control"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Due Date:</label>
                  <input
                    type="date"
                    className="form-control"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Due Time:</label>
                  <input
                    type="time"
                    className="form-control"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">
              <Plus size={16} />
              <span>Route into Schedule</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExamAssignModal;
