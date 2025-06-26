'use client';
import menuItems from '@/app/manage/menuItems';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Package2, PanelLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileNavLinks() {
  const pathname = usePathname();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="sm:hidden relative overflow-hidden group hover:shadow-lg transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <PanelLeft className="h-5 w-5 relative z-10 group-hover:scale-110 transition-transform duration-300" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[300px] sm:w-[400px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-r"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center gap-3 p-6 border-b">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg">
              <Package2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Big Boy Restaurant
              </h2>
              <p className="text-sm text-muted-foreground">Quản lý hệ thống</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-2">
            <div className="space-y-1">
              {menuItems.map((Item, index) => {
                const isActive = pathname === Item.href;
                return (
                  <Link
                    key={index}
                    href={Item.href}
                    className={cn(
                      'group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden',
                      {
                        'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg':
                          isActive,
                        'text-muted-foreground hover:bg-accent hover:text-accent-foreground':
                          !isActive,
                      },
                    )}
                  >
                    {/* Background gradient for active state */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 blur-xl" />
                    )}

                    <div
                      className={cn(
                        'flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 relative z-10',
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-muted/50 group-hover:bg-accent group-hover:scale-110',
                      )}
                    >
                      <Item.Icon className="h-5 w-5" />
                    </div>

                    <div className="flex-1 relative z-10">
                      <span
                        className={cn(
                          'font-medium',
                          isActive
                            ? 'text-white'
                            : 'group-hover:text-foreground',
                        )}
                      >
                        {Item.title}
                      </span>
                    </div>

                    {/* Active indicator */}
                    {isActive && (
                      <div className="w-2 h-2 rounded-full bg-white relative z-10" />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-6 border-t space-y-4">
            <Link
              href="/manage/setting"
              className={cn(
                'group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden',
                {
                  'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg':
                    pathname === '/manage/setting',
                  'text-muted-foreground hover:bg-accent hover:text-accent-foreground':
                    pathname !== '/manage/setting',
                },
              )}
            >
              {/* Background gradient for active state */}
              {pathname === '/manage/setting' && (
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 blur-xl" />
              )}

              <div
                className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 relative z-10',
                  pathname === '/manage/setting'
                    ? 'bg-white/20 text-white'
                    : 'bg-muted/50 group-hover:bg-accent group-hover:scale-110 group-hover:rotate-12',
                )}
              >
                <Package2 className="h-5 w-5" />
              </div>

              <div className="flex-1 relative z-10">
                <span
                  className={cn(
                    'font-medium',
                    pathname === '/manage/setting'
                      ? 'text-white'
                      : 'group-hover:text-foreground',
                  )}
                >
                  Cài đặt
                </span>
              </div>

              {/* Active indicator */}
              {pathname === '/manage/setting' && (
                <div className="w-2 h-2 rounded-full bg-white relative z-10" />
              )}
            </Link>

            {/* Decorative element */}
            <div className="flex items-center justify-center pt-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30">
                <Sparkles className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                  Premium Experience
                </span>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
