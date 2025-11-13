// App.tsx
import React, { useState } from "react";
import { useTransactions } from "../hooks/useTransactions";
import { Transaction } from "../types";
import { AddTransaction } from "./addTransaction.component";

const initialData: Transaction[] = [
  { id: 1, customer: "יוסי כהן", date: "2025-10-01", amount: 8500, status: "accepted" },
  { id: 2, customer: "דנה לוי", date: "2025-09-22", amount: 12000, status: "rejected" },
  { id: 3, customer: "משה ישראלי", date: "2025-09-28", amount: 4000, status: "pending" },
];

export default function TransactionList() {
  const { transactions, removeTransaction, addTransaction, updateTransaction } =
    useTransactions(initialData);

  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");

  const filtered = transactions.filter(t => {
    return (
      (!statusFilter || t.status === statusFilter) &&
      (!dateFilter || t.date >= dateFilter)
    );
  });

  const handleSubmit = (values: { customer: string; amount?: number }) => {
    if (values.amount) {
      addTransaction({
        id: 0,
        customer: values.customer,
        amount: values.amount,
        date: new Date().toISOString().split("T")[0],
        status: "pending",
      });
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: "1rem" }}>
      <h2>רשימת עסקאות</h2>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">כל הסטטוסים</option>
          <option value="approved">מאושר</option>
          <option value="pending">ממתין</option>
          <option value="rejected">נדחה</option>
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
        />
      </div>

      <table width="100%" border={1} cellPadding={6}>
        <thead>
          <tr>
            <th>שם הלקוח</th>
            <th>תאריך</th>
            <th>סכום</th>
            <th>סטטוס</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(t => (
            <tr
              key={t.id}
              style={{
                background: t.amount > 10000 ? "#fff5cc" : "white",
              }}
            >
              <td>{t.customer}</td>
              <td>{t.date}</td>
              <td>{t.amount.toLocaleString()} ₪</td>
              <td>{t.status}</td>
              <td>
                <button onClick={() => removeTransaction(t.id)}>X</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <AddTransaction onSubmit={handleSubmit}/>
    </div>
  );
}