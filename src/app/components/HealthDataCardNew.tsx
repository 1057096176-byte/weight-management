import { motion } from "motion/react";
import { Link } from "react-router";

interface HealthDataCardNewProps {
  healthData: {
    age: number;
    height: number;
    currentWeight: number;
    targetWeight: number;
    bmi: number;
  };
  onEdit: () => void;
  onMedicalRecordClick: () => void;
  hasMedicalRecord: boolean;
  time: string;
  planInfo?: {
    name: string;
    daysRunning: number;
    estimatedCompletion: string;
    todayProgress: number;
  };
}

export function HealthDataCardNew({ healthData, onEdit, onMedicalRecordClick, hasMedicalRecord, time, planInfo }: HealthDataCardNewProps) {
  // BMI状态判断
  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { label: "偏瘦", bgColor: "#FEF3C7", textColor: "#F59E0B" };
    if (bmi < 24) return { label: "正常", bgColor: "#D6EBFF", textColor: "#1694FF" };
    if (bmi < 28) return { label: "偏胖", bgColor: "#FED7AA", textColor: "#EA580C" };
    return { label: "肥胖", bgColor: "#FEE2E2", textColor: "#DC2626" };
  };

  const bmiStatus = getBMIStatus(healthData.bmi);
  
  // 计算BMI圆环进度（假设范围16-32，正常18.5-24）
  const bmiPercentage = Math.min(Math.max(((healthData.bmi - 16) / (32 - 16)) * 100, 0), 100);
  const radius = 48.5;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference - (bmiPercentage / 100) * circumference;

  // 生成周日历数据（周日-周六，共7天）- 仅在有计划信息时使用
  let calendarData: any[] = [];
  if (planInfo) {
    const today = new Date();
    const currentDay = today.getDate();
    const currentWeekDay = today.getDay(); // 0=周日, 1=周一...
    
    const weekDays = ["日", "一", "二", "三", "四", "五", "今"];
    
    // 计算每天的日期和状态
    for (let i = 0; i < 7; i++) {
      const dayOffset = i - currentWeekDay;
      const date = new Date(today);
      date.setDate(currentDay + dayOffset);
      const dateNum = date.getDate();
      
      // 判断是否已打卡
      const isChecked = dayOffset < 0; // 今天之前的已打卡
      const isToday = dayOffset === 0; // 今天
      const isFuture = dayOffset > 0; // 未来
      
      calendarData.push({
        weekDay: i === 6 ? "今" : weekDays[i],
        date: dateNum,
        isChecked,
        isToday,
        isFuture
      });
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4"
    >
      {/* 卡片内容 */}
      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl overflow-hidden relative"
          style={{
            background: "linear-gradient(180deg, #EDF2FD 0%, rgba(236, 240, 250, 0.67) 25%, rgba(233, 236, 245, 0.2) 100%)",
            padding: "22px 17px"
          }}
        >
          {/* 蓝色指示条 */}
          <div 
            style={{
              position: "absolute",
              left: "2px",
              top: "25px",
              width: "3px",
              height: "12px",
              background: "linear-gradient(180deg, #1F2AFF 0%, #397EFF 100%)",
              borderRadius: "17px"
            }}
          />

          {/* 标题栏 */}
          <div className="flex items-center justify-between mb-4" style={{ paddingLeft: "0px", paddingRight: "8px" }}>
            <div className="flex items-center gap-3">
              <span 
                style={{ 
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: "15px",
                  lineHeight: "18px",
                  color: "#000000"
                }}
              >
                我的健康数据
              </span>
              <span 
                style={{ 
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  fontSize: "13px",
                  lineHeight: "16px",
                  color: "#7F88AA"
                }}
              >
                更新于{time}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onMedicalRecordClick}
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  fontSize: "13px",
                  lineHeight: "16px",
                  color: "#3F2DFF",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 0
                }}
              >
                {hasMedicalRecord ? "修改病案号" : "绑定病案号"}
              </button>
              <span style={{ color: "#D1D5DB", margin: "0 -4px" }}>|</span>
              <button
                onClick={onEdit}
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  fontSize: "13px",
                  lineHeight: "16px",
                  color: "#3F2DFF",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 0
                }}
              >
                修改
              </button>
            </div>
          </div>

          {/* 数据区域 */}
          <div className="flex items-start gap-4" style={{ paddingLeft: "0px" }}>
            {/* 左侧：BMI圆环 */}
            <div className="flex flex-col items-center justify-center" style={{ width: "127px" }}>
              <div 
                className="relative rounded-full flex items-center justify-center"
                style={{
                  width: "127px",
                  height: "127px",
                  background: "#FFFFFF",
                  boxShadow: "3px 2px 5.3px rgba(125, 151, 190, 0.17)"
                }}
              >
                {/* SVG圆环 */}
                <svg className="absolute inset-0" width="127" height="127" style={{ transform: "rotate(-90deg)" }}>
                  {/* 背景圆环 */}
                  <circle
                    cx="63.5"
                    cy="63.5"
                    r={radius}
                    stroke="#E2EBFF"
                    strokeWidth="10"
                    fill="none"
                  />
                  {/* 进度圆环 */}
                  <motion.circle
                    cx="63.5"
                    cy="63.5"
                    r={radius}
                    stroke="#4EADFF"
                    strokeWidth="10"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: dashoffset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    style={{
                      strokeDasharray: circumference
                    }}
                  />
                </svg>
                
                {/* 中心内容 */}
                <div className="flex flex-col items-center">
                  <div 
                    style={{ 
                      fontFamily: "SF Pro, sans-serif",
                      fontWeight: 860,
                      fontSize: "18px",
                      lineHeight: "21px",
                      color: "#000000"
                    }}
                  >
                    {Math.round(healthData.bmi)}
                  </div>
                  <div 
                    style={{ 
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 400,
                      fontSize: "12px",
                      lineHeight: "15px",
                      color: "#7F88AA",
                      marginTop: "2px"
                    }}
                  >
                    BMI
                  </div>
                  <div 
                    className="mt-1"
                    style={{
                      padding: "1.5px 8.5px",
                      background: bmiStatus.bgColor,
                      borderRadius: "3px"
                    }}
                  >
                    <span 
                      style={{ 
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 500,
                        fontSize: "12px",
                        lineHeight: "15px",
                        color: bmiStatus.textColor
                      }}
                    >
                      {bmiStatus.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧数据指标 */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex items-start gap-1">
                {/* 年龄 */}
                <div className="flex flex-col">
                  <div 
                    style={{ 
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 700,
                      fontSize: "20px",
                      lineHeight: "24px",
                      color: "#000000"
                    }}
                  >
                    {healthData.age}
                  </div>
                  <div 
                    style={{ 
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 400,
                      fontSize: "12px",
                      lineHeight: "15px",
                      color: "#7F88AA",
                      marginTop: "8px",
                      whiteSpace: "nowrap"
                    }}
                  >
                    年龄/岁
                  </div>
                </div>

                {/* 分隔线 */}
                <div 
                  style={{
                    color: "rgba(0, 0, 0, 0.22)",
                    marginLeft: "4px",
                    marginRight: "4px"
                  }}
                >
                  |
                </div>

                {/* 体重 */}
                <div className="flex flex-col">
                  <div 
                    style={{ 
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 700,
                      fontSize: "20px",
                      lineHeight: "24px",
                      color: "#000000"
                    }}
                  >
                    {healthData.currentWeight}
                  </div>
                  <div 
                    style={{ 
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 400,
                      fontSize: "12px",
                      lineHeight: "15px",
                      color: "#7F88AA",
                      marginTop: "8px",
                      whiteSpace: "nowrap"
                    }}
                  >
                    体重/KG
                  </div>
                </div>

                {/* 分隔线 */}
                <div 
                  style={{
                    color: "rgba(0, 0, 0, 0.22)",
                    marginLeft: "4px",
                    marginRight: "4px"
                  }}
                >
                  |
                </div>

                {/* 身高 */}
                <div className="flex flex-col">
                  <div 
                    style={{ 
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 700,
                      fontSize: "20px",
                      lineHeight: "24px",
                      color: "#000000"
                    }}
                  >
                    {healthData.height}
                  </div>
                  <div 
                    style={{ 
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 400,
                      fontSize: "12px",
                      lineHeight: "15px",
                      color: "#7F88AA",
                      marginTop: "8px",
                      whiteSpace: "nowrap"
                    }}
                  >
                    身高/CM
                  </div>
                </div>
              </div>

              {/* 目标条 */}
              <div 
                className="mt-4"
                style={{
                  padding: "9.5px 0",
                  background: "#CBD6FF",
                  borderRadius: "59px",
                  textAlign: "center"
                }}
              >
                <span 
                  style={{ 
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 400,
                    fontSize: "13px",
                    lineHeight: "16px",
                    color: "#000000"
                  }}
                >
                  您的目标：{healthData.targetWeight}KG
                </span>
              </div>
            </div>
          </div>

          {/* 轻盈计划部分 - 在健康数据卡片内，使用白色背景 */}
          {planInfo && (
            <div className="mt-6" style={{ padding: "0px" }}>
              {/* 白色卡片容器 */}
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: "13px",
                  padding: "14px 17px 20px"
                }}
              >
                {/* 标题栏 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span 
                      style={{ 
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 700,
                        fontSize: "20px",
                        lineHeight: "26px",
                        color: "#131142"
                      }}
                    >
                      轻盈计划
                    </span>
                    <div 
                      style={{
                        padding: "6px 7.5px",
                        border: "1px solid rgba(63, 45, 255, 0.6)",
                        borderRadius: "6px",
                        opacity: 0.4
                      }}
                    >
                      <span 
                        style={{ 
                          fontFamily: "PingFang SC, sans-serif",
                          fontWeight: 400,
                          fontSize: "11px",
                          lineHeight: "12px",
                          color: "#3F2DFF"
                        }}
                      >
                        执行中·第{planInfo.daysRunning}天
                      </span>
                    </div>
                  </div>
                  <Link
                    to="/data"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 400,
                      fontSize: "13px",
                      lineHeight: "16px",
                      color: "#3F2DFF",
                      textDecoration: "none"
                    }}
                  >
                    查看数据
                  </Link>
                </div>

                {/* 周标签 */}
                <div className="flex justify-between mb-3" style={{ paddingLeft: "3px", paddingRight: "3px" }}>
                  {calendarData.map((day, index) => (
                    <div 
                      key={index} 
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 400,
                        fontSize: "14px",
                        lineHeight: "17px",
                        color: "#7F88AA",
                        width: "32px",
                        textAlign: "center"
                      }}
                    >
                      {day.weekDay}
                    </div>
                  ))}
                </div>

                {/* 打卡日历 */}
                <div className="flex justify-between items-start mb-4 relative">
                  {calendarData.map((day, index) => (
                    <div key={index} className="flex flex-col items-center">
                      {/* 日期圆圈 */}
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 + index * 0.05 }}
                        className="rounded-full flex items-center justify-center"
                        style={{
                          width: "32px",
                          height: "32px",
                          background: "#FFFFFF",
                          border: day.isToday 
                            ? "3px solid #3F2DFF" 
                            : "3px solid #D5D7F0",
                          boxSizing: "border-box"
                        }}
                      >
                        <span 
                          style={{ 
                            fontFamily: "Inter, sans-serif",
                            fontWeight: 500,
                            fontSize: "14px",
                            lineHeight: "17px",
                            color: "#000000",
                            textAlign: "right"
                          }}
                        >
                          {day.date}
                        </span>
                      </motion.div>
                    </div>
                  ))}

                  {/* 今日进度条（最后一个位置，即"今天"） */}
                  <div 
                    style={{
                      position: "absolute",
                      right: "0",
                      top: "-29px",
                      width: "49px",
                      height: "86px",
                      background: "#EEEFFC",
                      borderRadius: "6px",
                      zIndex: -1
                    }}
                  />
                </div>

                {/* 去打卡按钮 */}
                <Link
                  to="/checkin"
                  className="block"
                  style={{
                    width: "132px",
                    height: "40px",
                    background: "#D2D5FF",
                    borderRadius: "36px",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <span 
                    style={{ 
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 600,
                      fontSize: "15px",
                      lineHeight: "18px",
                      color: "#3F2DFF"
                    }}
                  >
                    去打卡
                  </span>
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}