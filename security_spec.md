# Security Specification - Órion Eventos e Lazer

## 1. Data Invariants

1. **Reservation Integrity**: A reservation cannot exist without a valid human-readable booking code (`code`), client name (`clientName`), start date (`startDate`), non-negative total amount (`totalAmount >= 0`), and valid statuses (`paymentStatus` and `reservationStatus`).
2. **Transaction Balance Integrity**: A financial transaction cannot have a negative amount, must have a non-empty description, valid category, type ('receita' | 'despesa'), and status ('pago' | 'previsto').
3. **ID Hardening**: All collection document IDs must be strings, with maximum 128 characters, matching alphanumeric, hyphen, and underscore patterns (`^[a-zA-Z0-9_\-]+$`).
4. **Denial of Wallet Defense**: All string fields are constrained with rigorous `.size()` limits (names <= 150 chars, descriptions <= 1000 chars) to prevent payload bloat.
5. **No Orphaned Transactions**: Transactions referencing a `reservationId` must be linked to a valid reservation ID format.
6. **State Transitions**: `paymentStatus` only accepts `pendente`, `sinal_pago`, or `totalmente_pago`. `reservationStatus` only accepts `orcamento`, `confirmada`, `em_andamento`, `concluida`, `cancelada`.

---

## 2. The "Dirty Dozen" Payloads (Must Return PERMISSION_DENIED)

1. **Payload 1 (Ghost Field Injection / Shadow Update)**:
   Attempting to write an unexpected field `isAdmin: true` into a reservation document.
2. **Payload 2 (Extreme String Length / Resource Exhaustion)**:
   Attempting to write `clientName` with 50,000 characters.
3. **Payload 3 (Negative Value Attack)**:
   Attempting to create a transaction with `amount: -5000`.
4. **Payload 4 (Malformed Status Poisoning)**:
   Attempting to update `reservationStatus` to `hacked_free_booking`.
5. **Payload 5 (Path Traversal / Junk Character Document ID)**:
   Writing to `/reservations/../../../bad_id` or 2000-character ID.
6. **Payload 6 (Invalid Data Type in Amount)**:
   Attempting to store `totalAmount: "ten thousand"` instead of number.
7. **Payload 7 (Missing Required Schema Fields)**:
   Creating a reservation without `clientName` or `startDate`.
8. **Payload 8 (Blanket Unauthenticated Write on Non-Existent Path)**:
   Writing to an arbitrary unmapped collection like `/system_secrets/keys`.
9. **Payload 9 (Transaction Type Poisoning)**:
   Writing a transaction with `type: "rebate"` (only "receita" or "despesa" allowed).
10. **Payload 10 (Catalog Item Price Manipulation)**:
    Attempting to create an additional item with a negative price (`price: -250`).
11. **Payload 11 (Inspection Record with Malformed Items)**:
    Saving an inspection record where `items` is not a list.
12. **Payload 12 (Venue Config Address Overwrite with Null)**:
    Updating `venueConfig` removing required fields like `name` or `cnpj`.

---

## 3. Test Runner Concept

A validation runner tests that each dirty payload is rejected by Firestore security rules with `PERMISSION_DENIED` and valid payloads conform strictly to the declared schemas.
