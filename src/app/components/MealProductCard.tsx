import { motion } from "motion/react";
import { ShoppingCart, Package, Star, Check } from "lucide-react";

interface MealProductCardProps {
  onViewDetails?: () => void;
}

export function MealProductCard({ onViewDetails }: MealProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl p-4 shadow-lg"
      style={{
        background:
          "linear-gradient(112.53deg, rgba(202, 215, 255, 0.8) -1.64%, rgba(41, 73, 255, 0.24) 97.1%)",
        borderRadius: "16px",
      }}
    >
      {/* 推荐标签 */}
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "6px 12px",
        background: "rgba(43, 91, 255, 0.08)",
        borderRadius: "4px",
        marginBottom: "16px",
      }}>
        <Star className="w-4 h-4" style={{ color: "#2B5BFF", fill: "#2B5BFF" }} />
        <span style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 600,
          fontSize: "12px",
          color: "#2B5BFF",
        }}>
          营养师推荐
        </span>
      </div>

      {/* 内部白色渐变卡片 */}
      <div
        className="rounded-xl p-4"
        style={{
          background:
            "linear-gradient(180deg, rgba(241, 245, 255, 0.8) 0%, #FFFFFF 100%)",
          border: "1px solid #FFFFFF",
          borderRadius: "13px",
        }}
      >
        {/* 标题 */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "24px",
        }}>
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "16px",
            background: "rgba(43, 91, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Package className="w-6 h-6" style={{ color: "#2B5BFF" }} />
          </div>
          <div>
            <h3 style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: "18px",
              color: "#1A1A1A",
              marginBottom: "4px",
            }}>
              代餐营养套装
            </h3>
            <p style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              color: "#8A8A93",
              margin: 0,
            }}>
              30天全营养代餐方案
            </p>
          </div>
        </div>

        {/* 产品图片（模拟） */}
        <div style={{
          background: "#EAEBFF",
          borderRadius: "16px",
          padding: "32px",
          marginBottom: "24px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            fontSize: "64px",
            marginBottom: "8px",
          }}>
            🥤
          </div>
          <div style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: "16px",
            color: "#1A1A1A",
          }}>
            高蛋白代餐奶昔
          </div>
          <div style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "13px",
            color: "#8A8A93",
            marginTop: "8px",
          }}>
            多种口味 · 营养均衡
          </div>
        </div>

        {/* 产品特点 */}
        <div style={{
          background: "#EAEBFF",
          borderRadius: "16px",
          padding: "16px",
          marginBottom: "24px",
        }}>
          <h4 style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: "14px",
            color: "#1A1A1A",
            marginBottom: "16px",
          }}>
            产品特点
          </h4>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}>
            {[
              "每份含20g优质蛋白，饱腹感持久",
              "富含26种维生素和矿物质",
              "低GI配方，平稳血糖",
            ].map((feature, index) => (
              <div key={index} style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}>
                <div style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: "rgba(43, 91, 255, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <Check className="w-3 h-3" style={{ color: "#2B5BFF" }} />
                </div>
                <span style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "13px",
                  color: "#1A1A1A",
                }}>
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 价格和查看详情 */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
        }}>
          <div>
            <div style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "12px",
              color: "#8A8A93",
              marginBottom: "4px",
            }}>
              套餐价格
            </div>
            <div style={{
              display: "flex",
              alignItems: "baseline",
              gap: "8px",
            }}>
              <span style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontSize: "28px",
                color: "#2B5BFF",
              }}>
                ¥899
              </span>
              <span style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                color: "#8A8A93",
                textDecoration: "line-through",
              }}>
                ¥1299
              </span>
            </div>
          </div>
          <button
            onClick={onViewDetails}
            style={{
              flex: 1,
              maxWidth: "200px",
              padding: "14px 24px",
              background: "#2B5BFF",
              border: "none",
              borderRadius: "16px",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: "15px",
              color: "#FFFFFF",
              boxShadow: "0 4px 20px rgba(43, 91, 255, 0.2)",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 24px rgba(43, 91, 255, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(43, 91, 255, 0.2)";
            }}
          >
            <ShoppingCart className="w-5 h-5" />
            查看详情
          </button>
        </div>
      </div>
    </motion.div>
  );
}