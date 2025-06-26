'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  GuestLoginBody,
  GuestLoginBodyType,
} from '@/schemaValidations/guest.schema';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useGuestLoginMutation } from '@/queries/useGuest';
import { useAppContext } from '@/components/app-provider';
import { handleErrorApi } from '@/lib/utils';

export default function GuestLoginForm() {
  const { setRole } = useAppContext();
  const searchParams = useSearchParams();
  const params = useParams();
  const tableNumber = Number(params.number);
  const token = searchParams.get('token');
  const router = useRouter();
  const loginMutation = useGuestLoginMutation();
  const form = useForm<GuestLoginBodyType>({
    resolver: zodResolver(GuestLoginBody),
    defaultValues: {
      name: '',
      token: token ?? '',
      tableNumber,
    },
  });

  useEffect(() => {
    if (!token) {
      router.push('/');
    }
  }, [token, router]);

  async function onSubmit(values: GuestLoginBodyType) {
    if (loginMutation.isPending) return;
    try {
      const result = await loginMutation.mutateAsync(values);
      setRole(result.payload.data.guest.role);
      router.push('/guest/menu');
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 dark:from-orange-950/40 dark:via-red-950/40 dark:to-yellow-950/40">
      <Card className="mx-auto w-full max-w-md shadow-2xl rounded-2xl border-0">
        <CardHeader className="flex flex-col items-center gap-2">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-full p-3 mb-2">
            <svg width="32" height="32" fill="white" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3a2 2 0 110 4 2 2 0 010-4zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-2 4-3.1 6-3.1s5.97 1.1 6 3.1c-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Đăng nhập gọi món
          </CardTitle>
          <div className="text-center text-base text-muted-foreground">
            Nhập tên để bắt đầu gọi món tại bàn{' '}
            <span className="font-bold text-orange-600">{tableNumber}</span>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-4"
              noValidate
              onSubmit={form.handleSubmit(onSubmit, console.log)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="name">Tên khách hàng</Label>
                    <div className="relative">
                      <Input
                        id="name"
                        type="text"
                        required
                        className="pl-10 rounded-full"
                        {...field}
                      />
                      <span className="absolute left-3 top-2.5 text-gray-400">
                        <svg
                          width="20"
                          height="20"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 12c2.7 0 8 1.34 8 4v2H4v-2c0-2.66 5.3-4 8-4zm0-2a2 2 0 100-4 2 2 0 000 4z" />
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
