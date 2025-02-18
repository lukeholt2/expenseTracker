'use client'
import { useState } from "react";
import { ExpenseTable } from '@/components/expenseTable';

export default function Transactions() {
  const [value, setValue] = useState(0);
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <ExpenseTable headers={[{ key: '1', label: 'transactions' }]}></ExpenseTable>
    </section>
  );
}
