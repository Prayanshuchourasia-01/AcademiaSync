import React, { useState } from 'react';
import { BookOpen, X, Plus } from 'lucide-react';
import { useScheduler } from '../../context/SchedulerContext';
import { SUBJECT_PALETTES } from '../../utils/subjectThemes';

const SubjectModal = ({ isOpen, onClose }) => {
  const { subjects, addNotification } = useScheduler();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [color, setColor] = useState('#6366f1');
  const [targetHours, setTargetHours] = useState(10);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !code) return;

    addNotification('Subject Added', `Created new subject "${code}: ${name}"`, 'success');
    setName('');
    setCode('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h3 className="modal-title">Add Academic Subject</h3>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Subject Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Distributed Systems"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Course Code</label>
            <input
              type="text"
              required
              placeholder="e.g. CS-401"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Color Theme</label>
            <div className="grid grid-cols-6 gap-2 mt-1">
              {SUBJECT_PALETTES.map((p) => (
                <button
                  type="button"
                  key={p.name}
                  onClick={() => setColor(p.primary)}
                  className={`h-8 rounded-lg border-2 transition ${color === p.primary ? 'border-white scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: p.primary }}
                  title={p.name}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Weekly Target Hours ({targetHours} hrs)</label>
            <input
              type="range"
              min="2"
              max="20"
              value={targetHours}
              onChange={(e) => setTargetHours(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition text-sm mt-2"
          >
            <Plus className="w-4 h-4" /> Save Subject
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubjectModal;
