import { motion } from "motion/react";
import { Coffee, Clock, CheckCircle2, ChevronRight } from "lucide-react";

interface MealReminderCardProps {
  onConfirm: () => void;
  onViewMealDetails?: () => void;
}

export function MealReminderCard({ onConfirm, onViewMealDetails }: MealReminderCardProps) {
  // 模拟代餐提醒数据
  const mealReminder = {
    mealType: "早餐代餐",
    productName: "轻盈代餐奶昔（香草味）",
    scheduledTime: "08:00",
    calories: 180,
    protein: 15,
    isCompleted: false,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ marginBottom: "16px" }}
    >
      {/* 代餐提醒卡片 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: "#FFFFFF",
          border: "1px solid rgba(234, 235, 255, 0.8)",
          padding: "24px",
          borderRadius: "24px",
          maxWidth: "600px",
          width: "100%",
          boxShadow: "0 4px 20px rgba(251, 146, 60, 0.05)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* 标题栏 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                background: "#FB923C",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Coffee
                style={{
                  width: "24px",
                  height: "24px",
                  color: "#FFFFFF",
                }}
              />
            </div>
            <div>
              <h3
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  fontSize: "16px",
                  lineHeight: "24px",
                  color: "#1A1A1A",
                  margin: 0,
                }}
              >
                {mealReminder.mealType}提醒
              </h3>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "4px",
                }}
              >
                <Clock
                  style={{
                    width: "12px",
                    height: "12px",
                    color: "#FB923C",
                  }}
                />
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "12px",
                    lineHeight: "16px",
                    color: "#FB923C",
                    fontWeight: 500,
                  }}
                >
                  建议时间：{mealReminder.scheduledTime}
                </span>
              </div>
            </div>
          </div>

          {/* 状态标识 */}
          {mealReminder.isCompleted ? (
            <div
              style={{
                background: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                borderRadius: "16px",
                padding: "6px 12px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <CheckCircle2
                style={{
                  width: "14px",
                  height: "14px",
                  color: "#10B981",
                }}
              />
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "12px",
                  lineHeight: "16px",
                  color: "#10B981",
                  fontWeight: 500,
                }}
              >
                已完成
              </span>
            </div>
          ) : (
            <div
              style={{
                background: "rgba(251, 146, 60, 0.1)",
                border: "1px solid rgba(251, 146, 60, 0.2)",
                borderRadius: "16px",
                padding: "6px 12px",
              }}
            >
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "12px",
                  lineHeight: "16px",
                  color: "#FB923C",
                  fontWeight: 500,
                }}
              >
                待食用
              </span>
            </div>
          )}
        </div>

        {/* 产品信息 */}
        <div
          style={{
            padding: "16px",
            background: "#EAEBFF",
            borderRadius: "16px",
            marginBottom: "24px",
          }}
        >
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              lineHeight: "20px",
              fontWeight: 600,
              color: "#1A1A1A",
              marginBottom: "16px",
              margin: 0,
            }}
          >
            📦 {mealReminder.productName}
          </p>

          {/* 营养信息 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "16px",
              marginTop: "16px",
            }}
          >
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: "16px",
                padding: "16px",
                border: "1px solid rgba(251, 146, 60, 0.15)",
              }}
            >
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "12px",
                  lineHeight: "16px",
                  color: "#8A8A93",
                  margin: 0,
                  marginBottom: "8px",
                }}
              >
                热量
              </p>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "20px",
                  fontWeight: 600,
                  lineHeight: "24px",
                  color: "#FB923C",
                  margin: 0,
                }}
              >
                {mealReminder.calories}
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    marginLeft: "4px",
                  }}
                >
                  kcal
                </span>
              </p>
            </div>

            <div
              style={{
                background: "#FFFFFF",
                borderRadius: "16px",
                padding: "16px",
                border: "1px solid rgba(251, 146, 60, 0.15)",
              }}
            >
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "12px",
                  lineHeight: "16px",
                  color: "#8A8A93",
                  margin: 0,
                  marginBottom: "8px",
                }}
              >
                蛋白质
              </p>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "20px",
                  fontWeight: 600,
                  lineHeight: "24px",
                  color: "#FB923C",
                  margin: 0,
                }}
              >
                {mealReminder.protein}
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    marginLeft: "4px",
                  }}
                >
                  g
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* 提示信息 */}
        <div
          style={{
            padding: "16px",
            background: "#EAEBFF",
            borderRadius: "16px",
            marginBottom: "24px",
          }}
        >
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              lineHeight: "16px",
              color: "#8A8A93",
              margin: 0,
            }}
          >
            💡 建议搭配300ml温水食用，可增强饱腹感
          </p>
        </div>

        {/* 操作按钮 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <button
            onClick={onConfirm}
            style={{
              padding: "12px 48px",
              background: "#2B5BFF",
              borderRadius: "16px",
              border: "none",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: "14px",
              lineHeight: "20px",
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
              e.currentTarget.style.boxShadow =
                "0 6px 24px rgba(43, 91, 255, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 20px rgba(43, 91, 255, 0.2)";
            }}
          >
            <CheckCircle2
              style={{
                width: "16px",
                height: "16px",
              }}
            />
            已食用，记录打卡
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}