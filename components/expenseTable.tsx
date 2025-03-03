'use client';
import { useCallback, useMemo } from "react";
import { Button, DateInput, Input } from "@heroui/react";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, getKeyValue } from "@heroui/table";
import { parseAbsoluteToLocal, toCalendarDate } from "@internationalized/date"
import { EditIcon } from "./icons";

interface TableProps {
  headers: any[];
  data: any[];
  onAdd: (data: any) => void;
  onEdit: (data: any) => void
  topContent?: any
}

export const ExpenseTable = (props: TableProps) => {

  const renderCell = useCallback((item: any, columnKey: string | number) => {
    const value = getKeyValue(item, columnKey);
    if (columnKey == 'date') {
      return (<DateInput
        isReadOnly
        size="sm"
        radius="sm"
        defaultValue={toCalendarDate(parseAbsoluteToLocal(value))}
      />)
    } else if (columnKey == 'Actions') {
      return (<Button isIconOnly onPress={() => props.onEdit(item)}> <EditIcon></EditIcon> </Button>)
    }
    return <Input
      size="sm"
      isReadOnly={true}
      value={value}
      startContent={
        typeof value == 'number' && (<div className="pointer-events-none flex items-center">
          <span className="text-default-400 text-small">$</span>
        </div>)
      }
    />
  }, []);

  const tableOptions = () => {
    return (
        <div className="flex gap-3">
          <Button fullWidth color="primary" variant="shadow" onPress={props.onAdd}>Add New</Button>
        </div>
      )
  }

  const classNames = useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-2xl"],
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
    }),
    [],
  );

  return (
    <>
      <Table aria-label="Dynamic Expense Table" 
        isVirtualized
        removeWrapper
        isCompact
        fullWidth
        radius='sm'
        selectionMode="single"
        selectionBehavior="replace"
        onSelectionChange={(set: any) => {
          const index = set.entries().next()?.value?.[0] - 1;
          props.onEdit(props.data[index])}
        }
        classNames={classNames}
        topContent={props.topContent}
        bottomContent={tableOptions()}>
        <TableHeader columns={props.headers}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={props.data ?? []} emptyContent={"No rows to display."}>
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => <TableCell>
                {renderCell(item, columnKey)}
              </TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};
