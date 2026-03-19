import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight, Check, Circle } from "lucide-react";

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  checkinData?: Record<string, {
    weight?: boolean;
    diet?: boolean;
    exercise?: boolean;
    bloodPressure?: boolean;
    bloodSugar?: boolean;
    waist?: boolean;
  }>;
  type?: "checkin" | "data";
}

export function CalendarModal({ isOpen, onClose, checkinData = {}, type = "checkin" }: CalendarModalProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // 获取当前月份的信息
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

  // 上一个月
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  // 下一个月
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // 生成日历数据
  const calendarDays: (number | null)[] = [];
  // 填充月初空白
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push(null);
  }
  // 填充日期
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  // 获取指定日期的打卡数据
  const getCheckinStatus = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return checkinData[dateStr] || {};
  };

  // 计算打卡完成度
  const getCompletionRate = (day: number) => {
    const status = getCheckinStatus(day);
    const total = 6; // 总共6个打卡项
    const completed = Object.values(status).filter(Boolean).length;
    return { completed, total, rate: (completed / total) * 100 };
  };

  // 判断是否是今天
  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  // 判断是否是未来日期
  const isFutureDate = (day: number) => {
    const today = new Date();
    const checkDate = new Date(year, month, day);
    today.setHours(0, 0, 0, 0);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate > today;
  };

  // 获取打卡状态颜色
  const getStatusColor = (rate: number) => {
    if (rate === 0) return "bg-gray-100 text-gray-400";
    if (rate < 50) return "bg-red-100 text-red-600";
    if (rate < 100) return "bg-yellow-100 text-yellow-600";
    return "bg-green-100 text-green-600";
  };

  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            {/* 头部 */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">打卡日历</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 月份选择器 */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={prevMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="text-lg font-semibold">
                {year}年{month + 1}月
              </div>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* 星期标题 */}
            <div className="grid grid-cols-7 gap-2 mb-3">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-gray-500 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* 日历主体 */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} />;
                }

                const { completed, total, rate } = getCompletionRate(day);
                const today = isToday(day);
                const future = isFutureDate(day);
                const hasData = completed > 0;

                return (
                  <div
                    key={day}
                    className={`relative aspect-square flex flex-col items-center justify-center rounded-lg transition-all ${
                      future
                        ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                        : hasData
                        ? `${getStatusColor(rate)} cursor-pointer hover:scale-105`
                        : "bg-gray-50 text-gray-600 cursor-pointer hover:bg-gray-100"
                    } ${
                      today ? "ring-2 ring-blue-500" : ""
                    }`}
                  >
                    <div className="text-sm font-medium">{day}</div>
                    {hasData && !future && (
                      <div className="flex items-center gap-0.5 mt-1">
                        {completed === total ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <Circle className="w-2 h-2 fill-current" />
                        )}
                      </div>
                    )}
                    {today && (
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* 图例说明 */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-3">打卡状态</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-gray-600">全部完成</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 bg-yellow-100 rounded flex items-center justify-center">
                    <Circle className="w-2 h-2 fill-current text-yellow-600" />
                  </div>
                  <span className="text-gray-600">部分完成（50%-99%）</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 bg-red-100 rounded flex items-center justify-center">
                    <Circle className="w-2 h-2 fill-current text-red-600" />
                  </div>
                  <span className="text-gray-600">少量完成（1%-49%）</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 bg-gray-100 rounded" />
                  <span className="text-gray-600">未打卡</span>
                </div>
              </div>
            </div>

            {/* 本月统计 */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-3">本月统计</div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-600 mb-1">打卡天数</div>
                  <div className="text-xl font-bold text-blue-600">
                    {Object.keys(checkinData).filter(date => {
                      const d = new Date(date);
                      return d.getMonth() === month && d.getFullYear() === year;
                    }).length}
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-600 mb-1">完成率</div>
                  <div className="text-xl font-bold text-green-600">
                    {(() => {
                      const thisMonthDates = Object.keys(checkinData).filter(date => {
                        const d = new Date(date);
                        return d.getMonth() === month && d.getFullYear() === year;
                      });
                      if (thisMonthDates.length === 0) return "0%";
                      const totalRate = thisMonthDates.reduce((sum, date) => {
                        const status = checkinData[date];
                        const completed = Object.values(status).filter(Boolean).length;
                        return sum + (completed / 6) * 100;
                      }, 0);
                      return Math.round(totalRate / thisMonthDates.length) + "%";
                    })()}
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-600 mb-1">连续天数</div>
                  <div className="text-xl font-bold text-purple-600">
                    {(() => {
                      let consecutive = 0;
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      
                      for (let i = 0; i < 30; i++) {
                        const checkDate = new Date(today);
                        checkDate.setDate(checkDate.getDate() - i);
                        const dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
                        
                        if (checkinData[dateStr] && Object.values(checkinData[dateStr]).some(Boolean)) {
                          consecutive++;
                        } else {
                          break;
                        }
                      }
                      
                      return consecutive;
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
