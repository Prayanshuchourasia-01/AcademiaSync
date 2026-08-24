import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DEFAULT_SYSTEM_DATE,
  INITIAL_SUBJECTS,
  INITIAL_EXAMS,
  INITIAL_ASSIGNMENTS,
  INITIAL_TENTATIVE_EVENTS,
  INITIAL_SCHEDULE_BLOCKS,
  INITIAL_BLACKOUTS
} from '../constants/initialData';
import {
  reclaimHolidayEngine,
  applyVacationBlackoutEngine,
  cascadeMissedBlocksEngine,
  routeAssignmentEmergencyEngine,
  boostSubjectHoursEngine,
  toggleTentativeEventEngine
} from '../utils/schedulerEngine';
import { addDays, formatDate } from '../utils/dateUtils';

const SchedulerContext = createContext();

export const SchedulerProvider = ({ children }) => {
  // Configurable System Reference Date
  const [systemDate, setSystemDateState] = useState(() => {
    return localStorage.getItem('academia_system_date') || DEFAULT_SYSTEM_DATE;
  });

  const [schedule, setSchedule] = useState(() => {
    const saved = localStorage.getItem('academia_schedule');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULE_BLOCKS;
  });

  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem('academia_subjects');
    return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
  });

  const [exams, setExams] = useState(() => {
    const saved = localStorage.getItem('academia_exams');
    return saved ? JSON.parse(saved) : INITIAL_EXAMS;
  });

  const [assignments, setAssignments] = useState(() => {
    const saved = localStorage.getItem('academia_assignments');
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  const [tentativeEvents, setTentativeEvents] = useState(() => {
    const saved = localStorage.getItem('academia_tentative_events');
    return saved ? JSON.parse(saved) : INITIAL_TENTATIVE_EVENTS;
  });

  const [blackouts, setBlackouts] = useState(() => {
    const saved = localStorage.getItem('academia_blackouts');
    return saved ? JSON.parse(saved) : INITIAL_BLACKOUTS;
  });

  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('schedule'); // 'schedule' | 'hud' | 'exams' | 'tentative' | 'reports'

  // Persist state
  useEffect(() => {
    localStorage.setItem('academia_system_date', systemDate);
    localStorage.setItem('academia_schedule', JSON.stringify(schedule));
    localStorage.setItem('academia_subjects', JSON.stringify(subjects));
    localStorage.setItem('academia_exams', JSON.stringify(exams));
    localStorage.setItem('academia_assignments', JSON.stringify(assignments));
    localStorage.setItem('academia_tentative_events', JSON.stringify(tentativeEvents));
    localStorage.setItem('academia_blackouts', JSON.stringify(blackouts));
  }, [systemDate, schedule, subjects, exams, assignments, tentativeEvents, blackouts]);

  // Helper notification logger
  const addNotification = (title, message, type = 'info') => {
    const newNotif = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title,
      message,
      type,
      time: systemDate,
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Change system date & trigger cascade check
  const setSystemDate = (newDate) => {
    setSystemDateState(newDate);
    // Run cascade scan on new date
    const { schedule: updatedSched, cascadedCount, logs } = cascadeMissedBlocksEngine(schedule, newDate);
    setSchedule(updatedSched);
    if (cascadedCount > 0) {
      addNotification('Missed Blocks Cascaded', `System date set to ${newDate}. Auto-cascaded ${cascadedCount} missed block(s).`, 'warning');
    } else {
      addNotification('System Date Changed', `Active system date set to ${newDate}`, 'info');
    }
  };

  // 1. Mark Day as Off (Holiday Reclamation)
  const markDayAsOff = (targetDate, startTimePrompt = '11:00') => {
    const { schedule: updatedSched, freedHours, log } = reclaimHolidayEngine(
      schedule,
      targetDate,
      startTimePrompt,
      subjects
    );
    setSchedule(updatedSched);
    addNotification('Unexpected Holiday Reclaimed!', log, 'success');
  };

  // 2. Vacation Blackout Mode
  const addVacationBlackout = (startDate, endDate, mode = 'freeze') => {
    const { schedule: updatedSched, displacedCount, log } = applyVacationBlackoutEngine(
      schedule,
      startDate,
      endDate,
      mode
    );
    setSchedule(updatedSched);
    const newBlackout = { id: `blackout-${Date.now()}`, startDate, endDate, mode };
    setBlackouts(prev => [...prev, newBlackout]);
    addNotification('Vacation Mode Activated', log, 'warning');
  };

  // 3. Manual Run Cascade Missed Blocks
  const triggerCascadeMissedBlocks = () => {
    const { schedule: updatedSched, cascadedCount, logs } = cascadeMissedBlocksEngine(schedule, systemDate);
    setSchedule(updatedSched);
    addNotification('Missed Blocks Scan', `Processed missed blocks. ${cascadedCount} block(s) rescheduled into next 3-5 days.`, cascadedCount > 0 ? 'warning' : 'info');
  };

  // 4. Add Exam
  const addExam = (examData) => {
    const newExam = {
      id: `exam-${Date.now()}`,
      ...examData,
      status: 'active'
    };
    setExams(prev => [...prev, newExam]);

    // Route exam preparation study blocks
    const subj = subjects.find(s => s.id === examData.subjectId) || { name: 'Subject' };
    const prepBlock = {
      id: `exam-prep-${Date.now()}`,
      date: addDays(systemDate, 1),
      startTime: '18:00',
      endTime: '19:30',
      title: `🎯 Exam Prep: ${newExam.title} (${subj.name})`,
      type: 'exam',
      subjectId: newExam.subjectId,
      examId: newExam.id,
      status: 'scheduled',
      isFixed: false
    };
    setSchedule(prev => [...prev, prepBlock]);
    addNotification('Exam Target Added', `Reverse-engineered timetable prep for "${newExam.title}" due ${newExam.date}.`, 'success');
  };

  // 5. Add Assignment Emergency
  const addAssignment = (assignmentData) => {
    const newAssign = {
      id: `assign-${Date.now()}`,
      ...assignmentData,
      status: 'pending'
    };
    setAssignments(prev => [...prev, newAssign]);

    const { schedule: updatedSched, log } = routeAssignmentEmergencyEngine(schedule, newAssign);
    setSchedule(updatedSched);
    addNotification('Emergency Assignment Scheduled', log, 'urgent');
  };

  // 6. Boost Subject
  const boostSubject = (subjectId, extraHours = 2) => {
    const subj = subjects.find(s => s.id === subjectId) || { name: 'Subject' };
    const { schedule: updatedSched, allocatedHours, log } = boostSubjectHoursEngine(
      schedule,
      subjectId,
      subj.name,
      extraHours,
      systemDate
    );
    setSchedule(updatedSched);
    addNotification('Subject Hours Boosted', log, 'success');
  };

  // 7. Toggle Tentative Event
  const updateTentativeEventStatus = (eventId, status) => {
    setTentativeEvents(prev =>
      prev.map(ev => (ev.id === eventId ? { ...ev, status } : ev))
    );
    const event = tentativeEvents.find(e => e.id === eventId);
    if (event) {
      const { schedule: updatedSched, log } = toggleTentativeEventEngine(schedule, event, status);
      setSchedule(updatedSched);
      addNotification('Soft Block Updated', log, status === 'skipped' ? 'warning' : 'success');
    }
  };

  // 8. Add Tentative Event
  const addTentativeEvent = (eventData) => {
    const newEvent = {
      id: `tent-${Date.now()}`,
      ...eventData,
      status: 'tentative'
    };
    setTentativeEvents(prev => [...prev, newEvent]);

    const softBlock = {
      id: `block-tent-${newEvent.id}`,
      date: newEvent.date,
      startTime: newEvent.startTime,
      endTime: newEvent.endTime,
      title: `Tentative: ${newEvent.title}`,
      type: 'tentative',
      tentativeId: newEvent.id,
      status: 'scheduled',
      isFixed: false
    };
    setSchedule(prev => [...prev, softBlock]);
    addNotification('Soft Event Added', `Tentative event "${newEvent.title}" added with backup tasks ready.`, 'info');
  };

  // 9. Block Completion Check-In
  const toggleBlockCompletion = (blockId) => {
    setSchedule(prev =>
      prev.map(b => {
        if (b.id === blockId) {
          const newStatus = b.status === 'completed' ? 'scheduled' : 'completed';
          return { ...b, status: newStatus };
        }
        return b;
      })
    );
  };

  // 10. Manual Block Management
  const addCustomBlock = (blockData) => {
    const newBlock = {
      id: `custom-${Date.now()}`,
      ...blockData,
      status: 'scheduled'
    };
    setSchedule(prev => [...prev, newBlock]);
    addNotification('Block Scheduled', `Added "${newBlock.title}" on ${newBlock.date}`, 'info');
  };

  const deleteBlock = (blockId) => {
    setSchedule(prev => prev.filter(b => b.id !== blockId));
    addNotification('Block Removed', 'Study block removed from timeline.', 'info');
  };

  // Reset to default initial state
  const resetDefaults = () => {
    setSystemDateState(DEFAULT_SYSTEM_DATE);
    setSchedule(INITIAL_SCHEDULE_BLOCKS);
    setSubjects(INITIAL_SUBJECTS);
    setExams(INITIAL_EXAMS);
    setAssignments(INITIAL_ASSIGNMENTS);
    setTentativeEvents(INITIAL_TENTATIVE_EVENTS);
    setBlackouts(INITIAL_BLACKOUTS);
    setNotifications([]);
    localStorage.clear();
    addNotification('System Reset', 'Restored initial demonstration data.', 'info');
  };

  return (
    <SchedulerContext.Provider
      value={{
        systemDate,
        setSystemDate,
        schedule,
        subjects,
        exams,
        assignments,
        tentativeEvents,
        blackouts,
        notifications,
        activeTab,
        setActiveTab,
        markDayAsOff,
        addVacationBlackout,
        triggerCascadeMissedBlocks,
        addExam,
        addAssignment,
        boostSubject,
        updateTentativeEventStatus,
        addTentativeEvent,
        toggleBlockCompletion,
        addCustomBlock,
        deleteBlock,
        resetDefaults,
        addNotification
      }}
    >
      {children}
    </SchedulerContext.Provider>
  );
};

export const useScheduler = () => {
  const context = useContext(SchedulerContext);
  if (!context) {
    throw new Error('useScheduler must be used within a SchedulerProvider');
  }
  return context;
};
