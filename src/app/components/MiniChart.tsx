import { BarChart, Bar, Cell } from "recharts";
import { ChevronRight } from "lucide-react";

interface MiniChartProps {
  data: { value: number }[];
  color?: string;
  highlightLast?: boolean;
  chartId?: string;
  date?: string;
}

export function MiniChart({ data, color = "#2B5BFF", highlightLast = true, chartId, date }: MiniChartProps) {
  if (!data || data.length === 0) {
    return (
      <div 
        style={{ 
          width: "80px", 
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#E5E7EB",
          fontSize: "12px"
        }}
      >
        --
      </div>
    );
  }

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "8px" }}>
      {/* 右上角时间和图标 */}
      {date && (
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "4px" }}>
          <span style={{ fontSize: "14px", color: "#8A8A93" }}>{date}</span>
          <ChevronRight className="w-5 h-5" style={{ color: "#8A8A93" }} />
        </div>
      )}
      
      {/* 图表容器 - 纵向居中 */}
      <div style={{ width: "80px", height: "40px", display: "flex", alignItems: "center", paddingTop: "4px" }}>
        <BarChart 
          width={80} 
          height={40} 
          data={data} 
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        >
          <Bar dataKey="value" radius={[2, 2, 0, 0]} isAnimationActive={false}>
            {data.map((entry, index) => (
              <Cell 
                key={`minichart-${chartId}-${index}`}
                fill={highlightLast && index === data.length - 1 ? color : `${color}40`}
              />
            ))}
          </Bar>
        </BarChart>
      </div>
    </div>
  );
}