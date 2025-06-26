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
import {
  PlusCircle,
  Upload,
  Utensils,
  DollarSign,
  FileText,
  Settings,
} from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getVietnameseDishStatus, handleErrorApi } from '@/lib/utils';
import {
  CreateDishBody,
  CreateDishBodyType,
} from '@/schemaValidations/dish.schema';
import { DishStatus, DishStatusValues } from '@/constants/type';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAddDishMutation } from '@/queries/useDish';
import { useUploadMediaMutation } from '@/queries/useMedia';
import { toast } from '@/components/ui/use-toast';
import revalidateApiRequest from '@/apiRequests/revalidate';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AddDish() {
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const addDishMutation = useAddDishMutation();
  const uploadMediaMutation = useUploadMediaMutation();
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const form = useForm<CreateDishBodyType>({
    resolver: zodResolver(CreateDishBody),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      image: undefined,
      status: DishStatus.Unavailable,
    },
  });

  const image = form.watch('image');
  const name = form.watch('name');
  const previewAvatarFromFile = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return image;
  }, [file, image]);

  const reset = () => {
    form.reset();
    setFile(null);
  };

  const onSubmit = async (values: CreateDishBodyType) => {
    if (addDishMutation.isPending) return;
    try {
      let body = values;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const uploadImageResult = await uploadMediaMutation.mutateAsync(
          formData,
        );
        const imageUrl = uploadImageResult.payload.data;
        body = {
          ...values,
          image: imageUrl,
        };
      }
      const result = await addDishMutation.mutateAsync(body);
      await revalidateApiRequest('dishes');
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
          <span className="font-medium">Thêm món mới</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-screen overflow-auto bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border shadow-xl">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
              <Utensils className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">
                Thêm món ăn mới
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Tạo món ăn mới với hình ảnh và thông tin chi tiết
              </p>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form
            noValidate
            className="space-y-6"
            id="add-dish-form"
            onSubmit={form.handleSubmit(onSubmit, (e) => {
              console.log(e);
            })}
            onReset={reset}
          >
            {/* Image Upload */}
            <Card className="border-2 border-orange-100 dark:border-orange-900/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <Upload className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Hình ảnh món ăn</h3>
                    <p className="text-sm text-muted-foreground">
                      Tải lên hình ảnh đẹp cho món ăn
                    </p>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-4 items-start justify-start">
                        <Avatar className="aspect-square w-24 h-24 rounded-lg object-cover border-2 border-orange-200 dark:border-orange-800">
                          <AvatarImage src={previewAvatarFromFile} />
                          <AvatarFallback className="rounded-lg bg-orange-100 dark:bg-orange-900/30">
                            {name ? name.charAt(0).toUpperCase() : '🍽️'}
                          </AvatarFallback>
                        </Avatar>
                        <input
                          type="file"
                          accept="image/*"
                          ref={imageInputRef}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setFile(file);
                              field.onChange(
                                'http://localhost:3000/' + file.name,
                              );
                            }
                          }}
                          className="hidden"
                        />
                        <button
                          className="flex aspect-square w-24 h-24 items-center justify-center rounded-lg border-2 border-dashed border-orange-300 dark:border-orange-700 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all duration-200"
                          type="button"
                          onClick={() => imageInputRef.current?.click()}
                        >
                          <div className="text-center">
                            <Upload className="h-6 w-6 text-orange-500 mx-auto mb-1" />
                            <span className="text-xs text-orange-600 dark:text-orange-400">
                              Tải ảnh
                            </span>
                          </div>
                        </button>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card className="border-2 border-blue-100 dark:border-blue-900/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Utensils className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Thông tin cơ bản</h3>
                    <p className="text-sm text-muted-foreground">
                      Tên và mô tả món ăn
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <Label
                          htmlFor="name"
                          className="text-sm font-medium flex items-center gap-2"
                        >
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          Tên món ăn
                        </Label>
                        <FormControl>
                          <Input
                            id="name"
                            className="w-full border-2 focus:border-blue-500 focus:ring-blue-500/20"
                            placeholder="Nhập tên món ăn..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <Label
                          htmlFor="description"
                          className="text-sm font-medium flex items-center gap-2"
                        >
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          Mô tả món ăn
                        </Label>
                        <FormControl>
                          <Textarea
                            id="description"
                            className="w-full border-2 focus:border-blue-500 focus:ring-blue-500/20 min-h-[100px]"
                            placeholder="Mô tả chi tiết về món ăn, nguyên liệu, cách chế biến..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Price and Status */}
            <Card className="border-2 border-purple-100 dark:border-purple-900/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Giá cả & Trạng thái</h3>
                    <p className="text-sm text-muted-foreground">
                      Cài đặt giá và trạng thái phục vụ
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <Label
                          htmlFor="price"
                          className="text-sm font-medium flex items-center gap-2"
                        >
                          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                          Giá món ăn (VND)
                        </Label>
                        <FormControl>
                          <Input
                            id="price"
                            type="number"
                            className="w-full border-2 focus:border-purple-500 focus:ring-purple-500/20"
                            placeholder="Nhập giá..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                          Trạng thái
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
                              {DishStatusValues.map((status) => (
                                <SelectItem key={status} value={status}>
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant={
                                        status === DishStatus.Available
                                          ? 'default'
                                          : 'secondary'
                                      }
                                      className="text-xs"
                                    >
                                      {getVietnameseDishStatus(status)}
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
                </div>
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
            form="add-dish-form"
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            disabled={addDishMutation.isPending}
          >
            {addDishMutation.isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Đang tạo...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Tạo món mới
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
