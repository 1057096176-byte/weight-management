import { motion } from "motion/react";
import { X, Stethoscope, Calendar, BarChart3, Settings, Clock } from "lucide-react";
import { Link } from "react-router";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onTriageStart?: () => void;
}

export function Sidebar({ isOpen, onClose, onTriageStart }: SidebarProps) {
  const recentChats = [
    { id: "1", title: "关于运动计划的问题", time: "2小时前" },
    { id: "2", title: "饮食建议咨询", time: "昨天" },
  ];

  return (
    <>
      {/* 遮罩层 */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.3)"
          }}
          onClick={onClose}
        />
      )}

      {/* 侧边栏 */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed top-0 left-0 h-full w-80 z-50 overflow-y-auto backdrop-blur-xl"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.98)",
          boxShadow: "4px 0 20px rgba(0, 0, 0, 0.05)"
        }}
      >
        <div style={{ padding: "24px" }}>
          {/* 头部 */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                style={{
                  background: "linear-gradient(135deg, #2B5BFF 0%, #8B5CF6 100%)",
                  color: "#FFFFFF",
                  fontWeight: 600
                }}
              >
                张
              </div>
              <div>
                <div style={{ fontWeight: 500, fontSize: "15px", color: "#1A1A1A" }}>张小明</div>
                <div style={{ fontSize: "13px", color: "#8A8A93" }}>体重管理中</div>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 rounded-lg transition-all"
              style={{
                backgroundColor: "transparent"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#EAEBFF"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <X className="w-5 h-5" style={{ color: "#1A1A1A" }} />
            </button>
          </div>

          {/* 主要功能入口 */}
          <div className="space-y-2 mb-8">
            <button
              onClick={() => {
                onClose();
                onTriageStart?.();
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full"
              style={{
                backgroundColor: "transparent"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#EAEBFF"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <Stethoscope className="w-5 h-5" style={{ color: "#2B5BFF" }} />
              <span style={{ fontSize: "14px", color: "#1A1A1A", fontWeight: 500 }}>智能导诊</span>
            </button>
            <Link
              to="/checkin"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
              style={{
                backgroundColor: "transparent"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#EAEBFF"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <Calendar className="w-5 h-5" style={{ color: "#2B5BFF" }} />
              <span style={{ fontSize: "14px", color: "#1A1A1A", fontWeight: 500 }}>今日打卡</span>
            </Link>
            <Link
              to="/data"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
              style={{
                backgroundColor: "transparent"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#EAEBFF"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <BarChart3 className="w-5 h-5" style={{ color: "#2B5BFF" }} />
              <span style={{ fontSize: "14px", color: "#1A1A1A", fontWeight: 500 }}>数据与预警</span>
            </Link>
            <Link
              to="/profile"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
              style={{
                backgroundColor: "transparent"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#EAEBFF"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <Settings className="w-5 h-5" style={{ color: "#2B5BFF" }} />
              <span style={{ fontSize: "14px", color: "#1A1A1A", fontWeight: 500 }}>个人中心</span>
            </Link>
          </div>

          {/* 最近对话记录 */}
          <div>
            <div 
              className="flex items-center gap-2 mb-3"
              style={{
                fontSize: "13px",
                fontWeight: 500,
                color: "#8A8A93"
              }}
            >
              <Clock className="w-4 h-4" />
              最近对话记录
            </div>
            <div className="space-y-2">
              {recentChats.map((chat) => (
                <Link
                  key={chat.id}
                  to={`/chat-history/${chat.id}`}
                  onClick={onClose}
                  className="block px-3 py-2 rounded-xl transition-all cursor-pointer"
                  style={{
                    backgroundColor: "transparent"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#EAEBFF"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <div style={{ fontSize: "14px", fontWeight: 500, color: "#1A1A1A", marginBottom: "4px" }}>{chat.title}</div>
                  <div style={{ fontSize: "12px", color: "#8A8A93" }}>{chat.time}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
