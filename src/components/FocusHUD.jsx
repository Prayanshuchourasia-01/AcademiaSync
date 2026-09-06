import React, { useState, useEffect } from 'react';
import { useScheduler } from '../context/SchedulerContext';
import { Play, Pause, RotateCcw, CheckCircle, Clock, Award, BookOpen, AlertCircle, Volume2 } from 'lucide-react';
import { formatDisplayDate, format12Hour } from '../utils/dateUtils';
import { soundFx } from '../utils/soundEffectsEngine';

const FocusHUD = () => {
  const { systemDate, schedule, subjects, toggleBlockCompletion } = useScheduler();

  // Find next or active study block on systemDate
  const todayBlocks = schedule.filter(b => b.date === systemDate && b.type !== 'college');
  const activeBlock = todayBlocks.find(b => b.status === 'scheduled') || todayBlocks[0];

  const subject = activeBlock ? subjects.find(s => s.id === activeBlock.subjectId) : null;

  // Timer state & preset selector
  const [sessionMinutes, setSessionMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    let interval = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      if (soundEnabled) soundFx.playChime('complete');
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft, soundEnabled]);

  const handleStartPause = () => {
    if (!isRunning && soundEnabled) {
      soundFx.playChime('start');
    }
    setIsRunning(!isRunning);
  };

  const setPreset = (mins) => {
    setIsRunning(false);
    setSessionMinutes(mins);
    setSecondsLeft(mins * 60);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(sessionMinutes * 60);
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="focus-hud-container">
      <div className="hud-grid">
        {/* Main Focus Timer Card */}
        <div className="hud-card timer-card card-glass">
          <div className="hud-card-header">
            <Clock size={20} className="text-accent" />
            <h3>Active Focus Block HUD</h3>
            <span className="hud-date-pill">{formatDisplayDate(systemDate)}</span>
          </div>

          {activeBlock ? (
            <div className="timer-content">
              <div className="block-meta">
                <span className="block-type-badge">{activeBlock.type.toUpperCase()} BLOCK</span>
                <h2 className="active-block-title">{activeBlock.title}</h2>
                {subject && (
                  <span
                    className="subject-tag"
                    style={{ backgroundColor: `${subject.color}25`, color: subject.color }}
                  >
                    {subject.code} — {subject.name}
                  </span>
                )}
                <div className="active-time-range">
                  <Clock size={16} />
                  <span>{format12Hour(activeBlock.startTime)} – {format12Hour(activeBlock.endTime)}</span>
                </div>
              </div>

              {/* Digital Timer Circle */}
              <div className="timer-display">
                <div className="digital-clock">{formatTimer(secondsLeft)}</div>
                <p className="timer-subtext">{isRunning ? 'Focus session active...' : 'Ready to start focus block'}</p>
              </div>

              {/* Timer Controls */}
              <div className="timer-controls">
                <button
                  className={`btn-timer-main ${isRunning ? 'pause' : 'start'}`}
                  onClick={handleStartPause}
                >
                  {isRunning ? <Pause size={24} /> : <Play size={24} />}
                  <span>{isRunning ? 'Pause Block' : 'Start Focus'}</span>
                </button>

                <button className="btn-timer-secondary" onClick={handleReset} title="Reset Timer">
                  <RotateCcw size={20} />
                </button>

                <button
                  className="btn-timer-complete"
                  onClick={() => toggleBlockCompletion(activeBlock.id)}
                >
                  <CheckCircle size={20} />
                  <span>Check-In Complete</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="hud-empty">
              <AlertCircle size={40} className="empty-icon" />
              <h3>No Active Study Block Scheduled for Today</h3>
              <p>Check the timetable tab or add a new study block to start your focus timer.</p>
            </div>
          )}
        </div>

        {/* Up Next & Subject Overview Sidebar */}
        <div className="hud-sidebar">
          <div className="hud-card card-glass">
            <div className="hud-card-header">
              <BookOpen size={18} />
              <h4>Today's Study Lineup</h4>
            </div>

            <div className="lineup-list">
              {todayBlocks.length === 0 ? (
                <p className="subtext">No tasks remaining for today.</p>
              ) : (
                todayBlocks.map(b => (
                  <div key={b.id} className={`lineup-item ${b.id === activeBlock?.id ? 'active' : ''}`}>
                    <div className="lineup-time">{format12Hour(b.startTime)}</div>
                    <div className="lineup-info">
                      <div className="lineup-title">{b.title}</div>
                      <span className={`status-dot status-${b.status}`} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Habit Consistency Card */}
          <div className="hud-card card-glass consistency-card">
            <div className="hud-card-header">
              <Award size={18} />
              <h4>Daily Boundary Status</h4>
            </div>
            <div className="boundary-stats">
              <div className="stat-box">
                <span className="stat-num">
                  {todayBlocks.filter(b => b.status === 'completed').length} / {todayBlocks.length}
                </span>
                <span className="stat-label">Blocks Completed</span>
              </div>
              <div className="stat-box">
                <span className="stat-num">100%</span>
                <span className="stat-label">Deadline Safe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusHUD;
