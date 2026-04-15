import { useState } from "react";
import { Link } from "react-router";
import { Calendar, Stethoscope, BarChart3, Users, Bluetooth, UtensilsCrossed, ClipboardList, Zap, ScanFace, FlaskConical } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface QuickActionsProps {
  onTriageClick?: () => void;
  onDoctorClick?: () => void;
  onDeviceClick?: () => void;
  onMealServiceClick?: () => void;
  onAppointmentClick?: () => void;
  onModeChange?: (mode: "fast" | "expert" | "predict") => void;
}

export function QuickActions({
  onTriageClick,
  onDoctorClick,
  onDeviceClick,
  onMealServiceClick,
  onAppointmentClick,
  onModeChange,
}: QuickActionsProps = {}) {
  const [mode, setMode] = useState<"fast" | "expert" | "predict">("fast");
  const [showModeMenu, setShowModeMenu] = useState(false);
  const actions = [
    {
      icon: ClipboardList,
      label: "预约挂号",
      to: undefined,
      onClick: onAppointmentClick,
    },
    {
      icon: Stethoscope,
      label: "智能导诊",
      to: undefined,
      onClick: onTriageClick,
    },
    {
      icon: Calendar,
      label: "今日打卡",
      to: "/checkin",
      onClick: undefined,
    },
    {
      icon: BarChart3,
      label: "数据",
      to: "/data",
      onClick: undefined,
    },
    {
      icon: Users,
      label: "医生分身",
      to: undefined,
      onClick: onDoctorClick,
    },
    {
      icon: Bluetooth,
      label: "设备绑定",
      to: undefined,
      onClick: onDeviceClick,
    },
    {
      icon: UtensilsCrossed,
      label: "代餐服务",
      to: undefined,
      onClick: onMealServiceClick,
    },
  ];

  return (
    <div
      className="relative"
      style={{ padding: "12px 16px" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* 模式菜单 */}
        <AnimatePresence>
          {showModeMenu && (
            <>
              <div
                style={{ position: "fixed", inset: 0, zIndex: 20 }}
                onClick={() => setShowModeMenu(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: "absolute",
                  bottom: "calc(100% + 8px)",
                  left: "16px",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid rgba(234, 235, 255, 0.8)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
                  borderRadius: "16px",
                  padding: "8px",
                  minWidth: "200px",
                  zIndex: 30,
                }}
              >
                {/* 快速 */}
                <button
                  onClick={() => { setMode("fast"); onModeChange?.("fast"); setShowModeMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left"
                  style={{ backgroundColor: mode === "fast" ? "#F0F1FF" : "transparent" }}
                  onMouseEnter={(e) => { if (mode !== "fast") e.currentTarget.style.backgroundColor = "#F8F9FF"; }}
                  onMouseLeave={(e) => { if (mode !== "fast") e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#EAEBFF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Zap style={{ width: "17px", height: "17px", color: "#2B5BFF" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: "14px", color: "#1A1A1A" }}>快速</div>
                    <div style={{ fontSize: "12px", color: "#8A8A93" }}>适用于大部分情况</div>
                  </div>
                  {mode === "fast" && <span style={{ fontSize: "15px", color: "#2B5BFF" }}>✓</span>}
                </button>
                {/* 专家 */}
                <button
                  onClick={() => { setMode("expert"); onModeChange?.("expert"); setShowModeMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left"
                  style={{ backgroundColor: mode === "expert" ? "#F0F1FF" : "transparent" }}
                  onMouseEnter={(e) => { if (mode !== "expert") e.currentTarget.style.backgroundColor = "#F8F9FF"; }}
                  onMouseLeave={(e) => { if (mode !== "expert") e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: mode === "expert" ? "#EAEBFF" : "#F5F5F5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <ScanFace style={{ width: "17px", height: "17px", color: mode === "expert" ? "#2B5BFF" : "#8A8A93" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontWeight: 600, fontSize: "14px", color: "#1A1A1A" }}>专家</span>
                      <span style={{ fontSize: "10px", fontWeight: 600, color: "#2B5BFF", background: "#EAEBFF", borderRadius: "4px", padding: "1px 5px" }}>新</span>
                    </div>
                    <div style={{ fontSize: "12px", color: "#8A8A93" }}>研究级智能模型</div>
                  </div>
                  {mode === "expert" && <span style={{ fontSize: "15px", color: "#2B5BFF" }}>✓</span>}
                </button>
                {/* 预测 */}
                <button
                  onClick={() => { setMode("predict"); onModeChange?.("predict"); setShowModeMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left"
                  style={{ backgroundColor: mode === "predict" ? "#F0F1FF" : "transparent" }}
                  onMouseEnter={(e) => { if (mode !== "predict") e.currentTarget.style.backgroundColor = "#F8F9FF"; }}
                  onMouseLeave={(e) => { if (mode !== "predict") e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: mode === "predict" ? "#EAEBFF" : "#F5F5F5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <FlaskConical style={{ width: "17px", height: "17px", color: mode === "predict" ? "#2B5BFF" : "#8A8A93" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: "14px", color: "#1A1A1A" }}>预测</div>
                    <div style={{ fontSize: "12px", color: "#8A8A93" }}>手术效果预测</div>
                  </div>
                  {mode === "predict" && <span style={{ fontSize: "15px", color: "#2B5BFF" }}>✓</span>}
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* 横向滚动容器 */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 pb-1">

            {/* 模式切换胶囊 - 固定在最左 */}
            <button
              onClick={() => setShowModeMenu(!showModeMenu)}
              className="flex items-center gap-1.5 flex-shrink-0 transition-all"
              style={{
                padding: "6px 12px",
                height: "32px",
                background: mode !== "fast" ? "#EEF0FF" : "#FFFFFF",
                border: mode !== "fast" ? "1.5px solid #2B5BFF" : "1px solid #FFFFFF",
                boxShadow: mode !== "fast" ? "none" : "inset 0px 4px 10.7px #F1F4FF",
                borderRadius: "60px",
              }}
            >
              {mode === "fast"
                ? <Zap style={{ width: "14px", height: "14px", color: "#8A8A93" }} />
                : mode === "expert"
                ? <ScanFace style={{ width: "14px", height: "14px", color: "#2B5BFF" }} />
                : <FlaskConical style={{ width: "14px", height: "14px", color: "#2B5BFF" }} />
              }
              <span style={{ fontSize: "14px", fontWeight: 400, color: mode !== "fast" ? "#2B5BFF" : "#131142", whiteSpace: "nowrap" }}>
                {mode === "fast" ? "快速" : mode === "expert" ? "专家" : "预测"}
              </span>
              <span style={{ fontSize: "12px", color: mode !== "fast" ? "#2B5BFF" : "#8A8A93" }}>›</span>
            </button>

            {/* 快捷操作列表 */}
            {actions.map((action) => {
              const content = (
                <>
                  {/* 左侧图标 */}
                  <action.icon className="w-5 h-5" style={{ color: "#2B5BFF" }} />
                  {/* 右侧名称 */}
                  <span
                    className="whitespace-nowrap"
                    style={{
                      fontSize: "14px",
                      fontWeight: 400,
                      lineHeight: "20px",
                      color: "#131142"
                    }}
                  >
                    {action.label}
                  </span>
                </>
              );

              const className = "flex items-center gap-2.5 flex-shrink-0 transition-all";
              const style = {
                padding: "6px 16px",
                height: "32px",
                background: "#FFFFFF",
                border: "1px solid #FFFFFF",
                boxShadow: "inset 0px 4px 10.7px #F1F4FF",
                borderRadius: "60px"
              };

              if (action.onClick) {
                return (
                  <button
                    key={action.label}
                    onClick={action.onClick}
                    className={className}
                    style={style}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "inset 0px 4px 10.7px #F1F4FF, 0 2px 8px rgba(0, 0, 0, 0.06)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "inset 0px 4px 10.7px #F1F4FF";
                    }}
                  >
                    {content}
                  </button>
                );
              }

              return (
                <Link
                  key={action.label}
                  to={action.to!}
                  className={className}
                  style={style}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "inset 0px 4px 10.7px #F1F4FF, 0 2px 8px rgba(0, 0, 0, 0.06)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "inset 0px 4px 10.7px #F1F4FF";
                  }}
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* 自定义样式隐藏滚动条 */}
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
