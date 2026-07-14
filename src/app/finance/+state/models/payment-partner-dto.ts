export interface PaymentPartnerDto {
  paymentPartnerId: number;
  displayName: string;
  iban: string | null;
  /** Gesetzt, wenn die IBAN zu einem eigenen Konto gehört (Eigenübertrag). */
  linkedAccountId: number | null;
  transactionCount: number;
  /** ISO date string (yyyy-MM-dd) oder null, wenn der Partner keine Buchungen hat. */
  lastBookingDate: string | null;
}
