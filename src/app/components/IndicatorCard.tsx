import { motion, AnimatePresence } from "motion/react";
import { ReactNode } from "react";
import { MiniChart } from "./MiniChart";

interface IndicatorCardProps {
  icon: ReactNode;
  iconColor: string;
  iconBg: string;
  title: string;
  value: string | number;
  unit?: string;
  data?: { value: number }[];
  chartColor?: string;
  expanded?: boolean;
  onToggle?: () => void;
  children?: ReactNode;
  syncStatus?: "synced" | "manual" | "warning" | null;
  statusText?: string;
  date?: string;
}

export function IndicatorCard({
  icon,
  iconColor,
  iconBg,
  title,
  value,
  unit,
  data,
  chartColor = "#2B5BFF",
  expanded = false,
  onToggle,
  children,
  syncStatus,
  statusText,
  date
}: IndicatorCardProps) {
  const displayValue = value === "---" || value === null || value === undefined ? "无数据" : value;
  const hasData = displayValue !== "无数据";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "20px",
        padding: "20px",
        backdropFilter: "blur(10px)",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
        border: "1px solid rgba(234, 235, 255, 0.3)",
        cursor: onToggle ? "pointer" : "default"
      }}
      onClick={onToggle}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* 标题和图标 */}
          <div className="flex items-center gap-2 mb-3">
            <div 
              style={{
                width: "28px",
                height: "28px",
                background: iconBg,
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <div style={{ color: iconColor, display: "flex" }}>
                {icon}
              </div>
            </div>
            <h3 style={{ fontSize: "15px", fontWeight: 500, color: "#1A1A1A" }}>{title}</h3>
          </div>

          {/* 数值 */}
          <div className="flex items-baseline gap-1">
            <span 
              style={{ 
                fontSize: hasData ? "32px" : "16px",
                fontWeight: 700,
                color: hasData ? "#1A1A1A" : "#8A8A93",
                lineHeight: 1
              }}
            >
              {displayValue}
            </span>
            {hasData && unit && (
              <span style={{ fontSize: "16px", fontWeight: 400, color: "#8A8A93" }}>
                {unit}
              </span>
            )}
          </div>

          {/* 同步状态 */}
          {syncStatus && (
            <div 
              style={{ 
                fontSize: "12px", 
                color: syncStatus === "synced" ? "#10B981" : syncStatus === "warning" ? "#F59E0B" : "#6B7280",
                marginTop: "4px"
              }}
            >
              {statusText || (syncStatus === "synced" ? "已同步" : "手动记录")}
            </div>
          )}
        </div>

        {/* 右侧：迷你图表居中展示 */}
        <div className="flex items-center justify-center" style={{ minWidth: "80px", minHeight: "40px" }}>
          {data && data.length > 0 && (
            <MiniChart data={data} color={chartColor} chartId={title} date={date} />
          )}
        </div>
      </div>

      {/* 展开的内容 */}
      {children && (
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #F3F4F6" }}>
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
}