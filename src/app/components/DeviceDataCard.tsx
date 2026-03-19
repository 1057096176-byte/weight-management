import { motion } from "motion/react";
import { Wifi, WifiOff, RefreshCw, Activity } from "lucide-react";

interface DeviceDataCardProps {
  // 移除 time 属性
}

export function DeviceDataCard({}: DeviceDataCardProps) {
  // 模拟设备状态
  const deviceData = {
    isOnline: true,
    lastSync: "5分钟前",
    deviceName: "华为手表",
    batteryLevel: 85,
    todayData: {
      steps: 8543,
      heartRate: 72,
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ marginBottom: "16px" }}
    >
      {/* 设备卡片 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: "#FFFFFF",
          border: "1px solid rgba(234, 235, 255, 0.8)",
          padding: "24px",
          borderRadius: "24px",
          maxWidth: "600px",
          width: "100%",
          boxShadow: "0 4px 20px rgba(43, 91, 255, 0.05)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* 标题和设备状态 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                background: "#2B5BFF",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Activity
                style={{
                  width: "24px",
                  height: "24px",
                  color: "#FFFFFF",
                }}
              />
            </div>
            <div>
              <h3
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  fontSize: "16px",
                  lineHeight: "24px",
                  color: "#1A1A1A",
                  margin: 0,
                }}
              >
                {deviceData.deviceName}
              </h3>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "4px",
                }}
              >
                {deviceData.isOnline ? (
                  <>
                    <Wifi
                      style={{
                        width: "14px",
                        height: "14px",
                        color: "#10B981",
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "12px",
                        lineHeight: "16px",
                        color: "#10B981",
                      }}
                    >
                      在线
                    </span>
                  </>
                ) : (
                  <>
                    <WifiOff
                      style={{
                        width: "14px",
                        height: "14px",
                        color: "#EF4444",
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "12px",
                        lineHeight: "16px",
                        color: "#EF4444",
                      }}
                    >
                      离线
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* 同步按钮 */}
          <button
            onClick={() => {
              // 模拟同步
              console.log("同步设备数据");
            }}
            style={{
              background: "rgba(43, 91, 255, 0.1)",
              border: "1px solid rgba(43, 91, 255, 0.2)",
              borderRadius: "16px",
              padding: "8px 16px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(43, 91, 255, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(43, 91, 255, 0.1)";
            }}
          >
            <RefreshCw
              style={{
                width: "14px",
                height: "14px",
                color: "#2B5BFF",
              }}
            />
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                lineHeight: "16px",
                color: "#2B5BFF",
                fontWeight: 500,
              }}
            >
              同步
            </span>
          </button>
        </div>

        {/* 最后同步时间 */}
        <div
          style={{
            padding: "12px 16px",
            background: "#EAEBFF",
            borderRadius: "16px",
            marginBottom: "24px",
          }}
        >
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "12px",
              lineHeight: "16px",
              color: "#8A8A93",
              margin: 0,
            }}
          >
            最后同步：{deviceData.lastSync}
          </p>
        </div>

        {/* 今日数据 */}
        <div
          style={{
            marginBottom: "24px",
          }}
        >
          <h4
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: "14px",
              lineHeight: "20px",
              color: "#1A1A1A",
              marginBottom: "16px",
              margin: 0,
            }}
          >
            今日测量数据
          </h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "16px",
              marginTop: "16px",
            }}
          >
            {/* 步数 */}
            <div
              style={{
                background: "rgba(43, 91, 255, 0.05)",
                border: "1px solid rgba(43, 91, 255, 0.15)",
                borderRadius: "16px",
                padding: "16px",
              }}
            >
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "12px",
                  lineHeight: "16px",
                  color: "#8A8A93",
                  margin: 0,
                  marginBottom: "8px",
                }}
              >
                步数
              </p>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "20px",
                  fontWeight: 600,
                  lineHeight: "24px",
                  color: "#2B5BFF",
                  margin: 0,
                }}
              >
                {deviceData.todayData.steps}
              </p>
            </div>

            {/* 心率 */}
            <div
              style={{
                background: "rgba(251, 146, 60, 0.05)",
                border: "1px solid rgba(251, 146, 60, 0.15)",
                borderRadius: "16px",
                padding: "16px",
              }}
            >
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "12px",
                  lineHeight: "16px",
                  color: "#8A8A93",
                  margin: 0,
                  marginBottom: "8px",
                }}
              >
                心率
              </p>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "20px",
                  fontWeight: 600,
                  lineHeight: "24px",
                  color: "#FB923C",
                  margin: 0,
                }}
              >
                {deviceData.todayData.heartRate}
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    marginLeft: "4px",
                  }}
                >
                  bpm
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* 电量 */}
        <div
          style={{
            padding: "12px 16px",
            background: "#EAEBFF",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              lineHeight: "16px",
              color: "#8A8A93",
            }}
          >
            设备电量
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "8px",
                background: "rgba(234, 235, 255, 0.5)",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${deviceData.batteryLevel}%`,
                  height: "100%",
                  background:
                    deviceData.batteryLevel > 20
                      ? "#10B981"
                      : "#EF4444",
                  transition: "width 0.3s",
                }}
              />
            </div>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                lineHeight: "16px",
                fontWeight: 600,
                color: "#1A1A1A",
              }}
            >
              {deviceData.batteryLevel}%
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}