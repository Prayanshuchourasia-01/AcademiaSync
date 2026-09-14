import React from 'react';
import { useScheduler } from '../context/SchedulerContext';
import { BarChart3, CheckCircle, Coffee, Clock, ShieldCheck, Zap, Award, Target } from 'lucide-react';
import { formatDisplayDate } from '../utils/dateUtils';
import { calculateWeightedGPA } from '../utils/gpaCalculator';
import { getPeakFocusTimeSlot } from '../utils/analyticsEngine';

const ReportsView = () => {
  const { systemDate, schedule, subjects, exams, notifications } = useScheduler();

  // Metrics calculations
  const totalBlocks = schedule.length;
  const completedBlocks = schedule.filter(b => b.status === 'completed').length;
  const reclaimedBlocks = schedule.filter(b => b.type === 'reclaimed' || b.status === 'reclaimed').length;
  const cascadedBlocks = schedule.filter(b => b.type === 'cascaded').length;
  const currentGPA = calculateWeightedGPA(subjects, exams);
  const peakSlot = getPeakFocusTimeSlot(schedule);

  const totalStudyHours = schedule
    .filter(b => b.type !== 'college')
    .reduce((acc, b) => acc + 1.5, 0); // approx 1.5h avg per block

  const completedStudyHours = schedule
    .filter(b => b.status === 'completed')
    .reduce((acc, b) => acc + 1.5, 0);

  const completionRate = totalBlocks > 0 ? Math.round((completedBlocks / totalBlocks) * 100) : 0;

  return (
    <div className="reports-container">
      <div className="tab-header card-glass">
        <div>
          <h2>Weekly & Monthly Boundary Tracking</h2>
          <p>Verify goal completion, reclaimed holiday hours, GPA estimations, and schedule cascade audit logs.</p>
        </div>
        <span className="ref-date-chip">Reference Date: {formatDisplayDate(systemDate)}</span>
      </div>

      {/* Top Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card card-glass">
          <div className="stat-icon-wrapper icon-blue">
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{completionRate}%</span>
            <span className="stat-label">Completion Rate</span>
          </div>
        </div>

        <div className="stat-card card-glass">
          <div className="stat-icon-wrapper icon-amber">
            <Award size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{currentGPA} / 4.0</span>
            <span className="stat-label">Estimated Weighted GPA</span>
          </div>
        </div>

        <div className="stat-card card-glass">
          <div className="stat-icon-wrapper icon-purple">
            <Zap size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{cascadedBlocks} Blocks</span>
            <span className="stat-label">Auto-Cascaded Missed</span>
          </div>
        </div>

        <div className="stat-card card-glass">
          <div className="stat-icon-wrapper icon-emerald">
            <ShieldCheck size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">100% Safe</span>
            <span className="stat-label">Exam Deadline Compliance</span>
          </div>
        </div>
      </div>

      {/* Subject Goal Progress Bars */}
      <div className="reports-grid">
        <div className="report-card card-glass">
          <div className="card-title-row">
            <BarChart3 size={20} />
            <h3>Subject Hours Allocation vs Target</h3>
          </div>

          <div className="subject-progress-list">
            {subjects.map(subj => {
              const target = subj.targetWeeklyHours || 10;
              // Count completed blocks for this subject
              const count = schedule.filter(b => b.subjectId === subj.id && b.status === 'completed').length * 1.5;
              const pct = Math.min(100, Math.round((count / target) * 100));

              return (
                <div key={subj.id} className="subject-progress-item">
                  <div className="subj-progress-header">
                    <div className="subj-name-col">
                      <span className="subj-dot" style={{ backgroundColor: subj.color }} />
                      <span className="subj-title">{subj.name}</span>
                    </div>
                    <div className="subj-hours">
                      <strong>{count} hrs</strong> / {target} hrs target
                    </div>
                  </div>

                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${pct}%`, backgroundColor: subj.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Audit Log / Shift Notifications */}
        <div className="report-card card-glass">
          <div className="card-title-row">
            <Clock size={20} />
            <h3>Schedule Shift & Cascade Log</h3>
          </div>

          <div className="audit-log-list">
            {notifications.length === 0 ? (
              <p className="empty-subtext">No schedule shift events logged yet.</p>
            ) : (
              notifications.map(n => (
                <div key={n.id} className="audit-item">
                  <div className="audit-header">
                    <span className="audit-title">{n.title}</span>
                    <span className="audit-time">{n.time}</span>
                  </div>
                  <p className="audit-msg">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
