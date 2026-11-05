import React, { useState } from 'react';
import { VenueProvider } from './context/VenueContext';
import { Navigation, NavTab } from './components/Navigation';
import { DashboardView } from './components/dashboard/DashboardView';
import { ReservationsView } from './components/reservations/ReservationsView';
import { CalendarView } from './components/calendar/CalendarView';
import { FinanceView } from './components/finance/FinanceView';
import { ReportsView } from './components/reports/ReportsView';
import { ReservationTypesView } from './components/reservationTypes/ReservationTypesView';
import { AdditionalItemsView } from './components/addons/AdditionalItemsView';
import { SpacesView } from './components/spaces/SpacesView';
import { CompanySettingsView } from './components/company/CompanySettingsView';
import { CatalogManagementView } from './components/catalog/CatalogManagementView';
import { ReservationModal } from './components/reservations/ReservationModal';
import { ContractModal } from './components/contract/ContractModal';
import { InspectionModal } from './components/inspection/InspectionModal';
import { PaymentReceiptModal } from './components/receipts/PaymentReceiptModal';
import { BookingConfirmationModal } from './components/confirmation/BookingConfirmationModal';
import { SettingsModal } from './components/settings/SettingsModal';
import { Reservation, FinancialTransaction } from './types';

function MainAppContent() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');

  // Reservation Form Modal state
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [reservationToEdit, setReservationToEdit] = useState<Reservation | null>(null);
  const [initialReservationDate, setInitialReservationDate] = useState<string | undefined>(undefined);

  // Contract Modal state
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [selectedContractReservation, setSelectedContractReservation] = useState<Reservation | null>(null);

  // Inspection Checklist Modal state
  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false);
  const [selectedInspectionReservation, setSelectedInspectionReservation] = useState<Reservation | null>(null);

  // Payment Receipt Modal state
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedReceiptReservation, setSelectedReceiptReservation] = useState<Reservation | null>(null);
  const [selectedReceiptTransaction, setSelectedReceiptTransaction] = useState<FinancialTransaction | null>(null);

  // Booking Confirmation Modal state
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [selectedConfirmationReservation, setSelectedConfirmationReservation] = useState<Reservation | null>(null);

  // Venue Settings Modal state
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Modal Triggers
  const handleOpenNewReservation = (dateStr?: string) => {
    setReservationToEdit(null);
    setInitialReservationDate(dateStr || '2026-11-21');
    setIsReservationModalOpen(true);
  };

  const handleEditReservation = (res: Reservation) => {
    setReservationToEdit(res);
    setInitialReservationDate(undefined);
    setIsReservationModalOpen(true);
  };

  const handleOpenContract = (res: Reservation) => {
    setSelectedContractReservation(res);
    setIsContractModalOpen(true);
  };

  const handleOpenInspection = (res: Reservation) => {
    setSelectedInspectionReservation(res);
    setIsInspectionModalOpen(true);
  };

  const handleOpenReceipt = (res?: Reservation, tx?: FinancialTransaction) => {
    setSelectedReceiptReservation(res || null);
    setSelectedReceiptTransaction(tx || null);
    setIsReceiptModalOpen(true);
  };

  const handleOpenConfirmation = (res: Reservation) => {
    setSelectedConfirmationReservation(res);
    setIsConfirmationModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors">
      
      {/* Top Header Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewReservation={() => handleOpenNewReservation()}
        onOpenSettings={() => setActiveTab('company')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {activeTab === 'dashboard' && (
          <DashboardView
            onOpenNewReservation={() => handleOpenNewReservation()}
            onOpenContract={handleOpenContract}
            onOpenInspection={handleOpenInspection}
            onEditReservation={handleEditReservation}
            onNavigateToCalendar={() => setActiveTab('calendar')}
            onNavigateToFinance={() => setActiveTab('finance')}
            onNavigateToCompany={() => setActiveTab('company')}
            onOpenReceipt={(res) => handleOpenReceipt(res)}
            onOpenConfirmation={handleOpenConfirmation}
          />
        )}

        {activeTab === 'reservations' && (
          <ReservationsView
            onOpenNewReservation={() => handleOpenNewReservation()}
            onOpenContract={handleOpenContract}
            onOpenInspection={handleOpenInspection}
            onEditReservation={handleEditReservation}
            onOpenReceipt={(res) => handleOpenReceipt(res)}
            onOpenConfirmation={handleOpenConfirmation}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarView
            onOpenNewReservationWithDate={(dateStr) => handleOpenNewReservation(dateStr)}
            onOpenContract={handleOpenContract}
            onOpenInspection={handleOpenInspection}
            onEditReservation={handleEditReservation}
            onOpenReceipt={(res) => handleOpenReceipt(res)}
            onOpenConfirmation={handleOpenConfirmation}
          />
        )}

        {activeTab === 'finance' && (
          <FinanceView 
            onOpenReceipt={(tx) => handleOpenReceipt(undefined, tx)}
            onNavigateToReports={() => setActiveTab('reports')}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView />
        )}

        {(activeTab === 'catalog' || activeTab === 'reservation-types' || activeTab === 'addons') && (
          <CatalogManagementView 
            initialSubTab={
              activeTab === 'addons' ? 'addons' :
              activeTab === 'reservation-types' ? 'reservation-types' : 'reservation-types'
            } 
          />
        )}

        {activeTab === 'spaces' && (
          <SpacesView />
        )}

        {activeTab === 'company' && (
          <CompanySettingsView />
        )}
      </main>

      {/* Modals & Dialogs */}
      <ReservationModal
        isOpen={isReservationModalOpen}
        onClose={() => setIsReservationModalOpen(false)}
        reservationToEdit={reservationToEdit}
        initialDate={initialReservationDate}
      />

      <ContractModal
        isOpen={isContractModalOpen}
        onClose={() => setIsContractModalOpen(false)}
        reservation={selectedContractReservation}
      />

      <InspectionModal
        isOpen={isInspectionModalOpen}
        onClose={() => setIsInspectionModalOpen(false)}
        reservation={selectedInspectionReservation}
      />

      <PaymentReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => {
          setIsReceiptModalOpen(false);
          setSelectedReceiptReservation(null);
          setSelectedReceiptTransaction(null);
        }}
        reservation={selectedReceiptReservation}
        transaction={selectedReceiptTransaction}
      />

      <BookingConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => {
          setIsConfirmationModalOpen(false);
          setSelectedConfirmationReservation(null);
        }}
        reservation={selectedConfirmationReservation}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <VenueProvider>
      <MainAppContent />
    </VenueProvider>
  );
}
