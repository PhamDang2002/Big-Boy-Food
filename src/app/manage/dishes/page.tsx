'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import DishTable from '@/app/manage/dishes/dish-table';
import { Suspense, useState } from 'react';
import {
  Utensils,
  DollarSign,
  TrendingUp,
  Calendar,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  ChefHat,
  Star,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DishListResType } from '@/schemaValidations/dish.schema';

export default function DishesPage() {
  const [dishList, setDishList] = useState<DishListResType['data']>([]);
  console.log(dishList);
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Quản lý món ăn
            </h1>
            <p className="text-muted-foreground">
              Quản lý menu và thông tin tất cả món ăn trong nhà hàng
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
              <CardTitle className="text-sm font-medium">Tổng món ăn</CardTitle>
              <Utensils className="h-4 w-4 text-muted-foreground group-hover:text-orange-600 transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dishList.length}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+5</span> món mới thêm
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Đang phục vụ
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground group-hover:text-green-600 transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {dishList.filter((dish) => dish.status === 'Available').length}
              </div>
              <p className="text-xs text-muted-foreground">87% tỷ lệ phục vụ</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tạm ngưng</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground group-hover:text-yellow-600 transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {
                  dishList.filter((dish) => dish.status === 'Unavailable')
                    .length
                }
              </div>
              <p className="text-xs text-muted-foreground">
                Món tạm thời ngưng
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Giá trung bình
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {dishList.reduce((acc, dish) => acc + dish.price, 0)}
              </div>
              <p className="text-xs text-muted-foreground">VND/món</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Actions and Filters */}
        <Card className="border-0 shadow-sm bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-orange-600" />
                <span className="font-medium text-orange-700 dark:text-orange-300">
                  Quản lý menu
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  <ChefHat className="w-3 h-3 mr-1" />
                  Menu đa dạng
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Star className="w-3 h-3 mr-1" />
                  Chất lượng cao
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dishes Management */}
        <Card className="overflow-hidden border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Danh sách món ăn</CardTitle>
                <CardDescription className="text-orange-100">
                  Quản lý thông tin và trạng thái từng món ăn
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-orange-100">Real-time menu</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Suspense
              fallback={
                <div className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-100 to-red-100 rounded-full mb-4">
                    <Utensils className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Đang tải menu...
                  </h3>
                  <p className="text-muted-foreground">
                    Vui lòng chờ trong giây lát
                  </p>
                </div>
              }
            >
              <DishTable setDishList={setDishList} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
