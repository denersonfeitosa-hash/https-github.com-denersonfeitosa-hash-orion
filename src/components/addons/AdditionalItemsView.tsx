import React, { useState } from 'react';
import { 
  PlusCircle, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Search, 
  SlidersHorizontal,
  Package, 
  DollarSign, 
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { useVenue } from '../../context/VenueContext';
import { AdditionalItem } from '../../types';

export const AdditionalItemsView: React.FC = () => {
  const { 
    additionalItems, 
    addAdditionalItem, 
    updateAdditionalItem, 
    deleteAdditionalItem, 
    toggleAdditionalItemActive,
    formatCurrency 
  } = useVenue();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Modal state for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdditionalItem | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<AdditionalItem['category']>('Equipamento');
  const [price, setPrice] = useState<number>(150);
  const [billingType, setBillingType] = useState<AdditionalItem['billingType']>('evento');
  const [stock, setStock] = useState<number>(1);
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setName('');
    setCategory('Equipamento');
    setPrice(150);
    setBillingType('evento');
    setStock(1);
    setDescription('');
    setActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: AdditionalItem) => {
    setEditingItem(item);
    setName(item.name);
    setCategory(item.category);
    setPrice(item.price);
    setBillingType(item.billingType);
    setStock(item.stock);
    setDescription(item.description);
    setActive(item.active);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || price < 0) {
      alert('Preencha o nome do item e um valor válido.');
      return;
    }

    if (editingItem) {
      updateAdditionalItem(editingItem.id, {
        name: name.trim(),
        category,
        price: Number(price),
        billingType,
        stock: Number(stock),
        description: description.trim(),
        active
      });
    } else {
      addAdditionalItem({
        name: name.trim(),
        category,
        price: Number(price),
        billingType,
        stock: Number(stock),
        description: description.trim(),
        active
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, itemName: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o item adicional "${itemName}"?`)) {
      deleteAdditionalItem(id);
    }
  };

  const filteredItems = additionalItems.filter(item => {
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      item.name.toLowerCase().includes(term) ||
      item.category.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term)
    );
  });

  const getBillingTypeLabel = (type: AdditionalItem['billingType']) => {
    switch (type) {
      case 'evento': return 'Por Evento / Diária';
      case 'hora': return 'Por Hora Adicional';
      case 'unidade': return 'Por Unidade';
      default: return type;
    }
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-amber-600" />
            <span>Cadastramento de Itens Adicionais & Opcionais</span>
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Cadastre, altere, edite ou exclua equipamentos extras, brinquedos, horas adicionais e serviços ofertados para locação.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Cadastrar Novo Item Adicional</span>
        </button>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4">
          <span className="text-stone-500 text-xs block">Total de Itens Cadastrados</span>
          <span className="font-mono text-2xl font-bold text-stone-900 dark:text-stone-100 block mt-1">
            {additionalItems.length} itens
          </span>
          <span className="text-[11px] text-stone-400 mt-1 block">Catálogo de opcionais para aluguel</span>
        </div>

        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4">
          <span className="text-stone-500 text-xs block">Itens Ativos para Locação</span>
          <span className="font-mono text-2xl font-bold text-emerald-600 dark:text-emerald-400 block mt-1">
            {additionalItems.filter(i => i.active).length} ativos
          </span>
          <span className="text-[11px] text-stone-400 mt-1 block">Disponíveis para inclusão nas reservas</span>
        </div>

        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4">
          <span className="text-stone-500 text-xs block">Ticket Médio dos Opcionais</span>
          <span className="font-mono text-2xl font-bold text-amber-600 dark:text-amber-400 block mt-1">
            {additionalItems.length > 0 
              ? formatCurrency(additionalItems.reduce((acc, i) => acc + i.price, 0) / additionalItems.length) 
              : 'R$ 0,00'}
          </span>
          <span className="text-[11px] text-stone-400 mt-1 block">Média de valor por locação</span>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nome, categoria ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-lg overflow-x-auto text-xs">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1.5 font-medium rounded-md whitespace-nowrap transition-colors ${
                categoryFilter === 'all'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              Todos ({additionalItems.length})
            </button>
            <button
              onClick={() => setCategoryFilter('Equipamento')}
              className={`px-3 py-1.5 font-medium rounded-md whitespace-nowrap transition-colors ${
                categoryFilter === 'Equipamento'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              Equipamentos
            </button>
            <button
              onClick={() => setCategoryFilter('Lazer & Brinquedos')}
              className={`px-3 py-1.5 font-medium rounded-md whitespace-nowrap transition-colors ${
                categoryFilter === 'Lazer & Brinquedos'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              Lazer & Brinquedos
            </button>
            <button
              onClick={() => setCategoryFilter('Mobiliário Extra')}
              className={`px-3 py-1.5 font-medium rounded-md whitespace-nowrap transition-colors ${
                categoryFilter === 'Mobiliário Extra'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              Mobiliário Extra
            </button>
            <button
              onClick={() => setCategoryFilter('Serviço & Hora Extra')}
              className={`px-3 py-1.5 font-medium rounded-md whitespace-nowrap transition-colors ${
                categoryFilter === 'Serviço & Hora Extra'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              Serviços & Horas
            </button>
          </div>

        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-100/70 dark:bg-stone-800/60 font-semibold text-stone-700 dark:text-stone-300 border-b border-stone-200 dark:border-stone-700">
            <tr>
              <th className="p-3.5">Nome do Item Adicional</th>
              <th className="p-3.5">Categoria</th>
              <th className="p-3.5">Cobrança</th>
              <th className="p-3.5 text-right">Valor de Locação</th>
              <th className="p-3.5 text-center">Qtd Disponível</th>
              <th className="p-3.5 text-center">Status</th>
              <th className="p-3.5 text-center w-28">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-stone-400">
                  Nenhum item adicional encontrado. Clique em "Cadastrar Novo Item Adicional" para adicionar.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30">
                  
                  {/* Name & Description */}
                  <td className="p-3.5">
                    <span className="font-bold text-stone-900 dark:text-stone-100 block text-sm">
                      {item.name}
                    </span>
                    {item.description && (
                      <span className="text-[11px] text-stone-500 dark:text-stone-400 block mt-0.5 max-w-sm">
                        {item.description}
                      </span>
                    )}
                  </td>

                  {/* Category */}
                  <td className="p-3.5 text-stone-600 dark:text-stone-400 font-medium">
                    {item.category}
                  </td>

                  {/* Billing Type */}
                  <td className="p-3.5 text-stone-600 dark:text-stone-400">
                    {getBillingTypeLabel(item.billingType)}
                  </td>

                  {/* Price */}
                  <td className="p-3.5 text-right font-mono font-bold text-sm text-stone-900 dark:text-stone-100 tabular-nums">
                    {formatCurrency(item.price)}
                  </td>

                  {/* Stock */}
                  <td className="p-3.5 text-center font-mono font-bold text-stone-700 dark:text-stone-300">
                    {item.stock} un
                  </td>

                  {/* Status Toggle */}
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => toggleAdditionalItemActive(item.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                        item.active 
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' 
                          : 'bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400'
                      }`}
                      title={item.active ? 'Clique para desativar' : 'Clique para ativar'}
                    >
                      {item.active ? '✓ Ativo' : 'Inativo'}
                    </button>
                  </td>

                  {/* Action buttons: Alterar/Editar e Excluir */}
                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 rounded-md transition-colors"
                        title="Alterar / Editar Item"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>

                      <button
                        onClick={() => handleDelete(item.id, item.name)}
                        className="p-1 text-stone-400 hover:text-red-600 rounded-md transition-colors"
                        title="Excluir Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                {editingItem ? 'Alterar / Editar Item Adicional' : 'Cadastrar Novo Item Adicional'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                  Nome do Item Adicional *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Cervejeira Vertical Extra ou Choperia 2 Vias"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Categoria *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  >
                    <option value="Equipamento">Equipamento</option>
                    <option value="Lazer & Brinquedos">Lazer & Brinquedos</option>
                    <option value="Mobiliário Extra">Mobiliário Extra</option>
                    <option value="Serviço & Hora Extra">Serviço & Hora Extra</option>
                    <option value="Insumos">Insumos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Tipo de Cobrança *
                  </label>
                  <select
                    value={billingType}
                    onChange={(e) => setBillingType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  >
                    <option value="evento">Por Evento / Diária</option>
                    <option value="hora">Por Hora Adicional</option>
                    <option value="unidade">Por Unidade</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Valor de Locação (R$) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Quantidade em Estoque *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                  Descrição / Especificações Técnicas
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Acompanha cabos, cilindro de CO2 e 1 barril vazio..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="activeCheck"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded"
                />
                <label htmlFor="activeCheck" className="text-stone-700 dark:text-stone-300 font-medium cursor-pointer">
                  Disponível para seleção ativa em novos orçamentos e reservas
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 dark:hover:text-stone-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-white bg-amber-600 hover:bg-amber-700 rounded-lg font-semibold transition-colors"
                >
                  {editingItem ? 'Salvar Alterações' : 'Cadastrar Item'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
