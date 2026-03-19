import { useState } from "react";
import { useNavigate } from "react-router";
import { User, Heart, BarChart3, Check } from "lucide-react";
import { motion } from "motion/react";

export default function Bind() {
  const navigate = useNavigate();
  const [isBinding, setIsBinding] = useState(false);
  const [step, setStep] = useState<"initial" | "binding" | "success">("initial");

  const handleBind = () => {
    setIsBinding(true);
    setStep("binding");

    // 模拟绑定过程
    setTimeout(() => {
      setStep("success");
      setIsBinding(false);

      // 2秒后跳转到首页
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }, 2000);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(180deg, #FFF5F8 0%, #F5F3FF 100%)",
        backgroundColor: "#FAFAFF"
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full"
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "24px",
          padding: "32px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(10px)"
        }}
      >
        {step === "initial" && (
          <>
            {/* Logo和标题 */}
            <div className="text-center" style={{ marginBottom: "32px" }}>
              <div 
                className="mx-auto flex items-center justify-center"
                style={{
                  width: "96px",
                  height: "96px",
                  borderRadius: "24px",
                  background: "linear-gradient(135deg, #2B5BFF 0%, #6B8FFF 100%)",
                  marginBottom: "24px",
                  boxShadow: "0 4px 20px rgba(43, 91, 255, 0.2)"
                }}
              >
                <div style={{ fontSize: "56px" }}>👨‍⚕️</div>
              </div>
              <h1 
                style={{
                  fontSize: "24px",
                  fontWeight: 600,
                  color: "#1A1A1A",
                  marginBottom: "8px"
                }}
              >
                健康管理小程序
              </h1>
              <p style={{ fontSize: "14px", color: "#8A8A93" }}>
                您的专属AI健康助手
              </p>
            </div>

            {/* 功能介绍 */}
            <div className="space-y-3" style={{ marginBottom: "32px" }}>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-start gap-3"
                style={{
                  padding: "16px",
                  backgroundColor: "#EAEBFF",
                  borderRadius: "16px",
                  border: "1px solid rgba(43, 91, 255, 0.1)"
                }}
              >
                <div 
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "linear-gradient(135deg, #2B5BFF 0%, #6B8FFF 100%)",
                    borderRadius: "12px"
                  }}
                >
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 
                    style={{
                      fontSize: "15px",
                      fontWeight: 600,
                      color: "#1A1A1A",
                      marginBottom: "4px"
                    }}
                  >
                    智能导诊
                  </h3>
                  <p style={{ fontSize: "13px", color: "#8A8A93" }}>
                    AI问诊评估，制定个性化健康方案
                  </p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-start gap-3"
                style={{
                  padding: "16px",
                  backgroundColor: "#EAEBFF",
                  borderRadius: "16px",
                  border: "1px solid rgba(43, 91, 255, 0.1)"
                }}
              >
                <div 
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "linear-gradient(135deg, #2B5BFF 0%, #6B8FFF 100%)",
                    borderRadius: "12px"
                  }}
                >
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 
                    style={{
                      fontSize: "15px",
                      fontWeight: 600,
                      color: "#1A1A1A",
                      marginBottom: "4px"
                    }}
                  >
                    每日打卡
                  </h3>
                  <p style={{ fontSize: "13px", color: "#8A8A93" }}>
                    记录体重、饮食、运动，追踪进度
                  </p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-start gap-3"
                style={{
                  padding: "16px",
                  backgroundColor: "#EAEBFF",
                  borderRadius: "16px",
                  border: "1px solid rgba(43, 91, 255, 0.1)"
                }}
              >
                <div 
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "linear-gradient(135deg, #2B5BFF 0%, #6B8FFF 100%)",
                    borderRadius: "12px"
                  }}
                >
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 
                    style={{
                      fontSize: "15px",
                      fontWeight: 600,
                      color: "#1A1A1A",
                      marginBottom: "4px"
                    }}
                  >
                    数据分析
                  </h3>
                  <p style={{ fontSize: "13px", color: "#8A8A93" }}>
                    可视化趋势图表，智能预警系统
                  </p>
                </div>
              </motion.div>
            </div>

            {/* 绑定按钮 */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBind}
              disabled={isBinding}
              className="w-full font-semibold transition-all disabled:opacity-50"
              style={{
                padding: "16px",
                background: "linear-gradient(135deg, #2B5BFF 0%, #6B8FFF 100%)",
                color: "#FFFFFF",
                borderRadius: "16px",
                fontSize: "16px",
                border: "none",
                cursor: isBinding ? "not-allowed" : "pointer",
                boxShadow: "0 4px 20px rgba(43, 91, 255, 0.3)"
              }}
            >
              一键绑定用户信息
            </motion.button>

            {/* 隐私说明 */}
            <p 
              className="text-center"
              style={{
                fontSize: "12px",
                color: "#8A8A93",
                marginTop: "16px"
              }}
            >
              绑定后即表示您同意《用户协议》和《隐私政策》
            </p>
          </>
        )}

        {step === "binding" && (
          <div className="text-center" style={{ padding: "48px 0" }}>
            <div 
              className="mx-auto"
              style={{
                width: "64px",
                height: "64px",
                marginBottom: "24px"
              }}
            >
              <div 
                className="w-full h-full rounded-full animate-spin"
                style={{
                  border: "4px solid #EAEBFF",
                  borderTopColor: "#2B5BFF"
                }}
              ></div>
            </div>
            <h2 
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: "#1A1A1A",
                marginBottom: "8px"
              }}
            >
              正在绑定中...
            </h2>
            <p style={{ fontSize: "14px", color: "#8A8A93" }}>
              请稍候，正在获取您的用户信息
            </p>
          </div>
        )}

        {step === "success" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center"
            style={{ padding: "48px 0" }}
          >
            <div 
              className="mx-auto flex items-center justify-center"
              style={{
                width: "80px",
                height: "80px",
                background: "linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)",
                borderRadius: "50%",
                marginBottom: "24px",
                boxShadow: "0 4px 20px rgba(76, 175, 80, 0.3)"
              }}
            >
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 
              style={{
                fontSize: "24px",
                fontWeight: 600,
                color: "#1A1A1A",
                marginBottom: "8px"
              }}
            >
              绑定成功！
            </h2>
            <p style={{ fontSize: "14px", color: "#8A8A93" }}>
              正在跳转到首页...
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
