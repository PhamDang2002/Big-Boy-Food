import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function TableSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 rounded-lg" />
          <Skeleton className="h-4 w-64 rounded-md" />
        </div>
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card
            key={index}
            className="group hover:shadow-lg transition-all duration-300"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 rounded-md mb-2" />
              <Skeleton className="h-3 w-32 rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table Skeleton */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-32 bg-white/20 rounded-md" />
              <Skeleton className="h-4 w-48 bg-white/20 rounded-md" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-3 bg-green-400 rounded-full" />
              <Skeleton className="h-4 w-20 bg-white/20 rounded-md" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Table Header */}
          <div className="grid grid-cols-6 gap-4 mb-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-4 rounded-md" />
            ))}
          </div>

          {/* Table Rows */}
          {Array.from({ length: 5 }).map((_, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-6 gap-4 mb-3">
              {Array.from({ length: 6 }).map((_, colIndex) => (
                <Skeleton
                  key={colIndex}
                  className={cn(
                    'h-4 rounded-md',
                    colIndex === 0 && 'w-3/4',
                    colIndex === 5 && 'w-1/2',
                  )}
                />
              ))}
            </div>
          ))}

          {/* Pagination Skeleton */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <Skeleton className="h-4 w-32 rounded-md" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
