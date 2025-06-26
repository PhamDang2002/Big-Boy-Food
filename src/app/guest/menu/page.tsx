import MenuOrder from '@/app/guest/menu/menu-order';

export default async function MenuPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4">
            <span className="text-3xl">🍕</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Menu Quán
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Khám phá hương vị ẩm thực độc đáo với những món ăn được chế biến từ
            nguyên liệu tươi ngon nhất
          </p>
        </div>

        {/* Menu Content */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 overflow-hidden">
          <MenuOrder />
        </div>
      </div>
    </div>
  );
}
