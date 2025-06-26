import accountApiRequest from '@/apiRequests/account';
import { cookies } from 'next/headers';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  Utensils,
  ShoppingCart,
  TrendingUp,
  Clock,
  Star,
  Calendar,
  DollarSign,
} from 'lucide-react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

export default async function Dashboard() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken')?.value!;
  let name = '';
  try {
    const result = await accountApiRequest.sMe(accessToken);
    name = result.payload.data.name;
  } catch (error: any) {
    if (error.digest?.includes('NEXT_REDIRECT')) {
      throw error;
    }
  }

  // Mock data for demonstration - in real app, fetch from API
  const stats = {
    totalOrders: 10,
    totalRevenue: 28450000,
    totalCustomers: 20,
    totalDishes: 3,
    pendingOrders: 2,
    completedOrders: 1,
    averageRating: 4.8,
    monthlyGrowth: 12.5,
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Chào mừng trở lại, {name}!
            </h1>
            <p className="text-muted-foreground mt-2">
              Đây là tổng quan về hoạt động của nhà hàng hôm nay
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date().toLocaleDateString('vi-VN')}
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground group-hover:text-orange-600 transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{stats.monthlyGrowth}%</span> so
              với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground group-hover:text-green-600 transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
                minimumFractionDigits: 0,
              }).format(stats.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.2%</span> so với tuần trước
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khách hàng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12</span> khách hàng mới
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Món ăn</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground group-hover:text-purple-600 transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDishes}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+3</span> món mới thêm
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              Trạng thái đơn hàng
            </CardTitle>
            <CardDescription>
              Tổng quan về các đơn hàng trong ngày
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium">Hoàn thành</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">{stats.completedOrders}</div>
                <div className="text-sm text-muted-foreground">đơn hàng</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="font-medium">Đang xử lý</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">{stats.pendingOrders}</div>
                <div className="text-sm text-muted-foreground">đơn hàng</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Satisfaction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Đánh giá khách hàng
            </CardTitle>
            <CardDescription>Mức độ hài lòng của khách hàng</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-yellow-500">
                {stats.averageRating}
              </div>
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.floor(stats.averageRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Dựa trên {stats.totalCustomers} đánh giá
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="font-bold text-blue-600">95%</div>
                <div className="text-xs text-muted-foreground">Hài lòng</div>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="font-bold text-green-600">88%</div>
                <div className="text-xs text-muted-foreground">Quay lại</div>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="font-bold text-purple-600">92%</div>
                <div className="text-xs text-muted-foreground">Giới thiệu</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Thao tác nhanh</CardTitle>
          <CardDescription>Các chức năng thường dùng</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/manage/orders">
              <Button
                variant="outline"
                className="h-20 flex-col gap-2 w-[20vw]"
              >
                <ShoppingCart className="h-6 w-6" />
                <span className="text-sm">Xem đơn hàng</span>
              </Button>
            </Link>

            <Link href="/manage/tables">
              <Button
                variant="outline"
                className="h-20 flex-col gap-2 w-[20vw]"
              >
                <Utensils className="h-6 w-6" />
                <span className="text-sm">Số lượng bàn ăn</span>
              </Button>
            </Link>

            <Link href="/manage/dishes">
              <Button
                variant="outline"
                className="h-20 flex-col gap-2 w-[20vw]"
              >
                <Users className="h-6 w-6" />
                <span className="text-sm">Xem món ăn</span>
              </Button>
            </Link>

            <Link href="/manage/accounts">
              <Button
                variant="outline"
                className="h-20 flex-col gap-2 w-[20vw]"
              >
                <Clock className="h-6 w-6" />
                <span className="text-sm">Quản lý nhân viên</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
