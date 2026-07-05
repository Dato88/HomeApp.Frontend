export enum TransactionSource {
  Manual = 0,
  CsvImport = 1,
  CamtImport = 2,
}

export const TRANSACTION_SOURCE_LABELS: Record<TransactionSource, string> = {
  [TransactionSource.Manual]: 'Manual',
  [TransactionSource.CsvImport]: 'CSV import',
  [TransactionSource.CamtImport]: 'CAMT import',
};
