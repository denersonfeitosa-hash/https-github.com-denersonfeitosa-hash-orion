import React from 'react';
import { 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  MessageCircle, 
  FileText, 
  ClipboardCheck, 
  PlusCircle, 
  AlertCircle,
  CheckCircle2,
  CalendarCheck2,
  Receipt,
  CheckCircle,
  Building2
} from 'lucide-react';
import { useVenue } from '../../context/VenueContext';
import { Reservation } from '../../types';

interface DashboardViewProps {
  onOpenNewReservation: () => void;
  onOpenContract: (res: Reservation) => void;
  onOpenInspection: (res: Reservation) => void;
  onEditReservation: (res: Reservation) => void;
  onNavigateToCalendar: () => void;
  onNavigateToFinance: () => void;
  onNavigateToCompany?: () => void;
  onOpenReceipt: (res: Reservation) => void;
  onOpenConfirmation: (res: Reservation) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenNewReservation,
  onOpenContract,
  onOpenInspection,
  onEditReservation,
  onNavigateToCalendar,
  onNavigateToFinance,
  onNavigateToCompany,
  onOpenReceipt,
  onOpenConfirmation
}) => {
  const { 
    reservations, 
    transactions, 
    formatCurrency, 
    formatDateBR, 
    generateWhatsAppUrl,
    venueConfig 
  } = useVenue();

  const todayStr = '2026-11-04'; // Aligned with current environment date
  
  // Find current day event
  const currentEvent = reservations.find(r => 
    r.reservationStatus !== 'cancelada' && 
    todayStr >= r.startDate && 
    todayStr <= (r.endDate || r.startDate)
  );

  // Filter current month (November 2026)
  const currentMonthPrefix = '2026-11';
  const monthReservations = reservations.filter(r => 
    r.reservationStatus !== 'cancelada' && 
    r.startDate.startsWith(currentMonthPrefix)
  );

  // Financial calculations
  const totalReceivedMonth = transactions
    .filter(t => t.type === 'receita' && t.status === 'pago' && t.date.startsWith(currentMonthPrefix))
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPendingToReceive = reservations
    .filter(r => r.reservationStatus === 'confirmada' && r.remainingAmount > 0)
    .reduce((sum, r) => sum + r.remainingAmount, 0);

  const upcomingReservations = [...reservations]
    .filter(r => r.reservationStatus !== 'cancelada' && r.startDate >= todayStr)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(0, 5);

  // Weekend occupancy for November 2026
  const weekendsInMonth = [
    { label: '07 - 08 Nov', start: '2026-11-07', end: '2026-11-08' },
    { label: '14 - 15 Nov', start: '2026-11-14', end: '2026-11-15' },
    { label: '21 - 22 Nov', start: '2026-11-21', end: '2026-11-22' },
    { label: '28 - 29 Nov', start: '2026-11-28', end: '2026-11-29' }
  ];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Venue Status Banner */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 sm:p-6 transition-colors">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              currentEvent 
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400' 
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
            }`}>
              {currentEvent ? <CalendarCheck2 className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                <span>Status da Propriedade</span>
                <span aria-hidden="true">·</span>
                <span>{formatDateBR(todayStr)}</span>
              </div>
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                {currentEvent ? (
                  <span>Espaço Ocupado: {currentEvent.clientName} ({currentEvent.eventType})</span>
                ) : (
                  <span>Espaço Livre & Disponível Hoje</span>
                )}
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                {currentEvent ? (
                  <span>Check-in: {currentEvent.checkinTime} · Saída prevista: {currentEvent.checkoutTime} ({formatDateBR(currentEvent.endDate)})</span>
                ) : (
                  <span>Nenhum evento em andamento no momento. Pronto para vistorias, manutenções ou novas reservas.</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={onOpenNewReservation}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Agendar Nova Reserva</span>
            </button>
            <button
              onClick={onNavigateToCalendar}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>Ver Calendário</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid (Strict Tabular Figures, No Pill Sandwiches) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 transition-colors">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs">
            <span>Faturamento no Mês</span>
            <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 font-mono tabular-nums">
              {formatCurrency(totalReceivedMonth)}
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400 mt-1 flex items-center gap-1.5">
              <span>Recebimentos confirmados</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Novembro 2026</span>
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 transition-colors">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs">
            <span>Saldo a Receber</span>
            <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 font-mono tabular-nums">
              {formatCurrency(totalPendingToReceive)}
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400 mt-1 flex items-center gap-1.5">
              <span>Saldos de reservas confirmadas</span>
            </div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 transition-colors">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs">
            <span>Reservas no Mês</span>
            <CalendarCheck2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 font-mono tabular-nums">
              {monthReservations.length} eventos
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400 mt-1 flex items-center gap-1.5">
              <span>Capacidade máx: {venueConfig.maxCapacity} pessoas</span>
            </div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 transition-colors">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs">
            <span>Próximo Check-in</span>
            <Clock className="w-4 h-4 text-stone-500 dark:text-stone-400" />
          </div>
          <div className="mt-3">
            {upcomingReservations.length > 0 ? (
              <>
                <div className="text-lg font-bold tracking-tight text-stone-900 dark:text-stone-100 truncate">
                  {formatDateBR(upcomingReservations[0].startDate)}
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-400 mt-1 truncate">
                  {upcomingReservations[0].clientName}
                </div>
              </>
            ) : (
              <>
                <div className="text-lg font-bold text-stone-900 dark:text-stone-100">
                  Nenhum
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Agenda livre
                </div>
              </>
            )}
          </div>
        </div>

      </div>

      {/* Main Split: Upcoming Bookings & Weekend Availability Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Upcoming Reservations Table / Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Próximos Eventos & Locações
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Acompanhe o cronograma de check-ins, contratos assinados e pendências de pagamento.
              </p>
            </div>
            <button
              onClick={() => onNavigateToCalendar()}
              className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline"
            >
              Ver todas as reservas &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {upcomingReservations.length === 0 ? (
              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-8 text-center">
                <AlertCircle className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                <h4 className="text-sm font-semibold text-stone-800 dark:text-stone-200">Nenhum evento agendado</h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Cadastre uma nova reserva para preencher os próximos finais de semana.
                </p>
                <button
                  onClick={onOpenNewReservation}
                  className="mt-4 px-4 py-2 text-xs font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700"
                >
                  Criar Reserva
                </button>
              </div>
            ) : (
              upcomingReservations.map((res) => {
                const message = `Olá ${res.clientName.split(' ')[0]}! Tudo bem? Aqui é da administração do ${venueConfig.name}. Estamos confirmando os preparativos para o seu evento (${res.eventType}) no dia ${formatDateBR(res.startDate)}. Horário de check-in: ${res.checkinTime}. Se precisar de qualquer informação, estamos à disposição!`;
                const whatsappUrl = generateWhatsAppUrl(res.clientPhone, message);

                return (
                  <div
                    key={res.id}
                    className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4 sm:p-5 transition-all hover:border-stone-300 dark:hover:border-stone-700"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800/80">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                          <span className="font-mono text-stone-700 dark:text-stone-300 font-semibold">{res.code}</span>
                          <span aria-hidden="true">·</span>
                          <span>{res.eventType}</span>
                          <span aria-hidden="true">·</span>
                          <span>{res.estimatedGuests} convidados</span>
                        </div>
                        <h4 className="text-base font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                          {res.clientName}
                        </h4>
                      </div>

                      <div className="text-left sm:text-right">
                        <div className="text-xs text-stone-500 dark:text-stone-400">Data do Evento</div>
                        <div className="text-sm font-bold text-stone-900 dark:text-stone-100 font-mono">
                          {formatDateBR(res.startDate)}
                          {res.endDate && res.endDate !== res.startDate && ` a ${formatDateBR(res.endDate)}`}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="text-stone-600 dark:text-stone-300">
                          <span className="text-stone-400">Horários:</span> {res.checkinTime} às {res.checkoutTime}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-stone-400">Financeiro:</span>
                          <span className="font-mono tabular-nums font-semibold text-stone-900 dark:text-stone-100">
                            {formatCurrency(res.totalAmount)}
                          </span>
                          {res.remainingAmount > 0 ? (
                            <span className="text-amber-600 dark:text-amber-400 font-medium font-mono tabular-nums">
                              (Resta: {formatCurrency(res.remainingAmount)})
                            </span>
                          ) : (
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                              (Quitado)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto pt-2 sm:pt-0">
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 rounded-lg transition-colors"
                          title="Enviar WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>

                        <button
                          onClick={() => onOpenConfirmation(res)}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200 dark:border-emerald-800/60"
                          title="Comprovante de Confirmação"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Confirmação</span>
                        </button>

                        <button
                          onClick={() => onOpenReceipt(res)}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 rounded-lg transition-colors"
                          title="Recibo de Pagamento"
                        >
                          <Receipt className="w-3.5 h-3.5 text-stone-500" />
                          <span>Recibo</span>
                        </button>

                        <button
                          onClick={() => onOpenContract(res)}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 rounded-lg transition-colors"
                          title="Visualizar Contrato"
                        >
                          <FileText className="w-3.5 h-3.5 text-stone-500" />
                          <span>Contrato</span>
                        </button>

                        <button
                          onClick={() => onOpenInspection(res)}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 rounded-lg transition-colors"
                          title="Ficha de Vistoria"
                        >
                          <ClipboardCheck className="w-3.5 h-3.5 text-stone-500" />
                          <span>Vistoria</span>
                        </button>

                        <button
                          onClick={() => onEditReservation(res)}
                          className="px-2 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg transition-colors"
                        >
                          Editar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Col: Weekend Occupancy & Fast Financial Overview */}
        <div className="space-y-6">
          
          {/* Weekends in current month */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 transition-colors">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-1">
              Ocupação dos Finais de Semana
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
              Novembro de 2026
            </p>

            <div className="space-y-3">
              {weekendsInMonth.map((wk, idx) => {
                const isBooked = reservations.some(r => 
                  r.reservationStatus !== 'cancelada' && 
                  ((wk.start >= r.startDate && wk.start <= (r.endDate || r.startDate)) ||
                   (wk.end >= r.startDate && wk.end <= (r.endDate || r.startDate)))
                );

                const booking = reservations.find(r => 
                  r.reservationStatus !== 'cancelada' && 
                  ((wk.start >= r.startDate && wk.start <= (r.endDate || r.startDate)) ||
                   (wk.end >= r.startDate && wk.end <= (r.endDate || r.startDate)))
                );

                return (
                  <div 
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg border border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 text-xs"
                  >
                    <div>
                      <span className="font-semibold text-stone-800 dark:text-stone-200">{wk.label}</span>
                      {booking ? (
                        <div className="text-[11px] text-stone-500 dark:text-stone-400 truncate max-w-[140px]">
                          {booking.clientName.split(' ')[0]} · {booking.eventType}
                        </div>
                      ) : (
                        <div className="text-[11px] text-emerald-600 dark:text-emerald-400">
                          Data Livre para Locação
                        </div>
                      )}
                    </div>

                    <div>
                      {isBooked ? (
                        <span className="text-amber-800 dark:text-amber-300 font-medium">
                          Reservado
                        </span>
                      ) : (
                        <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                          Disponível
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={onNavigateToCalendar}
              className="w-full mt-4 py-2 text-xs font-semibold text-center text-stone-600 dark:text-stone-300 hover:text-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
            >
              Abrir Mapa Completo do Calendário
            </button>
          </div>

          {/* Quick Cash Flow Summary */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Controle de Caixa do Espaço
              </h3>
              <button
                onClick={onNavigateToFinance}
                className="text-xs text-amber-600 hover:underline font-medium"
              >
                Detalhes
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-stone-100 dark:border-stone-800">
                <span className="text-stone-500 dark:text-stone-400">Receitas Recebidas</span>
                <span className="font-mono tabular-nums font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(totalReceivedMonth)}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-stone-100 dark:border-stone-800">
                <span className="text-stone-500 dark:text-stone-400">Despesas Operacionais</span>
                <span className="font-mono tabular-nums font-semibold text-stone-700 dark:text-stone-300">
                  {formatCurrency(
                    transactions
                      .filter(t => t.type === 'despesa' && t.date.startsWith(currentMonthPrefix))
                      .reduce((sum, t) => sum + t.amount, 0)
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 pt-2">
                <span className="font-semibold text-stone-800 dark:text-stone-200">Resultado Líquido</span>
                <span className="font-mono tabular-nums font-bold text-base text-stone-900 dark:text-stone-100">
                  {formatCurrency(
                    totalReceivedMonth - 
                    transactions
                      .filter(t => t.type === 'despesa' && t.date.startsWith(currentMonthPrefix))
                      .reduce((sum, t) => sum + t.amount, 0)
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Company Profile & Logo Card */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              {venueConfig.logoUrl ? (
                <img 
                  src={venueConfig.logoUrl} 
                  alt={venueConfig.name} 
                  className="w-10 h-10 object-contain rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 p-0.5"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-lg shrink-0">
                  <Building2 className="w-5 h-5 text-amber-600" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
                  {venueConfig.name}
                </h3>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 font-mono truncate">
                  CNPJ: {venueConfig.cnpj}
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-400 mb-3">
              {venueConfig.logoUrl 
                ? 'Logotipo oficial e dados cadastrais ativos nos relatórios e contratos.' 
                : 'Cadastre o logotipo e dados fiscais do seu espaço para personalizar relatórios, recibos e contratos.'}
            </p>

            {onNavigateToCompany && (
              <button
                onClick={onNavigateToCompany}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 rounded-lg border border-amber-200 dark:border-amber-800 transition-colors"
              >
                <Building2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Gerenciar Dados da Empresa & Logo</span>
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
