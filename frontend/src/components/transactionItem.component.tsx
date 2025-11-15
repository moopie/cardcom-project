
import type { Transaction } from "./transaction.component";

interface TransactionItemProps {
    key: number;
    transaction: Transaction;
    edit: (tx: Transaction) => void;
    remove: (tx: Transaction) => void;
    reset: () => void;
}

export default function TransactionItemComponent({ transaction, edit, remove, reset }: TransactionItemProps) {
    return (
        <tr
            key={transaction.id}
            style={{
                background: transaction.amount > 10000 ? "#fff5cc" : "white",
            }}
        >
            <td className="text">{transaction.customer}</td>
            <td className="text">{transaction.date}</td>
            <td className="text">{transaction.amount.toLocaleString()} ₪</td>
            <td className="text">{transaction.status}</td>
            <td>
                <button onClick={() => edit(transaction)}>✏️</button>
                <button onClick={() => {
                    remove(transaction);
                    reset();
                }}>🗑️</button>
            </td>
        </tr>
    );
}