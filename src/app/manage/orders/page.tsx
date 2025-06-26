'use client';

import OrderTable from '@/app/manage/orders/order-table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Suspense, useState } from 'react';
import {
  ShoppingCart,
  Clock,
  CheckCircle,
  DollarSign,
  TrendingUp,
  Calendar,
  Filter,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useGetOrderListQuery } from '@/queries/useOrder';
import { GetOrdersResType } from '@/schemaValidations/order.schema';

export default function OrdersPage() {
  const [orderList, setOrderList] = useState<GetOrdersResType['data']>([]);
  console.log(orderList);
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Quản lý đơn hàng
            </h1>
            <p className="text-muted-foreground">
              Theo dõi và quản lý tất cả đơn hàng trong hệ thống
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date().toLocaleDateString('vi-VN')}
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng đơn hàng
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground group-hover:text-orange-600 transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orderList.length}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{orderList.length - 12}</span>{' '}
                so với tuần trước
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đang xử lý</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground group-hover:text-yellow-600 transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {orderList.filter((order) => order.status === 'Pending').length}
              </div>
              <p className="text-xs text-muted-foreground">Cần chú ý xử lý</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hoàn thành</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground group-hover:text-green-600 transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {orderList.filter((order) => order.status === 'Paid').length}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8%</span> so với tuần trước
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                  minimumFractionDigits: 0,
                }).format(
                  orderList.reduce(
                    (acc, order) => acc + order.dishSnapshot.price,
                    0,
                  ),
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+15%</span> so với tuần trước
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Filters and Actions */}
        <Card className="border-0 shadow-sm bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-orange-600" />
                <span className="font-medium text-orange-700 dark:text-orange-300">
                  Bộ lọc và thao tác
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Real-time updates
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card className="overflow-hidden border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Danh sách đơn hàng</CardTitle>
                <CardDescription className="text-orange-100">
                  Quản lý và theo dõi tất cả đơn hàng
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-orange-100">Live updates</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Suspense
              fallback={
                <div className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-100 to-red-100 rounded-full mb-4">
                    <ShoppingCart className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Đang tải dữ liệu...
                  </h3>
                  <p className="text-muted-foreground">
                    Vui lòng chờ trong giây lát
                  </p>
                </div>
              }
            >
              <OrderTable setOrderList={setOrderList} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
