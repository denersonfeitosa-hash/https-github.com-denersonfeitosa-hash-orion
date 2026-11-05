import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './config';
import { 
  Reservation, 
  FinancialTransaction, 
  VenueConfig, 
  AdditionalItem, 
  ReservationType, 
  InspectionRecord,
  InspectionCheckItem
} from '../types';

export const firestoreService = {
  // --- VENUE CONFIG ---
  async getVenueConfig(): Promise<VenueConfig | null> {
    const path = 'venueConfig/main';
    try {
      const snap = await getDoc(doc(db, 'venueConfig', 'main'));
      return snap.exists() ? (snap.data() as VenueConfig) : null;
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, path);
    }
  },

  async saveVenueConfig(config: VenueConfig): Promise<void> {
    const path = 'venueConfig/main';
    try {
      await setDoc(doc(db, 'venueConfig', 'main'), {
        ...config,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  },

  // --- RESERVATIONS ---
  async getReservations(): Promise<Reservation[]> {
    const path = 'reservations';
    try {
      const snap = await getDocs(collection(db, path));
      return snap.docs.map(d => d.data() as Reservation);
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  },

  async saveReservation(reservation: Reservation): Promise<void> {
    const path = `reservations/${reservation.id}`;
    try {
      await setDoc(doc(db, 'reservations', reservation.id), reservation, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  },

  async deleteReservation(id: string): Promise<void> {
    const path = `reservations/${id}`;
    try {
      await deleteDoc(doc(db, 'reservations', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  },

  subscribeReservations(callback: (reservations: Reservation[]) => void) {
    const path = 'reservations';
    return onSnapshot(
      collection(db, path),
      (snapshot) => {
        const items = snapshot.docs.map(d => d.data() as Reservation);
        callback(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  },

  // --- TRANSACTIONS ---
  async getTransactions(): Promise<FinancialTransaction[]> {
    const path = 'transactions';
    try {
      const snap = await getDocs(collection(db, path));
      return snap.docs.map(d => d.data() as FinancialTransaction);
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  },

  async saveTransaction(tx: FinancialTransaction): Promise<void> {
    const path = `transactions/${tx.id}`;
    try {
      await setDoc(doc(db, 'transactions', tx.id), tx, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  },

  async deleteTransaction(id: string): Promise<void> {
    const path = `transactions/${id}`;
    try {
      await deleteDoc(doc(db, 'transactions', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  },

  subscribeTransactions(callback: (txs: FinancialTransaction[]) => void) {
    const path = 'transactions';
    return onSnapshot(
      collection(db, path),
      (snapshot) => {
        const items = snapshot.docs.map(d => d.data() as FinancialTransaction);
        callback(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  },

  // --- ADDITIONAL ITEMS ---
  async getAdditionalItems(): Promise<AdditionalItem[]> {
    const path = 'additionalItems';
    try {
      const snap = await getDocs(collection(db, path));
      return snap.docs.map(d => d.data() as AdditionalItem);
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  },

  async saveAdditionalItem(item: AdditionalItem): Promise<void> {
    const path = `additionalItems/${item.id}`;
    try {
      await setDoc(doc(db, 'additionalItems', item.id), item, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  },

  async deleteAdditionalItem(id: string): Promise<void> {
    const path = `additionalItems/${id}`;
    try {
      await deleteDoc(doc(db, 'additionalItems', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  },

  // --- RESERVATION TYPES ---
  async getReservationTypes(): Promise<ReservationType[]> {
    const path = 'reservationTypes';
    try {
      const snap = await getDocs(collection(db, path));
      return snap.docs.map(d => d.data() as ReservationType);
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  },

  async saveReservationType(type: ReservationType): Promise<void> {
    const path = `reservationTypes/${type.id}`;
    try {
      await setDoc(doc(db, 'reservationTypes', type.id), type, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  },

  async deleteReservationType(id: string): Promise<void> {
    const path = `reservationTypes/${id}`;
    try {
      await deleteDoc(doc(db, 'reservationTypes', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  },

  // --- INSPECTION RECORDS ---
  async saveInspectionRecord(record: InspectionRecord): Promise<void> {
    const path = `inspectionRecords/${record.reservationId}`;
    try {
      await setDoc(doc(db, 'inspectionRecords', record.reservationId), record, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  },

  async getInspectionRecords(): Promise<Record<string, InspectionRecord>> {
    const path = 'inspectionRecords';
    try {
      const snap = await getDocs(collection(db, path));
      const result: Record<string, InspectionRecord> = {};
      snap.docs.forEach(d => {
        const rec = d.data() as InspectionRecord;
        if (rec.reservationId) {
          result[rec.reservationId] = rec;
        }
      });
      return result;
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  }
};
