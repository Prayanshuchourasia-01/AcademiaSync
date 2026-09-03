/**
 * GPA Estimator & Academic Performance Calculator Engine
 * Calculates weighted cumulative GPA, target required scores, and subject grade projections.
 */

export const GRADE_SCALE = {
  'A+': 4.0,
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D': 1.0,
  'F': 0.0
};

export const calculateWeightedGPA = (subjects = [], exams = []) => {
  let totalGradePoints = 0;
  let totalCredits = 0;

  subjects.forEach(subject => {
    const credits = subject.credits || 3;
    const subjectExams = exams.filter(e => e.subjectId === subject.id && e.score != null);

    if (subjectExams.length > 0) {
      const avgScorePercent = subjectExams.reduce((acc, curr) => acc + (curr.score / curr.maxScore), 0) / subjectExams.length;
      let gpaValue = 0;
      if (avgScorePercent >= 0.90) gpaValue = 4.0;
      else if (avgScorePercent >= 0.80) gpaValue = 3.5;
      else if (avgScorePercent >= 0.70) gpaValue = 3.0;
      else if (avgScorePercent >= 0.60) gpaValue = 2.5;
      else gpaValue = 2.0;

      totalGradePoints += gpaValue * credits;
      totalCredits += credits;
    }
  });

  return totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : '3.85';
};

export const calculateRequiredExamScore = (currentGPA, targetGPA, totalCredits, upcomingCredits) => {
  const currentTotalPoints = currentGPA * totalCredits;
  const targetTotalPoints = targetGPA * (totalCredits + upcomingCredits);
  const neededPoints = targetTotalPoints - currentTotalPoints;
  const neededGPA = neededPoints / upcomingCredits;
  return Math.min(Math.max(neededGPA, 0), 4.0).toFixed(2);
};
