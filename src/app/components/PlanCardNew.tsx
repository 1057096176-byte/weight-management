import { motion } from "motion/react";
import { Link } from "react-router";

interface PlanCardNewProps {
  planInfo: {
    name: string;
    daysRunning: number;
    estimatedCompletion: string;
    todayProgress: number;
  };
  time: string;
}

export function PlanCardNew({ planInfo, time }: PlanCardNewProps) {
  // 生成本周日历数据（周日-周六，共7天）
  const today = new Date();
  const currentDay = today.getDate();
  const currentWeekDay = today.getDay(); // 0=周日, 1=周一...
  
  const weekDays = ["日", "一", "二", "三", "四", "五", "今"];
  
  // 计算每天的日期和状态
  const calendarData = [];
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
          transition={{ delay: 0.1 }}
          className="rounded-xl overflow-hidden"
          style={{
            background: "#FFFFFF",
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
                    background: day.isToday ? "#FFFFFF" : "#FFFFFF",
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
                      color: "#000000"
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
            
            {/* 今日进度百分比 */}
            <div 
              style={{
                position: "absolute",
                right: "12px",
                top: "68px",
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                fontSize: "12px",
                lineHeight: "15px",
                color: "#000000",
                textAlign: "right"
              }}
            >
              {planInfo.todayProgress}%
            </div>
          </div>

          {/* 去打卡按钮 */}
          <Link
            to="/checkin"
            className="block text-center"
            style={{
              width: "132px",
              padding: "11px 0",
              background: "#D2D5FF",
              borderRadius: "36px",
              textDecoration: "none",
              margin: "0 auto"
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
        </motion.div>
      </div>

      {/* 时间戳 */}
      <div 
        className="mt-1.5"
        style={{
          fontSize: "11px",
          color: "#9CA3AF"
        }}
      >
        {time}
      </div>
    </motion.div>
  );
}