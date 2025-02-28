'use client';
import { useCallback } from "react";
import { Button, DateInput, Input } from "@heroui/react";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, getKeyValue } from "@heroui/table";
import {parseAbsoluteToLocal, toCalendarDate} from "@internationalized/date"
import { EditIcon } from "./icons";

interface TableProps {
  headers: any[];
  data?: any[];
  onAdd: (data: any) => void;
  onEdit: (data: any) => void
}

export const ExpenseTable = (props: TableProps) => {

  const renderCell = useCallback((item: any, columnKey: string | number) => {
    const value = getKeyValue(item, columnKey);
    if (columnKey == 'date'){
      return (<DateInput
        isReadOnly
        defaultValue={toCalendarDate(parseAbsoluteToLocal(value))}
      />)
    } else if (columnKey == 'Actions'){
      return (<Button isIconOnly onPress={() => props.onEdit(item)}> <EditIcon></EditIcon> </Button>)
    }
    return <Input
     isReadOnly={true}
      value={value}
      startContent={
        typeof value == 'number' && (<div className="pointer-events-none flex items-center">
          <span className="text-default-400 text-small">$</span>
        </div>)
      }
    />
  }, []);

  return (
    <>
      <Button color="primary" onPress={props.onAdd}>Add New</Button>
      <Table aria-label="Example table with dynamic content" isVirtualized>
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
