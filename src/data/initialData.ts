import { 
  VenueConfig, 
  VenueArea, 
  Reservation, 
  InspectionCheckItem, 
  FinancialTransaction, 
  InventoryItem,
  AdditionalItem,
  ReservationType
} from '../types';

export const initialVenueConfig: VenueConfig = {
  name: 'Órion Eventos e Lazer',
  tagline: 'Espaço Completo para Festas, Confraternizações e Fins de Semana',
  address: 'Estrada dos Eucaliptos, Km 4,5 - Vale Verde',
  city: 'São Paulo - SP',
  phone: '(11) 98765-4321',
  whatsapp: '5511987654321',
  email: 'contato@orioneventoselazer.com.br',
  pixKey: 'contato@orioneventoselazer.com.br',
  pixType: 'E-mail',
  pixBeneficiary: 'Órion Eventos e Locações Ltda',
  cnpj: '42.891.302/0001-44',
  legalName: 'Órion Eventos e Lazer Empreendimentos Eireli',
  zipCode: '04890-000',
  maxCapacity: 250,
  standardCheckin: '08:00',
  standardCheckout: '22:00',
  rules: [
    'Respeito estrito à Lei do Silêncio municipal: som alto externo permitido até às 22h00; som ambiente moderado permitido até às 00h00.',
    'Proibido o porte ou uso de garrafas e copos de vidro na borda e no interior da piscina.',
    'Depósito de caução no valor de R$ 500,00 obrigatório no check-in, reembolsado em até 24h úteis após a vistoria de saída.',
    'Todo o lixo gerado durante o evento deve ser acondicionado em sacos plásticos resistentes e depositado na lixeira externa do portão.',
    'Proibido o uso de fita adesiva que danifique a pintura das paredes e pilares do salão.',
    'Animais de estimação de pequeno porte são permitidos exclusivamente na área externa com coleira.'
  ],
  defaultPricing: {
    singleDayWeekend: 1950,
    singleDayWeekday: 1200,
    weekendFull: 3400,
    cleaningFee: 250,
    securityDeposit: 500
  }
};

export const initialAreas: VenueArea[] = [
  {
    id: 'area-piscina',
    name: 'Espaço Piscina & Deck Tropical',
    image: '/src/assets/images/orion_espaco_piscina_1793800746317.jpg',
    capacity: 150,
    description: 'Piscina cristalina com cascata de pedras naturais, prainha infantil, deck de madeira tratada com espreguiçadeiras, guarda-sóis e quiosque de apoio.',
    features: [
      'Piscina 10m x 5m com cascata e iluminação LED',
      'Deck de madeira cumaru com espreguiçadeiras',
      'Quiosque rústico de apoio para drinks',
      'Ducha externa e vestiários feminino/masculino'
    ],
    status: 'operacional'
  },
  {
    id: 'area-salao',
    name: 'Salão Nobre Climatizado',
    image: '/src/assets/images/orion_salao_festas_1793800749557.jpg',
    capacity: 200,
    description: 'Salão fechado com pé-direito duplo, climatização total, lustres e cordões de luz cênica, espaço para pista de dança, palco para DJ ou banda e banheiros privativos.',
    features: [
      'Ar-condicionado central de alta capacidade',
      'Palco elevado para DJ, banda ou cerimônias',
      'Lustres centrais e iluminação cênica regulável',
      'Isolamento acústico parcial para som noturno'
    ],
    status: 'operacional'
  },
  {
    id: 'area-gourmet',
    name: 'Área Gourmet & Churrasqueira Premium',
    image: '/src/assets/images/orion_area_gourmet_1793800749056.jpg',
    capacity: 90,
    description: 'Área coberta integrada com churrasqueira em alvenaria e inox, bancada em granito escovado, choperia instalada, fogão industrial, forno de pizza e mesas rústicas.',
    features: [
      'Churrasqueira grande com grelha elevatória e espetos',
      'Bancada americana com torneira de chopp',
      'Fogão industrial 4 bocas e forno para assados',
      'Freezers verticais e horizontais para gelo e bebidas'
    ],
    status: 'operacional'
  },
  {
    id: 'area-campo',
    name: 'Área Verde, Gramado & Campo',
    image: '/src/assets/images/orion_hero_vista_1793800746953.jpg',
    capacity: 250,
    description: 'Ampla vista panorâmica das colinas, gramado impecável para montagem de tendas e cerimônias ao ar livre, campo de futebol e estacionamento interno para 40 carros.',
    features: [
      'Gramado nivelado para cerimônias de casamento ao ar livre',
      'Campo society para recreação esportiva',
      'Estacionamento privativo para 40 veículos',
      'Portão eletrônico e cerca viva com segurança'
    ],
    status: 'operacional'
  }
];

export const initialReservations: Reservation[] = [
  {
    id: 'res-1',
    code: 'ORN-2026-101',
    clientName: 'Mariana Duarte & Lucas Silveira',
    clientPhone: '(11) 99123-4567',
    clientCpf: '321.654.987-12',
    clientEmail: 'mariana.duarte@email.com',
    eventType: 'Casamento',
    startDate: '2026-11-07',
    endDate: '2026-11-08',
    rentalCategory: 'pacote_fim_de_semana',
    checkinTime: '08:00',
    checkoutTime: '18:00',
    estimatedGuests: 180,
    selectedAreas: ['area-piscina', 'area-salao', 'area-gourmet', 'area-campo'],
    includedServices: ['Piscina Aquecida', 'Salão Climatizado', 'Churrasqueira Giratória', 'Mesas e Cadeiras (150 lug)', 'Taxa de Limpeza Completa', 'Iluminação Cênica'],
    rentalAmount: 3400,
    cleaningFee: 250,
    securityDeposit: 500,
    discount: 150,
    totalAmount: 3500,
    advancePaid: 2000,
    remainingAmount: 1500,
    paymentStatus: 'sinal_pago',
    reservationStatus: 'confirmada',
    paymentMethod: 'PIX',
    notes: 'Cerimônia ao ar livre no gramado às 16h30, seguida de recepção no salão nobre.',
    contractSigned: true,
    contractSignDate: '2026-10-15',
    inspectionCheckinDone: false,
    inspectionCheckoutDone: false,
    createdAt: '2026-10-14'
  },
  {
    id: 'res-2',
    code: 'ORN-2026-102',
    clientName: 'Roberto Mendes de Oliveira',
    clientPhone: '(11) 98234-5678',
    clientCpf: '112.233.445-56',
    clientEmail: 'roberto.mendes@empresa.com.br',
    eventType: 'Aniversário',
    startDate: '2026-11-14',
    endDate: '2026-11-14',
    rentalCategory: 'diaria_fim_de_semana',
    checkinTime: '09:00',
    checkoutTime: '22:00',
    estimatedGuests: 90,
    selectedAreas: ['area-piscina', 'area-gourmet'],
    includedServices: ['Piscina Aquecida', 'Churrasqueira Giratória', 'Mesas e Cadeiras (80 lug)', 'Taxa de Limpeza Completa', 'Freezers Duplos'],
    rentalAmount: 1950,
    cleaningFee: 250,
    securityDeposit: 500,
    discount: 0,
    totalAmount: 2200,
    advancePaid: 2200,
    remainingAmount: 0,
    paymentStatus: 'totalmente_pago',
    reservationStatus: 'confirmada',
    paymentMethod: 'PIX',
    notes: 'Aniversário de 40 anos com roda de samba e churrasco.',
    contractSigned: true,
    contractSignDate: '2026-10-20',
    inspectionCheckinDone: false,
    inspectionCheckoutDone: false,
    createdAt: '2026-10-19'
  },
  {
    id: 'res-3',
    code: 'ORN-2026-103',
    clientName: 'Fernanda Nogueira (TechSul Inovações)',
    clientPhone: '(11) 97345-6789',
    clientCpf: '45.123.789/0001-90',
    clientEmail: 'eventos@techsul.com.br',
    eventType: 'Corporativo / Workshop',
    startDate: '2026-11-20',
    endDate: '2026-11-20',
    rentalCategory: 'diaria_semana',
    checkinTime: '08:00',
    checkoutTime: '20:00',
    estimatedGuests: 65,
    selectedAreas: ['area-salao', 'area-gourmet', 'area-campo'],
    includedServices: ['Salão Climatizado', 'Projetor e Telão', 'Wi-Fi Dedicado', 'Taxa de Limpeza Completa'],
    rentalAmount: 1400,
    cleaningFee: 250,
    securityDeposit: 500,
    discount: 100,
    totalAmount: 1550,
    advancePaid: 775,
    remainingAmount: 775,
    paymentStatus: 'sinal_pago',
    reservationStatus: 'confirmada',
    paymentMethod: 'Transferência Bancária',
    notes: 'Treinamento e confraternização anual de encerramento da diretoria.',
    contractSigned: true,
    contractSignDate: '2026-10-28',
    inspectionCheckinDone: false,
    inspectionCheckoutDone: false,
    createdAt: '2026-10-27'
  },
  {
    id: 'res-4',
    code: 'ORN-2026-104',
    clientName: 'Carlos Eduardo Ferreira',
    clientPhone: '(11) 96456-7890',
    clientCpf: '223.344.556-77',
    clientEmail: 'carlos.ferreira@gmail.com',
    eventType: 'Churrasco & Lazer',
    startDate: '2026-11-28',
    endDate: '2026-11-29',
    rentalCategory: 'pacote_fim_de_semana',
    checkinTime: '08:00',
    checkoutTime: '18:00',
    estimatedGuests: 50,
    selectedAreas: ['area-piscina', 'area-gourmet', 'area-campo'],
    includedServices: ['Piscina Aquecida', 'Churrasqueira Giratória', 'Mesas e Cadeiras', 'Taxa de Limpeza Completa'],
    rentalAmount: 3200,
    cleaningFee: 250,
    securityDeposit: 500,
    discount: 0,
    totalAmount: 3450,
    advancePaid: 1000,
    remainingAmount: 2450,
    paymentStatus: 'sinal_pago',
    reservationStatus: 'confirmada',
    paymentMethod: 'PIX',
    notes: 'Reunião de família com pernoite para 12 pessoas nas acomodações.',
    contractSigned: false,
    inspectionCheckinDone: false,
    inspectionCheckoutDone: false,
    createdAt: '2026-11-01'
  },
  {
    id: 'res-5',
    code: 'ORN-2026-105',
    clientName: 'Priscila Cavalcante',
    clientPhone: '(11) 95567-8901',
    clientCpf: '334.455.667-88',
    clientEmail: 'pri.cavalcante@outlook.com',
    eventType: 'Aniversário',
    startDate: '2026-12-05',
    endDate: '2026-12-05',
    rentalCategory: 'diaria_fim_de_semana',
    checkinTime: '10:00',
    checkoutTime: '22:00',
    estimatedGuests: 110,
    selectedAreas: ['area-piscina', 'area-salao', 'area-gourmet'],
    includedServices: ['Piscina Aquecida', 'Salão Climatizado', 'Churrasqueira Giratória', 'Taxa de Limpeza Completa'],
    rentalAmount: 2100,
    cleaningFee: 250,
    securityDeposit: 500,
    discount: 0,
    totalAmount: 2350,
    advancePaid: 0,
    remainingAmount: 2350,
    paymentStatus: 'pendente',
    reservationStatus: 'orcamento',
    paymentMethod: 'PIX',
    notes: 'Orçamento solicitado para festa infantil temática com brinquedos infláveis.',
    contractSigned: false,
    inspectionCheckinDone: false,
    inspectionCheckoutDone: false,
    createdAt: '2026-11-03'
  }
];

export const defaultInspectionItems: InspectionCheckItem[] = [
  {
    id: 'insp-1',
    title: 'Bomba, filtro e cascata da piscina em pleno funcionamento',
    category: 'Piscina & Área Externa',
    statusIn: 'ok',
    statusOut: 'ok',
    notes: 'Água cristalina, parâmetros de cloro e pH verificados.'
  },
  {
    id: 'insp-2',
    title: 'Deck de madeira e espreguiçadeiras sem rachaduras',
    category: 'Piscina & Área Externa',
    statusIn: 'ok',
    statusOut: 'ok',
    notes: '8 espreguiçadeiras com almofadas impermeáveis conferidas.'
  },
  {
    id: 'insp-3',
    title: 'Ar-condicionado do salão principal com controle remoto',
    category: 'Salão Principal',
    statusIn: 'ok',
    statusOut: 'ok',
    notes: '3 aparelhos limpos e gelando normalmente.'
  },
  {
    id: 'insp-4',
    title: 'Lustres, iluminação cênica e tomadas elétricas',
    category: 'Salão Principal',
    statusIn: 'ok',
    statusOut: 'ok',
    notes: 'Todos os spots e cordões de lâmpadas acesos.'
  },
  {
    id: 'insp-5',
    title: 'Grelhas da churrasqueira, exaustor e bancada de granito',
    category: 'Cozinha & Gourmet',
    statusIn: 'ok',
    statusOut: 'ok',
    notes: 'Grelhas lavadas e higienizadas, fogão funcionando.'
  },
  {
    id: 'insp-6',
    title: 'Freezer horizontal e geladeira limpos e refrigerando',
    category: 'Cozinha & Gourmet',
    statusIn: 'ok',
    statusOut: 'ok',
    notes: 'Ambos ligados em 220V e com temperatura adequada.'
  },
  {
    id: 'insp-7',
    title: 'Sanitários limpos, com saboneteiras, dispensers e lixeiras',
    category: 'Sanitários',
    statusIn: 'ok',
    statusOut: 'ok',
    notes: 'Válvulas hydra e torneiras sem vazamento.'
  },
  {
    id: 'insp-8',
    title: 'Portão eletrônico, interfone e chaves de acesso entregues',
    category: 'Geral & Segurança',
    statusIn: 'ok',
    statusOut: 'ok',
    notes: '1 controle de portão e molho de chaves entregues ao locatário.'
  }
];

export const initialTransactions: FinancialTransaction[] = [
  {
    id: 'trans-1',
    description: 'Sinal da Reserva #ORN-2026-101 - Casamento Mariana & Lucas',
    type: 'receita',
    category: 'sinal_reserva',
    amount: 2000,
    date: '2026-10-15',
    reservationId: 'res-1',
    reservationCode: 'ORN-2026-101',
    status: 'pago'
  },
  {
    id: 'trans-2',
    description: 'Pagamento Integral Reserva #ORN-2026-102 - Roberto Mendes',
    type: 'receita',
    category: 'quitacao_reserva',
    amount: 2200,
    date: '2026-10-20',
    reservationId: 'res-2',
    reservationCode: 'ORN-2026-102',
    status: 'pago'
  },
  {
    id: 'trans-3',
    description: 'Sinal 50% Reserva #ORN-2026-103 - TechSul Inovações',
    type: 'receita',
    category: 'sinal_reserva',
    amount: 775,
    date: '2026-10-28',
    reservationId: 'res-3',
    reservationCode: 'ORN-2026-103',
    status: 'pago'
  },
  {
    id: 'trans-4',
    description: 'Sinal da Reserva #ORN-2026-104 - Carlos Eduardo Ferreira',
    type: 'receita',
    category: 'sinal_reserva',
    amount: 1000,
    date: '2026-11-01',
    reservationId: 'res-4',
    reservationCode: 'ORN-2026-104',
    status: 'pago'
  },
  {
    id: 'trans-5',
    description: 'Manutenção mensal da piscina e produtos químicos (cloro, algicida)',
    type: 'despesa',
    category: 'manutencao_piscina',
    amount: 450,
    date: '2026-11-02',
    status: 'pago'
  },
  {
    id: 'trans-6',
    description: 'Corte de grama e poda do paisagismo do entorno',
    type: 'despesa',
    category: 'jardinagem',
    amount: 380,
    date: '2026-11-03',
    status: 'pago'
  },
  {
    id: 'trans-7',
    description: 'Compra de kits de limpeza pesada, papel toalha e saboneteiras',
    type: 'despesa',
    category: 'produtos_limpeza',
    amount: 290,
    date: '2026-11-03',
    status: 'pago'
  },
  {
    id: 'trans-8',
    description: 'Saldo restante a receber - Reserva #ORN-2026-101 (Mariana & Lucas)',
    type: 'receita',
    category: 'quitacao_reserva',
    amount: 1500,
    date: '2026-11-07',
    reservationId: 'res-1',
    reservationCode: 'ORN-2026-101',
    status: 'previsto'
  },
  {
    id: 'trans-9',
    description: 'Saldo restante a receber - Reserva #ORN-2026-103 (TechSul)',
    type: 'receita',
    category: 'quitacao_reserva',
    amount: 775,
    date: '2026-11-20',
    reservationId: 'res-3',
    reservationCode: 'ORN-2026-103',
    status: 'previsto'
  }
];

export const initialInventory: InventoryItem[] = [
  { id: 'inv-1', name: 'Mesas Redondas 8 Lugares (Madeira Maciça)', category: 'Mobiliário', quantity: 20, condition: 'Excelente', location: 'Salão Nobre' },
  { id: 'inv-2', name: 'Cadeiras Estofadas Tiffany Douradas', category: 'Mobiliário', quantity: 160, condition: 'Excelente', location: 'Salão Nobre' },
  { id: 'inv-3', name: 'Mesas Rústicas Pranchão com Bancos', category: 'Mobiliário', quantity: 6, condition: 'Bom', location: 'Área Gourmet' },
  { id: 'inv-4', name: 'Espreguiçadeiras de Piscina em Alumínio e Tela', category: 'Lazer & Esporte', quantity: 8, condition: 'Excelente', location: 'Deck da Piscina' },
  { id: 'inv-5', name: 'Freezer Horizontal Dupla Ação 530L (Metalfrio)', category: 'Eletros', quantity: 2, condition: 'Excelente', location: 'Área Gourmet' },
  { id: 'inv-6', name: 'Choperia Elétrica 2 Vias (Naja)', category: 'Eletros', quantity: 1, condition: 'Excelente', location: 'Balcão Gourmet' },
  { id: 'inv-7', name: 'Fogão Industrial 4 Bocas com Forno', category: 'Eletros', quantity: 1, condition: 'Bom', location: 'Cozinha de Apoio' },
  { id: 'inv-8', name: 'Caixas de Som Ativas 15" Bluetooth (JBL)', category: 'Som & Luz', quantity: 2, condition: 'Excelente', location: 'Salão e Varanda' },
  { id: 'inv-9', name: 'Microfones Sem Fio UHF com Receptor', category: 'Som & Luz', quantity: 2, condition: 'Excelente', location: 'Sala de Som' },
  { id: 'inv-10', name: 'Refletores LED RGB Cênicos com Controle DMX', category: 'Som & Luz', quantity: 12, condition: 'Excelente', location: 'Salão e Jardim' }
];

export const initialAdditionalItems: AdditionalItem[] = [
  {
    id: 'add-1',
    name: 'Choperia Elétrica Profissional 2 Vias (Naja)',
    category: 'Equipamento',
    price: 280,
    billingType: 'evento',
    stock: 2,
    description: 'Instalação completa com cilindro de CO2 e 2 torneiras italianas refrigeradas.',
    active: true
  },
  {
    id: 'add-2',
    name: 'Cama Elástica Grande (4,27m) com Rede e Monitor',
    category: 'Lazer & Brinquedos',
    price: 250,
    billingType: 'evento',
    stock: 1,
    description: 'Brinquedo infantil higienizado com molas protegidas e monitor inclusos.',
    active: true
  },
  {
    id: 'add-3',
    name: 'Jogo Extra de 10 Mesas + 40 Cadeiras Tiffany',
    category: 'Mobiliário Extra',
    price: 300,
    billingType: 'evento',
    stock: 5,
    description: 'Mesas redondas com toalhas brancas e cadeiras almofadadas douradas.',
    active: true
  },
  {
    id: 'add-4',
    name: 'Projetor Full HD 3800 Lumens + Telão Retrátil 120"',
    category: 'Equipamento',
    price: 190,
    billingType: 'evento',
    stock: 2,
    description: 'Ideal para retrospectivas, homenagens e apresentações corporativas com cabo HDMI.',
    active: true
  },
  {
    id: 'add-5',
    name: 'Hora Adicional de Permanência no Espaço',
    category: 'Serviço & Hora Extra',
    price: 150,
    billingType: 'hora',
    stock: 99,
    description: 'Extensão de permanência além das 22h00 na área interna com som moderado.',
    active: true
  },
  {
    id: 'add-6',
    name: 'Cervejeira Expositora Vertical -6°C Extra',
    category: 'Equipamento',
    price: 130,
    billingType: 'evento',
    stock: 2,
    description: 'Capacidade para até 12 caixas de cerveja ou refrigerantes gelados.',
    active: true
  },
  {
    id: 'add-7',
    name: 'Máquina de Algodão Doce & Pipoca Gourmet',
    category: 'Lazer & Brinquedos',
    price: 180,
    billingType: 'evento',
    stock: 1,
    description: 'Acompanha insumos para até 80 crianças.',
    active: true
  },
  {
    id: 'add-8',
    name: 'Kit de Iluminação Cênica Noturna RGB',
    category: 'Equipamento',
    price: 160,
    billingType: 'evento',
    stock: 3,
    description: '8 refletores PAR LED posicionados nas árvores e entorno da piscina.',
    active: true
  }
];

export const initialReservationTypes: ReservationType[] = [
  {
    id: 'type-diaria-fds',
    name: 'Diária Fim de Semana (Sábado ou Domingo)',
    category: 'diaria',
    description: 'Locação padrão para sábados ou domingos inteiros. Ideal para festas de aniversário, churrascos e confraternizações.',
    defaultPrice: 1950,
    defaultCleaningFee: 250,
    defaultSecurityDeposit: 500,
    defaultCheckin: '08:00',
    defaultCheckout: '22:00',
    durationDays: 1,
    allowsOvernight: false,
    maxGuests: 200,
    colorBadge: 'amber',
    active: true
  },
  {
    id: 'type-pacote-fds',
    name: 'Pacote Fim de Semana Completo (Sáb a Dom)',
    category: 'pacote',
    description: 'Entrada no sábado pela manhã e saída no domingo à noite com pernoite para hóspedes. Indicado para casamentos e grandes reencontros familiares.',
    defaultPrice: 3400,
    defaultCleaningFee: 300,
    defaultSecurityDeposit: 800,
    defaultCheckin: '08:00',
    defaultCheckout: '22:00',
    durationDays: 2,
    allowsOvernight: true,
    maxGuests: 250,
    colorBadge: 'emerald',
    active: true
  },
  {
    id: 'type-diaria-semana',
    name: 'Diária Dia de Semana (Segunda a Sexta)',
    category: 'diaria',
    description: 'Locação econômica para dias úteis (segunda a sexta). Ideal para reuniões corporativas, aniversários infantis e encontros intimistas.',
    defaultPrice: 1200,
    defaultCleaningFee: 200,
    defaultSecurityDeposit: 400,
    defaultCheckin: '09:00',
    defaultCheckout: '21:00',
    durationDays: 1,
    allowsOvernight: false,
    maxGuests: 150,
    colorBadge: 'sky',
    active: true
  },
  {
    id: 'type-pernoite-retiro',
    name: 'Pernoite / Hospedagem & Retiro',
    category: 'pernoite',
    description: 'Locação com hospedagem estendida para encontros religiosos, grupos de oração, confraternizações tranquilas e workshops de imersão.',
    defaultPrice: 2400,
    defaultCleaningFee: 250,
    defaultSecurityDeposit: 600,
    defaultCheckin: '14:00',
    defaultCheckout: '12:00',
    durationDays: 1,
    allowsOvernight: true,
    maxGuests: 40,
    colorBadge: 'indigo',
    active: true
  },
  {
    id: 'type-festa-noturna',
    name: 'Festa Noturna / Balada & 15 Anos',
    category: 'evento_especial',
    description: 'Locação noturna com autorização estendida para salão climatizado e pista de dança até a madrugada (até 04h00).',
    defaultPrice: 2200,
    defaultCleaningFee: 280,
    defaultSecurityDeposit: 700,
    defaultCheckin: '17:00',
    defaultCheckout: '04:00',
    durationDays: 1,
    allowsOvernight: false,
    maxGuests: 250,
    colorBadge: 'purple',
    active: true
  },
  {
    id: 'type-ensaio-foto',
    name: 'Ensaio Fotográfico / Pré-Wedding (4h)',
    category: 'ensaio',
    description: 'Locação pontual de 4 horas para ensaios pré-wedding, 15 anos e fotos institucionais nos jardins, piscina e deck.',
    defaultPrice: 450,
    defaultCleaningFee: 60,
    defaultSecurityDeposit: 200,
    defaultCheckin: '13:00',
    defaultCheckout: '17:00',
    durationDays: 1,
    allowsOvernight: false,
    maxGuests: 15,
    colorBadge: 'rose',
    active: true
  }
];


