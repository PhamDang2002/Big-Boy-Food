import Link from 'next/link';
import { Menu, Package2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import DarkModeToggle from '@/components/dark-mode-toggle';
import NavItems from '@/app/(public)/nav-items';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full flex-col relative">
      <header className="sticky z-20 top-0 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6 shadow-sm">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold md:text-base group"
          >
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg group-hover:scale-110 transition-transform duration-300">
              <Package2 className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent font-bold">
              Big Boy
            </span>
          </Link>
          <NavItems className="text-muted-foreground transition-colors hover:text-foreground flex-shrink-0" />
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <nav className="grid gap-6 text-lg font-medium mt-8">
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                  <Package2 className="h-5 w-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent font-bold">
                  Big Boy
                </span>
              </Link>

              <NavItems className="text-muted-foreground transition-colors hover:text-foreground" />
            </nav>
          </SheetContent>
        </Sheet>
        <div className="ml-auto flex items-center gap-2">
          <DarkModeToggle />
        </div>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
