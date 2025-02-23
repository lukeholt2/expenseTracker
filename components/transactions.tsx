'use client'
import { useCallback, useEffect, useState } from "react";
import { ExpenseTable } from '@/components/expenseTable';
import { getExpenses } from "@/app/actions";

export default function Transactions() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const loadExpenses = async () => {
      const expenses = await getExpenses();
      setExpenses(expenses);
    }
    loadExpenses();
  }, [])

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
      <ExpenseTable headers={tableRows} data={expenses} onAdd={onAdd}></ExpenseTable>
    </>
  );
}
