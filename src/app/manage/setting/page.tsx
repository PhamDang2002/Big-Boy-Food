import ChangePasswordForm from '@/app/manage/setting/change-password-form';
import UpdateProfileForm from '@/app/manage/setting/update-profile-form';
import { Badge } from '@/components/ui/badge';

export default function Setting() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 dark:from-orange-950/40 dark:via-red-950/40 dark:to-yellow-950/40 flex items-center justify-center py-8">
      <div className="w-full max-w-5xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Cài đặt tài khoản
          </h1>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <UpdateProfileForm />
          <ChangePasswordForm />
        </div>
      </div>
    </main>
  );
}
