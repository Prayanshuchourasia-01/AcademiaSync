import React from 'react';
import { Keyboard, X } from 'lucide-react';

const ShortcutsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Alt + S', desc: 'Navigate to Schedule Timetable' },
    { key: 'Alt + H', desc: 'Navigate to Focus HUD' },
    { key: 'Alt + E', desc: 'Navigate to Exams & Assignments' },
    { key: 'Alt + N', desc: 'Open Add Study Block Dialog' },
    { key: '?', desc: 'Toggle Keyboard Shortcuts Helper' }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-indigo-400" />
            <h3 className="modal-title">Keyboard Shortcuts Guide</h3>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="modal-body space-y-3">
          {shortcuts.map((s) => (
            <div key={s.key} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-800/80 border border-gray-700/60 text-sm">
              <span className="text-gray-300">{s.desc}</span>
              <kbd className="px-2.5 py-1 bg-gray-900 border border-gray-700 text-indigo-300 font-mono text-xs rounded-md shadow">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShortcutsModal;
