'use client';
import { Button, Input } from "@heroui/react";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, getKeyValue } from "@heroui/table";
import { useCallback } from "react";

interface TableProps {
  headers: any[];
  data?: any[];
  editableColumns?: string[];
  onAdd: (data: any) => void;
  onEdit?: (data: any) => void
}

export const ExpenseTable = (props: TableProps) => {

  const onValueChange = useCallback((item: any) => {
    if (props.onEdit) {
      props.onEdit(item);
    }
  }, [props.onEdit])

  const renderCell = useCallback((item: any, columnKey: string | number) => {
    const value = getKeyValue(item, columnKey);
    return <Input
    //  isReadOnly={!props.editableColumns?.includes(columnKey.toString())}
      label={columnKey}
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
