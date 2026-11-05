import React, { useState } from 'react';
import { 
  Search, 
  PlusCircle, 
  FileText, 
  ClipboardCheck, 
  MessageCircle, 
  Edit3, 
  Trash2, 
  Filter,
  Receipt,
  CheckCircle
} from 'lucide-react';
import { useVenue } from '../../context/VenueContext';
import { Reservation, ReservationStatus } from '../../types';

interface ReservationsViewProps {
  onOpenNewReservation: () => void;
  onOpenContract: (res: Reservation) => void;
  onOpenInspection: (res: Reservation) => void;
  onEditReservation: (res: Reservation) => void;
  onOpenReceipt: (res: Reservation) => void;
  onOpenConfirmation: (res: Reservation) => void;
}

export const ReservationsView: React.FC<ReservationsViewProps> = ({
  onOpenNewReservation,
  onOpenContract,
  onOpenInspection,
  onEditReservation,
  onOpenReceipt,
  onOpenConfirmation
}) => {
  const { 
    reservations, 
    deleteReservation, 
    formatCurrency, 
    formatDateBR, 
    generateWhatsAppUrl,
    venueConfig 
  } = useVenue();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ReservationStatus | 'pending_payment'>('all');

  const filteredReservations = reservations.filter(r => {
    // Status filter
    if (statusFilter === 'pending_payment' && r.remainingAmount <= 0) return false;
    if (statusFilter !== 'all' && statusFilter !== 'pending_payment' && r.reservationStatus !== statusFilter) return false;

    // Search filter
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      r.clientName.toLowerCase().includes(term) ||
      r.code.toLowerCase().includes(term) ||
      r.clientPhone.includes(term) ||
      r.eventType.toLowerCase().includes(term) ||
      (r.clientCpf && r.clientCpf.includes(term))
    );
  });

  const [reservationToDelete, setReservationToDelete] = useState<Reservation | null>(null);
  const [deleteSuccessToast, setDeleteSuccessToast] = useState<string | null>(null);

  const confirmDelete = () => {
    if (!reservationToDelete) return;
    const code = reservationToDelete.code;
    deleteReservation(reservationToDelete.id);
    setReservationToDelete(null);
    setDeleteSuccessToast(`Reserva #${code} excluída com sucesso!`);
    setTimeout(() => setDeleteSuccessToast(null), 4000);
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
            Reservas & Locações do Espaço
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Gerencie datas, contratos de aluguel, recebimento de sinais e termos de vistoria.
          </p>
        </div>

        <button
          onClick={onOpenNewReservation}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Nova Reserva / Orçamento</span>
        </button>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por cliente, código, telefone ou tipo de evento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Segmented Filter Control */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-lg overflow-x-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                statusFilter === 'all'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Todas ({reservations.length})
            </button>
            <button
              onClick={() => setStatusFilter('confirmada')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                statusFilter === 'confirmada'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Confirmadas ({reservations.filter(r => r.reservationStatus === 'confirmada').length})
            </button>
            <button
              onClick={() => setStatusFilter('orcamento')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                statusFilter === 'orcamento'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Orçamentos ({reservations.filter(r => r.reservationStatus === 'orcamento').length})
            </button>
            <button
              onClick={() => setStatusFilter('pending_payment')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                statusFilter === 'pending_payment'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Saldo Pendente ({reservations.filter(r => r.remainingAmount > 0).length})
            </button>
          </div>

        </div>
      </div>

      {/* Reservations List */}
      <div className="space-y-4">
        {filteredReservations.length === 0 ? (
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-12 text-center">
            <Filter className="w-10 h-10 text-stone-400 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-200">
              Nenhuma reserva encontrada
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm mx-auto">
              Não encontramos nenhuma locação com os filtros ou termo de busca informado.
            </p>
            <button
              onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
              className="mt-4 px-4 py-2 text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 rounded-lg hover:bg-stone-200"
            >
              Limpar Filtros
            </button>
          </div>
        ) : (
          filteredReservations.map((res) => {
            const isFullyPaid = res.remainingAmount <= 0;
            const message = `Olá ${res.clientName.split(' ')[0]}! Aqui é da administração do ${venueConfig.name}. Segue a confirmação da sua locação (${res.code}) para o dia ${formatDateBR(res.startDate)}. Saldo restante: ${formatCurrency(res.remainingAmount)}. Qualquer dúvida, conte conosco!`;
            const whatsappUrl = generateWhatsAppUrl(res.clientPhone, message);

            return (
              <div
                key={res.id}
                className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 hover:border-stone-300 dark:hover:border-stone-700 transition-all"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
                  
                  {/* Left: Code, Client & Event */}
                  <div>
                    <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                      <span className="font-mono font-semibold text-stone-700 dark:text-stone-300">{res.code}</span>
                      <span aria-hidden="true">·</span>
                      <span>{res.eventType}</span>
                      <span aria-hidden="true">·</span>
                      <span>Criada em {formatDateBR(res.createdAt)}</span>
                    </div>

                    <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mt-1">
                      {res.clientName}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600 dark:text-stone-400 mt-1">
                      <span>Tel: {res.clientPhone}</span>
                      {res.clientEmail && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{res.clientEmail}</span>
                        </>
                      )}
                      <span aria-hidden="true">·</span>
                      <span>{res.estimatedGuests} convidados</span>
                    </div>
                  </div>

                  {/* Right: Dates & Status */}
                  <div className="text-left md:text-right">
                    <div className="text-xs text-stone-500 dark:text-stone-400">Período da Locação</div>
                    <div className="text-sm font-bold text-stone-900 dark:text-stone-100 font-mono mt-0.5">
                      {formatDateBR(res.startDate)}
                      {res.endDate && res.endDate !== res.startDate && ` a ${formatDateBR(res.endDate)}`}
                    </div>
                    <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                      Check-in: {res.checkinTime} · Saída: {res.checkoutTime}
                    </div>
                  </div>

                </div>

                {/* Middle details: Financial breakdown & services */}
                <div className="py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs border-b border-stone-100 dark:border-stone-800">
                  
                  <div>
                    <span className="text-stone-400 block mb-1">Valor Total da Locação</span>
                    <span className="font-mono tabular-nums text-sm font-bold text-stone-900 dark:text-stone-100">
                      {formatCurrency(res.totalAmount)}
                    </span>
                    <span className="text-stone-500 dark:text-stone-400 block text-[11px] mt-0.5">
                      (Diária: {formatCurrency(res.rentalAmount)} + Limpeza: {formatCurrency(res.cleaningFee)})
                    </span>
                  </div>

                  <div>
                    <span className="text-stone-400 block mb-1">Pagamento & Saldo</span>
                    <div className="font-mono tabular-nums">
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        Sinal: {formatCurrency(res.advancePaid)}
                      </span>
                    </div>
                    {res.remainingAmount > 0 ? (
                      <span className="font-mono tabular-nums text-amber-600 dark:text-amber-400 font-bold block mt-0.5">
                        Saldo a receber: {formatCurrency(res.remainingAmount)}
                      </span>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium block mt-0.5">
                        Totalmente Quitado
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-stone-400 block mb-1">Status Operacional</span>
                    <div className="space-y-0.5">
                      <div className="text-stone-700 dark:text-stone-300">
                        Situação: <strong className="capitalize">{res.reservationStatus}</strong>
                      </div>
                      <div className="text-stone-500 dark:text-stone-400">
                        Contrato: {res.contractSigned ? '✓ Assinado' : 'Pendente de envio'}
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-stone-400 block mb-1">Vistoria do Espaço</span>
                    <div className="space-y-0.5">
                      <div className="text-stone-700 dark:text-stone-300">
                        Check-in: {res.inspectionCheckinDone ? '✓ Realizada' : 'Pendente'}
                      </div>
                      <div className="text-stone-500 dark:text-stone-400">
                        Caução: {formatCurrency(res.securityDeposit)}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Bottom Action Strip */}
                <div className="pt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                  
                  <div className="text-stone-500 dark:text-stone-400 text-[11px] truncate max-w-md">
                    {res.notes ? `Obs: ${res.notes}` : 'Nenhuma observação cadastrada.'}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    
                    {/* WhatsApp */}
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-2.5 py-1.5 font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 rounded-lg transition-colors"
                      title="Enviar WhatsApp com dados da reserva"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>

                    {/* Confirmação de Agendamento */}
                    <button
                      onClick={() => onOpenConfirmation(res)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200 dark:border-emerald-800/60"
                      title="Visualizar ou Imprimir Comprovante de Agendamento"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Confirmação</span>
                    </button>

                    {/* Recibo de Pagamento */}
                    <button
                      onClick={() => onOpenReceipt(res)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 font-medium text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors"
                      title="Emitir Recibo de Pagamento (Sinal ou Quitação)"
                    >
                      <Receipt className="w-3.5 h-3.5 text-stone-500" />
                      <span>Recibo</span>
                    </button>

                    {/* Contrato */}
                    <button
                      onClick={() => onOpenContract(res)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 font-medium text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors"
                      title="Visualizar ou Imprimir Contrato"
                    >
                      <FileText className="w-3.5 h-3.5 text-stone-500" />
                      <span>Contrato</span>
                    </button>

                    {/* Vistoria */}
                    <button
                      onClick={() => onOpenInspection(res)}
                      className="flex items-center gap-1.5 px-3 py-1.5 font-medium text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors"
                      title="Abrir Termo de Vistoria de Entrada/Saída"
                    >
                      <ClipboardCheck className="w-3.5 h-3.5 text-stone-500" />
                      <span>Vistoria</span>
                    </button>

                    {/* Editar */}
                    <button
                      onClick={() => onEditReservation(res)}
                      className="flex items-center gap-1.5 px-3 py-1.5 font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>

                    {/* Excluir */}
                    <button
                      type="button"
                      onClick={() => setReservationToDelete(res)}
                      className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                      title="Excluir Reserva"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </div>

                </div>

              </div>
            );
          })
        )}
      </div>

      {/* In-App Toast */}
      {deleteSuccessToast && (
        <div className="fixed top-20 right-6 z-50 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-in fade-in duration-300">
          <Trash2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span className="text-xs font-semibold">{deleteSuccessToast}</span>
        </div>
      )}

      {/* In-App Delete Confirmation Modal (Zero reliance on window.confirm) */}
      {reservationToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 no-print">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                  Excluir Reserva #{reservationToDelete.code}?
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Cliente: <strong className="text-stone-700 dark:text-stone-300">{reservationToDelete.clientName}</strong>
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-stone-500">Data do Evento:</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">{formatDateBR(reservationToDelete.startDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Tipo de Evento:</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">{reservationToDelete.eventType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Valor Total:</span>
                <span className="font-mono font-bold text-amber-700 dark:text-amber-400">{formatCurrency(reservationToDelete.totalAmount)}</span>
              </div>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Esta ação removerá a reserva da agenda do espaço e cancelará todos os lançamentos financeiros vinculados a ela. Esta ação é definitiva.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setReservationToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                Sim, Excluir Reserva
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
