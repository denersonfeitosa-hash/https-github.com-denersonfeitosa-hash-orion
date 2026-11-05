import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  VenueConfig, 
  VenueArea, 
  Reservation, 
  FinancialTransaction, 
  InventoryItem, 
  InspectionRecord,
  InspectionCheckItem,
  AdditionalItem,
  ReservationType
} from '../types';
import { 
  initialVenueConfig, 
  initialAreas, 
  initialReservations, 
  initialTransactions, 
  initialInventory,
  initialAdditionalItems,
  initialReservationTypes,
  defaultInspectionItems 
} from '../data/initialData';
import { firestoreService } from '../firebase/firestoreService';

interface VenueContextType {
  venueConfig: VenueConfig;
  setVenueConfig: React.Dispatch<React.SetStateAction<VenueConfig>>;
  areas: VenueArea[];
  reservations: Reservation[];
  transactions: FinancialTransaction[];
  inventory: InventoryItem[];
  additionalItems: AdditionalItem[];
  reservationTypes: ReservationType[];
  inspectionRecords: Record<string, InspectionRecord>;
  isCloudSynced: boolean;
  
  // Reservation handlers
  addReservation: (reservation: Omit<Reservation, 'id' | 'code' | 'createdAt'>) => Reservation;
  updateReservation: (id: string, reservation: Partial<Reservation>) => void;
  deleteReservation: (id: string) => void;
  getReservationById: (id: string) => Reservation | undefined;
  
  // Additional Items handlers (Cadastrar, Alterar, Editar, Excluir)
  addAdditionalItem: (item: Omit<AdditionalItem, 'id'>) => AdditionalItem;
  updateAdditionalItem: (id: string, item: Partial<AdditionalItem>) => void;
  deleteAdditionalItem: (id: string) => void;
  toggleAdditionalItemActive: (id: string) => void;

  // Reservation Types handlers (Cadastrar, Alterar, Editar, Excluir)
  addReservationType: (type: Omit<ReservationType, 'id'>) => ReservationType;
  updateReservationType: (id: string, type: Partial<ReservationType>) => void;
  deleteReservationType: (id: string) => void;
  toggleReservationTypeActive: (id: string) => void;

  // Checklist de Conferência handlers (Cadastrar, Alterar, Editar, Excluir)
  checklistItems: InspectionCheckItem[];
  addChecklistItem: (item: Omit<InspectionCheckItem, 'id' | 'statusIn' | 'statusOut'>) => InspectionCheckItem;
  updateChecklistItem: (id: string, item: Partial<InspectionCheckItem>) => void;
  deleteChecklistItem: (id: string) => void;
  resetChecklistItems: () => void;

  // Finance handlers
  addTransaction: (transaction: Omit<FinancialTransaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  markTransactionPaid: (id: string) => void;
  
  // Inspection handlers
  getInspectionForReservation: (reservationId: string) => InspectionRecord;
  saveInspection: (record: InspectionRecord) => void;
  
  // Inventory handlers
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (id: string, item: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;
  
  // Calendar & availability
  getReservationsForDate: (dateStr: string) => Reservation[];
  isDateAvailable: (dateStr: string, excludeReservationId?: string) => boolean;
  
  // Utility
  formatCurrency: (value: number) => string;
  formatDateBR: (dateStr: string) => string;
  generateWhatsAppUrl: (phone: string, text: string) => string;
  resetAllData: () => void;
  exportBackupJSON: () => string;
  importBackupJSON: (json: string) => boolean;
}

const VenueContext = createContext<VenueContextType | undefined>(undefined);

export const VenueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);

  const [venueConfig, setVenueConfig] = useState<VenueConfig>(() => {
    const saved = localStorage.getItem('orion_venue_config');
    return saved ? JSON.parse(saved) : initialVenueConfig;
  });

  const [areas, setAreas] = useState<VenueArea[]>(() => {
    const saved = localStorage.getItem('orion_areas');
    return saved ? JSON.parse(saved) : initialAreas;
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem('orion_reservations');
    return saved ? JSON.parse(saved) : initialReservations;
  });

  const [transactions, setTransactions] = useState<FinancialTransaction[]>(() => {
    const saved = localStorage.getItem('orion_transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('orion_inventory');
    return saved ? JSON.parse(saved) : initialInventory;
  });

  const [additionalItems, setAdditionalItems] = useState<AdditionalItem[]>(() => {
    const saved = localStorage.getItem('orion_additional_items');
    return saved ? JSON.parse(saved) : initialAdditionalItems;
  });

  const [reservationTypes, setReservationTypes] = useState<ReservationType[]>(() => {
    const saved = localStorage.getItem('orion_reservation_types');
    return saved ? JSON.parse(saved) : initialReservationTypes;
  });

  const [inspectionRecords, setInspectionRecords] = useState<Record<string, InspectionRecord>>(() => {
    const saved = localStorage.getItem('orion_inspections');
    return saved ? JSON.parse(saved) : {};
  });

  const [checklistItems, setChecklistItems] = useState<InspectionCheckItem[]>(() => {
    const saved = localStorage.getItem('orion_checklist_items');
    return saved ? JSON.parse(saved) : defaultInspectionItems;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('orion_venue_config', JSON.stringify(venueConfig));
  }, [venueConfig]);

  useEffect(() => {
    localStorage.setItem('orion_areas', JSON.stringify(areas));
  }, [areas]);

  useEffect(() => {
    localStorage.setItem('orion_reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('orion_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('orion_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('orion_additional_items', JSON.stringify(additionalItems));
  }, [additionalItems]);

  useEffect(() => {
    localStorage.setItem('orion_reservation_types', JSON.stringify(reservationTypes));
  }, [reservationTypes]);

  useEffect(() => {
    localStorage.setItem('orion_inspections', JSON.stringify(inspectionRecords));
  }, [inspectionRecords]);

  useEffect(() => {
    localStorage.setItem('orion_checklist_items', JSON.stringify(checklistItems));
  }, [checklistItems]);

  // Cloud Firestore Initial Sync & Subscriptions
  useEffect(() => {
    let isMounted = true;

    async function loadCloudData() {
      try {
        const [cloudConfig, cloudRes, cloudTx, cloudItems, cloudTypes, cloudInspections] = await Promise.all([
          firestoreService.getVenueConfig().catch(() => null),
          firestoreService.getReservations().catch(() => null),
          firestoreService.getTransactions().catch(() => null),
          firestoreService.getAdditionalItems().catch(() => null),
          firestoreService.getReservationTypes().catch(() => null),
          firestoreService.getInspectionRecords().catch(() => null)
        ]);

        if (!isMounted) return;

        if (cloudConfig) {
          setVenueConfig(cloudConfig);
        } else {
          // Seed initial config to Firestore
          firestoreService.saveVenueConfig(venueConfig).catch(() => {});
        }

        if (cloudRes && cloudRes.length > 0) {
          setReservations(cloudRes);
        } else if (reservations.length > 0) {
          // Seed existing reservations to Firestore
          reservations.forEach(r => firestoreService.saveReservation(r).catch(() => {}));
        }

        if (cloudTx && cloudTx.length > 0) {
          setTransactions(cloudTx);
        } else if (transactions.length > 0) {
          transactions.forEach(t => firestoreService.saveTransaction(t).catch(() => {}));
        }

        if (cloudItems && cloudItems.length > 0) {
          setAdditionalItems(cloudItems);
        } else if (additionalItems.length > 0) {
          additionalItems.forEach(i => firestoreService.saveAdditionalItem(i).catch(() => {}));
        }

        if (cloudTypes && cloudTypes.length > 0) {
          setReservationTypes(cloudTypes);
        } else if (reservationTypes.length > 0) {
          reservationTypes.forEach(t => firestoreService.saveReservationType(t).catch(() => {}));
        }

        if (cloudInspections && Object.keys(cloudInspections).length > 0) {
          setInspectionRecords(cloudInspections);
        }

        setIsCloudSynced(true);
      } catch (err) {
        console.warn('Firestore sync failed, continuing with local storage:', err);
      }
    }

    loadCloudData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Reservation functions
  const addReservation = (data: Omit<Reservation, 'id' | 'code' | 'createdAt'>): Reservation => {
    const count = reservations.length + 101;
    const year = new Date().getFullYear();
    const newReservation: Reservation = {
      ...data,
      id: `res-${Date.now()}`,
      code: `ORN-${year}-${count}`,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setReservations(prev => [newReservation, ...prev]);
    firestoreService.saveReservation(newReservation).catch(err => console.error(err));

    // Automatically create financial record for the advance/sinal if greater than 0
    if (newReservation.advancePaid > 0) {
      const newTx: FinancialTransaction = {
        id: `tx-${Date.now()}`,
        description: `Sinal da Reserva #${newReservation.code} - ${newReservation.clientName}`,
        type: 'receita',
        category: 'sinal_reserva',
        amount: newReservation.advancePaid,
        date: newReservation.createdAt,
        reservationId: newReservation.id,
        reservationCode: newReservation.code,
        status: 'pago'
      };
      setTransactions(prev => [newTx, ...prev]);
      firestoreService.saveTransaction(newTx).catch(err => console.error(err));
    }

    // If remaining amount exists, create a scheduled expected transaction
    if (newReservation.remainingAmount > 0) {
      const remainingTx: FinancialTransaction = {
        id: `tx-rem-${Date.now()}`,
        description: `Saldo Restante da Reserva #${newReservation.code} - ${newReservation.clientName}`,
        type: 'receita',
        category: 'quitacao_reserva',
        amount: newReservation.remainingAmount,
        date: newReservation.startDate,
        reservationId: newReservation.id,
        reservationCode: newReservation.code,
        status: 'previsto'
      };
      setTransactions(prev => [remainingTx, ...prev]);
      firestoreService.saveTransaction(remainingTx).catch(err => console.error(err));
    }

    return newReservation;
  };

  const updateReservation = (id: string, updatedData: Partial<Reservation>) => {
    setReservations(prev => prev.map(r => {
      if (r.id === id) {
        const merged = { ...r, ...updatedData };
        if (updatedData.rentalAmount !== undefined || updatedData.cleaningFee !== undefined || updatedData.discount !== undefined || updatedData.advancePaid !== undefined) {
          const total = (merged.rentalAmount || 0) + (merged.cleaningFee || 0) - (merged.discount || 0);
          merged.totalAmount = total;
          merged.remainingAmount = Math.max(0, total - (merged.advancePaid || 0));
          if (merged.advancePaid >= total && total > 0) {
            merged.paymentStatus = 'totalmente_pago';
          } else if (merged.advancePaid > 0) {
            merged.paymentStatus = 'sinal_pago';
          } else {
            merged.paymentStatus = 'pendente';
          }
        }
        firestoreService.saveReservation(merged).catch(err => console.error(err));
        return merged;
      }
      return r;
    }));
  };

  const deleteReservation = (id: string) => {
    setReservations(prev => prev.filter(r => r.id !== id));
    firestoreService.deleteReservation(id).catch(err => console.error(err));

    setTransactions(prev => {
      const remaining = prev.filter(t => t.reservationId !== id);
      const toDelete = prev.filter(t => t.reservationId === id);
      toDelete.forEach(t => firestoreService.deleteTransaction(t.id).catch(() => {}));
      return remaining;
    });

    setInspectionRecords(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const getReservationById = (id: string) => {
    return reservations.find(r => r.id === id);
  };

  // Additional Items handlers
  const addAdditionalItem = (data: Omit<AdditionalItem, 'id'>): AdditionalItem => {
    const newItem: AdditionalItem = {
      ...data,
      id: `add-${Date.now()}`
    };
    setAdditionalItems(prev => [newItem, ...prev]);
    firestoreService.saveAdditionalItem(newItem).catch(err => console.error(err));
    return newItem;
  };

  const updateAdditionalItem = (id: string, updated: Partial<AdditionalItem>) => {
    setAdditionalItems(prev => prev.map(item => {
      if (item.id === id) {
        const merged = { ...item, ...updated };
        firestoreService.saveAdditionalItem(merged).catch(err => console.error(err));
        return merged;
      }
      return item;
    }));
  };

  const deleteAdditionalItem = (id: string) => {
    setAdditionalItems(prev => prev.filter(item => item.id !== id));
    firestoreService.deleteAdditionalItem(id).catch(err => console.error(err));
  };

  const toggleAdditionalItemActive = (id: string) => {
    setAdditionalItems(prev => prev.map(item => {
      if (item.id === id) {
        const merged = { ...item, active: !item.active };
        firestoreService.saveAdditionalItem(merged).catch(err => console.error(err));
        return merged;
      }
      return item;
    }));
  };

  // Reservation Types handlers (Cadastrar, Alterar, Editar, Excluir)
  const addReservationType = (data: Omit<ReservationType, 'id'>): ReservationType => {
    const newType: ReservationType = {
      ...data,
      id: `type-${Date.now()}`
    };
    setReservationTypes(prev => [...prev, newType]);
    firestoreService.saveReservationType(newType).catch(err => console.error(err));
    return newType;
  };

  const updateReservationType = (id: string, updated: Partial<ReservationType>) => {
    setReservationTypes(prev => prev.map(t => {
      if (t.id === id) {
        const merged = { ...t, ...updated };
        firestoreService.saveReservationType(merged).catch(err => console.error(err));
        return merged;
      }
      return t;
    }));
  };

  const deleteReservationType = (id: string) => {
    setReservationTypes(prev => prev.filter(t => t.id !== id));
    firestoreService.deleteReservationType(id).catch(err => console.error(err));
  };

  const toggleReservationTypeActive = (id: string) => {
    setReservationTypes(prev => prev.map(t => {
      if (t.id === id) {
        const merged = { ...t, active: !t.active };
        firestoreService.saveReservationType(merged).catch(err => console.error(err));
        return merged;
      }
      return t;
    }));
  };

  // Checklist de Conferência handlers
  const addChecklistItem = (item: Omit<InspectionCheckItem, 'id' | 'statusIn' | 'statusOut'>): InspectionCheckItem => {
    const newItem: InspectionCheckItem = {
      ...item,
      id: `insp-${Date.now()}`,
      statusIn: 'ok',
      statusOut: 'ok',
      notes: item.notes || ''
    };
    setChecklistItems(prev => [...prev, newItem]);
    return newItem;
  };

  const updateChecklistItem = (id: string, updated: Partial<InspectionCheckItem>) => {
    setChecklistItems(prev => prev.map(item => item.id === id ? { ...item, ...updated } : item));
  };

  const deleteChecklistItem = (id: string) => {
    setChecklistItems(prev => prev.filter(item => item.id !== id));
  };

  const resetChecklistItems = () => {
    setChecklistItems(defaultInspectionItems);
  };

  // Finance
  const addTransaction = (data: Omit<FinancialTransaction, 'id'>) => {
    const newTx: FinancialTransaction = {
      ...data,
      id: `tx-${Date.now()}`
    };
    setTransactions(prev => [newTx, ...prev]);
    firestoreService.saveTransaction(newTx).catch(err => console.error(err));
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    firestoreService.deleteTransaction(id).catch(err => console.error(err));
  };

  const markTransactionPaid = (id: string) => {
    setTransactions(prev => prev.map(t => {
      if (t.id === id) {
        const merged: FinancialTransaction = { ...t, status: 'pago' };
        firestoreService.saveTransaction(merged).catch(err => console.error(err));
        return merged;
      }
      return t;
    }));
  };

  // Inspection
  const getInspectionForReservation = (reservationId: string): InspectionRecord => {
    if (inspectionRecords[reservationId]) {
      return inspectionRecords[reservationId];
    }
    const res = getReservationById(reservationId);
    return {
      reservationId,
      checkinDate: res?.startDate || new Date().toISOString().split('T')[0],
      checkoutDate: res?.endDate || res?.startDate || '',
      inspectorName: 'Administração Órion',
      clientPresent: true,
      electricMeterIn: '',
      electricMeterOut: '',
      waterMeterIn: '',
      waterMeterOut: '',
      damagesNotes: '',
      damageDeductionAmount: 0,
      items: JSON.parse(JSON.stringify(checklistItems))
    };
  };

  const saveInspection = (record: InspectionRecord) => {
    setInspectionRecords(prev => ({
      ...prev,
      [record.reservationId]: record
    }));
    firestoreService.saveInspectionRecord(record).catch(err => console.error(err));

    updateReservation(record.reservationId, {
      inspectionCheckinDone: true,
      inspectionCheckoutDone: !!record.checkoutDate && record.items.every(i => i.statusOut)
    });
  };

  // Inventory
  const addInventoryItem = (data: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      ...data,
      id: `inv-${Date.now()}`
    };
    setInventory(prev => [...prev, newItem]);
  };

  const updateInventoryItem = (id: string, updated: Partial<InventoryItem>) => {
    setInventory(prev => prev.map(item => item.id === id ? { ...item, ...updated } : item));
  };

  const deleteInventoryItem = (id: string) => {
    setInventory(prev => prev.filter(item => item.id !== id));
  };

  // Calendar Helpers
  const getReservationsForDate = (dateStr: string): Reservation[] => {
    return reservations.filter(res => {
      if (res.reservationStatus === 'cancelada') return false;
      const start = res.startDate;
      const end = res.endDate || res.startDate;
      return dateStr >= start && dateStr <= end;
    });
  };

  const isDateAvailable = (dateStr: string, excludeReservationId?: string): boolean => {
    const conflicting = reservations.filter(res => {
      if (excludeReservationId && res.id === excludeReservationId) return false;
      if (res.reservationStatus === 'cancelada') return false;
      const start = res.startDate;
      const end = res.endDate || res.startDate;
      return dateStr >= start && dateStr <= end;
    });
    return conflicting.length === 0;
  };

  // Helpers
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDateBR = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  const generateWhatsAppUrl = (phone: string, text: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const fullPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    return `https://wa.me/${fullPhone}?text=${encodeURIComponent(text)}`;
  };

  const resetAllData = () => {
    localStorage.removeItem('orion_venue_config');
    localStorage.removeItem('orion_areas');
    localStorage.removeItem('orion_reservations');
    localStorage.removeItem('orion_transactions');
    localStorage.removeItem('orion_inventory');
    localStorage.removeItem('orion_additional_items');
    localStorage.removeItem('orion_reservation_types');
    localStorage.removeItem('orion_checklist_items');
    localStorage.removeItem('orion_inspections');

    setVenueConfig(initialVenueConfig);
    setAreas(initialAreas);
    setReservations(initialReservations);
    setTransactions(initialTransactions);
    setInventory(initialInventory);
    setAdditionalItems(initialAdditionalItems);
    setReservationTypes(initialReservationTypes);
    setChecklistItems(defaultInspectionItems);
    setInspectionRecords({});
  };

  const exportBackupJSON = () => {
    const backup = {
      venueConfig,
      areas,
      reservations,
      transactions,
      inventory,
      additionalItems,
      reservationTypes,
      checklistItems,
      inspectionRecords,
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(backup, null, 2);
  };

  const importBackupJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.venueConfig) setVenueConfig(data.venueConfig);
      if (data.areas) setAreas(data.areas);
      if (data.reservations) setReservations(data.reservations);
      if (data.transactions) setTransactions(data.transactions);
      if (data.inventory) setInventory(data.inventory);
      if (data.additionalItems) setAdditionalItems(data.additionalItems);
      if (data.reservationTypes) setReservationTypes(data.reservationTypes);
      if (data.checklistItems) setChecklistItems(data.checklistItems);
      if (data.inspectionRecords) setInspectionRecords(data.inspectionRecords);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <VenueContext.Provider value={{
      isCloudSynced,
      venueConfig,
      setVenueConfig,
      areas,
      reservations,
      transactions,
      inventory,
      additionalItems,
      reservationTypes,
      checklistItems,
      inspectionRecords,
      addReservation,
      updateReservation,
      deleteReservation,
      getReservationById,
      addAdditionalItem,
      updateAdditionalItem,
      deleteAdditionalItem,
      toggleAdditionalItemActive,
      addReservationType,
      updateReservationType,
      deleteReservationType,
      toggleReservationTypeActive,
      addChecklistItem,
      updateChecklistItem,
      deleteChecklistItem,
      resetChecklistItems,
      addTransaction,
      deleteTransaction,
      markTransactionPaid,
      getInspectionForReservation,
      saveInspection,
      addInventoryItem,
      updateInventoryItem,
      deleteInventoryItem,
      getReservationsForDate,
      isDateAvailable,
      formatCurrency,
      formatDateBR,
      generateWhatsAppUrl,
      resetAllData,
      exportBackupJSON,
      importBackupJSON
    }}>
      {children}
    </VenueContext.Provider>
  );
};

export const useVenue = () => {
  const context = useContext(VenueContext);
  if (!context) {
    throw new Error('useVenue must be used within a VenueProvider');
  }
  return context;
};
