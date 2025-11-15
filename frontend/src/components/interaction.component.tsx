"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import "./interaction.component.css";
import InteractionItemComponent from "./interationItem.component";
import InteractionEditComponent from "./interactonEdit.component";

export interface Transaction {
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

  // Sorting and ordering states
  const [sortField, setSortField] = useState<keyof Transaction | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Function to use in filtering transactions
  const transactionFilter = useCallback((t: Transaction) => {
    const isoDateOnly = t.date.split("T")[0]
    return (
      (!statusFilter || t.status === statusFilter) &&
      (!dateFilter || dateFilter === isoDateOnly)
    );
  }, [dateFilter, statusFilter]);

  // Function to use in sorting transactions
  const transactionSort = useCallback((a: Transaction, b: Transaction) => {
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
  }, [sortField, sortOrder]);

  // Filtered and sorted transactions
  const filtered = useMemo(() => {
    return transactions.filter(transactionFilter).sort(transactionSort);
  }, [transactions, transactionFilter, transactionSort]);

  const addTransaction = (tx: Transaction) => {
    setTransactions(prev => [...prev, { ...tx }]);
  };

  const removeTransaction = (tx: Transaction) => {
    console.log("Removing transaction:", tx);
    setTransactions(prev => prev.filter(t => t.id !== tx.id));
  };

  const updateTransaction = (id: number, updated: Partial<Transaction>) => {
    setTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, ...updated } : t))
    );
  };

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

  const handleEditTransaction = (tx: Transaction) => {
    console.log("Editing transaction:", tx);
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
            <InteractionItemComponent
              key={t.id}
              transaction={t}
              edit={handleEditTransaction}
              remove={removeTransaction}
              reset={resetState}
            />
          ))}
        </tbody>
      </table>

      {enableAddOrEdit ?
        <InteractionEditComponent
          transaction={currentTransaction}
          //handleSubmit={handleSubmit}
          add={(customer: string, amount: number) => {
            addTransaction({
              id: transactions.length + 1,
              customer: customer,
              amount: amount,
              date: new Date().toISOString(),
              status: "pending",
            })}}
          edit={(tx: Transaction) => {
            updateTransaction(tx.id, {
              customer: tx.customer,
              amount: tx.amount,
              status: tx.status,
            })}}
          reset={resetState}
        />
        : <button onClick={() => {
          setAddOrEdit(true);
        }}>הוסף עסקה</button>
      }
    </div>
  );
}