'use client'
import { useCallback, useEffect, useState } from "react";
import { } from "@heroui/modal";
import { ExpenseTable } from '@/components/expenseTable';
import { getExpenses, addExpense, getCategories, getPaymentTypes } from "@/app/actions";
import {
  Button, DatePicker, Input, Autocomplete,
  AutocompleteSection, AutocompleteItem, Form,
  Modal, ModalContent, ModalHeader, ModalBody,
  ModalFooter, useDisclosure
} from "@heroui/react";
import { Expense } from "@/models/expense";
import { toCalendarDate, parseAbsoluteToLocal } from "@internationalized/date";

export default function Transactions() {
  const [expenses, setExpenses] = useState([]);

  const [categories, setCategories] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);

  const [expenseToSave, setExpenseToSave] = useState<Expense>(new Expense())
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const loadState = useCallback(async () => {
    setExpenses(await getExpenses());
    const categories = (await getCategories()).map((val: string) => { return {key: val, label: val} })
    setCategories(categories);
    const paymentTypes = (await getPaymentTypes()).map((val: string) => { return {key: val, label: val} })
    setPaymentTypes(paymentTypes);

  }, [expenses, categories, paymentTypes, setExpenses, setPaymentTypes, setCategories])

  useEffect(() => {
    loadState()
  }, [])

  const tableRows = [
    { key: 'date', label: 'Date' },
    { key: 'amount', label: 'Amount' },
    { key: 'item', label: 'Item' },
    { key: 'location', label: 'Location' },
    { key: 'category', label: 'Category' },
    { key: 'Actions', label: 'actions' }
  ]

  const onAdd = () => {
    const serialized = JSON.stringify(expenseToSave)
    console.log(`Adding ${serialized}`);
    addExpense(serialized).then(() => loadState());
  }

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{expenseToSave?.id > 0 ? 'Edit' : 'Add'} Expense</ModalHeader>
              <ModalBody>
                <DatePicker 
                defaultValue={toCalendarDate(parseAbsoluteToLocal(expenseToSave?.date.toString()))}
                 onChange={(val) => {
                  expenseToSave.date = new Date(val?.toString() ?? 0);
                  setExpenseToSave(expenseToSave);
                }}></DatePicker>
                <Input label={"Amount"} type="number"
                  defaultValue={expenseToSave?.amount.toString()}
                  onChange={(e) => {
                    expenseToSave.amount = +e.target.value;
                    setExpenseToSave(expenseToSave)
                  }}
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">$</span>
                    </div>}>
                </Input>
                <Input label={"Location"} 
                  defaultValue={expenseToSave?.location}
                  onChange={(e) => {
                    expenseToSave.location = e.target.value;
                    setExpenseToSave(expenseToSave)
                }}></Input>
                <Input label={"Item"} 
                defaultValue={expenseToSave?.item}
                onChange={(e) => {
                  expenseToSave.item = e.target.value;
                  setExpenseToSave(expenseToSave)
                }}></Input>
                <Autocomplete
                  defaultInputValue={expenseToSave?.category}
                  defaultItems={categories}
                  allowsCustomValue
                  label={"Category"} 
                  onSelectionChange={(val) => {
                    expenseToSave.category = val?.toString() ?? "";
                    setExpenseToSave(expenseToSave)
                  }} 
                  onInputChange={(e) => {
                    expenseToSave.category = e;
                    setExpenseToSave(expenseToSave)
                  }}>
                  {(item: any) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}
                </Autocomplete>
                <Autocomplete
                  defaultInputValue={expenseToSave?.paymentType}
                  defaultItems={paymentTypes}
                  allowsCustomValue
                  label={"Payment Type"} 
                  onSelectionChange={(val) => {
                    expenseToSave.paymentType = val?.toString() ?? "";
                    setExpenseToSave(expenseToSave)
                  }}
                  onInputChange={(val) => {
                    expenseToSave.paymentType = val;
                    setExpenseToSave(expenseToSave)
                  }}>
                  {(item: any) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}
                </Autocomplete>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" type="submit" onPress={() => {
                  onAdd();
                  onClose();
                }}>
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <ExpenseTable headers={tableRows} data={expenses} onAdd={onOpen} onEdit={(expense) => {
        console.log(expense)
        setExpenseToSave(expense);
        onOpen();
      }}></ExpenseTable>
    </>
  );
}
