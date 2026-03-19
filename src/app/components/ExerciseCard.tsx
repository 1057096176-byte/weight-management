import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Activity, ChevronRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ReferenceLine } from "recharts";

type ExercisePeriod = "week" | "month" | "quarter";

interface ExerciseMetric {
  id: "steps" | "calories" | "distance";
  label: string;
  value: number;
  unit: string;
  color: string;
  target?: number;
  chartType: "bar" | "line";
}

interface ExerciseCardProps {
  steps: number;
  calories: number;
  distance: number;
  date?: string;
  expanded?: boolean;
  onToggle?: () => void;
}

export function ExerciseCard({ 
  steps, 
  calories, 
  distance,
  date = "今天",
  expanded = false,
  onToggle 
}: ExerciseCardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<ExercisePeriod>("week");
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  // 运动指标配置
  const exerciseMetrics: ExerciseMetric[] = [
    { 
      id: "calories", 
      label: "活动", 
      value: calories, 
      unit: "千卡", 
      color: "#FF3B30",
      target: 500,
      chartType: "bar"
    },
    { 
      id: "steps", 
      label: "步数", 
      value: steps, 
      unit: "步", 
      color: "#34C759",
      target: 10000,
      chartType: "bar"
    },
    { 
      id: "distance", 
      label: "距离", 
      value: distance, 
      unit: "公里", 
      color: "#00C7BE",
      target: 8,
      chartType: "bar"
    },
  ];

  // 模拟图表数据（按日）
  const getChartData = (metricId: string) => {
    const baseData = [
      { time: "6:00", label: "6时" },
      { time: "9:00", label: "9时" },
      { time: "12:00", label: "12时" },
      { time: "15:00", label: "15时" },
      { time: "18:00", label: "18时" },
      { time: "21:00", label: "21时" },
    ];

    if (metricId === "calories") {
      return baseData.map(d => ({ ...d, value: Math.floor(Math.random() * 100) + 50 }));
    } else if (metricId === "steps") {
      return baseData.map(d => ({ ...d, value: Math.floor(Math.random() * 2000) + 500 }));
    } else {
      return baseData.map(d => ({ ...d, value: Math.random() * 2 + 0.5 }));
    }
  };

  // 生成三环图SVG
  const generateActivityRingSVG = () => {
    const size = 64;
    const strokeWidth = 5;
    const gap = 3;
    
    // 三个环的半径
    const radii = [
      size / 2 - strokeWidth / 2,
      size / 2 - strokeWidth / 2 - strokeWidth - gap,
      size / 2 - strokeWidth / 2 - (strokeWidth + gap) * 2,
    ];

    // 各指标的完成度（百分比）
    const progress = [
      (calories / 500) * 100,
      (steps / 10000) * 100,
      (distance / 8) * 100,
    ];

    const colors = ["#FF3B30", "#34C759", "#00C7BE"];

    return (
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {radii.map((radius, index) => {
          const circumference = 2 * Math.PI * radius;
          const dashLength = (circumference * Math.min(progress[index], 100)) / 100;
          
          return (
            <g key={`ring-${index}`}>
              {/* 背景环 */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="#E5E5E5"
                strokeWidth={strokeWidth}
                opacity={0.3}
              />
              {/* 进度环 */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={colors[index]}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dashLength} ${circumference}`}
                strokeLinecap="round"
              />
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <>
      {/* 折叠状态 */}
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
                  background: "linear-gradient(135deg, #FFE5E5 0%, #FFCCCB 100%)",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Activity className="w-4 h-4" style={{ color: "#FF3B30" }} />
              </div>
              <h3 style={{ fontSize: "15px", fontWeight: 500, color: "#1A1A1A" }}>运动情况</h3>
            </div>
            
            <div className="flex items-center gap-2">
              <span style={{ fontSize: "14px", color: "#8A8A93" }}>{date}</span>
              <ChevronRight className="w-5 h-5" style={{ color: "#8A8A93" }} />
            </div>
          </div>

          {/* 主内容：指标和圆环图 */}
          <div className="flex items-center justify-between">
            {/* 左侧：三个指标 */}
            <div style={{ display: "flex", gap: "20px" }}>
              {exerciseMetrics.map((metric, idx) => (
                <div key={metric.id}>
                  <div style={{ fontSize: "11px", color: metric.color, marginBottom: "2px" }}>
                    {metric.label}
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "2px" }}>
                    <span style={{ fontSize: "18px", fontWeight: 600, color: "#1A1A1A", lineHeight: 1 }}>
                      {metric.value}
                    </span>
                    <span style={{ fontSize: "12px", color: "#8A8A93" }}>
                      {metric.unit}
                    </span>
                  </div>
                  {idx < exerciseMetrics.length - 1 && (
                    <div 
                      style={{
                        position: "absolute",
                        right: `${(exerciseMetrics.length - idx - 1) * 33.33}%`,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: "1px",
                        height: "40px",
                        backgroundColor: "#E5E5E5",
                        display: "none"
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* 右侧：三环图 */}
            <div style={{ position: "relative" }}>
              {generateActivityRingSVG()}
            </div>
          </div>
        </motion.div>
      )}

      {/* 展开状态 */}
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
            {/* 顶部：返回按钮 */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div 
                  style={{
                    width: "28px",
                    height: "28px",
                    background: "linear-gradient(135deg, #FFE5E5 0%, #FFCCCB 100%)",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Activity className="w-4 h-4" style={{ color: "#FF3B30" }} />
                </div>
                <h3 style={{ fontSize: "15px", fontWeight: 500, color: "#1A1A1A" }}>运动情况</h3>
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
                { id: "week" as ExercisePeriod, label: "周" },
                { id: "month" as ExercisePeriod, label: "月" },
                { id: "quarter" as ExercisePeriod, label: "季度" }
              ].map((period) => (
                <button
                  key={period.id}
                  onClick={() => setSelectedPeriod(period.id)}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
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

            {/* 圆环图和指标总览 */}
            <div className="flex items-center gap-6 mb-6">
              {/* 圆环图 */}
              <div style={{ position: "relative" }}>
                {generateActivityRingSVG()}
              </div>

              {/* 指标列表 */}
              <div style={{ flex: 1, display: "flex", gap: "24px" }}>
                {exerciseMetrics.map((metric) => (
                  <div key={`header-${metric.id}`}>
                    <div style={{ fontSize: "11px", color: metric.color, marginBottom: "2px" }}>
                      {metric.label}
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "2px" }}>
                      <span style={{ fontSize: "18px", fontWeight: 600, color: "#1A1A1A", lineHeight: 1 }}>
                        {metric.value}
                      </span>
                      <span style={{ fontSize: "12px", color: "#8A8A93" }}>
                        {metric.unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ fontSize: "14px", color: "#8A8A93", marginBottom: "24px" }}>
              今天
            </div>

            {/* 各指标的图表区域 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {exerciseMetrics.map((metric) => {
                const chartData = getChartData(metric.id);
                const isExpanded = selectedMetric === metric.id;

                return (
                  <div key={`chart-${metric.id}`}>
                    {/* 指标标题栏 */}
                    <div 
                      className="flex items-center justify-between mb-3 cursor-pointer"
                      onClick={() => setSelectedMetric(isExpanded ? null : metric.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <div style={{ fontSize: "14px", color: metric.color, fontWeight: 500 }}>
                        {metric.label}
                      </div>
                      <div style={{ fontSize: "14px", color: "#1A1A1A" }}>
                        {metric.value}/{metric.target} {metric.unit}
                      </div>
                    </div>

                    {/* 图表区域 */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          style={{ overflow: "hidden" }}
                        >
                          <div style={{ height: "140px", marginBottom: "8px" }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart 
                                data={chartData}
                                margin={{ top: 10, right: 30, left: -20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
                                <XAxis 
                                  dataKey="label" 
                                  stroke="#8A8A93" 
                                  style={{ fontSize: "11px" }}
                                  tickLine={false}
                                  axisLine={false}
                                />
                                <YAxis 
                                  stroke="#8A8A93" 
                                  style={{ fontSize: "11px" }}
                                  tickLine={false}
                                  axisLine={false}
                                  orientation="right"
                                />
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: "white",
                                    border: "1px solid #EAEBFF",
                                    borderRadius: "12px",
                                    fontSize: "12px",
                                    boxShadow: "0 4px 20px rgba(43, 91, 255, 0.05)"
                                  }}
                                />
                                {/* 目标虚线 - 仅活动和距离显示 */}
                                {(metric.id === "calories" || metric.id === "distance") && metric.target && (
                                  <ReferenceLine
                                    y={metric.target}
                                    stroke={metric.color}
                                    strokeWidth={2}
                                    strokeDasharray="8 4"
                                    opacity={0.6}
                                  />
                                )}
                                <Bar 
                                  dataKey="value" 
                                  fill={metric.color} 
                                  radius={[4, 4, 0, 0]}
                                  maxBarSize={30}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="flex justify-between" style={{ fontSize: "11px", color: "#8A8A93", paddingLeft: "10px", paddingRight: "40px" }}>
                            <span>0 {metric.unit}</span>
                            <span style={{ visibility: "hidden" }}>0 {metric.unit}</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* 未展开时显示小预览条 */}
                    {!isExpanded && (
                      <div style={{ 
                        height: "4px", 
                        backgroundColor: "#F5F5F7", 
                        borderRadius: "2px",
                        overflow: "hidden",
                        position: "relative"
                      }}>
                        <div 
                          style={{
                            height: "100%",
                            width: `${Math.min((metric.value / (metric.target || 1)) * 100, 100)}%`,
                            backgroundColor: metric.color,
                            borderRadius: "2px",
                            transition: "width 0.3s ease"
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}