import { useCallback, useEffect, useMemo, useState } from "react";
import { addOrEditExpense, getCategories, getPaymentTypes } from "@/app/transactions/actions";
import { Expense } from "@/models/expense";
import { Modal, ModalContent, ModalHeader, ModalBody, 
        DatePicker, Input, Autocomplete, 
        AutocompleteItem, ModalFooter, Button 
} from "@heroui/react";
import { toCalendarDate, parseAbsoluteToLocal, fromDate, today } from "@internationalized/date";

export default function ExpenseModal(props: any) {

    const [expenseToSave, setExpenseToSave] = useState<Expense>(props.expense ?? new Expense())
    const [categories, setCategories] = useState([]);
    const [paymentTypes, setPaymentTypes] = useState([]);

    /** Fetch the server side props needed for autocomplete values */
    const loadState = useCallback(async () => {
        const categories = (await getCategories()).map((val: string) => { return { key: val, label: val } })
        setCategories(categories);
        const paymentTypes = (await getPaymentTypes()).map((val: string) => { return { key: val, label: val } })
        setPaymentTypes(paymentTypes);
    }, [categories, paymentTypes, setCategories, setPaymentTypes])

    useEffect(() => {
        loadState()
    }, [])

    /** callback for emitting changes whether adding or editing a transaction */
    const onAddOrEdit = useCallback(() => {
        const serialized = JSON.stringify(expenseToSave)
        console.log(`Adding ${serialized}`);
        addOrEditExpense(serialized, expenseToSave.id > 0)
            .then(() => props.onSave());
    }, [])

    /** Try to parse the given date into something displayable */
    const parseDate = useMemo(() => {
        let date: any = today('UTC');
        try{
            date = parseAbsoluteToLocal(expenseToSave?.date.toString())
        } catch{
            date = fromDate(new Date(Date.parse(expenseToSave?.date.toString())), 'UTC')
        }
        return toCalendarDate(date);
    }, [])

    return (
        <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">{expenseToSave?.id > 0 ? 'Edit' : 'Add'} Expense</ModalHeader>
                        <ModalBody>
                            <DatePicker
                                defaultValue={parseDate}
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
                            <Button color="danger" variant="light" onPress={() => {
                                props.onclose();
                                onClose();
                            }}>
                                Close
                            </Button>
                            <Button color="primary" type="submit" onPress={() => {
                                onAddOrEdit();
                                onClose();
                            }}>
                                Save
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>)
}