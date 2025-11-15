
import type { Transaction } from "./interaction.component";

interface InteractionItemProps {
    key: number;
    transaction: Transaction;
    edit: (tx: Transaction) => void;
    remove: (tx: Transaction) => void;
    reset: () => void;
}

export default function InteractionItemComponent({ transaction, edit, remove, reset }: InteractionItemProps) {
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