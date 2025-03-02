'use client'
import { useCallback, useEffect, useMemo, useState } from "react";
import { ExpenseTable } from '@/components/expenseTable';
import { getCategories, getExpenses } from "@/app/transactions/actions";
import { Button, Card, CardBody, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, useDisclosure } from "@heroui/react";
import { Expense } from "@/models/expense";
import ExpenseModal from "@/components/expenseModal";


export default function Transactions() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseToSave, setExpenseToSave] = useState<Expense | null>(null)
  const [categories, setCategories] = useState<string[]>([]);

  const [selectedCategory, setSelectedCategory] = useState('All');

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const loadState = useCallback(async () => {
    setExpenses(await getExpenses(undefined, undefined, selectedCategory));
    const categories: string[] = await getCategories();
    setCategories(['All', ...categories])
  }, [expenses, setExpenses, categories, setCategories, selectedCategory])

  useEffect(() => {
    loadState()
  }, [selectedCategory])

  const tableRows = [
    { key: 'date', label: 'Date' },
    { key: 'amount', label: 'Amount' },
    { key: 'location', label: 'Location' },
    { key: 'category', label: 'Category' }
  ]

  const totalSpent = useMemo(() => expenses.map(e => e.amount).reduce((prev, current) => prev + current, 0), [expenses])


  const categoryFilter = () => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <div className="flex gap-3">
            <Dropdown backdrop="blur">
              <DropdownTrigger>
                <Button variant="bordered" size='sm' className="text-small">{selectedCategory}</Button>
              </DropdownTrigger>
              <DropdownMenu
                selectedKeys={[selectedCategory]}
                selectionMode="single"
                onSelectionChange={(key) => setSelectedCategory(key.anchorKey ?? 'All')}
                aria-label="Category Filter"
                variant="faded"
              >
                {categories.map((cat) => <DropdownItem key={cat}>{cat}</DropdownItem>)}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Card style={{marginBottom: '1em'}}>
        <CardBody className="pt-4 px-4 flex-col items-center">
          <h4>${totalSpent}</h4>
        </CardBody>
      </Card>
      {expenseToSave && <ExpenseModal
        onSave={loadState}
        expense={expenseToSave}
        isOpen={isOpen}
        onclose={() => {
          setExpenseToSave(null);
        }}
        onOpenChange={onOpenChange}></ExpenseModal>
      }
      <ExpenseTable
        topContent={categoryFilter()}
        headers={tableRows}
        data={expenses}
        onAdd={() => {
          setExpenseToSave(new Expense());
          onOpen();
        }}
        onEdit={(expense) => {
          setExpenseToSave(expense);
          onOpen();
        }}></ExpenseTable>
    </>
  );
}
