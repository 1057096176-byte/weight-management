import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Watch, X, Battery, RefreshCw, Settings, CheckCircle } from "lucide-react";

interface DeviceInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeviceInfoModal({ isOpen, onClose }: DeviceInfoModalProps) {
  const navigate = useNavigate();
  const [isSyncing, setIsSyncing] = useState(false);

  // 模拟设备数据（与Devices.tsx保持一致）
  const deviceInfo = {
    model: "华为 Watch GT 3 Pro",
    battery: 85,
    lastSync: "2026-03-16 14:30",
    syncStatus: "success" as const
  };

  const handleSync = async () => {
    setIsSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSyncing(false);
  };

  const handleManageClick = () => {
    onClose();
    navigate("/profile/devices");
  };

  const getSyncStatusText = () => {
    switch (deviceInfo.syncStatus) {
      case "success": return "同步成功";
      case "syncing": return "同步中...";
      case "failed": return "同步失败";
    }
  };

  const getSyncStatusColor = () => {
    switch (deviceInfo.syncStatus) {
      case "success": return "#4CAF50";
      case "syncing": return "#2B5BFF";
      case "failed": return "#FF4444";
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
            onClick={onClose}
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
                onClick={onClose}
                className="p-2 rounded-lg transition-colors"
                style={{ color: "#8A8A93" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#EAEBFF"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 内容区域 */}
            <div className="p-6">
              {/* 设备信息头部 */}
              <div className="flex items-center gap-4" style={{ marginBottom: "24px" }}>
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: "64px",
                    height: "64px",
                    backgroundColor: "#EAEBFF",
                    borderRadius: "16px"
                  }}
                >
                  <Watch className="w-8 h-8" style={{ color: "#2B5BFF" }} />
                </div>
                <div className="flex-1">
                  <h3 style={{ fontSize: "20px", fontWeight: 600, color: "#1A1A1A", marginBottom: "4px" }}>
                    {deviceInfo.model}
                  </h3>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" style={{ color: "#4CAF50" }} />
                    <span style={{ fontSize: "14px", color: "#4CAF50" }}>已连接</span>
                  </div>
                </div>
              </div>

              {/* 设备详情 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
                {/* 设备型号 */}
                <div
                  className="flex items-center justify-between p-4"
                  style={{
                    backgroundColor: "#FAFAFF",
                    borderRadius: "12px",
                    border: "1px solid #EAEBFF"
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Watch className="w-5 h-5" style={{ color: "#2B5BFF" }} />
                    <span style={{ fontSize: "14px", color: "#8A8A93" }}>设备型号</span>
                  </div>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "#1A1A1A" }}>
                    {deviceInfo.model}
                  </span>
                </div>

                {/* 电量 */}
                <div
                  className="flex items-center justify-between p-4"
                  style={{
                    backgroundColor: "#FAFAFF",
                    borderRadius: "12px",
                    border: "1px solid #EAEBFF"
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Battery className="w-5 h-5" style={{ color: "#2B5BFF" }} />
                    <span style={{ fontSize: "14px", color: "#8A8A93" }}>电量</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div style={{
                      width: "60px",
                      height: "8px",
                      backgroundColor: "#E5E7EB",
                      borderRadius: "4px",
                      overflow: "hidden"
                    }}>
                      <div style={{
                        width: `${deviceInfo.battery}%`,
                        height: "100%",
                        backgroundColor: deviceInfo.battery > 20 ? "#4CAF50" : "#FF4444",
                        borderRadius: "4px",
                        transition: "width 0.3s"
                      }} />
                    </div>
                    <span style={{ fontSize: "14px", fontWeight: 600, color: "#1A1A1A" }}>
                      {deviceInfo.battery}%
                    </span>
                  </div>
                </div>

                {/* 同步状态 */}
                <div
                  className="flex items-center justify-between p-4"
                  style={{
                    backgroundColor: "#FAFAFF",
                    borderRadius: "12px",
                    border: "1px solid #EAEBFF"
                  }}
                >
                  <div className="flex items-center gap-3">
                    <RefreshCw className={`w-5 h-5 ${isSyncing ? "animate-spin" : ""}`} style={{ color: "#2B5BFF" }} />
                    <span style={{ fontSize: "14px", color: "#8A8A93" }}>同步状态</span>
                  </div>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: getSyncStatusColor() }}>
                    {getSyncStatusText()}
                  </span>
                </div>

                {/* 最后同步 */}
                <div
                  className="flex items-center justify-between p-4"
                  style={{
                    backgroundColor: "#FAFAFF",
                    borderRadius: "12px",
                    border: "1px solid #EAEBFF"
                  }}
                >
                  <div className="flex items-center gap-3">
                    <RefreshCw className="w-5 h-5" style={{ color: "#2B5BFF" }} />
                    <span style={{ fontSize: "14px", color: "#8A8A93" }}>最后同步</span>
                  </div>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "#1A1A1A" }}>
                    {deviceInfo.lastSync}
                  </span>
                </div>
              </div>

              {/* 今日数据快览 */}
              <div
                style={{
                  padding: "16px",
                  backgroundColor: "#F0F9FF",
                  borderRadius: "12px",
                  border: "1px solid #BAE6FD",
                  marginBottom: "24px"
                }}
              >
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#0369A1", marginBottom: "12px" }}>
                  今日数据快览
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <div style={{ fontSize: "12px", color: "#0284C7", marginBottom: "4px" }}>步数</div>
                    <div style={{ fontSize: "18px", fontWeight: 600, color: "#0369A1" }}>8,234</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", color: "#0284C7", marginBottom: "4px" }}>心率</div>
                    <div style={{ fontSize: "18px", fontWeight: 600, color: "#0369A1" }}>72 bpm</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", color: "#0284C7", marginBottom: "4px" }}>睡眠</div>
                    <div style={{ fontSize: "18px", fontWeight: 600, color: "#0369A1" }}>7.5h</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", color: "#0284C7", marginBottom: "4px" }}>卡路里</div>
                    <div style={{ fontSize: "18px", fontWeight: 600, color: "#0369A1" }}>425 kcal</div>
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div style={{ marginBottom: "12px" }}>
                <button
                  onClick={handleSync}
                  disabled={isSyncing}
                  className="w-full flex items-center justify-center gap-2 font-medium transition-all"
                  style={{
                    padding: "14px",
                    background: isSyncing ? "#8A8A93" : "linear-gradient(135deg, #2B5BFF 0%, #6B8FFF 100%)",
                    color: "#FFFFFF",
                    borderRadius: "16px",
                    border: "none",
                    cursor: isSyncing ? "not-allowed" : "pointer",
                    boxShadow: "0 4px 12px rgba(43, 91, 255, 0.2)"
                  }}
                  onMouseEnter={(e) => {
                    if (!isSyncing) {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 6px 16px rgba(43, 91, 255, 0.3)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(43, 91, 255, 0.2)";
                  }}
                >
                  <RefreshCw className={`w-5 h-5 ${isSyncing ? "animate-spin" : ""}`} />
                  {isSyncing ? "同步中..." : "立即同步"}
                </button>
              </div>

              <button
                onClick={onClose}
                className="font-medium transition-all w-full"
                style={{
                  padding: "14px",
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
                关闭
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}