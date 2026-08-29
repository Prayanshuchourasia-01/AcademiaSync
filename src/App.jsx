import React, { useState } from 'react';
import { SchedulerProvider, useScheduler } from './context/SchedulerContext';
import Navbar from './components/Navbar';
import AlarmWidget from './components/AlarmWidget';
import Timetable from './components/Timetable';
import FocusHUD from './components/FocusHUD';
import ExamsAndAssignments from './components/ExamsAndAssignments';
import SoftEventsTab from './components/SoftEventsTab';
import ReportsView from './components/ReportsView';

// Modals
import HolidayModal from './components/modals/HolidayModal';
import VacationModal from './components/modals/VacationModal';
import ExamAssignModal from './components/modals/ExamAssignModal';
import SubjectBoostModal from './components/modals/SubjectBoostModal';
import CustomBlockModal from './components/modals/CustomBlockModal';
import TentativeModal from './components/modals/TentativeModal';

const AppContent = () => {
  const { activeTab } = useScheduler();

  // Modal open states
  const [isHolidayOpen, setIsHolidayOpen] = useState(false);
  const [isVacationOpen, setIsVacationOpen] = useState(false);
  const [isExamAssignOpen, setIsExamAssignOpen] = useState(false);
  const [isBoostOpen, setIsBoostOpen] = useState(false);
  const [isCustomBlockOpen, setIsCustomBlockOpen] = useState(false);
  const [isTentativeOpen, setIsTentativeOpen] = useState(false);

  return (
    <div className="app-container">
      <Navbar
        onOpenHolidayModal={() => setIsHolidayOpen(true)}
        onOpenVacationModal={() => setIsVacationOpen(true)}
        onOpenExamAssignModal={() => setIsExamAssignOpen(true)}
        onOpenBoostModal={() => setIsBoostOpen(true)}
        onOpenCustomBlockModal={() => setIsCustomBlockOpen(true)}
      />

      <AlarmWidget />

      <main className="main-content">
        {activeTab === 'schedule' && (
          <Timetable onOpenHolidayModal={() => setIsHolidayOpen(true)} />
        )}

        {activeTab === 'hud' && <FocusHUD />}

        {activeTab === 'exams' && (
          <ExamsAndAssignments onOpenExamAssignModal={() => setIsExamAssignOpen(true)} />
        )}

        {activeTab === 'tentative' && (
          <SoftEventsTab onOpenTentativeModal={() => setIsTentativeOpen(true)} />
        )}

        {activeTab === 'reports' && <ReportsView />}
      </main>

      {/* Dynamic Engine Modals */}
      <HolidayModal isOpen={isHolidayOpen} onClose={() => setIsHolidayOpen(false)} />
      <VacationModal isOpen={isVacationOpen} onClose={() => setIsVacationOpen(false)} />
      <ExamAssignModal isOpen={isExamAssignOpen} onClose={() => setIsExamAssignOpen(false)} />
      <SubjectBoostModal isOpen={isBoostOpen} onClose={() => setIsBoostOpen(false)} />
      <CustomBlockModal isOpen={isCustomBlockOpen} onClose={() => setIsCustomBlockOpen(false)} />
      <TentativeModal isOpen={isTentativeOpen} onClose={() => setIsTentativeOpen(false)} />
    </div>
  );
};

function App() {
  return (
    <SchedulerProvider>
      <AppContent />
    </SchedulerProvider>
  );
}

export default App;
