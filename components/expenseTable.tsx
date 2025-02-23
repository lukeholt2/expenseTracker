'use client';
import { Button } from "@heroui/react";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, getKeyValue } from "@heroui/table";

interface TableProps {
  headers: any[];
  data?: any[];
  onAdd: (data: any) => void;
}

export const ExpenseTable = (props: TableProps) => {

  return (
    <>
   <Button color="primary" onPress={props.onAdd}>Add New</Button>
   <Table aria-label="Example table with dynamic content" isVirtualized>
        <TableHeader columns={props.headers}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={props.data ?? []}>
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
      
  );
};
