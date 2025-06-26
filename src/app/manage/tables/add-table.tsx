'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle, Table, Users, Settings } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { getVietnameseTableStatus, handleErrorApi } from '@/lib/utils';
import {
  CreateTableBody,
  CreateTableBodyType,
} from '@/schemaValidations/table.schema';
import { TableStatus, TableStatusValues } from '@/constants/type';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAddTableMutation } from '@/queries/useTable';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AddTable() {
  const [open, setOpen] = useState(false);
  const addTableMutation = useAddTableMutation();
  const form = useForm<CreateTableBodyType>({
    resolver: zodResolver(CreateTableBody),
    defaultValues: {
      number: 0,
      capacity: 2,
      status: TableStatus.Hidden,
    },
  });

  const reset = () => {
    form.reset();
  };

  const onSubmit = async (values: CreateTableBodyType) => {
    if (addTableMutation.isPending) return;
    try {
      const result = await addTableMutation.mutateAsync(values);
      toast({
        description: result.payload.message,
      });
      reset();
      setOpen(false);
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    }
  };

  return (
    <Dialog
      onOpenChange={(value) => {
        if (!value) {
          reset();
        }
        setOpen(value);
      }}
      open={open}
    >
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="h-9 gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <PlusCircle className="h-4 w-4" />
          <span className="font-medium">Thêm bàn mới</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border shadow-xl">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
              <Table className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">
                Thêm bàn ăn mới
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Tạo bàn ăn mới với QR code tự động
              </p>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form
            noValidate
            onSubmit={form.handleSubmit(onSubmit, (e) => {
              console.log(e);
            })}
            onReset={reset}
            className="space-y-6"
            id="add-table-form"
          >
            {/* Table Number */}
            <Card className="border-2 border-orange-100 dark:border-orange-900/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <Table className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Thông tin bàn</h3>
                    <p className="text-sm text-muted-foreground">
                      Cấu hình cơ bản cho bàn ăn
                    </p>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <Label
                        htmlFor="number"
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                        Số hiệu bàn
                      </Label>
                      <FormControl>
                        <Input
                          id="number"
                          type="number"
                          className="w-full border-2 focus:border-orange-500 focus:ring-orange-500/20"
                          placeholder="Nhập số bàn..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Capacity */}
            <Card className="border-2 border-blue-100 dark:border-blue-900/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Sức chứa</h3>
                    <p className="text-sm text-muted-foreground">
                      Số lượng khách tối đa
                    </p>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <Label
                        htmlFor="capacity"
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Lượng khách cho phép
                      </Label>
                      <FormControl>
                        <Input
                          id="capacity"
                          type="number"
                          className="w-full border-2 focus:border-blue-500 focus:ring-blue-500/20"
                          placeholder="Nhập sức chứa..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Status */}
            <Card className="border-2 border-purple-100 dark:border-purple-900/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Settings className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Trạng thái</h3>
                    <p className="text-sm text-muted-foreground">
                      Cài đặt trạng thái ban đầu
                    </p>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <Label
                        htmlFor="status"
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        Trạng thái bàn
                      </Label>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full border-2 focus:border-purple-500 focus:ring-purple-500/20">
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                          <SelectContent>
                            {TableStatusValues.map((status) => (
                              <SelectItem key={status} value={status}>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant={
                                      status === TableStatus.Available
                                        ? 'default'
                                        : 'secondary'
                                    }
                                    className="text-xs"
                                  >
                                    {getVietnameseTableStatus(status)}
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </form>
        </Form>

        <DialogFooter className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            form="add-table-form"
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            disabled={addTableMutation.isPending}
          >
            {addTableMutation.isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Đang tạo...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Tạo bàn mới
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
