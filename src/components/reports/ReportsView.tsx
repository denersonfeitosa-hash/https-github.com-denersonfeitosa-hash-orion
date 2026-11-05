import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Printer, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  Filter, 
  CheckCircle2, 
  Clock, 
  PieChart, 
  BarChart3,
  Download,
  Loader2,
  Check
} from 'lucide-react';
import { useVenue } from '../../context/VenueContext';
import { downloadElementAsPdf, printElementAsPdf } from '../../utils/pdfGenerator';

export const ReportsView: React.FC = () => {
  const { 
    transactions, 
    reservations, 
    venueConfig, 
    formatCurrency, 
    formatDateBR 
  } = useVenue();

  const [reportType, setReportType] = useState<'finance' | 'occupancy'>('finance');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('2026-11'); // November 2026 default

  // Filter transactions by period
  const filteredTransactions = transactions.filter(t => {
    if (selectedPeriod === 'all') return true;
    return t.date.startsWith(selectedPeriod);
  });

  // Filter reservations by period
  const filteredReservations = reservations.filter(r => {
    if (r.reservationStatus === 'cancelada') return false;
    if (selectedPeriod === 'all') return true;
    return r.startDate.startsWith(selectedPeriod);
  });

  // Financial calculations
  const totalRevenuesPaid = filteredTransactions
    .filter(t => t.type === 'receita' && t.status === 'pago')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpensesPaid = filteredTransactions
    .filter(t => t.type === 'despesa' && t.status === 'pago')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalRevenuesPaid - totalExpensesPaid;

  const totalFutureReceivables = filteredTransactions
    .filter(t => t.type === 'receita' && t.status === 'previsto')
    .reduce((sum, t) => sum + t.amount, 0);

  // Group revenues by category
  const revenueCategories: Record<string, number> = {};
  filteredTransactions
    .filter(t => t.type === 'receita' && t.status === 'pago')
    .forEach(t => {
      revenueCategories[t.category] = (revenueCategories[t.category] || 0) + t.amount;
    });

  // Group expenses by category
  const expenseCategories: Record<string, number> = {};
  filteredTransactions
    .filter(t => t.type === 'despesa' && t.status === 'pago')
    .forEach(t => {
      expenseCategories[t.category] = (expenseCategories[t.category] || 0) + t.amount;
    });

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'sinal_reserva': return 'Sinais de Reserva';
      case 'quitacao_reserva': return 'Quitação de Locações';
      case 'taxa_limpeza': return 'Taxas de Limpeza';
      case 'hora_extra': return 'Horas Adicionais';
      case 'manutencao_piscina': return 'Piscina & Produtos Químicos';
      case 'jardinagem': return 'Jardinagem & Poda';
      case 'produtos_limpeza': return 'Produtos de Higiene e Limpeza';
      case 'energia_agua': return 'Energia Elétrica & Água';
      case 'reparos': return 'Manutenção Predial & Reparos';
      default: return 'Outros';
    }
  };

  const periodLabel = 
    selectedPeriod === '2026-11' ? 'Novembro de 2026' :
    selectedPeriod === '2026-10' ? 'Outubro de 2026' :
    selectedPeriod === '2026-12' ? 'Dezembro de 2026' :
    selectedPeriod === '2026' ? 'Ano Completo de 2026' : 'Histórico Consolidado';

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const getReportFilenames = () => {
    const cleanName = venueConfig.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const filename = reportType === 'finance' 
      ? `relatorio_financeiro_${selectedPeriod}_${cleanName}.pdf`
      : `relatorio_ocupacao_${selectedPeriod}_${cleanName}.pdf`;

    const title = reportType === 'finance'
      ? `Demonstrativo Financeiro - ${periodLabel} - ${venueConfig.name}`
      : `Relatório de Ocupação - ${periodLabel} - ${venueConfig.name}`;

    return { filename, title };
  };

  const handleDownloadPdf = async () => {
    if (!reportRef.current) return;
    setIsGeneratingPdf(true);
    setStatusMessage(null);

    const { filename, title } = getReportFilenames();
    const success = await downloadElementAsPdf(reportRef.current, filename, { pdfTitle: title });
    setIsGeneratingPdf(false);

    if (success) {
      setStatusMessage(`Arquivo A4 (${filename}) baixado com sucesso!`);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const handlePrint = async () => {
    if (!reportRef.current) return;
    setIsPrinting(true);
    setStatusMessage(null);

    const { filename, title } = getReportFilenames();
    const result = await printElementAsPdf(reportRef.current, filename, { pdfTitle: title });
    setIsPrinting(false);

    setStatusMessage(result.message);
    setTimeout(() => setStatusMessage(null), 5000);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Toast Notification */}
      {statusMessage && (
        <div className="fixed top-20 right-6 z-50 bg-stone-900 text-white dark:bg-amber-600 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-in fade-in duration-300 border border-stone-700">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 dark:text-white" />
          <span className="text-xs font-semibold">{statusMessage}</span>
        </div>
      )}

      {/* Top Header & Report Actions (Hidden on print) */}
      <div className="no-print flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-600" />
            <span>Relatórios Gerenciais & Exportação em PDF</span>
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Gere demonstrativos contábeis de receitas e despesas e relatórios de ocupação prontos para download em PDF.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-75 rounded-lg transition-colors shadow-sm cursor-pointer"
            title="Gerar e baixar arquivo PDF no dispositivo"
          >
            {isGeneratingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>{isGeneratingPdf ? 'Gerando Arquivo PDF...' : 'Baixar Arquivo PDF (.pdf)'}</span>
          </button>

          <button
            onClick={handlePrint}
            disabled={isPrinting || isGeneratingPdf}
            className="flex items-center gap-2 px-3 py-2.5 text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors cursor-pointer disabled:opacity-60"
            title="Imprimir relatório formatado para folha A4"
          >
            {isPrinting ? <Loader2 className="w-4 h-4 animate-spin text-amber-600" /> : <Printer className="w-4 h-4" />}
            <span>{isPrinting ? 'Preparando Impressão...' : 'Imprimir'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Mode Bar (Hidden on print) */}
      <div className="no-print bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        {/* Report Sub-tabs */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-lg text-xs">
          <button
            onClick={() => setReportType('finance')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
              reportType === 'finance'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-bold shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            Balancete de Receitas e Despesas
          </button>
          <button
            onClick={() => setReportType('occupancy')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
              reportType === 'occupancy'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-bold shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            Ocupação & Locações de Eventos
          </button>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-stone-500 font-medium">Período de Referência:</span>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium"
          >
            <option value="2026-11">Novembro / 2026 (Mês Atual)</option>
            <option value="2026-10">Outubro / 2026</option>
            <option value="2026-12">Dezembro / 2026</option>
            <option value="all">Todo o Histórico</option>
          </select>
        </div>

      </div>

      {/* Printable Report Document Sheet (Strict A4 Proportioned: 794px max width, pure white background for printing) */}
      <div 
        ref={reportRef} 
        data-pdf-content="true" 
        className="bg-white text-stone-900 border border-stone-200 dark:border-stone-700 rounded-2xl p-6 sm:p-10 shadow-sm print-page space-y-8 max-w-[794px] w-full mx-auto"
      >
        
        {/* Document Header */}
        <div className="border-b-2 border-stone-800 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              {venueConfig.logoUrl ? (
                <img 
                  src={venueConfig.logoUrl} 
                  alt={venueConfig.name} 
                  className="h-12 w-auto max-w-[120px] object-contain rounded-md" 
                />
              ) : (
                <span className="w-9 h-9 rounded-lg bg-amber-600 text-white font-bold flex items-center justify-center text-lg shrink-0">
                  Ó
                </span>
              )}
              <div>
                <h1 className="text-xl font-bold tracking-tight text-stone-900">
                  {venueConfig.name}
                </h1>
                <p className="text-xs text-stone-600">
                  {venueConfig.address} · CNPJ: {venueConfig.cnpj} · Tel: {venueConfig.phone}
                </p>
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs uppercase font-bold text-amber-700 block tracking-wider">
              {reportType === 'finance' ? 'DEMONSTRATIVO FINANCEIRO' : 'RELATÓRIO DE OCUPAÇÃO'}
            </span>
            <span className="font-bold text-stone-900 text-sm block mt-0.5">
              {periodLabel}
            </span>
            <span className="text-[11px] text-stone-500 block mt-0.5">
              Emitido em {formatDateBR(new Date().toISOString().split('T')[0])}
            </span>
          </div>
        </div>

        {reportType === 'finance' ? (
          /* ================= FINANCIAL REPORT (RECEITAS E DESPESAS) ================= */
          <div className="space-y-8">
            
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50">
                <span className="text-stone-500 text-xs block">Receitas Recebidas</span>
                <span className="font-mono text-lg sm:text-xl font-bold text-emerald-600 tabular-nums block mt-1">
                  {formatCurrency(totalRevenuesPaid)}
                </span>
                <span className="text-[10px] text-stone-400 mt-1 block">Sinais e quitações</span>
              </div>

              <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50">
                <span className="text-stone-500 text-xs block">Despesas Operacionais</span>
                <span className="font-mono text-lg sm:text-xl font-bold text-stone-900 tabular-nums block mt-1">
                  {formatCurrency(totalExpensesPaid)}
                </span>
                <span className="text-[10px] text-stone-400 mt-1 block">Custos e manutenção</span>
              </div>

              <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50">
                <span className="text-stone-500 text-xs block">Resultado Líquido</span>
                <span className={`font-mono text-lg sm:text-xl font-bold tabular-nums block mt-1 ${
                  netBalance >= 0 ? 'text-stone-900' : 'text-red-600'
                }`}>
                  {formatCurrency(netBalance)}
                </span>
                <span className="text-[10px] text-stone-400 mt-1 block">Saldo operacional</span>
              </div>

              <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50">
                <span className="text-stone-500 text-xs block">Saldos a Receber</span>
                <span className="font-mono text-lg sm:text-xl font-bold text-amber-600 tabular-nums block mt-1">
                  {formatCurrency(totalFutureReceivables)}
                </span>
                <span className="text-[10px] text-stone-400 mt-1 block">Quitações no check-in</span>
              </div>
            </div>

            {/* Category Breakdown (2 columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              
              {/* Receitas por Categoria */}
              <div className="p-4 rounded-xl border border-stone-200 bg-white">
                <h3 className="font-bold text-stone-900 mb-3 flex items-center justify-between">
                  <span>Receitas Efetivadas por Categoria</span>
                  <span className="font-mono font-bold text-emerald-600">{formatCurrency(totalRevenuesPaid)}</span>
                </h3>
                <div className="space-y-2.5">
                  {Object.keys(revenueCategories).length === 0 ? (
                    <span className="text-stone-400">Nenhuma receita registrada no período.</span>
                  ) : (
                    Object.entries(revenueCategories).map(([cat, val]) => {
                      const pct = totalRevenuesPaid > 0 ? ((val / totalRevenuesPaid) * 100).toFixed(1) : '0';
                      return (
                        <div key={cat} className="space-y-1">
                          <div className="flex justify-between items-center text-stone-700">
                            <span>{getCategoryLabel(cat)}</span>
                            <span className="font-mono font-semibold tabular-nums">{formatCurrency(val)} ({pct}%)</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-stone-100 overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Despesas por Categoria */}
              <div className="p-4 rounded-xl border border-stone-200 bg-white">
                <h3 className="font-bold text-stone-900 mb-3 flex items-center justify-between">
                  <span>Despesas Operacionais por Categoria</span>
                  <span className="font-mono font-bold text-stone-800">{formatCurrency(totalExpensesPaid)}</span>
                </h3>
                <div className="space-y-2.5">
                  {Object.keys(expenseCategories).length === 0 ? (
                    <span className="text-stone-400">Nenhuma despesa registrada no período.</span>
                  ) : (
                    Object.entries(expenseCategories).map(([cat, val]) => {
                      const pct = totalExpensesPaid > 0 ? ((val / totalExpensesPaid) * 100).toFixed(1) : '0';
                      return (
                        <div key={cat} className="space-y-1">
                          <div className="flex justify-between items-center text-stone-700">
                            <span>{getCategoryLabel(cat)}</span>
                            <span className="font-mono font-semibold tabular-nums">{formatCurrency(val)} ({pct}%)</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-stone-100 overflow-hidden">
                            <div className="h-full bg-amber-600 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

            </div>

            {/* Detailed Transaction Ledger Table */}
            <div className="space-y-3">
              <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center justify-between">
                <span>Extrato Detalhado de Lançamentos ({filteredTransactions.length} registros)</span>
                <span className="text-stone-500 text-[11px] font-normal">Formato A4 sem cortes</span>
              </h3>

              <div className="border border-stone-200 rounded-xl overflow-x-auto bg-white">
                <table className="w-full text-left text-xs min-w-[620px]">
                  <thead className="bg-stone-100/90 font-semibold text-stone-800 border-b border-stone-200">
                    <tr>
                      <th className="p-3 w-24">Data</th>
                      <th className="p-3">Descrição do Lançamento</th>
                      <th className="p-3 w-40">Categoria</th>
                      <th className="p-3 w-28">Situação</th>
                      <th className="p-3 w-32 text-right">Valor (R$)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-stone-50/50">
                        <td className="p-3 font-mono text-stone-600 whitespace-nowrap">
                          {formatDateBR(tx.date)}
                        </td>
                        <td className="p-3">
                          <span className="font-semibold text-stone-900 block">
                            {tx.description}
                          </span>
                          {tx.reservationCode && (
                            <span className="text-[11px] font-mono text-stone-500">
                              Reserva #{tx.reservationCode}
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-stone-600">
                          {getCategoryLabel(tx.category)}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          {tx.status === 'pago' ? (
                            <span className="text-emerald-700 font-semibold">✓ Efetivado</span>
                          ) : (
                            <span className="text-amber-600 font-medium">Previsto</span>
                          )}
                        </td>
                        <td className={`p-3 text-right font-mono tabular-nums font-bold whitespace-nowrap ${
                          tx.type === 'receita' ? 'text-emerald-600' : 'text-stone-900'
                        }`}>
                          {tx.type === 'receita' ? '+' : '-'} {formatCurrency(tx.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        ) : (
          /* ================= OCCUPANCY & RESERVATIONS REPORT ================= */
          <div className="space-y-8 text-xs">
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50">
                <span className="text-stone-500 block">Total de Eventos no Período</span>
                <span className="font-mono text-2xl font-bold text-stone-900 block mt-1">
                  {filteredReservations.length} reservas
                </span>
                <span className="text-[11px] text-stone-400 mt-1 block">Casamentos, festas e retiros</span>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50">
                <span className="text-stone-500 block">Volume Total Faturado</span>
                <span className="font-mono text-2xl font-bold text-emerald-600 block mt-1">
                  {formatCurrency(filteredReservations.reduce((sum, r) => sum + r.totalAmount, 0))}
                </span>
                <span className="text-[11px] text-stone-400 mt-1 block">Diárias + taxas de limpeza</span>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50">
                <span className="text-stone-500 block">Saldo Total em Aberto</span>
                <span className="font-mono text-2xl font-bold text-amber-600 block mt-1">
                  {formatCurrency(filteredReservations.reduce((sum, r) => sum + r.remainingAmount, 0))}
                </span>
                <span className="text-[11px] text-stone-400 mt-1 block">A receber nos check-ins</span>
              </div>
            </div>

            {/* Reservations Table */}
            <div className="space-y-3">
              <h3 className="font-bold text-stone-900 uppercase tracking-wider">
                Relação de Locatários & Eventos Agendados
              </h3>

              <div className="border border-stone-200 rounded-xl overflow-x-auto bg-white">
                <table className="w-full text-left min-w-[650px]">
                  <thead className="bg-stone-100 font-semibold text-stone-800 border-b border-stone-200">
                    <tr>
                      <th className="p-3">Código</th>
                      <th className="p-3">Locatário / Telefone</th>
                      <th className="p-3">Evento & Convidados</th>
                      <th className="p-3">Período</th>
                      <th className="p-3 text-right">Valor Total</th>
                      <th className="p-3 text-right">Sinal Pago</th>
                      <th className="p-3 text-right">Saldo a Quitar</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredReservations.map((res) => (
                      <tr key={res.id} className="hover:bg-stone-50/50">
                        <td className="p-3 font-mono font-semibold text-stone-700">
                          {res.code}
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-stone-900 block">{res.clientName}</span>
                          <span className="text-[11px] text-stone-500">{res.clientPhone}</span>
                        </td>
                        <td className="p-3">
                          <span className="text-stone-800 block">{res.eventType}</span>
                          <span className="text-[11px] text-stone-500">{res.estimatedGuests} convidados</span>
                        </td>
                        <td className="p-3 font-mono">
                          {formatDateBR(res.startDate)}
                          {res.endDate && res.endDate !== res.startDate && ` a ${formatDateBR(res.endDate)}`}
                        </td>
                        <td className="p-3 text-right font-mono tabular-nums font-bold text-stone-900">
                          {formatCurrency(res.totalAmount)}
                        </td>
                        <td className="p-3 text-right font-mono tabular-nums font-semibold text-emerald-600">
                          {formatCurrency(res.advancePaid)}
                        </td>
                        <td className="p-3 text-right font-mono tabular-nums font-bold text-amber-600">
                          {formatCurrency(res.remainingAmount)}
                        </td>
                        <td className="p-3 text-center capitalize font-medium">
                          {res.reservationStatus}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* Footer Audit and Signatures */}
        <div className="pt-8 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-stone-500">
          <div>
            Demonstrativo oficial emitido eletronicamente · Órion Eventos e Lazer
          </div>

          <div className="text-center border-t border-stone-400 pt-3 min-w-[220px]">
            <span className="font-bold text-stone-900 block">{venueConfig.name}</span>
            <span className="text-[11px] text-stone-500">Diretoria / Gestão Financeira</span>
          </div>
        </div>

      </div>

    </div>
  );
};
