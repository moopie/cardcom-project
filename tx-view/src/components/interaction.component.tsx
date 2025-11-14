// App.tsx
import React, { useState, useRef, useEffect } from "react";
import "./interaction.component.css";

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
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
  const [edit, setEdit] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLSelectElement>(null);

  const [sortField, setSortField] = useState<keyof Transaction | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const filtered = transactions.filter(t => {
    const isoDateOnly = t.date.split("T")[0]
    console.log("Filtering:", { statusFilter, dateFilter, transactionDate: isoDateOnly, result: dateFilter === isoDateOnly });
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

    // strings (name, date, status)
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

  useEffect(() => {
    if (editTransaction !== null) {
      if (nameRef.current && amountRef.current && statusRef.current) {
        nameRef.current.value = editTransaction.customer;
        amountRef.current.value = editTransaction.amount.toString();
        statusRef.current.value = editTransaction.status;
      }
    }
  }, [editTransaction]);

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

  const handleSort = (field: keyof Transaction) => {
    if (sortField === field) {
      // toggle asc/desc
      setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      // new column → start with ascending
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameRef.current && amountRef.current) {
      if (nameRef.current.value !== "" && amountRef.current.value !== "") {
        const amount = Number(amountRef.current.value);
        if (!isNaN(amount) && amount > 0) {
          console.log(`transactions: ${transactions.length}`);
          if (editTransaction !== null) {
            updateTransaction(editTransaction.id, {
              customer: nameRef.current.value,
              amount: amount,
              status: statusRef.current ? statusRef.current.value as 'pending' | 'accepted' | 'rejected' : editTransaction.status,
            });
          } else {
            addTransaction({
              id: transactions.length + 1,
              customer: nameRef.current!.value,
              amount: amount,
              date: new Date().toISOString(),
              status: "pending",
            });
          }
        }
      }
      nameRef.current.value = "";
      amountRef.current.value = "";
      setEditTransaction(null);
      setEdit(false);
    }
  };

  const handleEdit = (tx: Transaction) => () => {
    setEdit(true);
    setEditTransaction(tx);
    console.log("Edit transaction", tx);
  }

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: "1rem" }}>
      <h2>רשימת עסקאות</h2>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <select
          value={statusFilter}
          onChange={e => {
            setStatusFilter(e.target.value);
            setEditTransaction(null);
            setEdit(false);
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
            console.log("Date filter changed:", e.target.value);
            setDateFilter(e.target.value);
            setEditTransaction(null);
            setEdit(false);
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
                <button onClick={handleEdit(t)}>✏️</button>
                <button onClick={() => {
                  removeTransaction(t.id);
                  setEditTransaction(null);
                  setEdit(false);
                }}>🗑️</button>
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

          {editTransaction !== null
            ? <div style={{ display: "flex", flexDirection: "row" }}>
              <span>Current status: {editTransaction.status}</span>
              <select ref={statusRef} >
                <option value="accepted">מאושר</option>
                <option value="pending">ממתין</option>
                <option value="rejected">נדחה</option>
              </select>
            </div>
            : null
          }

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
          setEditTransaction(null);
          setEdit(true);
        }}>הוסף עסקה</button>
      }
    </div>
  );
}