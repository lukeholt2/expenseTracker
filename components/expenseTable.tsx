'use client';
import { useCallback } from "react";
import { Button } from "@heroui/react";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, getKeyValue } from "@heroui/table";
import { parseAbsoluteToLocal } from "@internationalized/date"
import { currencyFormatter } from "@/utils/constants";

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
      return parseAbsoluteToLocal(value).toDate().toLocaleDateString(undefined, { month: 'numeric', day: 'numeric', year: '2-digit'})
    } 
    return typeof value == 'number' ? currencyFormatter.format(value) : value;
  }, []);

  const tableOptions = () => {
    return (
        <div className="flex gap-3">
          <Button fullWidth color="primary" variant="shadow" onPress={props.onAdd}>Add New</Button>
        </div>
      )
  }


  return (
    <div style={{width: '99vw'}}>
      <Table aria-label="Dynamic Expense Table" 
        isVirtualized
        isStriped
        isCompact
        fullWidth
        radius='sm'
        selectionMode="single"
        selectionBehavior="replace"
        onSelectionChange={(set: any) => {
          const index = set.entries().next()?.value?.[0] - 1;
          props.onEdit(props.data[index])}
        }
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
    </div>
  );
};
