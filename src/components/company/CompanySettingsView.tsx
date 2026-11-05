import React, { useState } from 'react';
import { 
  Building2, 
  Upload, 
  Trash2, 
  Check, 
  Save, 
  FileText, 
  Phone, 
  Mail, 
  MapPin, 
  DollarSign, 
  Clock, 
  Users, 
  ShieldCheck, 
  Download, 
  RotateCcw, 
  Plus, 
  ExternalLink,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useVenue } from '../../context/VenueContext';
import { VenueConfig } from '../../types';

export const CompanySettingsView: React.FC = () => {
  const { 
    venueConfig, 
    setVenueConfig, 
    exportBackupJSON, 
    importBackupJSON, 
    resetAllData,
    formatCurrency 
  } = useVenue();

  const [formData, setFormData] = useState<VenueConfig>(venueConfig);
  const [activeSection, setActiveSection] = useState<'geral' | 'endereco' | 'pix' | 'precos' | 'regras' | 'backup'>('geral');
  const [newRuleText, setNewRuleText] = useState('');
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');

  // Update formData if venueConfig changes externally
  React.useEffect(() => {
    setFormData(venueConfig);
  }, [venueConfig]);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setVenueConfig(formData);
    setShowSaveToast(true);
    setTimeout(() => {
      setShowSaveToast(false);
    }, 3500);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2.5 * 1024 * 1024) {
        alert('A imagem selecionada é muito pesada (máximo 2.5MB). Por favor, escolha um arquivo menor.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setFormData(prev => ({ ...prev, logoUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    if (window.confirm('Deseja remover o logotipo cadastrado?')) {
      setFormData(prev => ({ ...prev, logoUrl: undefined }));
    }
  };

  const handleAddRule = () => {
    if (!newRuleText.trim()) return;
    setFormData(prev => ({
      ...prev,
      rules: [...(prev.rules || []), newRuleText.trim()]
    }));
    setNewRuleText('');
  };

  const handleRemoveRule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, idx) => idx !== index)
    }));
  };

  const handleDownloadBackup = () => {
    const jsonStr = exportBackupJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_empresa_orion_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = () => {
    if (!importJsonText.trim()) return;
    const ok = importBackupJSON(importJsonText);
    if (ok) {
      alert('Backup e dados da empresa restaurados com sucesso!');
      setImportJsonText('');
    } else {
      alert('Erro: O conteúdo colado não é um JSON de backup válido.');
    }
  };

  const handleResetData = () => {
    if (window.confirm('Atenção: Deseja restaurar todos os dados para o padrão inicial de demonstração? As modificações não salvas serão substituídas.')) {
      resetAllData();
      alert('Dados padrão restaurados com sucesso!');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {showSaveToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-bold text-sm">Dados da empresa salvos com sucesso!</p>
            <p className="text-xs text-emerald-100">Atualizado nos relatórios em PDF, contratos e recibos.</p>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-600/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <span>Cadastro de Dados da Empresa</span>
                <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  Espaço & Identidade
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                Gerencie o logotipo, razão social, CNPJ, contatos, chave PIX e regras que aparecem nos relatórios e contratos.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-amber-600/20 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Alterações</span>
          </button>
        </div>
      </div>

      {/* Quick Navigation Tabs for Company Settings */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-stone-200 dark:border-stone-800 text-xs sm:text-sm scrollbar-none">
        <button
          onClick={() => setActiveSection('geral')}
          className={`flex items-center gap-1.5 px-4 py-2 font-medium rounded-lg whitespace-nowrap transition-colors ${
            activeSection === 'geral'
              ? 'bg-amber-600 text-white font-bold shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Identidade & Logotipo</span>
        </button>

        <button
          onClick={() => setActiveSection('endereco')}
          className={`flex items-center gap-1.5 px-4 py-2 font-medium rounded-lg whitespace-nowrap transition-colors ${
            activeSection === 'endereco'
              ? 'bg-amber-600 text-white font-bold shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Endereço & Contatos</span>
        </button>

        <button
          onClick={() => setActiveSection('pix')}
          className={`flex items-center gap-1.5 px-4 py-2 font-medium rounded-lg whitespace-nowrap transition-colors ${
            activeSection === 'pix'
              ? 'bg-amber-600 text-white font-bold shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Chave PIX & Cobrança</span>
        </button>

        <button
          onClick={() => setActiveSection('precos')}
          className={`flex items-center gap-1.5 px-4 py-2 font-medium rounded-lg whitespace-nowrap transition-colors ${
            activeSection === 'precos'
              ? 'bg-amber-600 text-white font-bold shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Preços Base & Horários</span>
        </button>

        <button
          onClick={() => setActiveSection('regras')}
          className={`flex items-center gap-1.5 px-4 py-2 font-medium rounded-lg whitespace-nowrap transition-colors ${
            activeSection === 'regras'
              ? 'bg-amber-600 text-white font-bold shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Regras do Espaço ({formData.rules?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveSection('backup')}
          className={`flex items-center gap-1.5 px-4 py-2 font-medium rounded-lg whitespace-nowrap transition-colors ${
            activeSection === 'backup'
              ? 'bg-amber-600 text-white font-bold shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Cópia de Segurança & Backup</span>
        </button>
      </div>

      {/* Main Form Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left/Middle Column: Form Controls */}
        <div className="lg:col-span-2 space-y-6">

          {/* SECTION 1: IDENTIDADE & LOGOTIPO */}
          {activeSection === 'geral' && (
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-6">
              
              {/* Logotipo Section */}
              <div className="p-5 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      Logotipo Oficial da Empresa / Espaço
                    </h3>
                  </div>
                  {formData.logoUrl && (
                    <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Logotipo Ativo
                    </span>
                  )}
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-400 mb-4">
                  O logotipo cadastrado aqui é inserido automaticamente no cabeçalho de todos os <strong>Relatórios em PDF</strong>, <strong>Confirmações de Agendamento</strong>, <strong>Recibos de Pagamento</strong> e <strong>Contratos de Locação</strong>.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-5">
                  {/* Logo Preview Frame */}
                  <div className="w-28 h-28 rounded-2xl border-2 border-dashed border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 flex items-center justify-center overflow-hidden shrink-0 shadow-sm relative group">
                    {formData.logoUrl ? (
                      <img 
                        src={formData.logoUrl} 
                        alt="Logotipo da empresa" 
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <div className="text-center p-3 text-stone-400">
                        <div className="w-10 h-10 mx-auto rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-lg mb-1">
                          Ó
                        </div>
                        <span className="text-[10px] font-medium block">Sem logotipo</span>
                      </div>
                    )}
                  </div>

                  {/* Actions for Logo */}
                  <div className="flex-1 space-y-3 w-full">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <input
                        type="file"
                        accept="image/*"
                        id="companyLogoFileInput"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="companyLogoFileInput"
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-stone-800 dark:text-stone-200 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-700 rounded-xl cursor-pointer shadow-xs transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5 text-amber-600" />
                        <span>Carregar do Dispositivo</span>
                      </label>

                      {formData.logoUrl && (
                        <button
                          type="button"
                          onClick={handleRemoveLogo}
                          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors border border-transparent hover:border-red-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remover Logo</span>
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-stone-600 dark:text-stone-400 mb-1">
                        Ou insira uma URL direta para a imagem do logotipo:
                      </label>
                      <input
                        type="url"
                        placeholder="https://exemplo.com/logotipo.png"
                        value={formData.logoUrl || ''}
                        onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dados Cadastrais Principais */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 pb-2 border-b border-stone-100 dark:border-stone-800 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-600" />
                  <span>Dados Cadastrais da Empresa / Espaço</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Nome Comercial / Nome Fantasia *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Órion Eventos e Lazer"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Razão Social / Nome do Locador (Proprietário)
                    </label>
                    <input
                      type="text"
                      value={formData.legalName || ''}
                      onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                      placeholder="Ex: Órion Eventos e Lazer Empreendimentos Eireli"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      CNPJ ou CPF (Aparece no Contrato e Recibos) *
                    </label>
                    <input
                      type="text"
                      value={formData.cnpj}
                      onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                      placeholder="00.000.000/0001-00"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Inscrição Estadual ou Municipal (Opcional)
                    </label>
                    <input
                      type="text"
                      value={formData.stateRegistration || ''}
                      onChange={(e) => setFormData({ ...formData, stateRegistration: e.target.value })}
                      placeholder="Isento ou nº da inscrição"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Slogan ou Subtítulo do Espaço
                    </label>
                    <input
                      type="text"
                      value={formData.tagline}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      placeholder="Ex: Espaço Completo para Festas, Confraternizações e Fins de Semana"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Capacidade Máxima Permitida de Pessoas
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.maxCapacity}
                        onChange={(e) => setFormData({ ...formData, maxCapacity: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono focus:ring-2 focus:ring-amber-500"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-stone-400">convidados</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* SECTION 2: ENDEREÇO & CONTATOS */}
          {activeSection === 'endereco' && (
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-6">
              
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 pb-2 border-b border-stone-100 dark:border-stone-800 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  <span>Localização e Endereço do Espaço</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Logradouro Completo / Estrada / Rua com Número *
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Ex: Estrada dos Eucaliptos, Km 4,5 - Vale Verde"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Cidade e Estado (UF) *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Ex: São Paulo - SP"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      CEP
                    </label>
                    <input
                      type="text"
                      value={formData.zipCode || ''}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      placeholder="00000-000"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-stone-100 dark:border-stone-800">
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 pb-2 border-b border-stone-100 dark:border-stone-800 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-600" />
                  <span>Canais de Atendimento e Contato</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      WhatsApp Comercial (Dígitos com DDD) *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value.replace(/\D/g, '') })}
                        placeholder="Ex: 5511987654321"
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono"
                      />
                      {formData.whatsapp && (
                        <a
                          href={`https://wa.me/${formData.whatsapp}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-1 font-medium text-xs shrink-0"
                          title="Testar link do WhatsApp"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Testar</span>
                        </a>
                      )}
                    </div>
                    <span className="text-[10px] text-stone-400 mt-1 block">
                      Usado para o envio de confirmações e orçamentos via WhatsApp.
                    </span>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Telefone Fixo / Celular (Formatado)
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(11) 98765-4321"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      E-mail Comercial Oficial
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="contato@orioneventoselazer.com.br"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* SECTION 3: CHAVE PIX & COBRANÇA */}
          {activeSection === 'pix' && (
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-6">
              
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <div className="text-xs">
                  <h4 className="font-bold text-emerald-900 dark:text-emerald-300">
                    Instruções para Pagamento por PIX
                  </h4>
                  <p className="text-emerald-800/80 dark:text-emerald-400/80 mt-0.5">
                    Estes dados de pagamento são inseridos automaticamente no <strong>Comprovante de Reserva</strong> e na <strong>Confirmação de Agendamento</strong> enviados para o cliente.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Tipo de Chave PIX *
                  </label>
                  <select
                    value={formData.pixType}
                    onChange={(e) => setFormData({ ...formData, pixType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium"
                  >
                    <option value="CNPJ">CNPJ</option>
                    <option value="CPF">CPF</option>
                    <option value="Celular / Telefone">Celular / Telefone</option>
                    <option value="E-mail">E-mail</option>
                    <option value="Chave Aleatória (EVP)">Chave Aleatória (EVP)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Chave PIX Cadastrada *
                  </label>
                  <input
                    type="text"
                    value={formData.pixKey}
                    onChange={(e) => setFormData({ ...formData, pixKey: e.target.value })}
                    placeholder="Cole sua chave PIX aqui..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono font-medium focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Titular da Conta / Favorecido (Para conferência do cliente)
                  </label>
                  <input
                    type="text"
                    value={formData.pixBeneficiary || ''}
                    onChange={(e) => setFormData({ ...formData, pixBeneficiary: e.target.value })}
                    placeholder="Ex: Órion Eventos e Locações Ltda - Banco Cora / Nubank / Itaú"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>

            </div>
          )}

          {/* SECTION 4: PREÇOS BASE & HORÁRIOS */}
          {activeSection === 'precos' && (
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-6">
              
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 pb-2 border-b border-stone-100 dark:border-stone-800 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Horários Operacionais Padrão</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mt-3">
                  <div>
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Horário Padrão de Entrada (Check-in)
                    </label>
                    <input
                      type="time"
                      value={formData.standardCheckin}
                      onChange={(e) => setFormData({ ...formData, standardCheckin: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Horário Padrão de Saída (Check-out)
                    </label>
                    <input
                      type="time"
                      value={formData.standardCheckout}
                      onChange={(e) => setFormData({ ...formData, standardCheckout: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 pb-2 border-b border-stone-100 dark:border-stone-800 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-amber-600" />
                  <span>Tabela de Preços e Taxas Base (R$)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs mt-3">
                  <div>
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Diária Fim de Semana (R$)
                    </label>
                    <input
                      type="number"
                      value={formData.defaultPricing.singleDayWeekend}
                      onChange={(e) => setFormData({
                        ...formData,
                        defaultPricing: { ...formData.defaultPricing, singleDayWeekend: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Diária Dia de Semana (R$)
                    </label>
                    <input
                      type="number"
                      value={formData.defaultPricing.singleDayWeekday}
                      onChange={(e) => setFormData({
                        ...formData,
                        defaultPricing: { ...formData.defaultPricing, singleDayWeekday: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Fim de Semana Completo (R$)
                    </label>
                    <input
                      type="number"
                      value={formData.defaultPricing.weekendFull}
                      onChange={(e) => setFormData({
                        ...formData,
                        defaultPricing: { ...formData.defaultPricing, weekendFull: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Taxa de Limpeza Padrão (R$)
                    </label>
                    <input
                      type="number"
                      value={formData.defaultPricing.cleaningFee}
                      onChange={(e) => setFormData({
                        ...formData,
                        defaultPricing: { ...formData.defaultPricing, cleaningFee: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Caução / Garantia Exigida (R$)
                    </label>
                    <input
                      type="number"
                      value={formData.defaultPricing.securityDeposit}
                      onChange={(e) => setFormData({
                        ...formData,
                        defaultPricing: { ...formData.defaultPricing, securityDeposit: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* SECTION 5: REGRAS DO ESPAÇO */}
          {activeSection === 'regras' && (
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-6">
              
              <div className="flex items-center justify-between gap-4 pb-2 border-b border-stone-100 dark:border-stone-800">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>Regras do Espaço & Cláusulas do Contrato</span>
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Estas cláusulas são impressas na íntegra no Contrato de Locação Oficial assinado pelo cliente.
                  </p>
                </div>
              </div>

              {/* Add New Rule Input */}
              <div className="flex gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Digite uma nova regra (ex: Proibido som automotivo de alta potência)..."
                  value={newRuleText}
                  onChange={(e) => setNewRuleText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddRule();
                    }
                  }}
                  className="flex-1 px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
                <button
                  type="button"
                  onClick={handleAddRule}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl flex items-center gap-1.5 shrink-0 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Regra</span>
                </button>
              </div>

              {/* Existing Rules List */}
              <div className="space-y-2">
                {formData.rules?.map((rule, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-start justify-between gap-3 p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/40 text-xs"
                  >
                    <div className="flex items-start gap-2.5 flex-1">
                      <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-stone-800 dark:text-stone-200 leading-relaxed">
                        {rule}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveRule(idx)}
                      className="p-1 text-stone-400 hover:text-red-600 rounded-lg transition-colors shrink-0"
                      title="Excluir regra"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* SECTION 6: BACKUP & DADOS */}
          {activeSection === 'backup' && (
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-6">
              
              <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-3">
                <div className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                    Exportar Cópia de Segurança Completa (Backup JSON)
                  </h4>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  Baixe um arquivo seguro contendo todos os dados do seu espaço: logotipo, dados da empresa, reservas, histórico financeiro de receitas e despesas, checklist de vistoria e itens adicionais.
                </p>
                <button
                  type="button"
                  onClick={handleDownloadBackup}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Baixar Arquivo JSON de Backup</span>
                </button>
              </div>

              <div className="p-5 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 space-y-3">
                <div className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                    Restaurar Backup do Sistema
                  </h4>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  Cole o código JSON do seu backup anterior para restaurar todas as informações cadastradas.
                </p>
                <textarea
                  rows={3}
                  placeholder="Cole aqui o texto do seu arquivo de backup (.json)..."
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono text-[11px]"
                />
                <button
                  type="button"
                  onClick={handleImportSubmit}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-colors"
                >
                  Restaurar do JSON Colado
                </button>
              </div>

              <div className="p-5 rounded-2xl border border-red-200 dark:border-red-900/60 bg-red-50/40 dark:bg-red-950/20 space-y-3">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <h4 className="font-bold text-sm text-red-900 dark:text-red-300">
                    Restaurar Demonstração Original do Órion
                  </h4>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  Reinicializa os dados do espaço de eventos para a demonstração original do Órion Eventos e Lazer com reservas e financeiro de exemplo.
                </p>
                <button
                  type="button"
                  onClick={handleResetData}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl transition-colors"
                >
                  Restaurar Padrão de Demonstração
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Right Column: Live Document Header Preview */}
        <div className="space-y-6">
          
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-4 sticky top-20">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-600" />
                <span>Pré-visualização nos Documentos</span>
              </h3>
              <span className="text-[10px] text-stone-400">Em tempo real</span>
            </div>

            <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
              Veja abaixo como o logotipo e os dados cadastrados aparecem no topo dos <strong>Relatórios em PDF</strong>, <strong>Contratos</strong> e <strong>Recibos</strong> emitidos pelo sistema:
            </p>

            {/* Simulated Report Header Box */}
            <div className="p-4 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 shadow-sm space-y-3 text-stone-900 dark:text-stone-100">
              <div className="flex items-center gap-3">
                {formData.logoUrl ? (
                  <img 
                    src={formData.logoUrl} 
                    alt="Logo" 
                    className="w-12 h-12 object-contain rounded-md border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 p-0.5 shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-amber-600 text-white font-bold flex items-center justify-center text-xl shrink-0">
                    Ó
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-sm truncate leading-tight">
                    {formData.name || 'Nome do Espaço'}
                  </h4>
                  {formData.tagline && (
                    <p className="text-[10px] text-stone-500 dark:text-stone-400 truncate">
                      {formData.tagline}
                    </p>
                  )}
                  <p className="text-[10px] text-stone-600 dark:text-stone-300 truncate font-mono mt-0.5">
                    CNPJ: {formData.cnpj || '00.000.000/0001-00'}
                  </p>
                </div>
              </div>

              <div className="text-[10px] space-y-1 text-stone-600 dark:text-stone-400 border-t border-stone-200 dark:border-stone-700 pt-2 font-sans">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                  <span className="truncate">{formData.address || 'Endereço'}, {formData.city || 'Cidade - UF'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-stone-400 shrink-0" />
                  <span>{formData.phone || formData.whatsapp}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-3 h-3 text-stone-400 shrink-0" />
                  <span className="font-mono">PIX ({formData.pixType}): {formData.pixKey}</span>
                </div>
              </div>
            </div>

            {/* Quick Summary Badges */}
            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800 text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Capacidade Máxima:</span>
                <span className="font-bold font-mono">{formData.maxCapacity} pessoas</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Check-in Padrão:</span>
                <span className="font-bold font-mono">{formData.standardCheckin}h</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Check-out Padrão:</span>
                <span className="font-bold font-mono">{formData.standardCheckout}h</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Diária Fim de Semana:</span>
                <span className="font-bold font-mono text-amber-700 dark:text-amber-400">
                  {formatCurrency(formData.defaultPricing?.singleDayWeekend || 0)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="w-full flex items-center justify-center gap-2 py-3 bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Dados Cadastrais</span>
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};
