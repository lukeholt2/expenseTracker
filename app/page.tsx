'use client'
import { useEffect, useReducer, useState } from "react";
import { ExpenseTable } from '@/components/expenseTable';
import { Expense } from "@/models/expense";
import { Budget } from "@/models/budget";
import { useSession } from "next-auth/react";
import { HomeContext, IHomeContext } from "./homeContext";
import Navigation from "@/components/navigation";
import Transactions from "@/components/transactions";

export default function Home() {

  const { update, data, status } = useSession({ required: true })

  const [state, dispatch] = useReducer(homeReducer, { state: 'budget' });
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [budget, setBudget] = useState<Budget>(new Budget())

  const budgetRows = [
    { key: '1', label: 'Category' },
    { key: '2', label: 'Budgeted' },
    { key: '3', label: 'Spent' },
    { key: '4', label: 'Available' }
  ]

  useEffect(() => {
    // fetech data
  }, [data, status, update])

  return (
    <>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      {{
          budget: (<ExpenseTable headers={budgetRows} data={budget.categoryLimits}></ExpenseTable>),
          transactions: (<Transactions></Transactions>)
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

function homeReducer(_:IHomeContext, data: any){
  return { state: data.state }
}