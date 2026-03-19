import { useNavigate } from "react-router";
import { ArrowLeft, Flame, Activity as ActivityIcon, RefreshCw, Edit2, Package, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

export default function Plan() {
  const navigate = useNavigate();

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
        <h1 className="font-semibold">干预方案</h1>
        <div className="w-9" />
      </div>

      <div className="max-w-md mx-auto px-3 py-4 space-y-3" style={{ position: "relative", zIndex: 1 }}>
        {/* 顶部标题区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 700,
                  fontSize: "24px",
                  lineHeight: "26px",
                  color: "#131142"
                }}
              >
                轻盈计划
              </h2>
              <p 
                className="mt-2"
                style={{
                  fontFamily: "PingFang SC, sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
                  lineHeight: "20px",
                  color: "#131142"
                }}
              >
                定制化体重管理方案· 预计3个月达成目标
              </p>
            </div>
            <button
              style={{
                fontFamily: "PingFang SC, sans-serif",
                fontWeight: 600,
                fontSize: "15px",
                lineHeight: "21px",
                color: "#131142"
              }}
            >
              重新定制
            </button>
          </div>

          {/* 标签区域 */}
          <div className="flex items-center gap-2 mb-4">
            <span 
              className="px-3 py-1 rounded-full"
              style={{
                border: "1px solid #F0F2FF",
                opacity: 0.4,
                borderRadius: "6px",
                fontFamily: "PingFang SC, sans-serif",
                fontSize: "11px",
                lineHeight: "12px",
                color: "#3F2DFF"
              }}
            >
              待执行·第0天
            </span>
          </div>

          <div className="flex gap-2">
            <div 
              className="px-3 py-1.5 rounded-full flex items-center gap-1"
              style={{
                background: "rgba(211, 214, 255, 0.6)",
                borderRadius: "20px"
              }}
            >
              <div 
                className="w-3 h-3 rounded"
                style={{ background: "#4539FF" }}
              />
              <span 
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  fontSize: "10px",
                  lineHeight: "12px",
                  color: "#6A77A7"
                }}
              >
                90天计划
              </span>
            </div>
            <div 
              className="px-3 py-1.5 rounded-full flex items-center gap-1"
              style={{
                background: "rgba(211, 214, 255, 0.6)",
                borderRadius: "20px"
              }}
            >
              <div 
                className="w-3 h-3 rounded"
                style={{ background: "#4539FF" }}
              />
              <span 
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  fontSize: "10px",
                  lineHeight: "12px",
                  color: "#6A77A7"
                }}
              >
                三甲医生定制计划
              </span>
            </div>
          </div>
        </motion.div>

        {/* 你的管理目标 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 
            className="mb-3"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: "15px",
              lineHeight: "18px",
              color: "#131142"
            }}
          >
            你的管理目标
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {/* 每天热量摄入卡片 */}
            <div 
              className="p-4 rounded-2xl"
              style={{
                background: "#FFFFFF",
                border: "1px solid #FFFFFF",
                borderRadius: "20px 13px 13px 13px"
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Flame className="w-5 h-5" style={{ color: "#DE7740" }} />
                <span 
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 500,
                    fontSize: "14px",
                    lineHeight: "17px",
                    color: "#000000"
                  }}
                >
                  每天热量摄入
                </span>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span 
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 700,
                    fontSize: "22px",
                    lineHeight: "27px",
                    color: "#000000"
                  }}
                >
                  1000-1500
                </span>
                <span 
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 400,
                    fontSize: "13px",
                    lineHeight: "16px",
                    color: "#000000"
                  }}
                >
                  千卡
                </span>
              </div>
              <p 
                style={{
                  fontFamily: "PingFang SC, sans-serif",
                  fontWeight: 400,
                  fontSize: "13px",
                  lineHeight: "18px",
                  color: "#7F88AA"
                }}
              >
                碳水、蛋白质、脂肪的摄入比例建议2:1:1
              </p>
            </div>

            {/* 每周运动量卡片 */}
            <div 
              className="p-4 rounded-2xl"
              style={{
                background: "#FFFFFF",
                border: "1px solid #FFFFFF",
                borderRadius: "20px 13px 13px 13px"
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <ActivityIcon className="w-5 h-5" style={{ color: "#6472FF" }} />
                <span 
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 500,
                    fontSize: "14px",
                    lineHeight: "17px",
                    color: "#000000"
                  }}
                >
                  每周运动量
                </span>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span 
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 600,
                    fontSize: "22px",
                    lineHeight: "27px",
                    color: "#000000"
                  }}
                >
                  150-180
                </span>
                <span 
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 400,
                    fontSize: "13px",
                    lineHeight: "16px",
                    color: "#000000"
                  }}
                >
                  分钟
                </span>
              </div>
              <p 
                style={{
                  fontFamily: "PingFang SC, sans-serif",
                  fontWeight: 400,
                  fontSize: "13px",
                  lineHeight: "18px",
                  color: "#7F88AA"
                }}
              >
                每周运动频次5次，减重之路，每一步都算数。
              </p>
            </div>
          </div>
        </motion.div>

        {/* 你的目标体重 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-5 rounded-2xl"
          style={{
            background: "#FFFFFF",
            border: "1px solid #FFFFFF",
            borderRadius: "20px 13px 13px 13px"
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span 
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "17px",
                color: "#000000"
              }}
            >
              你的目标体重
            </span>
            <div className="flex items-center gap-2">
              <span 
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 700,
                  fontSize: "22px",
                  lineHeight: "27px",
                  color: "#000000"
                }}
              >
                68KG
              </span>
              <Edit2 className="w-5 h-5" style={{ color: "#514FFF" }} />
            </div>
          </div>
          <p 
            style={{
              fontFamily: "PingFang SC, sans-serif",
              fontWeight: 400,
              fontSize: "13px",
              lineHeight: "18px",
              color: "#7F88AA"
            }}
          >
            您的原始体重80KG，您需要在此基础上减重10KG
          </p>
        </motion.div>

        {/* 营养师推荐套餐入口 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.175 }}
          onClick={() => navigate('/meal-packages')}
          className="p-5 rounded-2xl cursor-pointer"
          style={{
            background: "linear-gradient(135deg, rgba(43, 91, 255, 0.08) 0%, rgba(101, 116, 255, 0.08) 100%)",
            border: "1px solid rgba(43, 91, 255, 0.2)",
            borderRadius: "20px 13px 13px 13px",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 20px rgba(43, 91, 255, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: "rgba(43, 91, 255, 0.1)"
                }}
              >
                <Package className="w-6 h-6" style={{ color: "#2B5BFF" }} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span 
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 600,
                      fontSize: "16px",
                      lineHeight: "19px",
                      color: "#131142"
                    }}
                  >
                    营养师推荐套餐
                  </span>
                  <span
                    className="px-2 py-0.5 rounded"
                    style={{
                      border: "1px solid #FF4D4F",
                      opacity: 0.9,
                      borderRadius: "4px",
                      fontFamily: "PingFang SC, sans-serif",
                      fontSize: "10px",
                      lineHeight: "14px",
                      color: "#FF4D4F",
                    }}
                  >
                    可选配
                  </span>
                </div>
                <p 
                  style={{
                    fontFamily: "PingFang SC, sans-serif",
                    fontWeight: 400,
                    fontSize: "13px",
                    lineHeight: "18px",
                    color: "#7F88AA"
                  }}
                >
                  科学配比营养素，更高效达成目标
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5" style={{ color: "#2B5BFF" }} />
          </div>
        </motion.div>

        {/* 饮食食谱推荐 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-2xl"
          style={{
            background: "#FFFFFF",
            border: "1px solid #FFFFFF",
            borderRadius: "20px 13px 13px 13px"
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                fontSize: "15px",
                lineHeight: "18px",
                color: "#000000"
              }}
            >
              饮食食谱推荐
            </h3>
            <button className="flex items-center gap-1">
              <span 
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: "15px",
                  lineHeight: "18px",
                  color: "#514FFF"
                }}
              >
                换一份食谱
              </span>
              <RefreshCw className="w-4 h-4" style={{ color: "#514FFF" }} />
            </button>
          </div>

          <div className="space-y-5">
            {/* 早餐 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full" style={{ border: "2px solid #FF8EDD" }} />
                  <span 
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 700,
                      fontSize: "18px",
                      lineHeight: "22px",
                      color: "#000000"
                    }}
                  >
                    早餐
                  </span>
                </div>
                <span 
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 700,
                    fontSize: "15px",
                    lineHeight: "18px",
                    color: "#4A4A4A"
                  }}
                >
                  31%能量； 547kcal
                </span>
              </div>
              <p 
                className="pl-7"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  fontSize: "15px",
                  lineHeight: "18px",
                  color: "#7F88AA"
                }}
              >
                燕麦粥、冬枣、全脂纯牛奶
              </p>
            </div>

            {/* 午餐 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full" style={{ border: "2px solid #4326FF" }} />
                  <span 
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 700,
                      fontSize: "18px",
                      lineHeight: "22px",
                      color: "#000000"
                    }}
                  >
                    午餐
                  </span>
                </div>
                <span 
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 700,
                    fontSize: "15px",
                    lineHeight: "18px",
                    color: "#4A4A4A"
                  }}
                >
                  31%能量； 547kcal
                </span>
              </div>
              <p 
                className="pl-7"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  fontSize: "15px",
                  lineHeight: "18px",
                  color: "#7F88AA"
                }}
              >
                五谷养生饭、浇汁豆腐、凉拌马齿菜
              </p>
            </div>

            {/* 晚餐 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full" style={{ border: "2px solid #41D6FF" }} />
                  <span 
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 700,
                      fontSize: "18px",
                      lineHeight: "22px",
                      color: "#000000"
                    }}
                  >
                    晚餐
                  </span>
                </div>
                <span 
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 700,
                    fontSize: "15px",
                    lineHeight: "18px",
                    color: "#4A4A4A"
                  }}
                >
                  31%能量； 547kcal
                </span>
              </div>
              <p 
                className="pl-7"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  fontSize: "15px",
                  lineHeight: "18px",
                  color: "#7F88AA"
                }}
              >
                香甜玉米饭、清水蒸鸡、凉拌莴笋丝
              </p>
            </div>
          </div>
        </motion.div>

        {/* 运动计划 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="p-5 rounded-2xl"
          style={{
            background: "#FFFFFF",
            border: "1px solid #FFFFFF",
            borderRadius: "20px 13px 13px 13px"
          }}
        >
          <h3 
            className="mb-5"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: "15px",
              lineHeight: "18px",
              color: "#000000"
            }}
          >
            运动计划
          </h3>

          <div className="space-y-6">
            {/* 有氧运动 */}
            <div>
              <h4 
                className="mb-2"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 700,
                  fontSize: "18px",
                  lineHeight: "22px",
                  color: "#000000"
                }}
              >
                有氧运动
              </h4>
              <div className="space-y-1">
                <p 
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 400,
                    fontSize: "15px",
                    lineHeight: "18px",
                    color: "#7F88AA"
                  }}
                >
                  频次：每周5次
                </p>
                <p 
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 400,
                    fontSize: "15px",
                    lineHeight: "18px",
                    color: "#7F88AA"
                  }}
                >
                  时长：30-40分钟/次
                </p>
                <p 
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 400,
                    fontSize: "15px",
                    lineHeight: "18px",
                    color: "#7F88AA"
                  }}
                >
                  推荐：快走、慢跑、游泳、骑行
                </p>
              </div>
            </div>

            {/* 力量训练 */}
            <div>
              <h4 
                className="mb-2"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 700,
                  fontSize: "18px",
                  lineHeight: "22px",
                  color: "#000000"
                }}
              >
                力量训练
              </h4>
              <div className="space-y-1">
                <p 
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 400,
                    fontSize: "15px",
                    lineHeight: "18px",
                    color: "#7F88AA"
                  }}
                >
                  频次：每周5次
                </p>
                <p 
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 400,
                    fontSize: "15px",
                    lineHeight: "18px",
                    color: "#7F88AA"
                  }}
                >
                  时长：30-40分钟/次
                </p>
                <p 
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 400,
                    fontSize: "15px",
                    lineHeight: "18px",
                    color: "#7F88AA"
                  }}
                >
                  推荐：深蹲、平板支撑、哑铃训练
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 底部开启计划按钮 */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-200 z-20">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => navigate('/', { state: { planActivated: true } })}
            className="w-full py-3 rounded-full text-center font-semibold"
            style={{
              background: "linear-gradient(92.12deg, #6574FF 6.98%, #3923FF 100.39%)",
              borderRadius: "36px",
              fontFamily: "Inter, sans-serif",
              fontSize: "15px",
              lineHeight: "18px",
              color: "#FBFBFB"
            }}
          >
            开启计划
          </button>
        </div>
      </div>
    </div>
  );
}