/**
 * Workload Analytics & Heatmap Calculation Engine
 * Analyzes hourly study distribution, peak productivity hours, and subject balance metrics.
 */

export const calculateHourlyDistribution = (schedule = []) => {
  const hourlyCounts = Array(24).fill(0);

  schedule.forEach(block => {
    if (!block.startTime || block.status === 'reclaimed') return;
    const startHour = parseInt(block.startTime.split(':')[0], 10);
    if (!isNaN(startHour) && startHour >= 0 && startHour < 24) {
      hourlyCounts[startHour] += 1;
    }
  });

  return hourlyCounts;
};

export const getPeakFocusTimeSlot = (schedule = []) => {
  const hourly = calculateHourlyDistribution(schedule);
  let maxCount = -1;
  let peakHour = 14; // Default 2 PM

  hourly.forEach((count, hr) => {
    if (count > maxCount) {
      maxCount = count;
      peakHour = hr;
    }
  });

  const formattedHour = peakHour > 12 ? `${peakHour - 12} PM` : peakHour === 12 ? '12 PM' : `${peakHour} AM`;
  return {
    peakHour,
    label: `${formattedHour} – ${peakHour + 1 > 12 ? (peakHour + 1 === 12 ? '12 PM' : `${peakHour + 1 - 12} PM`) : `${peakHour + 1} AM`}`,
    count: maxCount
  };
};
