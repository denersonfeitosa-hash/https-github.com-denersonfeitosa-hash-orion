import React, { useRef, useState } from 'react';
import { X, Printer, Share2, CheckCircle, Calendar, MapPin, Clock, ShieldCheck, Key, Download, Loader2 } from 'lucide-react';
import { useVenue } from '../../context/VenueContext';
import { Reservation } from '../../types';
import { downloadElementAsPdf } from '../../utils/pdfGenerator';

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation | null;
}

export const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  isOpen,
  onClose,
  reservation
}) => {
  const { venueConfig, formatCurrency, formatDateBR, generateWhatsAppUrl } = useVenue();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !reservation) return null;

  const handleDownloadPdf = async () => {
    if (!sheetRef.current) return;
    setIsGeneratingPdf(true);
    const filename = `confirmacao_reserva_${reservation.code}_${reservation.clientName.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`;
    await downloadElementAsPdf(sheetRef.current, filename, {
      pdfTitle: `Confirmação de Agendamento #${reservation.code}`
    });
    setIsGeneratingPdf(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const whatsappMessage = `*CONFIRMAÇÃO DE AGENDAMENTO - ${venueConfig.name.toUpperCase()}*\n\n` +
    `Olá, *${reservation.clientName}*! Sua reserva foi confirmada com sucesso em nossa agenda oficial.\n\n` +
    `📌 *Código:* ${reservation.code}\n` +
    `🎉 *Evento:* ${reservation.eventType}\n` +
    `📅 *Data de Entrada:* ${formatDateBR(reservation.startDate)} às ${reservation.checkinTime}\n` +
    `🏁 *Data de Saída:* ${formatDateBR(reservation.endDate || reservation.startDate)} às ${reservation.checkoutTime}\n` +
    `👥 *Convidados:* até ${reservation.estimatedGuests} pessoas\n` +
    `💰 *Valor Total:* ${formatCurrency(reservation.totalAmount)}\n` +
    `✅ *Sinal Pago:* ${formatCurrency(reservation.advancePaid)}\n` +
    (reservation.remainingAmount > 0 
      ? `⏳ *Saldo Restante:* ${formatCurrency(reservation.remainingAmount)} (a quitar até o check-in via PIX: ${venueConfig.pixKey})\n` 
      : `✨ *Status:* Quitado Integralmente\n`) +
    `📍 *Endereço:* ${venueConfig.address}, ${venueConfig.city}\n\n` +
    `Em caso de qualquer dúvida, estamos à disposição. Seja bem-vindo ao ${venueConfig.name}!`;

  const whatsappUrl = generateWhatsAppUrl(reservation.clientPhone, whatsappMessage);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-3xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Top Control Bar (Hidden on print) */}
        <div className="no-print px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/80 dark:bg-stone-800/80 shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Comprovante de Confirmação de Agendamento</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono font-semibold">#{reservation.code}</span>
            </div>
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
              {reservation.clientName} ({reservation.eventType})
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
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-700 transition-colors"
              title="Imprimir ou salvar via navegador"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 rounded-lg border border-emerald-200 dark:border-emerald-800 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-200/50 dark:hover:bg-stone-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Container with Document Sheet */}
        <div className="overflow-y-auto flex-1 p-3 sm:p-6 bg-stone-100/60 dark:bg-stone-950/40">
          <div 
            ref={sheetRef} 
            data-pdf-content="true" 
            className="p-6 sm:p-8 space-y-6 text-stone-900 dark:text-stone-100 print-page bg-white dark:bg-stone-900 text-xs sm:text-sm rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm max-w-2xl mx-auto"
          >
          
          {/* Header */}
          <div className="border-b-2 border-stone-800 dark:border-stone-200 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-3">
                {venueConfig.logoUrl ? (
                  <img 
                    src={venueConfig.logoUrl} 
                    alt={venueConfig.name} 
                    className="h-10 w-auto max-w-[100px] object-contain rounded-md" 
                  />
                ) : (
                  <span className="w-8 h-8 rounded-lg bg-amber-600 text-white font-bold flex items-center justify-center text-sm shrink-0">
                    Ó
                  </span>
                )}
                <h1 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                  {venueConfig.name}
                </h1>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                {venueConfig.tagline}
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                CNPJ: {venueConfig.cnpj} · Tel: {venueConfig.phone} · {venueConfig.address}, {venueConfig.city}
              </p>
            </div>

            <div className="text-left sm:text-right border border-emerald-500/40 bg-emerald-50/60 dark:bg-emerald-950/30 p-3 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300 block tracking-wider">
                Status da Reserva
              </span>
              <span className="font-bold text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-1 sm:justify-end mt-0.5">
                <CheckCircle className="w-4 h-4" />
                <span>CONFIRMADA</span>
              </span>
              <span className="font-mono text-xs text-stone-600 dark:text-stone-400 block mt-1">
                Nº {reservation.code}
              </span>
            </div>
          </div>

          {/* Section: Locatário e Evento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/30">
            <div>
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block mb-1">
                Dados do Locatário
              </span>
              <div className="space-y-0.5">
                <p className="font-bold text-stone-900 dark:text-stone-100 text-sm">{reservation.clientName}</p>
                <p className="text-stone-600 dark:text-stone-300">CPF/CNPJ: {reservation.clientCpf || 'Identificado na ficha'}</p>
                <p className="text-stone-600 dark:text-stone-300">Telefone: {reservation.clientPhone}</p>
                {reservation.clientEmail && <p className="text-stone-600 dark:text-stone-300">E-mail: {reservation.clientEmail}</p>}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block mb-1">
                Dados do Evento
              </span>
              <div className="space-y-0.5">
                <p className="font-bold text-stone-900 dark:text-stone-100 text-sm">{reservation.eventType}</p>
                <p className="text-stone-600 dark:text-stone-300">Estimativa de Convidados: {reservation.estimatedGuests} pessoas</p>
                <p className="text-stone-600 dark:text-stone-300">Capacidade Máxima do Espaço: {venueConfig.maxCapacity} pessoas</p>
                <p className="text-stone-500 text-[11px]">Data de Registro: {formatDateBR(reservation.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Section: Cronograma de Check-in e Check-out */}
          <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-800/80 bg-amber-50/50 dark:bg-amber-950/20">
            <h3 className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5 mb-3 text-xs sm:text-sm">
              <Calendar className="w-4 h-4 text-amber-600" />
              <span>Cronograma de Acesso & Horários Pactuados</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                <span className="text-[11px] text-stone-400 block font-semibold">ENTRADA (CHECK-IN)</span>
                <span className="text-base font-bold text-stone-900 dark:text-stone-100 font-mono mt-0.5 block">
                  {formatDateBR(reservation.startDate)} às {reservation.checkinTime}
                </span>
                <span className="text-[11px] text-stone-500 mt-1 block">
                  Entrega de chaves, conferência de vistoria de entrada e quitação.
                </span>
              </div>

              <div className="p-3 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                <span className="text-[11px] text-stone-400 block font-semibold">SAÍDA (CHECK-OUT)</span>
                <span className="text-base font-bold text-stone-900 dark:text-stone-100 font-mono mt-0.5 block">
                  {formatDateBR(reservation.endDate || reservation.startDate)} às {reservation.checkoutTime}
                </span>
                <span className="text-[11px] text-stone-500 mt-1 block">
                  Vistoria de saída, devolução de chaves e liberação de caução.
                </span>
              </div>
            </div>
          </div>

          {/* Section: Itens Inclusos */}
          <div>
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block mb-2">
              Estrutura & Serviços Inclusos na Reserva:
            </span>
            <div className="flex flex-wrap gap-2">
              {reservation.includedServices.map((srv, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-medium border border-stone-200 dark:border-stone-700"
                >
                  ✓ {srv}
                </span>
              ))}
            </div>
          </div>

          {/* Section: Resumo Financeiro */}
          <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/30">
            <h3 className="font-bold text-stone-900 dark:text-stone-100 mb-2">
              Resumo Financeiro da Locação
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-stone-400 text-[11px] block">Valor Total:</span>
                <span className="font-mono font-bold text-sm text-stone-900 dark:text-stone-100">
                  {formatCurrency(reservation.totalAmount)}
                </span>
              </div>
              <div>
                <span className="text-stone-400 text-[11px] block">Sinal Recebido:</span>
                <span className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(reservation.advancePaid)}
                </span>
              </div>
              <div>
                <span className="text-stone-400 text-[11px] block">Saldo a Quitar:</span>
                <span className="font-mono font-bold text-sm text-amber-600 dark:text-amber-400">
                  {formatCurrency(reservation.remainingAmount)}
                </span>
              </div>
              <div>
                <span className="text-stone-400 text-[11px] block">Caução Garantia:</span>
                <span className="font-mono font-bold text-sm text-stone-700 dark:text-stone-300">
                  {formatCurrency(reservation.securityDeposit)}
                </span>
              </div>
            </div>

            {reservation.remainingAmount > 0 && (
              <div className="mt-3 pt-2 border-t border-stone-200 dark:border-stone-700 text-xs text-stone-600 dark:text-stone-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <span>Chave PIX para quitação do saldo: <strong className="font-mono text-stone-900 dark:text-stone-100">{venueConfig.pixKey}</strong> ({venueConfig.pixType})</span>
                <span className="text-amber-700 dark:text-amber-400 font-medium">Prazo: até o check-in</span>
              </div>
            )}
          </div>

          {/* Section: Regras e Instruções */}
          <div className="space-y-2 border-t border-stone-200 dark:border-stone-800 pt-4">
            <h4 className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Orientações Essenciais para o Dia do Evento</span>
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-stone-600 dark:text-stone-400 text-xs">
              <li><strong>Lei do Silêncio:</strong> Som externo de alta potência permitido até 22h00; som ambiente moderado no salão até 00h00.</li>
              <li><strong>Área da Piscina:</strong> Estritamente proibido o uso de garrafas e copos de vidro na borda e no espelho d'água.</li>
              <li><strong>Lixo e Descarte:</strong> O recolhimento do lixo pós-evento deve ser acondicionado em sacos nas lixeiras identificadas.</li>
              <li><strong>Localização e GPS:</strong> {venueConfig.address}, {venueConfig.city}. Portão com interfone e identificação {venueConfig.name}.</li>
            </ul>
          </div>

          {/* Footer signature */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-200 dark:border-stone-800 text-xs text-stone-500">
            <div>
              Emitido em {formatDateBR(new Date().toISOString().split('T')[0])} por {venueConfig.name}
            </div>
            <div className="font-semibold text-stone-700 dark:text-stone-300">
              Administração {venueConfig.name} · Contato: {venueConfig.phone}
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
  );
};
