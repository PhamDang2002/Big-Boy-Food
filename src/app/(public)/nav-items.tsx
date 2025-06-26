'use client';
import { useAppContext } from '@/components/app-provider';
import { Role } from '@/constants/type';
import { cn, handleErrorApi } from '@/lib/utils';
import { useLogoutMutation } from '@/queries/useAuth';
import { RoleType } from '@/types/jwt.types';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Home,
  Utensils,
  ShoppingCart,
  LogIn,
  Settings,
  LogOut,
  Crown,
  User,
} from 'lucide-react';

const menuItems: {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  role?: RoleType[];
  hideWhenLogin?: boolean;
}[] = [
  {
    title: 'Trang chủ',
    href: '/',
    icon: Home,
  },
  {
    title: 'Menu',
    href: '/guest/menu',
    icon: Utensils,
    role: [Role.Guest],
  },
  {
    title: 'Đơn hàng',
    href: '/guest/orders',
    icon: ShoppingCart,
    role: [Role.Guest],
  },
  {
    title: 'Đăng nhập',
    href: '/login',
    icon: LogIn,
    hideWhenLogin: true,
  },
  {
    title: 'Quản lý',
    href: '/manage/dashboard',
    icon: Settings,
    role: [Role.Owner, Role.Employee],
  },
];

// Server: Món ăn, Đăng nhập. Do server không biết trạng thái đăng nhập của user
// CLient: Đầu tiên client sẽ hiển thị là Món ăn, Đăng nhập.
// Nhưng ngay sau đó thì client render ra là Món ăn, Đơn hàng, Quản lý do đã check được trạng thái đăng nhập

export default function NavItems({ className }: { className?: string }) {
  const { role, setRole } = useAppContext();
  const logoutMutation = useLogoutMutation();
  const router = useRouter();
  const pathname = usePathname();

  const logout = async () => {
    if (logoutMutation.isPending) return;
    try {
      await logoutMutation.mutateAsync();
      setRole();
      router.push('/');
    } catch (error: any) {
      handleErrorApi({
        error,
      });
    }
  };

  return (
    <div className="flex items-center gap-1">
      {menuItems.map((item) => {
        // Trường hợp đăng nhập thì chỉ hiển thị menu đăng nhập
        const isAuth = item.role && role && item.role.includes(role);
        // Trường hợp menu item có thể hiển thị dù cho đã đăng nhập hay chưa
        const canShow =
          (item.role === undefined && !item.hideWhenLogin) ||
          (!role && item.hideWhenLogin);

        if (isAuth || canShow) {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              href={item.href}
              key={item.href}
              className={cn(
                'group relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-accent hover:text-accent-foreground',
                {
                  'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg':
                    isActive,
                  'text-muted-foreground hover:text-foreground': !isActive,
                },
                className,
              )}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg blur-sm" />
              )}

              <Icon
                className={cn(
                  'h-4 w-4 transition-all duration-300',
                  isActive ? 'text-white' : 'group-hover:scale-110',
                )}
              />

              <span className="relative z-10 font-medium">{item.title}</span>

              {/* Hover effect */}
              {!isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
            </Link>
          );
        }
        return null;
      })}

      {role && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'group relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-red-50 dark:hover:bg-red-950/50 text-muted-foreground hover:text-red-600 dark:hover:text-red-400',
                className,
              )}
            >
              <LogOut className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
              <span className="font-medium">Đăng xuất</span>

              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-pink-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border shadow-xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <LogOut className="h-5 w-5 text-red-500" />
                Xác nhận đăng xuất
              </AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn đăng xuất khỏi hệ thống? Việc này có thể
                làm mất đi các thông tin chưa lưu.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="hover:bg-gray-100 dark:hover:bg-gray-800">
                Hủy bỏ
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={logout}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
              >
                Đăng xuất
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Role indicator */}
      {role && (
        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 border border-orange-200 dark:border-orange-800">
          {role === Role.Owner ? (
            <Crown className="h-3 w-3 text-orange-600 dark:text-orange-400" />
          ) : (
            <User className="h-3 w-3 text-orange-600 dark:text-orange-400" />
          )}
          <span className="text-xs font-medium text-orange-700 dark:text-orange-300">
            {role === Role.Owner
              ? 'Chủ quán'
              : role === Role.Employee
              ? 'Nhân viên'
              : 'Khách'}
          </span>
        </div>
      )}
    </div>
  );
}
