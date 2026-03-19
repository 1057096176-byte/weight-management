import { Link } from "react-router";
import { Calendar, Stethoscope, BarChart3, Users, Bluetooth, UtensilsCrossed } from "lucide-react";

interface QuickActionsProps {
  onTriageClick?: () => void;
  onDoctorClick?: () => void;
  onDeviceClick?: () => void;
  onMealServiceClick?: () => void;
}

export function QuickActions({ 
  onTriageClick, 
  onDoctorClick,
  onDeviceClick,
  onMealServiceClick 
}: QuickActionsProps = {}) {
  const actions = [
    {
      icon: Stethoscope,
      label: "智能导诊",
      to: undefined,
      onClick: onTriageClick,
    },
    {
      icon: Calendar,
      label: "今日打卡",
      to: "/checkin",
      onClick: undefined,
    },
    {
      icon: BarChart3,
      label: "数据",
      to: "/data",
      onClick: undefined,
    },
    {
      icon: Users,
      label: "医生分身",
      to: undefined,
      onClick: onDoctorClick,
    },
    {
      icon: Bluetooth,
      label: "设备绑定",
      to: undefined,
      onClick: onDeviceClick,
    },
    {
      icon: UtensilsCrossed,
      label: "代餐服务",
      to: undefined,
      onClick: onMealServiceClick,
    },
  ];

  return (
    <div 
      className="relative"
      style={{
        padding: "12px 16px"
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* 横向滚动容器 */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 pb-1">
            {actions.map((action) => {
              const content = (
                <>
                  {/* 左侧图标 */}
                  <action.icon className="w-5 h-5" style={{ color: "#2B5BFF" }} />
                  {/* 右侧名称 */}
                  <span 
                    className="whitespace-nowrap"
                    style={{
                      fontSize: "14px",
                      fontWeight: 400,
                      lineHeight: "20px",
                      color: "#131142"
                    }}
                  >
                    {action.label}
                  </span>
                </>
              );

              const className = "flex items-center gap-2.5 flex-shrink-0 transition-all";
              const style = {
                padding: "6px 16px",
                height: "32px",
                background: "#FFFFFF",
                border: "1px solid #FFFFFF",
                boxShadow: "inset 0px 4px 10.7px #F1F4FF",
                borderRadius: "60px"
              };

              if (action.onClick) {
                return (
                  <button
                    key={action.label}
                    onClick={action.onClick}
                    className={className}
                    style={style}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "inset 0px 4px 10.7px #F1F4FF, 0 2px 8px rgba(0, 0, 0, 0.06)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "inset 0px 4px 10.7px #F1F4FF";
                    }}
                  >
                    {content}
                  </button>
                );
              }

              return (
                <Link
                  key={action.label}
                  to={action.to!}
                  className={className}
                  style={style}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "inset 0px 4px 10.7px #F1F4FF, 0 2px 8px rgba(0, 0, 0, 0.06)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "inset 0px 4px 10.7px #F1F4FF";
                  }}
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* 自定义样式隐藏滚动条 */}
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}