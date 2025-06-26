/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { createContext, useContext, useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { getVietnameseTableStatus, handleErrorApi } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import AutoPagination from '@/components/auto-pagination';
import { TableListResType } from '@/schemaValidations/table.schema';
import EditTable from '@/app/manage/tables/edit-table';
import AddTable from '@/app/manage/tables/add-table';
import { useDeleteTableMutation, useTableListQuery } from '@/queries/useTable';
import QRCodeTable from '@/components/qrcode-table';
import { toast } from '@/components/ui/use-toast';
import {
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  QrCode,
  Users,
  Settings,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type TableItem = TableListResType['data'][0];

const TableTableContext = createContext<{
  setTableIdEdit: (value: number) => void;
  tableIdEdit: number | undefined;
  tableDelete: TableItem | null;
  setTableDelete: (value: TableItem | null) => void;
}>({
  setTableIdEdit: (value: number | undefined) => {},
  tableIdEdit: undefined,
  tableDelete: null,
  setTableDelete: (value: TableItem | null) => {},
});

export const columns: ColumnDef<TableItem>[] = [
  {
    accessorKey: 'number',
    header: 'Số bàn',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-white font-bold text-lg">
          {row.getValue('number')}
        </div>
        <div>
          <div className="font-semibold">Bàn {row.getValue('number')}</div>
          <div className="text-xs text-muted-foreground">
            ID: {row.original.number}
          </div>
        </div>
      </div>
    ),
    filterFn: (rows, columnId, filterValue) => {
      if (!filterValue) return true;
      return String(filterValue) === String(rows.getValue('number'));
    },
  },
  {
    accessorKey: 'capacity',
    header: 'Sức chứa',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <div className="font-medium">{row.getValue('capacity')} người</div>
          <div className="text-xs text-muted-foreground">Tối đa</div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const status = row.getValue('status') as
        | 'Available'
        | 'Hidden'
        | 'Reserved';
      const isAvailable = status === 'Available';
      const isHidden = status === 'Hidden';

      return (
        <Badge
          variant={
            isAvailable ? 'default' : isHidden ? 'secondary' : 'destructive'
          }
          className={`font-medium ${
            isAvailable
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              : isHidden
              ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
              : ''
          }`}
        >
          {getVietnameseTableStatus(status)}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'token',
    header: 'QR Code',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
          <QrCode className="h-4 w-4 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <QRCodeTable
            token={row.getValue('token')}
            tableNumber={row.getValue('number')}
          />
        </div>
      </div>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setTableIdEdit, setTableDelete } = useContext(TableTableContext);
      const openEditTable = () => {
        setTableIdEdit(row.original.number);
      };

      const openDeleteTable = () => {
        setTableDelete(row.original);
      };
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 bg-background/95 backdrop-blur border shadow-xl"
          >
            <DropdownMenuLabel className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Thao tác
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={openEditTable}
              className="cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-950/50"
            >
              <Edit className="h-4 w-4 mr-2 text-orange-600" />
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={openDeleteTable}
              className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/50 text-red-600 dark:text-red-400"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Xóa bàn
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function AlertDialogDeleteTable({
  tableDelete,
  setTableDelete,
}: {
  tableDelete: TableItem | null;
  setTableDelete: (value: TableItem | null) => void;
}) {
  const { mutateAsync } = useDeleteTableMutation();
  const deleteTable = async () => {
    if (tableDelete) {
      try {
        const result = await mutateAsync(tableDelete.number);
        setTableDelete(null);
        toast({
          title: result.payload.message,
        });
      } catch (error) {
        handleErrorApi({
          error,
        });
      }
    }
  };
  return (
    <AlertDialog
      open={Boolean(tableDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setTableDelete(null);
        }
      }}
    >
      <AlertDialogContent className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border shadow-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-500" />
            Xóa bàn ăn?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Bàn{' '}
            <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded px-2 py-1 font-medium">
              {tableDelete?.number}
            </span>{' '}
            sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="hover:bg-gray-100 dark:hover:bg-gray-800">
            Hủy bỏ
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={deleteTable}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Xóa bàn
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Số lượng item trên 1 trang
const PAGE_SIZE = 10;
export default function TableTable({
  setTableList,
}: {
  setTableList: (value: TableListResType['data']) => void;
}) {
  const searchParam = useSearchParams();
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1;
  const pageIndex = page - 1;
  const [tableIdEdit, setTableIdEdit] = useState<number | undefined>();
  const [tableDelete, setTableDelete] = useState<TableItem | null>(null);
  const tableListQuery = useTableListQuery();
  const data = tableListQuery.data?.payload.data ?? [];
  useEffect(() => {
    setTableList(data);
  }, [data, setTableList]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex,
    pageSize: PAGE_SIZE,
  });

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  useEffect(() => {
    table.setPagination({
      pageIndex,
      pageSize: PAGE_SIZE,
    });
  }, [table, pageIndex]);

  return (
    <TableTableContext.Provider
      value={{ tableIdEdit, setTableIdEdit, tableDelete, setTableDelete }}
    >
      <div className="w-full space-y-6">
        <EditTable id={tableIdEdit} setId={setTableIdEdit} />
        <AlertDialogDeleteTable
          tableDelete={tableDelete}
          setTableDelete={setTableDelete}
        />

        {/* Filters and Actions */}
        <Card className="border-0 shadow-sm bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm theo số bàn..."
                    value={
                      (table.getColumn('number')?.getFilterValue() as string) ??
                      ''
                    }
                    onChange={(event) => {
                      table
                        .getColumn('number')
                        ?.setFilterValue(event.target.value);
                    }}
                    className="pl-10 border-2 focus:border-orange-500 focus:ring-orange-500/20"
                  />
                </div>
                <Badge variant="outline" className="text-xs">
                  <Filter className="w-3 h-3 mr-1" />
                  {table.getFilteredRowModel().rows.length} / {data.length} bàn
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <AddTable />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="overflow-hidden border-0 shadow-lg">
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white hover:bg-gradient-to-r hover:from-orange-600 hover:to-red-600"
                  >
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          className="text-white font-semibold"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                      className="hover:bg-orange-50 dark:hover:bg-orange-950/10 transition-colors duration-200"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-4">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-32 text-center"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                          <Table className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="text-muted-foreground">
                          Không tìm thấy bàn nào
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Pagination */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Hiển thị{' '}
                <strong className="text-foreground">
                  {table.getPaginationRowModel().rows.length}
                </strong>{' '}
                trong <strong className="text-foreground">{data.length}</strong>{' '}
                bàn
              </div>
              <div>
                <AutoPagination
                  page={table.getState().pagination.pageIndex + 1}
                  pageSize={table.getPageCount()}
                  pathname="/manage/tables"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TableTableContext.Provider>
  );
}
