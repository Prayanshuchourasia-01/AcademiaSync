import React, { useState } from 'react';
import { Share2, Copy, Check, X } from 'lucide-react';
import { useScheduler } from '../../context/SchedulerContext';
import { encodeScheduleShareURL } from '../../utils/peerShareEngine';

const ShareModal = ({ isOpen, onClose }) => {
  const { schedule } = useScheduler();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = encodeScheduleShareURL(schedule);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-indigo-400" />
            <h3 className="modal-title">Share Study Timetable</h3>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="modal-body space-y-4">
          <p className="text-sm text-gray-300">
            Share your weekly study timetable link with classmates and study group peers.
          </p>

          <div className="flex items-center gap-2 p-2 bg-gray-800 border border-gray-700 rounded-lg">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="w-full bg-transparent text-xs text-indigo-300 focus:outline-none px-2 font-mono overflow-ellipsis"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-medium flex items-center gap-1 shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
