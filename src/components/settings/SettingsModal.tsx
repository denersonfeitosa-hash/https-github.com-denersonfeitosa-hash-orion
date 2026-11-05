import React, { useState } from 'react';
import { X, Save, Download, Upload, RotateCcw, Building, DollarSign, ShieldAlert } from 'lucide-react';
import { useVenue } from '../../context/VenueContext';
import { VenueConfig } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { 
    venueConfig, 
    setVenueConfig, 
    exportBackupJSON, 
    importBackupJSON, 
    resetAllData 
  } = useVenue();

  const [formData, setFormData] = useState<VenueConfig>(venueConfig);
  const [importJsonText, setImportJsonText] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'pricing' | 'backup'>('info');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVenueConfig(formData);
    alert('Configurações do espaço salvas com sucesso!');
    onClose();
  };

  const handleDownloadBackup = () => {
    const jsonStr = exportBackupJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_orion_eventos_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = () => {
    if (!importJsonText.trim()) return;
    const ok = importBackupJSON(importJsonText);
    if (ok) {
      alert('Backup restaurado com sucesso!');
      onClose();
    } else {
      alert('Erro: Arquivo JSON inválido.');
    }
  };

  const handleReset = () => {
    if (window.confirm('Tem certeza que deseja restaurar os dados de demonstração? Todas as alterações manuais serão resetadas.')) {
      resetAllData();
      alert('Dados restaurados para o padrão de demonstração.');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 no-print">
      <div className="relative bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/80 dark:bg-stone-800/80">
          <div>
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Configurações do Espaço de Eventos
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Personalize dados cadastrais, chave PIX, preços base e faça backup.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-200/50 dark:hover:bg-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-6 py-2 bg-stone-100/60 dark:bg-stone-800/40 border-b border-stone-200 dark:border-stone-800 flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-colors ${
              activeTab === 'info'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-bold shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            Dados do Espaço
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pricing')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-colors ${
              activeTab === 'pricing'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-bold shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            Tabela de Preços & Regras
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('backup')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-colors ${
              activeTab === 'backup'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-bold shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            Backup & Dados
          </button>
        </div>

        {/* Form Body */}
        <div className="overflow-y-auto p-6 space-y-6 text-xs flex-1">
          {activeTab === 'info' && (
            <div className="space-y-5">
              
              {/* Logotipo da Empresa */}
              <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/40">
                <label className="block text-stone-800 dark:text-stone-200 font-bold mb-1">
                  Logotipo Oficial da Empresa (para Relatórios e Documentos em PDF)
                </label>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mb-3">
                  O logotipo cadastrado aqui será impresso no cabeçalho dos Relatórios de Receitas/Despesas, Contratos, Recibos e Confirmações.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Logo Preview */}
                  <div className="w-24 h-24 rounded-xl border-2 border-dashed border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                    {formData.logoUrl ? (
                      <img 
                        src={formData.logoUrl} 
                        alt="Logotipo da empresa" 
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <div className="text-center p-2 text-stone-400">
                        <span className="text-2xl font-bold block text-amber-600">Ó</span>
                        <span className="text-[9px] block">Sem logo</span>
                      </div>
                    )}
                  </div>

                  {/* Upload controls */}
                  <div className="flex-1 space-y-2 w-full">
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        id="logoUploadInput"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 2 * 1024 * 1024) {
                              alert('A imagem é muito grande. Escolha uma imagem de até 2MB.');
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
                        }}
                        className="hidden"
                      />
                      <div className="flex items-center gap-2">
                        <label
                          htmlFor="logoUploadInput"
                          className="px-3.5 py-2 text-xs font-semibold text-stone-800 dark:text-stone-200 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:bg-stone-100 rounded-lg cursor-pointer transition-colors shadow-xs"
                        >
                          Carregar Imagem do Dispositivo
                        </label>
                        {formData.logoUrl && (
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, logoUrl: undefined }))}
                            className="px-3 py-2 text-xs text-red-600 hover:text-red-700 font-medium"
                          >
                            Remover Logotipo
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="Ou cole a URL direta da imagem do logotipo..."
                        value={formData.logoUrl || ''}
                        onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Nome do Espaço / Chácara
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Slogan / Subtítulo
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    CNPJ ou CPF (para o Contrato)
                  </label>
                  <input
                    type="text"
                    value={formData.cnpj}
                    onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Capacidade Máxima de Pessoas
                  </label>
                  <input
                    type="number"
                    value={formData.maxCapacity}
                    onChange={(e) => setFormData({ ...formData, maxCapacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Telefone de Contato
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    WhatsApp Comercial (somente dígitos)
                  </label>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Chave PIX para Recebimentos
                  </label>
                  <input
                    type="text"
                    value={formData.pixKey}
                    onChange={(e) => setFormData({ ...formData, pixKey: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Tipo de Chave PIX
                  </label>
                  <input
                    type="text"
                    value={formData.pixType}
                    onChange={(e) => setFormData({ ...formData, pixType: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Endereço Completo do Espaço
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-4">
              <h4 className="font-bold text-stone-900 dark:text-stone-100">
                Preços Padrão para Simulações e Novas Reservas
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Diária Fim de Semana (R$)
                  </label>
                  <input
                    type="number"
                    value={formData.defaultPricing.singleDayWeekend}
                    onChange={(e) => setFormData({
                      ...formData,
                      defaultPricing: { ...formData.defaultPricing, singleDayWeekend: Number(e.target.value) }
                    })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Diária Dia de Semana (R$)
                  </label>
                  <input
                    type="number"
                    value={formData.defaultPricing.singleDayWeekday}
                    onChange={(e) => setFormData({
                      ...formData,
                      defaultPricing: { ...formData.defaultPricing, singleDayWeekday: Number(e.target.value) }
                    })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Pacote Fim de Semana Full (Sáb + Dom) (R$)
                  </label>
                  <input
                    type="number"
                    value={formData.defaultPricing.weekendFull}
                    onChange={(e) => setFormData({
                      ...formData,
                      defaultPricing: { ...formData.defaultPricing, weekendFull: Number(e.target.value) }
                    })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Taxa de Limpeza Padrão (R$)
                  </label>
                  <input
                    type="number"
                    value={formData.defaultPricing.cleaningFee}
                    onChange={(e) => setFormData({
                      ...formData,
                      defaultPricing: { ...formData.defaultPricing, cleaningFee: Number(e.target.value) }
                    })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Caução / Garantia Exigida (R$)
                  </label>
                  <input
                    type="number"
                    value={formData.defaultPricing.securityDeposit}
                    onChange={(e) => setFormData({
                      ...formData,
                      defaultPricing: { ...formData.defaultPricing, securityDeposit: Number(e.target.value) }
                    })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 space-y-2">
                <h4 className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-emerald-600" />
                  <span>Exportar Cópia de Segurança (Backup)</span>
                </h4>
                <p className="text-stone-500">
                  Baixe um arquivo JSON com todas as suas reservas, contratos, lançamentos de caixa e inventário.
                </p>
                <button
                  type="button"
                  onClick={handleDownloadBackup}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Fazer Download do Arquivo JSON
                </button>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 space-y-2">
                <h4 className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-blue-600" />
                  <span>Restaurar Backup</span>
                </h4>
                <p className="text-stone-500">
                  Cole o código JSON do seu backup para restaurar seus dados.
                </p>
                <textarea
                  rows={3}
                  placeholder="Cole o JSON de backup aqui..."
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  className="w-full p-2 rounded-lg border border-stone-200 dark:border-stone-700 font-mono text-[11px]"
                />
                <button
                  type="button"
                  onClick={handleImportSubmit}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Restaurar do Texto
                </button>
              </div>

              <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/20 space-y-2">
                <h4 className="font-bold text-red-800 dark:text-red-300 flex items-center gap-1.5">
                  <RotateCcw className="w-4 h-4" />
                  <span>Restaurar Dados Iniciais de Demonstração</span>
                </h4>
                <p className="text-stone-600 dark:text-stone-400">
                  Volta o aplicativo com as fotos geradas, reservas de exemplo em novembro/2026 e financeiro inicial do Órion.
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Restaurar Dados Padrão
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-800/80 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-stone-600 dark:text-stone-300 hover:text-stone-900"
          >
            Fechar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-1.5 px-5 py-2 text-white bg-amber-600 hover:bg-amber-700 font-semibold rounded-lg shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Configurações</span>
          </button>
        </div>

      </div>
    </div>
  );
};
