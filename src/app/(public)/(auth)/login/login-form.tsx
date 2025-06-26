'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { LoginBody, LoginBodyType } from '@/schemaValidations/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoginMutation } from '@/queries/useAuth';
import { toast } from '@/components/ui/use-toast';
import { handleErrorApi } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useAppContext } from '@/components/app-provider';

export default function LoginForm() {
  const loginMutation = useLoginMutation();
  const searchParams = useSearchParams();
  const clearTokens = searchParams.get('clearTokens');
  const { setRole } = useAppContext();
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const router = useRouter();
  useEffect(() => {
    if (clearTokens) {
      setRole();
    }
  }, [clearTokens, setRole]);
  const onSubmit = async (data: LoginBodyType) => {
    // Khi nhấn submit thì React hook form sẽ validate cái form bằng zod schema ở client trước
    // Nếu không pass qua vòng này thì sẽ không gọi api
    if (loginMutation.isPending) return;
    try {
      const result = await loginMutation.mutateAsync(data);
      toast({
        description: result.payload.message,
      });
      setRole(result.payload.data.account.role);
      router.push('/manage/dashboard');
    } catch (error: any) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-red-100 to-yellow-100 dark:from-orange-950/80 dark:via-red-950/80 dark:to-yellow-950/80">
      <Card className="mx-auto w-full max-w-md shadow-2xl rounded-2xl border-0">
        <CardHeader className="flex flex-col items-center gap-2">
          {/* Logo hoặc icon */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-full p-3 mb-2">
            <svg width="32" height="32" fill="white" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Đăng nhập
          </CardTitle>
          <CardDescription className="text-center text-base">
            Chào mừng bạn quay lại! Vui lòng đăng nhập để tiếp tục.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-4"
              noValidate
              onSubmit={form.handleSubmit(onSubmit, (err) => {
                console.log(err);
              })}
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        className="pl-10 rounded-full"
                        required
                        {...field}
                      />
                      <span className="absolute left-3 top-2.5 text-gray-400">
                        <svg
                          width="20"
                          height="20"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M2 4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4zm2 0v.01L12 13l8-8.99V4H4zm16 2.41l-7.29 7.3a1 1 0 0 1-1.42 0L4 6.41V20h16V6.41z" />
                        </svg>
                      </span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="password">Mật khẩu</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type="password"
                        className="pl-10 rounded-full"
                        required
                        {...field}
                      />
                      <span className="absolute left-3 top-2.5 text-gray-400">
                        <svg
                          width="20"
                          height="20"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6-7V8a6 6 0 1 0-12 0v2a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zm-8-2a4 4 0 1 1 8 0v2H8V8zm10 11H6v-7h12v7z" />
                        </svg>
                      </span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold shadow hover:from-orange-600 hover:to-red-600 rounded-full"
              >
                Đăng nhập
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
