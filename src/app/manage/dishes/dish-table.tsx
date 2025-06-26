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
import DOMPurify from 'dompurify';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import {
  formatCurrency,
  getVietnameseDishStatus,
  handleErrorApi,
} from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import AutoPagination from '@/components/auto-pagination';
import { DishListResType } from '@/schemaValidations/dish.schema';
import EditDish from '@/app/manage/dishes/edit-dish';
import AddDish from '@/app/manage/dishes/add-dish';
import { useDeleteDishMutation, useDishListQuery } from '@/queries/useDish';
import { toast } from '@/components/ui/use-toast';
import {
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Utensils,
  DollarSign,
  FileText,
  Settings,
  Image as ImageIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

type DishItem = DishListResType['data'][0];

const DishTableContext = createContext<{
  setDishIdEdit: (value: number) => void;
  dishIdEdit: number | undefined;
  dishDelete: DishItem | null;
  setDishDelete: (value: DishItem | null) => void;
}>({
  setDishIdEdit: (value: number | undefined) => {},
  dishIdEdit: undefined,
  dishDelete: null,
  setDishDelete: (value: DishItem | null) => {},
});

export const columns: ColumnDef<DishItem>[] = [
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
    accessorKey: 'image',
    header: 'Ảnh',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="aspect-square w-16 h-16 rounded-lg object-cover border-2 border-orange-200 dark:border-orange-800">
          <AvatarImage src={row.getValue('image')} />
          <AvatarFallback className="rounded-lg bg-orange-100 dark:bg-orange-900/30">
            <ImageIcon className="h-6 w-6 text-orange-600" />
          </AvatarFallback>
        </Avatar>
        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
          <ImageIcon className="h-4 w-4 text-orange-600 dark:text-orange-400" />
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'name',
    header: 'Tên món',
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="font-semibold text-base">{row.getValue('name')}</div>
        <div className="text-xs text-muted-foreground">
          Món ăn #{row.original.id}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'price',
    header: 'Giá cả',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
          <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <div className="font-bold text-green-600">
            {formatCurrency(row.getValue('price'))}
          </div>
          <div className="text-xs text-muted-foreground">VND</div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'description',
    header: 'Mô tả',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="max-w-xs">
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(row.getValue('description')),
            }}
            className="text-sm line-clamp-2 text-muted-foreground"
          />
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const status = row.getValue('status') as 'Available' | 'Unavailable';
      const isAvailable = status === 'Available';

      return (
        <Badge
          variant={isAvailable ? 'default' : 'secondary'}
          className={`font-medium ${
            isAvailable
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
          }`}
        >
          {getVietnameseDishStatus(status)}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setDishIdEdit, setDishDelete } = useContext(DishTableContext);
      const openEditDish = () => {
        setDishIdEdit(row.original.id);
      };

      const openDeleteDish = () => {
        setDishDelete(row.original);
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
              onClick={openEditDish}
              className="cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-950/50"
            >
              <Edit className="h-4 w-4 mr-2 text-orange-600" />
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={openDeleteDish}
              className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/50 text-red-600 dark:text-red-400"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Xóa món
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function AlertDialogDeleteDish({
  dishDelete,
  setDishDelete,
}: {
  dishDelete: DishItem | null;
  setDishDelete: (value: DishItem | null) => void;
}) {
  const { mutateAsync } = useDeleteDishMutation();
  const deleteDish = async () => {
    if (dishDelete) {
      try {
        const result = await mutateAsync(dishDelete.id);
        setDishDelete(null);
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
      open={Boolean(dishDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setDishDelete(null);
        }
      }}
    >
      <AlertDialogContent className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border shadow-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-500" />
            Xóa món ăn?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Món{' '}
            <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded px-2 py-1 font-medium">
              {dishDelete?.name}
            </span>{' '}
            sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="hover:bg-gray-100 dark:hover:bg-gray-800">
            Hủy bỏ
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={deleteDish}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Xóa món
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Số lượng item trên 1 trang
const PAGE_SIZE = 10;
export default function DishTable({
  setDishList,
}: {
  setDishList: (value: DishListResType['data']) => void;
}) {
  const searchParam = useSearchParams();
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1;
  const pageIndex = page - 1;
  const [dishIdEdit, setDishIdEdit] = useState<number | undefined>();
  const [dishDelete, setDishDelete] = useState<DishItem | null>(null);
  const dishListQuery = useDishListQuery();
  const data = dishListQuery.data?.payload.data ?? [];
  useEffect(() => {
    setDishList(data);
  }, [data, setDishList]);
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
    <DishTableContext.Provider
      value={{ dishIdEdit, setDishIdEdit, dishDelete, setDishDelete }}
    >
      <div className="w-full space-y-6">
        <EditDish id={dishIdEdit} setId={setDishIdEdit} />
        <AlertDialogDeleteDish
          dishDelete={dishDelete}
          setDishDelete={setDishDelete}
        />

        {/* Filters and Actions */}
        <Card className="border-0 shadow-sm bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm theo tên món..."
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
                  {table.getFilteredRowModel().rows.length} / {data.length} món
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <AddDish />
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
                          <Utensils className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="text-muted-foreground">
                          Không tìm thấy món ăn nào
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
                món
              </div>
              <div>
                <AutoPagination
                  page={table.getState().pagination.pageIndex + 1}
                  pageSize={table.getPageCount()}
                  pathname="/manage/dishes"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DishTableContext.Provider>
  );
}
