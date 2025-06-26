'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useDishListQuery } from '@/queries/useDish';
import { cn, formatCurrency, handleErrorApi } from '@/lib/utils';
import Quantity from '@/app/guest/menu/quantity';
import { useMemo, useState } from 'react';
import { GuestCreateOrdersBodyType } from '@/schemaValidations/guest.schema';
import { useGuestOrderMutation } from '@/queries/useGuest';
import { useRouter } from 'next/navigation';
import { DishStatus } from '@/constants/type';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Clock, Star } from 'lucide-react';

export default function MenuOrder() {
  const { data } = useDishListQuery();
  const dishes = useMemo(() => data?.payload.data ?? [], [data]);
  const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([]);
  const { mutateAsync } = useGuestOrderMutation();
  const router = useRouter();

  const totalPrice = useMemo(() => {
    return dishes.reduce((result, dish) => {
      const order = orders.find((order) => order.dishId === dish.id);
      if (!order) return result;
      return result + order.quantity * dish.price;
    }, 0);
  }, [dishes, orders]);

  const handleQuantityChange = (dishId: number, quantity: number) => {
    setOrders((prevOrders) => {
      if (quantity === 0) {
        return prevOrders.filter((order) => order.dishId !== dishId);
      }
      const index = prevOrders.findIndex((order) => order.dishId === dishId);
      if (index === -1) {
        return [...prevOrders, { dishId, quantity }];
      }
      const newOrders = [...prevOrders];
      newOrders[index] = { ...newOrders[index], quantity };
      return newOrders;
    });
  };

  const handleOrder = async () => {
    try {
      await mutateAsync(orders);
      router.push(`/guest/orders`);
    } catch (error) {
      handleErrorApi({
        error,
      });
    }
  };

  const availableDishes = dishes.filter(
    (dish) => dish.status !== DishStatus.Hidden,
  );
  const unavailableDishes = dishes.filter(
    (dish) => dish.status === DishStatus.Unavailable,
  );

  return (
    <div className="p-6 space-y-8">
      {/* Available Dishes */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <h2 className="text-xl font-semibold">Món ăn có sẵn</h2>
          <Badge variant="secondary" className="ml-auto">
            {availableDishes.length} món
          </Badge>
        </div>

        <div className="grid gap-4">
          {availableDishes.map((dish) => (
            <Card
              key={dish.id}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 relative">
                    <Image
                      src={dish.image}
                      alt={dish.name}
                      height={120}
                      width={120}
                      quality={100}
                      className="object-cover w-[120px] h-[120px] rounded-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    {dish.status === DishStatus.Unavailable && (
                      <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          Hết hàng
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold group-hover:text-orange-600 transition-colors duration-300">
                        {dish.name}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {dish.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-2xl font-bold text-orange-600">
                          {formatCurrency(dish.price)}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>15-20 phút</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>4.8</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <Quantity
                          onChange={(value) =>
                            handleQuantityChange(dish.id, value)
                          }
                          value={
                            orders.find((order) => order.dishId === dish.id)
                              ?.quantity ?? 0
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Unavailable Dishes */}
      {unavailableDishes.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
            <h2 className="text-xl font-semibold">Tạm hết hàng</h2>
            <Badge variant="destructive" className="ml-auto">
              {unavailableDishes.length} món
            </Badge>
          </div>

          <div className="grid gap-4">
            {unavailableDishes.map((dish) => (
              <Card key={dish.id} className="opacity-60">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 relative">
                      <Image
                        src={dish.image}
                        alt={dish.name}
                        height={120}
                        width={120}
                        quality={100}
                        className="object-cover w-[120px] h-[120px] rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          Hết hàng
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold">{dish.name}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {dish.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold text-orange-600">
                          {formatCurrency(dish.price)}
                        </p>
                        <Badge variant="destructive">Tạm hết</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Order Summary */}
      <div className="sticky bottom-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 -mx-6 -mb-6 p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShoppingCart className="w-4 h-4" />
              <span>{orders.length} món đã chọn</span>
            </div>
            <p className="text-2xl font-bold text-orange-600">
              {formatCurrency(totalPrice)}
            </p>
          </div>
          <Button
            size="lg"
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8"
            onClick={handleOrder}
            disabled={orders.length === 0}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Đặt hàng ngay
          </Button>
        </div>
      </div>
    </div>
  );
}
