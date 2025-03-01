'use client';
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { ExpenseTable } from '@/components/expenseTable';
import { useSession } from "next-auth/react";
import { HomeContext, IHomeContext } from "./homeContext";
import Navigation from "@/components/navigation";
import Transactions from "@/components/transactions";
import { getBudget, updateBudget } from './actions';
import { Budget } from '@/models/budget';
import BudgetModal from "@/components/budgetModal";

export default function Home() {

  const { update, data, status } = useSession({ required: true })

  const [state, dispatch] = useReducer(homeReducer, { state: 'budget' });
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
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      { categoryToEdit && <BudgetModal budget={categoryToEdit} onSave={onEditCategory}></BudgetModal>}
      {
        {
          budget: (<ExpenseTable 
              headers={budgetHeaders} 
              data={budgetCategories} 
              onEdit={(cat) => setCategoryToEdit(cat)}
              onAdd={onAddBudget}></ExpenseTable>),
          transactions: <Transactions></Transactions>
        }[state.state]
      }
      </section>
      <footer className="w-full flex items-center justify-center py-3">
        <HomeContext.Provider value={dispatch}>
          <Navigation></Navigation>
        </HomeContext.Provider>
      </footer>
    </>
  );
}

function homeReducer(_:IHomeContext, data: any) : IHomeContext {
  return { state: data.state }
}