export interface Source {
  id: string;
  bankName: string;
  name: string;
  description: string;
  value: number;
}

export interface Detail {
  createdAt: string;
  source: string;
  transactionTime: string;
  diffValue: number;
  remain: number;
  targetAccount: string;
  description: string;
  type: string;
}
