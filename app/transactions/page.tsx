'use client'
import { useCallback, useEffect, useMemo, useState } from "react";
import { ExpenseTable } from '@/components/expenseTable';
import { getCategories, getExpenses } from "@/app/transactions/actions";
import { Button, Card, CardBody, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, useDisclosure } from "@heroui/react";
import { Expense } from "@/models/expense";
import ExpenseModal from "@/components/expenseModal";
import { Filter } from "@/models/filter";
import { currencyFormatter } from "@/utils/constants";


export default function Transactions() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseToSave, setExpenseToSave] = useState<Expense | null>(null)
  const [categories, setCategories] = useState<string[]>([]);

  const [filterOptions, setFilterOptions] = useState<Filter>(new Filter());

  // TODO: replace this with a proper time span
  const [timeFilter, setTimeFilter] = useState('Month');

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const loadState = useCallback(async () => {
    const expenses = await getExpenses(filterOptions.month, filterOptions.year, filterOptions.category);
    setExpenses(expenses.reverse());
    const fetchedCategories: string[] = await getCategories(filterOptions.month, filterOptions.year);
    setCategories(['All', ...fetchedCategories])
  }, [expenses, setExpenses, categories, setCategories, filterOptions])


  useEffect(() => {
    loadState()
  }, [filterOptions, timeFilter])


  const tableRows = [
    { key: 'date', label: 'Date' },
    { key: 'amount', label: 'Amount' },
    { key: 'location', label: 'Location' },
    { key: 'category', label: 'Category' }
  ]

  const timeFilters = ['All', 'Month', 'Year']

  const totalSpent = useMemo(() => {
    const total = expenses.map(e => e.amount).reduce((prev, current) => prev + current, 0);
    return currencyFormatter.format(total);
  }, [expenses])

  const categoryFilter = useCallback(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <div className="flex gap-3">
          <Dropdown backdrop="blur" aria-modal={false} >
              <DropdownTrigger>
                <Button variant="bordered" size='sm' className="text-small">{filterOptions.category}</Button>
              </DropdownTrigger>
              <DropdownMenu
                className="overflow-y-scroll max-h-96"
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
          <div className="flex gap-3">
            <Dropdown backdrop="blur">
              <DropdownTrigger>
                <Button variant="bordered" size='sm' className="text-small">{timeFilter}</Button>
              </DropdownTrigger>
              <DropdownMenu
                selectedKeys={[timeFilter]}
                selectionMode="single"
                onSelectionChange={(key) => {
                  const val = key.anchorKey;
                  if (val == 'Year') {
                    setFilterOptions({ ...filterOptions, month: undefined, year: new Date().getFullYear() });
                  } else if (val == 'Month') {
                    setFilterOptions({ ...new Filter(), category: filterOptions.category })
                  } else {
                    setFilterOptions({ ...filterOptions, month: undefined, year: undefined })
                  }
                  setTimeFilter(key.anchorKey ?? 'Month')
                }}
                aria-label="TimeSpan Filter"
                variant="faded"
              >
                {timeFilters.map((cat) => <DropdownItem key={cat}>{cat}</DropdownItem>)}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    )
  }, [timeFilter, setTimeFilter, categories, filterOptions, setFilterOptions])

  return (
    <>
      <Card style={{ marginBottom: '1em' }}>
        <CardBody className="pt-4 px-4 flex-col items-center">
          <h4>{totalSpent}</h4>
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
