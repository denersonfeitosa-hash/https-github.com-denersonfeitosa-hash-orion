import React, { useState } from 'react';
import { 
  BookmarkCheck, 
  SlidersHorizontal, 
  ClipboardCheck, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Check, 
  X, 
  Clock, 
  DollarSign, 
  Moon, 
  Sun, 
  Layers, 
  Tag, 
  Package, 
  ShieldCheck, 
  RotateCcw,
  AlertCircle,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useVenue } from '../../context/VenueContext';
import { ReservationType, AdditionalItem, InspectionCheckItem } from '../../types';

interface CatalogManagementViewProps {
  initialSubTab?: 'reservation-types' | 'addons' | 'checklist';
}

export const CatalogManagementView: React.FC<CatalogManagementViewProps> = ({ 
  initialSubTab = 'reservation-types' 
}) => {
  const { 
    reservationTypes, 
    addReservationType, 
    updateReservationType, 
    deleteReservationType, 
    toggleReservationTypeActive,

    additionalItems,
    addAdditionalItem,
    updateAdditionalItem,
    deleteAdditionalItem,
    toggleAdditionalItemActive,

    checklistItems,
    addChecklistItem,
    updateChecklistItem,
    deleteChecklistItem,
    resetChecklistItems,

    formatCurrency 
  } = useVenue();

  const [activeSubTab, setActiveSubTab] = useState<'reservation-types' | 'addons' | 'checklist'>(initialSubTab);
  const [searchTerm, setSearchTerm] = useState('');

  // ================= STATE FOR RESERVATION TYPES MODAL =================
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [typeToEdit, setTypeToEdit] = useState<ReservationType | null>(null);
  const [typeFormData, setTypeFormData] = useState<Omit<ReservationType, 'id'>>({
    name: '',
    category: 'diaria',
    description: '',
    defaultPrice: 1500,
    defaultCleaningFee: 250,
    defaultSecurityDeposit: 500,
    defaultCheckin: '08:00',
    defaultCheckout: '22:00',
    durationDays: 1,
    allowsOvernight: false,
    maxGuests: 200,
    colorBadge: 'amber',
    active: true
  });

  // ================= STATE FOR ADDITIONAL ITEMS MODAL =================
  const [isAddonModalOpen, setIsAddonModalOpen] = useState(false);
  const [addonToEdit, setAddonToEdit] = useState<AdditionalItem | null>(null);
  const [addonFormData, setAddonFormData] = useState<Omit<AdditionalItem, 'id'>>({
    name: '',
    category: 'Equipamento',
    price: 150,
    billingType: 'evento',
    stock: 1,
    description: '',
    active: true
  });

  // ================= STATE FOR CHECKLIST ITEMS MODAL =================
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);
  const [checkItemToEdit, setCheckItemToEdit] = useState<InspectionCheckItem | null>(null);
  const [checkItemFormData, setCheckItemFormData] = useState<{
    title: string;
    category: InspectionCheckItem['category'];
    notes: string;
  }>({
    title: '',
    category: 'Piscina & Área Externa',
    notes: ''
  });

  // ================= RESERVATION TYPE ACTIONS =================
  const handleOpenNewTypeModal = () => {
    setTypeToEdit(null);
    setTypeFormData({
      name: '',
      category: 'diaria',
      description: '',
      defaultPrice: 1500,
      defaultCleaningFee: 250,
      defaultSecurityDeposit: 500,
      defaultCheckin: '08:00',
      defaultCheckout: '22:00',
      durationDays: 1,
      allowsOvernight: false,
      maxGuests: 200,
      colorBadge: 'amber',
      active: true
    });
    setIsTypeModalOpen(true);
  };

  const handleOpenEditTypeModal = (type: ReservationType) => {
    setTypeToEdit(type);
    setTypeFormData({
      name: type.name,
      category: type.category,
      description: type.description,
      defaultPrice: type.defaultPrice,
      defaultCleaningFee: type.defaultCleaningFee,
      defaultSecurityDeposit: type.defaultSecurityDeposit,
      defaultCheckin: type.defaultCheckin,
      defaultCheckout: type.defaultCheckout,
      durationDays: type.durationDays,
      allowsOvernight: type.allowsOvernight,
      maxGuests: type.maxGuests || 200,
      colorBadge: type.colorBadge || 'amber',
      active: type.active
    });
    setIsTypeModalOpen(true);
  };

  const handleSaveType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typeFormData.name.trim()) {
      alert('Por favor, informe o nome do tipo de reserva.');
      return;
    }

    if (typeToEdit) {
      updateReservationType(typeToEdit.id, typeFormData);
    } else {
      addReservationType(typeFormData);
    }
    setIsTypeModalOpen(false);
  };

  // ================= STATE FOR IN-APP CONFIRMATION MODAL =================
  const [itemToDelete, setItemToDelete] = useState<{
    type: 'reservation-type' | 'addon' | 'checklist' | 'reset-checklist';
    id?: string;
    name: string;
  } | null>(null);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  const confirmDeleteAction = () => {
    if (!itemToDelete) return;
    if (itemToDelete.type === 'reservation-type' && itemToDelete.id) {
      deleteReservationType(itemToDelete.id);
      setNotificationToast(`Tipo de reserva "${itemToDelete.name}" excluído.`);
    } else if (itemToDelete.type === 'addon' && itemToDelete.id) {
      deleteAdditionalItem(itemToDelete.id);
      setNotificationToast(`Item adicional "${itemToDelete.name}" excluído.`);
    } else if (itemToDelete.type === 'checklist' && itemToDelete.id) {
      deleteChecklistItem(itemToDelete.id);
      setNotificationToast(`Item de vistoria "${itemToDelete.name}" removido.`);
    } else if (itemToDelete.type === 'reset-checklist') {
      resetChecklistItems();
      setNotificationToast('Checklist restaurado para o padrão.');
    }
    setItemToDelete(null);
    setTimeout(() => setNotificationToast(null), 3500);
  };

  const handleDeleteType = (id: string, name: string) => {
    setItemToDelete({ type: 'reservation-type', id, name });
  };

  // ================= ADDITIONAL ITEMS ACTIONS =================
  const handleOpenNewAddonModal = () => {
    setAddonToEdit(null);
    setAddonFormData({
      name: '',
      category: 'Equipamento',
      price: 150,
      billingType: 'evento',
      stock: 1,
      description: '',
      active: true
    });
    setIsAddonModalOpen(true);
  };

  const handleOpenEditAddonModal = (item: AdditionalItem) => {
    setAddonToEdit(item);
    setAddonFormData({
      name: item.name,
      category: item.category,
      price: item.price,
      billingType: item.billingType,
      stock: item.stock,
      description: item.description,
      active: item.active
    });
    setIsAddonModalOpen(true);
  };

  const handleSaveAddon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addonFormData.name.trim()) {
      alert('Por favor, informe o nome do item adicional.');
      return;
    }

    if (addonToEdit) {
      updateAdditionalItem(addonToEdit.id, addonFormData);
    } else {
      addAdditionalItem(addonFormData);
    }
    setIsAddonModalOpen(false);
  };

  const handleDeleteAddon = (id: string, name: string) => {
    setItemToDelete({ type: 'addon', id, name });
  };

  // ================= CHECKLIST ITEMS ACTIONS =================
  const handleOpenNewChecklistModal = () => {
    setCheckItemToEdit(null);
    setCheckItemFormData({
      title: '',
      category: 'Piscina & Área Externa',
      notes: ''
    });
    setIsChecklistModalOpen(true);
  };

  const handleOpenEditChecklistModal = (item: InspectionCheckItem) => {
    setCheckItemToEdit(item);
    setCheckItemFormData({
      title: item.title,
      category: item.category,
      notes: item.notes || ''
    });
    setIsChecklistModalOpen(true);
  };

  const handleSaveChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkItemFormData.title.trim()) {
      setNotificationToast('Por favor, informe a descrição do item a conferir.');
      setTimeout(() => setNotificationToast(null), 3000);
      return;
    }

    if (checkItemToEdit) {
      updateChecklistItem(checkItemToEdit.id, {
        title: checkItemFormData.title,
        category: checkItemFormData.category,
        notes: checkItemFormData.notes
      });
      setNotificationToast(`Item "${checkItemFormData.title}" atualizado.`);
    } else {
      addChecklistItem({
        title: checkItemFormData.title,
        category: checkItemFormData.category,
        notes: checkItemFormData.notes
      });
      setNotificationToast(`Item "${checkItemFormData.title}" adicionado.`);
    }
    setTimeout(() => setNotificationToast(null), 3000);
    setIsChecklistModalOpen(false);
  };

  const handleDeleteChecklistItem = (id: string, title: string) => {
    setItemToDelete({ type: 'checklist', id, name: title });
  };

  const handleResetChecklist = () => {
    setItemToDelete({ type: 'reset-checklist', name: 'Lista padrão de conferência da vistoria' });
  };

  // ================= FILTERED LISTS =================
  const filteredTypes = reservationTypes.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAddons = additionalItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredChecklist = checklistItems.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Group checklist items by category
  const checklistByCategory = filteredChecklist.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, InspectionCheckItem[]>);

  const getTypeCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'diaria': return 'Diária Normal';
      case 'pacote': return 'Pacote de Dias';
      case 'pernoite': return 'Pernoite / Retiro';
      case 'evento_especial': return 'Festa Especial';
      case 'ensaio': return 'Ensaio / Curta Duração';
      default: return cat;
    }
  };

  const getBillingLabel = (billing: string) => {
    switch (billing) {
      case 'evento': return 'Por Evento';
      case 'hora': return 'Por Hora';
      case 'unidade': return 'Por Unidade';
      default: return billing;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-600/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <span>Cadastros & Itens do Espaço</span>
                <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  Tipos · Opcionais · Vistoria
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                Gerencie em um só local os tipos de reserva, itens e serviços adicionais e o checklist de conferência na entrada/saída.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button depending on active sub-tab */}
        <div className="flex items-center gap-2 shrink-0">
          {activeSubTab === 'reservation-types' && (
            <button
              onClick={handleOpenNewTypeModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-amber-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Tipo de Reserva</span>
            </button>
          )}

          {activeSubTab === 'addons' && (
            <button
              onClick={handleOpenNewAddonModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-amber-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Item Adicional</span>
            </button>
          )}

          {activeSubTab === 'checklist' && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetChecklist}
                className="flex items-center gap-1.5 px-3 py-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-medium rounded-xl border border-stone-200 dark:border-stone-700 transition-colors"
                title="Restaurar padrão inicial"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Padrão</span>
              </button>
              <button
                onClick={handleOpenNewChecklistModal}
                className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-amber-600/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Item de Vistoria</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Unified Tab Switcher (Segmented Control) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none text-xs sm:text-sm">
          <button
            onClick={() => { setActiveSubTab('reservation-types'); setSearchTerm(''); }}
            className={`flex items-center gap-2 px-4 py-2 font-medium rounded-xl whitespace-nowrap transition-all ${
              activeSubTab === 'reservation-types'
                ? 'bg-amber-600 text-white font-bold shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <BookmarkCheck className="w-4 h-4" />
            <span>Tipos de Reserva</span>
            <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
              activeSubTab === 'reservation-types' ? 'bg-amber-700 text-white' : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
            }`}>
              {reservationTypes.length}
            </span>
          </button>

          <button
            onClick={() => { setActiveSubTab('addons'); setSearchTerm(''); }}
            className={`flex items-center gap-2 px-4 py-2 font-medium rounded-xl whitespace-nowrap transition-all ${
              activeSubTab === 'addons'
                ? 'bg-amber-600 text-white font-bold shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Itens Adicionais & Serviços</span>
            <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
              activeSubTab === 'addons' ? 'bg-amber-700 text-white' : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
            }`}>
              {additionalItems.length}
            </span>
          </button>

          <button
            onClick={() => { setActiveSubTab('checklist'); setSearchTerm(''); }}
            className={`flex items-center gap-2 px-4 py-2 font-medium rounded-xl whitespace-nowrap transition-all ${
              activeSubTab === 'checklist'
                ? 'bg-amber-600 text-white font-bold shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>Checklist de Conferência & Vistoria</span>
            <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
              activeSubTab === 'checklist' ? 'bg-amber-700 text-white' : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
            }`}>
              {checklistItems.length}
            </span>
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
          <input
            type="text"
            placeholder={
              activeSubTab === 'reservation-types' ? 'Buscar tipos...' :
              activeSubTab === 'addons' ? 'Buscar adicionais...' : 'Buscar itens de vistoria...'
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: TIPOS DE RESERVA                                                   */}
      {/* ========================================================================= */}
      {activeSubTab === 'reservation-types' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span>{filteredTypes.length} tipos de reserva cadastrados</span>
            <span>Estes tipos carregam preços, horários e caução automaticamente no formulário de reserva</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTypes.map((type) => (
              <div 
                key={type.id} 
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  type.active 
                    ? 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 shadow-xs' 
                    : 'bg-stone-100/60 dark:bg-stone-800/40 border-stone-200 dark:border-stone-700 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700">
                      {getTypeCategoryLabel(type.category)}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleReservationTypeActive(type.id)}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-colors cursor-pointer ${
                        type.active 
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200' 
                          : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 border-stone-300'
                      }`}
                      title="Clique para ativar/desativar"
                    >
                      {type.active ? 'Ativo' : 'Inativo'}
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                    {type.name}
                  </h3>

                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2">
                    {type.description}
                  </p>

                  <div className="my-4 pt-3 border-t border-stone-100 dark:border-stone-800 space-y-2 text-xs">
                    <div className="flex justify-between items-baseline">
                      <span className="text-stone-500">Valor Base da Diária:</span>
                      <span className="font-mono text-base font-bold text-amber-700 dark:text-amber-400">
                        {formatCurrency(type.defaultPrice)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[11px] text-stone-500">
                      <span>Taxa Limpeza:</span>
                      <span className="font-mono text-stone-800 dark:text-stone-200">
                        {formatCurrency(type.defaultCleaningFee)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[11px] text-stone-500">
                      <span>Caução / Garantia:</span>
                      <span className="font-mono text-stone-800 dark:text-stone-200">
                        {formatCurrency(type.defaultSecurityDeposit)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[11px] text-stone-500 pt-1 border-t border-stone-50 dark:border-stone-800/60">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-stone-400" />
                        <span>Horário Padrão:</span>
                      </span>
                      <span className="font-mono font-medium text-stone-800 dark:text-stone-200">
                        {type.defaultCheckin}h às {type.defaultCheckout}h
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      {type.allowsOvernight ? (
                        <span className="text-[10px] font-medium text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Moon className="w-2.5 h-2.5" />
                          Permite Pernoite
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Sun className="w-2.5 h-2.5" />
                          Sem Pernoite
                        </span>
                      )}
                      <span className="text-[10px] text-stone-400">
                        {type.durationDays} {type.durationDays > 1 ? 'dias' : 'dia'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card footer actions */}
                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEditTypeModal(type)}
                    className="p-1.5 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium"
                    title="Editar tipo de reserva"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteType(type.id, type.name)}
                    className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg transition-colors flex items-center gap-1 text-xs"
                    title="Excluir tipo de reserva"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ITENS ADICIONAIS & SERVIÇOS                                        */}
      {/* ========================================================================= */}
      {activeSubTab === 'addons' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span>{filteredAddons.length} itens adicionais cadastrados</span>
            <span>Estes opcionais podem ser adicionados nas reservas com cálculo e estoque automático</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAddons.map((item) => (
              <div 
                key={item.id} 
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  item.active 
                    ? 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 shadow-xs' 
                    : 'bg-stone-100/60 dark:bg-stone-800/40 border-stone-200 dark:border-stone-700 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700">
                      {item.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleAdditionalItemActive(item.id)}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-colors cursor-pointer ${
                        item.active 
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200' 
                          : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 border-stone-300'
                      }`}
                      title="Clique para ativar/desativar"
                    >
                      {item.active ? 'Disponível' : 'Inativo'}
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                    {item.name}
                  </h3>

                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="my-4 pt-3 border-t border-stone-100 dark:border-stone-800 space-y-2 text-xs">
                    <div className="flex justify-between items-baseline">
                      <span className="text-stone-500">Valor Unitário:</span>
                      <span className="font-mono text-base font-bold text-amber-700 dark:text-amber-400">
                        {formatCurrency(item.price)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[11px] text-stone-500">
                      <span>Forma de Cobrança:</span>
                      <span className="font-semibold text-stone-800 dark:text-stone-200">
                        {getBillingLabel(item.billingType)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[11px] text-stone-500">
                      <span>Estoque / Disponibilidade:</span>
                      <span className="font-mono font-medium text-stone-800 dark:text-stone-200">
                        {item.stock} {item.stock === 1 ? 'disponível' : 'disponíveis'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card footer actions */}
                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEditAddonModal(item)}
                    className="p-1.5 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium"
                    title="Editar item adicional"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteAddon(item.id, item.name)}
                    className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg transition-colors flex items-center gap-1 text-xs"
                    title="Excluir item adicional"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CHECKLIST DE CONFERÊNCIA & VISTORIA                                */}
      {/* ========================================================================= */}
      {activeSubTab === 'checklist' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <ClipboardCheck className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                  Itens da Ficha Oficial de Vistoria de Entrada e Saída
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                  Estes itens compõem o checklist padrão que o administrador e o locatário assinam no check-in e check-out de cada reserva.
                </p>
              </div>
            </div>

            <button
              onClick={handleOpenNewChecklistModal}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl shadow-xs shrink-0 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Novo Item de Vistoria</span>
            </button>
          </div>

          {/* Grouped items by category */}
          <div className="space-y-6">
            {Object.keys(checklistByCategory).map((catName) => (
              <div 
                key={catName} 
                className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-xs"
              >
                <div className="px-5 py-3 bg-stone-100/70 dark:bg-stone-800/70 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                      {catName}
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
                    {checklistByCategory[catName].length} itens a conferir
                  </span>
                </div>

                <div className="divide-y divide-stone-100 dark:divide-stone-800">
                  {checklistByCategory[catName].map((checkItem, index) => (
                    <div 
                      key={checkItem.id} 
                      className="p-4 flex items-start justify-between gap-4 hover:bg-stone-50/50 dark:hover:bg-stone-800/30 transition-colors"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <span className="w-6 h-6 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <div>
                          <h4 className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100">
                            {checkItem.title}
                          </h4>
                          {checkItem.notes && (
                            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                              <strong>Instrução / Especificação:</strong> {checkItem.notes}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2 text-[10px] text-stone-400">
                            <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60 font-medium">
                              ✓ Conferência Entrada
                            </span>
                            <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60 font-medium">
                              ✓ Conferência Saída
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleOpenEditChecklistModal(checkItem)}
                          className="p-1.5 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors text-xs font-medium flex items-center gap-1"
                          title="Editar item de vistoria"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Editar</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteChecklistItem(checkItem.id, checkItem.title)}
                          className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg transition-colors"
                          title="Remover item de vistoria"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: CADASTRO / EDIÇÃO DE TIPO DE RESERVA                             */}
      {/* ========================================================================= */}
      {isTypeModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 no-print">
          <div className="relative bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/80 dark:bg-stone-800/80">
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <BookmarkCheck className="w-5 h-5 text-amber-600" />
                <span>{typeToEdit ? 'Editar Tipo de Reserva' : 'Cadastrar Novo Tipo de Reserva'}</span>
              </h2>
              <button
                type="button"
                onClick={() => setIsTypeModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveType} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Nome do Tipo de Reserva *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Fim de Semana Full (Sábado + Domingo)"
                  value={typeFormData.name}
                  onChange={(e) => setTypeFormData({ ...typeFormData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Categoria *
                  </label>
                  <select
                    value={typeFormData.category}
                    onChange={(e) => setTypeFormData({ ...typeFormData, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  >
                    <option value="diaria">Diária Comum</option>
                    <option value="pacote">Pacote de Dias (Sáb+Dom)</option>
                    <option value="pernoite">Pernoite / Retiro</option>
                    <option value="evento_especial">Festa Noturna / Balada</option>
                    <option value="ensaio">Ensaio Fotográfico / Curta Duração</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Valor da Locação (R$) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="10"
                    value={typeFormData.defaultPrice}
                    onChange={(e) => setTypeFormData({ ...typeFormData, defaultPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Taxa de Limpeza Padrão (R$)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={typeFormData.defaultCleaningFee}
                    onChange={(e) => setTypeFormData({ ...typeFormData, defaultCleaningFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Caução / Garantia (R$)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={typeFormData.defaultSecurityDeposit}
                    onChange={(e) => setTypeFormData({ ...typeFormData, defaultSecurityDeposit: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Horário Padrão de Entrada
                  </label>
                  <input
                    type="time"
                    value={typeFormData.defaultCheckin}
                    onChange={(e) => setTypeFormData({ ...typeFormData, defaultCheckin: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Horário Padrão de Saída
                  </label>
                  <input
                    type="time"
                    value={typeFormData.defaultCheckout}
                    onChange={(e) => setTypeFormData({ ...typeFormData, defaultCheckout: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Descrição detalhada do que inclui este tipo
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Inclui acesso à piscina, área gourmet, salão nobre e churrasqueira..."
                  value={typeFormData.description}
                  onChange={(e) => setTypeFormData({ ...typeFormData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-800 dark:text-stone-200">
                  <input
                    type="checkbox"
                    checked={typeFormData.allowsOvernight}
                    onChange={(e) => setTypeFormData({ ...typeFormData, allowsOvernight: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span>Permite Pernoite de Convidados</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-800 dark:text-stone-200">
                  <input
                    type="checkbox"
                    checked={typeFormData.active}
                    onChange={(e) => setTypeFormData({ ...typeFormData, active: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span>Disponível / Ativo</span>
                </label>
              </div>

              <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsTypeModalOpen(false)}
                  className="px-4 py-2 text-stone-600 dark:text-stone-300 hover:text-stone-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl shadow-xs"
                >
                  {typeToEdit ? 'Salvar Alterações' : 'Cadastrar Tipo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: CADASTRO / EDIÇÃO DE ITEM ADICIONAL                              */}
      {/* ========================================================================= */}
      {isAddonModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 no-print">
          <div className="relative bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/80 dark:bg-stone-800/80">
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-amber-600" />
                <span>{addonToEdit ? 'Editar Item Adicional' : 'Cadastrar Novo Item Adicional'}</span>
              </h2>
              <button
                type="button"
                onClick={() => setIsAddonModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddon} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Nome do Item ou Serviço *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Choperia Elétrica Profissional 2 Vias"
                  value={addonFormData.name}
                  onChange={(e) => setAddonFormData({ ...addonFormData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Categoria *
                  </label>
                  <select
                    value={addonFormData.category}
                    onChange={(e) => setAddonFormData({ ...addonFormData, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  >
                    <option value="Equipamento">Equipamento</option>
                    <option value="Mobiliário Extra">Mobiliário Extra</option>
                    <option value="Lazer & Brinquedos">Lazer & Brinquedos</option>
                    <option value="Serviço & Hora Extra">Serviço & Hora Extra</option>
                    <option value="Insumos">Insumos</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Preço Unitário (R$) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="5"
                    value={addonFormData.price}
                    onChange={(e) => setAddonFormData({ ...addonFormData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Forma de Cobrança *
                  </label>
                  <select
                    value={addonFormData.billingType}
                    onChange={(e) => setAddonFormData({ ...addonFormData, billingType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  >
                    <option value="evento">Por Evento (Valor Único)</option>
                    <option value="hora">Por Hora Adicional</option>
                    <option value="unidade">Por Unidade / Quantidade</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Estoque / Quantidade Disponível
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={addonFormData.stock}
                    onChange={(e) => setAddonFormData({ ...addonFormData, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Descrição detalhada ou especificações
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Acompanha cilindro de CO2 e 2 torneiras refrigeradas..."
                  value={addonFormData.description}
                  onChange={(e) => setAddonFormData({ ...addonFormData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-800 dark:text-stone-200">
                  <input
                    type="checkbox"
                    checked={addonFormData.active}
                    onChange={(e) => setAddonFormData({ ...addonFormData, active: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span>Disponível para Reservas (Ativo)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddonModalOpen(false)}
                  className="px-4 py-2 text-stone-600 dark:text-stone-300 hover:text-stone-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl shadow-xs"
                >
                  {addonToEdit ? 'Salvar Alterações' : 'Cadastrar Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: CADASTRO / EDIÇÃO DE ITEM DE CONFERÊNCIA (CHECKLIST)             */}
      {/* ========================================================================= */}
      {isChecklistModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 no-print">
          <div className="relative bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/80 dark:bg-stone-800/80">
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-amber-600" />
                <span>{checkItemToEdit ? 'Editar Item da Vistoria' : 'Cadastrar Novo Item de Conferência'}</span>
              </h2>
              <button
                type="button"
                onClick={() => setIsChecklistModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveChecklistItem} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Item a ser conferido *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Motores e iluminação da cascata da piscina"
                  value={checkItemFormData.title}
                  onChange={(e) => setCheckItemFormData({ ...checkItemFormData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Área / Categoria da Propriedade *
                </label>
                <select
                  value={checkItemFormData.category}
                  onChange={(e) => setCheckItemFormData({ ...checkItemFormData, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium"
                >
                  <option value="Piscina & Área Externa">Piscina & Área Externa</option>
                  <option value="Salão Principal">Salão Principal</option>
                  <option value="Cozinha & Gourmet">Cozinha & Gourmet</option>
                  <option value="Sanitários">Sanitários</option>
                  <option value="Geral & Segurança">Geral & Segurança</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Instruções ou Especificações de Teste (Opcional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Ex: Verificar se a água está cristalina, cloro no nível e bomba sem ruído..."
                  value={checkItemFormData.notes}
                  onChange={(e) => setCheckItemFormData({ ...checkItemFormData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                />
                <span className="text-[10px] text-stone-400 mt-1 block">
                  Esta orientação aparecerá na ficha de vistoria para orientar quem fizer a conferência com o cliente.
                </span>
              </div>

              <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsChecklistModalOpen(false)}
                  className="px-4 py-2 text-stone-600 dark:text-stone-300 hover:text-stone-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl shadow-xs"
                >
                  {checkItemToEdit ? 'Salvar Item' : 'Adicionar à Vistoria'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Notification Toast */}
      {notificationToast && (
        <div className="fixed top-20 right-6 z-50 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 px-5 py-3 rounded-xl shadow-xl flex items-center gap-2.5 animate-in fade-in duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span className="text-xs font-semibold">{notificationToast}</span>
        </div>
      )}

      {/* In-App Deletion Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base">
                  Confirmar Exclusão
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                  Tem certeza que deseja {itemToDelete.type === 'reset-checklist' ? 'restaurar' : 'excluir'}:
                </p>
                <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 mt-0.5">
                  "{itemToDelete.name}"?
                </p>
                <p className="text-[11px] text-stone-400 mt-1">
                  Esta ação não poderá ser desfeita.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDeleteAction}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition-colors"
              >
                Sim, Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
