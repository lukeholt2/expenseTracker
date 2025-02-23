'use client'
import { useCallback, useState } from "react";
import { ExpenseTable } from '@/components/expenseTable';

export default function Transactions() {
  const [value, setValue] = useState(0);

  const tableRows = [
    { key: '1', label: 'Date' },
    { key: '2', label: 'Amount' },
    { key: '3', label: 'Item' },
    { key: '4', label: 'Location' },
    { key: '5', label: 'Category' }
  ]

  const onAdd = useCallback(() => {},[]);

  return (
    <>
      <ExpenseTable headers={tableRows} data={[]} onAdd={onAdd}></ExpenseTable>
    </>
  );
}
