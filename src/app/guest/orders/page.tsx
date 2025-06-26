import OrdersCart from '@/app/guest/orders/orders-cart';

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4">
            <span className="text-3xl">📋</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Đơn hàng của bạn
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Theo dõi trạng thái đơn hàng và lịch sử mua hàng của bạn
          </p>
        </div>

        {/* Orders Content */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 overflow-hidden">
          <OrdersCart />
        </div>
      </div>
    </div>
  );
}
