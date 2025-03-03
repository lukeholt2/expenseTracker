'use client'
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { ExpenseTable } from '@/components/expenseTable';
import { getCategories, getExpenses } from "@/app/transactions/actions";
import { Button, Card, CardBody, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, useDisclosure } from "@heroui/react";
import { Expense } from "@/models/expense";
import ExpenseModal from "@/components/expenseModal";
import { Filter } from "@/models/filter";

export default function Transactions() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseToSave, setExpenseToSave] = useState<Expense | null>(null)
  const [categories, setCategories] = useState<string[]>([]);

  const [filterOptions, setFilterOptions] = useState<Filter>(new Filter());

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const loadState = useCallback(async () => {
    setExpenses(await getExpenses(filterOptions.month, filterOptions.year, filterOptions.category));
    const fetchedCategories: string[] = await getCategories(filterOptions.month, filterOptions.year);
    setCategories(['All', ...fetchedCategories])
  }, [expenses, setExpenses, categories, setCategories, filterOptions])


  useEffect(() => {
    loadState()
  }, [filterOptions])


  const tableRows = [
    { key: 'date', label: 'Date' },
    { key: 'amount', label: 'Amount' },
    { key: 'location', label: 'Location' },
    { key: 'category', label: 'Category' }
  ]

  const totalSpent = useMemo(() => expenses.map(e => e.amount).reduce((prev, current) => prev + current, 0), [expenses])


  const categoryFilter = useCallback(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <div className="flex gap-3">
            <Dropdown backdrop="blur">
              <DropdownTrigger>
                <Button variant="bordered" size='sm' className="text-small">{filterOptions.category}</Button>
              </DropdownTrigger>
              <DropdownMenu
                selectedKeys={[filterOptions.category]}
                selectionMode="single"
                onSelectionChange={(key) => setFilterOptions({ ...filterOptions, category: key.anchorKey ?? 'All' })}
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
  }, [categories, filterOptions, setFilterOptions])

  return (
    <>
      <Card style={{ marginBottom: '1em' }}>
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
