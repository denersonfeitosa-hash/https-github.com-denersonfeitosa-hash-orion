import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PlusCircle, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Calendar,
  Receipt,
  FileSpreadsheet
} from 'lucide-react';
import { useVenue } from '../../context/VenueContext';
import { FinancialTransaction } from '../../types';

interface FinanceViewProps {
  onOpenReceipt?: (tx: FinancialTransaction) => void;
  onNavigateToReports?: () => void;
}

export const FinanceView: React.FC<FinanceViewProps> = ({
  onOpenReceipt,
  onNavigateToReports
}) => {
  const { 
    transactions, 
    addTransaction, 
    deleteTransaction, 
    markTransactionPaid, 
    formatCurrency, 
    formatDateBR 
  } = useVenue();

  const [typeFilter, setTypeFilter] = useState<'all' | 'receita' | 'despesa' | 'previsto'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Transaction Form state
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'receita' | 'despesa'>('despesa');
  const [category, setCategory] = useState<FinancialTransaction['category']>('manutencao_piscina');
  const [amount, setAmount] = useState<number>(150);
  const [date, setDate] = useState('2026-11-04');
  const [status, setStatus] = useState<'pago' | 'previsto'>('pago');

  const filteredTransactions = transactions.filter(t => {
    if (typeFilter === 'receita') return t.type === 'receita';
    if (typeFilter === 'despesa') return t.type === 'despesa';
    if (typeFilter === 'previsto') return t.status === 'previsto';
    return true;
  });

  // Calculate totals
  const totalRevenuePaid = transactions
    .filter(t => t.type === 'receita' && t.status === 'pago')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpensePaid = transactions
    .filter(t => t.type === 'despesa' && t.status === 'pago')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalRevenuePaid - totalExpensePaid;

  const totalPendingFuture = transactions
    .filter(t => t.type === 'receita' && t.status === 'previsto')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || amount <= 0) {
      alert('Preencha a descrição e um valor válido.');
      return;
    }

    addTransaction({
      description: description.trim(),
      type,
      category,
      amount: Number(amount),
      date,
      status
    });

    setDescription('');
    setShowAddModal(false);
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'sinal_reserva': return 'Sinal de Locação';
      case 'quitacao_reserva': return 'Quitação de Locação';
      case 'taxa_limpeza': return 'Taxa de Limpeza';
      case 'hora_extra': return 'Horas Adicionais';
      case 'manutencao_piscina': return 'Piscina & Química';
      case 'jardinagem': return 'Jardinagem & Área Externa';
      case 'produtos_limpeza': return 'Produtos de Limpeza';
      case 'energia_agua': return 'Energia Elétrica & Água';
      case 'reparos': return 'Manutenção & Reparos';
      default: return 'Outros';
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-amber-600" />
            <span>Controle Financeiro & Livro Caixa</span>
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Acompanhe o faturamento de locações, sinais recebidos, despesas de manutenção e saldos previstos.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {onNavigateToReports && (
            <button
              onClick={onNavigateToReports}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-700 dark:text-stone-200 bg-white dark:bg-stone-800 hover:bg-stone-100 rounded-lg border border-stone-200 dark:border-stone-700 transition-colors shadow-xs"
            >
              <FileSpreadsheet className="w-4 h-4 text-amber-600" />
              <span>Relatório em PDF</span>
            </button>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Novo Lançamento</span>
          </button>
        </div>
      </div>

      {/* KPI Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span>Total de Entradas Recebidas</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-2">
            {formatCurrency(totalRevenuePaid)}
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">Sinais e quitações compensadas</span>
        </div>

        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span>Despesas do Espaço</span>
            <TrendingDown className="w-4 h-4 text-stone-500" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-stone-900 dark:text-stone-100 mt-2">
            {formatCurrency(totalExpensePaid)}
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">Piscina, jardinagem e insumos</span>
        </div>

        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span>Resultado Líquido Realizado</span>
            <DollarSign className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-stone-900 dark:text-stone-100 mt-2">
            {formatCurrency(netBalance)}
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">Entradas menos despesas</span>
        </div>

        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span>Saldo a Receber Previsto</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-amber-600 dark:text-amber-400 mt-2">
            {formatCurrency(totalPendingFuture)}
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">Saldos de reservas no check-in</span>
        </div>

      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-lg w-fit text-xs">
        <button
          onClick={() => setTypeFilter('all')}
          className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
            typeFilter === 'all'
              ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          Todos os Lançamentos ({transactions.length})
        </button>
        <button
          onClick={() => setTypeFilter('receita')}
          className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
            typeFilter === 'receita'
              ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          Receitas ({transactions.filter(t => t.type === 'receita').length})
        </button>
        <button
          onClick={() => setTypeFilter('despesa')}
          className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
            typeFilter === 'despesa'
              ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          Despesas ({transactions.filter(t => t.type === 'despesa').length})
        </button>
        <button
          onClick={() => setTypeFilter('previsto')}
          className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
            typeFilter === 'previsto'
              ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          Previstos a Receber ({transactions.filter(t => t.status === 'previsto').length})
        </button>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-100/70 dark:bg-stone-800/60 text-stone-600 dark:text-stone-300 font-medium border-b border-stone-200 dark:border-stone-700">
            <tr>
              <th className="p-3.5">Data</th>
              <th className="p-3.5">Descrição</th>
              <th className="p-3.5">Categoria</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Valor (R$)</th>
              <th className="p-3.5 text-center w-20">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
            {filteredTransactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30">
                <td className="p-3.5 font-mono text-stone-600 dark:text-stone-400 whitespace-nowrap">
                  {formatDateBR(tx.date)}
                </td>
                
                <td className="p-3.5">
                  <span className="font-semibold text-stone-900 dark:text-stone-100 block">
                    {tx.description}
                  </span>
                  {tx.reservationCode && (
                    <span className="text-[11px] font-mono text-stone-400">
                      Reserva #{tx.reservationCode}
                    </span>
                  )}
                </td>

                <td className="p-3.5 text-stone-600 dark:text-stone-400">
                  {getCategoryLabel(tx.category)}
                </td>

                <td className="p-3.5 whitespace-nowrap">
                  {tx.status === 'pago' ? (
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Efetivado</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => markTransactionPaid(tx.id)}
                      className="text-amber-700 dark:text-amber-400 font-medium hover:underline flex items-center gap-1"
                      title="Clique para marcar como pago"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Confirmar Recebimento</span>
                    </button>
                  )}
                </td>

                <td className={`p-3.5 text-right font-mono tabular-nums font-bold text-sm whitespace-nowrap ${
                  tx.type === 'receita' 
                    ? 'text-emerald-600 dark:text-emerald-400' 
                    : 'text-stone-900 dark:text-stone-100'
                }`}>
                  {tx.type === 'receita' ? '+' : '-'} {formatCurrency(tx.amount)}
                </td>

                <td className="p-3.5 text-center">
                  <div className="flex items-center justify-center gap-1">
                    {tx.type === 'receita' && onOpenReceipt && (
                      <button
                        onClick={() => onOpenReceipt(tx)}
                        className="p-1.5 text-stone-500 hover:text-amber-600 rounded-md transition-colors"
                        title="Emitir Recibo Oficial deste Pagamento"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteTransaction(tx.id)}
                      className="p-1.5 text-stone-400 hover:text-red-600 rounded-md transition-colors"
                      title="Excluir Lançamento"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Novo Lançamento Financeiro
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                  Tipo de Lançamento
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => { setType('receita'); setCategory('sinal_reserva'); }}
                    className={`py-2 rounded-lg border font-medium ${
                      type === 'receita' 
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200' 
                        : 'border-stone-200 dark:border-stone-700 text-stone-600'
                    }`}
                  >
                    + Receita (Entrada)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setType('despesa'); setCategory('manutencao_piscina'); }}
                    className={`py-2 rounded-lg border font-medium ${
                      type === 'despesa' 
                        ? 'border-amber-600 bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200' 
                        : 'border-stone-200 dark:border-stone-700 text-stone-600'
                    }`}
                  >
                    - Despesa (Saída)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                  Descrição
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Cloro da piscina e algicida 10L"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Categoria
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  >
                    {type === 'despesa' ? (
                      <>
                        <option value="manutencao_piscina">Manutenção de Piscina</option>
                        <option value="jardinagem">Jardinagem e Poda</option>
                        <option value="produtos_limpeza">Produtos de Limpeza</option>
                        <option value="energia_agua">Energia e Água</option>
                        <option value="reparos">Reparos Gerais</option>
                        <option value="outros">Outros</option>
                      </>
                    ) : (
                      <>
                        <option value="sinal_reserva">Sinal de Reserva</option>
                        <option value="quitacao_reserva">Quitação de Locação</option>
                        <option value="taxa_limpeza">Taxa de Limpeza</option>
                        <option value="hora_extra">Horas Adicionais</option>
                        <option value="outros">Outras Entradas</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Valor (R$)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="5"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Data
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Situação
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  >
                    <option value="pago">Efetivado (Pago)</option>
                    <option value="previsto">Previsto</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-amber-600 hover:bg-amber-700 rounded-lg font-semibold"
                >
                  Salvar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
