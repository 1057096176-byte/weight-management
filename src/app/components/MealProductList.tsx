import { useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { ShoppingCart, Star, X } from "lucide-react";

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

interface MealProductListProps {
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

export function MealProductList({ onProductClick }: MealProductListProps) {
  const [selectedProduct, setSelectedProduct] = useState<MealProduct | null>(null);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          background: "#EAEBFF",
          borderRadius: "24px",
          padding: "16px",
        }}
      >
        {/* 顶部标题 */}
        <div
          style={{
            marginBottom: "16px",
          }}
        >
          <h3
            style={{
              fontSize: "16px",
              fontWeight: 500,
              color: "#232F77",
              lineHeight: "19px",
              marginBottom: "4px",
            }}
          >
            🎉 代餐服务套餐
          </h3>
          <p
            style={{
              fontSize: "12px",
              color: "#666666",
              lineHeight: "1.4",
            }}
          >
            科学配比，营养均衡。选择适合您的代餐方案！
          </p>
        </div>

        {/* 产品列表 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {mealProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.08 }}
              style={{
                background: "#FFFFFF",
                border: "1px solid #FFFFFF",
                borderRadius: "13px",
                padding: "12px",
                position: "relative",
              }}
            >
              {/* 推荐标签 */}
              {product.recommended && (
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "4px 8px",
                    background: "rgba(43, 91, 255, 0.1)",
                    borderRadius: "6px",
                  }}
                >
                  <Star className="w-3 h-3" style={{ color: "#2B5BFF", fill: "#2B5BFF" }} />
                  <span
                    style={{
                      fontWeight: 600,
                      fontSize: "10px",
                      color: "#2B5BFF",
                    }}
                  >
                    推荐
                  </span>
                </div>
              )}

              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                {/* 产品图标 */}
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "12px",
                    background: "rgba(43, 91, 255, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "28px",
                    flexShrink: 0,
                  }}
                >
                  {product.icon}
                </div>

                {/* 产品信息 */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: "8px",
                      marginBottom: "6px",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h4
                        style={{
                          fontSize: "15px",
                          fontWeight: 600,
                          color: "#1A1A1A",
                          marginBottom: "2px",
                          lineHeight: "1.2",
                        }}
                      >
                        {product.name}
                      </h4>
                      <p
                        style={{
                          fontSize: "11px",
                          color: "#8A8A93",
                          lineHeight: "1.2",
                        }}
                      >
                        {product.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* 特点 */}
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#666666",
                      lineHeight: "1.4",
                      marginBottom: "8px",
                    }}
                  >
                    {product.features[0]}
                  </p>

                  {/* 价格和购买按钮 */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "baseline", gap: "6px", flex: 1 }}>
                      <span
                        style={{
                          fontSize: "18px",
                          fontWeight: 700,
                          color: "#2B5BFF",
                        }}
                      >
                        ¥{product.price}
                      </span>
                      <span
                        style={{
                          fontSize: "12px",
                          color: "#8A8A93",
                          textDecoration: "line-through",
                        }}
                      >
                        ¥{product.originalPrice}
                      </span>
                      <span
                        style={{
                          fontSize: "10px",
                          color: "#2B5BFF",
                          background: "rgba(43, 91, 255, 0.1)",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          fontWeight: 600,
                        }}
                      >
                        {product.duration}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedProduct(product)}
                      style={{
                        padding: "8px 14px",
                        background: "#2B5BFF",
                        border: "none",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#FFFFFF",
                        boxShadow: "0 2px 8px rgba(43, 91, 255, 0.2)",
                        transition: "all 0.2s",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(43, 91, 255, 0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 2px 8px rgba(43, 91, 255, 0.2)";
                      }}
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      查看详情
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 底部提示 */}
        <div
          style={{
            marginTop: "12px",
            padding: "10px 12px",
            borderRadius: "10px",
            background: "rgba(255, 255, 255, 0.6)",
            border: "1px solid rgba(43, 91, 255, 0.1)",
          }}
        >
          <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
            <div style={{ fontSize: "14px", lineHeight: "1" }}>💡</div>
            <p style={{ fontSize: "11px", color: "#666666", lineHeight: "1.5", margin: 0 }}>
              代餐产品需配合运动和健康生活方式使用，建议在营养师指导下选择适合您的方案。
            </p>
          </div>
        </div>
      </motion.div>

      {/* 商品详情弹窗 - 从底部上滑，使用 Portal 渲染到 body */}
      {selectedProduct &&
        createPortal(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              zIndex: 9999,
            }}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#FFFFFF",
                borderRadius: "24px 24px 0 0",
                width: "100%",
                maxWidth: "600px",
                maxHeight: "85vh",
                overflow: "hidden",
                position: "relative",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* 顶部拖拽指示器 */}
              <div
                style={{
                  padding: "12px 0 8px",
                  display: "flex",
                  justifyContent: "center",
                  background: "#FFFFFF",
                  borderRadius: "24px 24px 0 0",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "4px",
                    borderRadius: "2px",
                    background: "#E5E7EB",
                  }}
                />
              </div>

              {/* 关闭按钮 */}
              <button
                onClick={() => setSelectedProduct(null)}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "rgba(0, 0, 0, 0.05)",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(0, 0, 0, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(0, 0, 0, 0.05)";
                }}
              >
                <X style={{ width: "18px", height: "18px", color: "#666666" }} />
              </button>

              {/* 详情内容 - 可滚动区域 */}
              <div
                style={{
                  padding: "8px 24px 32px",
                  overflowY: "auto",
                  flex: 1,
                  WebkitOverflowScrolling: "touch", // 移动端流畅滚动
                  minHeight: 0, // 确保 flex 子元素可以正确滚动
                }}
              >
                {/* 推荐标签 */}
                {selectedProduct.recommended && (
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "6px 12px",
                      background: "rgba(43, 91, 255, 0.1)",
                      borderRadius: "8px",
                      marginBottom: "16px",
                    }}
                  >
                    <Star className="w-4 h-4" style={{ color: "#2B5BFF", fill: "#2B5BFF" }} />
                    <span
                      style={{
                        fontWeight: 600,
                        fontSize: "12px",
                        color: "#2B5BFF",
                      }}
                    >
                      推荐套餐
                    </span>
                  </div>
                )}

                {/* 产品图标 */}
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "20px",
                    background: "rgba(43, 91, 255, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "48px",
                    marginBottom: "20px",
                  }}
                >
                  {selectedProduct.icon}
                </div>

                {/* 产品名称和副标题 */}
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: 700,
                    color: "#1A1A1A",
                    marginBottom: "8px",
                    lineHeight: "1.2",
                  }}
                >
                  {selectedProduct.name}
                </h2>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#8A8A93",
                    marginBottom: "24px",
                    lineHeight: "1.4",
                  }}
                >
                  {selectedProduct.subtitle}
                </p>

                {/* 价格信息 */}
                <div
                  style={{
                    padding: "20px",
                    background: "rgba(43, 91, 255, 0.05)",
                    borderRadius: "16px",
                    marginBottom: "24px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "8px" }}>
                    <span
                      style={{
                        fontSize: "32px",
                        fontWeight: 700,
                        color: "#2B5BFF",
                      }}
                    >
                      ¥{selectedProduct.price}
                    </span>
                    <span
                      style={{
                        fontSize: "16px",
                        color: "#8A8A93",
                        textDecoration: "line-through",
                      }}
                    >
                      ¥{selectedProduct.originalPrice}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#2B5BFF",
                        background: "rgba(43, 91, 255, 0.15)",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontWeight: 600,
                      }}
                    >
                      {selectedProduct.duration}
                    </span>
                    <span style={{ fontSize: "13px", color: "#666666" }}>
                      立省 ¥{selectedProduct.originalPrice - selectedProduct.price}
                    </span>
                  </div>
                </div>

                {/* 产品特点 */}
                <div style={{ marginBottom: "24px" }}>
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#1A1A1A",
                      marginBottom: "12px",
                    }}
                  >
                    产品特点
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {selectedProduct.features.map((feature, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          gap: "8px",
                          alignItems: "flex-start",
                        }}
                      >
                        <div
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: "#2B5BFF",
                            marginTop: "6px",
                            flexShrink: 0,
                          }}
                        />
                        <p
                          style={{
                            fontSize: "14px",
                            color: "#666666",
                            lineHeight: "1.5",
                            margin: 0,
                          }}
                        >
                          {feature}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 购买按钮 */}
                <button
                  onClick={() => {
                    onProductClick(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  style={{
                    width: "100%",
                    padding: "16px",
                    background: "#2B5BFF",
                    border: "none",
                    borderRadius: "16px",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#FFFFFF",
                    boxShadow: "0 4px 16px rgba(43, 91, 255, 0.3)",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(43, 91, 255, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(43, 91, 255, 0.3)";
                  }}
                >
                  <ShoppingCart className="w-5 h-5" />
                  立即购买
                </button>
              </div>
            </motion.div>
          </motion.div>,
          document.body
        )}
    </>
  );
}