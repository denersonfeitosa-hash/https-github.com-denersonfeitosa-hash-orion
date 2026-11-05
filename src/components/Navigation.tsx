import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar, 
  CalendarCheck, 
  DollarSign, 
  Home, 
  Settings, 
  PlusCircle, 
  Layers,
  FileSpreadsheet,
  Building2,
  ChevronDown,
  Menu,
  Check,
  X
} from 'lucide-react';
import { useVenue } from '../context/VenueContext';

export type NavTab = 
  | 'dashboard' 
  | 'reservations' 
  | 'calendar' 
  | 'finance' 
  | 'reports' 
  | 'catalog'
  | 'reservation-types' 
  | 'addons' 
  | 'spaces'
  | 'company';

interface NavigationProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenNewReservation: () => void;
  onOpenSettings: () => void;
}

interface MenuItem {
  id: NavTab;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  isHighlight?: boolean;
}

interface MenuGroup {
  groupName: string;
  items: MenuItem[];
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewReservation,
  onOpenSettings,
}) => {
  const { venueConfig } = useVenue();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  const menuGroups: MenuGroup[] = [
    {
      groupName: 'Visão & Agenda',
      items: [
        {
          id: 'dashboard',
          label: 'Visão Geral',
          sublabel: 'Resumo geral, métricas de ocupação e alertas rápidos',
          icon: Home,
        },
        {
          id: 'reservations',
          label: 'Reservas',
          sublabel: 'Gestão de contratos, recibos, status e lista de locações',
          icon: CalendarCheck,
          badge: 'Principal',
        },
        {
          id: 'calendar',
          label: 'Calendário & Agenda',
          sublabel: 'Mapa visual de ocupação mensal e horários disponíveis',
          icon: Calendar,
        },
      ],
    },
    {
      groupName: 'Financeiro & Documentos',
      items: [
        {
          id: 'finance',
          label: 'Financeiro & Caixa',
          sublabel: 'Controle de pagamentos, cauções, receitas e despesas',
          icon: DollarSign,
        },
        {
          id: 'reports',
          label: 'Relatórios em PDF',
          sublabel: 'Exportação e download de relatórios detalhados em .pdf',
          icon: FileSpreadsheet,
          badge: 'PDF',
          isHighlight: true,
        },
      ],
    },
    {
      groupName: 'Cadastros & Configurações',
      items: [
        {
          id: 'catalog',
          label: 'Cadastros & Itens',
          sublabel: 'Tipos de reserva, itens adicionais e checklist de conferência',
          icon: Layers,
        },
        {
          id: 'spaces',
          label: 'Espaços & Áreas',
          sublabel: 'Salões, quiosques, churrasqueiras e capacidades',
          icon: Home,
        },
        {
          id: 'company',
          label: 'Dados da Empresa',
          sublabel: 'Razão social, logotipo, CNPJ, dados de contato e recibos',
          icon: Building2,
          badge: 'Logo & Dados',
          isHighlight: true,
        },
      ],
    },
  ];

  // Helper to get active tab title
  const getActiveTabTitle = (tab: NavTab): string => {
    switch (tab) {
      case 'dashboard':
        return 'Visão Geral';
      case 'reservations':
        return 'Reservas';
      case 'calendar':
        return 'Calendário';
      case 'finance':
        return 'Financeiro';
      case 'reports':
        return 'Relatórios em PDF';
      case 'catalog':
      case 'reservation-types':
      case 'addons':
        return 'Cadastros & Itens';
      case 'spaces':
        return 'Espaços';
      case 'company':
        return 'Dados da Empresa';
      default:
        return 'Visão Geral';
    }
  };

  const handleSelectTab = (tab: NavTab) => {
    setActiveTab(tab);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 no-print transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 h-16">
          
          {/* Left: Brand Wordmark + Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => handleSelectTab('dashboard')}
              className="text-left group cursor-pointer flex items-center gap-2.5"
              title="Ir para a Visão Geral"
            >
              {venueConfig.logoUrl ? (
                <img 
                  src={venueConfig.logoUrl} 
                  alt={venueConfig.name} 
                  className="w-9 h-9 object-contain rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 shadow-xs" 
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white font-bold text-base shadow-sm group-hover:bg-amber-700 transition-colors">
                  Ó
                </div>
              )}
              <div>
                <span className="text-base sm:text-lg font-bold tracking-tight text-stone-900 dark:text-stone-100 whitespace-nowrap block leading-tight">
                  {venueConfig.name}
                </span>
                <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium whitespace-nowrap hidden sm:block">
                  Gestão de Aluguel & Lazer
                </span>
              </div>
            </button>
          </div>

          {/* Center: Dropdown "Menu Principal" */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border cursor-pointer ${
                isMenuOpen
                  ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-400/30'
                  : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:border-amber-400 dark:hover:border-amber-500 shadow-xs'
              }`}
              aria-expanded={isMenuOpen}
              aria-haspopup="true"
              title="Clique para abrir o menu de navegação completo"
            >
              <Menu className={`w-4 h-4 transition-transform ${isMenuOpen ? 'rotate-90' : ''}`} />
              <span>Menu Principal</span>
              
              {/* Active Tab Badge Indicator */}
              <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-colors hidden md:inline-block ${
                isMenuOpen
                  ? 'bg-amber-700 text-amber-100'
                  : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
              }`}>
                {getActiveTabTitle(activeTab)}
              </span>

              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu Flyout */}
            {isMenuOpen && (
              <div 
                className="absolute left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 top-full mt-2 w-[340px] sm:w-[480px] md:w-[620px] max-h-[85vh] overflow-y-auto bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl p-3 sm:p-4 z-50 animate-in fade-in zoom-in-95 duration-150 scrollbar-thin"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100 dark:border-stone-800 px-1">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                      Navegação Principal
                    </h3>
                    <p className="text-[12px] text-stone-600 dark:text-stone-400">
                      Selecione a tela ou módulo que deseja acessar
                    </p>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
                    title="Fechar menu"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {menuGroups.map((group, groupIdx) => (
                    <div 
                      key={groupIdx} 
                      className={`space-y-1.5 ${groupIdx === 2 ? 'md:col-span-2 pt-2 border-t border-stone-100 dark:border-stone-800' : ''}`}
                    >
                      <h4 className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider px-2 py-0.5">
                        {group.groupName}
                      </h4>
                      <div className="space-y-1">
                        {group.items.map((item) => {
                          const Icon = item.icon;
                          const isActive = 
                            activeTab === item.id || 
                            (item.id === 'catalog' && (activeTab === 'reservation-types' || activeTab === 'addons'));

                          return (
                            <button
                              key={item.id}
                              onClick={() => handleSelectTab(item.id)}
                              className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                                isActive
                                  ? 'bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-950 dark:text-amber-100 shadow-xs'
                                  : 'hover:bg-stone-100 dark:hover:bg-stone-800/80 border border-transparent text-stone-700 dark:text-stone-300'
                              }`}
                            >
                              <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                                isActive
                                  ? 'bg-amber-600 text-white shadow-xs'
                                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/40 group-hover:text-amber-600'
                              }`}>
                                <Icon className="w-4 h-4" />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <span className={`text-xs sm:text-sm font-semibold truncate ${
                                    isActive ? 'text-amber-900 dark:text-amber-200' : 'text-stone-900 dark:text-stone-100'
                                  }`}>
                                    {item.label}
                                  </span>

                                  {item.badge && (
                                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 shrink-0">
                                      {item.badge}
                                    </span>
                                  )}
                                  {isActive && (
                                    <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                                  )}
                                </div>
                                <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-tight mt-0.5 line-clamp-1">
                                  {item.sublabel}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer of Dropdown */}
                <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 px-1">
                  <span>Espaço: <strong className="text-stone-800 dark:text-stone-200">{venueConfig.name}</strong></span>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenNewReservation();
                    }}
                    className="text-amber-600 hover:text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>+ Nova Reserva Rápida</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Zone: Quick Shortcuts & Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick jump to Reservations on larger screens */}
            <button
              onClick={() => handleSelectTab('reservations')}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                activeTab === 'reservations'
                  ? 'bg-amber-100 dark:bg-amber-950/70 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 shadow-xs'
                  : 'bg-stone-50 hover:bg-stone-100 dark:bg-stone-850 dark:hover:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
              }`}
              title="Acessar lista de reservas"
            >
              <CalendarCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Reservas</span>
            </button>

            {/* Quick jump to Company Data */}
            <button
              onClick={() => handleSelectTab('company')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                activeTab === 'company'
                  ? 'bg-amber-100 dark:bg-amber-950/70 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
              }`}
              title="Cadastro de Dados da Empresa, Logotipo & Configurações"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="hidden sm:inline">Dados da Empresa</span>
            </button>

            {/* Quick Settings Icon */}
            <button
              onClick={onOpenSettings}
              className="p-2 text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors border border-transparent hover:border-stone-200 dark:hover:border-stone-700"
              title="Configurações Rápidas"
              aria-label="Configurações Rápidas"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenNewReservation}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs font-semibold text-white bg-amber-600 rounded-xl hover:bg-amber-700 active:scale-[0.98] transition-all whitespace-nowrap shadow-sm shadow-amber-600/20"
              title="Criar nova reserva"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Nova Reserva</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
