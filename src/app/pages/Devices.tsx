import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Watch, Battery, RefreshCw, Unlink, CheckCircle, AlertCircle, Plus, Shield, Activity, Footprints, Heart, Moon, ChevronRight } from "lucide-react";

interface DeviceInfo {
  model: string;
  battery: number;
  lastSync: string;
  syncStatus: "success" | "syncing" | "failed";
}

interface Permission {
  name: string;
  icon: typeof Activity;
  granted: boolean;
  description: string;
}

export default function Devices() {
  const navigate = useNavigate();
  const [deviceBound, setDeviceBound] = useState(false); // 默认未绑定
  const [isSyncing, setIsSyncing] = useState(false);
  const [showBindingSteps, setShowBindingSteps] = useState(false);

  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    model: "华为 Watch GT 3 Pro",
    battery: 85,
    lastSync: "2026-03-16 14:30",
    syncStatus: "success"
  });

  const [permissions, setPermissions] = useState<Permission[]>([
    { name: "步数数据", icon: Footprints, granted: true, description: "读取每日步数、距离、卡路里" },
    { name: "心率数据", icon: Heart, granted: true, description: "读取实时心率、静息心率" },
    { name: "睡眠数据", icon: Moon, granted: true, description: "读取睡眠时长、深浅睡眠" },
    { name: "运动数据", icon: Activity, granted: false, description: "读取运动类型、时长、配速" },
  ]);

  const handleSync = async () => {
    setIsSyncing(true);
    setDeviceInfo(prev => ({ ...prev, syncStatus: "syncing" }));
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setDeviceInfo(prev => ({
      ...prev,
      lastSync: new Date().toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      }).replace(/\//g, "-"),
      syncStatus: "success"
    }));
    setIsSyncing(false);
  };

  const handleUnbind = () => {
    if (confirm("确定要解绑设备吗？解绑后将停止数据同步。")) {
      setDeviceBound(false);
      setShowBindingSteps(false);
    }
  };

  const handleBind = async () => {
    setShowBindingSteps(false);
    // 模拟绑定过程
    await new Promise(resolve => setTimeout(resolve, 1000));
    setDeviceBound(true);
    setDeviceInfo({
      model: "华为 Watch GT 3 Pro",
      battery: 85,
      lastSync: new Date().toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      }).replace(/\//g, "-"),
      syncStatus: "success"
    });
  };

  const handleReauthorize = () => {
    // 模拟重新授权
    setPermissions(prev => prev.map(p => ({ ...p, granted: true })));
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
    <div
      className="min-h-screen pb-20"
      style={{
        background: "linear-gradient(180deg, #FFF5F8 0%, #F5F3FF 100%)",
        backgroundColor: "#FAFAFF"
      }}
    >
      {/* 顶部导航 */}
      <div
        className="px-4 py-3 flex items-center justify-between sticky top-0 z-10"
        style={{
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #EAEBFF",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.02)"
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg transition-colors"
          style={{ color: "#1A1A1A" }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#EAEBFF"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 style={{ fontSize: "16px", fontWeight: 600, color: "#1A1A1A" }}>智能设备管理</h1>
        <div style={{ width: "36px" }} />
      </div>

      <div className="max-w-4xl mx-auto p-4" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {deviceBound ? (
          <>
            {/* 设备信息卡片 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "24px",
                padding: "24px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.5)"
              }}
            >
              <div className="flex items-center gap-4" style={{ marginBottom: "20px" }}>
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
                  <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#1A1A1A", marginBottom: "4px" }}>
                    {deviceInfo.model}
                  </h3>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" style={{ color: "#4CAF50" }} />
                    <span style={{ fontSize: "14px", color: "#4CAF50" }}>已连接</span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {/* 设备型号 */}
                <div
                  className="flex items-center justify-between p-3"
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
                  className="flex items-center justify-between p-3"
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
                  className="flex items-center justify-between p-3"
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
                  className="flex items-center justify-between p-3"
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
            </motion.div>

            {/* 授权权限 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "24px",
                padding: "24px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.5)"
              }}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: "16px" }}>
                <h3 style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#1A1A1A",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <Shield className="w-5 h-5" style={{ color: "#2B5BFF" }} />
                  授权权限
                </h3>
                <button
                  onClick={handleReauthorize}
                  style={{
                    fontSize: "14px",
                    color: "#2B5BFF",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 500
                  }}
                >
                  全部授权
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {permissions.map((permission, index) => {
                  const Icon = permission.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3"
                      style={{
                        backgroundColor: "#FAFAFF",
                        borderRadius: "12px",
                        border: "1px solid #EAEBFF"
                      }}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <Icon className="w-5 h-5" style={{ color: "#2B5BFF" }} />
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: 500, color: "#1A1A1A", marginBottom: "2px" }}>
                            {permission.name}
                          </div>
                          <div style={{ fontSize: "12px", color: "#8A8A93" }}>
                            {permission.description}
                          </div>
                        </div>
                      </div>
                      <div style={{
                        padding: "4px 12px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: 500,
                        backgroundColor: permission.granted ? "#E8F5E9" : "#FFE5E5",
                        color: permission.granted ? "#4CAF50" : "#FF4444"
                      }}>
                        {permission.granted ? "已授权" : "未授权"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* 操作按钮 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {/* 同步测试 */}
              <button
                onClick={handleSync}
                disabled={isSyncing}
                className="flex items-center justify-center gap-2 font-medium transition-all"
                style={{
                  padding: "16px",
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
                {isSyncing ? "同步测试中..." : "同步测试"}
              </button>

              <div style={{ display: "flex", gap: "12px" }}>
                {/* 重新授权 */}
                <button
                  onClick={handleReauthorize}
                  className="flex-1 flex items-center justify-center gap-2 font-medium transition-all"
                  style={{
                    padding: "14px",
                    backgroundColor: "#FFFFFF",
                    border: "2px solid #EAEBFF",
                    color: "#2B5BFF",
                    borderRadius: "16px",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#EAEBFF";
                    e.currentTarget.style.borderColor = "#2B5BFF";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#FFFFFF";
                    e.currentTarget.style.borderColor = "#EAEBFF";
                  }}
                >
                  <Shield className="w-5 h-5" />
                  重新授权
                </button>

                {/* 解绑设备 */}
                <button
                  onClick={handleUnbind}
                  className="flex-1 flex items-center justify-center gap-2 font-medium transition-all"
                  style={{
                    padding: "14px",
                    backgroundColor: "#FFFFFF",
                    border: "2px solid #FFE5E5",
                    color: "#FF4444",
                    borderRadius: "16px",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#FFE5E5";
                    e.currentTarget.style.borderColor = "#FF4444";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#FFFFFF";
                    e.currentTarget.style.borderColor = "#FFE5E5";
                  }}
                >
                  <Unlink className="w-5 h-5" />
                  解绑设备
                </button>
              </div>
            </motion.div>

            {/* 同步数据说明 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "24px",
                padding: "20px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.5)"
              }}
            >
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1A1A1A", marginBottom: "12px" }}>
                同步数据说明
              </h3>
              <ul style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px", color: "#8A8A93", lineHeight: "1.6" }}>
                <li>• 自动同步：每隔2小时自动同步一次设备数据</li>
                <li>• 手动同步：点击"同步测试"按钮立即同步</li>
                <li>• 同步内容：步数、心率、睡眠、运动等健康数据</li>
                <li>• 数据安全：所有数据均加密传输和存储</li>
              </ul>
            </motion.div>
          </>
        ) : (
          <>
            {/* 未绑定状态 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "24px",
                padding: "40px 24px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.5)",
                textAlign: "center"
              }}
            >
              <div
                className="flex items-center justify-center mx-auto"
                style={{
                  width: "100px",
                  height: "100px",
                  background: "linear-gradient(135deg, #EAEBFF 0%, #F5F3FF 100%)",
                  borderRadius: "24px",
                  marginBottom: "24px"
                }}
              >
                <Watch className="w-12 h-12" style={{ color: "#2B5BFF" }} />
              </div>
              <h3 style={{ fontSize: "20px", fontWeight: 600, color: "#1A1A1A", marginBottom: "8px" }}>
                绑定华为手表
              </h3>
              <p style={{ fontSize: "15px", color: "#8A8A93", marginBottom: "32px", lineHeight: "1.6" }}>
                自动同步健康数据，全方位了解您的身体状态
              </p>
              <button
                onClick={() => setShowBindingSteps(!showBindingSteps)}
                className="font-medium transition-all flex items-center justify-center gap-2 mx-auto"
                style={{
                  padding: "16px 32px",
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
                <Plus className="w-5 h-5" />
                立即绑定
              </button>
            </motion.div>

            {/* 绑定操作步骤 */}
            <AnimatePresence>
              {showBindingSteps && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "24px",
                    padding: "24px",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.5)",
                    overflow: "hidden"
                  }}
                >
                  <h3 style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#1A1A1A",
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}>
                    <Watch className="w-5 h-5" style={{ color: "#2B5BFF" }} />
                    简易操作步骤
                  </h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {[
                      { step: "1", title: "打开华为运动健康APP", desc: "确保已安装并登录账号" },
                      { step: "2", title: "开启蓝牙并连接手表", desc: "在APP中搜索并连接您的设备" },
                      { step: "3", title: "授权数据访问权限", desc: "允许读取健康数据和运动数据" },
                      { step: "4", title: "返回本应用完成绑定", desc: "点击上方【立即绑定】按钮" },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex gap-4"
                        style={{
                          padding: "16px",
                          backgroundColor: "#FAFAFF",
                          borderRadius: "16px",
                          border: "1px solid #EAEBFF"
                        }}
                      >
                        <div style={{
                          width: "32px",
                          height: "32px",
                          flexShrink: 0,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #2B5BFF 0%, #6B8FFF 100%)",
                          color: "#FFFFFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 600,
                          fontSize: "14px"
                        }}>
                          {item.step}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "15px", fontWeight: 600, color: "#1A1A1A", marginBottom: "4px" }}>
                            {item.title}
                          </div>
                          <div style={{ fontSize: "13px", color: "#8A8A93", lineHeight: "1.5" }}>
                            {item.desc}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleBind}
                    className="font-medium transition-all flex items-center justify-center gap-2 w-full"
                    style={{
                      padding: "14px",
                      marginTop: "20px",
                      background: "#2B5BFF",
                      color: "#FFFFFF",
                      borderRadius: "16px",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "15px"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#1E4FE5";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#2B5BFF";
                    }}
                  >
                    <CheckCircle className="w-5 h-5" />
                    我已完成上述步骤，开始绑定
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 功能介绍 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "24px",
                padding: "24px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.5)"
              }}
            >
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1A1A1A", marginBottom: "16px" }}>
                绑定后可享受
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { icon: Footprints, title: "步数追踪", desc: "实时记录每日步数和运动距离" },
                  { icon: Heart, title: "心率监测", desc: "24小时连续心率监测和分析" },
                  { icon: Moon, title: "睡眠分析", desc: "深度睡眠、浅睡眠智能分析" },
                  { icon: Activity, title: "运动记录", desc: "多种运动模式自动识别记录" },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3"
                      style={{
                        backgroundColor: "#FAFAFF",
                        borderRadius: "12px",
                        border: "1px solid #EAEBFF"
                      }}
                    >
                      <div style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, #EAEBFF 0%, #F5F3FF 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <Icon className="w-5 h-5" style={{ color: "#2B5BFF" }} />
                      </div>
                      <div className="flex-1">
                        <div style={{ fontSize: "14px", fontWeight: 600, color: "#1A1A1A", marginBottom: "2px" }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: "13px", color: "#8A8A93" }}>
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}