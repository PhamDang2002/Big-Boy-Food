'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLogoutMutation } from '@/queries/useAuth';
import { handleErrorApi } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useAccountMe } from '@/queries/useAccount';
import { useAppContext } from '@/components/app-provider';
import {
  Settings,
  LogOut,
  HelpCircle,
  User,
  Crown,
  ChevronDown,
} from 'lucide-react';

export default function DropdownAvatar() {
  const logoutMutation = useLogoutMutation();
  const router = useRouter();
  const { data } = useAccountMe();
  const { setRole } = useAppContext();
  const account = data?.payload.data;

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="overflow-hidden rounded-full px-2 py-1 h-auto gap-2 hover:shadow-lg transition-all duration-300 group border-2 hover:border-orange-200 dark:hover:border-orange-800"
        >
          <div className="relative">
            <Avatar className="h-8 w-8 ring-2 ring-orange-100 dark:ring-orange-900 group-hover:ring-orange-200 dark:group-hover:ring-orange-800 transition-all duration-300">
              <AvatarImage
                src={account?.avatar ?? undefined}
                alt={account?.name}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-500 text-white font-semibold text-sm">
                {account?.name?.slice(0, 2).toUpperCase() || 'BB'}
              </AvatarFallback>
            </Avatar>
            {/* Online indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
          </div>

          <div className="flex flex-col items-start text-left">
            <span className="text-sm font-medium text-foreground line-clamp-1">
              {account?.name || 'User'}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Crown className="h-3 w-3 text-orange-500" />
              Admin
            </span>
          </div>

          <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors duration-300" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border shadow-xl"
      >
        {/* User Info Header */}
        <div className="p-4 border-b">
          <DropdownMenuLabel className="p-0">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 ring-2 ring-orange-100 dark:ring-orange-900">
                <AvatarImage
                  src={account?.avatar ?? undefined}
                  alt={account?.name}
                />
                <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-500 text-white font-semibold">
                  {account?.name?.slice(0, 2).toUpperCase() || 'BB'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">
                  {account?.name || 'User'}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {account?.email || 'user@example.com'}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Crown className="h-3 w-3 text-orange-500" />
                  <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                    Quản trị viên
                  </span>
                </div>
              </div>
            </div>
          </DropdownMenuLabel>
        </div>

        <DropdownMenuSeparator />

        {/* Menu Items */}
        <DropdownMenuItem
          asChild
          className="cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-950/50 transition-colors duration-200"
        >
          <Link
            href="/manage/setting"
            className="flex items-center gap-3 px-4 py-3"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30">
              <Settings className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex-1">
              <span className="font-medium">Cài đặt</span>
              <p className="text-xs text-muted-foreground">Quản lý tài khoản</p>
            </div>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors duration-200">
          <div className="flex items-center gap-3 px-4 py-3 w-full">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <HelpCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <span className="font-medium">Hỗ trợ</span>
              <p className="text-xs text-muted-foreground">
                Trợ giúp & liên hệ
              </p>
            </div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={logout}
          className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors duration-200 text-red-600 dark:text-red-400"
        >
          <div className="flex items-center gap-3 px-4 py-3 w-full">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30">
              <LogOut className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <span className="font-medium">Đăng xuất</span>
              <p className="text-xs text-muted-foreground">
                Thoát khỏi hệ thống
              </p>
            </div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
