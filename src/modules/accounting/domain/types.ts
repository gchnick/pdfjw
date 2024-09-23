export enum TransactionType {
  DONATION = "donation",
  PAY = "pay",
  CASH_AVANCE = "cashAvance",
  CASH_BOX_DEPOSIT = "cashBoxDeposit",
}

type AnotherTransaction = {
  descripton: string;
  amount: number;
};

export type OtherTransactions = [
  AnotherTransaction,
  AnotherTransaction?,
  AnotherTransaction?,
];

type AnotherTransactionFormatted = {
  descripton: string;
  amount: string;
};

export type OtherTransactionsFormatted = [
  AnotherTransactionFormatted,
  AnotherTransactionFormatted?,
  AnotherTransactionFormatted?,
];

export type TransactionRecordFormatted = {
  date: string;
  type: string;
  worldwideWorkDonations: string;
  congregationExpenses: string;
  otherTransactions?: OtherTransactionsFormatted;
  total: string;
};
