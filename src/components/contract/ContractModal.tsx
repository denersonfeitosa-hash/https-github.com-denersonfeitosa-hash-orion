import React, { useRef, useState } from 'react';
import { X, Printer, Share2, CheckCircle2, ShieldCheck, Download, Loader2 } from 'lucide-react';
import { useVenue } from '../../context/VenueContext';
import { Reservation } from '../../types';
import { downloadElementAsPdf } from '../../utils/pdfGenerator';

interface ContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation | null;
}

export const ContractModal: React.FC<ContractModalProps> = ({
  isOpen,
  onClose,
  reservation
}) => {
  const { venueConfig, updateReservation, formatCurrency, formatDateBR, generateWhatsAppUrl } = useVenue();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const contractRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !reservation) return null;

  const handleDownloadPdf = async () => {
    if (!contractRef.current) return;
    setIsGeneratingPdf(true);
    const filename = `contrato_locacao_${reservation.code}_${reservation.clientName.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`;
    await downloadElementAsPdf(contractRef.current, filename, {
      pdfTitle: `Contrato de Locação por Temporada #${reservation.code}`
    });
    setIsGeneratingPdf(false);
  };

  const handleSignContract = () => {
    const today = new Date().toISOString().split('T')[0];
    updateReservation(reservation.id, {
      contractSigned: true,
      contractSignDate: today
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const contractWhatsAppText = `Olá ${reservation.clientName.split(' ')[0]}! Segue a via digital do seu Contrato de Locação no ${venueConfig.name} (Reserva #${reservation.code}).\nData: ${formatDateBR(reservation.startDate)} das ${reservation.checkinTime} às ${reservation.checkoutTime}.\nValor Total: ${formatCurrency(reservation.totalAmount)} (Saldo restante: ${formatCurrency(reservation.remainingAmount)}).\nChave PIX: ${venueConfig.pixKey}.`;
  const whatsappUrl = generateWhatsAppUrl(reservation.clientPhone, contractWhatsAppText);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      
      {/* Modal Container */}
      <div className="relative bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-4xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Top Control Bar (Hidden on print) */}
        <div className="no-print px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/80 dark:bg-stone-800/80 shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
              <span>Contrato de Locação por Temporada</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono font-semibold text-stone-800 dark:text-stone-200">#{reservation.code}</span>
            </div>
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
              {reservation.clientName} ({reservation.eventType})
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            {!reservation.contractSigned ? (
              <button
                onClick={handleSignContract}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200 dark:border-emerald-800"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Assinar Digitalmente</span>
              </button>
            ) : (
              <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 rounded-md">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Assinado em {formatDateBR(reservation.contractSignDate || '')}</span>
              </span>
            )}

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
            ref={contractRef} 
            data-pdf-content="true" 
            className="p-6 sm:p-10 space-y-6 text-stone-800 dark:text-stone-200 print-page bg-white dark:bg-stone-900 font-serif leading-relaxed text-sm rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm max-w-3xl mx-auto"
          >
          
          {/* Header of Contract with Company Logo and Details */}
          <div className="border-b-2 border-stone-800 dark:border-stone-200 pb-5 font-sans">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {venueConfig.logoUrl ? (
                  <img 
                    src={venueConfig.logoUrl} 
                    alt={venueConfig.name} 
                    className="h-12 w-auto max-w-[130px] object-contain rounded-md" 
                  />
                ) : (
                  <span className="w-10 h-10 rounded-lg bg-amber-600 text-white font-bold flex items-center justify-center text-lg shrink-0">
                    Ó
                  </span>
                )}
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                    {venueConfig.name}
                  </h1>
                  {venueConfig.tagline && (
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      {venueConfig.tagline}
                    </p>
                  )}
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    CNPJ: {venueConfig.cnpj} · Tel: {venueConfig.phone} · {venueConfig.address}, {venueConfig.city}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right border border-stone-300 dark:border-stone-700 p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 shrink-0">
                <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 block tracking-wider">
                  Contrato de Locação
                </span>
                <span className="font-mono font-bold text-stone-900 dark:text-stone-100 text-xs block mt-0.5">
                  Registro #{reservation.code}
                </span>
                <span className="text-[10px] text-stone-400 block mt-0.5">
                  Emitido em {formatDateBR(new Date().toISOString().split('T')[0])}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-700 text-center">
              <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
                Instrumento Particular de Contrato de Locação por Temporada para Fins de Evento e Lazer
              </h2>
            </div>
          </div>

          {/* Qualificação das Partes */}
          <div className="space-y-3">
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-amber-900 dark:text-amber-400">
              Das Partes Contratantes
            </h3>
            
            <p className="text-justify text-xs sm:text-sm">
              <strong>LOCADOR:</strong> <strong>{venueConfig.name}</strong>, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº <strong>{venueConfig.cnpj}</strong>, com sede estabelecida na {venueConfig.address}, {venueConfig.city}, telefone de contato {venueConfig.phone}, neste ato representada por sua administração legítima.
            </p>

            <p className="text-justify text-xs sm:text-sm">
              <strong>LOCATÁRIO:</strong> <strong>{reservation.clientName}</strong>, inscrito(a) no CPF/CNPJ sob o nº <strong>{reservation.clientCpf || 'Identificado na ficha'}</strong>, telefone/WhatsApp {reservation.clientPhone}, e-mail {reservation.clientEmail || 'Não informado'}.
            </p>
          </div>

          {/* Cláusula 1ª: Do Objeto */}
          <div className="space-y-2">
            <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-stone-900 dark:text-stone-100">
              Cláusula 1ª – Do Objeto e Dependências Locadas
            </h4>
            <p className="text-justify text-xs sm:text-sm">
              O presente instrumento tem por objeto a locação por temporada do imóvel de eventos denominado <strong>{venueConfig.name}</strong>, compreendendo as áreas de lazer e convivência selecionadas: <em>{reservation.includedServices.join(', ')}</em>. O espaço é locado exclusivamente para a realização do evento do tipo <strong>{reservation.eventType}</strong>, com estimativa declarada de <strong>{reservation.estimatedGuests} convidados</strong> (capacidade máxima autorizada de até {venueConfig.maxCapacity} pessoas).
            </p>
          </div>

          {/* Cláusula 2ª: Prazo e Horários */}
          <div className="space-y-2">
            <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-stone-900 dark:text-stone-100">
              Cláusula 2ª – Do Prazo, Entrada e Devolução das Chaves
            </h4>
            <p className="text-justify text-xs sm:text-sm">
              A locação vigorará a partir das <strong>{reservation.checkinTime} horas do dia {formatDateBR(reservation.startDate)}</strong>, encerrando-se impreterivelmente às <strong>{reservation.checkoutTime} horas do dia {formatDateBR(reservation.endDate || reservation.startDate)}</strong>, momento em que o LOCATÁRIO deverá desocupar completamente o imóvel e restituir as chaves e controles de acesso à administração.
            </p>
            <p className="text-justify text-xs text-stone-600 dark:text-stone-400">
              Parágrafo Único: A permanência no imóvel além do horário pactuado sujeitará o LOCATÁRIO ao pagamento de taxa de permanência excedente no valor de R$ 150,00 por fração de hora adicional, desde que haja prévia viabilidade operacional.
            </p>
          </div>

          {/* Cláusula 3ª: Preço e Pagamento */}
          <div className="space-y-2">
            <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-stone-900 dark:text-stone-100">
              Cláusula 3ª – Do Preço, Sinal e Condições de Pagamento
            </h4>
            <p className="text-justify text-xs sm:text-sm">
              Pela locação das dependências e serviços ajustados, o LOCATÁRIO pagará ao LOCADOR o valor total líquido de <strong>{formatCurrency(reservation.totalAmount)}</strong> ({reservation.rentalAmount > 0 ? `Diária base: ${formatCurrency(reservation.rentalAmount)}` : ''} + Taxa de Limpeza: {formatCurrency(reservation.cleaningFee)}), discriminado da seguinte forma:
            </p>
            <ul className="list-disc pl-6 text-xs sm:text-sm space-y-1 font-sans">
              <li>
                <strong>Sinal / Entrada:</strong> {formatCurrency(reservation.advancePaid)} pagos via {reservation.paymentMethod} como garantia de reserva.
              </li>
              <li>
                <strong>Saldo Remanescente:</strong> {formatCurrency(reservation.remainingAmount)} a ser quitado impreterivelmente até o momento do check-in / entrega das chaves.
              </li>
              <li>
                <strong>Dados para Liquidação (PIX):</strong> Chave {venueConfig.pixType}: <span className="font-mono font-semibold">{venueConfig.pixKey}</span> (Titularidade: {venueConfig.name}).
              </li>
            </ul>
          </div>

          {/* Cláusula 4ª: Caução e Vistoria */}
          <div className="space-y-2">
            <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-stone-900 dark:text-stone-100">
              Cláusula 4ª – Da Caução de Garantia e Termo de Vistoria
            </h4>
            <p className="text-justify text-xs sm:text-sm">
              Fica estipulada uma <strong>Caução de Garantia no valor de {formatCurrency(reservation.securityDeposit)}</strong> para ressarcimento de eventuais danos materiais provocados ao imóvel, vidros, freezers, maquinário da piscina, mobília ou jardinagem.
            </p>
            <p className="text-justify text-xs text-stone-600 dark:text-stone-400">
              Parágrafo Primeiro: Na entrada e na saída será realizada vistoria conjunta por meio da Ficha Oficial de Vistoria. Não havendo qualquer dano ou extravio de bens, a caução será integralmente restituída ao LOCATÁRIO em até 24 (vinte e quatro) horas úteis após a saída.
            </p>
          </div>

          {/* Cláusula 5ª: Normas e Lei do Silêncio */}
          <div className="space-y-2">
            <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-stone-900 dark:text-stone-100">
              Cláusula 5ª – Das Normas de Uso, Segurança e Lei do Silêncio
            </h4>
            <div className="text-xs sm:text-sm space-y-1 text-justify">
              <p>O LOCATÁRIO assume a obrigação de cumprir e fazer cumprir por seus convidados as normas internas do {venueConfig.name}:</p>
              <ol className="list-decimal pl-6 space-y-1">
                {venueConfig.rules.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ol>
            </div>
          </div>

          {/* Cláusula 6ª: Foro */}
          <div className="space-y-2">
            <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-stone-900 dark:text-stone-100">
              Cláusula 6ª – Do Foro de Eleição
            </h4>
            <p className="text-justify text-xs sm:text-sm">
              As partes elegem o Foro da Comarca de domicílio do imóvel para dirimir quaisquer litígios oriundos do presente contrato, renunciando expressamente a qualquer outro por mais privilegiado que seja.
            </p>
          </div>

          {/* Signatures */}
          <div className="pt-8 grid grid-cols-2 gap-8 text-center font-sans text-xs">
            <div className="border-t border-stone-400 dark:border-stone-600 pt-3">
              <p className="font-bold text-stone-900 dark:text-stone-100">{venueConfig.name}</p>
              <p className="text-stone-500">LOCADOR (CNPJ: {venueConfig.cnpj})</p>
            </div>

            <div className="border-t border-stone-400 dark:border-stone-600 pt-3">
              <p className="font-bold text-stone-900 dark:text-stone-100">{reservation.clientName}</p>
              <p className="text-stone-500">LOCATÁRIO (CPF: {reservation.clientCpf || 'Identificado'})</p>
              {reservation.contractSigned && (
                <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-medium">
                  [Assinado Digitalmente em {formatDateBR(reservation.contractSignDate || '')}]
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
  );
};
