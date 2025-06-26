import { Fragment, useState } from 'react';
import { Users, Table, Sparkles, Eye } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { OrderStatusIcon, cn, getVietnameseOrderStatus } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { OrderStatus, OrderStatusValues } from '@/constants/type';
import { TableListResType } from '@/schemaValidations/table.schema';
import { Badge } from '@/components/ui/badge';
import {
  ServingGuestByTableNumber,
  Statics,
  StatusCountObject,
} from '@/app/manage/orders/order-table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import OrderGuestDetail from '@/app/manage/orders/order-guest-detail';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Ví dụ:
// const statics: Statics = {
//   status: {
//     Pending: 1,
//     Processing: 2,
//     Delivered: 3,
//     Paid: 5,
//     Rejected: 0
//   },
//   table: {
//     1: { // Bàn số 1
//       20: { // Guest 20
//         Pending: 1,
//         Processing: 2,
//         Delivered: 3,
//         Paid: 5,
//         Rejected: 0
//       },
//       21: { // Guest 21
//         Pending: 1,
//         Processing: 2,
//         Delivered: 3,
//         Paid: 5,
//         Rejected: 0
//       }
//     }
//   }
// }
export default function OrderStatics({
  statics,
  tableList,
  servingGuestByTableNumber,
}: {
  statics: Statics;
  tableList: TableListResType['data'];
  servingGuestByTableNumber: ServingGuestByTableNumber;
}) {
  const [selectedTableNumber, setSelectedTableNumber] = useState<number>(0);
  const selectedServingGuest = servingGuestByTableNumber[selectedTableNumber];

  return (
    <Fragment>
      <Dialog
        open={Boolean(selectedTableNumber)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTableNumber(0);
          }
        }}
      >
        <DialogContent className="max-h-full overflow-auto bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border shadow-xl">
          {selectedServingGuest && (
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Table className="h-5 w-5 text-orange-600" />
                Khách đang ngồi tại bàn {selectedTableNumber}
              </DialogTitle>
            </DialogHeader>
          )}
          <div>
            {selectedServingGuest &&
              Object.keys(selectedServingGuest).map((guestId, index) => {
                const orders = selectedServingGuest[Number(guestId)];
                return (
                  <div key={guestId}>
                    <OrderGuestDetail
                      guest={orders[0].guest}
                      orders={orders}
                      onPaySuccess={() => {
                        setSelectedTableNumber(0);
                      }}
                    />
                    {index !== Object.keys(selectedServingGuest).length - 1 && (
                      <Separator className="my-5" />
                    )}
                  </div>
                );
              })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
            <Table className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Trạng thái bàn</h2>
            <p className="text-sm text-muted-foreground">
              Theo dõi hoạt động của từng bàn
            </p>
          </div>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tableList.map((table) => {
          const tableNumber: number = table.number;
          const tableStatics: Record<number, StatusCountObject> | undefined =
            statics.table[tableNumber];
          let isEmptyTable = true;
          let countObject: StatusCountObject = {
            Pending: 0,
            Processing: 0,
            Delivered: 0,
            Paid: 0,
            Rejected: 0,
          };
          const servingGuestCount = Object.values(
            servingGuestByTableNumber[tableNumber] ?? [],
          ).length;

          if (tableStatics) {
            for (const guestId in tableStatics) {
              const guestStatics = tableStatics[Number(guestId)];
              if (
                [
                  guestStatics.Pending,
                  guestStatics.Processing,
                  guestStatics.Delivered,
                ].some((status) => status !== 0 && status !== undefined)
              ) {
                isEmptyTable = false;
              }
              countObject = {
                Pending: countObject.Pending + (guestStatics.Pending ?? 0),
                Processing:
                  countObject.Processing + (guestStatics.Processing ?? 0),
                Delivered:
                  countObject.Delivered + (guestStatics.Delivered ?? 0),
                Paid: countObject.Paid + (guestStatics.Paid ?? 0),
                Rejected: countObject.Rejected + (guestStatics.Rejected ?? 0),
              };
            }
          }

          return (
            <Card
              key={tableNumber}
              className={cn(
                'group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2',
                {
                  'border-orange-200 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 dark:border-orange-800':
                    !isEmptyTable,
                  'border-gray-200 dark:border-gray-800': isEmptyTable,
                },
              )}
              onClick={() => {
                if (!isEmptyTable) setSelectedTableNumber(tableNumber);
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle
                    className={cn('text-2xl font-bold', {
                      'text-orange-600 dark:text-orange-400': !isEmptyTable,
                      'text-muted-foreground': isEmptyTable,
                    })}
                  >
                    Bàn {tableNumber}
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {servingGuestCount}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {isEmptyTable ? (
                  <div className="text-center py-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full mb-3">
                      <Sparkles className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                      Sẵn sàng
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Bàn trống
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Đơn hàng:</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs hover:bg-orange-100 dark:hover:bg-orange-900/30"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Xem chi tiết
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                              <OrderStatusIcon.Pending className="w-4 h-4 text-yellow-600" />
                              <span className="text-sm font-medium">
                                {countObject[OrderStatus.Pending] ?? 0}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            {getVietnameseOrderStatus(OrderStatus.Pending)}:{' '}
                            {countObject[OrderStatus.Pending] ?? 0} đơn
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                              <OrderStatusIcon.Processing className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium">
                                {countObject[OrderStatus.Processing] ?? 0}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            {getVietnameseOrderStatus(OrderStatus.Processing)}:{' '}
                            {countObject[OrderStatus.Processing] ?? 0} đơn
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                              <OrderStatusIcon.Delivered className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium">
                                {countObject[OrderStatus.Delivered] ?? 0}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            {getVietnameseOrderStatus(OrderStatus.Delivered)}:{' '}
                            {countObject[OrderStatus.Delivered] ?? 0} đơn
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                              <OrderStatusIcon.Paid className="w-4 h-4 text-purple-600" />
                              <span className="text-sm font-medium">
                                {countObject[OrderStatus.Paid] ?? 0}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            {getVietnameseOrderStatus(OrderStatus.Paid)}:{' '}
                            {countObject[OrderStatus.Paid] ?? 0} đơn
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    {countObject[OrderStatus.Rejected] > 0 && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                              <OrderStatusIcon.Rejected className="w-4 h-4 text-red-600" />
                              <span className="text-sm font-medium">
                                {countObject[OrderStatus.Rejected] ?? 0}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            {getVietnameseOrderStatus(OrderStatus.Rejected)}:{' '}
                            {countObject[OrderStatus.Rejected] ?? 0} đơn
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </Fragment>
  );
}
