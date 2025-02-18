'use client'
import {  Table,  TableHeader,  TableBody,  TableColumn,  TableRow,  TableCell, getKeyValue} from "@heroui/table";

interface TableProps{
    headers: any[];
    data?: any[]
}

export const ExpenseTable = (props: TableProps) => {

  return (
    <Table aria-label="Example table with dynamic content">
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
  );
};
