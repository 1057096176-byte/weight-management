import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingCart, Check, Package, Truck, Shield } from "lucide-react";

interface MealProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: () => void;
}

export function MealProductDetailModal({ isOpen, onClose, onPurchase }: MealProductDetailModalProps) {
  const [selectedPackage, setSelectedPackage] = useState<"30day" | "60day" | "90day">("30day");

  const packages = {
    "30day": {
      name: "30天套餐",
      price: 899,
      originalPrice: 1299,
      items: "代餐奶昔 × 30袋 + 能量棒 × 15根",
      saving: 400,
    },
    "60day": {
      name: "60天套餐",
      price: 1599,
      originalPrice: 2598,
      items: "代餐奶昔 × 60袋 + 能量棒 × 30根 + 膳食纤维粉 × 1罐",
      saving: 999,
    },
    "90day": {
      name: "90天套餐",
      price: 2199,
      originalPrice: 3897,
      items: "代餐奶昔 × 90袋 + 能量棒 × 45根 + 膳食纤维粉 × 2罐",
      saving: 1698,
    },
  };

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
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(4px)",
              zIndex: 999,
            }}
          />

          {/* 抽屉内容 - 从底部弹出 */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              maxHeight: "90vh",
              backgroundColor: "#FFFFFF",
              borderTopLeftRadius: "24px",
              borderTopRightRadius: "24px",
              boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.1)",
              zIndex: 1000,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* 拖拽指示器 */}
            <div style={{
              padding: "12px 0",
              display: "flex",
              justifyContent: "center",
            }}>
              <div style={{
                width: "40px",
                height: "4px",
                borderRadius: "2px",
                background: "#D1D5DB",
              }} />
            </div>

            {/* 头部 */}
            <div style={{
              padding: "0 24px 16px",
              borderBottom: "1px solid #EAEBFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <h2 style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontSize: "20px",
                color: "#1A1A1A",
                margin: 0,
              }}>
                代餐营养套装
              </h2>
              <button
                onClick={onClose}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  border: "none",
                  background: "#EAEBFF",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(43, 91, 255, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#EAEBFF";
                }}
              >
                <X className="w-5 h-5" style={{ color: "#8A8A93" }} />
              </button>
            </div>

            {/* 内容区 - 可滚动 */}
            <div style={{
              flex: 1,
              overflowY: "auto",
              padding: "24px",
            }}>
              {/* 产品图片 */}
              <div style={{
                background: "#EAEBFF",
                borderRadius: "16px",
                padding: "40px",
                textAlign: "center",
                marginBottom: "24px",
              }}>
                <div style={{ fontSize: "80px", marginBottom: "8px" }}>🥤</div>
                <div style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  fontSize: "18px",
                  color: "#1A1A1A",
                  marginBottom: "8px",
                }}>
                  高蛋白代餐奶昔
                </div>
                <div style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  color: "#8A8A93",
                }}>
                  科学配比 · 营养均衡 · 轻松控重
                </div>
              </div>

              {/* 套餐选择 */}
              <div style={{ marginBottom: "24px" }}>
                <h3 style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  fontSize: "16px",
                  color: "#1A1A1A",
                  marginBottom: "16px",
                }}>
                  选择套餐
                </h3>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}>
                  {Object.entries(packages).map(([key, pkg]) => (
                    <div
                      key={key}
                      onClick={() => setSelectedPackage(key as any)}
                      style={{
                        padding: "16px",
                        borderRadius: "16px",
                        border: selectedPackage === key
                          ? "2px solid #2B5BFF"
                          : "2px solid #EAEBFF",
                        background: selectedPackage === key
                          ? "rgba(43, 91, 255, 0.04)"
                          : "#FFFFFF",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        position: "relative",
                      }}
                    >
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}>
                          <div style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            border: selectedPackage === key
                              ? "6px solid #2B5BFF"
                              : "2px solid #D1D5DB",
                            background: "#FFFFFF",
                          }} />
                          <span style={{
                            fontFamily: "Inter, sans-serif",
                            fontWeight: 600,
                            fontSize: "15px",
                            color: "#1A1A1A",
                          }}>
                            {pkg.name}
                          </span>
                        </div>
                        {pkg.saving > 0 && (
                          <div style={{
                            padding: "4px 8px",
                            borderRadius: "4px",
                            background: "#2B5BFF",
                            fontFamily: "Inter, sans-serif",
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "#FFFFFF",
                          }}>
                            省¥{pkg.saving}
                          </div>
                        )}
                      </div>
                      <div style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "13px",
                        color: "#8A8A93",
                        marginBottom: "8px",
                        paddingLeft: "28px",
                      }}>
                        {pkg.items}
                      </div>
                      <div style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: "8px",
                        paddingLeft: "28px",
                      }}>
                        <span style={{
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 700,
                          fontSize: "24px",
                          color: "#2B5BFF",
                        }}>
                          ¥{pkg.price}
                        </span>
                        <span style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "14px",
                          color: "#8A8A93",
                          textDecoration: "line-through",
                        }}>
                          ¥{pkg.originalPrice}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 产品详情 */}
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
                    "0添加蔗糖，天然甜味",
                    "便捷冲调，随时随地享用",
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

              {/* 服务承诺 */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "8px",
                marginBottom: "24px",
              }}>
                <div style={{
                  padding: "16px",
                  borderRadius: "16px",
                  background: "rgba(43, 91, 255, 0.04)",
                  textAlign: "center",
                }}>
                  <Truck className="w-6 h-6" style={{
                    color: "#2B5BFF",
                    margin: "0 auto 8px",
                  }} />
                  <div style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#1A1A1A",
                  }}>
                    48h配送
                  </div>
                </div>
                <div style={{
                  padding: "16px",
                  borderRadius: "16px",
                  background: "rgba(43, 91, 255, 0.04)",
                  textAlign: "center",
                }}>
                  <Shield className="w-6 h-6" style={{
                    color: "#2B5BFF",
                    margin: "0 auto 8px",
                  }} />
                  <div style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#1A1A1A",
                  }}>
                    正品保证
                  </div>
                </div>
                <div style={{
                  padding: "16px",
                  borderRadius: "16px",
                  background: "rgba(43, 91, 255, 0.04)",
                  textAlign: "center",
                }}>
                  <Package className="w-6 h-6" style={{
                    color: "#2B5BFF",
                    margin: "0 auto 8px",
                  }} />
                  <div style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#1A1A1A",
                  }}>
                    7天退换
                  </div>
                </div>
              </div>
            </div>

            {/* 底部购买按钮 - 固定在底部 */}
            <div style={{
              padding: "16px 24px 32px",
              borderTop: "1px solid #EAEBFF",
              background: "#FFFFFF",
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}>
                <div>
                  <div style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "12px",
                    color: "#8A8A93",
                    marginBottom: "4px",
                  }}>
                    应付金额
                  </div>
                  <div style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 700,
                    fontSize: "28px",
                    color: "#2B5BFF",
                  }}>
                    ¥{packages[selectedPackage].price}
                  </div>
                </div>
                <button
                  onClick={onPurchase}
                  style={{
                    padding: "14px 32px",
                    background: "#2B5BFF",
                    border: "none",
                    borderRadius: "16px",
                    cursor: "pointer",
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 600,
                    fontSize: "16px",
                    color: "#FFFFFF",
                    boxShadow: "0 4px 20px rgba(43, 91, 255, 0.2)",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
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
                  立即购买
                </button>
              </div>
              <div style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "12px",
                color: "#8A8A93",
                textAlign: "center",
              }}>
                支付成功后48小时内配送到家
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
