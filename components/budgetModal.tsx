import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Input, ModalFooter, Button } from "@heroui/react";


export interface BudgetModalProps {
    budget?: { key: string, Category: string, Budgeted: number; Spent: number }
    onSave: (category: string, amount: number) => void;
}

export default function BudgetModal(props: any) {
    const [category, setCategory] = useState(props.budget?.Category);
    const [amount, setAmount] = useState(props.budget?.Budgeted);

    return (
        <Modal 
            onClose={props.onclose}
            isOpen={props.isOpen}
            onOpenChange={props.onOpenChange}
            placement="top-center"
            isDismissable={false}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Edit Budget</ModalHeader>
                        <ModalBody>
                            <Input
                                label={"Category"}
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}>
                            </Input>
                            <Input
                                label={"Budget"}
                                value={amount}
                                type="number"
                                onChange={(e) => setAmount(e.target.value)}
                                startContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-small">$</span>
                                    </div>}>
                            </Input>

                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={() => {
                                props.onclose();
                                onClose();
                            }}>
                                Close
                            </Button>
                            <Button color="primary" type="submit" onPress={() => {
                                props.onSave({
                                    key: props.budget.key,
                                    category,
                                    limit: +amount,
                                    actual: props.budget.Spent
                                })
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