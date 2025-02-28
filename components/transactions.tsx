'use client'
import { useCallback, useEffect, useState } from "react";
import { } from "@heroui/modal";
import { ExpenseTable } from '@/components/expenseTable';
import { getExpenses } from "@/app/actions";
import {useDisclosure} from "@heroui/react";
import { Expense } from "@/models/expense";
import ExpenseModal from "./expenseModal";


export default function Transactions() {
  const [expenses, setExpenses] = useState([]);
  const [expenseToSave, setExpenseToSave] = useState<Expense | null>(null)
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const loadState = useCallback(async () => {
    setExpenses(await getExpenses());
  }, [expenses, setExpenses])

  useEffect(() => {
    loadState()
  }, [])

  const tableRows = [
    { key: 'date', label: 'Date' },
    { key: 'amount', label: 'Amount' },
    { key: 'item', label: 'Item' },
    { key: 'location', label: 'Location' },
    { key: 'category', label: 'Category' },
    { key: 'Actions', label: 'Actions' }
  ]

  return (
    <>
      { expenseToSave && <ExpenseModal 
        onSave={loadState}
        expense={expenseToSave}
        isOpen={isOpen}
        onclose={() => {
          setExpenseToSave(null);
        }}
        onOpenChange={onOpenChange}></ExpenseModal> 
      }
      <ExpenseTable headers={tableRows} 
        data={expenses} 
        onAdd={() => {
          setExpenseToSave(new Expense());
          onOpen();
        }} 
        onEdit={(expense) => {
          console.log(expense)
        setExpenseToSave(expense);
        onOpen();
      }}></ExpenseTable>
    </>
  );
}
