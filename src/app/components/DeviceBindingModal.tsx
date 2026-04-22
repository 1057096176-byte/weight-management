import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Watch, X, CheckCircle, Bluetooth, Loader2 } from "lucide-react";

interface DeviceBindingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBindSuccess?: () => void; // 绑定成功的回调
}

export function DeviceBindingModal({ isOpen, onClose, onBindSuccess }: DeviceBindingModalProps) {
  type BindingStage = "intro" | "searching" | "connecting" | "success";
  const [bindingStage, setBindingStage] = useState<BindingStage>("intro");

  const handleBindClick = async () => {
    // 直接关闭弹窗并提示绑定成功
    onBindSuccess?.();
    onClose();
    // 重置状态
    setTimeout(() => setBindingStage("intro"), 300);
    // 提示绑定成功
    alert("绑定成功");
  };

  const handleClose = () => {
    if (bindingStage !== "searching" && bindingStage !== "connecting") {
      onClose();
      // 重置状态
      setTimeout(() => setBindingStage("intro"), 300);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 遮罩层 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            onClick={handleClose}
          />

          {/* 弹窗内容 */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50"
            style={{
              backgroundColor: "#FFFFFF",
              borderTopLeftRadius: "24px",
              borderTopRightRadius: "24px",
              maxHeight: "85vh",
              overflowY: "auto"
            }}
          >
            {/* 顶部关闭栏 */}
            <div
              className="sticky top-0 z-10 flex items-center justify-between p-4"
              style={{
                backgroundColor: "#FFFFFF",
                borderBottom: "1px solid #EAEBFF"
              }}
            >
              <div style={{ width: "32px" }} />
              <div
                style={{
                  width: "40px",
                  height: "4px",
                  backgroundColor: "#D1D5DB",
                  borderRadius: "2px"
                }}
              />
              <button
                onClick={handleClose}
                disabled={bindingStage === "searching" || bindingStage === "connecting"}
                className="p-2 rounded-lg transition-colors"
                style={{ 
                  color: "#8A8A93",
                  opacity: (bindingStage === "searching" || bindingStage === "connecting") ? 0.5 : 1,
                  cursor: (bindingStage === "searching" || bindingStage === "connecting") ? "not-allowed" : "pointer"
                }}
                onMouseEnter={(e) => {
                  if (bindingStage !== "searching" && bindingStage !== "connecting") {
                    e.currentTarget.style.backgroundColor = "#EAEBFF";
                  }
                }}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 内容区域 */}
            <div className="p-6">
              {bindingStage === "intro" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* 图标 - 华为logo */}
                  <div
                    className="flex items-center justify-center mx-auto"
                    style={{
                      width: "100px",
                      height: "100px",
                      background: "#CF0921",
                      borderRadius: "24px",
                      marginBottom: "24px"
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm">华为设备</div>
                  </div>

                  {/* 标题 */}
                  <h3 style={{ fontSize: "24px", fontWeight: 600, color: "#1A1A1A", marginBottom: "12px", textAlign: "center" }}>
                    绑定智能设备
                  </h3>
                  <p style={{ fontSize: "15px", color: "#8A8A93", marginBottom: "32px", lineHeight: "1.6", textAlign: "center" }}>
                    自动同步健康数据，全方位了解您的身体状态
                  </p>

                  {/* 功能介绍 */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px" }}>
                    <div
                      className="flex items-start gap-4 p-4"
                      style={{
                        backgroundColor: "#FAFAFF",
                        borderRadius: "16px",
                        border: "1px solid #EAEBFF"
                      }}
                    >
                      <div style={{
                        width: "40px",
                        height: "40px",
                        flexShrink: 0,
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, #EAEBFF 0%, #F5F3FF 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <CheckCircle className="w-5 h-5" style={{ color: "#2B5BFF" }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "16px", fontWeight: 600, color: "#1A1A1A", marginBottom: "4px" }}>
                          自动数据同步
                        </div>
                        <div style={{ fontSize: "14px", color: "#8A8A93", lineHeight: "1.5" }}>
                          步数、心率、睡眠等健康数据自动同步，无需手动录入
                        </div>
                      </div>
                    </div>

                    <div
                      className="flex items-start gap-4 p-4"
                      style={{
                        backgroundColor: "#FAFAFF",
                        borderRadius: "16px",
                        border: "1px solid #EAEBFF"
                      }}
                    >
                      <div style={{
                        width: "40px",
                        height: "40px",
                        flexShrink: 0,
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, #EAEBFF 0%, #F5F3FF 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <CheckCircle className="w-5 h-5" style={{ color: "#2B5BFF" }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "16px", fontWeight: 600, color: "#1A1A1A", marginBottom: "4px" }}>
                          全天候监测
                        </div>
                        <div style={{ fontSize: "14px", color: "#8A8A93", lineHeight: "1.5" }}>
                          24小时连续监测心率、睡眠质量等关键健康指标
                        </div>
                      </div>
                    </div>

                    <div
                      className="flex items-start gap-4 p-4"
                      style={{
                        backgroundColor: "#FAFAFF",
                        borderRadius: "16px",
                        border: "1px solid #EAEBFF"
                      }}
                    >
                      <div style={{
                        width: "40px",
                        height: "40px",
                        flexShrink: 0,
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, #EAEBFF 0%, #F5F3FF 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <CheckCircle className="w-5 h-5" style={{ color: "#2B5BFF" }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "16px", fontWeight: 600, color: "#1A1A1A", marginBottom: "4px" }}>
                          智能分析报告
                        </div>
                        <div style={{ fontSize: "14px", color: "#8A8A93", lineHeight: "1.5" }}>
                          基于设备数据生成专业健康报告和个性化建议
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <button
                    onClick={handleBindClick}
                    className="font-medium transition-all flex items-center justify-center gap-2 w-full"
                    style={{
                      padding: "16px",
                      background: "linear-gradient(135deg, #2B5BFF 0%, #6B8FFF 100%)",
                      color: "#FFFFFF",
                      borderRadius: "16px",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "16px",
                      boxShadow: "0 4px 16px rgba(43, 91, 255, 0.25)"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 6px 20px rgba(43, 91, 255, 0.35)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 16px rgba(43, 91, 255, 0.25)";
                    }}
                  >
                    <CheckCircle className="w-5 h-5" />
                    立即绑定设备
                  </button>

                  <button
                    onClick={handleClose}
                    className="font-medium transition-all w-full"
                    style={{
                      padding: "14px",
                      marginTop: "12px",
                      backgroundColor: "transparent",
                      color: "#8A8A93",
                      borderRadius: "16px",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "15px"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#F5F5F5";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    稍后再说
                  </button>
                </motion.div>
              )}

              {bindingStage === "searching" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  {/* 搜索动画 */}
                  <div
                    className="flex items-center justify-center mx-auto mb-6"
                    style={{
                      width: "120px",
                      height: "120px",
                      background: "linear-gradient(135deg, #EAEBFF 0%, #F5F3FF 100%)",
                      borderRadius: "24px",
                      position: "relative"
                    }}
                  >
                    <Bluetooth className="w-16 h-16" style={{ color: "#2B5BFF" }} />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{
                        position: "absolute",
                        inset: -8,
                        border: "3px solid #2B5BFF",
                        borderRadius: "28px"
                      }}
                    />
                  </div>

                  <h3 style={{ fontSize: "22px", fontWeight: 600, color: "#1A1A1A", marginBottom: "12px" }}>
                    正在搜索设备...
                  </h3>
                  <p style={{ fontSize: "15px", color: "#8A8A93", lineHeight: "1.6" }}>
                    请确保您的设备已开启蓝牙
                  </p>

                  {/* 搜索中的设备列表动画 */}
                  <div className="mt-8 space-y-3">
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: [0, 1, 0.5], x: 0 }}
                        transition={{ delay: i * 0.3, duration: 1, repeat: Infinity }}
                        className="flex items-center gap-3 p-3 rounded-xl"
                        style={{
                          backgroundColor: "#FAFAFF",
                          border: "1px solid #EAEBFF"
                        }}
                      >
                        <Loader2 className="w-5 h-5 animate-spin" style={{ color: "#2B5BFF" }} />
                        <span style={{ fontSize: "14px", color: "#8A8A93" }}>
                          扫描附近设备...
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {bindingStage === "connecting" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  {/* 连接动画 */}
                  <div
                    className="flex items-center justify-center mx-auto mb-6"
                    style={{
                      width: "120px",
                      height: "120px",
                      background: "linear-gradient(135deg, #EAEBFF 0%, #F5F3FF 100%)",
                      borderRadius: "24px",
                      position: "relative"
                    }}
                  >
                    <Watch className="w-16 h-16" style={{ color: "#2B5BFF" }} />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      style={{
                        position: "absolute",
                        inset: -8,
                        borderRadius: "28px",
                        border: "3px solid transparent",
                        borderTopColor: "#2B5BFF",
                        borderRightColor: "#2B5BFF"
                      }}
                    />
                  </div>

                  <h3 style={{ fontSize: "22px", fontWeight: 600, color: "#1A1A1A", marginBottom: "12px" }}>
                    正在连接设备...
                  </h3>
                  <p style={{ fontSize: "15px", color: "#8A8A93", marginBottom: "24px", lineHeight: "1.6" }}>
                    华为 Watch GT 3 Pro
                  </p>

                  {/* 连接步骤 */}
                  <div className="space-y-3">
                    {[
                      { text: "建立蓝牙连接", done: true },
                      { text: "验证设备信息", done: true },
                      { text: "同步健康数据", done: false }
                    ].map((step, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.3 }}
                        className="flex items-center gap-3 p-3 rounded-xl"
                        style={{
                          backgroundColor: step.done ? "#F0F9FF" : "#FAFAFF",
                          border: `1px solid ${step.done ? "#BAE6FD" : "#EAEBFF"}`
                        }}
                      >
                        {step.done ? (
                          <CheckCircle className="w-5 h-5" style={{ color: "#0EA5E9" }} />
                        ) : (
                          <Loader2 className="w-5 h-5 animate-spin" style={{ color: "#2B5BFF" }} />
                        )}
                        <span style={{ fontSize: "14px", color: step.done ? "#0369A1" : "#8A8A93" }}>
                          {step.text}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {bindingStage === "success" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  {/* 成功动画 */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="flex items-center justify-center mx-auto mb-6"
                    style={{
                      width: "120px",
                      height: "120px",
                      background: "linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)",
                      borderRadius: "24px"
                    }}
                  >
                    <CheckCircle className="w-20 h-20" style={{ color: "#10B981" }} />
                  </motion.div>

                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{ fontSize: "24px", fontWeight: 600, color: "#1A1A1A", marginBottom: "12px" }}
                  >
                    绑定成功！
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    style={{ fontSize: "15px", color: "#8A8A93", marginBottom: "24px", lineHeight: "1.6" }}
                  >
                    您的华为 Watch GT 3 Pro 已成功绑定<br />
                    健康数据将自动同步
                  </motion.p>

                  {/* 成功提示卡片 */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    style={{
                      padding: "16px",
                      backgroundColor: "#ECFDF5",
                      borderRadius: "16px",
                      border: "1px solid #A7F3D0"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <CheckCircle className="w-5 h-5" style={{ color: "#10B981" }} />
                      <span style={{ fontSize: "14px", fontWeight: 600, color: "#047857" }}>
                        自动同步已开启
                      </span>
                    </div>
                    <div style={{ fontSize: "13px", color: "#059669", lineHeight: "1.5" }}>
                      设备数据将每小时自动同步一次，您也可以在设备管理页面手动同步
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}