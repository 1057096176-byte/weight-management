import { useState } from "react";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";

interface Conditions {
  diabetes: boolean;
  hypertension: boolean;
  hyperlipidemia: boolean;
}

interface SurgeryInfoCardProps {
  onSubmit: (data: Conditions) => void;
}

const CONDITIONS = [
  { key: "diabetes" as const, label: "糖尿病" },
  { key: "hypertension" as const, label: "高血压" },
  { key: "hyperlipidemia" as const, label: "高血脂" },
];

export function SurgeryInfoCard({ onSubmit }: SurgeryInfoCardProps) {
  const [values, setValues] = useState<Record<keyof Conditions, boolean | null>>({
    diabetes: null,
    hypertension: null,
    hyperlipidemia: null,
  });
  const [submitted, setSubmitted] = useState(false);

  const toggle = (key: keyof Conditions, val: boolean) => {
    if (submitted) return;
    setValues((prev) => ({ ...prev, [key]: prev[key] === val ? null : val }));
  };

  const handleSubmit = () => {
    if (submitted) return;
    setSubmitted(true);
    onSubmit({
      diabetes: values.diabetes ?? false,
      hypertension: values.hypertension ?? false,
      hyperlipidemia: values.hyperlipidemia ?? false,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "linear-gradient(180deg, #FFFFFF 0%, #F8F9FF 100%)",
        border: "1.5px solid rgba(43, 91, 255, 0.15)",
        borderRadius: "0 16px 16px 16px",
        padding: "20px",
        maxWidth: "360px",
        width: "100%",
      }}
    >
      <div style={{ marginBottom: "16px" }}>
        <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#1F2937", margin: "0 0 4px" }}>
          补充健康信息
        </h3>
        <p style={{ fontSize: "12px", color: "#9CA3AF", margin: 0 }}>
          建议填写，帮助生成更精准的预测结果
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
        {CONDITIONS.map(({ key, label }) => (
          <div
            key={key}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 12px",
              backgroundColor: "#F8F9FF",
              borderRadius: "10px",
              border: "1px solid #EAEBFF",
            }}
          >
            <span style={{ fontSize: "14px", color: "#374151", fontWeight: 500 }}>{label}</span>
            <div style={{ display: "flex", gap: "6px" }}>
              {[true, false].map((val) => {
                const active = values[key] === val;
                return (
                  <button
                    key={String(val)}
                    onClick={() => toggle(key, val)}
                    disabled={submitted}
                    style={{
                      padding: "4px 14px",
                      borderRadius: "20px",
                      fontSize: "13px",
                      fontWeight: 500,
                      border: "none",
                      cursor: submitted ? "default" : "pointer",
                      background: active
                        ? "linear-gradient(135deg, #2B5BFF 0%, #6B8FFF 100%)"
                        : "#EAEBFF",
                      color: active ? "#fff" : "#8A8A93",
                      transition: "all 0.2s",
                    }}
                  >
                    {val ? "有" : "无"}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitted}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "12px",
          border: "none",
          cursor: submitted ? "default" : "pointer",
          background: submitted
            ? "linear-gradient(135deg, #C8CCDD 0%, #D8DCEE 100%)"
            : "linear-gradient(135deg, #2B5BFF 0%, #6B8FFF 100%)",
          color: "#fff",
          fontSize: "14px",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "4px",
          transition: "all 0.2s",
        }}
      >
        {submitted ? "已提交，正在生成预测..." : "开始预测"}
        {!submitted && <ChevronRight style={{ width: "16px", height: "16px" }} />}
      </button>
    </motion.div>
  );
}
