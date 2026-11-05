export type ReservationStatus = 'orcamento' | 'confirmada' | 'em_andamento' | 'concluida' | 'cancelada';
export type PaymentStatus = 'pendente' | 'sinal_pago' | 'totalmente_pago';
export type RentalCategory = 'diaria_fim_de_semana' | 'diaria_semana' | 'pacote_fim_de_semana' | 'pernoite';
export type EventType = 
  | 'Aniversário' 
  | 'Casamento' 
  | 'Confraternização' 
  | 'Fim de Semana em Família' 
  | 'Retiro / Religioso' 
  | 'Corporativo / Workshop' 
  | 'Churrasco & Lazer';

export interface VenueConfig {
  name: string;
  tagline: string;
  address: string;
  city: string;
  phone: string;
  whatsapp: string;
  email: string;
  pixKey: string;
  pixType: string;
  cnpj: string;
  legalName?: string;
  stateRegistration?: string;
  zipCode?: string;
  pixBeneficiary?: string;
  logoUrl?: string;
  maxCapacity: number;
  standardCheckin: string;
  standardCheckout: string;
  rules: string[];
  defaultPricing: {
    singleDayWeekend: number;
    singleDayWeekday: number;
    weekendFull: number;
    cleaningFee: number;
    securityDeposit: number;
  };
}

export interface VenueArea {
  id: string;
  name: string;
  image: string;
  capacity: number;
  description: string;
  features: string[];
  status: 'operacional' | 'manutencao';
}

export interface AdditionalItem {
  id: string;
  name: string;
  category: 'Equipamento' | 'Mobiliário Extra' | 'Lazer & Brinquedos' | 'Serviço & Hora Extra' | 'Insumos';
  price: number;
  billingType: 'evento' | 'hora' | 'unidade';
  stock: number;
  description: string;
  active: boolean;
}

export interface ReservationType {
  id: string;
  name: string;
  category: 'diaria' | 'pacote' | 'pernoite' | 'evento_especial' | 'ensaio';
  description: string;
  defaultPrice: number;
  defaultCleaningFee: number;
  defaultSecurityDeposit: number;
  defaultCheckin: string;
  defaultCheckout: string;
  durationDays: number;
  allowsOvernight: boolean;
  maxGuests?: number;
  colorBadge?: string;
  active: boolean;
}

export interface Reservation {
  id: string;
  code: string;
  reservationTypeId?: string;
  clientName: string;
  clientPhone: string;
  clientCpf: string;
  clientEmail: string;
  eventType: EventType;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  rentalCategory: RentalCategory;
  checkinTime: string;
  checkoutTime: string;
  estimatedGuests: number;
  selectedAreas: string[];
  includedServices: string[];
  additionalItems?: { itemId: string; name: string; quantity: number; unitPrice: number }[];
  rentalAmount: number;
  cleaningFee: number;
  securityDeposit: number;
  discount: number;
  totalAmount: number;
  advancePaid: number;
  remainingAmount: number;
  paymentStatus: PaymentStatus;
  reservationStatus: ReservationStatus;
  paymentMethod: string;
  notes: string;
  contractSigned: boolean;
  contractSignDate?: string;
  inspectionCheckinDone: boolean;
  inspectionCheckoutDone: boolean;
  createdAt: string;
}

export interface InspectionCheckItem {
  id: string;
  title: string;
  category: 'Piscina & Área Externa' | 'Salão Principal' | 'Cozinha & Gourmet' | 'Sanitários' | 'Geral & Segurança';
  statusIn: 'ok' | 'avaria' | 'nao_se_aplica';
  statusOut: 'ok' | 'avaria' | 'nao_se_aplica';
  notes: string;
}

export interface InspectionRecord {
  reservationId: string;
  checkinDate?: string;
  checkoutDate?: string;
  inspectorName: string;
  clientPresent: boolean;
  electricMeterIn?: string;
  electricMeterOut?: string;
  waterMeterIn?: string;
  waterMeterOut?: string;
  damagesNotes?: string;
  damageDeductionAmount?: number;
  items: InspectionCheckItem[];
}

export interface FinancialTransaction {
  id: string;
  description: string;
  type: 'receita' | 'despesa';
  category: 
    | 'sinal_reserva' 
    | 'quitacao_reserva' 
    | 'taxa_limpeza' 
    | 'hora_extra' 
    | 'manutencao_piscina' 
    | 'jardinagem' 
    | 'produtos_limpeza' 
    | 'energia_agua' 
    | 'reparos' 
    | 'outros';
  amount: number;
  date: string; // YYYY-MM-DD
  reservationId?: string;
  reservationCode?: string;
  status: 'pago' | 'previsto';
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Mobiliário' | 'Eletros' | 'Lazer & Esporte' | 'Som & Luz';
  quantity: number;
  condition: 'Excelente' | 'Bom' | 'Atenção';
  location: string;
}
