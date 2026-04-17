import { useState, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { QrCode, Check, X } from "lucide-react";

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

  const [agreed, setAgreed] = useState(false);
  const [hasRead, setHasRead] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);

  const handleAgreementScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 8) {
      setScrolledToBottom(true);
    }
  };

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
    if (!agreed) return;
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
    <>
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
            background: agreed
              ? "linear-gradient(135deg, #2B5BFF 0%, #1E40AF 100%)"
              : "linear-gradient(135deg, #C8CCDD 0%, #D8DCEE 100%)",
            borderRadius: "12px",
            border: "none",
            cursor: agreed ? "pointer" : "not-allowed",
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: "15px",
            color: "#FFFFFF",
            boxShadow: agreed ? "0 4px 12px rgba(43, 91, 255, 0.3)" : "none",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => {
            if (!agreed) return;
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(43, 91, 255, 0.4)";
          }}
          onMouseLeave={(e) => {
            if (!agreed) return;
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(43, 91, 255, 0.3)";
          }}
        >
          绑定信息
        </button>

        {/* 协议复选框 */}
        <div
          style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginTop: "14px", cursor: "pointer" }}
          onClick={() => {
            if (!hasRead) {
              setScrolledToBottom(false);
              setShowAgreement(true);
            } else {
              setAgreed(!agreed);
            }
          }}
        >
          <div
            style={{
              width: "16px",
              height: "16px",
              flexShrink: 0,
              marginTop: "2px",
              borderRadius: "4px",
              border: agreed ? "none" : "1.5px solid #C8CCDD",
              background: agreed ? "linear-gradient(135deg, #2B5BFF 0%, #6B8FFF 100%)" : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
            }}
          >
            {agreed && <Check style={{ width: "11px", height: "11px", color: "#fff", strokeWidth: 3 }} />}
          </div>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9CA3AF", lineHeight: "1.6", margin: 0 }}>
            我已阅读并同意{" "}
            <span
              style={{ color: "#2B5BFF", fontWeight: 500 }}
              onClick={(e) => { e.stopPropagation(); setScrolledToBottom(false); setShowAgreement(true); }}
            >
              《用户授权与隐私协议》
            </span>
            ，授权本应用采集和使用我的健康数据
          </p>
        </div>

        {/* 协议弹窗 */}
      </motion.div>
    </motion.div>

    {createPortal(      <AnimatePresence>
        {showAgreement && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAgreement(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 9998 }}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              style={{
                position: "fixed", bottom: 0, left: 0, right: 0,
                background: "#FFFFFF", borderRadius: "24px 24px 0 0",
                zIndex: 9999, maxHeight: "80vh", display: "flex", flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 20px 16px", borderBottom: "1px solid #F0F0F5", flexShrink: 0 }}>
                <h2 style={{ fontSize: "17px", fontWeight: 600, color: "#1A1A1A", margin: 0 }}>用户授权与隐私协议</h2>
                <button onClick={() => setShowAgreement(false)} style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#F0F0F5", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <X style={{ width: "16px", height: "16px", color: "#8A8A93" }} />
                </button>
              </div>
              <div onScroll={handleAgreementScroll} style={{ overflowY: "auto", padding: "20px", flex: 1, fontSize: "13px", color: "#4A4A55", lineHeight: "1.8" }}>
                <p style={{ color: "#8A8A93", marginBottom: "16px" }}>版本更新日期：2025年7月30日 &nbsp;|&nbsp; 版本生效日期：2025年7月20日</p>
                <p style={{ marginBottom: "12px" }}>欢迎您使用体重管理平台（"我们"）的产品和服务，您在访问我们的平台、使用我们的产品和服务时，我们可能会收集和使用您的相关信息，我们知道任何用户的个人信息安全都是至关重要的，我们将重点关注并竭力保护好您的个人信息隐私的安全。</p>
                <p style={{ marginBottom: "12px" }}>本隐私政策适用于您对体重管理平台的访问以及平台所提供的全部产品和服务的使用而提供或留存的信息。体重管理平台是指由【杭州易智体科技有限公司】享有所有权和运营权的移动应用【体重管理平台小程序】等平台的统称。</p>
                <div style={{ background: "#FFF8E1", borderRadius: "8px", padding: "10px 12px", marginBottom: "12px" }}>
                  <p style={{ fontWeight: 600, color: "#1A1A1A", margin: "0 0 4px 0" }}>【重要提醒】</p>
                  <p style={{ margin: 0 }}>本次更新我们主要是进一步明确我们产品和服务收集、使用及共享个人信息的类型、方式和用途等，进一步明确关于您查询、更正和删除个人信息的方式，以及账户注销申请的方式等。</p>
                </div>
                <p style={{ marginBottom: "12px" }}>请您在继续使用体重管理平台产品或服务前务必认真仔细阅读并确认充分理解本隐私政策全部规则和要点，一旦您选择使用或在我们更新本隐私政策后继续使用我们的产品和服务，即视为您同意本隐私政策（含更新版本）的全部内容。</p>
                <AgreementSection title="一、我们如何收集和使用您的个人信息">
                  {"个人信息是指以电子或者其他方式记录的能够单独或者与其他信息，结合识别特定自然人身份或者反映特定自然人活动情况的各种信息。\n\n我们根据《中华人民共和国网络安全法》和《信息安全技术个人信息安全规范》（GB/T 35273-2017）以及其它相关法律法规的要求，并严格遵循正当、合法、必要的原则收集和使用您的个人信息。\n\n（一）帮助您成为我们的在线注册用户\n• 账户注册：为接受体重管理平台全面的服务，您应首先注册一个用户账号，需至少提供账户名、密码、电话号码（用于身份验证）或电子邮箱地址。\n• 第三方登录：如您通过微信等第三方平台授权登陆的，我们仍然需要绑定您的电话号码来验证您的身份。\n• 账户信息完善：您可以补充昵称、性别、生日、兴趣爱好以及实名验证的相关信息。\n\n（二）向您提供产品和服务\n• 信息展示和搜索：体重管理平台提供丰富的健康相关信息，包含文章、课程等。在您进行信息浏览时，我们可能会收集您的设备信息，包括设备名称、设备型号、唯一设备识别码、操作系统版本等。\n• 搜索服务：为提供搜索服务，我们将收集您的日志信息，包括搜索关键词信息和点击的链接等。\n\n（三）附加功能\n• 位置信息：当您使用相关服务时，我们可能会收集和处理有关您的位置信息\n• 客户服务：当您提起投诉、申诉或进行评价时，我们可能需要您提供联系方式等个人信息\n• 日历权限：用于完成插入日历行程提醒等功能\n• 摄像头权限：用于完成拍照等功能\n• 运动与健身权限：用于在小程序中展示运动步数相关功能\n• 图片上传：用于上传本地照片实现饮食、用药等添加功能\n• 语音技术：用于语音咨询或与客服机器人进行咨询和互动"}
                </AgreementSection>
                <AgreementSection title="二、如何联系我们">
                  {"公司名称：杭州易智体科技有限公司\n注册地址：浙江省杭州市萧山区宁围街道建设三路733号信息港五期4号楼301-27室\n邮箱：276599630@qq.com\n\n为保障我们高效处理您的问题并及时向您反馈，需要您提交身份证明、有效联系方式和书面请求及相关证据，我们会在验证您的身份处理您的请求。一般情况下，我们将在三十天内回复。"}
                </AgreementSection>
                <AgreementSection title="三、争议解决">
                  {"因本政策以及我们处理您个人信息事宜引起的任何争议，您可随时联系体重管理平台要求给出回复，如果您对我们的回复不满意的，认为我们的个人信息处理行为严重损害了您的合法权益的，您还可以通过向杭州易智体科技有限公司所在地（杭州）有管辖权的人民法院提起诉讼来寻求解决方案。"}
                </AgreementSection>
                <AgreementSection title="四、定义和名词解释">
                  {"体重管理平台：中国领先的健康体重管理领域领导者，互联网产品和服务品牌。\n\n个人信息：个人信息是指以电子或者其他方式记录的能够单独或者与其他信息结合识别自然人个人身份的各种信息，包括但不限于自然人的姓名、出生日期、身份证件号码、个人生物识别信息、住址、电话号码等。\n\n个人敏感信息：个人敏感信息是指一旦泄露、非法提供或滥用可能危害人身和财产安全，极易导致个人名誉、身心健康受到损害或歧视性待遇等的个人信息。"}
                </AgreementSection>
                <div style={{ textAlign: "center", padding: "12px 0", borderTop: "1px solid #F0F0F5", marginTop: "8px" }}>
                  <p style={{ fontWeight: 600, color: "#1A1A1A", margin: "0 0 4px 0" }}>感谢您对体重管理平台以及体重管理产品和服务的信任和使用！</p>
                  <p style={{ color: "#8A8A93", margin: 0 }}>杭州易智体科技有限公司</p>
                </div>
                <AgreementSection title="附件一：《体重管理平台账户注销须知》">
                  {"亲爱的体重管理平台用户：\n\n一、您可通过体重管理平台小程序中的\"联系我们\"，向我们申请注销您在平台中的账号并删除账号信息，在您提出申请后，我们将通过客服人员联系您并通过您提供的有效身份证明等方式核实您的身份后，在15日内为您注销账户。\n\n二、您在向我们申请注销前，应当认真阅读《账户注销须知》，请您务必审慎阅读、充分理解协议中相关条款内容。"}
                </AgreementSection>
                <div style={{ background: "#FFF8E1", borderRadius: "8px", padding: "10px 12px", marginBottom: "12px" }}>
                  <p style={{ fontWeight: 600, color: "#1A1A1A", margin: "0 0 4px 0" }}>【特别提示】</p>
                  <p style={{ margin: 0 }}>当您按照注销页面提示填写信息、阅读并同意本《注销须知》及相关条款与条件且完成全部注销程序后，即表示您已充分阅读、理解并接受本《注销须知》的全部内容。我们在此善意地提醒您，您的账户一旦注销，将无法恢复，请您谨慎操作。</p>
                </div>
              </div>
              <div style={{ padding: "16px 20px 32px", flexShrink: 0 }}>
                {!scrolledToBottom && (
                  <p style={{ textAlign: "center", fontSize: "12px", color: "#9CA3AF", marginBottom: "10px" }}>
                    请滚动阅读完全部协议内容
                  </p>
                )}
                <button
                  onClick={() => { setHasRead(true); setAgreed(true); setShowAgreement(false); }}
                  disabled={!scrolledToBottom}
                  style={{ width: "100%", padding: "16px", background: scrolledToBottom ? "linear-gradient(135deg, #2B5BFF 0%, #6B8FFF 100%)" : "linear-gradient(135deg, #C8CCDD 0%, #D8DCEE 100%)", color: "#FFFFFF", borderRadius: "16px", fontSize: "16px", fontWeight: 600, border: "none", cursor: scrolledToBottom ? "pointer" : "not-allowed", boxShadow: scrolledToBottom ? "0 4px 20px rgba(43, 91, 255, 0.3)" : "none", transition: "all 0.3s" }}
                >
                  我已阅读，同意授权
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>,
      document.body
    )}
    </>
  );
}

function AgreementSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#1A1A1A", marginBottom: "8px" }}>{title}</h3>
      <p style={{ whiteSpace: "pre-line", margin: 0 }}>{children}</p>
    </div>
  );
}