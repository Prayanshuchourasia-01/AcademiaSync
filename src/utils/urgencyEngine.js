/**
 * Exam & Assignment Panic Index & Deadline Urgency Calculator
 * Computes countdown days, panic index score (0-100), and priority status tags.
 */

export const calculateUrgency = (targetDateStr, systemDateStr) => {
  const target = new Date(targetDateStr);
  const sys = new Date(systemDateStr);
  const diffMs = target - sys;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  let urgencyLevel = 'normal';
  let badgeColor = '#10b981';

  if (diffDays <= 1) {
    urgencyLevel = 'CRITICAL';
    badgeColor = '#f43f5e';
  } else if (diffDays <= 3) {
    urgencyLevel = 'HIGH';
    badgeColor = '#f59e0b';
  } else if (diffDays <= 7) {
    urgencyLevel = 'MODERATE';
    badgeColor = '#6366f1';
  }

  return {
    diffDays,
    urgencyLevel,
    badgeColor,
    isOverdue: diffDays < 0
  };
};
