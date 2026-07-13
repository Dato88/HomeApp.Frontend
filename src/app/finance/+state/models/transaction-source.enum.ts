export enum TransactionSource {
  Manual = 0,
  CsvImport = 1,
  CamtImport = 2,
  XlsxImport = 3,
  PdfImport = 4,
}

export const TRANSACTION_SOURCE_LABELS: Record<TransactionSource, string> = {
  [TransactionSource.Manual]: 'Manuell',
  [TransactionSource.CsvImport]: 'CSV-Import',
  [TransactionSource.CamtImport]: 'CAMT-Import',
  [TransactionSource.XlsxImport]: 'Excel-Import',
  [TransactionSource.PdfImport]: 'PDF-Import',
};
