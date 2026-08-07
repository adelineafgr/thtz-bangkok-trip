import React, { useState } from 'react';
import { TripProvider, useTrip } from './context/TripContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { OverviewTab } from './components/OverviewTab';
import { ItineraryTab } from './components/ItineraryTab';
import { PrepNotesTab } from './components/PrepNotesTab';
import { WishlistTab } from './components/WishlistTab';
import { MoodboardTab } from './components/MoodboardTab';
import { ExpenseTab } from './components/ExpenseTab';
import { QuickAddModal } from './components/QuickAddModal';
import { DevicePreviewWrapper } from './components/DevicePreviewWrapper';

function AppContent() {
  const { activeTab } = useTrip();
  const [isDevicePreview, setIsDevicePreview] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'itinerary':
        return <ItineraryTab />;
      case 'prep':
        return <PrepNotesTab />;
      case 'wishlist':
        return <WishlistTab />;
      case 'moodboard':
        return <MoodboardTab />;
      case 'expenses':
        return <ExpenseTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <DevicePreviewWrapper
      isDevicePreview={isDevicePreview}
      onToggle={() => setIsDevicePreview(!isDevicePreview)}
    >
      <div className="min-h-screen bg-indigo-50 text-indigo-950 font-sans selection:bg-rose-100 selection:text-rose-900">
        
        {/* Navigation Header */}
        <Navbar
          isDevicePreview={isDevicePreview}
          toggleDevicePreview={() => setIsDevicePreview(!isDevicePreview)}
          onOpenQuickAdd={() => setIsQuickAddOpen(true)}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-24">
          {renderActiveTab()}
        </main>

        {/* Mobile Bottom Navigation */}
        <BottomNav onOpenQuickAdd={() => setIsQuickAddOpen(true)} />

        {/* Quick Add Modal */}
        <QuickAddModal
          isOpen={isQuickAddOpen}
          onClose={() => setIsQuickAddOpen(false)}
        />

      </div>
    </DevicePreviewWrapper>
  );
}

export default function App() {
  return (
    <TripProvider>
      <AppContent />
    </TripProvider>
  );
}
