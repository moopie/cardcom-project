// useTransactions.ts
import { useState } from "react";
import { Transaction } from "../types";

export const useTransactions = (initial: Transaction[]) => {
  const [transactions, setTransactions] = useState(initial);

  const addTransaction = (tx: Transaction) => {
    setTransactions(prev => [...prev, { ...tx, id: Date.now() }]);
  };

  const removeTransaction = (id: number) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateTransaction = (id: number, updated: Partial<Transaction>) => {
    setTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, ...updated } : t))
    );
  };

  return { transactions, addTransaction, removeTransaction, updateTransaction };
};