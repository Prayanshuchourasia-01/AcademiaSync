import React, { useState } from 'react';
import { Download, Upload, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { useScheduler } from '../../context/SchedulerContext';
import { exportAppStateJSON, parseImportStateJSON } from '../../utils/dataExportEngine';

const DataBackupModal = ({ isOpen, onClose }) => {
  const { systemDate, schedule, subjects, exams, assignments, tentativeEvents, blackouts, restoreFullState, addNotification } = useScheduler();
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');

  if (!isOpen) return null;

  const handleExport = () => {
    exportAppStateJSON({
      systemDate,
      schedule,
      subjects,
      exams,
      assignments,
      tentativeEvents,
      blackouts
    });
    addNotification('Backup Downloaded', 'Exported full AcademiaSync dataset to JSON.', 'success');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImportError('');
    setImportSuccess('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = parseImportStateJSON(event.target.result);
      if (result.success) {
        if (restoreFullState) {
          restoreFullState(result.data);
        }
        setImportSuccess('Data restored successfully!');
        addNotification('Backup Restored', 'AcademiaSync schedule imported.', 'success');
      } else {
        setImportError(result.error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-indigo-400" />
            <h3 className="modal-title">Data Backup & Restore</h3>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="modal-body space-y-4">
          <p className="text-sm text-gray-300">
            Export your complete academic schedule, exams, assignments, and soft events as a JSON file, or restore from a previous backup.
          </p>

          <div className="p-4 rounded-lg bg-gray-800/60 border border-gray-700/60 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-300">Export Backup</h4>
            <button
              onClick={handleExport}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition"
            >
              <Download className="w-4 h-4" /> Export JSON Backup
            </button>
          </div>

          <div className="p-4 rounded-lg bg-gray-800/60 border border-gray-700/60 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-300">Restore from File</h4>
            <label className="w-full py-2.5 px-4 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg flex items-center justify-center gap-2 cursor-pointer transition">
              <Upload className="w-4 h-4" /> Select Backup JSON File
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {importError && (
            <div className="p-3 bg-red-900/30 border border-red-500/40 text-red-300 rounded-lg flex items-center gap-2 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{importError}</span>
            </div>
          )}

          {importSuccess && (
            <div className="p-3 bg-emerald-900/30 border border-emerald-500/40 text-emerald-300 rounded-lg flex items-center gap-2 text-xs">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{importSuccess}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataBackupModal;
