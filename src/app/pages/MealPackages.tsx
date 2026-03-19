import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, CheckCircle2, ShoppingBag, FileText, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { PaymentModal } from "../components/PaymentModal";

interface MealPackage {
  id: string;
  name: string;
  duration: string;
  originalPrice: number;
  salePrice: number;
  savings: number;
  features: string[];
  isRecommended?: boolean;
}

export default function MealPackages() {
  const navigate = useNavigate();
  const [selectedPackageId, setSelectedPackageId] = useState<string>("30day");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [purchasedPackages, setPurchasedPackages] = useState<string[]>([]);

  // 套餐数据
  const packages: MealPackage[] = [
    {
      id: "30day",
      name: "30天套餐",
      duration: "30天",
      originalPrice: 1299,
      salePrice: 899,
      savings: 400,
      features: [
        "30份代餐营养餐",
        "科学配比，均衡营养",
        "专业营养师在线指导",
        "每日饮食计划定制",
        "48小时内快速配送"
      ],
      isRecommended: true
    },
    {
      id: "60day",
      name: "60天套餐",
      duration: "60天",
      originalPrice: 2399,
      salePrice: 1699,
      savings: 700,
      features: [
        "60份代餐营养餐",
        "科学配比，均衡营养",
        "专业营养师在线指导",
        "每日饮食计划定制",
        "48小时内快速配送",
        "赠送智能体脂秤"
      ]
    },
    {
      id: "90day",
      name: "90天套餐",
      duration: "90天",
      originalPrice: 3399,
      salePrice: 2299,
      savings: 1100,
      features: [
        "90份代餐营养餐",
        "科学配比，均衡营养",
        "专业营养师在线指导",
        "每日饮食计划定制",
        "48小时内快速配送",
        "赠送智能体脂秤",
        "赠送运动指导课程"
      ]
    }
  ];

  const selectedPackage = packages.find(pkg => pkg.id === selectedPackageId);

  const handlePurchase = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    if (selectedPackage) {
      setPurchasedPackages([...purchasedPackages, selectedPackage.id]);
    }
    setShowPaymentModal(false);
  };

  return (
    <div 
      className="min-h-screen pb-24" 
      style={{ 
        backgroundColor: "#FAFAFF",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* 模糊渐变背景层 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        {/* Vector 1 - 浅蓝紫色 */}
        <div
          className="absolute"
          style={{
            width: "246.5px",
            height: "398px",
            left: "0px",
            top: "0px",
            background: "#B3B7FF",
            filter: "blur(150px)",
            opacity: 1
          }}
        />
        
        {/* Vector 2 - 浅蓝色 */}
        <div
          className="absolute"
          style={{
            width: "399.5px",
            height: "216.5px",
            left: "0px",
            top: "659.5px",
            background: "#C5D8FF",
            filter: "blur(100px)",
            opacity: 1
          }}
        />
        
        {/* Ellipse 1 - 浅橙色 (左下) */}
        <div
          className="absolute"
          style={{
            width: "223px",
            height: "223px",
            left: "-125px",
            top: "548px",
            background: "#FFE3CB",
            opacity: 0.9,
            filter: "blur(150px)",
            borderRadius: "50%"
          }}
        />
        
        {/* Ellipse 2 - 浅橙色 (中间偏右) */}
        <div
          className="absolute"
          style={{
            width: "132px",
            height: "132px",
            left: "243px",
            top: "293px",
            background: "#FFE3CB",
            opacity: 0.9,
            filter: "blur(100px)",
            borderRadius: "50%"
          }}
        />
      </div>

      {/* 顶部导航 */}
      <div className="bg-white border-b border-gray-200 px-3 py-3 flex items-center justify-between sticky top-0 z-10" style={{ position: "relative", zIndex: 10 }}>
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-semibold">营养套餐</h1>
        <button
          onClick={() => navigate('/orders')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FileText className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-md mx-auto px-3 py-4 space-y-4" style={{ position: "relative", zIndex: 1 }}>
        {/* 顶部说明 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl"
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(43, 91, 255, 0.1)"
          }}
        >
          <h2
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: "16px",
              lineHeight: "20px",
              color: "#131142",
              marginBottom: "8px"
            }}
          >
            💡 为什么选择代餐营养套餐？
          </h2>
          <p
            style={{
              fontFamily: "PingFang SC, sans-serif",
              fontSize: "14px",
              lineHeight: "20px",
              color: "#7F88AA"
            }}
          >
            科学配比的营养素，帮助您在控制热量的同时，保证身体所需的各类营养元素，让减重过程更健康、更高效。
          </p>
        </motion.div>

        {/* 套餐列表 */}
        <div className="space-y-3">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.1 }}
              onClick={() => setSelectedPackageId(pkg.id)}
              className="p-5 rounded-2xl cursor-pointer relative overflow-hidden"
              style={{
                background: "#FFFFFF",
                border: selectedPackageId === pkg.id
                  ? "2px solid #2B5BFF"
                  : "2px solid #FFFFFF",
                borderRadius: "20px",
                transition: "all 0.3s ease",
                boxShadow: selectedPackageId === pkg.id
                  ? "0 4px 20px rgba(43, 91, 255, 0.15)"
                  : "0 2px 8px rgba(0, 0, 0, 0.05)"
              }}
            >
              {/* 推荐标签 */}
              {pkg.isRecommended && (
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    left: "12px",
                    background: "linear-gradient(92.12deg, #FF6B6B 0%, #FF4D4F 100%)",
                    padding: "4px 12px",
                    borderRadius: "12px",
                    fontFamily: "PingFang SC, sans-serif",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#FFFFFF",
                    zIndex: 1
                  }}
                >
                  💰 最划算
                </div>
              )}

              {/* 产品图片和基本信息 */}
              <div className="flex items-start gap-4 mb-3">
                {/* 产品图片 */}
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "16px",
                    overflow: "hidden",
                    flexShrink: 0,
                    background: "rgba(43, 91, 255, 0.05)"
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1717398804938-f008d162d7f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwbWVhbCUyMHNoYWtlJTIwc21vb3RoaWV8ZW58MXx8fHwxNzczNzE2NTMwfDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt={pkg.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                </div>

                {/* 名称和选择按钮 */}
                <div className="flex-1 flex items-start justify-between">
                  <div>
                    <h3
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 700,
                        fontSize: "20px",
                        lineHeight: "24px",
                        color: "#131142",
                        marginBottom: "4px"
                      }}
                    >
                      {pkg.name}
                    </h3>
                    <p
                      style={{
                        fontFamily: "PingFang SC, sans-serif",
                        fontSize: "13px",
                        color: "#7F88AA"
                      }}
                    >
                      {pkg.duration}科学营养管理
                    </p>
                  </div>
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      border: selectedPackageId === pkg.id
                        ? "7px solid #2B5BFF"
                        : "2px solid #D1D5DB",
                      background: "#FFFFFF",
                      flexShrink: 0
                    }}
                  />
                </div>
              </div>

              {/* 价格信息 */}
              <div className="flex items-baseline gap-2 mb-4">
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 700,
                    fontSize: "28px",
                    lineHeight: "32px",
                    color: "#2B5BFF"
                  }}
                >
                  ¥{pkg.salePrice}
                </span>
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "15px",
                    color: "#8A8A93",
                    textDecoration: "line-through"
                  }}
                >
                  ¥{pkg.originalPrice}
                </span>
                <span
                  className="px-2 py-0.5 rounded"
                  style={{
                    background: "rgba(255, 77, 79, 0.1)",
                    fontFamily: "PingFang SC, sans-serif",
                    fontSize: "12px",
                    color: "#FF4D4F",
                    fontWeight: 600
                  }}
                >
                  省¥{pkg.savings}
                </span>
              </div>

              {/* 特性列表 - 只在选中时显示 */}
              {selectedPackageId === pkg.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2 pt-3"
                  style={{
                    borderTop: "1px solid rgba(43, 91, 255, 0.1)"
                  }}
                >
                  {pkg.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2
                        className="w-4 h-4"
                        style={{ color: "#2B5BFF" }}
                      />
                      <span
                        style={{
                          fontFamily: "PingFang SC, sans-serif",
                          fontSize: "13px",
                          color: "#7F88AA"
                        }}
                      >
                        {feature}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* 合规说明 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="p-4 rounded-2xl"
          style={{
            background: "rgba(16, 185, 129, 0.06)",
            border: "1px solid rgba(16, 185, 129, 0.1)"
          }}
        >
          <h3
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: "14px",
              color: "#10B981",
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <CheckCircle2 className="w-4 h-4" />
            合规保障
          </h3>
          <ul
            style={{
              fontFamily: "PingFang SC, sans-serif",
              fontSize: "13px",
              color: "#7F88AA",
              lineHeight: "20px",
              paddingLeft: "20px"
            }}
          >
            <li>✓ 所有产品均通过国家食品安全认证</li>
            <li>✓ 由专业营养师团队研发配方</li>
            <li>✓ 符合中国居民膳食指南标准</li>
            <li>✓ 7天无理由退换货保障</li>
          </ul>
        </motion.div>
      </div>

      {/* 底部购买按钮 */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-200 z-20">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <div className="flex-1">
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "12px",
                color: "#8A8A93",
                marginBottom: "2px"
              }}
            >
              合计
            </div>
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontSize: "24px",
                color: "#2B5BFF"
              }}
            >
              ¥{selectedPackage?.salePrice}
            </div>
          </div>
          <button
            onClick={handlePurchase}
            className="flex-1 py-3 rounded-full text-center font-semibold flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(92.12deg, #6574FF 6.98%, #3923FF 100.39%)",
              borderRadius: "36px",
              fontFamily: "Inter, sans-serif",
              fontSize: "16px",
              color: "#FFFFFF",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(43, 91, 255, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <ShoppingBag className="w-5 h-5" />
            立即购买
          </button>
        </div>
      </div>

      {/* 支付弹窗 */}
      {selectedPackage && (
        <PaymentModal
          isOpen={showPaymentModal}
          amount={selectedPackage.salePrice}
          productName={selectedPackage.name}
          productDesc={`${selectedPackage.duration}科学营养管理`}
          productImage="🥤"
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}