/* eslint-disable @next/next/no-img-element */
import dishApiRequest from '@/apiRequests/dish';
import { formatCurrency } from '@/lib/utils';
import { DishListResType } from '@/schemaValidations/dish.schema';
import Image from 'next/image';
import { Star, Clock, Users, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default async function Home() {
  let dishList: DishListResType['data'] = [];
  try {
    const result = await dishApiRequest.list();
    const {
      payload: { data },
    } = result;
    dishList = data;
  } catch (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="text-6xl">😔</div>
          <h2 className="text-2xl font-semibold">Something went wrong</h2>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-0">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-red-500/20 to-yellow-500/20"></div>
        <Image
          src="/banner.png"
          fill
          quality={100}
          alt="Restaurant Banner"
          className="object-cover -z-10"
          priority
        />

        {/* Content */}
        <div className="relative z-10 text-center space-y-8 px-4 max-w-4xl mx-auto">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-yellow-600 bg-clip-text text-transparent animate-in slide-in-from-bottom-4 duration-1000">
              Nhà hàng Big Boy
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 font-medium animate-in slide-in-from-bottom-4 duration-1000 delay-200">
              Vị ngon, trọn khoảnh khắc
            </p>
            <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto animate-in slide-in-from-bottom-4 duration-1000 delay-300">
              Khám phá hương vị ẩm thực độc đáo với những món ăn được chế biến
              từ nguyên liệu tươi ngon nhất
              <br />
              Admin account: admin@order.com
              <br />
              Password: 123456
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 pt-8 animate-in slide-in-from-bottom-4 duration-1000 delay-400">
            <div className="flex flex-col items-center space-y-2 text-white/90">
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <Star className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium">4.8/5</span>
              <span className="text-xs text-white/70">Đánh giá</span>
            </div>
            <div className="flex flex-col items-center space-y-2 text-white/90">
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <Clock className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium">15-20 phút</span>
              <span className="text-xs text-white/70">Thời gian</span>
            </div>
            <div className="flex flex-col items-center space-y-2 text-white/90">
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <Users className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium">100+</span>
              <span className="text-xs text-white/70">Khách hàng</span>
            </div>
            <div className="flex flex-col items-center space-y-2 text-white/90">
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <MapPin className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium">Miễn phí</span>
              <span className="text-xs text-white/70">Giao hàng</span>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Đa dạng các món ăn
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Khám phá menu phong phú với những món ăn được chế biến từ công
              thức độc quyền
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dishList.map((dish, index) => (
              <Card
                key={dish.id}
                className="group overflow-hidden hover:shadow-xl transition-all hover:-translate-y-2 animate-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={
                      dish.image.startsWith('/static') ||
                      dish.image.startsWith('http://localhost:4000/static')
                        ? dish.image.replace(
                            /^\/static|^http:\/\/localhost:4000\/static/,
                            'https://big-boy-food-server.onrender.com/static',
                          )
                        : dish.image
                    }
                    width={400}
                    height={300}
                    alt={dish.name}
                    className="object-cover w-full h-48 group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <CardContent className="p-6 space-y-3">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold group-hover:text-orange-600 transition-colors duration-300">
                      {dish.name}
                    </h3>
                    <p className="text-muted-foreground line-clamp-2 leading-relaxed">
                      {dish.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-2xl font-bold text-orange-600">
                      {formatCurrency(dish.price)}
                    </span>
                    <Link
                      href={`/tables/2?token=667f3b1ce5e4429990dacea1809d20e7&gidzl=jRhNGBA5e4Yqfjv7ivkeJxYbq4-aown7zFFH7F_7g16l_z9FhPQgJ_wjqKRvnFj6_llI6cCo3KyujO2fJW`}
                    >
                      {' '}
                      <Button
                        size="sm"
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        Đặt ngay
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-r from-orange-600 to-red-600">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Sẵn sàng thưởng thức?
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Đặt bàn ngay hôm nay và trải nghiệm hương vị ẩm thực tuyệt vời tại
            Big Boy
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/tables/2?token=667f3b1ce5e4429990dacea1809d20e7&gidzl=jRhNGBA5e4Yqfjv7ivkeJxYbq4-aown7zFFH7F_7g16l_z9FhPQgJ_wjqKRvnFj6_llI6cCo3KyujO2fJW`}
            >
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-6"
              >
                Đặt bàn ngay
              </Button>
            </Link>

            <Link
              href={`/tables/2?token=667f3b1ce5e4429990dacea1809d20e7&gidzl=jRhNGBA5e4Yqfjv7ivkeJxYbq4-aown7zFFH7F_7g16l_z9FhPQgJ_wjqKRvnFj6_llI6cCo3KyujO2fJW`}
            >
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-orange-600"
              >
                Xem menu đầy đủ
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
