import React from 'react';
import { useScheduler } from '../context/SchedulerContext';
import { Award, AlertTriangle, Calendar, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { diffInDays, formatDisplayDate } from '../utils/dateUtils';

const ExamsAndAssignments = ({ onOpenExamAssignModal }) => {
  const { systemDate, exams, assignments, subjects } = useScheduler();

  const getSubject = (subjectId) => {
    return subjects.find(s => s.id === subjectId) || { name: 'General Subject', code: 'CS' };
  };

  return (
    <div className="exams-assignments-container">
      <div className="tab-header card-glass">
        <div>
          <h2>Goal, Deadline & Event Routing</h2>
          <p>Exam Mode reverse-engineers daily timetables while Assignment Mode handles emergency priority overrides.</p>
        </div>

        <button className="btn-primary" onClick={onOpenExamAssignModal}>
          <Award size={18} />
          <span>Add Exam / Assignment</span>
        </button>
      </div>

      <div className="exams-assignments-grid">
        {/* Section 1: Exam Mode (Long-Term Deadlines) */}
        <div className="section-card card-glass">
          <div className="section-header">
            <Award className="icon-exam" size={22} />
            <div>
              <h3>Exam Mode (Reverse-Engineered Pacing)</h3>
              <p className="subtext">Daily study volume automatically scales as exam date approaches.</p>
            </div>
          </div>

          <div className="cards-list">
            {exams.length === 0 ? (
              <p className="empty-subtext">No upcoming exams added.</p>
            ) : (
              exams.map(exam => {
                const subj = getSubject(exam.subjectId);
                const daysRemaining = diffInDays(exam.date, systemDate);
                const progressPct = Math.round((exam.completedTopics / exam.totalTopics) * 100);

                return (
                  <div key={exam.id} className="routing-card exam-card">
                    <div className="routing-card-header">
                      <span className="subj-badge" style={{ backgroundColor: `${subj.color}25`, color: subj.color }}>
                        {subj.code} — {subj.name}
                      </span>
                      <span className={`days-badge ${daysRemaining <= 7 ? 'urgent' : ''}`}>
                        <Calendar size={14} />
                        <span>{daysRemaining > 0 ? `${daysRemaining} Days Left` : 'Exam Today!'}</span>
                      </span>
                    </div>

                    <h4 className="card-item-title">{exam.title}</h4>

                    <div className="exam-meta">
                      <div className="meta-row">
                        <span>Target Exam Date:</span>
                        <strong>{formatDisplayDate(exam.date)}</strong>
                      </div>
                      <div className="meta-row">
                        <span>Daily Required Study:</span>
                        <strong>{exam.dailyRequiredMins} mins/day</strong>
                      </div>
                    </div>

                    {/* Topic Progress Bar */}
                    <div className="progress-wrapper">
                      <div className="progress-info">
                        <span>Syllabus Topics Covered</span>
                        <strong>{exam.completedTopics} / {exam.totalTopics} ({progressPct}%)</strong>
                      </div>
                      <div className="progress-bar-bg">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${progressPct}%`, backgroundColor: subj.color }}
                        />
                      </div>
                    </div>

                    <div className="routing-note">
                      <ArrowRight size={14} />
                      <span>Daily timetable contains dedicated review slots auto-allocated by engine.</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Section 2: Sudden Assignment Mode (Priority Overwrite) */}
        <div className="section-card card-glass">
          <div className="section-header">
            <AlertTriangle className="icon-urgent" size={22} />
            <div>
              <h3>Assignment Mode (Emergency Overwrite)</h3>
              <p className="subtext">Sudden high-priority submissions displace lower-priority habit blocks.</p>
            </div>
          </div>

          <div className="cards-list">
            {assignments.length === 0 ? (
              <p className="empty-subtext">No pending assignments.</p>
            ) : (
              assignments.map(assign => {
                const subj = getSubject(assign.subjectId);
                const daysRemaining = diffInDays(assign.dueDate, systemDate);

                return (
                  <div key={assign.id} className="routing-card assignment-card">
                    <div className="routing-card-header">
                      <span className="priority-badge urgent">
                        <AlertTriangle size={12} />
                        <span>{assign.priority} PREEMPTION</span>
                      </span>
                      <span className="due-badge">
                        <Clock size={14} />
                        <span>Due {formatDisplayDate(assign.dueDate)} @ {assign.dueTime}</span>
                      </span>
                    </div>

                    <h4 className="card-item-title">{assign.title}</h4>
                    <p className="assign-subj">{subj.name}</p>

                    <div className="assign-details">
                      <div className="detail-chip">
                        <span>Est. Time:</span>
                        <strong>{assign.estimatedHours} Hours</strong>
                      </div>
                      <div className="detail-chip">
                        <span>Days Left:</span>
                        <strong>{daysRemaining} Days</strong>
                      </div>
                    </div>

                    <div className="preempt-banner">
                      <CheckCircle2 size={14} className="text-success" />
                      <span>Displaced habit blocks have been auto-cascaded into future slots.</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamsAndAssignments;
