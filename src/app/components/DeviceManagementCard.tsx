import { useState } from "react";
import { motion } from "motion/react";
import { Watch, Battery, RefreshCw, Unlink, CheckCircle, AlertCircle, ChevronRight } from "lucide-react";

interface DeviceInfo {
  model: string;
  battery: number;
  lastSync: string;
}

interface DeviceManagementCardProps {
  deviceBound: boolean;
  deviceInfo: DeviceInfo;
  onBind: () => void;
  onUnbind: () => void;
  onSync: () => void;
}

export function DeviceManagementCard({
  deviceBound,
  deviceInfo,
  onBind,
  onUnbind,
  onSync
}: DeviceManagementCardProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    await onSync();
    setTimeout(() => setIsSyncing(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "24px",
        padding: "24px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
        border: "1px solid rgba(255, 255, 255, 0.5)"
      }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: "16px" }}>
        <div className="flex items-center gap-2">
          <Watch className="w-5 h-5" style={{ color: "#2B5BFF" }} />
          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1A1A1A" }}>智能设备</h3>
        </div>
        {deviceBound && (
          <button
            onClick={() => setShowDetail(!showDetail)}
            className="transition-colors"
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "#2B5BFF",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "0.8"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
          >
            {showDetail ? "收起" : "详情"}
          </button>
        )}
      </div>

      {!deviceBound ? (
        // 未绑定状态
        <div>
          <div
            style={{
              padding: "20px",
              background: "linear-gradient(135deg, #EAEBFF 0%, #F5F3FF 100%)",
              borderRadius: "16px",
              marginBottom: "16px",
              textAlign: "center"
            }}
          >
            <Watch className="w-12 h-12 mx-auto mb-3" style={{ color: "#2B5BFF" }} />
            <h4 style={{ fontSize: "16px", fontWeight: 600, color: "#1A1A1A", marginBottom: "8px" }}>
              绑定华为手表，自动同步健康数据
            </h4>
            <p style={{ fontSize: "14px", color: "#8A8A93", marginBottom: "16px" }}>
              支持步数、心率、血压、睡眠等多维度数据自动同步
            </p>
            <button
              onClick={onBind}
              className="transition-all"
              style={{
                padding: "12px 32px",
                background: "linear-gradient(135deg, #2B5BFF 0%, #6B8FFF 100%)",
                color: "#FFFFFF",
                borderRadius: "16px",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 600
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(43, 91, 255, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              立即绑定
            </button>
          </div>

          <div style={{ padding: "16px", backgroundColor: "#FAFAFF", borderRadius: "16px" }}>
            <h5 style={{ fontSize: "14px", fontWeight: 600, color: "#1A1A1A", marginBottom: "12px" }}>
              简易操作步骤：
            </h5>
            <ol className="list-decimal list-inside space-y-2" style={{ fontSize: "13px", color: "#8A8A93" }}>
              <li>打开手表运动健康APP</li>
              <li>进入设备管理页面</li>
              <li>扫描二维码或输入配对码</li>
              <li>授权数据同步权限</li>
            </ol>
          </div>
        </div>
      ) : (
        // 已绑定状态
        <div>
          <div
            style={{
              padding: "16px",
              background: "linear-gradient(135deg, #EAEBFF 0%, #F5F3FF 100%)",
              borderRadius: "16px",
              marginBottom: "12px"
            }}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: "12px" }}>
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: "48px",
                    height: "48px",
                    backgroundColor: "#2B5BFF",
                    borderRadius: "12px"
                  }}
                >
                  <Watch className="w-6 h-6" style={{ color: "#FFFFFF" }} />
                </div>
                <div>
                  <h4 style={{ fontSize: "15px", fontWeight: 600, color: "#1A1A1A", marginBottom: "2px" }}>
                    {deviceInfo.model}
                  </h4>
                  <p style={{ fontSize: "13px", color: "#8A8A93" }}>已连接</p>
                </div>
              </div>
              <CheckCircle className="w-5 h-5" style={{ color: "#4CAF50" }} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#FFFFFF",
                  borderRadius: "12px"
                }}
              >
                <div className="flex items-center gap-2" style={{ marginBottom: "4px" }}>
                  <Battery className="w-4 h-4" style={{ color: "#2B5BFF" }} />
                  <span style={{ fontSize: "12px", color: "#8A8A93" }}>电量</span>
                </div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "#1A1A1A" }}>
                  {deviceInfo.battery}%
                </div>
              </div>
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#FFFFFF",
                  borderRadius: "12px"
                }}
              >
                <div className="flex items-center gap-2" style={{ marginBottom: "4px" }}>
                  <RefreshCw className="w-4 h-4" style={{ color: "#2B5BFF" }} />
                  <span style={{ fontSize: "12px", color: "#8A8A93" }}>最后同步</span>
                </div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#1A1A1A" }}>
                  {deviceInfo.lastSync}
                </div>
              </div>
            </div>
          </div>

          {showDetail && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ marginBottom: "12px" }}
            >
              <div
                style={{
                  padding: "16px",
                  backgroundColor: "#FAFAFF",
                  borderRadius: "16px",
                  marginBottom: "12px"
                }}
              >
                <h5 style={{ fontSize: "14px", fontWeight: 600, color: "#1A1A1A", marginBottom: "12px" }}>
                  授权权限
                </h5>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {[
                    { name: "步数数据", enabled: true },
                    { name: "心率数据", enabled: true },
                    { name: "血压数据", enabled: true },
                    { name: "睡眠数据", enabled: true },
                    { name: "运动记录", enabled: false }
                  ].map((permission, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2"
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "8px"
                      }}
                    >
                      <span style={{ fontSize: "13px", color: "#1A1A1A" }}>{permission.name}</span>
                      {permission.enabled ? (
                        <CheckCircle className="w-4 h-4" style={{ color: "#4CAF50" }} />
                      ) : (
                        <AlertCircle className="w-4 h-4" style={{ color: "#8A8A93" }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#FFF9E6",
                  border: "1px solid #FFE082",
                  borderRadius: "12px",
                  marginBottom: "12px"
                }}
              >
                <h5 style={{ fontSize: "13px", fontWeight: 600, color: "#F59E0B", marginBottom: "4px" }}>
                  常见问题
                </h5>
                <ul className="list-disc list-inside space-y-1" style={{ fontSize: "12px", color: "#8A8A93" }}>
                  <li>数据同步失败：请检查手表蓝牙连接</li>
                  <li>数据不准确：建议重新校准设备</li>
                  <li>无法连接：请重启设备后重试</li>
                </ul>
              </div>
            </motion.div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="flex-1 transition-all flex items-center justify-center gap-2"
              style={{
                padding: "10px",
                background: isSyncing ? "#8A8A93" : "linear-gradient(135deg, #2B5BFF 0%, #6B8FFF 100%)",
                color: "#FFFFFF",
                borderRadius: "12px",
                border: "none",
                cursor: isSyncing ? "not-allowed" : "pointer",
                fontSize: "14px",
                fontWeight: 500
              }}
              onMouseEnter={(e) => {
                if (!isSyncing) {
                  e.currentTarget.style.opacity = "0.9";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              <RefreshCw
                className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`}
                style={{
                  animation: isSyncing ? "spin 1s linear infinite" : "none"
                }}
              />
              {isSyncing ? "同步中..." : "立即同步"}
            </button>
            <button
              onClick={onUnbind}
              className="transition-all flex items-center justify-center gap-2"
              style={{
                padding: "10px 16px",
                backgroundColor: "#FFFFFF",
                border: "1px solid #FFE5E5",
                color: "#FF4444",
                borderRadius: "12px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 500
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#FFE5E5";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#FFFFFF";
              }}
            >
              <Unlink className="w-4 h-4" />
              解绑
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
