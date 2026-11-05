import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  PlusCircle, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Clock, 
  User, 
  Phone, 
  FileText, 
  ClipboardCheck, 
  MessageCircle,
  Receipt,
  CheckCircle
} from 'lucide-react';
import { useVenue } from '../../context/VenueContext';
import { Reservation } from '../../types';

interface CalendarViewProps {
  onOpenNewReservationWithDate: (dateStr: string) => void;
  onOpenContract: (res: Reservation) => void;
  onOpenInspection: (res: Reservation) => void;
  onEditReservation: (res: Reservation) => void;
  onOpenReceipt: (res: Reservation) => void;
  onOpenConfirmation: (res: Reservation) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  onOpenNewReservationWithDate,
  onOpenContract,
  onOpenInspection,
  onEditReservation,
  onOpenReceipt,
  onOpenConfirmation
}) => {
  const { 
    reservations, 
    formatCurrency, 
    formatDateBR, 
    generateWhatsAppUrl,
    venueConfig 
  } = useVenue();

  // Current viewed month state: default November 2026
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(10); // 0-indexed: 10 = November
  const [selectedDayRes, setSelectedDayRes] = useState<Reservation | null>(null);
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-11-07');

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  // Generate days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sunday

  // Helper to get formatted YYYY-MM-DD
  const formatDayString = (day: number) => {
    const m = String(currentMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${currentYear}-${m}-${d}`;
  };

  // Find reservations for a specific day
  const getReservationsForDay = (dateStr: string) => {
    return reservations.filter(r => {
      if (r.reservationStatus === 'cancelada') return false;
      const start = r.startDate;
      const end = r.endDate || r.startDate;
      return dateStr >= start && dateStr <= end;
    });
  };

  // Stats for current viewed month
  const monthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
  const monthBookings = reservations.filter(r => 
    r.reservationStatus !== 'cancelada' && 
    r.startDate.startsWith(monthPrefix)
  );

  const monthRevenueExpected = monthBookings.reduce((sum, r) => sum + r.totalAmount, 0);

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const paddingArray = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  return (
    <div className="space-y-6 pb-16">
      
      {/* Calendar Header with Navigation and Summary */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-amber-600" />
            <span>Calendário de Ocupação & Disponibilidade</span>
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Visualize dias ocupados, pré-reservas e agende novas locações com 1 clique sobre a data.
          </p>
        </div>

        {/* Month Selector Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-1 shadow-xs">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title="Mês Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-bold text-stone-800 dark:text-stone-200 min-w-[130px] text-center">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1.5 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title="Próximo Mês"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => {
              setCurrentYear(2026);
              setCurrentMonth(10);
            }}
            className="px-3 py-1.5 text-xs font-medium text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 rounded-lg hover:bg-stone-100 transition-colors"
          >
            Mês Atual
          </button>
        </div>
      </div>

      {/* Month Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-3.5 flex items-center justify-between">
          <span className="text-stone-500 dark:text-stone-400">Eventos em {monthNames[currentMonth]}:</span>
          <span className="font-bold text-stone-900 dark:text-stone-100 font-mono tabular-nums">
            {monthBookings.length} reservas
          </span>
        </div>
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-3.5 flex items-center justify-between">
          <span className="text-stone-500 dark:text-stone-400">Faturamento Previsto no Mês:</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
            {formatCurrency(monthRevenueExpected)}
          </span>
        </div>
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-3.5 flex items-center justify-between">
          <span className="text-stone-500 dark:text-stone-400">Legenda de Cores:</span>
          <div className="flex items-center gap-3">
            <span className="text-emerald-600 font-medium">Livre</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-600 font-medium">Confirmada</span>
            <span aria-hidden="true">·</span>
            <span className="text-blue-600 font-medium">Orçamento</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid + Inspection Drawer Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Calendar Grid (2 Cols on lg) */}
        <div className="lg:col-span-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 sm:p-5 shadow-xs">
          
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-stone-500 dark:text-stone-400 pb-2 border-b border-stone-100 dark:border-stone-800">
            <div className="text-amber-700 dark:text-amber-400">Dom</div>
            <div>Seg</div>
            <div>Ter</div>
            <div>Qua</div>
            <div>Qui</div>
            <div>Sex</div>
            <div className="text-amber-700 dark:text-amber-400">Sáb</div>
          </div>

          {/* Grid Cells */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 pt-2">
            
            {/* Empty padding days from previous month */}
            {paddingArray.map(idx => (
              <div 
                key={`pad-${idx}`} 
                className="min-h-[75px] sm:min-h-[90px] rounded-xl border border-stone-100 dark:border-stone-800/40 bg-stone-50/40 dark:bg-stone-950/20 opacity-40"
              />
            ))}

            {/* Days of Current Month */}
            {daysArray.map(day => {
              const dateStr = formatDayString(day);
              const dayBookings = getReservationsForDay(dateStr);
              const isSelected = selectedDateStr === dateStr;
              const isWeekend = new Date(currentYear, currentMonth, day).getDay() === 0 || new Date(currentYear, currentMonth, day).getDay() === 6;
              const hasBooking = dayBookings.length > 0;
              const mainBooking = dayBookings[0];

              return (
                <div
                  key={`day-${day}`}
                  onClick={() => {
                    setSelectedDateStr(dateStr);
                    if (hasBooking) {
                      setSelectedDayRes(mainBooking);
                    } else {
                      setSelectedDayRes(null);
                    }
                  }}
                  className={`min-h-[75px] sm:min-h-[90px] p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-600 ring-2 ring-amber-500/20 dark:border-amber-500'
                      : hasBooking
                      ? 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 hover:border-stone-300'
                      : 'border-stone-100 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 hover:bg-stone-50/60 dark:hover:bg-stone-800/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-mono font-bold ${
                      isWeekend 
                        ? 'text-amber-700 dark:text-amber-400' 
                        : 'text-stone-700 dark:text-stone-300'
                    }`}>
                      {day}
                    </span>

                    {/* Small status dot / availability indicator */}
                    {!hasBooking ? (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium hidden sm:inline">
                        Livre
                      </span>
                    ) : (
                      <span className={`w-2 h-2 rounded-full ${
                        mainBooking.reservationStatus === 'orcamento' 
                          ? 'bg-blue-500' 
                          : 'bg-amber-600'
                      }`} />
                    )}
                  </div>

                  {/* Day Booking Preview */}
                  <div className="mt-1">
                    {hasBooking ? (
                      <div className={`p-1 rounded text-[10px] leading-tight truncate font-medium ${
                        mainBooking.reservationStatus === 'orcamento'
                          ? 'bg-blue-50 text-blue-900 dark:bg-blue-950/60 dark:text-blue-200'
                          : 'bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-200'
                      }`}>
                        <div className="truncate font-semibold">{mainBooking.clientName.split(' ')[0]}</div>
                        <div className="truncate text-[9px] opacity-80">{mainBooking.eventType}</div>
                      </div>
                    ) : (
                      <div className="text-[10px] text-stone-400 dark:text-stone-500 opacity-60 hover:opacity-100 transition-opacity">
                        + Reservar
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

          </div>

        </div>

        {/* Selected Date Details / Action Panel */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="border-b border-stone-100 dark:border-stone-800 pb-3">
            <span className="text-xs text-stone-500 dark:text-stone-400">Data Selecionada</span>
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              {formatDateBR(selectedDateStr)}
            </h3>
          </div>

          {selectedDayRes ? (
            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-semibold text-stone-700 dark:text-stone-300">
                    #{selectedDayRes.code}
                  </span>
                  <span className="font-semibold text-amber-800 dark:text-amber-300 capitalize">
                    {selectedDayRes.reservationStatus}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  {selectedDayRes.clientName}
                </h4>
                <div className="text-stone-600 dark:text-stone-300 mt-1">
                  Evento: <strong>{selectedDayRes.eventType}</strong> ({selectedDayRes.estimatedGuests} convidados)
                </div>
              </div>

              <div className="space-y-2 text-stone-600 dark:text-stone-300">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-stone-400 shrink-0" />
                  <span>Check-in: {selectedDayRes.checkinTime} · Saída: {selectedDayRes.checkoutTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-stone-400 shrink-0" />
                  <span>Telefone: {selectedDayRes.clientPhone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-stone-400 shrink-0" />
                  <span>CPF: {selectedDayRes.clientCpf || 'Não informado'}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-stone-500">Valor Total:</span>
                  <span className="font-mono tabular-nums font-bold text-stone-900 dark:text-stone-100">
                    {formatCurrency(selectedDayRes.totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Saldo a Receber:</span>
                  <span className="font-mono tabular-nums font-bold text-amber-600 dark:text-amber-400">
                    {formatCurrency(selectedDayRes.remainingAmount)}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2 pt-2">
                <a
                  href={generateWhatsAppUrl(
                    selectedDayRes.clientPhone, 
                    `Olá ${selectedDayRes.clientName.split(' ')[0]}! Entrando em contato sobre sua reserva no ${venueConfig.name} para o dia ${formatDateBR(selectedDayRes.startDate)}.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 rounded-lg transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enviar Mensagem no WhatsApp</span>
                </a>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onOpenConfirmation(selectedDayRes)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200 dark:border-emerald-800/60"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Confirmação</span>
                  </button>

                  <button
                    onClick={() => onOpenReceipt(selectedDayRes)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 rounded-lg transition-colors"
                  >
                    <Receipt className="w-3.5 h-3.5 text-stone-500" />
                    <span>Recibo</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onOpenContract(selectedDayRes)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 rounded-lg transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Contrato</span>
                  </button>

                  <button
                    onClick={() => onOpenInspection(selectedDayRes)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 rounded-lg transition-colors"
                  >
                    <ClipboardCheck className="w-3.5 h-3.5" />
                    <span>Vistoria</span>
                  </button>
                </div>

                <button
                  onClick={() => onEditReservation(selectedDayRes)}
                  className="w-full py-2 text-xs font-medium text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg transition-colors"
                >
                  Editar Dados da Reserva
                </button>
              </div>

            </div>
          ) : (
            <div className="py-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  Data Livre & Disponível
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-xs mx-auto">
                  Não há locações agendadas para {formatDateBR(selectedDateStr)}. Você pode criar uma nova reserva agora mesmo.
                </p>
              </div>

              <button
                onClick={() => onOpenNewReservationWithDate(selectedDateStr)}
                className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Reservar esta Data</span>
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
