import React, { useState, useEffect } from 'react';
import { X, Calendar, AlertTriangle, Check, DollarSign, Trash2 } from 'lucide-react';
import { useVenue } from '../../context/VenueContext';
import { Reservation, EventType, RentalCategory, ReservationStatus } from '../../types';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservationToEdit?: Reservation | null;
  initialDate?: string;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  reservationToEdit,
  initialDate
}) => {
  const { 
    areas, 
    venueConfig, 
    additionalItems,
    reservationTypes,
    addReservation, 
    updateReservation,
    deleteReservation,
    isDateAvailable, 
    formatCurrency 
  } = useVenue();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientCpf, setClientCpf] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [eventType, setEventType] = useState<EventType>('Aniversário');
  const [selectedTypeId, setSelectedTypeId] = useState<string>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [rentalCategory, setRentalCategory] = useState<RentalCategory>('diaria_fim_de_semana');
  const [checkinTime, setCheckinTime] = useState(venueConfig.standardCheckin);
  const [checkoutTime, setCheckoutTime] = useState(venueConfig.standardCheckout);
  const [estimatedGuests, setEstimatedGuests] = useState(80);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [includedServices, setIncludedServices] = useState<string[]>([
    'Piscina Aquecida', 
    'Churrasqueira Giratória', 
    'Mesas e Cadeiras', 
    'Taxa de Limpeza Completa'
  ]);
  const [rentalAmount, setRentalAmount] = useState<number>(venueConfig.defaultPricing.singleDayWeekend);
  const [cleaningFee, setCleaningFee] = useState<number>(venueConfig.defaultPricing.cleaningFee);
  const [securityDeposit, setSecurityDeposit] = useState<number>(venueConfig.defaultPricing.securityDeposit);
  const [discount, setDiscount] = useState<number>(0);
  const [advancePaid, setAdvancePaid] = useState<number>(500);
  const [reservationStatus, setReservationStatus] = useState<ReservationStatus>('confirmada');
  const [paymentMethod, setPaymentMethod] = useState('PIX');
  const [notes, setNotes] = useState('');
  const [dateConflictWarning, setDateConflictWarning] = useState(false);

  useEffect(() => {
    if (reservationToEdit) {
      setClientName(reservationToEdit.clientName);
      setClientPhone(reservationToEdit.clientPhone);
      setClientCpf(reservationToEdit.clientCpf || '');
      setClientEmail(reservationToEdit.clientEmail || '');
      setEventType(reservationToEdit.eventType);
      setSelectedTypeId(reservationToEdit.reservationTypeId || '');
      setStartDate(reservationToEdit.startDate);
      setEndDate(reservationToEdit.endDate || reservationToEdit.startDate);
      setRentalCategory(reservationToEdit.rentalCategory);
      setCheckinTime(reservationToEdit.checkinTime);
      setCheckoutTime(reservationToEdit.checkoutTime);
      setEstimatedGuests(reservationToEdit.estimatedGuests);
      setSelectedAreas(reservationToEdit.selectedAreas);
      setIncludedServices(reservationToEdit.includedServices);
      setRentalAmount(reservationToEdit.rentalAmount);
      setCleaningFee(reservationToEdit.cleaningFee);
      setSecurityDeposit(reservationToEdit.securityDeposit);
      setDiscount(reservationToEdit.discount || 0);
      setAdvancePaid(reservationToEdit.advancePaid || 0);
      setReservationStatus(reservationToEdit.reservationStatus);
      setPaymentMethod(reservationToEdit.paymentMethod);
      setNotes(reservationToEdit.notes || '');
    } else {
      // New reservation defaults
      const start = initialDate || '2026-11-21';
      const defaultType = reservationTypes.find(t => t.active) || reservationTypes[0];
      setClientName('');
      setClientPhone('');
      setClientCpf('');
      setClientEmail('');
      setEventType('Aniversário');
      setSelectedTypeId(defaultType?.id || '');
      setStartDate(start);
      setEndDate(start);
      setRentalCategory(
        defaultType?.category === 'pacote' 
          ? 'pacote_fim_de_semana' 
          : defaultType?.category === 'pernoite' 
            ? 'pernoite' 
            : 'diaria_fim_de_semana'
      );
      setCheckinTime(defaultType?.defaultCheckin || venueConfig.standardCheckin);
      setCheckoutTime(defaultType?.defaultCheckout || venueConfig.standardCheckout);
      setEstimatedGuests(defaultType?.maxGuests || 80);
      setSelectedAreas(areas.map(a => a.id));
      setIncludedServices(['Piscina Aquecida', 'Churrasqueira Giratória', 'Mesas e Cadeiras', 'Taxa de Limpeza Completa']);
      setRentalAmount(defaultType?.defaultPrice || venueConfig.defaultPricing.singleDayWeekend);
      setCleaningFee(defaultType?.defaultCleaningFee || venueConfig.defaultPricing.cleaningFee);
      setSecurityDeposit(defaultType?.defaultSecurityDeposit || venueConfig.defaultPricing.securityDeposit);
      setDiscount(0);
      setAdvancePaid(500);
      setReservationStatus('confirmada');
      setPaymentMethod('PIX');
      setNotes('');
    }
  }, [reservationToEdit, initialDate, isOpen, venueConfig, areas, reservationTypes]);

  // Adjust price when selected reservation type changes
  const handleTypeSelect = (typeId: string) => {
    setSelectedTypeId(typeId);
    const found = reservationTypes.find(t => t.id === typeId);
    if (found) {
      setRentalAmount(found.defaultPrice);
      setCleaningFee(found.defaultCleaningFee);
      setSecurityDeposit(found.defaultSecurityDeposit);
      setCheckinTime(found.defaultCheckin);
      setCheckoutTime(found.defaultCheckout);
      if (found.category === 'pacote') {
        setRentalCategory('pacote_fim_de_semana');
      } else if (found.category === 'pernoite') {
        setRentalCategory('pernoite');
      } else if (found.category === 'diaria') {
        setRentalCategory('diaria_fim_de_semana');
      }
      if (startDate && found.durationDays > 1) {
        const d = new Date(startDate + 'T00:00:00');
        d.setDate(d.getDate() + (found.durationDays - 1));
        setEndDate(d.toISOString().split('T')[0]);
      } else if (startDate) {
        setEndDate(startDate);
      }
    }
  };

  // Adjust price when category changes manually
  const handleCategoryChange = (cat: RentalCategory) => {
    setRentalCategory(cat);
    if (!reservationToEdit) {
      if (cat === 'diaria_fim_de_semana') {
        setRentalAmount(venueConfig.defaultPricing.singleDayWeekend);
        setEndDate(startDate);
      } else if (cat === 'diaria_semana') {
        setRentalAmount(venueConfig.defaultPricing.singleDayWeekday);
        setEndDate(startDate);
      } else if (cat === 'pacote_fim_de_semana') {
        setRentalAmount(venueConfig.defaultPricing.weekendFull);
        // If start date is saturday, default end date to sunday
        if (startDate) {
          const d = new Date(startDate + 'T00:00:00');
          d.setDate(d.getDate() + 1);
          setEndDate(d.toISOString().split('T')[0]);
        }
      }
    }
  };

  // Check date conflicts
  useEffect(() => {
    if (startDate) {
      const hasConflict = !isDateAvailable(startDate, reservationToEdit?.id);
      setDateConflictWarning(hasConflict);
    } else {
      setDateConflictWarning(false);
    }
  }, [startDate, endDate, reservationToEdit, isDateAvailable]);

  const totalCalculated = Math.max(0, rentalAmount + cleaningFee - discount);
  const remainingCalculated = Math.max(0, totalCalculated - advancePaid);

  const availableServicesList = [
    'Piscina Aquecida',
    'Churrasqueira Giratória',
    'Salão Climatizado',
    'Mesas e Cadeiras',
    'Taxa de Limpeza Completa',
    'Freezers Horizontais Duplos',
    'Iluminação Cênica Noturna',
    'Projetor & Telão',
    'Choperia Elétrica',
    'Acomodações / Pernoite'
  ];

  const handleToggleArea = (areaId: string) => {
    setSelectedAreas(prev => 
      prev.includes(areaId) ? prev.filter(id => id !== areaId) : [...prev, areaId]
    );
  };

  const handleToggleService = (service: string) => {
    setIncludedServices(prev => 
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim() || !startDate) {
      alert('Por favor, preencha o nome do cliente, telefone e a data do evento.');
      return;
    }

    const payload = {
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientCpf: clientCpf.trim(),
      clientEmail: clientEmail.trim(),
      eventType,
      reservationTypeId: selectedTypeId || undefined,
      startDate,
      endDate: endDate || startDate,
      rentalCategory,
      checkinTime,
      checkoutTime,
      estimatedGuests: Number(estimatedGuests) || 50,
      selectedAreas: selectedAreas.length > 0 ? selectedAreas : areas.map(a => a.id),
      includedServices,
      rentalAmount: Number(rentalAmount) || 0,
      cleaningFee: Number(cleaningFee) || 0,
      securityDeposit: Number(securityDeposit) || 0,
      discount: Number(discount) || 0,
      totalAmount: totalCalculated,
      advancePaid: Number(advancePaid) || 0,
      remainingAmount: remainingCalculated,
      paymentStatus: advancePaid >= totalCalculated && totalCalculated > 0 ? 'totalmente_pago' as const : advancePaid > 0 ? 'sinal_pago' as const : 'pendente' as const,
      reservationStatus,
      paymentMethod,
      notes,
      contractSigned: reservationToEdit?.contractSigned || false,
      contractSignDate: reservationToEdit?.contractSignDate,
      inspectionCheckinDone: reservationToEdit?.inspectionCheckinDone || false,
      inspectionCheckoutDone: reservationToEdit?.inspectionCheckoutDone || false
    };

    if (reservationToEdit) {
      updateReservation(reservationToEdit.id, payload);
    } else {
      addReservation(payload);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 no-print">
      <div className="relative bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl transition-all">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              {reservationToEdit ? `Editar Reserva #${reservationToEdit.code}` : 'Nova Reserva / Orçamento de Aluguel'}
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Cadastre todos os dados do locatário, valores acordados e estrutura inclusa.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Date conflict alert */}
        {dateConflictWarning && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center gap-2.5 text-xs text-amber-900 dark:text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Atenção: Já existe outra reserva agendada para a data selecionada ({startDate}). Verifique a agenda antes de confirmar.</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Section 1: Locatário */}
          <div>
            <h3 className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-3">
              1. Dados do Locatário (Cliente)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                  Nome Completo / Empresa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Mariana Duarte"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                  WhatsApp / Telefone *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="(11) 99123-4567"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                  CPF ou CNPJ (para o Contrato)
                </label>
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  value={clientCpf}
                  onChange={(e) => setClientCpf(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                  E-mail de Contato
                </label>
                <input
                  type="email"
                  placeholder="cliente@email.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Detalhes do Evento e Período */}
          <div>
            <h3 className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-3">
              2. Detalhes da Locação & Calendário
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                  Tipo de Evento
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as EventType)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Aniversário">Aniversário</option>
                  <option value="Casamento">Casamento</option>
                  <option value="Confraternização">Confraternização</option>
                  <option value="Churrasco & Lazer">Churrasco & Lazer</option>
                  <option value="Fim de Semana em Família">Fim de Semana em Família</option>
                  <option value="Corporativo / Workshop">Corporativo / Workshop</option>
                  <option value="Retiro / Religioso">Retiro / Religioso</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                  Tipo de Reserva / Modalidade
                </label>
                <select
                  value={selectedTypeId}
                  onChange={(e) => handleTypeSelect(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                >
                  <option value="">Personalizado / Manual</option>
                  {reservationTypes.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({formatCurrency(t.defaultPrice)}) {!t.active ? '• Pausado' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                  Estimativa de Convidados
                </label>
                <input
                  type="number"
                  min="1"
                  max={venueConfig.maxCapacity}
                  value={estimatedGuests}
                  onChange={(e) => setEstimatedGuests(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                  Data de Início (Check-in) *
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                  Data de Término (Check-out)
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Horário Entrada
                  </label>
                  <input
                    type="time"
                    value={checkinTime}
                    onChange={(e) => setCheckinTime(e.target.value)}
                    className="w-full px-2 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Horário Saída
                  </label>
                  <input
                    type="time"
                    value={checkoutTime}
                    onChange={(e) => setCheckoutTime(e.target.value)}
                    className="w-full px-2 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Selected Reservation Type info badge */}
            {selectedTypeId && (() => {
              const currentType = reservationTypes.find(t => t.id === selectedTypeId);
              if (!currentType) return null;
              return (
                <div className="mt-3 p-2.5 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="font-semibold text-stone-800 dark:text-stone-200">
                      {currentType.name}
                    </span>
                    <span className="text-stone-500 dark:text-stone-400">
                      • Base: <strong className="text-amber-700 dark:text-amber-400 font-mono">{formatCurrency(currentType.defaultPrice)}</strong>
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-600 dark:text-stone-300">
                    <span>Entrada: <strong>{currentType.defaultCheckin}</strong></span>
                    <span>Saída: <strong>{currentType.defaultCheckout}</strong></span>
                    <span>Duração: <strong>{currentType.durationDays} dia(s)</strong></span>
                    <span>Pernoite: <strong>{currentType.allowsOvernight ? 'Sim' : 'Não'}</strong></span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Section 3: Áreas e Comodidades Inclusas */}
          <div>
            <h3 className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-3">
              3. Ambientes Liberados do Espaço Órion
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              {areas.map((area) => (
                <button
                  type="button"
                  key={area.id}
                  onClick={() => handleToggleArea(area.id)}
                  className={`p-2.5 rounded-lg border text-left transition-colors flex items-center justify-between ${
                    selectedAreas.includes(area.id)
                      ? 'border-amber-600 bg-amber-50/70 dark:bg-amber-950/40 text-stone-900 dark:text-stone-100 font-medium'
                      : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                  }`}
                >
                  <span className="truncate pr-1">{area.name.split('&')[0]}</span>
                  {selectedAreas.includes(area.id) && <Check className="w-4 h-4 text-amber-600 shrink-0" />}
                </button>
              ))}
            </div>

            <h4 className="text-xs font-semibold text-stone-700 dark:text-stone-300 mt-4 mb-2">
              Comodidades & Itens Inclusos
            </h4>
            <div className="flex flex-wrap gap-2 text-xs">
              {availableServicesList.map((srv) => (
                <button
                  type="button"
                  key={srv}
                  onClick={() => handleToggleService(srv)}
                  className={`px-3 py-1.5 rounded-lg border transition-colors ${
                    includedServices.includes(srv)
                      ? 'border-amber-500 bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-medium'
                      : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  {srv}
                </button>
              ))}
            </div>

            {/* Itens Adicionais Cadastrados */}
            {additionalItems.filter(i => i.active).length > 0 && (
              <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-700">
                <h4 className="text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2 flex items-center justify-between">
                  <span>Itens Adicionais & Opcionais Disponíveis</span>
                  <span className="text-[11px] text-amber-700 dark:text-amber-400 font-normal">
                    (Clique para somar ao aluguel)
                  </span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {additionalItems.filter(i => i.active).map((addon) => {
                    const tag = `+ ${addon.name} (${formatCurrency(addon.price)})`;
                    const isSelected = includedServices.includes(tag);

                    return (
                      <button
                        type="button"
                        key={addon.id}
                        onClick={() => {
                          if (isSelected) {
                            setIncludedServices(prev => prev.filter(s => s !== tag));
                            setRentalAmount(prev => Math.max(0, prev - addon.price));
                          } else {
                            setIncludedServices(prev => [...prev, tag]);
                            setRentalAmount(prev => prev + addon.price);
                          }
                        }}
                        className={`p-2 rounded-lg border text-left transition-colors flex items-center justify-between ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold'
                            : 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <span className="block truncate">{addon.name}</span>
                          <span className="text-[10px] text-stone-400 font-normal block">{addon.category}</span>
                        </div>
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                          {formatCurrency(addon.price)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Financeiro da Locação */}
          <div className="bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 rounded-xl p-4">
            <h3 className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-3 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4" />
              <span>4. Composição Financeira & Pagamentos</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                  Valor da Diária (R$)
                </label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={rentalAmount}
                  onChange={(e) => setRentalAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                  Taxa de Limpeza (R$)
                </label>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={cleaningFee}
                  onChange={(e) => setCleaningFee(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                  Caução / Garantia (R$)
                </label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={securityDeposit}
                  onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                  Desconto Aplicado (R$)
                </label>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                  Sinal / Entrada Paga (R$)
                </label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={advancePaid}
                  onChange={(e) => setAdvancePaid(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                  Forma de Pagamento
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                >
                  <option value="PIX">PIX</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                  <option value="Transferência Bancária">Transferência Bancária</option>
                  <option value="Dinheiro">Dinheiro</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                  Status da Reserva
                </label>
                <select
                  value={reservationStatus}
                  onChange={(e) => setReservationStatus(e.target.value as ReservationStatus)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium"
                >
                  <option value="orcamento">Orçamento / Pré-reserva</option>
                  <option value="confirmada">Confirmada (Sinal Pago)</option>
                  <option value="em_andamento">Em Andamento (No local)</option>
                  <option value="concluida">Concluída & Finalizada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>

              <div className="flex flex-col justify-end">
                <span className="text-stone-500 dark:text-stone-400 text-[11px] block">Total Líquido:</span>
                <span className="text-base font-bold text-stone-900 dark:text-stone-100 font-mono tabular-nums">
                  {formatCurrency(totalCalculated)}
                </span>
                <span className="text-amber-600 dark:text-amber-400 text-xs font-semibold font-mono tabular-nums">
                  Saldo Restante: {formatCurrency(remainingCalculated)}
                </span>
              </div>
            </div>
          </div>

          {/* Section 5: Observações */}
          <div>
            <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
              Observações Especiais, Regras Específicas ou Pedidos do Locatário
            </label>
            <textarea
              rows={2}
              placeholder="Ex: Cerimônia ao ar livre às 16h, cliente trará pula-pula inflável..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-stone-200 dark:border-stone-800">
            {reservationToEdit ? (
              <div>
                {!showDeleteConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors border border-transparent hover:border-red-200 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Excluir Reserva</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 p-1.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg text-xs">
                    <span className="font-semibold text-red-700 dark:text-red-300 pl-1">Excluir definitivamente?</span>
                    <button
                      type="button"
                      onClick={() => {
                        deleteReservation(reservationToEdit.id);
                        onClose();
                      }}
                      className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-xs transition-colors cursor-pointer"
                    >
                      Sim, Excluir
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-2 py-1 text-stone-600 dark:text-stone-300 hover:underline text-xs"
                    >
                      Não
                    </button>
                  </div>
                )}
              </div>
            ) : <div />}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-sm cursor-pointer"
              >
                {reservationToEdit ? 'Salvar Alterações' : 'Confirmar e Salvar Reserva'}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
