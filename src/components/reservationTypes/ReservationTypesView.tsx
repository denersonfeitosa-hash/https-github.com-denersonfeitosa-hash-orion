import React, { useState } from 'react';
import { 
  PlusCircle, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Search, 
  BookmarkCheck, 
  Clock, 
  DollarSign, 
  Moon, 
  Users, 
  Sparkles,
  ToggleLeft,
  ToggleRight,
  ShieldAlert,
  Info
} from 'lucide-react';
import { useVenue } from '../../context/VenueContext';
import { ReservationType } from '../../types';

export const ReservationTypesView: React.FC = () => {
  const { 
    reservationTypes, 
    addReservationType, 
    updateReservationType, 
    deleteReservationType, 
    toggleReservationTypeActive,
    formatCurrency 
  } = useVenue();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<ReservationType | null>(null);

  // Delete confirmation state
  const [typeToDelete, setTypeToDelete] = useState<ReservationType | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ReservationType['category']>('diaria');
  const [description, setDescription] = useState('');
  const [defaultPrice, setDefaultPrice] = useState<number>(1500);
  const [defaultCleaningFee, setDefaultCleaningFee] = useState<number>(200);
  const [defaultSecurityDeposit, setDefaultSecurityDeposit] = useState<number>(500);
  const [defaultCheckin, setDefaultCheckin] = useState('08:00');
  const [defaultCheckout, setDefaultCheckout] = useState('22:00');
  const [durationDays, setDurationDays] = useState<number>(1);
  const [allowsOvernight, setAllowsOvernight] = useState(false);
  const [maxGuests, setMaxGuests] = useState<number>(150);
  const [colorBadge, setColorBadge] = useState<string>('amber');
  const [active, setActive] = useState(true);

  const handleOpenAddModal = () => {
    setEditingType(null);
    setName('');
    setCategory('diaria');
    setDescription('');
    setDefaultPrice(1800);
    setDefaultCleaningFee(250);
    setDefaultSecurityDeposit(500);
    setDefaultCheckin('08:00');
    setDefaultCheckout('22:00');
    setDurationDays(1);
    setAllowsOvernight(false);
    setMaxGuests(150);
    setColorBadge('amber');
    setActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (type: ReservationType) => {
    setEditingType(type);
    setName(type.name);
    setCategory(type.category);
    setDescription(type.description);
    setDefaultPrice(type.defaultPrice);
    setDefaultCleaningFee(type.defaultCleaningFee);
    setDefaultSecurityDeposit(type.defaultSecurityDeposit);
    setDefaultCheckin(type.defaultCheckin);
    setDefaultCheckout(type.defaultCheckout);
    setDurationDays(type.durationDays || 1);
    setAllowsOvernight(type.allowsOvernight);
    setMaxGuests(type.maxGuests || 150);
    setColorBadge(type.colorBadge || 'amber');
    setActive(type.active);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload: Omit<ReservationType, 'id'> = {
      name: name.trim(),
      category,
      description: description.trim(),
      defaultPrice: Number(defaultPrice) || 0,
      defaultCleaningFee: Number(defaultCleaningFee) || 0,
      defaultSecurityDeposit: Number(defaultSecurityDeposit) || 0,
      defaultCheckin: defaultCheckin.trim() || '08:00',
      defaultCheckout: defaultCheckout.trim() || '22:00',
      durationDays: Math.max(1, Number(durationDays) || 1),
      allowsOvernight,
      maxGuests: Number(maxGuests) || undefined,
      colorBadge,
      active
    };

    if (editingType) {
      updateReservationType(editingType.id, payload);
    } else {
      addReservationType(payload);
    }

    setIsModalOpen(false);
    setEditingType(null);
  };

  const handleConfirmDelete = () => {
    if (typeToDelete) {
      deleteReservationType(typeToDelete.id);
      setTypeToDelete(null);
    }
  };

  // Filtered list
  const filteredTypes = reservationTypes.filter(type => {
    const matchesSearch = 
      type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      type.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || type.category === categoryFilter;
    
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && type.active) || 
      (statusFilter === 'inactive' && !type.active);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Category labels helper
  const getCategoryLabel = (cat: ReservationType['category']) => {
    switch (cat) {
      case 'diaria': return 'Diária Padrão';
      case 'pacote': return 'Pacote de Fim de Semana';
      case 'pernoite': return 'Pernoite / Retiro';
      case 'evento_especial': return 'Evento Especial / Balada';
      case 'ensaio': return 'Ensaio Fotográfico';
      default: return 'Modalidade';
    }
  };

  const getColorClasses = (color?: string) => {
    switch (color) {
      case 'emerald':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          dot: 'bg-emerald-500',
          accent: 'border-l-emerald-500'
        };
      case 'sky':
        return {
          bg: 'bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800',
          dot: 'bg-sky-500',
          accent: 'border-l-sky-500'
        };
      case 'indigo':
        return {
          bg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
          dot: 'bg-indigo-500',
          accent: 'border-l-indigo-500'
        };
      case 'purple':
        return {
          bg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800',
          dot: 'bg-purple-500',
          accent: 'border-l-purple-500'
        };
      case 'rose':
        return {
          bg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800',
          dot: 'bg-rose-500',
          accent: 'border-l-rose-500'
        };
      case 'amber':
      default:
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
          dot: 'bg-amber-500',
          accent: 'border-l-amber-500'
        };
    }
  };

  // Stats
  const totalTypes = reservationTypes.length;
  const activeTypes = reservationTypes.filter(t => t.active).length;
  const avgPrice = totalTypes > 0 
    ? reservationTypes.reduce((acc, t) => acc + t.defaultPrice, 0) / totalTypes 
    : 0;
  const overnightCount = reservationTypes.filter(t => t.allowsOvernight).length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <BookmarkCheck className="w-6 h-6 text-amber-600" />
            Tipos & Modalidades de Reserva
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Cadastre, altere, edite e exclua os tipos de locação, valores base sugeridos, horários de check-in e check-out do espaço.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm shadow-sm transition-all hover:shadow cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Novo Tipo de Reserva</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs">
          <span className="text-xs font-medium text-stone-500 dark:text-stone-400 block mb-1">
            Total Cadastrados
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-stone-900 dark:text-stone-100 font-mono">
              {totalTypes}
            </span>
            <span className="text-xs text-stone-500">modalidades</span>
          </div>
        </div>

        <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs">
          <span className="text-xs font-medium text-stone-500 dark:text-stone-400 block mb-1">
            Modalidades Ativas
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              {activeTypes}
            </span>
            <span className="text-xs text-stone-500">disponíveis</span>
          </div>
        </div>

        <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs">
          <span className="text-xs font-medium text-stone-500 dark:text-stone-400 block mb-1">
            Valor Base Médio
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-stone-900 dark:text-stone-100 font-mono">
              {formatCurrency(avgPrice)}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs">
          <span className="text-xs font-medium text-stone-500 dark:text-stone-400 block mb-1">
            Com Pernoite
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 font-mono">
              {overnightCount}
            </span>
            <span className="text-xs text-stone-500">opções com estadia</span>
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou descrição da reserva..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Filter selectors */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filtrar por categoria"
            className="px-3 py-2 text-xs font-medium bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-700 dark:text-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">Todas as Categorias</option>
            <option value="diaria">Diárias Padrão</option>
            <option value="pacote">Pacotes de Fim de Semana</option>
            <option value="pernoite">Pernoite / Retiro</option>
            <option value="evento_especial">Eventos Especiais & Noturnos</option>
            <option value="ensaio">Ensaios Fotográficos</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            aria-label="Filtrar por status"
            className="px-3 py-2 text-xs font-medium bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-700 dark:text-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">Todos os Status</option>
            <option value="active">Apenas Ativos</option>
            <option value="inactive">Apenas Pausados</option>
          </select>
        </div>

      </div>

      {/* Grid of Reservation Types */}
      {filteredTypes.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-8">
          <BookmarkCheck className="w-12 h-12 text-stone-300 dark:text-stone-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-stone-800 dark:text-stone-200">
            Nenhum tipo de reserva encontrado
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm mx-auto">
            Tente mudar os termos de busca ou clique no botão acima para cadastrar uma nova modalidade.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTypes.map((type) => {
            const colors = getColorClasses(type.colorBadge);

            return (
              <div 
                key={type.id}
                className={`bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between overflow-hidden border-l-4 ${colors.accent} transition-all hover:shadow-md`}
              >
                {/* Card Top */}
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${colors.bg}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                      {getCategoryLabel(type.category)}
                    </span>

                    <button
                      onClick={() => toggleReservationTypeActive(type.id)}
                      title={type.active ? 'Desativar temporariamente' : 'Ativar tipo de reserva'}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                        type.active 
                          ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40' 
                          : 'text-stone-500 bg-stone-100 dark:bg-stone-800'
                      }`}
                    >
                      {type.active ? (
                        <>
                          <ToggleRight className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Ativo</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-4 h-4 text-stone-400 shrink-0" />
                          <span>Pausado</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 leading-snug">
                    {type.name}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5 leading-relaxed min-h-[38px] line-clamp-2">
                    {type.description || 'Sem descrição cadastrada.'}
                  </p>

                  {/* Main Price Highlight */}
                  <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
                        Preço Base Sugerido
                      </span>
                      <span className="text-xl font-bold font-mono text-stone-900 dark:text-stone-100">
                        {formatCurrency(type.defaultPrice)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
                        Duração
                      </span>
                      <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                        {type.durationDays} {type.durationDays === 1 ? 'dia' : 'dias'}
                      </span>
                    </div>
                  </div>

                  {/* Details Badges Grid */}
                  <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-stone-50 dark:bg-stone-800/60 p-2 rounded-lg flex items-center gap-1.5 text-stone-700 dark:text-stone-300">
                      <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="truncate">
                        Entrada: <strong>{type.defaultCheckin}</strong>
                      </span>
                    </div>

                    <div className="bg-stone-50 dark:bg-stone-800/60 p-2 rounded-lg flex items-center gap-1.5 text-stone-700 dark:text-stone-300">
                      <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="truncate">
                        Saída: <strong>{type.defaultCheckout}</strong>
                      </span>
                    </div>

                    <div className="bg-stone-50 dark:bg-stone-800/60 p-2 rounded-lg flex items-center gap-1.5 text-stone-700 dark:text-stone-300">
                      <Moon className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span className="truncate">
                        Pernoite: <strong>{type.allowsOvernight ? 'Sim' : 'Não'}</strong>
                      </span>
                    </div>

                    <div className="bg-stone-50 dark:bg-stone-800/60 p-2 rounded-lg flex items-center gap-1.5 text-stone-700 dark:text-stone-300">
                      <Users className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">
                        Até: <strong>{type.maxGuests ? `${type.maxGuests} p.` : 'Livre'}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Additional info footer: Cleaning & Deposit */}
                  <div className="mt-3 pt-2 text-[11px] text-stone-500 dark:text-stone-400 flex items-center justify-between">
                    <span>Taxa Limpeza: <strong className="text-stone-700 dark:text-stone-300 font-mono">{formatCurrency(type.defaultCleaningFee)}</strong></span>
                    <span>Caução: <strong className="text-stone-700 dark:text-stone-300 font-mono">{formatCurrency(type.defaultSecurityDeposit)}</strong></span>
                  </div>

                </div>

                {/* Card Actions Footer */}
                <div className="px-5 py-3 bg-stone-50/70 dark:bg-stone-800/40 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-stone-400 font-mono uppercase tracking-wider">
                    ID: {type.id}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEditModal(type)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg text-stone-700 dark:text-stone-200 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                      <span>Alterar / Editar</span>
                    </button>

                    <button
                      onClick={() => setTypeToDelete(type)}
                      title="Excluir modalidade"
                      className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Info notice about integration with reservations */}
      <div className="p-4 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/50 rounded-xl flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold block mb-0.5">Integração Direta com Novas Reservas</span>
          Ao selecionar qualquer uma dessas modalidades durante a criação ou alteração de uma reserva, o sistema preencherá automaticamente o valor da locação, os horários de entrada e saída, a taxa de limpeza e a caução recomendadas.
        </div>
      </div>

      {/* Modal: Create / Edit Reservation Type */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 no-print">
          <div className="relative bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl transition-all">
            
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <BookmarkCheck className="w-5 h-5 text-amber-600" />
                  {editingType ? 'Alterar / Editar Tipo de Reserva' : 'Cadastrar Novo Tipo de Reserva'}
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Preencha os valores padrão e regras que serão aplicados aos orçamentos desta modalidade.
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-5 text-xs">
              
              {/* Row 1: Name and Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Nome da Modalidade *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Diária Especial de Domingo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Categoria da Locação *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ReservationType['category'])}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                  >
                    <option value="diaria">Diária Padrão</option>
                    <option value="pacote">Pacote Fim de Semana (Sáb a Dom)</option>
                    <option value="pernoite">Pernoite / Retiro / Hospedagem</option>
                    <option value="evento_especial">Evento Especial / Festa Noturna</option>
                    <option value="ensaio">Ensaio Fotográfico / Pré-Wedding</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                  Descrição & Instruções do Pacote
                </label>
                <textarea
                  rows={2}
                  placeholder="Descreva o que está incluso, finalidade principal e observações desta modalidade..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>

              {/* Row 2: Pricing, Cleaning, Deposit */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Preço Base Sugerido (R$) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    required
                    value={defaultPrice}
                    onChange={(e) => setDefaultPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Taxa de Limpeza Padrão (R$)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={defaultCleaningFee}
                    onChange={(e) => setDefaultCleaningFee(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Caução de Garantia (R$)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={defaultSecurityDeposit}
                    onChange={(e) => setDefaultSecurityDeposit(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Row 3: Checkin, Checkout, Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Horário Entrada (Check-in)
                  </label>
                  <input
                    type="text"
                    placeholder="08:00"
                    value={defaultCheckin}
                    onChange={(e) => setDefaultCheckin(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Horário Saída (Check-out)
                  </label>
                  <input
                    type="text"
                    placeholder="22:00"
                    value={defaultCheckout}
                    onChange={(e) => setDefaultCheckout(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Duração Padrão (dias)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Row 4: Overnight, Max Guests, Color Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center pt-1">
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Capacidade Recomendada
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Ex: 150 convidados"
                    value={maxGuests}
                    onChange={(e) => setMaxGuests(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Cor Visual de Destaque
                  </label>
                  <select
                    value={colorBadge}
                    onChange={(e) => setColorBadge(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="amber">Âmbar / Dourado</option>
                    <option value="emerald">Esmeralda / Verde</option>
                    <option value="sky">Céu / Azul</option>
                    <option value="indigo">Índigo / Azul Profundo</option>
                    <option value="purple">Púrpura / Roxo</option>
                    <option value="rose">Rosa / Coral</option>
                  </select>
                </div>

                <div className="pt-4">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={allowsOvernight}
                      onChange={(e) => setAllowsOvernight(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-stone-300"
                    />
                    <span className="font-medium text-stone-700 dark:text-stone-300">
                      Permite Pernoite / Hospedagem
                    </span>
                  </label>
                </div>
              </div>

              {/* Status toggle */}
              <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-stone-300"
                  />
                  <div>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">
                      Modalidade Ativa no Sistema
                    </span>
                    <span className="block text-[11px] text-stone-500">
                      Quando ativada, esta modalidade aparecerá como opção selecionável no formulário de reservas.
                    </span>
                  </div>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-medium hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-colors cursor-pointer shadow-xs"
                >
                  {editingType ? 'Salvar Alterações' : 'Cadastrar Modalidade'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {typeToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 no-print">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Excluir Tipo de Reserva?
              </h3>
            </div>
            
            <p className="text-xs text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">
              Você está prestes a excluir a modalidade <strong>"{typeToDelete.name}"</strong>. Reservas anteriores que utilizaram essa modalidade manterão seus valores contratuais intactos.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setTypeToDelete(null)}
                className="px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Sim, Excluir Modalidade
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
