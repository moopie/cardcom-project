// App.tsx
import React, { useState, useRef } from "react";

interface Transaction {
    id: number;
    customer: string;
    amount: number;
    date: string;
    status: 'pending' | 'accepted' | 'rejected';
}

const initialData: Transaction[] = [
  { id: 1, customer: "יוסי כהן", date: "2025-10-01", amount: 8500, status: "accepted" },
  { id: 2, customer: "דנה לוי", date: "2025-09-22", amount: 12000, status: "rejected" },
  { id: 3, customer: "משה ישראלי", date: "2025-09-28", amount: 4000, status: "pending" },
];

export default function TransactionComponent() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialData);

  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [edit, setEdit] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);

  const filtered = transactions.filter(t => {
    return (
      (!statusFilter || t.status === statusFilter) &&
      (!dateFilter || t.date >= dateFilter)
    );
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameRef.current && nameRef.current.value !== "" &&
      amountRef.current && amountRef.current.value !== "") {

      const amount = Number(amountRef.current.value);
      if (!isNaN(amount) && amount > 0) {
        addTransaction({
          id: transactions.length + 1,
          customer: nameRef.current!.value,
          amount: amount,
          date: new Date().toISOString().split("T")[0],
          status: "pending",
        });
      }
    }
  };

  const handleEdit = (id: number) => () => {
    console.log("Edit transaction", id);
  }

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: "1rem" }}>
      <h2>רשימת עסקאות</h2>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">כל הסטטוסים</option>
          <option value="accepted">מאושר</option>
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
                <button onClick={handleEdit(t.id)}>✏️</button>
                <button onClick={() => removeTransaction(t.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {edit ?
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "row", gap: "8px", maxWidth: 240 }}>
          <input
            ref={nameRef}
            placeholder="Customer"
            required
            minLength={3}
          />
          <input
            ref={amountRef}
            type="number"
            placeholder="Amount"
            min={1}
            required
          />

          <button type="submit">Save</button>
          <button onClick={() => setEdit(false)}>Cancel</button>
        </form>
        : <button onClick={() => {
          if (nameRef.current) {
            nameRef.current.value = "";
          }
          if (amountRef.current) {
            amountRef.current.value = "";
          }
          setEdit(true);
        }}>הוסף עסקה</button>
      }
    </div>
  );
}