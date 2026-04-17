import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import {
  Calendar,
  ArrowRight,
  Stethoscope,
  RefreshCw,
  Users,
  MessageSquare,
  AlertTriangle,
  QrCode,
  X,
  ShoppingBag,
  CheckCircle2,
} from "lucide-react";
import { UserInfoFormCard } from "./UserInfoFormCard";
import { SurgeryInfoCard } from "./SurgeryInfoCard";
import { MealProductList } from "./MealProductList";

interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  expertise: string;
  avatar: string;
  gradient: string;
}

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  avatar?: string;
  time?: string;
  options?: string[];
  onOptionClick?: (option: string) => void;
  isOptionDisabled?: boolean;
  isCheckinCard?: boolean;
  isTriageCard?: boolean;
  isQuestionCard?: boolean;
  isQuickAccessCard?: boolean;
  isDoctorListCard?: boolean;
  isPlanCard?: boolean;
  isOfflineCard?: boolean;
  isUserInfoFormCard?: boolean;
  isMealProductCard?: boolean;
  isMealProductList?: boolean;
  isHospitalCard?: boolean;
  isSurgeryInfoCard?: boolean;
  onSurgeryInfoSubmit?: (data: { diabetes: boolean; hypertension: boolean; hyperlipidemia: boolean }) => void;
  isSurgeryPredictCard?: boolean;
  surgeryPredictData?: {
    height: number;
    currentWeight: number;
    bmi: number;
    weight3m: number;
    weight6m: number;
    weight1y: number;
    loss1y: number;
    diabetesRate: number;
    bpRate: number;
    lipidRate: number;
  };
  isExpertMode?: boolean;
  citations?: string[];
  isActivated?: boolean; // 计划是否已开启
  quickAccessType?: "all" | "checkin" | "triage" | "doctor";
  questions?: string[];
  onQuestionClick?: (question: string) => void;
  onRefreshQuestions?: () => void;
  onTriageStart?: () => void;
  onTriageAnswer?: (answer: string) => void;
  onUserInfoSubmit?: (data: { phone: string; name: string; height: number; weight: number }) => void;
  highlightUserInfoForm?: boolean;
  onMealProductClick?: (product: any) => void;
  doctors?: Doctor[];
}

export function ChatMessage({
  message,
  isUser,
  avatar,
  time,
  options,
  onOptionClick,
  isOptionDisabled = false,
  isCheckinCard = false,
  isTriageCard = false,
  isQuestionCard = false,
  isQuickAccessCard = false,
  isDoctorListCard = false,
  isPlanCard = false,
  isOfflineCard = false,
  isUserInfoFormCard = false,
  isMealProductCard = false,
  isMealProductList = false,
  isHospitalCard = false,
  isSurgeryInfoCard = false,
  onSurgeryInfoSubmit,
  isSurgeryPredictCard = false,
  surgeryPredictData,
  isExpertMode = false,
  citations,
  isActivated = false, // 计划是否已开启
  quickAccessType,
  questions,
  onQuestionClick,
  onRefreshQuestions,
  onTriageStart,
  onTriageAnswer,
  onUserInfoSubmit,
  highlightUserInfoForm = false,
  onMealProductClick,
  doctors,
}: ChatMessageProps) {
  const [selectedOption, setSelectedOption] = useState<
    string | null
  >(null);
  
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedDoctorQR, setSelectedDoctorQR] = useState<string | null>(null);
  const [showMealProductDetail, setShowMealProductDetail] = useState(false);

  const handleOptionClick = (option: string) => {
    if (isOptionDisabled || selectedOption) return;
    setSelectedOption(option);

    // 如果有导诊回答处理器，优先使用
    if (onTriageAnswer) {
      onTriageAnswer(option);
    } else if (onOptionClick) {
      onOptionClick(option);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4"
    >
      <div
        className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
      >
        {/* 消息内容 */}
        <div
          className={
            isQuestionCard ||
            isTriageCard ||
            isPlanCard ||
            isOfflineCard ||
            isMealProductList
              ? "flex-1"
              : "flex-1 max-w-[70%]"
          }
        >
          {/* 普通文本消息 - 如果有选项，则包裹在卡片中 */}
          {!isTriageCard &&
            !isQuestionCard &&
            !isQuickAccessCard &&
            !isCheckinCard &&
            message &&
            options &&
            options.length > 0 &&
            !isUser && (
              <div
                className="rounded-2xl"
                style={{
                  background: "rgba(255, 255, 255, 0.5)",
                  border: "1px solid rgba(255, 255, 255, 0.8)",
                  borderRadius: "16px",
                  padding: "16px",
                  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.06)",
                }}
              >
                {/* 问题文本 */}
                <div className="mb-3">
                  <p
                    className="text-sm whitespace-pre-line"
                    style={{
                      color: "#131142",
                      fontWeight: 500,
                    }}
                  >
                    {message}
                  </p>
                </div>

                {/* 选项按钮 */}
                <div className="space-y-2">
                  {options.map((option, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleOptionClick(option)}
                      disabled={
                        isOptionDisabled || !!selectedOption
                      }
                      className={`w-full text-left px-4 py-3 rounded-full transition-all ${
                        selectedOption === option
                          ? "shadow-lg"
                          : "hover:shadow-md"
                      }`}
                      style={{
                        fontSize: "15px",
                        fontWeight: 400,
                        lineHeight: "18px",
                        color:
                          selectedOption === option
                            ? "#FFFFFF"
                            : "#131142",
                        background:
                          selectedOption === option
                            ? "linear-gradient(92.12deg, #6574FF 6.98%, #3923FF 100.39%)"
                            : "#FFFFFF",
                        border:
                          selectedOption === option
                            ? "none"
                            : "1px solid rgba(0, 0, 0, 0.05)",
                        cursor:
                          isOptionDisabled || selectedOption
                            ? "default"
                            : "pointer",
                        opacity:
                          isOptionDisabled ||
                          (selectedOption &&
                            selectedOption !== option)
                            ? 0.5
                            : 1,
                      }}
                    >
                      <div className="flex items-center justify-center">
                        {option}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

          {/* 普通文本消息 - 无选项 */}
          {!isTriageCard &&
            !isQuestionCard &&
            !isQuickAccessCard &&
            !isCheckinCard &&
            message &&
            (!options || options.length === 0 || isUser) && (
              <div
                className={`px-4 py-3 ${
                  isUser
                    ? "bg-[#2B5BFF] text-white rounded-tl-2xl rounded-bl-2xl rounded-br-2xl ml-auto"
                    : "bg-white border border-gray-100 rounded-tr-2xl rounded-bl-2xl rounded-br-2xl"
                }`}
                style={{
                  boxShadow: isUser
                    ? "0 2px 8px rgba(43, 91, 255, 0.2)"
                    : "0 2px 8px rgba(0, 0, 0, 0.04)",
                  width: "fit-content",
                  maxWidth: "100%",
                  borderLeft: (!isUser && isExpertMode) ? "3px solid #2B5BFF" : undefined,
                }}
              >
                <p
                  className={`text-sm whitespace-pre-line ${isUser ? "text-white" : "text-gray-800"}`}
                >
                  {message}
                </p>
                {/* 专家模式引用块 */}
                {isExpertMode && citations && citations.length > 0 && (
                  <div style={{ marginTop: "12px", borderTop: "1px solid #E8EAFF", paddingTop: "10px" }}>
                    <p style={{ fontSize: "11px", color: "#8A8A93", marginBottom: "6px", fontWeight: 500 }}>📚 参考来源</p>
                    {citations.map((c, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "6px", marginBottom: "4px" }}>
                        <span style={{
                          fontSize: "10px", fontWeight: 600, color: "#2B5BFF",
                          background: "#EAEBFF", borderRadius: "3px",
                          padding: "1px 5px", flexShrink: 0, marginTop: "1px",
                        }}>[{i + 1}]</span>
                        <span style={{ fontSize: "11px", color: "#6B7280", lineHeight: "1.5" }}>{c}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          {/* 用户信息表单卡片 */}
          {isUserInfoFormCard && onUserInfoSubmit && time && (
            <UserInfoFormCard onSubmit={onUserInfoSubmit} time={time} highlight={highlightUserInfoForm} />
          )}

          {isSurgeryInfoCard && onSurgeryInfoSubmit && (
            <SurgeryInfoCard onSubmit={onSurgeryInfoSubmit} />
          )}

          {/* 代餐产品列表 */}
          {isMealProductList && onMealProductClick && (
            <MealProductList onProductClick={onMealProductClick} />
          )}

          {/* 手术效果预测卡片 */}
          {isSurgeryPredictCard && surgeryPredictData && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              style={{
                marginTop: "12px",
                background: "#FFFFFF",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              {/* 头部 */}
              <div style={{ background: "linear-gradient(135deg, #2B5BFF 0%, #7B5BFF 100%)", padding: "16px" }}>
                <p style={{ margin: 0, fontSize: "13px", color: "rgba(255,255,255,0.8)" }}>基于您的数据</p>
                <p style={{ margin: "4px 0 0", fontSize: "17px", fontWeight: 700, color: "#FFFFFF" }}>手术效果预测报告</p>
                <p style={{ margin: "4px 0 0", fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>
                  身高 {surgeryPredictData.height}cm · 体重 {surgeryPredictData.currentWeight}kg · BMI {surgeryPredictData.bmi}
                </p>
              </div>

              <div style={{ padding: "16px" }}>
                {/* 体重变化时间轴 */}
                <p style={{ margin: "0 0 12px", fontSize: "13px", fontWeight: 600, color: "#1A1A1A" }}>📉 减重预测（袖状胃切除）</p>
                <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", marginBottom: "16px" }}>
                  {[
                    { label: "术前", weight: surgeryPredictData.currentWeight, color: "#E5E7EB", textColor: "#6B7280" },
                    { label: "3个月", weight: surgeryPredictData.weight3m, color: "#BFDBFE", textColor: "#2563EB" },
                    { label: "6个月", weight: surgeryPredictData.weight6m, color: "#93C5FD", textColor: "#1D4ED8" },
                    { label: "1年", weight: surgeryPredictData.weight1y, color: "#2B5BFF", textColor: "#FFFFFF" },
                  ].map((item) => {
                    const maxW = surgeryPredictData.currentWeight;
                    const barH = Math.round((item.weight / maxW) * 80);
                    return (
                      <div key={item.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                        <span style={{ fontSize: "12px", fontWeight: 600, color: "#1A1A1A" }}>{item.weight}kg</span>
                        <div style={{ width: "100%", height: `${barH}px`, background: item.color, borderRadius: "6px 6px 0 0", minHeight: "20px" }} />
                        <span style={{ fontSize: "11px", color: "#9CA3AF" }}>{item.label}</span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ background: "#F0F9FF", borderRadius: "8px", padding: "10px 12px", marginBottom: "16px" }}>
                  <span style={{ fontSize: "13px", color: "#1D4ED8" }}>
                    预计术后1年减重 <strong>{surgeryPredictData.loss1y}kg</strong>，超重体重减少率约 <strong>65–75%</strong>
                  </span>
                </div>

                {/* 代谢改善 */}
                <p style={{ margin: "0 0 10px", fontSize: "13px", fontWeight: 600, color: "#1A1A1A" }}>💊 代谢指标改善预测</p>
                {[
                  { label: "糖尿病缓解", rate: surgeryPredictData.diabetesRate, color: "#10B981" },
                  { label: "高血压改善", rate: surgeryPredictData.bpRate, color: "#3B82F6" },
                  { label: "血脂恢复正常", rate: surgeryPredictData.lipidRate, color: "#8B5CF6" },
                ].map((item) => (
                  <div key={item.label} style={{ marginBottom: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ fontSize: "12px", color: "#6B7280" }}>{item.label}</span>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: item.color }}>{item.rate}%</span>
                    </div>
                    <div style={{ height: "6px", background: "#F3F4F6", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${item.rate}%`, background: item.color, borderRadius: "3px", transition: "width 1s ease" }} />
                    </div>
                  </div>
                ))}

                {/* 免责声明 */}
                <p style={{ margin: "12px 0 0", fontSize: "11px", color: "#9CA3AF", lineHeight: "1.5" }}>
                  ⚠️ 以上预测基于临床统计数据，实际效果因个体差异而异，请以主治医生评估为准。
                </p>
              </div>
            </motion.div>
          )}

          {/* 预约挂号医院卡片 */}
          {isHospitalCard && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              style={{
                marginTop: "12px",
                background: "#FFFFFF",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <a
                href="https://www.srrsh.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", display: "block" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "14px 16px",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#F8F9FF"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  {/* Logo */}
                  <div style={{
                    width: "48px", height: "48px", borderRadius: "50%", flexShrink: 0,
                    overflow: "hidden", background: "#f5f5f5",
                    border: "1px solid rgba(0,0,0,0.08)",
                  }}>
                    <img src="/srrsh-logo.webp" alt="邵逸夫医院" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  </div>

                  {/* 内容 */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* 医院名称 */}
                    <p style={{ margin: "0 0 3px", fontSize: "15px", fontWeight: 600, color: "#1A1A1A", lineHeight: "1.4" }}>
                      浙江大学医学院附属邵逸夫医院
                    </p>
                    {/* 距离 + 地址 */}
                    <p style={{ margin: "0 0 6px", fontSize: "12px", color: "#9CA3AF", lineHeight: "1.4", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      2.3km｜浙江省杭州市江干区庆春东路3号
                    </p>
                    {/* 标签 */}
                    <div style={{ display: "flex", gap: "6px" }}>
                      {["三甲", "综合医院"].map((tag) => (
                        <span key={tag} style={{
                          fontSize: "11px", color: tag === "三甲" ? "#E53935" : "#2B5BFF",
                          background: tag === "三甲" ? "#FFF0F0" : "#EAEBFF",
                          borderRadius: "4px", padding: "1px 6px", lineHeight: "18px",
                        }}>{tag}</span>
                      ))}
                    </div>
                  </div>

                  {/* 箭头 */}
                  <span style={{ fontSize: "16px", color: "#C0C0C8", flexShrink: 0, marginTop: "2px" }}>›</span>
                </div>
              </a>
            </motion.div>
          )}

          {/* 智能导诊入口卡片 */}
          {isTriageCard && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-3"
            >
              <div
                className="transition-all cursor-pointer"
                style={{
                  background: "#EAEBFF",
                  borderRadius: "24px",
                  padding: "16px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(0)";
                }}
              >
                {/* 顶部标题和日期 */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "16px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: 500,
                      color: "#232F77",
                      lineHeight: "19px",
                    }}
                  >
                    邵逸夫在线减重专家
                  </h3>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "rgba(0, 0, 0, 0.3)",
                        lineHeight: "17px",
                      }}
                    >
                      02
                    </div>
                    <div
                      style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        color: "rgba(0, 0, 0, 0.3)",
                        lineHeight: "12px",
                      }}
                    >
                      MAR
                    </div>
                  </div>
                </div>

                {/* 内容纯白区域 */}
                <div
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #FFFFFF",
                    borderRadius: "13px",
                    padding: "16px",
                  }}
                >
                  {/* 服务标签 */}
                  <div
                    style={{
                      display: "inline-block",
                      border: "1px solid #3F2DFF",
                      borderRadius: "6px",
                      padding: "6px 11px",
                      opacity: 0.4,
                      marginBottom: "12px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "11px",
                        lineHeight: "12px",
                        color: "#2B1FCC",
                        fontWeight: 400,
                      }}
                    >
                      服务｜个性化减重方案
                    </span>
                  </div>

                  {/* 主标题 */}
                  <h4
                    style={{
                      fontSize: "20px",
                      fontWeight: 700,
                      color: "#232F77",
                      marginBottom: "16px",
                      lineHeight: "26px",
                    }}
                  >
                    即可定制你的专属减重计划：
                  </h4>

                  {/* 列表 */}
                  <div style={{ marginBottom: "16px" }}>
                    <p
                      style={{
                        fontSize: "13px",
                        lineHeight: "16px",
                        color: "#7F88AA",
                        fontWeight: 400,
                        marginBottom: "6px",
                      }}
                    >
                      基础信息采集
                    </p>
                    <p
                      style={{
                        fontSize: "13px",
                        lineHeight: "16px",
                        color: "#7F88AA",
                        fontWeight: 400,
                        marginBottom: "6px",
                      }}
                    >
                      症状全面评估
                    </p>
                    <p
                      style={{
                        fontSize: "13px",
                        lineHeight: "16px",
                        color: "#7F88AA",
                        fontWeight: 400,
                      }}
                    >
                      健康风险分析
                    </p>
                  </div>

                  {/* 按钮 */}
                  <button
                    className="flex items-center justify-center font-medium"
                    style={{
                      width: "132px",
                      height: "48px",
                      background:
                        "linear-gradient(92.12deg, #6574FF 6.98%, #3923FF 100.39%)",
                      borderRadius: "36px",
                      fontSize: "15px",
                      lineHeight: "18px",
                      color: "#FFFFFF",
                      fontWeight: 600,
                      border: "none",
                      cursor: "pointer",
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onTriageStart?.();
                    }}
                  >
                    开启智能导诊
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* 常见问题卡片 */}
          {isQuestionCard && questions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-1"
            >
              <div>
                <div
                  className="flex flex-col gap-2 px-[17px] py-[0px]"
                  style={{
                    width: "100%",
                    padding: "-10px 17px -10px 17px",
                  }}
                >
                  {questions.map((question, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                      onClick={() => {
                        console.log(
                          "Question clicked:",
                          question,
                        );
                        onQuestionClick?.(question);
                      }}
                      className="text-left transition-all relative flex items-center"
                      style={{
                        display: "inline-flex",
                        width: "fit-content",
                        height: "40px",
                        background:
                          "linear-gradient(180deg, #B6C0FC -168.48%, #FFFFFF 73.91%)",
                        border: "1px solid #FFFFFF",
                        borderRadius: "59px",
                        paddingLeft: "46px",
                        paddingRight: "16px",
                        boxSizing: "border-box",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {/* 左侧蓝色方块图标 */}
                      <div
                        style={{
                          position: "absolute",
                          left: "12px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: "19.22px",
                          height: "19px",
                          background: "#397EFF",
                          border: "1px solid #FFFFFF",
                          borderRadius: "10px 10px 3px 10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxSizing: "border-box",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontWeight: 600,
                            fontSize: "14px",
                            lineHeight: "17px",
                            color: "#FFFFFF",
                          }}
                        >
                          #
                        </span>
                      </div>

                      {/* 问题文本 */}
                      <span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 400,
                          fontSize: "14px",
                          lineHeight: "17px",
                          color: "#000000",
                        }}
                      >
                        {question}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* 快捷入口卡片 */}
          {isQuickAccessCard && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-3"
            >
              <div className="flex flex-col gap-3">
                {(quickAccessType === "checkin" ||
                  quickAccessType === "all") && (
                  <Link to="/checkin" className="block">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="rounded-2xl transition-all cursor-pointer"
                      style={{
                        backgroundColor: "#FFFFFF",
                        padding: "16px",
                        boxShadow:
                          "0 4px 20px rgba(0, 0, 0, 0.05)",
                        border:
                          "1px solid rgba(255, 255, 255, 0.5)",
                      }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                          style={{
                            background:
                              "linear-gradient(135deg, #2B5BFF 0%, #6B8FFF 100%)",
                          }}
                        >
                          <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4
                            style={{
                              fontWeight: 600,
                              fontSize: "15px",
                              color: "#1A1A1A",
                              marginBottom: "2px",
                            }}
                          >
                            打卡中心
                          </h4>
                          <p
                            style={{
                              fontSize: "12px",
                              color: "#8A8A93",
                            }}
                          >
                            记录体重、饮食、运动数据
                          </p>
                        </div>
                      </div>
                      <div
                        className="flex items-center justify-center gap-1 w-full py-2 rounded-xl font-medium"
                        style={{
                          backgroundColor: "#EAEBFF",
                          color: "#2B5BFF",
                          fontSize: "13px",
                        }}
                      >
                        进入
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </motion.div>
                  </Link>
                )}

                {(quickAccessType === "triage" ||
                  quickAccessType === "all") && (
                  <Link to="/triage" className="block">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="rounded-2xl transition-all cursor-pointer"
                      style={{
                        backgroundColor: "#FFFFFF",
                        padding: "16px",
                        boxShadow:
                          "0 4px 20px rgba(0, 0, 0, 0.05)",
                        border:
                          "1px solid rgba(255, 255, 255, 0.5)",
                      }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                          style={{
                            background:
                              "linear-gradient(135deg, #2B5BFF 0%, #6B8FFF 100%)",
                          }}
                        >
                          <Stethoscope className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4
                            style={{
                              fontWeight: 600,
                              fontSize: "15px",
                              color: "#1A1A1A",
                              marginBottom: "2px",
                            }}
                          >
                            智能导诊
                          </h4>
                          <p
                            style={{
                              fontSize: "12px",
                              color: "#8A8A93",
                            }}
                          >
                            评估健康状况，匹配专业方案
                          </p>
                        </div>
                      </div>
                      <div
                        className="flex items-center justify-center gap-1 w-full py-2 rounded-xl font-medium"
                        style={{
                          backgroundColor: "#EAEBFF",
                          color: "#2B5BFF",
                          fontSize: "13px",
                        }}
                      >
                        进入
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </motion.div>
                  </Link>
                )}

                {(quickAccessType === "doctor" ||
                  quickAccessType === "all") && (
                  <Link to="/doctors" className="block">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="rounded-2xl transition-all cursor-pointer"
                      style={{
                        backgroundColor: "#FFFFFF",
                        padding: "16px",
                        boxShadow:
                          "0 4px 20px rgba(0, 0, 0, 0.05)",
                        border:
                          "1px solid rgba(255, 255, 255, 0.5)",
                      }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                          style={{
                            background:
                              "linear-gradient(135deg, #2B5BFF 0%, #6B8FFF 100%)",
                          }}
                        >
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4
                            style={{
                              fontWeight: 600,
                              fontSize: "15px",
                              color: "#1A1A1A",
                              marginBottom: "2px",
                            }}
                          >
                            医生分身
                          </h4>
                          <p
                            style={{
                              fontSize: "12px",
                              color: "#8A8A93",
                            }}
                          >
                            24小时在线问诊，专业指导
                          </p>
                        </div>
                      </div>
                      <div
                        className="flex items-center justify-center gap-1 w-full py-2 rounded-xl font-medium"
                        style={{
                          backgroundColor: "#EAEBFF",
                          color: "#2B5BFF",
                          fontSize: "13px",
                        }}
                      >
                        进入
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </motion.div>
                  </Link>
                )}
              </div>
            </motion.div>
          )}

          {/* 医生列表卡片 */}
          {isDoctorListCard && doctors && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-3"
            >
              <div className="flex flex-col gap-3">
                {doctors.map((doctor, index) => (
                  <Link
                    to={`/doctors/${doctor.id}`}
                    className="block"
                    key={index}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="rounded-2xl transition-all cursor-pointer"
                      style={{
                        backgroundColor: "#FFFFFF",
                        padding: "16px",
                        boxShadow:
                          "0 4px 20px rgba(0, 0, 0, 0.05)",
                        border:
                          "1px solid rgba(255, 255, 255, 0.5)",
                      }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                          style={{
                            background:
                              "linear-gradient(135deg, #2B5BFF 0%, #6B8FFF 100%)",
                          }}
                        >
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4
                            style={{
                              fontWeight: 600,
                              fontSize: "15px",
                              color: "#1A1A1A",
                              marginBottom: "2px",
                            }}
                          >
                            {doctor.name}
                          </h4>
                          <p
                            style={{
                              fontSize: "12px",
                              color: "#8A8A93",
                            }}
                          >
                            {doctor.title}，{doctor.specialty}
                          </p>
                        </div>
                      </div>
                      <div
                        className="flex items-center justify-center gap-1 w-full py-2 rounded-xl font-medium"
                        style={{
                          backgroundColor: "#EAEBFF",
                          color: "#2B5BFF",
                          fontSize: "13px",
                        }}
                      >
                        进入
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* 线上干预方案卡片 */}
          {isPlanCard && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-4 shadow-lg"
              style={{
                background:
                  "linear-gradient(112.53deg, rgba(202, 215, 255, 0.8) -1.64%, rgba(41, 73, 255, 0.24) 97.1%)",
                borderRadius: "16px",
              }}
            >
              {/* 顶部提示 */}
              <p
                className="mb-4"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: "16px",
                  lineHeight: "19px",
                  color: "#344127",
                }}
              >
                已为您定制专属方案：
              </p>

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
                {/* 代餐推荐 - 放在最上面 */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <h4
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 600,
                        fontSize: "15px",
                        lineHeight: "18px",
                        color: "#131142",
                      }}
                    >
                      营养师推荐
                    </h4>
                    <span
                      className="px-2 py-1 rounded"
                      style={{
                        border: "1px solid #FF4D4F",
                        opacity: 0.9,
                        borderRadius: "6px",
                        fontFamily: "PingFang SC, sans-serif",
                        fontSize: "11px",
                        lineHeight: "12px",
                        color: "#FF4D4F",
                      }}
                    >
                      可选配
                    </span>
                  </div>
                  
                  <p
                    className="mb-4"
                    style={{
                      fontFamily: "PingFang SC, sans-serif",
                      fontSize: "13px",
                      lineHeight: "18px",
                      color: "#7F88AA",
                    }}
                  >
                    配合方案使用，科学配比营养素，更高效达成目标
                  </p>
                  
                  {/* 代餐产品卡片 */}
                  <div
                    onClick={() => setShowMealProductDetail(true)}
                    style={{
                      cursor: "pointer",
                      background: "rgba(43, 91, 255, 0.04)",
                      borderRadius: "16px",
                      padding: "16px",
                      border: "1px solid rgba(43, 91, 255, 0.1)",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(43, 91, 255, 0.08)";
                      e.currentTarget.style.borderColor = "rgba(43, 91, 255, 0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(43, 91, 255, 0.04)";
                      e.currentTarget.style.borderColor = "rgba(43, 91, 255, 0.1)";
                    }}
                  >
                    <div style={{
                      display: "flex",
                      gap: "12px",
                      marginBottom: "12px",
                    }}>
                      <div style={{
                        fontSize: "48px",
                        flexShrink: 0,
                      }}>
                        🥤
                      </div>
                      <div style={{ flex: 1 }}>
                        <h5 style={{
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 600,
                          fontSize: "15px",
                          color: "#131142",
                          marginBottom: "4px",
                        }}>
                          代餐营养套装
                        </h5>
                        <p style={{
                          fontFamily: "PingFang SC, sans-serif",
                          fontSize: "13px",
                          color: "#7F88AA",
                          marginBottom: "8px",
                        }}>
                          30天全营养代餐方案
                        </p>
                        <div style={{
                          display: "flex",
                          alignItems: "baseline",
                          gap: "8px",
                        }}>
                          <span style={{
                            fontFamily: "Inter, sans-serif",
                            fontWeight: 700,
                            fontSize: "20px",
                            color: "#2B5BFF",
                          }}>
                            ¥899
                          </span>
                          <span style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "13px",
                            color: "#8A8A93",
                            textDecoration: "line-through",
                          }}>
                            ¥1299
                          </span>
                        </div>
                      </div>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        color: "#2B5BFF",
                      }}>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 分隔线 */}
                <div
                  className="mb-6"
                  style={{
                    width: "100%",
                    height: "1px",
                    background: "#C5D1F8",
                  }}
                />

                {/* 标题和标签 */}
                <div className="flex items-center gap-2 mb-2">
                  <h3
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 700,
                      fontSize: "20px",
                      lineHeight: "26px",
                      color: "#131142",
                    }}
                  >
                    轻盈计划
                  </h3>
                  <span
                    className="px-2.5 py-1.5 rounded"
                    style={{
                      border: "1px solid #6BC25F",
                      opacity: 0.4,
                      borderRadius: "6px",
                      fontFamily: "PingFang SC, sans-serif",
                      fontSize: "11px",
                      lineHeight: "12px",
                      color: "#81B642",
                    }}
                  >
                    轻量级干预
                  </span>
                </div>

                <p
                  className="mb-6"
                  style={{
                    fontFamily: "PingFang SC, sans-serif",
                    fontSize: "13px",
                    lineHeight: "18px",
                    color: "#7F88AA",
                  }}
                >
                  定制化体重管理方案 · 预计3个月达成目标
                </p>

                {/* 能量与体重目标 */}
                <div className="mb-6">
                  <h4
                    className="mb-4"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 600,
                      fontSize: "15px",
                      lineHeight: "18px",
                      color: "#131142",
                    }}
                  >
                    能量与体重目标
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "15px",
                          color: "#7F88AA",
                        }}
                      >
                        目标体重
                      </span>
                      <span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "15px",
                          fontWeight: 500,
                          color: "#000000",
                        }}
                      >
                        68KG
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "15px",
                          color: "#7F88AA",
                        }}
                      >
                        每日目标
                      </span>
                      <span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "15px",
                          fontWeight: 500,
                          color: "#000000",
                        }}
                      >
                        1000-1500kcal
                      </span>
                    </div>
                  </div>
                </div>

                {/* 分隔线 */}
                <div
                  className="mb-6"
                  style={{
                    width: "100%",
                    height: "1px",
                    background: "#C5D1F8",
                  }}
                />

                {/* 营养素分配 */}
                <div className="mb-6">
                  <h4
                    className="mb-4"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 600,
                      fontSize: "15px",
                      lineHeight: "18px",
                      color: "#131142",
                    }}
                  >
                    营养素分配
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "15px",
                          color: "#7F88AA",
                        }}
                      >
                        蛋白质
                      </span>
                      <span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "15px",
                          fontWeight: 500,
                          color: "#000000",
                        }}
                      >
                        30%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "15px",
                          color: "#7F88AA",
                        }}
                      >
                        碳水化合物
                      </span>
                      <span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "15px",
                          fontWeight: 500,
                          color: "#000000",
                        }}
                      >
                        40%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "15px",
                          color: "#7F88AA",
                        }}
                      >
                        脂肪
                      </span>
                      <span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "15px",
                          fontWeight: 500,
                          color: "#000000",
                        }}
                      >
                        30%
                      </span>
                    </div>
                  </div>
                </div>

                {/* 分隔线 */}
                <div
                  className="mb-6"
                  style={{
                    width: "100%",
                    height: "1px",
                    background: "#C5D1F8",
                  }}
                />

                {/* 运动计划 */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <h4
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 600,
                        fontSize: "15px",
                        lineHeight: "18px",
                        color: "#131142",
                      }}
                    >
                      运动���划
                    </h4>
                    <div className="flex gap-1.5">
                      <span
                        className="px-2 py-1 rounded"
                        style={{
                          border: "1px solid #37C8BE",
                          opacity: 0.4,
                          borderRadius: "6px",
                          fontFamily: "PingFang SC, sans-serif",
                          fontSize: "11px",
                          lineHeight: "12px",
                          color: "#37C8BE",
                        }}
                      >
                        有氧
                      </span>
                      <span
                        className="px-2 py-1 rounded"
                        style={{
                          border: "1px solid #6472FF",
                          opacity: 0.4,
                          borderRadius: "6px",
                          fontFamily: "PingFang SC, sans-serif",
                          fontSize: "11px",
                          lineHeight: "12px",
                          color: "#6472FF",
                        }}
                      >
                        力量
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "15px",
                          color: "#7F88AA",
                        }}
                      >
                        每周运动频次
                      </span>
                      <span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "15px",
                          fontWeight: 500,
                          color: "#000000",
                        }}
                      >
                        5次
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "15px",
                          color: "#7F88AA",
                        }}
                      >
                        每周运动时长
                      </span>
                      <span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "15px",
                          fontWeight: 500,
                          color: "#000000",
                        }}
                      >
                        150-180分钟
                      </span>
                    </div>
                  </div>
                </div>

                {/* 底部按钮 */}
                <Link
                  to="/plan"
                  className="block w-full py-3 rounded-full text-center font-semibold"
                  style={{
                    background:
                      "linear-gradient(92.12deg, #6574FF 6.98%, #3923FF 100.39%)",
                    borderRadius: "36px",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "15px",
                    lineHeight: "18px",
                    color: "#FBFBFB",
                  }}
                >
                  {isActivated
                    ? "查看计划详情"
                    : "查看完整方案并开启计划"}
                </Link>
              </div>
            </motion.div>
          )}

          {/* 线下就诊指引卡片 */}
          {isOfflineCard && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-4 shadow-lg"
              style={{
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.8)",
                borderRadius: "24px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div className="flex items-start gap-3 mb-4">
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, #2B5BFF 0%, #6B8FFF 100%)",
                    boxShadow:
                      "0 2px 8px rgba(43, 91, 255, 0.2)",
                  }}
                >
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3
                    className="font-semibold mb-1"
                    style={{
                      fontSize: "16px",
                      lineHeight: "20px",
                      color: "#1A1A1A",
                    }}
                  >
                    建议线下就诊
                  </h3>
                  <p
                    style={{
                      fontSize: "13px",
                      lineHeight: "18px",
                      color: "#8A8A93",
                    }}
                  >
                    根据您的情况评估，建议前往正规医院进行全面检查，获得更专业的医疗评估和指导。
                  </p>
                </div>
              </div>

              {/* 推荐科室 */}
              <div className="space-y-3 mb-3">
                {/* 内分泌科 */}
                <div
                  className="rounded-2xl p-4"
                  style={{
                    background: "#FFFFFF",
                    border:
                      "1px solid rgba(234, 235, 255, 0.5)",
                    borderRadius: "16px",
                    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.04)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "#EAEBFF" }}
                    >
                      <span className="text-xs">🏥</span>
                    </div>
                    <div
                      className="font-semibold"
                      style={{
                        fontSize: "14px",
                        color: "#1A1A1A",
                      }}
                    >
                      首选：内分泌科
                    </div>
                    <span
                      className="ml-auto px-2 py-1"
                      style={{
                        backgroundColor: "#EAEBFF",
                        color: "#2B5BFF",
                        fontSize: "11px",
                        borderRadius: "4px",
                        fontWeight: 500,
                      }}
                    >
                      优先推荐
                    </span>
                  </div>

                  <div
                    className="rounded-xl p-4"
                    style={{
                      background: "rgba(234, 235, 255, 0.3)",
                      border:
                        "1px solid rgba(234, 235, 255, 0.5)",
                      borderRadius: "16px",
                      position: "relative",
                    }}
                  >
                    {/* 二维码按钮 */}
                    <button
                      onClick={() => {
                        setSelectedDoctorQR("张建华");
                        setShowQRModal(true);
                      }}
                      className="absolute top-3 right-3 p-2 rounded-lg transition-all hover:bg-white/50"
                      style={{
                        background: "rgba(255, 255, 255, 0.3)",
                        border: "1px solid rgba(43, 91, 255, 0.2)",
                      }}
                      title="查看医生二维码"
                    >
                      <QrCode
                        style={{
                          width: "16px",
                          height: "16px",
                          color: "#2B5BFF",
                        }}
                      />
                    </button>

                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                        style={{
                          background:
                            "linear-gradient(135deg, #2B5BFF 0%, #6B8FFF 100%)",
                          boxShadow:
                            "0 2px 8px rgba(43, 91, 255, 0.2)",
                          borderRadius: "16px",
                        }}
                      >
                        👨‍⚕️
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4
                            className="font-semibold"
                            style={{
                              fontSize: "15px",
                              color: "#1A1A1A",
                            }}
                          >
                            张建华
                          </h4>
                          <span
                            className="px-2 py-1 font-medium"
                            style={{
                              backgroundColor: "#EAEBFF",
                              color: "#2B5BFF",
                              fontSize: "11px",
                              borderRadius: "4px",
                            }}
                          >
                            主任医师
                          </span>
                        </div>
                        <p
                          className="mb-2"
                          style={{
                            fontSize: "12px",
                            color: "#8A8A93",
                          }}
                        >
                          内分泌科 · 从业28年
                        </p>
                        <p
                          className="leading-relaxed line-clamp-2"
                          style={{
                            fontSize: "12px",
                            color: "#8A8A93",
                            lineHeight: "18px",
                          }}
                        >
                          擅长肥胖症、代谢综��征、糖尿病等内分泌疾病的诊疗，对复杂病例有丰富临床经验。
                        </p>
                      </div>
                    </div>
                    <button
                      className="w-full py-3 text-white font-medium transition-all flex items-center justify-center gap-2"
                      style={{
                        background:
                          "linear-gradient(135deg, #2B5BFF 0%, #6B8FFF 100%)",
                        borderRadius: "16px",
                        fontSize: "14px",
                        border: "none",
                        cursor: "pointer",
                        boxShadow:
                          "0 2px 8px rgba(43, 91, 255, 0.2)",
                      }}
                    >
                      <span>📋</span>
                      预约挂号
                    </button>
                  </div>
                </div>

                {/* 营养科 */}
                <div
                  className="rounded-2xl p-4"
                  style={{
                    background: "#FFFFFF",
                    border:
                      "1px solid rgba(234, 235, 255, 0.5)",
                    borderRadius: "16px",
                    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.04)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "#EAEBFF" }}
                    >
                      <span className="text-xs">🥗</span>
                    </div>
                    <div
                      className="font-semibold"
                      style={{
                        fontSize: "14px",
                        color: "#1A1A1A",
                      }}
                    >
                      配合：营养科
                    </div>
                    <span
                      className="ml-auto px-2 py-1"
                      style={{
                        backgroundColor:
                          "rgba(234, 235, 255, 0.5)",
                        color: "#2B5BFF",
                        fontSize: "11px",
                        borderRadius: "4px",
                        fontWeight: 500,
                      }}
                    >
                      辅助治疗
                    </span>
                  </div>

                  <div
                    className="rounded-xl p-4"
                    style={{
                      background: "rgba(234, 235, 255, 0.3)",
                      border:
                        "1px solid rgba(234, 235, 255, 0.5)",
                      borderRadius: "16px",
                      position: "relative",
                    }}
                  >
                    {/* 二维码按钮 */}
                    <button
                      onClick={() => {
                        setSelectedDoctorQR("李明");
                        setShowQRModal(true);
                      }}
                      className="absolute top-3 right-3 p-2 rounded-lg transition-all hover:bg-white/50"
                      style={{
                        background: "rgba(255, 255, 255, 0.3)",
                        border: "1px solid rgba(43, 91, 255, 0.2)",
                      }}
                      title="查看医生二维码"
                    >
                      <QrCode
                        style={{
                          width: "16px",
                          height: "16px",
                          color: "#2B5BFF",
                        }}
                      />
                    </button>

                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                        style={{
                          background:
                            "linear-gradient(135deg, #2B5BFF 0%, #6B8FFF 100%)",
                          boxShadow:
                            "0 2px 8px rgba(43, 91, 255, 0.2)",
                          borderRadius: "16px",
                        }}
                      >
                        👩‍⚕️
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4
                            className="font-semibold"
                            style={{
                              fontSize: "15px",
                              color: "#1A1A1A",
                            }}
                          >
                            李明
                          </h4>
                          <span
                            className="px-2 py-1 font-medium"
                            style={{
                              backgroundColor: "#EAEBFF",
                              color: "#2B5BFF",
                              fontSize: "11px",
                              borderRadius: "4px",
                            }}
                          >
                            副主任医师
                          </span>
                        </div>
                        <p
                          className="mb-2"
                          style={{
                            fontSize: "12px",
                            color: "#8A8A93",
                          }}
                        >
                          临床营养科 · 从业15年
                        </p>
                        <p
                          className="leading-relaxed line-clamp-2"
                          style={{
                            fontSize: "12px",
                            color: "#8A8A93",
                            lineHeight: "18px",
                          }}
                        >
                          专注于体重管理和代谢性疾病营养干预，擅长为肥胖症患者定制个性化饮食方案。
                        </p>
                      </div>
                    </div>
                    <button
                      className="w-full py-3 text-white font-medium transition-all flex items-center justify-center gap-2"
                      style={{
                        background:
                          "linear-gradient(135deg, #2B5BFF 0%, #6B8FFF 100%)",
                        borderRadius: "16px",
                        fontSize: "14px",
                        border: "none",
                        cursor: "pointer",
                        boxShadow:
                          "0 2px 8px rgba(43, 91, 255, 0.2)",
                      }}
                    >
                      <span>📋</span>
                      预约挂号
                    </button>
                  </div>
                </div>
              </div>

              {/* 建议检查项目 */}
              <div
                className="rounded-2xl p-4 mb-3"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(234, 235, 255, 0.5)",
                  borderRadius: "16px",
                  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#EAEBFF" }}
                  >
                    <span className="text-xs">🔬</span>
                  </div>
                  <div
                    className="font-semibold"
                    style={{
                      fontSize: "14px",
                      color: "#1A1A1A",
                    }}
                  >
                    建议检查项
                  </div>
                </div>
                <div className="space-y-2">
                  <div
                    className="flex items-center gap-2 p-2 rounded"
                    style={{
                      background: "rgba(234, 235, 255, 0.3)",
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded flex items-center justify-center font-bold"
                      style={{
                        backgroundColor: "#2B5BFF",
                        color: "#FFFFFF",
                        fontSize: "11px",
                        borderRadius: "4px",
                      }}
                    >
                      ✓
                    </div>
                    <span
                      style={{
                        fontSize: "13px",
                        color: "#1A1A1A",
                      }}
                    >
                      血压监测（含24小时动态血压）
                    </span>
                  </div>
                  <div
                    className="flex items-center gap-2 p-2 rounded"
                    style={{
                      background: "rgba(234, 235, 255, 0.3)",
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded flex items-center justify-center font-bold"
                      style={{
                        backgroundColor: "#2B5BFF",
                        color: "#FFFFFF",
                        fontSize: "11px",
                        borderRadius: "4px",
                      }}
                    >
                      ✓
                    </div>
                    <span
                      style={{
                        fontSize: "13px",
                        color: "#1A1A1A",
                      }}
                    >
                      血糖和糖化血红蛋白检查
                    </span>
                  </div>
                  <div
                    className="flex items-center gap-2 p-2 rounded"
                    style={{
                      background: "rgba(234, 235, 255, 0.3)",
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded flex items-center justify-center font-bold"
                      style={{
                        backgroundColor: "#2B5BFF",
                        color: "#FFFFFF",
                        fontSize: "11px",
                        borderRadius: "4px",
                      }}
                    >
                      ✓
                    </div>
                    <span
                      style={{
                        fontSize: "13px",
                        color: "#1A1A1A",
                      }}
                    >
                      血脂全套（总胆固醇、甘油三酯等）
                    </span>
                  </div>
                  <div
                    className="flex items-center gap-2 p-2 rounded"
                    style={{
                      background: "rgba(234, 235, 255, 0.3)",
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded flex items-center justify-center font-bold"
                      style={{
                        backgroundColor: "#2B5BFF",
                        color: "#FFFFFF",
                        fontSize: "11px",
                        borderRadius: "4px",
                      }}
                    >
                      ✓
                    </div>
                    <span
                      style={{
                        fontSize: "13px",
                        color: "#1A1A1A",
                      }}
                    >
                      甲状腺功能检查（TSH、T3、T4）
                    </span>
                  </div>
                  <div
                    className="flex items-center gap-2 p-2 rounded"
                    style={{
                      background: "rgba(234, 235, 255, 0.3)",
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded flex items-center justify-center font-bold"
                      style={{
                        backgroundColor: "#2B5BFF",
                        color: "#FFFFFF",
                        fontSize: "11px",
                        borderRadius: "4px",
                      }}
                    >
                      ✓
                    </div>
                    <span
                      style={{
                        fontSize: "13px",
                        color: "#1A1A1A",
                      }}
                    >
                      肝肾功能检查
                    </span>
                  </div>
                </div>
              </div>

              {/* 挂号预约流程 */}
              <div
                className="rounded-2xl p-4 mb-4"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(234, 235, 255, 0.5)",
                  borderRadius: "16px",
                  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#EAEBFF" }}
                  >
                    <span className="text-xs">📱</span>
                  </div>
                  <div
                    className="font-semibold"
                    style={{
                      fontSize: "14px",
                      color: "#1A1A1A",
                    }}
                  >
                    挂号/预约流程指引
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div
                      className="flex-shrink-0 w-6 h-6 text-white rounded-full flex items-center justify-center font-bold"
                      style={{
                        backgroundColor: "#2B5BFF",
                        fontSize: "11px",
                      }}
                    >
                      1
                    </div>
                    <div className="flex-1">
                      <div
                        className="font-medium mb-1"
                        style={{
                          fontSize: "13px",
                          color: "#1A1A1A",
                        }}
                      >
                        选择医院
                      </div>
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#8A8A93",
                          lineHeight: "18px",
                        }}
                      >
                        建议选择三甲医院或��科医院，优先考虑内分泌科实力强的医疗机构
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div
                      className="flex-shrink-0 w-6 h-6 text-white rounded-full flex items-center justify-center font-bold"
                      style={{
                        backgroundColor: "#2B5BFF",
                        fontSize: "11px",
                      }}
                    >
                      2
                    </div>
                    <div className="flex-1">
                      <div
                        className="font-medium mb-1"
                        style={{
                          fontSize: "13px",
                          color: "#1A1A1A",
                        }}
                      >
                        预约挂号
                      </div>
                      <div
                        className="space-y-1"
                        style={{
                          fontSize: "12px",
                          color: "#8A8A93",
                          lineHeight: "18px",
                        }}
                      >
                        <div>• 医院官方APP/小程序</div>
                        <div>• 医院官方微信公众号</div>
                        <div>• 拨打医院预约电话</div>
                        <div>
                          • 第三方平台（京医通、健康之路等）
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div
                      className="flex-shrink-0 w-6 h-6 text-white rounded-full flex items-center justify-center font-bold"
                      style={{
                        backgroundColor: "#2B5BFF",
                        fontSize: "11px",
                      }}
                    >
                      3
                    </div>
                    <div className="flex-1">
                      <div
                        className="font-medium mb-1"
                        style={{
                          fontSize: "13px",
                          color: "#1A1A1A",
                        }}
                      >
                        就诊准备
                      </div>
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#8A8A93",
                          lineHeight: "18px",
                        }}
                      >
                        携带身份证、医保卡、既往病历和检查报告，空腹前往（部分检查需空腹）
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 温馨提示 */}
              <div
                className="p-3 rounded-2xl"
                style={{
                  background: "rgba(234, 235, 255, 0.4)",
                  border: "1px solid rgba(234, 235, 255, 0.6)",
                  borderRadius: "16px",
                }}
              >
                <div className="flex items-start gap-2">
                  <span className="text-base">💡</span>
                  <div
                    className="flex-1"
                    style={{
                      fontSize: "12px",
                      color: "#8A8A93",
                      lineHeight: "18px",
                    }}
                  >
                    <span
                      className="font-medium"
                      style={{ color: "#1A1A1A" }}
                    >
                      温馨提示：
                    </span>
                    如遇紧急情况（如剧烈胸痛、呼吸困难、意识模糊等），请立即拨打120急救电话或前往最近的医院急诊科。
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* 二维码弹��� */}
      <AnimatePresence>
        {showQRModal && (
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowQRModal(false)}
          style={{ position: "fixed" }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 max-w-sm w-full"
            style={{
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className="font-semibold"
                style={{
                  fontSize: "18px",
                  color: "#1A1A1A",
                }}
              >
                医生二维码
              </h3>
              <button
                onClick={() => setShowQRModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" style={{ color: "#8A8A93" }} />
              </button>
            </div>

            <div className="flex flex-col items-center">
              <div
                className="w-64 h-64 bg-white rounded-xl flex items-center justify-center mb-4"
                style={{
                  border: "2px solid rgba(43, 91, 255, 0.1)",
                  background: "linear-gradient(135deg, #FAFAFF 0%, #F8F9FF 100%)",
                }}
              >
                {/* 模拟二维码 */}
                <div className="relative w-48 h-48">
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `
                        repeating-linear-gradient(0deg, #000 0px, #000 2px, transparent 2px, transparent 4px),
                        repeating-linear-gradient(90deg, #000 0px, #000 2px, transparent 2px, transparent 4px)
                      `,
                      opacity: 0.8,
                    }}
                  />
                  <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, #2B5BFF 0%, #6B8FFF 100%)",
                    }}
                  >
                    <span className="text-2xl">👩‍⚕️</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p
                  className="font-semibold mb-1"
                  style={{
                    fontSize: "16px",
                    color: "#1A1A1A",
                  }}
                >
                  {selectedDoctorQR || "李明医生"}
                </p>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#8A8A93",
                  }}
                >
                  扫码添加医生企业微信
                </p>
              </div>

              <div
                className="w-full mt-4 p-3 rounded-xl text-center"
                style={{
                  background: "rgba(234, 235, 255, 0.4)",
                  border: "1px solid rgba(234, 235, 255, 0.6)",
                }}
              >
                <p
                  style={{
                    fontSize: "12px",
                    color: "#8A8A93",
                    lineHeight: "18px",
                  }}
                >
                  💡 添加后可获取一对一健康咨询服务
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>

      {/* 代餐产品详情弹窗 */}
      {showMealProductDetail &&
        createPortal(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMealProductDetail(false)}
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
                onClick={() => setShowMealProductDetail(false)}
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
                  alignItems: "flex-start",
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
                  padding: "8px 24px 100px",
                  overflowY: "auto",
                  flex: 1,
                  WebkitOverflowScrolling: "touch",
                  minHeight: 0,
                }}
              >
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
                    marginBottom: "24px",
                  }}
                >
                  🥤
                </div>

                {/* 产品名称和价格 */}
                <h3
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 700,
                    fontSize: "24px",
                    color: "#131142",
                    marginBottom: "8px",
                  }}
                >
                  代餐营养套装
                </h3>

                <p
                  style={{
                    fontFamily: "PingFang SC, sans-serif",
                    fontSize: "14px",
                    color: "#7F88AA",
                    marginBottom: "16px",
                  }}
                >
                  30天全营养代餐方案
                </p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "12px",
                    marginBottom: "24px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 700,
                      fontSize: "32px",
                      color: "#2B5BFF",
                    }}
                  >
                    ¥899
                  </span>
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "16px",
                      color: "#8A8A93",
                      textDecoration: "line-through",
                    }}
                  >
                    ¥1299
                  </span>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "6px",
                      background: "rgba(255, 77, 79, 0.1)",
                      fontFamily: "PingFang SC, sans-serif",
                      fontSize: "12px",
                      color: "#FF4D4F",
                      fontWeight: 600,
                    }}
                  >
                    省¥400
                  </span>
                </div>

                {/* 产品特点 */}
                <div
                  style={{
                    padding: "20px",
                    borderRadius: "16px",
                    background: "rgba(43, 91, 255, 0.04)",
                    border: "1px solid rgba(43, 91, 255, 0.1)",
                    marginBottom: "24px",
                  }}
                >
                  <h4
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 600,
                      fontSize: "16px",
                      color: "#131142",
                      marginBottom: "16px",
                    }}
                  >
                    套餐包含
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {[
                      "30份代餐营养餐",
                      "科学配比，均衡营养",
                      "专业营养师在线指导",
                      "每日饮食计划定制",
                      "48小时内快速配送",
                    ].map((feature, idx) => (
                      <div
                        key={idx}
                        style={{ display: "flex", alignItems: "center", gap: "8px" }}
                      >
                        <CheckCircle2
                          style={{ width: "18px", height: "18px", color: "#2B5BFF" }}
                        />
                        <span
                          style={{
                            fontFamily: "PingFang SC, sans-serif",
                            fontSize: "14px",
                            color: "#7F88AA",
                          }}
                        >
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 产品说明 */}
                <div
                  style={{
                    padding: "16px",
                    borderRadius: "12px",
                    background: "rgba(16, 185, 129, 0.06)",
                    border: "1px solid rgba(16, 185, 129, 0.1)",
                  }}
                >
                  <h4
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 600,
                      fontSize: "14px",
                      color: "#10B981",
                      marginBottom: "8px",
                    }}
                  >
                    💡 温馨提示
                  </h4>
                  <p
                    style={{
                      fontFamily: "PingFang SC, sans-serif",
                      fontSize: "13px",
                      color: "#7F88AA",
                      lineHeight: "20px",
                    }}
                  >
                    配合方案使用，科学配比营养素，更高效达成目标。本产品已通过国家食品安全认证，由专业营养师团队研发配方。
                  </p>
                </div>
              </div>

              {/* 底部购买按钮 - 固定在底部 */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "16px 24px 24px",
                  background: "linear-gradient(to top, #FFFFFF 80%, transparent)",
                  borderTop: "1px solid rgba(0, 0, 0, 0.05)",
                }}
              >
                <button
                  onClick={() => {
                    setShowMealProductDetail(false);
                    onMealProductClick?.({});
                  }}
                  style={{
                    width: "100%",
                    padding: "16px",
                    borderRadius: "16px",
                    background: "linear-gradient(92.12deg, #6574FF 6.98%, #3923FF 100.39%)",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#FFFFFF",
                    transition: "all 0.3s ease",
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
                  <ShoppingBag style={{ width: "20px", height: "20px" }} />
                  立即购买
                </button>
              </div>
            </motion.div>
          </motion.div>,
          document.body
        )}
    </motion.div>
  );
}