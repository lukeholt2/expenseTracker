'use client';
import { useCallback, useEffect, useMemo, useState } from "react";
import { ExpenseTable } from '@/components/expenseTable';
import { Card, CardBody, CardHeader } from "@heroui/react";
import { getBudget, updateBudget } from './actions';
import { Budget } from '@/models/budget';
import BudgetModal from "@/components/budgetModal";

export default function Home() {
  const [budget, setBudget] = useState(new Budget())

  const [categoryToEdit, setCategoryToEdit] = useState(null);

  useEffect(() => {
    const updateBudget = async () => {
      const value = await getBudget();
      setBudget(Object.assign(new Budget(), value));
    }
    updateBudget();
  }, [])

  const budgetCategories = useMemo(() => budget.mapCategories(), [budget])

  const budgetRemaining= useMemo(() => {
    const totalLimit = budget.categoryLimits.map(c => c.limit).reduce((prev, current) => prev + current, 0);
    const totalSpent = budget.categoryLimits.map(c => c.actual).reduce((prev, current) => prev + current, 0);
    return totalLimit - totalSpent;
  }, [budget])

  const onAddBudget = useCallback(async () => {
    budget.categoryLimits.push({ category: `Category${budget.categoryLimits?.length ?? 0}`, limit: 0, actual: 0 });
    setBudget(Object.assign(new Budget(), budget));
    const _ = await updateBudget(JSON.stringify(budget));
  }, [budget, setBudget, updateBudget])

  const onEditCategory = useCallback(async (cat: any) => {
    budget.categoryLimits[+cat.key - 1] = { category: cat.category, limit: cat.limit, actual: cat.actual }
    console.log(budget)
    setBudget(Object.assign(new Budget(), budget));
    setCategoryToEdit(null);
    const _ = await updateBudget(JSON.stringify(budget));
  }, [budget, setBudget, updateBudget])

  const budgetHeaders = [
    { key: 'Category', label: 'Category' },
    { key: 'Budgeted', label: 'Budgeted' },
    { key: 'Spent', label: 'Spent' },
    { key: 'Available', label: 'Available' },
    { key: 'Actions', label: 'actions' }
  ]

  return (
    <>
      <Card>
        <CardBody className="pt-4 px-4 flex-col items-center">
          <h4>${budgetRemaining} Remaining</h4>
        </CardBody>
      </Card>
      {categoryToEdit && <BudgetModal budget={categoryToEdit} onSave={onEditCategory}></BudgetModal>}
      <ExpenseTable
        headers={budgetHeaders}
        data={budgetCategories}
        onEdit={(cat) => setCategoryToEdit(cat)}
        onAdd={onAddBudget}>
      </ExpenseTable>
    </>
  );
}