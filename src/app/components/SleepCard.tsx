import { Moon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ReactNode } from "react";
import { MiniChart } from "./MiniChart";

interface SubIndicator {
  label: string;
  value: string | number;
  unit: string;
}

interface SleepCardProps {
  title: string;
  subIndicators: SubIndicator[];
  data?: { value: number }[];
  chartColor?: string;
  expanded?: boolean;
  onToggle?: () => void;
  children?: ReactNode;
  date?: string;
}

export function SleepCard({
  title,
  subIndicators,
  data,
  chartColor = "#6366F1",
  expanded = false,
  onToggle,
  children,
  date
}: SleepCardProps) {
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
      <div className="flex items-start justify-between mb-4">
        {/* 标题和图标 */}
        <div className="flex items-center gap-2">
          <div 
            style={{
              width: "28px",
              height: "28px",
              background: "linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Moon className="w-4 h-4" style={{ color: "#6366F1" }} />
          </div>
          <h3 style={{ fontSize: "15px", fontWeight: 500, color: "#1A1A1A" }}>{title}</h3>
        </div>

        {/* 右侧：迷你图表居中展示 */}
        <div className="flex items-center justify-center" style={{ minWidth: "80px", minHeight: "40px" }}>
          {data && data.length > 0 && (
            <MiniChart data={data} color={chartColor} chartId={title} date={date} />
          )}
        </div>
      </div>

      {/* 子指标网格 */}
      <div className="grid grid-cols-3 gap-3">
        {subIndicators.map((indicator, index) => {
          const hasData = indicator.value !== "---" && indicator.value !== null && indicator.value !== undefined;
          return (
            <div 
              key={`${indicator.label}-${index}`}
              style={{
                padding: "12px",
                backgroundColor: "#F9FAFB",
                borderRadius: "12px"
              }}
            >
              <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "4px" }}>
                {indicator.label}
              </div>
              <div className="flex items-baseline gap-1">
                <span 
                  style={{ 
                    fontSize: hasData ? "20px" : "14px",
                    fontWeight: 700,
                    color: hasData ? "#1A1A1A" : "#8A8A93"
                  }}
                >
                  {hasData ? indicator.value : "无数据"}
                </span>
                {hasData && (
                  <span style={{ fontSize: "12px", fontWeight: 400, color: "#8A8A93" }}>
                    {indicator.unit}
                  </span>
                )}
              </div>
            </div>
          );
        })}
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