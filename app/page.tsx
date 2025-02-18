'use client'
import { useState } from "react";
import { ExpenseTable } from '@/components/table';

export default function Home() {
  const [value, setValue] = useState(0);
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <ExpenseTable headers={[{ key: '1', label: 'test' }]}></ExpenseTable>
    </section>
  );
}
