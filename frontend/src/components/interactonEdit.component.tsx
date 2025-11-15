import { useRef, useEffect, type FormEvent } from "react";
import type { Transaction } from "./interaction.component";

interface InteractionItemComponentProps {
    transaction: Transaction | null;
    add: (customer: string, amount: number) => void;
    edit: (tx: Transaction) => void;
    reset: () => void;
}

export default function InteractionEditComponent({ transaction, add, reset, edit }: InteractionItemComponentProps) {

    // Refs for form inputs
    const customerRef = useRef<HTMLInputElement>(null);
    const amountRef = useRef<HTMLInputElement>(null);
    const statusRef = useRef<HTMLSelectElement>(null);

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (transaction === null) {
            const customer = customerRef.current?.value || "";
            const amount = parseFloat(amountRef.current?.value || "0");
            if (customer && amount > 0) {
                add(customer, amount);
            }
        }
        else {
            if (statusRef.current) {
                const status = statusRef.current.value as 'pending' | 'accepted' | 'rejected';
                edit({ ...transaction, status });
            }
        }
        reset();
    };

    useEffect(() => {
        if (transaction === null) {
            if (customerRef.current) customerRef.current.value = "";
            if (amountRef.current) amountRef.current.value = "";
            if (statusRef.current) statusRef.current.value = "";
        } else {

            if (customerRef.current) customerRef.current.value = transaction.customer;
            if (amountRef.current) amountRef.current.value = transaction.amount.toString();
            if (statusRef.current) statusRef.current.value = transaction.status;
        }
    }, [transaction]);

    return (
        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "row", gap: "8px", maxWidth: 240 }}>
            {transaction === null
                ? <input
                    ref={customerRef}
                    placeholder="Customer"
                    required
                    minLength={3}
                />
                : <label>{transaction.customer}</label>
            }

            {transaction === null
                ? <input
                    ref={amountRef}
                    type="number"
                    placeholder="Amount"
                    min={0.01}
                    step="0.01"
                    required
                />
                : <label>{transaction.amount} ₪</label>
            }

            {transaction !== null &&
                (
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <label>{transaction.date.split("T")[0]}</label>
                        <span>Current status: {transaction.status}</span>
                        <select ref={statusRef}>
                            <option value="accepted">מאושר</option>
                            <option value="pending">ממתין</option>
                            <option value="rejected">נדחה</option>
                        </select>
                    </div>
                )}

            <button type="submit">Save</button>
            <button onClick={() => reset()}>Cancel</button>
        </form>
    );
}