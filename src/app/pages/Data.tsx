import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, TrendingUp, TrendingDown, AlertTriangle, Activity, Heart, Droplet, Ruler, Weight, ChevronRight, BarChart3, Calendar, CheckCircle, XCircle, AlertCircle, Footprints, Flame, Zap, Moon, Brain, Thermometer, Wind } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from "recharts";
import { CalendarModal } from "../components/CalendarModal";
import { PeriodSelector } from "../components/PeriodSelector";
import { IndicatorCard } from "../components/IndicatorCard";
import { SleepCard } from "../components/SleepCard";
import { SleepQualityCard } from "../components/SleepQualityCard";
import { ExerciseCard } from "../components/ExerciseCard";

type TimePeriod = "1day" | "7days" | "30days" | "180days";
type RiskLevel = "low" | "medium" | "high";
type IndicatorType = "steps" | "calories" | "distance" | "heartRate" | "bloodOxygen" | "temperature" | "stress" | "totalSleep" | "deepSleep" | "lightSleep" | "remSleep" | "sleepQuality" | "blood-pressure" | "blood-sugar" | "waist" | null;

interface WeightTrendData {
  date: string;
  weight: number;
  target: number;
}

interface BloodPressureData {
  date: string;
  systolic: number;
  diastolic: number;
}

interface BloodSugarData {
  date: string;
  fasting: number;
  postprandial: number;
}

interface WaistData {
  date: string;
  waist: number;
}

interface AlertItem {
  id: string;
  type: "weight" | "indicator" | "execution";
  level: RiskLevel;
  title: string;
  description: string;
  suggestion: string;
  date: string;
}

export default function Data() {
  const navigate = useNavigate();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("30days");
  const [showCalendar, setShowCalendar] = useState(false);
  const [expandedIndicator, setExpandedIndicator] = useState<IndicatorType>(null);
  const [indicatorPeriod, setIndicatorPeriod] = useState<TimePeriod>("1day");
  const [sleepQualityExpanded, setSleepQualityExpanded] = useState(false);
  const [exerciseExpanded, setExerciseExpanded] = useState(false);
  const [weightExpanded, setWeightExpanded] = useState(false);
  const [alertDrawerOpen, setAlertDrawerOpen] = useState(false);
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<RiskLevel | null>(null);

  // 模拟设备绑定状态
  const isDeviceBound = true;

  // 安全获取最新数据的辅助函数
  const getLatestValue = (data: any[], key: string = 'value') => {
    if (!data || data.length === 0) return '---';
    const latest = data[data.length - 1];
    return latest?.[key] ?? '---';
  };

  // 历史打卡数据（和打卡中心共用）
  const checkinHistory: Record<string, {
    weight?: boolean;
    diet?: boolean;
    exercise?: boolean;
    bloodPressure?: boolean;
    bloodSugar?: boolean;
    waist?: boolean;
  }> = {
    "2026-02-27": { weight: true, diet: true, exercise: true, bloodPressure: true, bloodSugar: true, waist: true },
    "2026-02-26": { weight: true, diet: true, exercise: false, bloodPressure: true, bloodSugar: true, waist: false },
    "2026-02-25": { weight: true, diet: true, exercise: true, bloodPressure: false, bloodSugar: true, waist: false },
    "2026-02-24": { weight: true, diet: false, exercise: true, bloodPressure: true, bloodSugar: false, waist: false },
    "2026-02-23": { weight: true, diet: true, exercise: true, bloodPressure: true, bloodSugar: true, waist: false },
    "2026-02-22": { weight: false, diet: true, exercise: false, bloodPressure: true, bloodSugar: true, waist: false },
    "2026-02-21": { weight: true, diet: true, exercise: true, bloodPressure: false, bloodSugar: false, waist: false },
    "2026-02-20": { weight: true, diet: true, exercise: true, bloodPressure: true, bloodSugar: true, waist: false },
    "2026-02-19": { weight: true, diet: false, exercise: true, bloodPressure: true, bloodSugar: false, waist: false },
    "2026-02-18": { weight: true, diet: true, exercise: false, bloodPressure: false, bloodSugar: true, waist: false },
    "2026-02-17": { weight: false, diet: true, exercise: true, bloodPressure: true, bloodSugar: true, waist: true },
    "2026-02-16": { weight: true, diet: true, exercise: true, bloodPressure: true, bloodSugar: false, waist: false },
    "2026-02-15": { weight: true, diet: true, exercise: true, bloodPressure: true, bloodSugar: true, waist: false },
    "2026-02-14": { weight: true, diet: false, exercise: false, bloodPressure: false, bloodSugar: true, waist: false },
    "2026-02-13": { weight: true, diet: true, exercise: true, bloodPressure: true, bloodSugar: true, waist: false },
  };

  // 体重趋势数据
  const weightData: Record<TimePeriod, WeightTrendData[]> = {
    "1day": [
      { date: "今天", weight: 73.5, target: 73.3 },
    ],
    "7days": [
      { date: "02/21", weight: 75.2, target: 74.5 },
      { date: "02/22", weight: 74.8, target: 74.3 },
      { date: "02/23", weight: 74.5, target: 74.1 },
      { date: "02/24", weight: 74.2, target: 73.9 },
      { date: "02/25", weight: 74.0, target: 73.7 },
      { date: "02/26", weight: 73.7, target: 73.5 },
      { date: "02/27", weight: 73.5, target: 73.3 },
    ],
    "30days": [
      { date: "01/28", weight: 78.5, target: 77.0 },
      { date: "02/02", weight: 77.8, target: 76.5 },
      { date: "02/07", weight: 77.0, target: 76.0 },
      { date: "02/12", weight: 76.2, target: 75.5 },
      { date: "02/17", weight: 75.3, target: 75.0 },
      { date: "02/22", weight: 74.5, target: 74.5 },
      { date: "02/27", weight: 73.5, target: 74.0 },
    ],
    "180days": [
      { date: "09/01", weight: 85.0, target: 82.0 },
      { date: "10/01", weight: 83.5, target: 80.5 },
      { date: "11/01", weight: 82.2, target: 79.5 },
      { date: "12/01", weight: 81.0, target: 78.5 },
      { date: "01/01", weight: 79.2, target: 77.0 },
      { date: "02/01", weight: 76.5, target: 75.0 },
      { date: "02/27", weight: 73.5, target: 74.0 },
    ],
  };

  // 血压数据 - 按时间周期分组
  const bloodPressureData: Record<TimePeriod, BloodPressureData[]> = {
    "1day": [
      { date: "今天", systolic: 120, diastolic: 80 },
    ],
    "7days": [
      { date: "02/21", systolic: 125, diastolic: 82 },
      { date: "02/22", systolic: 122, diastolic: 80 },
      { date: "02/23", systolic: 120, diastolic: 78 },
      { date: "02/24", systolic: 118, diastolic: 76 },
      { date: "02/25", systolic: 120, diastolic: 80 },
      { date: "02/26", systolic: 119, diastolic: 78 },
      { date: "02/27", systolic: 120, diastolic: 80 },
    ],
    "30days": [
      { date: "01/28", systolic: 128, diastolic: 85 },
      { date: "02/02", systolic: 126, diastolic: 83 },
      { date: "02/07", systolic: 124, diastolic: 82 },
      { date: "02/12", systolic: 122, diastolic: 80 },
      { date: "02/17", systolic: 121, diastolic: 79 },
      { date: "02/22", systolic: 120, diastolic: 79 },
      { date: "02/27", systolic: 120, diastolic: 80 },
    ],
    "180days": [
      { date: "09/01", systolic: 135, diastolic: 90 },
      { date: "10/01", systolic: 133, diastolic: 89 },
      { date: "11/01", systolic: 131, diastolic: 87 },
      { date: "12/01", systolic: 129, diastolic: 86 },
      { date: "01/01", systolic: 126, diastolic: 84 },
      { date: "02/01", systolic: 122, diastolic: 81 },
      { date: "02/27", systolic: 120, diastolic: 80 },
    ],
  };

  // 血糖数据 - 按时间周期分组
  const bloodSugarData: Record<TimePeriod, BloodSugarData[]> = {
    "1day": [
      { date: "今天", fasting: 5.5, postprandial: 7.1 },
    ],
    "7days": [
      { date: "02/21", fasting: 6.2, postprandial: 8.0 },
      { date: "02/22", fasting: 6.0, postprandial: 7.8 },
      { date: "02/23", fasting: 5.9, postprandial: 7.5 },
      { date: "02/24", fasting: 5.8, postprandial: 7.2 },
      { date: "02/25", fasting: 5.7, postprandial: 7.0 },
      { date: "02/26", fasting: 5.6, postprandial: 7.3 },
      { date: "02/27", fasting: 5.5, postprandial: 7.1 },
    ],
    "30days": [
      { date: "01/28", fasting: 6.5, postprandial: 8.5 },
      { date: "02/02", fasting: 6.3, postprandial: 8.2 },
      { date: "02/07", fasting: 6.1, postprandial: 8.0 },
      { date: "02/12", fasting: 6.0, postprandial: 7.8 },
      { date: "02/17", fasting: 5.8, postprandial: 7.5 },
      { date: "02/22", fasting: 5.7, postprandial: 7.3 },
      { date: "02/27", fasting: 5.5, postprandial: 7.1 },
    ],
    "180days": [
      { date: "09/01", fasting: 7.2, postprandial: 9.5 },
      { date: "10/01", fasting: 6.9, postprandial: 9.2 },
      { date: "11/01", fasting: 6.7, postprandial: 8.9 },
      { date: "12/01", fasting: 6.5, postprandial: 8.7 },
      { date: "01/01", fasting: 6.2, postprandial: 8.3 },
      { date: "02/01", fasting: 5.8, postprandial: 7.6 },
      { date: "02/27", fasting: 5.5, postprandial: 7.1 },
    ],
  };

  // 腰围数据 - 按时间周期分组
  const waistData: Record<TimePeriod, WaistData[]> = {
    "1day": [
      { date: "今天", waist: 86.0 },
    ],
    "7days": [
      { date: "02/21", waist: 88.5 },
      { date: "02/22", waist: 88.2 },
      { date: "02/23", waist: 87.8 },
      { date: "02/24", waist: 87.5 },
      { date: "02/25", waist: 87.0 },
      { date: "02/26", waist: 86.5 },
      { date: "02/27", waist: 86.0 },
    ],
    "30days": [
      { date: "01/28", waist: 92.0 },
      { date: "02/02", waist: 91.0 },
      { date: "02/07", waist: 90.0 },
      { date: "02/12", waist: 89.0 },
      { date: "02/17", waist: 88.0 },
      { date: "02/22", waist: 87.0 },
      { date: "02/27", waist: 86.0 },
    ],
    "180days": [
      { date: "09/01", waist: 98.0 },
      { date: "10/01", waist: 96.5 },
      { date: "11/01", waist: 95.0 },
      { date: "12/01", waist: 93.5 },
      { date: "01/01", waist: 91.0 },
      { date: "02/01", waist: 88.0 },
      { date: "02/27", waist: 86.0 },
    ],
  };

  // 活动数据（华为手表）- 每个指标单独的数据，按时间周期分组
  const stepsData: Record<TimePeriod, { date: string; value: number }[]> = {
    "1day": [
      { date: "今天", value: 14300 },
    ],
    "7days": [
      { date: "02/21", value: 10200 },
      { date: "02/22", value: 12500 },
      { date: "02/23", value: 9800 },
      { date: "02/24", value: 11250 },
      { date: "02/25", value: 13100 },
      { date: "02/26", value: 15200 },
      { date: "02/27", value: 14300 },
    ],
    "30days": [
      { date: "01/28", value: 11200 },
      { date: "02/02", value: 10800 },
      { date: "02/07", value: 12300 },
      { date: "02/12", value: 13500 },
      { date: "02/17", value: 11800 },
      { date: "02/22", value: 14200 },
      { date: "02/27", value: 14300 },
    ],
    "180days": [
      { date: "09/01", value: 8500 },
      { date: "10/01", value: 9200 },
      { date: "11/01", value: 9800 },
      { date: "12/01", value: 10500 },
      { date: "01/01", value: 11200 },
      { date: "02/01", value: 12800 },
      { date: "02/27", value: 14300 },
    ],
  };

  const caloriesData: Record<TimePeriod, { date: string; value: number }[]> = {
    "1day": [
      { date: "今天", value: 890 },
    ],
    "7days": [
      { date: "02/21", value: 650 },
      { date: "02/22", value: 780 },
      { date: "02/23", value: 610 },
      { date: "02/24", value: 710 },
      { date: "02/25", value: 820 },
      { date: "02/26", value: 950 },
      { date: "02/27", value: 890 },
    ],
    "30days": [
      { date: "01/28", value: 700 },
      { date: "02/02", value: 680 },
      { date: "02/07", value: 750 },
      { date: "02/12", value: 820 },
      { date: "02/17", value: 740 },
      { date: "02/22", value: 880 },
      { date: "02/27", value: 890 },
    ],
    "180days": [
      { date: "09/01", value: 550 },
      { date: "10/01", value: 600 },
      { date: "11/01", value: 640 },
      { date: "12/01", value: 680 },
      { date: "01/01", value: 720 },
      { date: "02/01", value: 810 },
      { date: "02/27", value: 890 },
    ],
  };

  const distanceData: Record<TimePeriod, { date: string; value: number }[]> = {
    "1day": [
      { date: "今天", value: 9.5 },
    ],
    "7days": [
      { date: "02/21", value: 6.8 },
      { date: "02/22", value: 8.3 },
      { date: "02/23", value: 6.5 },
      { date: "02/24", value: 7.5 },
      { date: "02/25", value: 8.7 },
      { date: "02/26", value: 10.1 },
      { date: "02/27", value: 9.5 },
    ],
    "30days": [
      { date: "01/28", value: 7.5 },
      { date: "02/02", value: 7.2 },
      { date: "02/07", value: 8.2 },
      { date: "02/12", value: 9.0 },
      { date: "02/17", value: 7.8 },
      { date: "02/22", value: 9.5 },
      { date: "02/27", value: 9.5 },
    ],
    "180days": [
      { date: "09/01", value: 5.6 },
      { date: "10/01", value: 6.1 },
      { date: "11/01", value: 6.5 },
      { date: "12/01", value: 7.0 },
      { date: "01/01", value: 7.5 },
      { date: "02/01", value: 8.5 },
      { date: "02/27", value: 9.5 },
    ],
  };

  // 身体指标数据（华为手表）- 每个指标单独的数据，按时间周期分组
  const heartRateData: Record<TimePeriod, { date: string; value: number }[]> = {
    "1day": [
      { date: "今天", value: 70 },
    ],
    "7days": [
      { date: "02/21", value: 72 },
      { date: "02/22", value: 75 },
      { date: "02/23", value: 71 },
      { date: "02/24", value: 73 },
      { date: "02/25", value: 76 },
      { date: "02/26", value: 74 },
      { date: "02/27", value: 70 },
    ],
    "30days": [
      { date: "01/28", value: 74 },
      { date: "02/02", value: 73 },
      { date: "02/07", value: 72 },
      { date: "02/12", value: 75 },
      { date: "02/17", value: 71 },
      { date: "02/22", value: 74 },
      { date: "02/27", value: 70 },
    ],
    "180days": [
      { date: "09/01", value: 78 },
      { date: "10/01", value: 77 },
      { date: "11/01", value: 76 },
      { date: "12/01", value: 75 },
      { date: "01/01", value: 73 },
      { date: "02/01", value: 72 },
      { date: "02/27", value: 70 },
    ],
  };

  const bloodOxygenData: Record<TimePeriod, { date: string; value: number }[]> = {
    "1day": [
      { date: "今天", value: 99 },
    ],
    "7days": [
      { date: "02/21", value: 98 },
      { date: "02/22", value: 97 },
      { date: "02/23", value: 98 },
      { date: "02/24", value: 99 },
      { date: "02/25", value: 97 },
      { date: "02/26", value: 98 },
      { date: "02/27", value: 99 },
    ],
    "30days": [
      { date: "01/28", value: 97 },
      { date: "02/02", value: 98 },
      { date: "02/07", value: 97 },
      { date: "02/12", value: 98 },
      { date: "02/17", value: 98 },
      { date: "02/22", value: 97 },
      { date: "02/27", value: 99 },
    ],
    "180days": [
      { date: "09/01", value: 96 },
      { date: "10/01", value: 96 },
      { date: "11/01", value: 97 },
      { date: "12/01", value: 97 },
      { date: "01/01", value: 98 },
      { date: "02/01", value: 98 },
      { date: "02/27", value: 99 },
    ],
  };

  const temperatureData: Record<TimePeriod, { date: string; value: number }[]> = {
    "1day": [
      { date: "今天", value: 36.4 },
    ],
    "7days": [
      { date: "02/21", value: 36.5 },
      { date: "02/22", value: 36.6 },
      { date: "02/23", value: 36.4 },
      { date: "02/24", value: 36.5 },
      { date: "02/25", value: 36.7 },
      { date: "02/26", value: 36.5 },
      { date: "02/27", value: 36.4 },
    ],
    "30days": [
      { date: "01/28", value: 36.6 },
      { date: "02/02", value: 36.5 },
      { date: "02/07", value: 36.4 },
      { date: "02/12", value: 36.6 },
      { date: "02/17", value: 36.5 },
      { date: "02/22", value: 36.5 },
      { date: "02/27", value: 36.4 },
    ],
    "180days": [
      { date: "09/01", value: 36.6 },
      { date: "10/01", value: 36.6 },
      { date: "11/01", value: 36.5 },
      { date: "12/01", value: 36.5 },
      { date: "01/01", value: 36.5 },
      { date: "02/01", value: 36.4 },
      { date: "02/27", value: 36.4 },
    ],
  };

  const stressData: Record<TimePeriod, { date: string; value: number }[]> = {
    "1day": [
      { date: "今天", value: 32 },
    ],
    "7days": [
      { date: "02/21", value: 35 },
      { date: "02/22", value: 42 },
      { date: "02/23", value: 30 },
      { date: "02/24", value: 35 },
      { date: "02/25", value: 48 },
      { date: "02/26", value: 38 },
      { date: "02/27", value: 32 },
    ],
    "30days": [
      { date: "01/28", value: 40 },
      { date: "02/02", value: 38 },
      { date: "02/07", value: 35 },
      { date: "02/12", value: 42 },
      { date: "02/17", value: 36 },
      { date: "02/22", value: 40 },
      { date: "02/27", value: 32 },
    ],
    "180days": [
      { date: "09/01", value: 50 },
      { date: "10/01", value: 47 },
      { date: "11/01", value: 44 },
      { date: "12/01", value: 42 },
      { date: "01/01", value: 39 },
      { date: "02/01", value: 36 },
      { date: "02/27", value: 32 },
    ],
  };

  // 睡眠数据��华为手表）- 每个指标单独的数据，按时间周期分组
  const totalSleepData: Record<TimePeriod, { date: string; value: number }[]> = {
    "1day": [
      { date: "今天", value: 8.1 },
    ],
    "7days": [
      { date: "02/21", value: 8.0 },
      { date: "02/22", value: 7.5 },
      { date: "02/23", value: 8.5 },
      { date: "02/24", value: 8.0 },
      { date: "02/25", value: 7.5 },
      { date: "02/26", value: 9.2 },
      { date: "02/27", value: 8.1 },
    ],
    "30days": [
      { date: "01/28", value: 7.8 },
      { date: "02/02", value: 8.2 },
      { date: "02/07", value: 7.6 },
      { date: "02/12", value: 8.0 },
      { date: "02/17", value: 8.3 },
      { date: "02/22", value: 7.9 },
      { date: "02/27", value: 8.1 },
    ],
    "180days": [
      { date: "09/01", value: 6.8 },
      { date: "10/01", value: 7.0 },
      { date: "11/01", value: 7.2 },
      { date: "12/01", value: 7.5 },
      { date: "01/01", value: 7.8 },
      { date: "02/01", value: 8.0 },
      { date: "02/27", value: 8.1 },
    ],
  };

  const deepSleepData: Record<TimePeriod, { date: string; value: number }[]> = {
    "1day": [
      { date: "今天", value: 2.5 },
    ],
    "7days": [
      { date: "02/21", value: 2.5 },
      { date: "02/22", value: 2.3 },
      { date: "02/23", value: 2.8 },
      { date: "02/24", value: 2.6 },
      { date: "02/25", value: 2.4 },
      { date: "02/26", value: 3.0 },
      { date: "02/27", value: 2.5 },
    ],
    "30days": [
      { date: "01/28", value: 2.4 },
      { date: "02/02", value: 2.6 },
      { date: "02/07", value: 2.3 },
      { date: "02/12", value: 2.5 },
      { date: "02/17", value: 2.7 },
      { date: "02/22", value: 2.5 },
      { date: "02/27", value: 2.5 },
    ],
    "180days": [
      { date: "09/01", value: 2.0 },
      { date: "10/01", value: 2.1 },
      { date: "11/01", value: 2.2 },
      { date: "12/01", value: 2.3 },
      { date: "01/01", value: 2.4 },
      { date: "02/01", value: 2.5 },
      { date: "02/27", value: 2.5 },
    ],
  };

  const lightSleepData: Record<TimePeriod, { date: string; value: number }[]> = {
    "1day": [
      { date: "今天", value: 4.0 },
    ],
    "7days": [
      { date: "02/21", value: 4.0 },
      { date: "02/22", value: 3.8 },
      { date: "02/23", value: 4.2 },
      { date: "02/24", value: 4.0 },
      { date: "02/25", value: 3.6 },
      { date: "02/26", value: 4.5 },
      { date: "02/27", value: 4.0 },
    ],
    "30days": [
      { date: "01/28", value: 3.9 },
      { date: "02/02", value: 4.1 },
      { date: "02/07", value: 3.8 },
      { date: "02/12", value: 4.0 },
      { date: "02/17", value: 4.2 },
      { date: "02/22", value: 3.9 },
      { date: "02/27", value: 4.0 },
    ],
    "180days": [
      { date: "09/01", value: 3.3 },
      { date: "10/01", value: 3.5 },
      { date: "11/01", value: 3.6 },
      { date: "12/01", value: 3.8 },
      { date: "01/01", value: 3.9 },
      { date: "02/01", value: 4.0 },
      { date: "02/27", value: 4.0 },
    ],
  };

  const remSleepData: Record<TimePeriod, { date: string; value: number }[]> = {
    "1day": [
      { date: "今天", value: 1.3 },
    ],
    "7days": [
      { date: "02/21", value: 1.2 },
      { date: "02/22", value: 1.0 },
      { date: "02/23", value: 1.3 },
      { date: "02/24", value: 1.1 },
      { date: "02/25", value: 1.0 },
      { date: "02/26", value: 1.5 },
      { date: "02/27", value: 1.3 },
    ],
    "30days": [
      { date: "01/28", value: 1.1 },
      { date: "02/02", value: 1.2 },
      { date: "02/07", value: 1.0 },
      { date: "02/12", value: 1.1 },
      { date: "02/17", value: 1.3 },
      { date: "02/22", value: 1.2 },
      { date: "02/27", value: 1.3 },
    ],
    "180days": [
      { date: "09/01", value: 0.9 },
      { date: "10/01", value: 1.0 },
      { date: "11/01", value: 1.0 },
      { date: "12/01", value: 1.1 },
      { date: "01/01", value: 1.2 },
      { date: "02/01", value: 1.2 },
      { date: "02/27", value: 1.3 },
    ],
  };

  const sleepQualityData: Record<TimePeriod, { date: string; value: number }[]> = {
    "1day": [
      { date: "今天", value: 84 },
    ],
    "7days": [
      { date: "02/21", value: 85 },
      { date: "02/22", value: 80 },
      { date: "02/23", value: 90 },
      { date: "02/24", value: 82 },
      { date: "02/25", value: 78 },
      { date: "02/26", value: 92 },
      { date: "02/27", value: 84 },
    ],
    "30days": [
      { date: "01/28", value: 82 },
      { date: "02/02", value: 86 },
      { date: "02/07", value: 80 },
      { date: "02/12", value: 84 },
      { date: "02/17", value: 88 },
      { date: "02/22", value: 83 },
      { date: "02/27", value: 84 },
    ],
    "180days": [
      { date: "09/01", value: 75 },
      { date: "10/01", value: 77 },
      { date: "11/01", value: 79 },
      { date: "12/01", value: 81 },
      { date: "01/01", value: 83 },
      { date: "02/01", value: 84 },
      { date: "02/27", value: 84 },
    ],
  };

  // 预警列表
  const alerts: AlertItem[] = [
    {
      id: "1",
      type: "indicator",
      level: "high",
      title: "血压偏高预警",
      description: "近3天收缩压平均值125 mmHg，超过正常范围",
      suggestion: "建议复诊，请咨询医生调整治疗方案",
      date: "2026-02-27"
    },
    {
      id: "2",
      type: "weight",
      level: "medium",
      title: "体重减轻速度过快",
      description: "7天减重2kg，超过健康减重速率",
      suggestion: "建议调整方案，避免快速减重影响健康",
      date: "2026-02-26"
    },
    {
      id: "3",
      type: "execution",
      level: "medium",
      title: "运动打卡执行率低",
      description: "本周运动打卡率仅40%，未达标",
      suggestion: "建议增加运动频次，保持每周至少5次运动",
      date: "2026-02-25"
    },
    {
      id: "4",
      type: "indicator",
      level: "low",
      title: "血糖控制良好",
      description: "空腹血糖平均5.7 mmol/L，控制在正常范围",
      suggestion: "继续保持当前饮食和运动方案",
      date: "2026-02-24"
    },
  ];

  // 计算当前风险等级
  const getCurrentRiskLevel = (): RiskLevel => {
    const highAlerts = alerts.filter(a => a.level === "high").length;
    const mediumAlerts = alerts.filter(a => a.level === "medium").length;
    
    if (highAlerts > 0) return "high";
    if (mediumAlerts > 1) return "medium";
    return "low";
  };

  const currentRiskLevel = getCurrentRiskLevel();

  // 风险��级配置
  const riskLevelConfig = {
    low: {
      label: "低风险",
      description: "各项指标控制良好，继续保持",
      icon: CheckCircle
    },
    medium: {
      label: "中等风险",
      description: "部分指标需要关注，建议调整方案",
      icon: AlertCircle
    },
    high: {
      label: "高风险",
      description: "存在异常指标，建议尽快复诊",
      icon: XCircle
    }
  };

  const currentRiskConfig = riskLevelConfig[currentRiskLevel];

  // 计算体重变化
  const currentWeight = weightData[timePeriod][weightData[timePeriod].length - 1].weight;
  const startWeight = weightData[timePeriod][0].weight;
  const weightChange = currentWeight - startWeight;
  const weightChangePercent = ((weightChange / startWeight) * 100).toFixed(1);

  return (
    <div 
      className="min-h-screen pb-20"
      style={{
        position: "relative",
        backgroundColor: "#FAFAFF",
        overflow: "hidden"
      }}
    >
      {/* 模糊渐变背景层 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <div
          className="absolute"
          style={{
            width: "246.5px",
            height: "398px",
            left: "0px",
            top: "0px",
            background: "#B3B7FF",
            filter: "blur(150px)",
            opacity: 1
          }}
        />
        <div
          className="absolute"
          style={{
            width: "399.5px",
            height: "216.5px",
            left: "0px",
            top: "659.5px",
            background: "#C5D8FF",
            filter: "blur(100px)",
            opacity: 1
          }}
        />
        <div
          className="absolute"
          style={{
            width: "223px",
            height: "223px",
            left: "-125px",
            top: "548px",
            background: "#FFE3CB",
            opacity: 0.9,
            filter: "blur(150px)",
            borderRadius: "50%"
          }}
        />
        <div
          className="absolute"
          style={{
            width: "223px",
            height: "223px",
            left: "296px",
            top: "156px",
            background: "#FFD4B0",
            opacity: 0.9,
            filter: "blur(150px)",
            borderRadius: "50%"
          }}
        />
      </div>

      {/* 顶部导航 */}
      <div 
        className="px-4 py-3 flex items-center justify-between sticky top-0"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(234, 235, 255, 0.3)",
          position: "relative",
          zIndex: 10
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg transition-colors"
          style={{ backgroundColor: "transparent" }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(43, 91, 255, 0.05)"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >
          <ArrowLeft className="w-5 h-5" style={{ color: "#1A1A1A" }} />
        </button>
        <h1 style={{ color: "#1A1A1A", fontSize: "16px", fontWeight: 600 }}>数据与预警中心</h1>
        <button 
          onClick={() => setShowCalendar(true)}
          className="p-2 rounded-lg transition-colors"
          style={{ backgroundColor: "transparent" }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(43, 91, 255, 0.05)"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >
          <Calendar className="w-5 h-5" style={{ color: "#1A1A1A" }} />
        </button>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4" style={{ position: "relative", zIndex: 1 }}>
        {/* 红绿灯状态展示 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "24px",
            padding: "24px",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 20px rgba(43, 91, 255, 0.05)",
            border: currentRiskLevel === "high" 
              ? "2px solid rgba(239, 68, 68, 0.3)" 
              : currentRiskLevel === "medium"
              ? "2px solid rgba(251, 191, 36, 0.3)"
              : "2px solid rgba(16, 185, 129, 0.3)"
          }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div 
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: currentRiskLevel === "high"
                  ? "rgba(239, 68, 68, 0.1)"
                  : currentRiskLevel === "medium"
                  ? "rgba(251, 191, 36, 0.1)"
                  : "rgba(16, 185, 129, 0.1)",
                border: currentRiskLevel === "high"
                  ? "2px solid rgba(239, 68, 68, 0.3)"
                  : currentRiskLevel === "medium"
                  ? "2px solid rgba(251, 191, 36, 0.3)"
                  : "2px solid rgba(16, 185, 129, 0.3)"
              }}
            >
              <currentRiskConfig.icon 
                className="w-8 h-8" 
                style={{ 
                  color: currentRiskLevel === "high" 
                    ? "#EF4444" 
                    : currentRiskLevel === "medium"
                    ? "#F59E0B"
                    : "#10B981"
                }} 
              />
            </div>
            <div className="flex-1">
              <h2 
                style={{ 
                  fontSize: "20px", 
                  fontWeight: 600,
                  color: currentRiskLevel === "high"
                    ? "#EF4444"
                    : currentRiskLevel === "medium"
                    ? "#F59E0B"
                    : "#10B981",
                  marginBottom: "4px"
                }}
              >
                {currentRiskConfig.label}
              </h2>
              <p style={{ color: "#8A8A93", fontSize: "14px" }}>{currentRiskConfig.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* 高风险入口 */}
            {alerts.filter(a => a.level === "high").length > 0 && (
              <motion.div
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedRiskLevel("high");
                  setAlertDrawerOpen(true);
                }}
                style={{
                  borderLeft: "4px solid #EF4444",
                  borderRadius: "16px",
                  padding: "16px",
                  backgroundColor: "rgba(239, 68, 68, 0.05)",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                <div className="flex flex-col items-center text-center">
                  <XCircle className="w-6 h-6 mb-2" style={{ color: "#EF4444" }} />
                  <h4 style={{ fontSize: "15px", fontWeight: 600, color: "#1A1A1A", marginBottom: "4px" }}>高风险</h4>
                  <p style={{ fontSize: "13px", color: "#8A8A93" }}>{alerts.filter(a => a.level === "high").length} 条</p>
                </div>
              </motion.div>
            )}

            {/* 中风险入口 */}
            {alerts.filter(a => a.level === "medium").length > 0 && (
              <motion.div
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedRiskLevel("medium");
                  setAlertDrawerOpen(true);
                }}
                style={{
                  borderLeft: "4px solid #F59E0B",
                  borderRadius: "16px",
                  padding: "16px",
                  backgroundColor: "rgba(251, 191, 36, 0.05)",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                <div className="flex flex-col items-center text-center">
                  <AlertCircle className="w-6 h-6 mb-2" style={{ color: "#F59E0B" }} />
                  <h4 style={{ fontSize: "15px", fontWeight: 600, color: "#1A1A1A", marginBottom: "4px" }}>中风险</h4>
                  <p style={{ fontSize: "13px", color: "#8A8A93" }}>{alerts.filter(a => a.level === "medium").length} 条</p>
                </div>
              </motion.div>
            )}

            {/* 低风险入口 */}
            {alerts.filter(a => a.level === "low").length > 0 && (
              <motion.div
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedRiskLevel("low");
                  setAlertDrawerOpen(true);
                }}
                style={{
                  borderLeft: "4px solid #10B981",
                  borderRadius: "16px",
                  padding: "16px",
                  backgroundColor: "rgba(16, 185, 129, 0.05)",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                <div className="flex flex-col items-center text-center">
                  <CheckCircle className="w-6 h-6 mb-2" style={{ color: "#10B981" }} />
                  <h4 style={{ fontSize: "15px", fontWeight: 600, color: "#1A1A1A", marginBottom: "4px" }}>低风险</h4>
                  <p style={{ fontSize: "13px", color: "#8A8A93" }}>{alerts.filter(a => a.level === "low").length} 条</p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* 体重趋势图 */}
        <>
          {/* 折叠状态 */}
          {!weightExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "20px",
                padding: "20px",
                backdropFilter: "blur(10px)",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                border: "1px solid rgba(234, 235, 255, 0.3)",
                cursor: "pointer"
              }}
              onClick={() => setWeightExpanded(true)}
            >
              {/* 顶部 */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div 
                    style={{
                      width: "28px",
                      height: "28px",
                      background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Weight className="w-4 h-4" style={{ color: "#2B5BFF" }} />
                  </div>
                  <h3 style={{ fontSize: "15px", fontWeight: 500, color: "#1A1A1A" }}>体重趋势</h3>
                </div>
                
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: "14px", color: "#8A8A93" }}>今天</span>
                  <ChevronRight className="w-5 h-5" style={{ color: "#8A8A93" }} />
                </div>
              </div>

              {/* 主内容：三个指标横向排列 */}
              <div className="flex items-center justify-between">
                {/* 左侧：三个指标 */}
                <div style={{ display: "flex", gap: "40px" }}>
                  <div>
                    <div style={{ fontSize: "12px", color: "#2B5BFF", marginBottom: "4px" }}>
                      当前体重
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "2px" }}>
                      <span style={{ fontSize: "22px", fontWeight: 600, color: "#1A1A1A", lineHeight: 1 }}>
                        {currentWeight}
                      </span>
                      <span style={{ fontSize: "13px", color: "#8A8A93" }}>
                        kg
                      </span>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: "12px", color: weightChange < 0 ? "#10B981" : "#EF4444", marginBottom: "4px" }}>
                      变化量
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "2px" }}>
                      <span style={{ fontSize: "22px", fontWeight: 600, color: "#1A1A1A", lineHeight: 1 }}>
                        {weightChange > 0 ? "+" : ""}{weightChange.toFixed(1)}
                      </span>
                      <span style={{ fontSize: "13px", color: "#8A8A93" }}>
                        kg
                      </span>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: "12px", color: weightChange < 0 ? "#10B981" : "#EF4444", marginBottom: "4px" }}>
                      变化率
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "2px" }}>
                      <span style={{ fontSize: "22px", fontWeight: 600, color: "#1A1A1A", lineHeight: 1 }}>
                        {weightChange > 0 ? "+" : ""}{weightChangePercent}
                      </span>
                      <span style={{ fontSize: "13px", color: "#8A8A93" }}>
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 展开状态 */}
          <AnimatePresence>
            {weightExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "20px",
                  padding: "20px",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                  border: "1px solid rgba(234, 235, 255, 0.3)",
                  overflow: "hidden"
                }}
              >
                {/* 顶部：返回按钮 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div 
                      style={{
                        width: "28px",
                        height: "28px",
                        background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Weight className="w-4 h-4" style={{ color: "#2B5BFF" }} />
                    </div>
                    <h3 style={{ fontSize: "15px", fontWeight: 500, color: "#1A1A1A" }}>体重趋势</h3>
                  </div>
                  
                  <button
                    onClick={() => setWeightExpanded(false)}
                    className="p-2 rounded-lg transition-colors"
                    style={{ backgroundColor: "transparent" }}
                  >
                    <ChevronRight 
                      className="w-5 h-5" 
                      style={{ color: "#8A8A93", transform: "rotate(90deg)" }} 
                    />
                  </button>
                </div>

                {/* 体重变化总结 */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div 
                    style={{
                      background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
                      borderRadius: "16px",
                      padding: "16px"
                    }}
                  >
                    <div style={{ fontSize: "14px", color: "#8A8A93", marginBottom: "4px" }}>当前体重</div>
                    <div style={{ fontSize: "24px", fontWeight: 600, color: "#2B5BFF" }}>{currentWeight} kg</div>
                  </div>
                  <div 
                    style={{
                      background: "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)",
                      borderRadius: "16px",
                      padding: "16px"
                    }}
                  >
                    <div style={{ fontSize: "14px", color: "#8A8A93", marginBottom: "4px" }}>变化量</div>
                    <div className="flex items-center gap-1" style={{
                      fontSize: "24px",
                      fontWeight: 600,
                      color: weightChange < 0 ? "#10B981" : "#EF4444"
                    }}>
                      {weightChange > 0 ? "+" : ""}{weightChange.toFixed(1)} kg
                      {weightChange < 0 ? (
                        <TrendingDown className="w-5 h-5" />
                      ) : (
                        <TrendingUp className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                  <div 
                    style={{
                      background: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)",
                      borderRadius: "16px",
                      padding: "16px"
                    }}
                  >
                    <div style={{ fontSize: "14px", color: "#8A8A93", marginBottom: "4px" }}>变化率</div>
                    <div style={{
                      fontSize: "24px",
                      fontWeight: 600,
                      color: weightChange < 0 ? "#10B981" : "#EF4444"
                    }}>
                      {weightChange > 0 ? "+" : ""}{weightChangePercent}%
                    </div>
                  </div>
                </div>

                {/* 时间周期选择器 */}
                <div className="flex justify-center mb-4">
                  <PeriodSelector selected={timePeriod} onChange={setTimePeriod} />
                </div>

                {/* 趋势图 */}
                <div className="h-64" style={{ minHeight: "256px" }}>
                  <ResponsiveContainer width="100%" height="100%" debounce={1}>
                    <AreaChart data={weightData[timePeriod]}>
                      <defs>
                        <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2B5BFF" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#2B5BFF" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#EAEBFF" />
                      <XAxis dataKey="date" stroke="#8A8A93" style={{ fontSize: "12px" }} />
                      <YAxis stroke="#8A8A93" style={{ fontSize: "12px" }} domain={['dataMin - 1', 'dataMax + 1']} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #EAEBFF",
                          borderRadius: "16px",
                          fontSize: "12px",
                          boxShadow: "0 4px 20px rgba(43, 91, 255, 0.05)"
                        }}
                      />
                      <Legend />
                      <Area
                        key="weight-actual"
                        type="monotone"
                        dataKey="weight"
                        name="实际体重"
                        stroke="#2B5BFF"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorWeight)"
                      />
                      <Area
                        key="weight-target"
                        type="monotone"
                        dataKey="target"
                        name="目标体重"
                        stroke="#10B981"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        fillOpacity={1}
                        fill="url(#colorTarget)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>

        {/* 指标卡片列表 */}
        <div className="grid grid-cols-1 gap-4">
          {/* 运动情况卡片 - 整合步数、热量、距离 */}
          <ExerciseCard
            steps={getLatestValue(stepsData["7days"]) as number}
            calories={getLatestValue(caloriesData["7days"]) as number}
            distance={getLatestValue(distanceData["7days"]) as number}
            date="今天"
            expanded={exerciseExpanded}
            onToggle={() => setExerciseExpanded(!exerciseExpanded)}
          />

          {/* 心率指标 */}
          <IndicatorCard
            icon={<Heart className="w-4 h-4" />}
            iconColor="#EA580C"
            iconBg="linear-gradient(135deg, #FED7AA 0%, #FDBA74 100%)"
            title="心率"
            value={getLatestValue(heartRateData["7days"])}
            unit="bpm"
            data={heartRateData["7days"]}
            chartColor="#EA580C"
            expanded={expandedIndicator === "heartRate"}
            onToggle={() => setExpandedIndicator(expandedIndicator === "heartRate" ? null : "heartRate")}
            syncStatus="synced"
            date="今天"
          >
            <div className="flex justify-center mb-4">
              <PeriodSelector selected={indicatorPeriod} onChange={setIndicatorPeriod} />
            </div>
            <div className="h-48" style={{ minHeight: "192px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={heartRateData[indicatorPeriod]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EAEBFF" />
                  <XAxis dataKey="date" stroke="#8A8A93" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#8A8A93" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #EAEBFF",
                      borderRadius: "16px",
                      fontSize: "12px",
                      boxShadow: "0 4px 20px rgba(43, 91, 255, 0.05)"
                    }}
                  />
                  <Legend />
                  <Line
                    key="heart-rate-line"
                    type="monotone"
                    dataKey="value"
                    name="心率(bpm)"
                    stroke="#EA580C"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </IndicatorCard>

          {/* 血氧指标 */}
          <IndicatorCard
            icon={<Droplet className="w-4 h-4" />}
            iconColor="#06B6D4"
            iconBg="linear-gradient(135deg, #A5F3FC 0%, #67E8F9 100%)"
            title="血氧饱和度"
            value={getLatestValue(bloodOxygenData["7days"])}
            unit="%"
            data={bloodOxygenData["7days"]}
            chartColor="#06B6D4"
            expanded={expandedIndicator === "bloodOxygen"}
            onToggle={() => setExpandedIndicator(expandedIndicator === "bloodOxygen" ? null : "bloodOxygen")}
            syncStatus="synced"
            date="今天"
          >
            <div className="flex justify-center mb-4">
              <PeriodSelector selected={indicatorPeriod} onChange={setIndicatorPeriod} />
            </div>
            <div className="h-48" style={{ minHeight: "192px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bloodOxygenData[indicatorPeriod]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EAEBFF" />
                  <XAxis dataKey="date" stroke="#8A8A93" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#8A8A93" style={{ fontSize: "12px" }} domain={[95, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #EAEBFF",
                      borderRadius: "16px",
                      fontSize: "12px",
                      boxShadow: "0 4px 20px rgba(43, 91, 255, 0.05)"
                    }}
                  />
                  <Legend />
                  <Line
                    key="blood-oxygen-line"
                    type="monotone"
                    dataKey="value"
                    name="血氧(%)"
                    stroke="#06B6D4"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </IndicatorCard>

          {/* 体温指标 */}
          <IndicatorCard
            icon={<Thermometer className="w-4 h-4" />}
            iconColor="#F43F5E"
            iconBg="linear-gradient(135deg, #FECDD3 0%, #FDA4AF 100%)"
            title="体温"
            value={getLatestValue(temperatureData["7days"])}
            unit="°C"
            data={temperatureData["7days"]}
            chartColor="#F43F5E"
            expanded={expandedIndicator === "temperature"}
            onToggle={() => setExpandedIndicator(expandedIndicator === "temperature" ? null : "temperature")}
            syncStatus="synced"
            date="今天"
          >
            <div className="flex justify-center mb-4">
              <PeriodSelector selected={indicatorPeriod} onChange={setIndicatorPeriod} />
            </div>
            <div className="h-48" style={{ minHeight: "192px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={temperatureData[indicatorPeriod]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EAEBFF" />
                  <XAxis dataKey="date" stroke="#8A8A93" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#8A8A93" style={{ fontSize: "12px" }} domain={[36, 37]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #EAEBFF",
                      borderRadius: "16px",
                      fontSize: "12px",
                      boxShadow: "0 4px 20px rgba(43, 91, 255, 0.05)"
                    }}
                  />
                  <Legend />
                  <Line
                    key="temperature-line"
                    type="monotone"
                    dataKey="value"
                    name="体温(°C)"
                    stroke="#F43F5E"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </IndicatorCard>

          {/* 压力指标 */}
          <IndicatorCard
            icon={<Brain className="w-4 h-4" />}
            iconColor="#8B5CF6"
            iconBg="linear-gradient(135deg, #DDD6FE 0%, #C4B5FD 100%)"
            title="压力指数"
            value={getLatestValue(stressData["7days"])}
            unit="分"
            data={stressData["7days"]}
            chartColor="#8B5CF6"
            expanded={expandedIndicator === "stress"}
            onToggle={() => setExpandedIndicator(expandedIndicator === "stress" ? null : "stress")}
            syncStatus="synced"
            date="今天"
          >
            <div className="flex justify-center mb-4">
              <PeriodSelector selected={indicatorPeriod} onChange={setIndicatorPeriod} />
            </div>
            <div className="h-48" style={{ minHeight: "192px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stressData[indicatorPeriod]}>
                  <defs>
                    <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EAEBFF" />
                  <XAxis dataKey="date" stroke="#8A8A93" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#8A8A93" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #EAEBFF",
                      borderRadius: "16px",
                      fontSize: "12px",
                      boxShadow: "0 4px 20px rgba(43, 91, 255, 0.05)"
                    }}
                  />
                  <Legend />
                  <Area
                    key="stress-area"
                    type="monotone"
                    dataKey="value"
                    name="压力指数"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorStress)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </IndicatorCard>

          {/* 睡眠质量卡片 - 华为风格 */}
          <SleepQualityCard
            score={getLatestValue(sleepQualityData["7days"]) as number}
            date="今天"
            expanded={sleepQualityExpanded}
            onToggle={() => setSleepQualityExpanded(!sleepQualityExpanded)}
          />

          {/* 血压指标 */}
          <IndicatorCard
            icon={<Heart className="w-4 h-4" />}
            iconColor="#EF4444"
            iconBg="linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)"
            title="血压"
            value={`${getLatestValue(bloodPressureData["7days"], 'systolic')}/${getLatestValue(bloodPressureData["7days"], 'diastolic')}`}
            unit="mmHg"
            data={bloodPressureData["7days"].map(d => ({ date: d.date, value: d.systolic }))}
            chartColor="#EF4444"
            expanded={expandedIndicator === "blood-pressure"}
            onToggle={() => setExpandedIndicator(expandedIndicator === "blood-pressure" ? null : "blood-pressure")}
            syncStatus="warning"
            statusText="偏高"
            date="今天"
          >
            <div className="flex justify-center mb-4">
              <PeriodSelector selected={indicatorPeriod} onChange={setIndicatorPeriod} />
            </div>
            <div className="h-48" style={{ minHeight: "192px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bloodPressureData[indicatorPeriod]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EAEBFF" />
                  <XAxis dataKey="date" stroke="#8A8A93" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#8A8A93" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #EAEBFF",
                      borderRadius: "16px",
                      fontSize: "12px",
                      boxShadow: "0 4px 20px rgba(43, 91, 255, 0.05)"
                    }}
                  />
                  <Legend />
                  <Line
                    key="systolic-line"
                    type="monotone"
                    dataKey="systolic"
                    name="收缩压"
                    stroke="#EF4444"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    key="diastolic-line"
                    type="monotone"
                    dataKey="diastolic"
                    name="舒张压"
                    stroke="#EC4899"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </IndicatorCard>

          {/* 血糖指标 */}
          <IndicatorCard
            icon={<Droplet className="w-4 h-4" />}
            iconColor="#2B5BFF"
            iconBg="linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)"
            title="血糖"
            value={getLatestValue(bloodSugarData["7days"], 'fasting')}
            unit="mmol/L（空腹）"
            data={bloodSugarData["7days"].map(d => ({ date: d.date, value: d.fasting }))}
            chartColor="#2B5BFF"
            expanded={expandedIndicator === "blood-sugar"}
            onToggle={() => setExpandedIndicator(expandedIndicator === "blood-sugar" ? null : "blood-sugar")}
            syncStatus="synced"
            statusText="正常"
            date="今天"
          >
            <div className="flex justify-center mb-4">
              <PeriodSelector selected={indicatorPeriod} onChange={setIndicatorPeriod} />
            </div>
            <div className="h-48" style={{ minHeight: "192px" }}>
              <ResponsiveContainer width="100%" height="100%" debounce={1}>
                <BarChart data={bloodSugarData[indicatorPeriod]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EAEBFF" />
                  <XAxis dataKey="date" stroke="#8A8A93" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#8A8A93" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #EAEBFF",
                      borderRadius: "16px",
                      fontSize: "12px",
                      boxShadow: "0 4px 20px rgba(43, 91, 255, 0.05)"
                    }}
                  />
                  <Legend />
                  <Bar key="fasting-sugar" dataKey="fasting" name="空腹血糖" fill="#2B5BFF" radius={[8, 8, 0, 0]} />
                  <Bar key="postprandial-sugar" dataKey="postprandial" name="餐后血糖" fill="#60A5FA" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </IndicatorCard>

          {/* 腰围指标 */}
          <IndicatorCard
            icon={<Ruler className="w-4 h-4" />}
            iconColor="#A855F7"
            iconBg="linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 100%)"
            title="腰围"
            value={getLatestValue(waistData["7days"], 'waist')}
            unit="cm"
            data={waistData["7days"]}
            chartColor="#A855F7"
            expanded={expandedIndicator === "waist"}
            onToggle={() => setExpandedIndicator(expandedIndicator === "waist" ? null : "waist")}
            syncStatus="manual"
            statusText="手动记录"
            date="今天"
          >
            <div className="flex justify-center mb-4">
              <PeriodSelector selected={indicatorPeriod} onChange={setIndicatorPeriod} />
            </div>
            <div className="h-48" style={{ minHeight: "192px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={waistData[indicatorPeriod]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EAEBFF" />
                  <XAxis dataKey="date" stroke="#8A8A93" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#8A8A93" style={{ fontSize: "12px" }} domain={['dataMin - 1', 'dataMax + 1']} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #EAEBFF",
                      borderRadius: "16px",
                      fontSize: "12px",
                      boxShadow: "0 4px 20px rgba(43, 91, 255, 0.05)"
                    }}
                  />
                  <Legend />
                  <Line
                    key="waist-line"
                    type="monotone"
                    dataKey="waist"
                    name="腰围(cm)"
                    stroke="#A855F7"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </IndicatorCard>
        </div>

        {/* 数据说明 */}
        <div 
          style={{
            backgroundColor: "rgba(43, 91, 255, 0.05)",
            borderRadius: "16px",
            padding: "16px",
            border: "1px solid rgba(43, 91, 255, 0.1)"
          }}
        >
          <div className="flex items-start gap-3">
            <Activity className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#2B5BFF" }} />
            <div style={{ fontSize: "14px", color: "#8A8A93" }}>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "#1A1A1A", marginBottom: "4px" }}>数据说明</p>
              <p>数据每日自动更新，预警系统会根据您的健康指标变化实时分析风险等级。建议定期查看预警列表，及时调整健康管理方案。</p>
            </div>
          </div>
        </div>
      </div>

      {/* 日历弹窗 */}
      <CalendarModal 
        isOpen={showCalendar}
        onClose={() => setShowCalendar(false)}
        checkinData={checkinHistory}
        type="data"
      />

      {/* 预警详情抽屉 */}
      <AnimatePresence>
        {alertDrawerOpen && selectedRiskLevel && (
          <>
            {/* 遮罩层 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAlertDrawerOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 50
              }}
            />

            {/* 抽屉内容 */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.5 }}
              onDragEnd={(e, { offset, velocity }) => {
                if (offset.y > 100 || velocity.y > 500) {
                  setAlertDrawerOpen(false);
                }
              }}
              style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                maxHeight: "80vh",
                backgroundColor: "#FFFFFF",
                borderTopLeftRadius: "24px",
                borderTopRightRadius: "24px",
                boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.1)",
                zIndex: 51,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column"
              }}
            >
              {/* 拖动指示器 */}
              <div 
                style={{
                  padding: "12px 0",
                  display: "flex",
                  justifyContent: "center",
                  cursor: "grab"
                }}
              >
                <div 
                  style={{
                    width: "40px",
                    height: "4px",
                    backgroundColor: "#D1D5DB",
                    borderRadius: "2px"
                  }}
                />
              </div>

              {/* 标题 */}
              <div 
                style={{
                  padding: "0 24px 16px",
                  borderBottom: "1px solid #EAEBFF"
                }}
              >
                <div className="flex items-center gap-2">
                  {selectedRiskLevel === "high" ? (
                    <XCircle className="w-6 h-6" style={{ color: "#EF4444" }} />
                  ) : selectedRiskLevel === "medium" ? (
                    <AlertCircle className="w-6 h-6" style={{ color: "#F59E0B" }} />
                  ) : (
                    <CheckCircle className="w-6 h-6" style={{ color: "#10B981" }} />
                  )}
                  <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#1A1A1A" }}>
                    {selectedRiskLevel === "high" ? "高风险预警" : selectedRiskLevel === "medium" ? "中风险预警" : "低风险提示"}
                  </h3>
                  <span style={{ fontSize: "14px", color: "#8A8A93", marginLeft: "auto" }}>
                    {alerts.filter(a => a.level === selectedRiskLevel).length} 条
                  </span>
                </div>
              </div>

              {/* 预警列表内容 */}
              <div 
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "16px 24px"
                }}
              >
                <div className="space-y-3">
                  {alerts
                    .filter(a => a.level === selectedRiskLevel)
                    .map((alert) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{
                          borderLeft: alert.level === "high"
                            ? "4px solid #EF4444"
                            : alert.level === "medium"
                            ? "4px solid #F59E0B"
                            : "4px solid #10B981",
                          borderRadius: "16px",
                          padding: "16px",
                          backgroundColor: alert.level === "high"
                            ? "rgba(239, 68, 68, 0.05)"
                            : alert.level === "medium"
                            ? "rgba(251, 191, 36, 0.05)"
                            : "rgba(16, 185, 129, 0.05)"
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {alert.level === "high" ? (
                                <XCircle className="w-4 h-4" style={{ color: "#EF4444" }} />
                              ) : alert.level === "medium" ? (
                                <AlertCircle className="w-4 h-4" style={{ color: "#F59E0B" }} />
                              ) : (
                                <CheckCircle className="w-4 h-4" style={{ color: "#10B981" }} />
                              )}
                              <h4 style={{ fontSize: "16px", fontWeight: 600, color: "#1A1A1A" }}>{alert.title}</h4>
                            </div>
                            <p style={{ fontSize: "14px", color: "#8A8A93", marginBottom: "8px" }}>{alert.description}</p>
                            <div className="flex items-center gap-2">
                              <div 
                                style={{
                                  padding: "4px 8px",
                                  borderRadius: "4px",
                                  fontSize: "12px",
                                  fontWeight: 500,
                                  backgroundColor: alert.type === "weight"
                                    ? "rgba(43, 91, 255, 0.1)"
                                    : alert.type === "indicator"
                                    ? "rgba(168, 85, 247, 0.1)"
                                    : "rgba(251, 191, 36, 0.1)",
                                  color: alert.type === "weight"
                                    ? "#2B5BFF"
                                    : alert.type === "indicator"
                                    ? "#A855F7"
                                    : "#F59E0B"
                                }}
                              >
                                {alert.type === "weight" ? "体重" : alert.type === "indicator" ? "指标" : "执行"}
                              </div>
                              <span style={{ fontSize: "12px", color: "#8A8A93" }}>{alert.date}</span>
                            </div>
                          </div>
                        </div>
                        <div 
                          style={{
                            marginTop: "12px",
                            padding: "12px",
                            backgroundColor: "#FFFFFF",
                            borderRadius: "12px",
                            border: "1px solid rgba(234, 235, 255, 0.5)"
                          }}
                        >
                          <div style={{ fontSize: "12px", color: "#8A8A93", marginBottom: "4px" }}>建议行为</div>
                          <div style={{ fontSize: "14px", fontWeight: 500, color: "#1A1A1A" }}>{alert.suggestion}</div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
