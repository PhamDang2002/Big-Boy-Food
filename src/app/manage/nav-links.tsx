'use client';
import menuItems from '@/app/manage/menuItems';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Package2, Settings, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <TooltipProvider>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-16 flex-col border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:flex shadow-lg">
        {/* Logo Section */}
        <div className="flex h-16 items-center justify-center border-b">
          <Link
            href="/"
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
          >
            <Package2 className="h-5 w-5 transition-all group-hover:rotate-12" />
            <span className="sr-only">Big Boy Restaurant</span>
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="flex flex-1 flex-col items-center gap-2 px-2 py-4">
          <div className="flex flex-col items-center gap-2">
            {menuItems.map((Item, index) => {
              const isActive = pathname === Item.href;
              return (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Link
                      href={Item.href}
                      className={cn(
                        'group relative flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 hover:scale-105',
                        {
                          'bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg':
                            isActive,
                          'text-muted-foreground hover:bg-accent hover:text-accent-foreground':
                            !isActive,
                        },
                      )}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute -left-1 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-orange-500 to-red-500" />
                      )}

                      <Item.Icon
                        className={cn(
                          'h-5 w-5 transition-all duration-300',
                          isActive ? 'text-white' : 'group-hover:scale-110',
                        )}
                      />

                      {/* Hover glow effect */}
                      {isActive && (
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 blur-xl" />
                      )}

                      <span className="sr-only">{Item.title}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="bg-background/95 backdrop-blur border shadow-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Item.Icon className="h-4 w-4" />
                      <span className="font-medium">{Item.title}</span>
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </nav>

        {/* Bottom Navigation */}
        <nav className="flex flex-col items-center gap-2 px-2 py-4 border-t">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/manage/setting"
                className={cn(
                  'group relative flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 hover:scale-105',
                  {
                    'bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg':
                      pathname === '/manage/setting',
                    'text-muted-foreground hover:bg-accent hover:text-accent-foreground':
                      pathname !== '/manage/setting',
                  },
                )}
              >
                {/* Active indicator */}
                {pathname === '/manage/setting' && (
                  <div className="absolute -left-1 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-orange-500 to-red-500" />
                )}

                <Settings
                  className={cn(
                    'h-5 w-5 transition-all duration-300',
                    pathname === '/manage/setting'
                      ? 'text-white'
                      : 'group-hover:scale-110 group-hover:rotate-90',
                  )}
                />

                {/* Hover glow effect */}
                {pathname === '/manage/setting' && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 blur-xl" />
                )}

                <span className="sr-only">Cài đặt</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="bg-background/95 backdrop-blur border shadow-lg"
            >
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="font-medium">Cài đặt</span>
              </div>
            </TooltipContent>
          </Tooltip>

          {/* Decorative element */}
          <div className="mt-4 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-200 to-red-200 dark:from-orange-800 dark:to-red-800 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </nav>
      </aside>
    </TooltipProvider>
  );
}
