'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import {
  ChangePasswordBody,
  ChangePasswordBodyType,
} from '@/schemaValidations/account.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useChangePasswordMutation } from '@/queries/useAccount';
import { toast } from '@/components/ui/use-toast';
import { handleErrorApi } from '@/lib/utils';

export default function ChangePasswordForm() {
  const changePasswordMutation = useChangePasswordMutation();
  const form = useForm<ChangePasswordBodyType>({
    resolver: zodResolver(ChangePasswordBody),
    defaultValues: {
      oldPassword: '',
      password: '',
      confirmPassword: '',
    },
  });
  const onSubmit = async (data: ChangePasswordBodyType) => {
    if (changePasswordMutation.isPending) return;
    try {
      const result = await changePasswordMutation.mutateAsync(data);
      toast({
        description: result.payload.message,
      });
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    }
  };

  const reset = () => {
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        noValidate
        className="grid auto-rows-max items-start gap-4 md:gap-8"
        onSubmit={form.handleSubmit(onSubmit)}
        onReset={reset}
      >
        <Card
          className="overflow-hidden shadow-2xl rounded-2xl border-0 p-6"
          x-chunk="dashboard-07-chunk-4"
        >
          <CardHeader>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Đổi mật khẩu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <Label htmlFor="oldPassword">Mật khẩu cũ</Label>
                      <Input
                        autoComplete="current-password"
                        id="oldPassword"
                        type="password"
                        className="w-full rounded-full border-2 border-orange-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <Label htmlFor="password">Mật khẩu mới</Label>
                      <Input
                        autoComplete="new-password"
                        id="password"
                        type="password"
                        className="w-full rounded-full border-2 border-orange-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <Label htmlFor="confirmPassword">
                        Nhập lại mật khẩu mới
                      </Label>
                      <Input
                        autoComplete="new-password"
                        id="confirmPassword"
                        type="password"
                        className="w-full rounded-full border-2 border-orange-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-2 md:ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  type="reset"
                  className="rounded-full border-orange-300"
                >
                  Hủy
                </Button>
                <Button
                  size="sm"
                  type="submit"
                  className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold shadow hover:from-orange-600 hover:to-red-600"
                >
                  Lưu thông tin
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
