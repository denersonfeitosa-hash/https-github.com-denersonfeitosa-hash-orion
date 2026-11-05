import React, { useState, useRef } from 'react';
import { X, Printer, Share2, Receipt, CheckCircle2, Download, Loader2 } from 'lucide-react';
import { useVenue } from '../../context/VenueContext';
import { Reservation, FinancialTransaction } from '../../types';
import { numberToCurrencyWords } from '../../utils/numberToWords';
import { downloadElementAsPdf, printElementAsPdf } from '../../utils/pdfGenerator';

interface PaymentReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation?: Reservation | null;
  transaction?: FinancialTransaction | null;
}

export const PaymentReceiptModal: React.FC<PaymentReceiptModalProps> = ({
  isOpen,
  onClose,
  reservation,
  transaction
}) => {
  const { venueConfig, formatCurrency, formatDateBR, generateWhatsAppUrl } = useVenue();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  // If opening from a reservation, allow choosing between Sinal or Quitação or Total
  const [receiptType, setReceiptType] = useState<'sinal' | 'total' | 'restante'>('sinal');

  if (!isOpen) return null;

  // Calculate receipt amount and description
  let amount = 0;
  let clientName = '';
  let clientCpf = '';
  let clientPhone = '';
  let descriptionRef = '';
  let reservationCode = '';
  let eventDate = '';
  let paymentMethod = 'PIX';
  let dateIssued = new Date().toISOString().split('T')[0];

  if (reservation) {
    clientName = reservation.clientName;
    clientCpf = reservation.clientCpf || 'Identificado no contrato';
    clientPhone = reservation.clientPhone;
    reservationCode = reservation.code;
    eventDate = reservation.startDate;
    paymentMethod = reservation.paymentMethod;

    if (receiptType === 'sinal') {
      amount = reservation.advancePaid;
      descriptionRef = `adiantamento de sinal confirmatório de reserva para locação de espaço de eventos no dia ${formatDateBR(reservation.startDate)} para o evento de ${reservation.eventType}`;
    } else if (receiptType === 'restante') {
      amount = reservation.remainingAmount;
      descriptionRef = `quitação de saldo remanescente da locação de espaço de eventos para realização de ${reservation.eventType} no dia ${formatDateBR(reservation.startDate)}`;
    } else {
      amount = reservation.totalAmount;
      descriptionRef = `pagamento integral da locação do espaço de eventos para realização de ${reservation.eventType} no dia ${formatDateBR(reservation.startDate)}`;
    }
  } else if (transaction) {
    amount = transaction.amount;
    clientName = transaction.description.split('-')[1]?.trim() || 'Locatário';
    clientCpf = 'Conforme cadastro comercial';
    clientPhone = venueConfig.phone;
    reservationCode = transaction.reservationCode || 'Lançamento Avulso';
    descriptionRef = transaction.description;
    dateIssued = transaction.date;
    paymentMethod = 'PIX / Transferência';
  }

  const receiptNumber = `REC-${new Date().getFullYear()}-${reservation ? reservation.code.replace(/\D/g, '').slice(-3) : '101'}`;
  const amountWords = numberToCurrencyWords(amount);
  const receiptFilename = `recibo_${receiptNumber}_${clientName.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`;
  const receiptTitle = `Recibo Oficial de Pagamento - ${receiptNumber} - ${venueConfig.name}`;

  const handleDownloadPdf = async () => {
    if (!receiptRef.current) return;
    setIsGeneratingPdf(true);
    setStatusMessage(null);

    const success = await downloadElementAsPdf(receiptRef.current, receiptFilename, {
      pdfTitle: receiptTitle
    });
    setIsGeneratingPdf(false);

    if (success) {
      setStatusMessage(`Recibo A4 (${receiptFilename}) baixado com sucesso!`);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const handlePrint = async () => {
    if (!receiptRef.current) return;
    setIsPrinting(true);
    setStatusMessage(null);

    const result = await printElementAsPdf(receiptRef.current, receiptFilename, {
      pdfTitle: receiptTitle
    });
    setIsPrinting(false);

    setStatusMessage(result.message);
    setTimeout(() => setStatusMessage(null), 5000);
  };

  const shareText = `Olá ${clientName.split(' ')[0]}! Segue seu Recibo de Pagamento Oficial (${receiptNumber}) no valor de ${formatCurrency(amount)} referente a: ${descriptionRef}. Emitido por ${venueConfig.name}.`;
  const whatsappUrl = generateWhatsAppUrl(clientPhone, shareText);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-4xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Toast Notification */}
        {statusMessage && (
          <div className="absolute top-16 right-6 z-50 bg-stone-900 text-white dark:bg-amber-600 px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in duration-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-white shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Top Control Bar (Hidden on print) */}
        <div className="no-print px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/80 dark:bg-stone-800/80 shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
              <Receipt className="w-4 h-4 text-amber-600" />
              <span>Emissão de Recibo Oficial em Formato A4</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono font-semibold">{receiptNumber}</span>
            </div>
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Recibo de Pagamento & Quitação
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf || isPrinting}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-75 rounded-lg transition-colors shadow-xs cursor-pointer"
              title="Baixar arquivo PDF em folha A4"
            >
              {isGeneratingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              <span>{isGeneratingPdf ? 'Gerando...' : 'Baixar PDF'}</span>
            </button>

            <button
              onClick={handlePrint}
              disabled={isPrinting || isGeneratingPdf}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-700 transition-colors cursor-pointer"
              title="Imprimir documento em folha A4"
            >
              {isPrinting ? <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" /> : <Printer className="w-3.5 h-3.5" />}
              <span>{isPrinting ? 'Preparando...' : 'Imprimir'}</span>
            </button>

            {clientPhone && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 rounded-lg border border-emerald-200 dark:border-emerald-800 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-200/50 dark:hover:bg-stone-700 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Optional Toggle if from reservation (Hidden on print) */}
        {reservation && (
          <div className="no-print px-6 py-2.5 bg-stone-100/70 dark:bg-stone-800/40 border-b border-stone-200 dark:border-stone-800 flex items-center gap-2 text-xs">
            <span className="text-stone-500 font-medium">Opção de Quitação:</span>
            <button
              onClick={() => setReceiptType('sinal')}
              className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                receiptType === 'sinal'
                  ? 'bg-amber-600 text-white shadow-xs font-bold'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300'
              }`}
            >
              Sinal Pago ({formatCurrency(reservation.advancePaid)})
            </button>
            <button
              onClick={() => setReceiptType('total')}
              className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                receiptType === 'total'
                  ? 'bg-amber-600 text-white shadow-xs font-bold'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300'
              }`}
            >
              Valor Total ({formatCurrency(reservation.totalAmount)})
            </button>
            {reservation.remainingAmount > 0 && (
              <button
                onClick={() => setReceiptType('restante')}
                className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                  receiptType === 'restante'
                    ? 'bg-amber-600 text-white shadow-xs font-bold'
                    : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                }`}
              >
                Saldo Remanescente ({formatCurrency(reservation.remainingAmount)})
              </button>
            )}
          </div>
        )}

        {/* Scrollable Container with Standard A4 Receipt Sheet */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-8 bg-stone-100/70 dark:bg-stone-950/60 flex justify-center">
          
          {/* Authentic A4 Document Sheet: Exactly 750px wide, pure white paper, clean borders, zero distortion */}
          <div 
            ref={receiptRef} 
            data-pdf-content="true" 
            className="w-full max-w-[750px] bg-white text-stone-900 border-2 border-stone-800 p-8 sm:p-12 shadow-lg space-y-8 font-sans"
          >
          
            {/* Header: Company & Receipt Box */}
            <div className="border-b-2 border-stone-800 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                {venueConfig.logoUrl ? (
                  <img 
                    src={venueConfig.logoUrl} 
                    alt={venueConfig.name} 
                    className="h-12 w-auto max-w-[120px] object-contain rounded-md" 
                  />
                ) : (
                  <span className="w-10 h-10 rounded-lg bg-amber-600 text-white font-bold flex items-center justify-center text-lg shrink-0">
                    Ó
                  </span>
                )}
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-stone-900 uppercase">
                    {venueConfig.name}
                  </h1>
                  <p className="text-xs text-stone-600 mt-0.5">
                    {venueConfig.address} · {venueConfig.city}
                  </p>
                  <p className="text-xs text-stone-600">
                    CNPJ: <strong>{venueConfig.cnpj}</strong> · Tel/WhatsApp: {venueConfig.phone}
                  </p>
                </div>
              </div>

              {/* Receipt Number & Highlighted Amount Box */}
              <div className="text-right border-2 border-stone-900 p-3 rounded-lg bg-stone-50 min-w-[190px]">
                <div className="flex items-center justify-between gap-3 text-xs text-stone-500 font-bold uppercase tracking-wider">
                  <span>Recibo Nº</span>
                  <span className="font-mono text-stone-900 font-bold">{receiptNumber}</span>
                </div>
                <div className="text-lg font-black font-mono text-stone-900 mt-1 border-t border-stone-300 pt-1">
                  {formatCurrency(amount)}
                </div>
              </div>
            </div>

            {/* Document Title Banner */}
            <div className="text-center py-2 border-y border-stone-300 bg-stone-50">
              <span className="text-sm font-extrabold uppercase tracking-widest text-stone-900">
                RECIBO DE PAGAMENTO & QUITAÇÃO COMERCIAL
              </span>
            </div>

            {/* Receipt Declaration Body */}
            <div className="space-y-4 text-justify text-sm leading-relaxed text-stone-800">
              <p className="indent-6">
                Recebemos de <strong>{clientName}</strong>, inscrito(a) no CPF/CNPJ sob o nº <strong>{clientCpf}</strong>, a quantia líquida e certa de <strong>{formatCurrency(amount)}</strong> (<em>{amountWords}</em>), referente a <strong>{descriptionRef}</strong>, vinculada ao Contrato de Reserva de Registro nº <strong>{reservationCode}</strong>.
              </p>

              <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-lg text-xs space-y-1.5 font-sans">
                <div className="flex flex-wrap justify-between gap-2">
                  <span><strong>Forma de Liquidação:</strong> {paymentMethod}</span>
                  <span><strong>Chave PIX:</strong> {venueConfig.pixKey} ({venueConfig.pixType})</span>
                </div>
                <div className="flex flex-wrap justify-between gap-2 text-stone-600">
                  <span><strong>Data do Evento:</strong> {reservation ? formatDateBR(reservation.startDate) : formatDateBR(dateIssued)}</span>
                  <span><strong>Horários:</strong> Check-in {reservation?.checkinTime || venueConfig.standardCheckin} · Check-out {reservation?.checkoutTime || venueConfig.standardCheckout}</span>
                </div>
              </div>

              {/* Breakdown Table if Linked to a Reservation */}
              {reservation && (
                <div className="border border-stone-200 rounded-lg overflow-hidden text-xs">
                  <div className="bg-stone-100 font-bold px-3 py-2 text-stone-800 border-b border-stone-200">
                    Demonstrativo Contábil da Locação
                  </div>
                  <div className="p-3 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white">
                    <div>
                      <span className="text-stone-500 block text-[11px]">Valor Total Contratado</span>
                      <span className="font-mono font-bold text-stone-900">{formatCurrency(reservation.totalAmount)}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 block text-[11px]">Sinal Pago</span>
                      <span className="font-mono font-bold text-emerald-600">{formatCurrency(reservation.advancePaid)}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 block text-[11px]">Saldo a Pagar</span>
                      <span className="font-mono font-bold text-amber-600">{formatCurrency(reservation.remainingAmount)}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 block text-[11px]">Situação do Pagamento</span>
                      <span className="font-semibold text-stone-800 capitalize">
                        {reservation.paymentStatus === 'totalmente_pago' ? 'Totalmente Quitado' :
                         reservation.paymentStatus === 'sinal_pago' ? 'Sinal Confirmado' : 'Pendente'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <p className="indent-6 text-xs text-stone-600">
                Pelo presente instrumento, outorgamos a devida e legal quitação da referida quantia paga, para os devidos fins de direito e comprovação perante a administração e locatário.
              </p>
            </div>

            {/* Signatures & Authentication Stamp */}
            <div className="pt-8 space-y-6">
              <div className="text-center text-xs text-stone-600">
                {venueConfig.city}, {formatDateBR(dateIssued)}.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                
                {/* Admin Signature */}
                <div className="text-center border-t-2 border-stone-800 pt-3">
                  <div className="font-bold text-xs uppercase text-stone-900">
                    {venueConfig.name}
                  </div>
                  <div className="text-[11px] text-stone-600">
                    Departamento Financeiro / Administração
                  </div>
                  <div className="text-[10px] text-emerald-700 font-mono mt-1 flex items-center justify-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Autenticação Digital Emitida</span>
                  </div>
                </div>

                {/* Client Signature / Science */}
                <div className="text-center border-t-2 border-stone-800 pt-3">
                  <div className="font-bold text-xs uppercase text-stone-900">
                    {clientName}
                  </div>
                  <div className="text-[11px] text-stone-600">
                    Locatário(a) / Pagador(a)
                  </div>
                  <div className="text-[10px] text-stone-500 font-mono mt-1">
                    CPF: {clientCpf}
                  </div>
                </div>

              </div>
            </div>

            {/* Document Footer Barcode / Authenticity Hash */}
            <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between text-[10px] text-stone-400 gap-2 font-mono">
              <span>DOCUMENTO GERADO EM FOLHA A4 PADRÃO COMERCIAL</span>
              <span>CHAVE DE AUTENTICIDADE: {receiptNumber}-BRL-{Date.now().toString().slice(-8)}</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
