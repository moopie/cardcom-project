import React, { useState } from "react";

interface Props {
  onSubmit: (values: FormValues) => void;
}

export interface FormValues {
  customer: string;
  amount?: number;
}

export function AddTransaction({ onSubmit }: Props) {
  const [values, setValues] = useState<FormValues>({
    customer: "",
  });

  const [enabled, onEnable] = useState(false);

  const handleEnable = () => {
    onEnable(!enabled);
  }

  const handleChange = (key: keyof FormValues, value: string) => {
    setValues(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  const handleClick = () => {
    setValues({ customer: "" });
    onEnable(false);
  }

  if (!enabled) {
    return (
      <button onClick={handleEnable}>
        Enable Setting
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "8px", maxWidth: 240 }}>
      <input
        value={values.customer}
        onChange={e => handleChange("customer", e.target.value)}
        placeholder="Customer"
      />
      <input
        value={values.amount}
        onChange={e => handleChange("amount", e.target.value)}
        placeholder="Amount"
      />

      <button type="submit" onClick={handleClick}>Save</button>
    </form>
  );
}