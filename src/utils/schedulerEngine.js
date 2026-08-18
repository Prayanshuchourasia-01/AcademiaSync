// Core Dynamic Scheduling Engine for Module 2: Dynamic Academic & Habit Scheduler

import { addDays, diffInDays, timeToMinutes, minutesToTime, formatDate } from './dateUtils';

/**
 * 1. Unexpected Holiday Reclamation Engine
 */
export const reclaimHolidayEngine = (schedule, targetDate, startTimePrompt, subjects = []) => {
  let updatedSchedule = [...schedule];

  // 1. Find college/work block on targetDate
  const collegeBlockIndex = updatedSchedule.findIndex(
    b => b.date === targetDate && b.type === 'college'
  );

  if (collegeBlockIndex !== -1) {
    // Reclaim this block
    updatedSchedule[collegeBlockIndex] = {
      ...updatedSchedule[collegeBlockIndex],
      status: 'reclaimed',
      title: 'Unexpected Holiday (College Block Reclaimed)'
    };
  }

  // Remove any previously generated holiday reclaimed blocks for this date to avoid duplication
  updatedSchedule = updatedSchedule.filter(
    b => !(b.date === targetDate && b.type === 'reclaimed')
  );

  // High priority subjects
  const topSubjects = [...subjects].sort((a, b) => {
    const priorityScore = { High: 3, Medium: 2, Low: 1 };
    return (priorityScore[b.priority] || 1) - (priorityScore[a.priority] || 1);
  });

  const subj1 = topSubjects[0] || { id: 'subj-1', name: 'DSA & Algorithms', color: '#6366f1' };
  const subj2 = topSubjects[1] || { id: 'subj-2', name: 'AI & ML Concepts', color: '#8b5cf6' };

  // Calculate new learning slots starting from startTimePrompt
  const startMins = timeToMinutes(startTimePrompt);

  // Block 1: Morning/Midday Reclaimed Slot (2 hours)
  const slot1Start = startTimePrompt;
  const slot1End = minutesToTime(startMins + 120);

  // Block 2: Afternoon Reclaimed Slot (2 hours after 1h break)
  const slot2Start = minutesToTime(startMins + 180);
  const slot2End = minutesToTime(startMins + 300);

  const reclaimedBlock1 = {
    id: `reclaim-${targetDate}-1`,
    date: targetDate,
    startTime: slot1Start,
    endTime: slot1End,
    title: `[Reclaimed Holiday] High-Priority ${subj1.name}`,
    type: 'reclaimed',
    subjectId: subj1.id,
    status: 'scheduled',
    isFixed: false,
    note: `Auto-populated from unexpected holiday reclamation starting at ${startTimePrompt}`
  };

  const reclaimedBlock2 = {
    id: `reclaim-${targetDate}-2`,
    date: targetDate,
    startTime: slot2Start,
    endTime: slot2End,
    title: `[Reclaimed Holiday] ${subj2.name} Intensive`,
    type: 'reclaimed',
    subjectId: subj2.id,
    status: 'scheduled',
    isFixed: false,
    note: `Auto-populated from unexpected holiday reclamation`
  };

  updatedSchedule.push(reclaimedBlock1, reclaimedBlock2);

  return {
    schedule: updatedSchedule,
    freedHours: 4,
    log: `Reclaimed 4 hours on ${targetDate}. High-priority study blocks populated starting from ${startTimePrompt}.`
  };
};

/**
 * 2. Vacation Mode & Schedule Blackouts Engine
 */
export const applyVacationBlackoutEngine = (schedule, startDate, endDate, mode = 'freeze') => {
  let updatedSchedule = [...schedule];
  const displacedBlocks = [];

  // Identify all dates in blackout range
  const numDays = diffInDays(endDate, startDate) + 1;
  const blackoutDates = [];
  for (let i = 0; i < numDays; i++) {
    blackoutDates.push(addDays(startDate, i));
  }

  // Remove or pause study blocks during blackout dates
  updatedSchedule = updatedSchedule.map(block => {
    if (blackoutDates.includes(block.date) && block.type !== 'college') {
      if (block.status === 'scheduled') {
        displacedBlocks.push({ ...block });
        return {
          ...block,
          status: 'skipped',
          title: `[Blackout Paused] ${block.title}`
        };
      }
    }
    return block;
  });

  if (displacedBlocks.length === 0) {
    return { schedule: updatedSchedule, displacedCount: 0, log: 'No conflicting blocks found in blackout range.' };
  }

  // Reallocate displaced blocks
  if (mode === 'freeze') {
    // Push blocks into days immediately following endDate
    let targetDayOffset = 1;
    displacedBlocks.forEach(block => {
      const newDate = addDays(endDate, targetDayOffset);
      updatedSchedule.push({
        ...block,
        id: `vac-shift-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        date: newDate,
        status: 'scheduled',
        title: `[Shifted Post-Vacation] ${block.title.replace('[Blackout Paused] ', '')}`
      });
      targetDayOffset++;
    });
  } else if (mode === 'compress') {
    // Front-load and compress: divide displaced hours before startDate and after endDate
    let targetDayOffset = 1;
    displacedBlocks.forEach((block, idx) => {
      // Alternating before and after
      const newDate = idx % 2 === 0 ? addDays(startDate, -(Math.floor(idx / 2) + 1)) : addDays(endDate, Math.floor(idx / 2) + 1);
      updatedSchedule.push({
        ...block,
        id: `vac-comp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        date: newDate,
        status: 'scheduled',
        title: `[Compressed Study] ${block.title.replace('[Blackout Paused] ', '')}`
      });
    });
  }

  return {
    schedule: updatedSchedule,
    displacedCount: displacedBlocks.length,
    log: `Vacation blackout applied from ${startDate} to ${endDate}. ${displacedBlocks.length} study blocks re-routed via ${mode.toUpperCase()} mode.`
  };
};

/**
 * 3. Missed Block Cascading Engine
 */
export const cascadeMissedBlocksEngine = (schedule, referenceDate, maxDailyHours = 6) => {
  let updatedSchedule = [...schedule];
  const logs = [];

  // Find missed blocks on or before referenceDate that are marked 'scheduled' but expired
  const missedCandidates = updatedSchedule.filter(b => {
    if (b.date < referenceDate && b.status === 'scheduled' && b.type !== 'college') {
      return true;
    }
    return false;
  });

  if (missedCandidates.length === 0) {
    return { schedule: updatedSchedule, cascadedCount: 0, logs: ['No missed blocks to cascade.'] };
  }

  // Mark candidates as 'missed'
  updatedSchedule = updatedSchedule.map(block => {
    if (missedCandidates.some(m => m.id === block.id)) {
      return { ...block, status: 'missed' };
    }
    return block;
  });

  // Cascade each missed block into available slots within next 3 to 5 days
  missedCandidates.forEach(missedBlock => {
    let placed = false;
    // Check days +1 to +5 from referenceDate
    for (let dayOffset = 1; dayOffset <= 5; dayOffset++) {
      const targetDate = addDays(referenceDate, dayOffset);

      // Check current total study hours on targetDate
      const existingStudyMins = updatedSchedule
        .filter(b => b.date === targetDate && b.status === 'scheduled' && b.type !== 'college')
        .reduce((sum, b) => sum + (timeToMinutes(b.endTime) - timeToMinutes(b.startTime)), 0);

      const blockDurationMins = timeToMinutes(missedBlock.endTime) - timeToMinutes(missedBlock.startTime) || 90;

      if ((existingStudyMins + blockDurationMins) / 60 <= maxDailyHours) {
        // Create cascaded block in evening slot (e.g. 21:30 - 23:00)
        const cascadedStart = '21:30';
        const cascadedEnd = minutesToTime(timeToMinutes(cascadedStart) + blockDurationMins);

        updatedSchedule.push({
          ...missedBlock,
          id: `cascade-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          date: targetDate,
          startTime: cascadedStart,
          endTime: cascadedEnd,
          type: 'cascaded',
          status: 'scheduled',
          title: `[Cascaded] ${missedBlock.title}`,
          note: `Auto-cascaded from missed block on ${missedBlock.date}`
        });

        logs.push(`Cascaded block "${missedBlock.title}" from ${missedBlock.date} $\\rightarrow$ ${targetDate} (${cascadedStart} - ${cascadedEnd}).`);
        placed = true;
        break;
      }
    }

    if (!placed) {
      logs.push(`Warning: Could not cascade "${missedBlock.title}" without exceeding max daily study cap of ${maxDailyHours}h.`);
    }
  });

  return {
    schedule: updatedSchedule,
    cascadedCount: missedCandidates.length,
    logs
  };
};

/**
 * 4. Target Deadlines: Exam & Assignment Routing
 */
export const routeAssignmentEmergencyEngine = (schedule, assignment) => {
  let updatedSchedule = [...schedule];
  const { title, dueDate, estimatedHours, subjectId } = assignment;

  // Insert assignment block in closest open evening slots before dueDate
  const reqMins = estimatedHours * 60;
  let remainingMins = reqMins;

  // Search days starting from today up to dueDate
  const daysToDue = Math.max(1, diffInDays(dueDate, formatDate(new Date())));
  const targetDate = dueDate;

  const slotStart = '17:00';
  const slotEnd = minutesToTime(timeToMinutes(slotStart) + reqMins);

  // Overwrite existing non-fixed study blocks if needed
  updatedSchedule = updatedSchedule.map(block => {
    if (block.date === targetDate && block.startTime === slotStart && !block.isFixed && block.type !== 'college') {
      // Displace block to cascade later
      return {
        ...block,
        status: 'missed',
        title: `[Displaced by Assignment] ${block.title}`
      };
    }
    return block;
  });

  const assignmentBlock = {
    id: `assign-block-${Date.now()}`,
    date: targetDate,
    startTime: slotStart,
    endTime: slotEnd,
    title: `🔥 URGENT ASSIGNMENT: ${title}`,
    type: 'assignment',
    subjectId,
    assignmentId: assignment.id,
    status: 'scheduled',
    isFixed: true,
    note: `Emergency high-priority assignment route due ${dueDate}`
  };

  updatedSchedule.push(assignmentBlock);

  return {
    schedule: updatedSchedule,
    log: `Emergency assignment block scheduled for "${title}" on ${targetDate} (${slotStart} - ${slotEnd}).`
  };
};

/**
 * 5. Subject Boosting Engine
 */
export const boostSubjectHoursEngine = (schedule, subjectId, subjectName, extraHours, referenceDate) => {
  let updatedSchedule = [...schedule];
  const reqMins = extraHours * 60;
  let placedHours = 0;

  for (let offset = 0; offset < 7; offset++) {
    if (placedHours >= extraHours) break;

    const targetDate = addDays(referenceDate, offset);
    // Find open slot around 16:00 or 21:00
    const slotStart = '16:00';
    const slotEnd = minutesToTime(timeToMinutes(slotStart) + 120);

    const hasConflict = updatedSchedule.some(
      b => b.date === targetDate && b.startTime === slotStart && b.status === 'scheduled'
    );

    if (!hasConflict) {
      updatedSchedule.push({
        id: `boost-${Date.now()}-${offset}`,
        date: targetDate,
        startTime: slotStart,
        endTime: slotEnd,
        title: `⚡ [Subject Boost] ${subjectName}`,
        type: 'study',
        subjectId,
        status: 'scheduled',
        isFixed: false,
        note: `Manual boost override: +2 hours`
      });
      placedHours += 2;
    }
  }

  return {
    schedule: updatedSchedule,
    allocatedHours: placedHours,
    log: `Allocated +${placedHours} boosted study hours for ${subjectName} over the week.`
  };
};

/**
 * 6. Tentative / Soft Events Engine
 */
export const toggleTentativeEventEngine = (schedule, tentativeEvent, status) => {
  let updatedSchedule = [...schedule];

  const blockIndex = updatedSchedule.findIndex(b => b.tentativeId === tentativeEvent.id);

  if (status === 'skipped') {
    // User skipped event -> Activate backup learning tasks instantly
    if (blockIndex !== -1) {
      updatedSchedule.splice(blockIndex, 1); // remove soft block
    }

    let startMins = timeToMinutes(tentativeEvent.startTime);
    tentativeEvent.backupTasks.forEach((task, idx) => {
      const endMins = startMins + task.durationMins;
      updatedSchedule.push({
        id: `backup-${tentativeEvent.id}-${idx}`,
        date: tentativeEvent.date,
        startTime: minutesToTime(startMins),
        endTime: minutesToTime(endMins),
        title: `🎯 [Backup Task] ${task.title}`,
        type: 'study',
        subjectId: task.subjectId,
        status: 'scheduled',
        isFixed: false,
        note: `Activated backup learning task because soft event was skipped.`
      });
      startMins = endMins + 15; // 15 min gap
    });
  } else if (status === 'attending') {
    if (blockIndex !== -1) {
      updatedSchedule[blockIndex] = {
        ...updatedSchedule[blockIndex],
        status: 'completed',
        title: `✅ [Attending Event] ${tentativeEvent.title}`
      };
    }
  }

  return {
    schedule: updatedSchedule,
    log: status === 'skipped' ? `Soft event skipped. Activated backup study tasks!` : `Event marked as attending.`
  };
};
