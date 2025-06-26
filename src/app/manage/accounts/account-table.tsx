/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { CaretSortIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';
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
import {
  AccountListResType,
  AccountType,
} from '@/schemaValidations/account.schema';
import AddEmployee from '@/app/manage/accounts/add-employee';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import EditEmployee from '@/app/manage/accounts/edit-employee';
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
import { useSearchParams } from 'next/navigation';
import AutoPagination from '@/components/auto-pagination';
import {
  useDeleteAccountMutation,
  useGetAccountList,
} from '@/queries/useAccount';
import { toast } from '@/components/ui/use-toast';
import { handleErrorApi } from '@/lib/utils';
import {
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Users,
  Mail,
  User,
  Settings,
  Shield,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

type AccountItem = AccountListResType['data'][0];

const AccountTableContext = createContext<{
  setEmployeeIdEdit: (value: number) => void;
  employeeIdEdit: number | undefined;
  employeeDelete: AccountItem | null;
  setEmployeeDelete: (value: AccountItem | null) => void;
}>({
  setEmployeeIdEdit: (value: number | undefined) => {},
  employeeIdEdit: undefined,
  employeeDelete: null,
  setEmployeeDelete: (value: AccountItem | null) => {},
});

export const columns: ColumnDef<AccountType>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-white font-bold text-sm">
          {row.getValue('id')}
        </div>
        <span className="text-sm text-muted-foreground">
          #{row.getValue('id')}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'avatar',
    header: 'Ảnh đại diện',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="aspect-square w-16 h-16 rounded-lg object-cover border-2 border-orange-200 dark:border-orange-800">
          <AvatarImage src={row.getValue('avatar')} />
          <AvatarFallback className="rounded-lg bg-orange-100 dark:bg-orange-900/30">
            <User className="h-6 w-6 text-orange-600" />
          </AvatarFallback>
        </Avatar>
        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
          <User className="h-4 w-4 text-orange-600 dark:text-orange-400" />
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'name',
    header: 'Họ và tên',
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="font-semibold text-base">{row.getValue('name')}</div>
        <div className="text-xs text-muted-foreground">
          Nhân viên #{row.original.id}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="hover:bg-orange-50 dark:hover:bg-orange-950/20"
        >
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </div>
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <div className="font-medium">{row.getValue('email')}</div>
          <div className="text-xs text-muted-foreground">Email liên hệ</div>
        </div>
      </div>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setEmployeeIdEdit, setEmployeeDelete } =
        useContext(AccountTableContext);
      const openEditEmployee = () => {
        setEmployeeIdEdit(row.original.id);
      };

      const openDeleteEmployee = () => {
        setEmployeeDelete(row.original);
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
              onClick={openEditEmployee}
              className="cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-950/50"
            >
              <Edit className="h-4 w-4 mr-2 text-orange-600" />
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={openDeleteEmployee}
              className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/50 text-red-600 dark:text-red-400"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Xóa tài khoản
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function AlertDialogDeleteAccount({
  employeeDelete,
  setEmployeeDelete,
}: {
  employeeDelete: AccountItem | null;
  setEmployeeDelete: (value: AccountItem | null) => void;
}) {
  const { mutateAsync } = useDeleteAccountMutation();
  const deleteAccount = async () => {
    if (employeeDelete) {
      try {
        const result = await mutateAsync(employeeDelete.id);
        setEmployeeDelete(null);
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
      open={Boolean(employeeDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setEmployeeDelete(null);
        }
      }}
    >
      <AlertDialogContent className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border shadow-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-500" />
            Xóa tài khoản nhân viên?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Tài khoản{' '}
            <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded px-2 py-1 font-medium">
              {employeeDelete?.name}
            </span>{' '}
            sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="hover:bg-gray-100 dark:hover:bg-gray-800">
            Hủy bỏ
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={deleteAccount}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Xóa tài khoản
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Số lượng item trên 1 trang
const PAGE_SIZE = 10;
export default function AccountTable({
  setAccountList,
}: {
  setAccountList: (value: AccountListResType['data']) => void;
}) {
  const searchParam = useSearchParams();
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1;
  const pageIndex = page - 1;
  const [employeeIdEdit, setEmployeeIdEdit] = useState<number | undefined>();
  const [employeeDelete, setEmployeeDelete] = useState<AccountItem | null>(
    null,
  );
  const accountListQuery = useGetAccountList();
  const data = accountListQuery.data?.payload.data ?? [];
  useEffect(() => {
    setAccountList(data);
  }, [data, setAccountList]);
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
    <AccountTableContext.Provider
      value={{
        employeeIdEdit,
        setEmployeeIdEdit,
        employeeDelete,
        setEmployeeDelete,
      }}
    >
      <div className="w-full space-y-6">
        <EditEmployee id={employeeIdEdit} setId={setEmployeeIdEdit} />
        <AlertDialogDeleteAccount
          employeeDelete={employeeDelete}
          setEmployeeDelete={setEmployeeDelete}
        />

        {/* Filters and Actions */}
        <Card className="border-0 shadow-sm bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm theo tên nhân viên..."
                    value={
                      (table.getColumn('name')?.getFilterValue() as string) ??
                      ''
                    }
                    onChange={(event) => {
                      table
                        .getColumn('name')
                        ?.setFilterValue(event.target.value);
                    }}
                    className="pl-10 border-2 focus:border-orange-500 focus:ring-orange-500/20"
                  />
                </div>
                <Badge variant="outline" className="text-xs">
                  <Filter className="w-3 h-3 mr-1" />
                  {table.getFilteredRowModel().rows.length} / {data.length} nhân
                  viên
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <AddEmployee />
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
                          <Users className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="text-muted-foreground">
                          Không tìm thấy nhân viên nào
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
                nhân viên
              </div>
              <div>
                <AutoPagination
                  page={table.getState().pagination.pageIndex + 1}
                  pageSize={table.getPageCount()}
                  pathname="/manage/accounts"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AccountTableContext.Provider>
  );
}
