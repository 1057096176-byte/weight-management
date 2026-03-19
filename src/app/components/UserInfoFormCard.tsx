import { useState } from "react";
import { motion } from "motion/react";
import { QrCode } from "lucide-react";

interface UserInfoFormCardProps {
  onSubmit: (data: {
    phone: string;
    name: string;
    age: number;
    height: number;
    weight: number;
    medicalRecord?: string;
  }) => void;
  time: string;
}

export function UserInfoFormCard({ onSubmit, time }: UserInfoFormCardProps) {
  const [formData, setFormData] = useState({
    phone: "",
    name: "",
    age: "",
    height: "",
    weight: "",
    medicalRecord: "",
  });

  const [errors, setErrors] = useState({
    phone: "",
    name: "",
    age: "",
    height: "",
    weight: "",
    medicalRecord: "",
  });

  const validateForm = () => {
    const newErrors = {
      phone: "",
      name: "",
      age: "",
      height: "",
      weight: "",
      medicalRecord: "",
    };

    let isValid = true;

    // 验证手机号
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "请输入手机号";
      isValid = false;
    } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "请输入正确的手机号格式";
      isValid = false;
    }

    // 验证姓名
    if (!formData.name.trim()) {
      newErrors.name = "请输入姓名";
      isValid = false;
    }

    // 验证年龄
    const age = parseInt(formData.age);
    if (!formData.age.trim()) {
      newErrors.age = "请输入年龄";
      isValid = false;
    } else if (isNaN(age) || age < 0 || age > 100) {
      newErrors.age = "年龄范围：0-100岁";
      isValid = false;
    }

    // 验证身高
    const height = parseInt(formData.height);
    if (!formData.height.trim()) {
      newErrors.height = "请输入身高";
      isValid = false;
    } else if (isNaN(height) || height < 100 || height > 250) {
      newErrors.height = "身高范围：100-250cm";
      isValid = false;
    }

    // 验证体重
    const weight = parseFloat(formData.weight);
    if (!formData.weight.trim()) {
      newErrors.weight = "请输入体重";
      isValid = false;
    } else if (isNaN(weight) || weight < 30 || weight > 300) {
      newErrors.weight = "体重范围：30-300kg";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        phone: formData.phone,
        name: formData.name,
        age: parseInt(formData.age),
        height: parseInt(formData.height),
        weight: parseFloat(formData.weight),
        medicalRecord: formData.medicalRecord,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4"
    >
      {/* 表单卡片 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #FFFFFF 0%, #F8F9FF 100%)",
          border: "1.5px solid rgba(43, 91, 255, 0.15)",
          padding: "24px",
          borderRadius: "0 16px 16px 16px",
          maxWidth: "800px",
          width: "100%",
        }}
      >
        {/* 标题 */}
        <div className="mb-5">
          <h3
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: "16px",
              lineHeight: "24px",
              color: "#1F2937",
              marginBottom: "8px",
            }}
          >
            完善基本信息
          </h3>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              fontSize: "13px",
              lineHeight: "20px",
              color: "#6B7280",
            }}
          >
            为了更好地为您服务，请填写以下信息
          </p>
        </div>

        {/* 表单字段 */}
        <div className="space-y-4">
          {/* 手机号 */}
          <div>
            <label
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                fontSize: "13px",
                lineHeight: "16px",
                color: "#374151",
                display: "block",
                marginBottom: "8px",
              }}
            >
              手机号 <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => {
                setFormData({ ...formData, phone: e.target.value });
                setErrors({ ...errors, phone: "" });
              }}
              placeholder="请输入11位手机号"
              maxLength={11}
              style={{
                width: "100%",
                padding: "16px",
                border: errors.phone
                  ? "1.5px solid #EF4444"
                  : "1.5px solid #E5E7EB",
                borderRadius: "12px",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                outline: "none",
                transition: "all 0.2s",
              }}
              onFocus={(e) => {
                if (!errors.phone) {
                  e.target.style.borderColor = "#2B5BFF";
                }
              }}
              onBlur={(e) => {
                if (!errors.phone) {
                  e.target.style.borderColor = "#E5E7EB";
                }
              }}
            />
            {errors.phone && (
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "12px",
                  color: "#EF4444",
                  marginTop: "6px",
                }}
              >
                {errors.phone}
              </p>
            )}
          </div>

          {/* 姓名 */}
          <div>
            <label
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                fontSize: "13px",
                lineHeight: "16px",
                color: "#374151",
                display: "block",
                marginBottom: "8px",
              }}
            >
              姓名 <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                setErrors({ ...errors, name: "" });
              }}
              placeholder="请输入您的姓名"
              style={{
                width: "100%",
                padding: "16px",
                border: errors.name
                  ? "1.5px solid #EF4444"
                  : "1.5px solid #E5E7EB",
                borderRadius: "12px",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                outline: "none",
                transition: "all 0.2s",
              }}
              onFocus={(e) => {
                if (!errors.name) {
                  e.target.style.borderColor = "#2B5BFF";
                }
              }}
              onBlur={(e) => {
                if (!errors.name) {
                  e.target.style.borderColor = "#E5E7EB";
                }
              }}
            />
            {errors.name && (
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "12px",
                  color: "#EF4444",
                  marginTop: "6px",
                }}
              >
                {errors.name}
              </p>
            )}
          </div>

          {/* 年龄 */}
          <div>
            <label
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                fontSize: "13px",
                lineHeight: "16px",
                color: "#374151",
                display: "block",
                marginBottom: "8px",
              }}
            >
              年龄 <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => {
                setFormData({ ...formData, age: e.target.value });
                setErrors({ ...errors, age: "" });
              }}
              placeholder="25"
              style={{
                width: "100%",
                padding: "16px",
                border: errors.age
                  ? "1.5px solid #EF4444"
                  : "1.5px solid #E5E7EB",
                borderRadius: "12px",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                outline: "none",
                transition: "all 0.2s",
              }}
              onFocus={(e) => {
                if (!errors.age) {
                  e.target.style.borderColor = "#2B5BFF";
                }
              }}
              onBlur={(e) => {
                if (!errors.age) {
                  e.target.style.borderColor = "#E5E7EB";
                }
              }}
            />
            {errors.age && (
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "12px",
                  color: "#EF4444",
                  marginTop: "6px",
                }}
              >
                {errors.age}
              </p>
            )}
          </div>

          {/* 身高和体重（并排） */}
          <div className="grid grid-cols-2 gap-4">
            {/* 身高 */}
            <div>
              <label
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: "13px",
                  lineHeight: "16px",
                  color: "#374151",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                身高 <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => {
                    setFormData({ ...formData, height: e.target.value });
                    setErrors({ ...errors, height: "" });
                  }}
                  placeholder="170"
                  style={{
                    width: "100%",
                    padding: "16px 40px 16px 16px",
                    border: errors.height
                      ? "1.5px solid #EF4444"
                      : "1.5px solid #E5E7EB",
                    borderRadius: "12px",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    outline: "none",
                    transition: "all 0.2s",
                  }}
                  onFocus={(e) => {
                    if (!errors.height) {
                      e.target.style.borderColor = "#2B5BFF";
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.height) {
                      e.target.style.borderColor = "#E5E7EB";
                    }
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    right: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "13px",
                    color: "#9CA3AF",
                  }}
                >
                  cm
                </span>
              </div>
              {errors.height && (
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "12px",
                    color: "#EF4444",
                    marginTop: "6px",
                  }}
                >
                  {errors.height}
                </p>
              )}
            </div>

            {/* 体重 */}
            <div>
              <label
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: "13px",
                  lineHeight: "16px",
                  color: "#374151",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                体重 <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => {
                    setFormData({ ...formData, weight: e.target.value });
                    setErrors({ ...errors, weight: "" });
                  }}
                  placeholder="65"
                  style={{
                    width: "100%",
                    padding: "16px 40px 16px 16px",
                    border: errors.weight
                      ? "1.5px solid #EF4444"
                      : "1.5px solid #E5E7EB",
                    borderRadius: "12px",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    outline: "none",
                    transition: "all 0.2s",
                  }}
                  onFocus={(e) => {
                    if (!errors.weight) {
                      e.target.style.borderColor = "#2B5BFF";
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.weight) {
                      e.target.style.borderColor = "#E5E7EB";
                    }
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    right: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "13px",
                    color: "#9CA3AF",
                  }}
                >
                  kg
                </span>
              </div>
              {errors.weight && (
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "12px",
                    color: "#EF4444",
                    marginTop: "6px",
                  }}
                >
                  {errors.weight}
                </p>
              )}
            </div>
          </div>

          {/* 医疗记录 */}
          <div>
            <label
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                fontSize: "13px",
                lineHeight: "16px",
                color: "#374151",
                display: "block",
                marginBottom: "8px",
              }}
            >
              病案号（选填）
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.medicalRecord}
                onChange={(e) => {
                  setFormData({ ...formData, medicalRecord: e.target.value });
                }}
                placeholder="请输入病案号或点击扫码"
                style={{
                  width: "100%",
                  padding: "16px 52px 16px 16px",
                  border: "1.5px solid #E5E7EB",
                  borderRadius: "12px",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  outline: "none",
                  transition: "all 0.2s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#2B5BFF";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#E5E7EB";
                }}
              />
              <button
                type="button"
                onClick={() => {
                  // 模拟扫码
                  const mockRecord = Math.floor(10000000 + Math.random() * 90000000).toString();
                  setFormData({ ...formData, medicalRecord: mockRecord });
                }}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <QrCode 
                  style={{
                    width: "20px",
                    height: "20px",
                    color: "#2B5BFF",
                  }}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 绑定按钮 */}
        <button
          onClick={handleSubmit}
          style={{
            width: "100%",
            marginTop: "24px",
            padding: "14px 24px",
            background: "linear-gradient(135deg, #2B5BFF 0%, #1E40AF 100%)",
            borderRadius: "12px",
            border: "none",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: "15px",
            color: "#FFFFFF",
            boxShadow: "0 4px 12px rgba(43, 91, 255, 0.3)",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 6px 16px rgba(43, 91, 255, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 4px 12px rgba(43, 91, 255, 0.3)";
          }}
        >
          绑定信息
        </button>

        {/* 提示文本 */}
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "12px",
            color: "#9CA3AF",
            textAlign: "center",
            marginTop: "12px",
          }}
        >
          您的信息将被严格保密
        </p>
      </motion.div>
    </motion.div>
  );
}