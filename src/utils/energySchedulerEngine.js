/**
 * Energy-Level & Cognitive Load Scheduler Engine
 * Matches heavy conceptual study subjects to peak alertness hours based on user chronotype (Early Bird vs Night Owl).
 */

export const optimizeScheduleForEnergy = (schedule = [], chronotype = 'early_bird') => {
  return schedule.map(block => {
    if (block.type === 'college' || block.isFixed) return block;

    const startHour = parseInt(block.startTime.split(':')[0], 10);
    let energyMatch = 'medium';

    if (chronotype === 'early_bird') {
      if (startHour >= 8 && startHour <= 12) energyMatch = 'peak';
      else if (startHour >= 18) energyMatch = 'low';
    } else if (chronotype === 'night_owl') {
      if (startHour >= 18 && startHour <= 23) energyMatch = 'peak';
      else if (startHour < 11) energyMatch = 'low';
    }

    return {
      ...block,
      energyMatch
    };
  });
};
