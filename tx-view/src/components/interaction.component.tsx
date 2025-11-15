"use client";

import { useState, useRef, useEffect } from "react";
import "./interaction.component.css";

interface Transaction {
  id: number;
  customer: string;
  amount: number;
  date: string;
  status: 'pending' | 'accepted' | 'rejected';
}

// Initial hardcoded data
const initialData: Transaction[] = [
  { id: 1, customer: "יוסי כהן", date: "2025-10-01", amount: 8500, status: "accepted" },
  { id: 2, customer: "דנה לוי", date: "2025-09-22", amount: 12000, status: "rejected" },
  { id: 3, customer: "משה ישראלי", date: "2025-09-28", amount: 4000, status: "pending" },
];

export default function TransactionComponent() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialData);

  // filters for date and status dropdowns
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");

  // In case of an edit, we store the current transaction here
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);

  // If we are in an edit or add mode
  const [enableAddOrEdit, setAddOrEdit] = useState(false);

  // Refs for form inputs
  const customerRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLSelectElement>(null);

  // Sorting and ordering
  const [sortField, setSortField] = useState<keyof Transaction | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Only show filtered transactions
  const filtered = transactions.filter(t => {
    const isoDateOnly = t.date.split("T")[0]
    return (
      (!statusFilter || t.status === statusFilter) &&
      (!dateFilter || dateFilter === isoDateOnly)
    );
  }).sort((a, b) => {
    if (!sortField) return 0;

    const valA = a[sortField];
    const valB = b[sortField];

    // numbers
    if (typeof valA === "number" && typeof valB === "number") {
      return sortOrder === "asc" ? valA - valB : valB - valA;
    }

    // strings
    return sortOrder === "asc"
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const addTransaction = (tx: Transaction) => {
    setTransactions(prev => [...prev, { ...tx }]);
  };

  const removeTransaction = (id: number) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateTransaction = (id: number, updated: Partial<Transaction>) => {
    setTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, ...updated } : t))
    );
  };

  // Handle current transaction changes
  useEffect(() => {
    if (currentTransaction !== null) {
      if (customerRef.current) customerRef.current.value = currentTransaction.customer;
      if (amountRef.current) amountRef.current.value = currentTransaction.amount.toString();
      if (statusRef.current) statusRef.current.value = currentTransaction.status;
    }
  }, [currentTransaction]);

  // Fetch transaction data
  useEffect(() => {
    fetch("/data.json")
      .then(res => res.json())
      .then((data: Transaction[]) => {
        setTransactions(data);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
      });
  }, []);

  // Reset states of form and inputs
  const resetState = () => {
    if (customerRef.current) customerRef.current.value = "";
    if (amountRef.current) amountRef.current.value = "";
    if (statusRef.current) statusRef.current.value = "";
    setCurrentTransaction(null);
    setAddOrEdit(false);
  }

  const handleSort = (field: keyof Transaction) => {
    if (sortField === field) {
      // toggle asc/desc
      setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      // new column -> start with ascending
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentTransaction === null) {
      if (!customerRef.current || !amountRef.current) return;

      const customer = customerRef.current.value;
      const amount = Number(amountRef.current.value);

      if (customer === "" || isNaN(amount) || amount <= 0) return;

      addTransaction({
        id: transactions.length + 1,
        customer: customer,
        amount: amount,
        date: new Date().toISOString(),
        status: "pending",
      });
    } else {
      updateTransaction(currentTransaction.id, {
        customer: currentTransaction.customer,
        amount: currentTransaction.amount,
        status: statusRef.current ? statusRef.current.value as 'pending' | 'accepted' | 'rejected' : currentTransaction.status,
      });
    }
    resetState();
  };

  const handleEditTransaction = (tx: Transaction) => () => {
    setAddOrEdit(true);
    setCurrentTransaction(tx);
  }

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: "1rem" }}>
      <h2>רשימת עסקאות</h2>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <select
          value={statusFilter}
          onChange={e => {
            setStatusFilter(e.target.value);
            resetState();
          }}>
          <option value="">כל הסטטוסים</option>
          <option value="accepted">מאושר</option>
          <option value="pending">ממתין</option>
          <option value="rejected">נדחה</option>
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={e => {
            setDateFilter(e.target.value);
            resetState();
          }}
        />
      </div>

      <table width="100%" border={1} cellPadding={6}>
        <thead>
          <tr>
            <th onClick={() => handleSort("customer")}>{sortField === "customer" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              שם הלקוח</th>
            <th onClick={() => handleSort("date")}>{sortField === "date" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              תאריך</th>
            <th onClick={() => handleSort("amount")}>{sortField === "amount" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              סכום</th>
            <th onClick={() => handleSort("status")}>{sortField === "status" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              סטטוס</th>
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
              <td className="text">{t.customer}</td>
              <td className="text">{t.date}</td>
              <td className="text">{t.amount.toLocaleString()} ₪</td>
              <td className="text">{t.status}</td>
              <td>
                <button onClick={handleEditTransaction(t)}>✏️</button>
                <button onClick={() => {
                  removeTransaction(t.id);
                  resetState();
                }}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {enableAddOrEdit ?
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "row", gap: "8px", maxWidth: 240 }}>
          {currentTransaction === null
            ? <input
              ref={customerRef}
              placeholder="Customer"
              required
              minLength={3}
            />
            : <label>{currentTransaction.customer}</label>
          }

          {currentTransaction === null
            ? <input
              ref={amountRef}
              type="number"
              placeholder="Amount"
              min={0.01}
              step="0.01"
              required
            />
            : <label>{currentTransaction.amount} ₪</label>
          }

          {currentTransaction !== null &&
            (<label>{currentTransaction.date.split("T")[0]}</label>)}

          {currentTransaction !== null
            ? <div style={{ display: "flex", flexDirection: "row" }}>
              <span>Current status: {currentTransaction.status}</span>
              <select ref={statusRef}>
                <option value="accepted">מאושר</option>
                <option value="pending">ממתין</option>
                <option value="rejected">נדחה</option>
              </select>
            </div>
            : null
          }

          <button type="submit">Save</button>
          <button onClick={() => resetState()}>Cancel</button>
        </form>
        : <button onClick={() => {
          setAddOrEdit(true);
        }}>הוסף עסקה</button>
      }
    </div>
  );
}