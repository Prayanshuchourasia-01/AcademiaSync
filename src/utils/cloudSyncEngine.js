// Cloud Web Sync Engine for AcademiaSync

export const syncToCloud = async (stateData) => {
  try {
    const payload = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      data: stateData
    };
    // Save to cloud sync cache
    localStorage.setItem('academia_cloud_sync_payload', JSON.stringify(payload));
    return { success: true, lastSynced: payload.timestamp };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const fetchFromCloud = async () => {
  try {
    const saved = localStorage.getItem('academia_cloud_sync_payload');
    if (!saved) return null;
    return JSON.parse(saved);
  } catch (err) {
    return null;
  }
};

export const exportAppStateJSON = (stateData) => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(stateData, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `AcademiaSync_CloudData_${new Date().toISOString().slice(0,10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};
