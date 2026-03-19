import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingCart, Package, Star, Check, ChevronRight } from "lucide-react";

interface MealProduct {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  price: number;
  originalPrice: number;
  duration: string;
  features: string[];
  recommended?: boolean;
}

interface MealServiceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProductClick: (product: MealProduct) => void;
}

const mealProducts: MealProduct[] = [
  {
    id: "1",
    name: "轻盈套餐",
    subtitle: "30天全营养代餐方案",
    icon: "🥤",
    price: 899,
    originalPrice: 1299,
    duration: "30天",
    features: [
      "每份含20g优质蛋白，饱腹感持久",
      "富含26种维生素和矿物质",
      "低GI配方，平稳血糖",
    ],
    recommended: true,
  },
  {
    id: "2",
    name: "轻体套餐",
    subtitle: "14天快速启动方案",
    icon: "🥗",
    price: 499,
    originalPrice: 699,
    duration: "14天",
    features: [
      "适合初次尝试代餐人群",
      "科学配比，营养均衡",
      "便携包装，随时随地",
    ],
  },
  {
    id: "3",
    name: "塑形套餐",
    subtitle: "60天持续管理方案",
    icon: "💪",
    price: 1599,
    originalPrice: 2399,
    duration: "60天",
    features: [
      "超值优惠，平均每天26元",
      "持续管理，效果更佳",
      "赠送体重管理课程",
    ],
  },
  {
    id: "4",
    name: "营养棒套装",
    subtitle: "便携能量补充",
    icon: "🍫",
    price: 299,
    originalPrice: 399,
    duration: "15支装",
    features: [
      "高蛋白低糖配方",
      "随时补充能量",
      "多种口味可选",
    ],
  },
];

export function MealServiceDrawer({ isOpen, onClose, onProductClick }: MealServiceDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 遮罩层 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
            style={{ backdropFilter: "blur(4px)" }}
          />

          {/* 抽屉内容 */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl"
            style={{
              maxHeight: "85vh",
              background: "linear-gradient(180deg, #FAFAFF 0%, #FFFFFF 100%)",
            }}
          >
            {/* 拖动指示器 */}
            <div className="flex justify-center pt-3 pb-2">
              <div
                style={{
                  width: "40px",
                  height: "4px",
                  backgroundColor: "#E5E5E5",
                  borderRadius: "2px",
                }}
              />
            </div>

            {/* 头部 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold" style={{ color: "#1A1A1A" }}>
                  代餐服务
                </h2>
                <p className="text-sm mt-1" style={{ color: "#8A8A93" }}>
                  科学配比，营养均衡
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" style={{ color: "#8A8A93" }} />
              </button>
            </div>

            {/* 产品列表 */}
            <div
              className="overflow-y-auto px-6 py-4"
              style={{
                maxHeight: "calc(85vh - 120px)",
              }}
            >
              <div className="space-y-4">
                {mealProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => onProductClick(product)}
                    className="rounded-2xl p-4 cursor-pointer transition-all"
                    style={{
                      background: product.recommended
                        ? "linear-gradient(112.53deg, rgba(202, 215, 255, 0.8) -1.64%, rgba(41, 73, 255, 0.24) 97.1%)"
                        : "rgba(250, 250, 255, 0.5)",
                      border: product.recommended ? "2px solid #EAEBFF" : "1px solid #F0F0F0",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 8px 24px rgba(43, 91, 255, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {/* 推荐标签 */}
                    {product.recommended && (
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "4px 10px",
                          background: "rgba(43, 91, 255, 0.1)",
                          borderRadius: "6px",
                          marginBottom: "12px",
                        }}
                      >
                        <Star className="w-3.5 h-3.5" style={{ color: "#2B5BFF", fill: "#2B5BFF" }} />
                        <span
                          style={{
                            fontWeight: 600,
                            fontSize: "11px",
                            color: "#2B5BFF",
                          }}
                        >
                          营养师推荐
                        </span>
                      </div>
                    )}

                    <div className="flex items-start gap-4">
                      {/* 产品图标 */}
                      <div
                        className="flex-shrink-0"
                        style={{
                          width: "64px",
                          height: "64px",
                          borderRadius: "16px",
                          background: "rgba(43, 91, 255, 0.08)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "32px",
                        }}
                      >
                        {product.icon}
                      </div>

                      {/* 产品信息 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3
                              className="font-semibold"
                              style={{
                                fontSize: "16px",
                                color: "#1A1A1A",
                                marginBottom: "4px",
                              }}
                            >
                              {product.name}
                            </h3>
                            <p
                              style={{
                                fontSize: "12px",
                                color: "#8A8A93",
                              }}
                            >
                              {product.subtitle}
                            </p>
                          </div>
                          <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: "#8A8A93" }} />
                        </div>

                        {/* 产品特点（只显示第一条） */}
                        <div className="mb-3">
                          <div className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#2B5BFF" }} />
                            <span
                              style={{
                                fontSize: "12px",
                                color: "#666666",
                              }}
                            >
                              {product.features[0]}
                            </span>
                          </div>
                        </div>

                        {/* 价格和时长 */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-baseline gap-2">
                            <span
                              style={{
                                fontWeight: 700,
                                fontSize: "24px",
                                color: "#2B5BFF",
                              }}
                            >
                              ¥{product.price}
                            </span>
                            <span
                              style={{
                                fontSize: "13px",
                                color: "#8A8A93",
                                textDecoration: "line-through",
                              }}
                            >
                              ¥{product.originalPrice}
                            </span>
                          </div>
                          <div
                            style={{
                              padding: "4px 12px",
                              background: "rgba(43, 91, 255, 0.08)",
                              borderRadius: "8px",
                              fontSize: "12px",
                              fontWeight: 600,
                              color: "#2B5BFF",
                            }}
                          >
                            {product.duration}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* 底部提示 */}
              <div
                className="mt-6 p-4 rounded-xl"
                style={{
                  background: "rgba(43, 91, 255, 0.05)",
                  border: "1px solid rgba(43, 91, 255, 0.1)",
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 text-xl">💡</div>
                  <div>
                    <p className="font-semibold mb-1" style={{ fontSize: "13px", color: "#1A1A1A" }}>
                      温馨提示
                    </p>
                    <p style={{ fontSize: "12px", color: "#666666", lineHeight: "1.5" }}>
                      代餐产品需配合运动和健康生活方式使用，建议在营养师指导下选择适合您的方案。
                    </p>
                  </div>
                </div>
              </div>

              {/* 底部安全距离 */}
              <div style={{ height: "24px" }} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
