'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  CreateEmployeeAccountBody,
  CreateEmployeeAccountBodyType,
} from '@/schemaValidations/account.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle, Upload, Users, Mail, Lock, User } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
  FormControl,
} from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAddAccountMutation } from '@/queries/useAccount';
import { useUploadMediaMutation } from '@/queries/useMedia';
import { toast } from '@/components/ui/use-toast';
import { handleErrorApi } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AddEmployee() {
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const addAccountMutation = useAddAccountMutation();
  const uploadMediaMutation = useUploadMediaMutation();

  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const form = useForm<CreateEmployeeAccountBodyType>({
    resolver: zodResolver(CreateEmployeeAccountBody),
    defaultValues: {
      name: '',
      email: '',
      avatar: undefined,
      password: '',
      confirmPassword: '',
    },
  });

  const avatar = form.watch('avatar');
  const name = form.watch('name');
  const previewAvatarFromFile = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return avatar;
  }, [file, avatar]);

  const reset = () => {
    form.reset();
    setFile(null);
  };

  const onSubmit = async (values: CreateEmployeeAccountBodyType) => {
    if (addAccountMutation.isPending) return;
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
          avatar: imageUrl,
        };
      }
      const result = await addAccountMutation.mutateAsync(body);
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
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="h-9 gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <PlusCircle className="h-4 w-4" />
          <span className="font-medium">Thêm nhân viên</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-screen overflow-auto bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border shadow-xl">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">
                Tạo tài khoản nhân viên
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1">
                Các trường tên, email, mật khẩu là bắt buộc
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form
            noValidate
            className="space-y-6"
            id="add-employee-form"
            onSubmit={form.handleSubmit(onSubmit, (e) => {
              console.log(e);
            })}
            onReset={reset}
          >
            {/* Avatar Upload */}
            <Card className="border-2 border-orange-100 dark:border-orange-900/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <Upload className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Ảnh đại diện</h3>
                    <p className="text-sm text-muted-foreground">
                      Tải lên ảnh đại diện cho nhân viên
                    </p>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-4 items-start justify-start">
                        <Avatar className="aspect-square w-24 h-24 rounded-lg object-cover border-2 border-orange-200 dark:border-orange-800">
                          <AvatarImage src={previewAvatarFromFile} />
                          <AvatarFallback className="rounded-lg bg-orange-100 dark:bg-orange-900/30">
                            {name ? name.charAt(0).toUpperCase() : '👤'}
                          </AvatarFallback>
                        </Avatar>
                        <input
                          type="file"
                          accept="image/*"
                          ref={avatarInputRef}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setFile(file);
                              field.onChange(
                                'https://big-boy-food.vercel.app/' + file.name,
                              );
                            }
                          }}
                          className="hidden"
                        />
                        <button
                          className="flex aspect-square w-24 h-24 items-center justify-center rounded-lg border-2 border-dashed border-orange-300 dark:border-orange-700 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all duration-200"
                          type="button"
                          onClick={() => avatarInputRef.current?.click()}
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
                    <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Thông tin cơ bản</h3>
                    <p className="text-sm text-muted-foreground">
                      Tên và thông tin liên hệ
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
                          Họ và tên
                        </Label>
                        <FormControl>
                          <Input
                            id="name"
                            className="w-full border-2 focus:border-blue-500 focus:ring-blue-500/20"
                            placeholder="Nhập họ và tên nhân viên..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <Label
                          htmlFor="email"
                          className="text-sm font-medium flex items-center gap-2"
                        >
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          Email
                        </Label>
                        <FormControl>
                          <Input
                            id="email"
                            type="email"
                            className="w-full border-2 focus:border-blue-500 focus:ring-blue-500/20"
                            placeholder="Nhập email nhân viên..."
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

            {/* Password Settings */}
            <Card className="border-2 border-purple-100 dark:border-purple-900/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Lock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Cài đặt mật khẩu</h3>
                    <p className="text-sm text-muted-foreground">
                      Tạo mật khẩu an toàn cho tài khoản
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <Label
                          htmlFor="password"
                          className="text-sm font-medium flex items-center gap-2"
                        >
                          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                          Mật khẩu
                        </Label>
                        <FormControl>
                          <Input
                            id="password"
                            type="password"
                            className="w-full border-2 focus:border-purple-500 focus:ring-purple-500/20"
                            placeholder="Nhập mật khẩu..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <Label
                          htmlFor="confirmPassword"
                          className="text-sm font-medium flex items-center gap-2"
                        >
                          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                          Xác nhận mật khẩu
                        </Label>
                        <FormControl>
                          <Input
                            id="confirmPassword"
                            type="password"
                            className="w-full border-2 focus:border-purple-500 focus:ring-purple-500/20"
                            placeholder="Nhập lại mật khẩu..."
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
            form="add-employee-form"
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            disabled={addAccountMutation.isPending}
          >
            {addAccountMutation.isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Đang tạo...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Tạo tài khoản
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
