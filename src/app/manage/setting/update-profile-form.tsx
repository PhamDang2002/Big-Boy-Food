'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';
import {
  UpdateMeBody,
  UpdateMeBodyType,
} from '@/schemaValidations/account.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAccountMe, useUpdateMeMutation } from '@/queries/useAccount';
import { useUploadMediaMutation } from '@/queries/useMedia';
import { toast } from '@/components/ui/use-toast';
import { handleErrorApi } from '@/lib/utils';

export default function UpdateProfileForm() {
  const [file, setFile] = useState<File | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const { data, refetch } = useAccountMe();
  const updateMeMutation = useUpdateMeMutation();
  const uploadMediaMutation = useUploadMediaMutation();
  const form = useForm<UpdateMeBodyType>({
    resolver: zodResolver(UpdateMeBody),
    defaultValues: {
      name: '',
      avatar: undefined,
    },
  });

  const avatar = form.watch('avatar');
  const name = form.watch('name');
  useEffect(() => {
    if (data) {
      const { name, avatar } = data.payload.data;
      form.reset({
        name,
        avatar: avatar ?? undefined,
      });
    }
  }, [form, data]);
  // Nếu các bạn dùng Next.js 15 (tức React 19) thì không cần dùng useMemo chỗ này
  // const previewAvatar = file ? URL.createObjectURL(file) : avatar
  const previewAvatar = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return avatar;
  }, [avatar, file]);

  const reset = () => {
    form.reset();
    setFile(null);
  };
  const onSubmit = async (values: UpdateMeBodyType) => {
    if (updateMeMutation.isPending) return;
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
      const result = await updateMeMutation.mutateAsync(body);
      toast({
        description: result.payload.message,
      });
      refetch();
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    }
  };
  return (
    <Form {...form}>
      <form
        noValidate
        className="grid auto-rows-max items-start gap-4 md:gap-8"
        onReset={reset}
        onSubmit={form.handleSubmit(onSubmit, (e) => {
          console.log(e);
        })}
      >
        <Card
          x-chunk="dashboard-07-chunk-0"
          className="shadow-2xl rounded-2xl border-0 p-6"
        >
          <CardHeader>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Thông tin cá nhân
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-4 items-center">
                      <div className="relative group">
                        <Avatar className="aspect-square w-[110px] h-[110px] rounded-xl object-cover border-4 border-orange-200 group-hover:border-orange-400 transition-all">
                          <AvatarImage src={previewAvatar} />
                          <AvatarFallback className="rounded-xl">
                            {name}
                          </AvatarFallback>
                        </Avatar>
                        <button
                          className="absolute bottom-2 right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full p-2 shadow-lg opacity-80 group-hover:opacity-100 transition-all"
                          type="button"
                          onClick={() => avatarInputRef.current?.click()}
                        >
                          <Upload className="h-4 w-4" />
                          <span className="sr-only">Upload</span>
                        </button>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={avatarInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFile(file);
                            field.onChange(
                              'http://localhost:3000/' + field.name,
                            );
                          }
                        }}
                      />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <Label htmlFor="name">Tên</Label>
                      <Input
                        id="name"
                        type="text"
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
