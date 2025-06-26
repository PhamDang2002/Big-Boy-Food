import DarkModeToggle from '@/components/dark-mode-toggle';
import DropdownAvatar from '@/app/manage/dropdown-avatar';
import NavLinks from '@/app/manage/nav-links';
import MobileNavLinks from '@/app/manage/mobile-nav-links';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <NavLinks />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 shadow-sm">
          <MobileNavLinks />
          <div className="relative ml-auto flex-1 md:grow-0">
            <div className="flex items-center justify-end gap-4">
              <DarkModeToggle />
              <DropdownAvatar />
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
