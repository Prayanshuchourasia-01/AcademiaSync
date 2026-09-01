/**
 * AcademiaSync Data Export & Import Engine
 * Facilitates complete JSON backup and restoration of user schedules, subjects, exams, and settings.
 */

export const exportAppStateJSON = (state) => {
  const exportData = {
    app: 'AcademiaSync',
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    systemDate: state.systemDate,
    schedule: state.schedule || [],
    subjects: state.subjects || [],
    exams: state.exams || [],
    assignments: state.assignments || [],
    tentativeEvents: state.tentativeEvents || [],
    blackouts: state.blackouts || []
  };

  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `AcademiaSync_Backup_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const parseImportStateJSON = (fileContent) => {
  try {
    const data = JSON.parse(fileContent);
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid backup file format.');
    }
    if (data.app !== 'AcademiaSync') {
      throw new Error('Unrecognized backup file. Expected AcademiaSync data.');
    }
    return {
      success: true,
      data: {
        systemDate: data.systemDate || '2026-08-31',
        schedule: Array.isArray(data.schedule) ? data.schedule : [],
        subjects: Array.isArray(data.subjects) ? data.subjects : [],
        exams: Array.isArray(data.exams) ? data.exams : [],
        assignments: Array.isArray(data.assignments) ? data.assignments : [],
        tentativeEvents: Array.isArray(data.tentativeEvents) ? data.tentativeEvents : [],
        blackouts: Array.isArray(data.blackouts) ? data.blackouts : []
      }
    };
  } catch (err) {
    return {
      success: false,
      error: err.message
    };
  }
};
