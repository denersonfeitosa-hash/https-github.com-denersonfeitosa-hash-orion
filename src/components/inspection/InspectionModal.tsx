import React, { useState, useEffect, useRef } from 'react';
import { X, ClipboardCheck, Printer, Check, AlertCircle, Save, Download, Loader2, CheckCircle2 } from 'lucide-react';
import { useVenue } from '../../context/VenueContext';
import { Reservation, InspectionRecord } from '../../types';
import { downloadElementAsPdf } from '../../utils/pdfGenerator';

interface InspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation | null;
}

export const InspectionModal: React.FC<InspectionModalProps> = ({
  isOpen,
  onClose,
  reservation
}) => {
  const { 
    getInspectionForReservation, 
    saveInspection, 
    formatCurrency, 
    formatDateBR, 
    venueConfig 
  } = useVenue();

  const [inspection, setInspection] = useState<InspectionRecord | null>(null);
  const [activeTab, setActiveTab] = useState<'checkin' | 'checkout'>('checkin');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const inspectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reservation && isOpen) {
      const record = getInspectionForReservation(reservation.id);
      setInspection(JSON.parse(JSON.stringify(record)));
    }
  }, [reservation, isOpen, getInspectionForReservation]);

  if (!isOpen || !reservation || !inspection) return null;

  const handleStatusChange = (itemId: string, phase: 'in' | 'out', status: 'ok' | 'avaria' | 'nao_se_aplica') => {
    setInspection(prev => {
      if (!prev) return null;
      return {
        ...prev,
        items: prev.items.map(item => {
          if (item.id === itemId) {
            return phase === 'in' ? { ...item, statusIn: status } : { ...item, statusOut: status };
          }
          return item;
        })
      };
    });
  };

  const handleItemNotesChange = (itemId: string, notes: string) => {
    setInspection(prev => {
      if (!prev) return null;
      return {
        ...prev,
        items: prev.items.map(item => item.id === itemId ? { ...item, notes } : item)
      };
    });
  };

  const handleSave = () => {
    if (inspection) {
      saveInspection(inspection);
      setShowSavedToast(true);
      setTimeout(() => {
        setShowSavedToast(false);
        onClose();
      }, 1500);
    }
  };

  const handleDownloadPdf = async () => {
    if (!inspectionRef.current) return;
    setIsGeneratingPdf(true);
    const filename = `vistoria_${reservation.code}_${reservation.clientName.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`;
    await downloadElementAsPdf(inspectionRef.current, filename, {
      pdfTitle: `Ficha de Vistoria de Espaço #${reservation.code}`
    });
    setIsGeneratingPdf(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      
      {/* Toast Notification */}
      {showSavedToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2.5 animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-xs font-bold">Ficha de vistoria salva com sucesso!</span>
        </div>
      )}

      <div className="relative bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-4xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header Controls */}
        <div className="no-print px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/80 dark:bg-stone-800/80 shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
              <ClipboardCheck className="w-4 h-4 text-amber-600" />
              <span>Termo de Vistoria de Entrada e Saída</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono font-semibold">#{reservation.code}</span>
            </div>
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
              {reservation.clientName}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-75 rounded-lg transition-colors shadow-xs cursor-pointer"
              title="Baixar arquivo PDF diretamente no computador"
            >
              {isGeneratingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              <span>{isGeneratingPdf ? 'Gerando...' : 'Baixar PDF'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-200 bg-white dark:bg-stone-800 hover:bg-stone-100 rounded-lg border border-stone-200 dark:border-stone-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir</span>
            </button>

            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Salvar Vistoria</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-200/50 dark:hover:bg-stone-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Phase Toggle Tabs (Check-in vs Check-out) */}
        <div className="no-print px-6 py-2.5 bg-stone-100/70 dark:bg-stone-800/40 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('checkin')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors ${
                activeTab === 'checkin'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              1. Vistoria de Entrada (Check-in)
            </button>
            <button
              onClick={() => setActiveTab('checkout')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors ${
                activeTab === 'checkout'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              2. Vistoria de Saída (Check-out & Caução)
            </button>
          </div>

          <div className="text-stone-500 dark:text-stone-400 font-mono text-[11px]">
            Caução: {formatCurrency(reservation.securityDeposit)}
          </div>
        </div>

        {/* Scrollable Container with Document Sheet */}
        <div className="overflow-y-auto flex-1 p-3 sm:p-6 bg-stone-100/60 dark:bg-stone-950/40">
          <div 
            ref={inspectionRef} 
            data-pdf-content="true" 
            className="p-6 space-y-6 text-xs print-page bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm max-w-4xl mx-auto"
          >
          
          {/* General Inspection Details */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30">
            <div>
              <span className="text-stone-400 block mb-0.5">Responsável pela Vistoria</span>
              <input
                type="text"
                value={inspection.inspectorName}
                onChange={(e) => setInspection({ ...inspection, inspectorName: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium"
              />
            </div>

            <div>
              <span className="text-stone-400 block mb-0.5">Cliente Presente?</span>
              <select
                value={inspection.clientPresent ? 'sim' : 'nao'}
                onChange={(e) => setInspection({ ...inspection, clientPresent: e.target.value === 'sim' })}
                className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              >
                <option value="sim">Sim, cliente acompanhou</option>
                <option value="nao">Não, vistoria independente</option>
              </select>
            </div>

            <div>
              <span className="text-stone-400 block mb-0.5">Padrão de Luz (Entrada / Saída)</span>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="Entrada kWh"
                  value={inspection.electricMeterIn || ''}
                  onChange={(e) => setInspection({ ...inspection, electricMeterIn: e.target.value })}
                  className="w-1/2 px-2 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 font-mono text-[11px]"
                />
                <input
                  type="text"
                  placeholder="Saída kWh"
                  value={inspection.electricMeterOut || ''}
                  onChange={(e) => setInspection({ ...inspection, electricMeterOut: e.target.value })}
                  className="w-1/2 px-2 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 font-mono text-[11px]"
                />
              </div>
            </div>

            <div>
              <span className="text-stone-400 block mb-0.5">Hidrômetro de Água</span>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="Entrada m³"
                  value={inspection.waterMeterIn || ''}
                  onChange={(e) => setInspection({ ...inspection, waterMeterIn: e.target.value })}
                  className="w-1/2 px-2 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 font-mono text-[11px]"
                />
                <input
                  type="text"
                  placeholder="Saída m³"
                  value={inspection.waterMeterOut || ''}
                  onChange={(e) => setInspection({ ...inspection, waterMeterOut: e.target.value })}
                  className="w-1/2 px-2 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 font-mono text-[11px]"
                />
              </div>
            </div>
          </div>

          {/* Checklist Items Table */}
          <div className="space-y-3">
            <h3 className="font-bold text-stone-900 dark:text-stone-100 flex items-center justify-between">
              <span>Itens Verificados no Imóvel ({activeTab === 'checkin' ? 'Entrada' : 'Saída'})</span>
              <span className="text-stone-500 font-normal text-xs">Total: {inspection.items.length} itens padrão</span>
            </h3>

            <div className="border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-medium border-b border-stone-200 dark:border-stone-700">
                  <tr>
                    <th className="p-3 w-1/3">Item / Dependência</th>
                    <th className="p-3 w-1/4">Status no Check-in</th>
                    <th className="p-3 w-1/4">Status no Check-out</th>
                    <th className="p-3">Observações / Avarias</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800 bg-white dark:bg-stone-900">
                  {inspection.items.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30">
                      
                      {/* Name & Category */}
                      <td className="p-3">
                        <span className="font-semibold text-stone-900 dark:text-stone-100 block">
                          {item.title}
                        </span>
                        <span className="text-[11px] text-stone-400">
                          {item.category}
                        </span>
                      </td>

                      {/* Status Check-in */}
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(item.id, 'in', 'ok')}
                            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                              item.statusIn === 'ok' 
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 font-bold' 
                                : 'bg-stone-100 dark:bg-stone-800 text-stone-600'
                            }`}
                          >
                            ✓ OK
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(item.id, 'in', 'avaria')}
                            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                              item.statusIn === 'avaria' 
                                ? 'bg-red-100 text-red-800 dark:bg-red-950/70 dark:text-red-300 font-bold' 
                                : 'bg-stone-100 dark:bg-stone-800 text-stone-600'
                            }`}
                          >
                            ! Avaria
                          </button>
                        </div>
                      </td>

                      {/* Status Check-out */}
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(item.id, 'out', 'ok')}
                            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                              item.statusOut === 'ok' 
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 font-bold' 
                                : 'bg-stone-100 dark:bg-stone-800 text-stone-600'
                            }`}
                          >
                            ✓ OK
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(item.id, 'out', 'avaria')}
                            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                              item.statusOut === 'avaria' 
                                ? 'bg-red-100 text-red-800 dark:bg-red-950/70 dark:text-red-300 font-bold' 
                                : 'bg-stone-100 dark:bg-stone-800 text-stone-600'
                            }`}
                          >
                            ! Avaria
                          </button>
                        </div>
                      </td>

                      {/* Notes input */}
                      <td className="p-3">
                        <input
                          type="text"
                          placeholder="Ex: Tudo limpo / pequenas marcas..."
                          value={item.notes}
                          onChange={(e) => handleItemNotesChange(item.id, e.target.value)}
                          className="w-full px-2 py-1 rounded border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs"
                        />
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Checkout Damage Settlement Section */}
          <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 space-y-3">
            <h4 className="font-bold text-stone-900 dark:text-stone-100">
              Parecer Final de Saída & Reembolso da Caução
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-600 dark:text-stone-400 mb-1">
                  Relatório de Danos ou Quebras (se houver)
                </label>
                <textarea
                  rows={2}
                  placeholder="Descreva se houve quebra de pratos, manchas em cadeiras, entupimento ou perda de chaves..."
                  value={inspection.damagesNotes || ''}
                  onChange={(e) => setInspection({ ...inspection, damagesNotes: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-stone-600 dark:text-stone-400 mb-1">
                  Valor a Descontar da Caução (R$)
                </label>
                <input
                  type="number"
                  min="0"
                  max={reservation.securityDeposit}
                  value={inspection.damageDeductionAmount || 0}
                  onChange={(e) => setInspection({ ...inspection, damageDeductionAmount: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 font-mono text-xs font-semibold"
                />
                <span className="text-[11px] text-stone-500 mt-1 block">
                  Valor a devolver ao cliente: <strong>{formatCurrency(Math.max(0, reservation.securityDeposit - (inspection.damageDeductionAmount || 0)))}</strong>
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
  );
};
