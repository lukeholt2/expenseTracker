import { createContext, Dispatch } from "react"

export interface IHomeContext {
    state: 'budget' | 'transactions'
}

export const HomeContext = createContext<Dispatch<IHomeContext>>(() => false);