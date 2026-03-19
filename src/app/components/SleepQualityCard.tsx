import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Moon, ChevronRight, MoreVertical } from "lucide-react";

type SleepPeriod = "day" | "week" | "month" | "6months";

interface SleepSegment {
  stage: "deep" | "core" | "rem" | "awake";
  startTime: string;
  endTime: string;
  duration: number; // 分钟
}

interface SleepMetric {
  id: string;
  label: string;
  value: string;
  color: string;
}

interface SleepQualityCardProps {
  score: number;
  date?: string;
  expanded?: boolean;
  onToggle?: () => void;
}

export function SleepQualityCard({ 
  score, 
  date = "今天",
  expanded = false,
  onToggle 
}: SleepQualityCardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<SleepPeriod>("day");
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  // 计算质量等级
  const getQualityLevel = (score: number) => {
    if (score >= 85) return "高";
    if (score >= 70) return "中";
    return "低";
  };

  const qualityLevel = getQualityLevel(score);

  // 睡眠阶段数据 - 每个时间段的睡眠状态
  const sleepSegments: SleepSegment[] = [
    { stage: "awake", startTime: "23:00", endTime: "23:15", duration: 15 },
    { stage: "core", startTime: "23:15", endTime: "00:30", duration: 75 },
    { stage: "deep", startTime: "00:30", endTime: "01:20", duration: 50 },
    { stage: "core", startTime: "01:20", endTime: "02:40", duration: 80 },
    { stage: "rem", startTime: "02:40", endTime: "03:20", duration: 40 },
    { stage: "core", startTime: "03:20", endTime: "04:10", duration: 50 },
    { stage: "deep", startTime: "04:10", endTime: "04:40", duration: 30 },
    { stage: "rem", startTime: "04:40", endTime: "05:30", duration: 50 },
    { stage: "core", startTime: "05:30", endTime: "06:00", duration: 30 },
    { stage: "awake", startTime: "06:00", endTime: "06:10", duration: 10 },
  ];

  // 睡眠指标列表
  const sleepMetrics: SleepMetric[] = [
    { id: "awake", label: "清醒时间", value: "25分钟", color: "#FF6B6B" },
    { id: "rem", label: "快速动眼睡眠", value: "1小时30分钟", color: "#4ECDC4" },
    { id: "core", label: "核心睡眠", value: "3小时55分钟", color: "#45B7D1" },
    { id: "deep", label: "深度睡眠", value: "1小时20分钟", color: "#5B5FEF" },
  ];

  // 计算总睡眠时长
  const totalSleepHours = 6;
  const totalSleepMinutes = 27;

  // 生成圆环图SVG
  const generateRingSVG = () => {
    const size = 80;
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    
    // 各阶段占比（百分比）
    const segments = [
      { percent: 20, color: "#5B5FEF" },  // 深度
      { percent: 60, color: "#45B7D1" },  // 核心
      { percent: 14, color: "#4ECDC4" },  // REM
      { percent: 6, color: "#FF6B6B" },   // 清醒
    ];

    let currentOffset = 0;
    
    return (
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#F0F0F0"
          strokeWidth={strokeWidth}
        />
        {segments.map((segment, index) => {
          const dashLength = (circumference * segment.percent) / 100;
          const offset = currentOffset;
          currentOffset += dashLength;
          
          return (
            <circle
              key={index}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashLength} ${circumference}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
    );
  };

  // 时间转换为分钟（从23:00开始计算）
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    // 如果是23点，从0开始；如果是0-7点，加上60分钟
    if (hours === 23) return minutes;
    if (hours >= 0 && hours < 7) return (hours + 1) * 60 + minutes;
    return 0;
  };

  // 渲染睡眠阶段图表
  const renderSleepStageChart = () => {
    const stages = ["awake", "rem", "core", "deep"];
    const totalMinutes = 7 * 60 + 10; // 从23:00到次日06:10
    const chartWidth = 100; // 百分比

    return (
      <div style={{ position: "relative", marginBottom: "32px" }}>
        {/* 时间轴标签 */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between",
          marginBottom: "8px",
          paddingLeft: "120px",
          paddingRight: "20px"
        }}>
          {["23:00", "00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00"].map((time, idx) => (
            <span 
              key={`time-label-${time}-${idx}`}
              style={{ 
                fontSize: "11px", 
                color: "#8A8A93",
                width: "40px",
                textAlign: idx === 0 ? "left" : idx === 7 ? "right" : "center"
              }}
            >
              {time}
            </span>
          ))}
        </div>

        {/* 睡眠阶段行 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {stages.map((stage) => {
            const metric = sleepMetrics.find(m => m.id === stage);
            if (!metric) return null;

            const isSelected = selectedMetric === stage;
            const isGrayed = selectedMetric && selectedMetric !== stage;

            return (
              <div 
                key={`stage-row-${stage}`}
                style={{ 
                  display: "flex", 
                  alignItems: "center",
                  opacity: isGrayed ? 0.3 : 1,
                  transition: "opacity 0.2s"
                }}
              >
                {/* 左侧标签 */}
                <div style={{ 
                  width: "100px", 
                  fontSize: "13px", 
                  color: "#1A1A1A",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <div 
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: metric.color,
                      flexShrink: 0
                    }}
                  />
                  <span style={{ fontSize: "12px" }}>{metric.label}</span>
                </div>

                {/* 时间线 */}
                <div style={{ 
                  flex: 1, 
                  height: "28px", 
                  backgroundColor: "#F5F5F7",
                  borderRadius: "6px",
                  position: "relative",
                  marginLeft: "20px",
                  overflow: "hidden"
                }}>
                  {sleepSegments
                    .filter(seg => seg.stage === stage)
                    .map((segment, idx) => {
                      const startMinutes = timeToMinutes(segment.startTime);
                      const endMinutes = timeToMinutes(segment.endTime);
                      const left = (startMinutes / totalMinutes) * 100;
                      const width = ((endMinutes - startMinutes) / totalMinutes) * 100;

                      return (
                        <div
                          key={`${stage}-segment-${segment.startTime}-${idx}`}
                          style={{
                            position: "absolute",
                            left: `${left}%`,
                            width: `${width}%`,
                            height: "100%",
                            backgroundColor: metric.color,
                            borderRadius: "4px"
                          }}
                        />
                      );
                    })}
                </div>
              </div>
            );
          })}
        </div>

        {/* 垂直时间网格线 */}
        <div style={{
          position: "absolute",
          top: "32px",
          left: "120px",
          right: "20px",
          height: "calc(100% - 32px)",
          pointerEvents: "none"
        }}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((hour) => (
            <div
              key={`grid-line-${hour}`}
              style={{
                position: "absolute",
                left: `${(hour / 7) * 100}%`,
                top: 0,
                bottom: 0,
                width: "1px",
                backgroundColor: "#E5E5E5",
                opacity: 0.5
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* 折叠状态：睡眠质量评分卡片 */}
      {!expanded && (
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
            cursor: "pointer"
          }}
          onClick={onToggle}
        >
          {/* 顶部 */}
          <div className="flex items-center justify-between mb-4">
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
              <h3 style={{ fontSize: "15px", fontWeight: 500, color: "#1A1A1A" }}>睡眠评分</h3>
            </div>
            
            <div className="flex items-center gap-2">
              <span style={{ fontSize: "14px", color: "#8A8A93" }}>{date}</span>
              <ChevronRight className="w-5 h-5" style={{ color: "#8A8A93" }} />
            </div>
          </div>

          {/* 主内容：评分和圆环图 */}
          <div className="flex items-center justify-between">
            {/* 左侧：文字评分 */}
            <div>
              <div style={{ fontSize: "40px", fontWeight: 600, color: "#1A1A1A", lineHeight: 1 }}>
                {qualityLevel}
              </div>
              <div style={{ fontSize: "20px", color: "#8A8A93", marginTop: "4px" }}>
                {score}分
              </div>
            </div>

            {/* 右侧：圆环图 */}
            <div style={{ position: "relative" }}>
              {generateRingSVG()}
              <div 
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "#1A1A1A"
                }}
              >
                {score}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 展开状态：详细睡眠数据 */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "20px",
              padding: "20px",
              backdropFilter: "blur(10px)",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
              border: "1px solid rgba(234, 235, 255, 0.3)",
              overflow: "hidden"
            }}
          >
            {/* 顶部���返回按钮 */}
            <div className="flex items-center justify-between mb-4">
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
                <h3 style={{ fontSize: "15px", fontWeight: 500, color: "#1A1A1A" }}>睡眠</h3>
              </div>
              
              <button
                onClick={onToggle}
                className="p-2 rounded-lg transition-colors"
                style={{ backgroundColor: "transparent" }}
              >
                <ChevronRight 
                  className="w-5 h-5" 
                  style={{ color: "#8A8A93", transform: "rotate(90deg)" }} 
                />
              </button>
            </div>

            {/* 时间周期选择器 */}
            <div 
              className="flex rounded-xl mb-4"
              style={{ 
                backgroundColor: "#F5F5F7",
                padding: "4px"
              }}
            >
              {[
                { id: "day" as SleepPeriod, label: "日" },
                { id: "week" as SleepPeriod, label: "周" },
                { id: "month" as SleepPeriod, label: "月" },
                { id: "6months" as SleepPeriod, label: "6个月" }
              ].map((period) => (
                <button
                  key={period.id}
                  onClick={() => setSelectedPeriod(period.id)}
                  style={{
                    flex: 1,
                    padding: "8px 16px",
                    borderRadius: "8px",
                    backgroundColor: selectedPeriod === period.id ? "#FFFFFF" : "transparent",
                    color: selectedPeriod === period.id ? "#1A1A1A" : "#8A8A93",
                    fontSize: "14px",
                    fontWeight: 500,
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  {period.label}
                </button>
              ))}
            </div>

            {/* 睡眠时长展示 */}
            <div className="flex items-baseline gap-2 mb-2">
              <span style={{ fontSize: "14px", color: "#8A8A93" }}>睡眠时间</span>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span style={{ fontSize: "40px", fontWeight: 600, color: "#1A1A1A", lineHeight: 1 }}>
                {totalSleepHours}
              </span>
              <span style={{ fontSize: "20px", color: "#8A8A93" }}>小时</span>
              <span style={{ fontSize: "40px", fontWeight: 600, color: "#1A1A1A", lineHeight: 1 }}>
                {totalSleepMinutes}
              </span>
              <span style={{ fontSize: "20px", color: "#8A8A93" }}>分钟</span>
              <button className="ml-auto p-2">
                <MoreVertical className="w-5 h-5" style={{ color: "#8A8A93" }} />
              </button>
            </div>
            <div style={{ fontSize: "14px", color: "#8A8A93", marginBottom: "24px" }}>
              2026年3月13日
            </div>

            {/* 睡眠阶段时间线图表 */}
            {renderSleepStageChart()}

            {/* 睡眠指标列表 */}
            <div className="space-y-2">
              {sleepMetrics.map((metric) => (
                <motion.div
                  key={metric.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedMetric(selectedMetric === metric.id ? null : metric.id)}
                  style={{
                    backgroundColor: "#FAFAFF",
                    borderRadius: "12px",
                    padding: "16px",
                    cursor: "pointer",
                    border: selectedMetric === metric.id ? `2px solid ${metric.color}` : "2px solid transparent",
                    transition: "all 0.2s"
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        style={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          backgroundColor: metric.color
                        }}
                      />
                      <span style={{ fontSize: "15px", color: "#1A1A1A" }}>
                        {metric.label}
                      </span>
                    </div>
                    <span style={{ fontSize: "15px", fontWeight: 600, color: "#1A1A1A" }}>
                      {metric.value}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}