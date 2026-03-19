import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Weight, Utensils, Activity, Calendar, Camera, Check, Edit2, Plus, X, Trash2, ImageIcon, Heart, Droplet, Ruler, Bluetooth, Zap, Flame, Moon, Clock, RefreshCw, AlertCircle, Coffee, ChevronRight, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { CalendarModal } from "../components/CalendarModal";

type CheckinType = "all" | "weight" | "diet" | "exercise" | "blood-pressure" | "blood-sugar" | "waist" | "steps" | "heart-rate" | "sleep";
type MealType = "breakfast" | "lunch" | "dinner" | "snack";

interface WeightData {
  value: number;
  note: string;
  time: string;
  autoSynced?: boolean;  // 是否为设备自动同步
}

interface FoodItem {
  name: string;
  amount: string;
  calories: number;
  image?: string;
  isMealReplacement?: boolean;  // 是否为代餐
  status?: "已吃" | "未吃" | "替代";  // 代餐状态
}

interface MealData {
  breakfast: FoodItem[];
  lunch: FoodItem[];
  dinner: FoodItem[];
  snack: FoodItem[];
}

interface ExerciseData {
  type: string;
  duration: number;
  intensity: string;
  calories: number;
  time: string;
  autoSynced?: boolean;  // 是否为设备自动同步
}

interface BloodPressureData {
  systolic: number;  // 收缩压
  diastolic: number; // 舒张压
  time: string;
}

interface BloodSugarData {
  value: number;
  type: "空腹" | "餐后";
  time: string;
}

interface WaistData {
  value: number;
  time: string;
}

// 常见食物库（统一为每100g热量）
const COMMON_FOODS = [
  { name: "燕麦粥", calories: 75, unit: "100g" },
  { name: "煮鸡蛋", calories: 155, unit: "100g" },
  { name: "苹果", calories: 52, unit: "100g" },
  { name: "香蕉", calories: 89, unit: "100g" },
  { name: "糙米饭", calories: 111, unit: "100g" },
  { name: "白米饭", calories: 116, unit: "100g" },
  { name: "鸡胸肉", calories: 165, unit: "100g" },
  { name: "西兰花", calories: 34, unit: "100g" },
  { name: "番茄", calories: 18, unit: "100g" },
  { name: "黄瓜", calories: 15, unit: "100g" },
  { name: "全麦面包", calories: 246, unit: "100g" },
  { name: "牛奶", calories: 54, unit: "100g" },
  { name: "酸奶", calories: 72, unit: "100g" },
  { name: "三文鱼", calories: 208, unit: "100g" },
  { name: "牛肉", calories: 250, unit: "100g" },
];

// 运动类型
const EXERCISE_TYPES = [
  { name: "跑步", caloriesPerMin: 8.5 },
  { name: "快走", caloriesPerMin: 4.5 },
  { name: "游泳", caloriesPerMin: 10 },
  { name: "骑行", caloriesPerMin: 7 },
  { name: "瑜伽", caloriesPerMin: 3 },
  { name: "健身房力量训练", caloriesPerMin: 6 },
  { name: "跳绳", caloriesPerMin: 12 },
  { name: "爬楼梯", caloriesPerMin: 9 },
];

export default function Checkin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<CheckinType>("all");
  
  // 打卡状态
  const [weightChecked, setWeightChecked] = useState(true);
  const [exerciseChecked, setExerciseChecked] = useState(false);

  // 饮食打卡状态改为根据餐次数据自动计算
  const hasDietData = () => {
    return mealData.breakfast.length > 0 || 
           mealData.lunch.length > 0 || 
           mealData.dinner.length > 0 || 
           mealData.snack.length > 0;
  };
  
  // 体重打卡数据（设备自动同步）
  const [weightData, setWeightData] = useState<WeightData>({
    value: 73.5,
    note: "今天状态不错",
    time: "08:30",
    autoSynced: true  // 标识为设备自动同步
  });

  // 饮食打卡数据（包含代餐）
  const [mealData, setMealData] = useState<MealData>({
    breakfast: [
      { name: "轻盈代餐粉", amount: "1袋", calories: 200, isMealReplacement: true, status: "已吃" }
    ],
    lunch: [
      { name: "活力代餐棒", amount: "1根", calories: 180, isMealReplacement: true, status: "已吃" }
    ],
    dinner: [
      { name: "糙米饭", amount: "150g", calories: 180 },
      { name: "鸡胸肉", amount: "100g", calories: 165 },
      { name: "西兰花", amount: "150g", calories: 50 }
    ],
    snack: []
  });

  // 运动打卡数据（包含设备自动同步的数据）
  const [exerciseData, setExerciseData] = useState<ExerciseData[]>([
    {
      type: "设备自动记录",
      duration: 45,
      intensity: "中等",
      calories: 342,
      time: "实时",
      autoSynced: true
    }
  ]);

  // 血压打卡数据（可能有多条记录）
  const [bloodPressureData, setBloodPressureData] = useState<BloodPressureData[]>([
    { systolic: 120, diastolic: 80, time: "08:00" }
  ]);
  
  // 血糖打卡数据（可能有多条记录）
  const [bloodSugarData, setBloodSugarData] = useState<BloodSugarData[]>([]);
  
  // 腰围打卡数据
  const [waistData, setWaistData] = useState<WaistData | null>(null);

  // 设备自动同步的健康数据
  const [stepsData] = useState({ value: 8234, time: "实时", autoSynced: true });
  const [heartRateData] = useState({ value: 72, time: "09:15", autoSynced: true });
  const [sleepData] = useState({ value: 7.5, time: "昨晚", autoSynced: true });

  // 日历弹窗状态
  const [showCalendar, setShowCalendar] = useState(false);

  // 历史打卡数据（模拟）
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

  // 编辑弹窗状态
  const [editingWeight, setEditingWeight] = useState(false);
  const [editingMeal, setEditingMeal] = useState<MealType | null>(null);
  const [editingExercise, setEditingExercise] = useState(false);
  const [addingDiet, setAddingDiet] = useState(false);
  const [editingBloodPressure, setEditingBloodPressure] = useState(false);
  const [editingBloodSugar, setEditingBloodSugar] = useState(false);
  const [editingWaist, setEditingWaist] = useState(false);

  // 临时编辑数据
  const [tempWeight, setTempWeight] = useState("");
  const [tempNote, setTempNote] = useState("");
  
  // 血压临时数据
  const [tempSystolic, setTempSystolic] = useState("");
  const [tempDiastolic, setTempDiastolic] = useState("");
  
  // 血糖临时数据
  const [tempBloodSugar, setTempBloodSugar] = useState("");
  const [tempBloodSugarType, setTempBloodSugarType] = useState<"空腹" | "餐后">("空腹");
  
  // 腰围临时数据
  const [tempWaist, setTempWaist] = useState("");

  // 设备绑定状态（从localStorage或context获取，这里模拟）
  const [hasDevice] = useState(true);



  // 饮食添加表单
  const [selectedMealType, setSelectedMealType] = useState<MealType>("breakfast");
  const [selectedFood, setSelectedFood] = useState("");
  const [foodAmount, setFoodAmount] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isMealReplacementInput, setIsMealReplacementInput] = useState(false);

  // 可搜索下拉框状态
  const [foodSearchText, setFoodSearchText] = useState("");
  const [isFoodDropdownOpen, setIsFoodDropdownOpen] = useState(false);

  // 运动可搜索下拉框状态
  const [exerciseSearchText, setExerciseSearchText] = useState("");
  const [isExerciseDropdownOpen, setIsExerciseDropdownOpen] = useState(false);

  // 运动添加表单
  const [selectedExerciseType, setSelectedExerciseType] = useState("");
  const [exerciseDuration, setExerciseDuration] = useState("");
  const [exerciseIntensity, setExerciseIntensity] = useState("中等");

  const todayProgress = [weightChecked, hasDietData(), exerciseChecked].filter(Boolean).length / 3 * 100;

  // 计算饮食数据
  const calculateNutrition = () => {
    const allFoods = [
      ...mealData.breakfast,
      ...mealData.lunch,
      ...mealData.dinner,
      ...mealData.snack
    ];
    
    const totalCalories = allFoods.reduce((sum, food) => sum + food.calories, 0);
    
    const nutritionData = [
      { name: "碳水化合物", value: 45, color: "#3b82f6" },
      { name: "蛋白质", value: 30, color: "#8b5cf6" },
      { name: "脂肪", value: 25, color: "#ec4899" }
    ];

    return { totalCalories, nutritionData };
  };

  const { totalCalories, nutritionData } = calculateNutrition();

  const getMealCalories = (meal: FoodItem[]) => {
    return meal.reduce((sum, food) => sum + food.calories, 0);
  };

  const getMealPercentage = (meal: FoodItem[]) => {
    if (totalCalories === 0) return 0;
    return Math.round((getMealCalories(meal) / totalCalories) * 100);
  };

  // 体重打卡
  const handleEditWeight = () => {
    setTempWeight(weightData.value.toString());
    setTempNote(weightData.note);
    setEditingWeight(true);
  };

  const handleSaveWeight = () => {
    if (tempWeight) {
      setWeightData({
        ...weightData,
        value: parseFloat(tempWeight),
        note: tempNote,
      });
      setWeightChecked(true);
      setEditingWeight(false);
    }
  };

  // 饮食打卡
  const handleAddFood = () => {
    if (!selectedFood || !foodAmount) return;

    const food = COMMON_FOODS.find(f => f.name === selectedFood);
    if (!food) return;

    // 简单计算：基于标准量的比例
    const standardAmount = parseFloat(food.unit);
    const actualAmount = parseFloat(foodAmount);
    const calculatedCalories = Math.round((actualAmount / standardAmount) * food.calories);

    const newFood: FoodItem = {
      name: selectedFood,
      amount: foodAmount + food.unit.replace(/[0-9]/g, ""),
      calories: calculatedCalories,
      image: uploadedImage || undefined,
      isMealReplacement: isMealReplacementInput,
      status: isMealReplacementInput ? "未吃" : undefined
    };

    setMealData({
      ...mealData,
      [selectedMealType]: [...mealData[selectedMealType], newFood]
    });

    // 重置表单
    setSelectedFood("");
    setFoodAmount("");
    setUploadedImage(null);
    setIsMealReplacementInput(false);
    setAddingDiet(false);
  };

  const handleRemoveFood = (mealType: MealType, index: number) => {
    const newMeal = [...mealData[mealType]];
    newMeal.splice(index, 1);
    setMealData({
      ...mealData,
      [mealType]: newMeal
    });
  };

  // 删除运动记录
  const handleRemoveExercise = (index: number) => {
    const newExerciseData = [...exerciseData];
    newExerciseData.splice(index, 1);
    setExerciseData(newExerciseData);
    if (newExerciseData.length === 0) {
      setExerciseChecked(false);
    }
  };

  // 运动打卡
  const handleAddExercise = () => {
    if (!selectedExerciseType || !exerciseDuration) return;

    const exerciseType = EXERCISE_TYPES.find(e => e.name === selectedExerciseType);
    if (!exerciseType) return;

    const duration = parseInt(exerciseDuration);
    const intensityMultiplier = exerciseIntensity === "低" ? 0.7 : exerciseIntensity === "高" ? 1.3 : 1;
    const calories = Math.round(exerciseType.caloriesPerMin * duration * intensityMultiplier);

    const newExercise: ExerciseData = {
      type: selectedExerciseType,
      duration: duration,
      intensity: exerciseIntensity,
      calories: calories,
      time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
    };

    setExerciseData([...exerciseData, newExercise]);
    setExerciseChecked(true);
    setEditingExercise(false);
    
    // 重置表单
    setSelectedExerciseType("");
    setExerciseDuration("");
    setExerciseIntensity("中等");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const mealTypeLabels = {
    breakfast: { name: "早餐", icon: "🌅" },
    lunch: { name: "午餐", icon: "🌞" },
    dinner: { name: "晚餐", icon: "🌙" },
    snack: { name: "加餐", icon: "🍎" }
  };

  // 血压打卡处理函数
  const handleAddBloodPressure = () => {
    if (!tempSystolic || !tempDiastolic) return;

    const newRecord: BloodPressureData = {
      systolic: parseInt(tempSystolic),
      diastolic: parseInt(tempDiastolic),
      time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
    };

    setBloodPressureData([...bloodPressureData, newRecord]);
    setEditingBloodPressure(false);
    setTempSystolic("");
    setTempDiastolic("");
  };

  const handleRemoveBloodPressure = (index: number) => {
    const newData = [...bloodPressureData];
    newData.splice(index, 1);
    setBloodPressureData(newData);
  };

  // 血糖打卡处理函数
  const handleAddBloodSugar = () => {
    if (!tempBloodSugar) return;

    const newRecord: BloodSugarData = {
      value: parseFloat(tempBloodSugar),
      type: tempBloodSugarType,
      time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
    };

    setBloodSugarData([...bloodSugarData, newRecord]);
    setEditingBloodSugar(false);
    setTempBloodSugar("");
    setTempBloodSugarType("空腹");
  };

  const handleRemoveBloodSugar = (index: number) => {
    const newData = [...bloodSugarData];
    newData.splice(index, 1);
    setBloodSugarData(newData);
  };

  // 腰围打卡处理函数
  const handleSaveWaist = () => {
    if (!tempWaist) return;

    const newData: WaistData = {
      value: parseFloat(tempWaist),
      time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
    };

    setWaistData(newData);
    setEditingWaist(false);
    setTempWaist("");
  };

  const handleEditWaist = () => {
    if (waistData) {
      setTempWaist(waistData.value.toString());
    }
    setEditingWaist(true);
  };

  // 处理代餐打卡状态更新
  const updateMealStatus = (mealType: MealType, index: number, status: "已吃" | "未吃" | "替代") => {
    setMealData({
      ...mealData,
      [mealType]: mealData[mealType].map((item, i) => 
        i === index && item.isMealReplacement
          ? { ...item, status }
          : item
      )
    });
  };

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden" style={{ backgroundColor: "#FAFAFF" }}>
      {/* 模糊渐变背景层 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        {/* Vector 1 - 浅蓝紫色 */}
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
        
        {/* Vector 2 - 浅蓝色 */}
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
        
        {/* Ellipse 1 - 浅橙色 (左下) */}
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
        
        {/* Ellipse 2 - 浅橙色 (中间偏右) */}
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
        style={{
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(43, 91, 255, 0.1)",
          padding: "12px 16px",
          position: "relative",
          zIndex: 10
        }}
        className="flex items-center justify-between sticky top-0"
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: "8px",
            borderRadius: "8px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "#1A1A1A"
          }}
          className="hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 style={{ fontWeight: 600, fontSize: "16px", color: "#1A1A1A" }}>打卡中心</h1>
        <button 
          onClick={() => setShowCalendar(true)}
          style={{
            padding: "8px",
            borderRadius: "8px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "#1A1A1A"
          }}
          className="hover:bg-gray-100 transition-colors"
        >
          <Calendar className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4" style={{ position: "relative", zIndex: 1 }}>
        {/* 今日概览 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: "linear-gradient(135deg, rgba(43, 91, 255, 0.95) 0%, rgba(147, 112, 255, 0.95) 100%)",
            backdropFilter: "blur(20px)",
            borderRadius: "24px",
            padding: "24px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 8px 32px rgba(43, 91, 255, 0.15)",
            color: "#FFFFFF"
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold mb-1" style={{ color: "#FFFFFF" }}>今日打卡</h2>
              <p className="text-blue-50">2026年2月27日 星期五</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{Math.round(todayProgress)}%</div>
              <div className="text-sm text-blue-50">完成度</div>
            </div>
          </div>

          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${todayProgress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-white rounded-full"
            />
          </div>

          {/* 横向滚动的指标卡片 */}
          <div className="flex gap-3 mt-4 overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollbarWidth: "none" }}>
            {/* 体重 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center min-w-[120px] flex-shrink-0">
              <div className={`mx-auto mb-2 ${weightChecked ? "text-green-400" : "text-white/60"}`}>
                {weightChecked ? <Check className="w-6 h-6 mx-auto" /> : <Weight className="w-6 h-6 mx-auto" />}
              </div>
              <div className="text-xs mb-1">体重</div>
              {weightChecked && (
                <div className="text-lg font-bold">{weightData.value} kg</div>
              )}
            </div>
            
            {/* 饮食 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center min-w-[120px] flex-shrink-0">
              <div className={`mx-auto mb-2 ${hasDietData() ? "text-green-400" : "text-white/60"}`}>
                {hasDietData() ? <Check className="w-6 h-6 mx-auto" /> : <Utensils className="w-6 h-6 mx-auto" />}
              </div>
              <div className="text-xs mb-1">饮食</div>
              {hasDietData() && (
                <div className="text-lg font-bold">{Object.values(mealData).reduce((sum, meal) => sum + meal.reduce((s, food) => s + food.calories, 0), 0)} kcal</div>
              )}
            </div>
            
            {/* 运动 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center min-w-[120px] flex-shrink-0">
              <div className={`mx-auto mb-2 ${exerciseChecked ? "text-green-400" : "text-white/60"}`}>
                {exerciseChecked ? <Check className="w-6 h-6 mx-auto" /> : <Activity className="w-6 h-6 mx-auto" />}
              </div>
              <div className="text-xs mb-1">运动</div>
              {exerciseChecked && exerciseData.length > 0 && (
                <div className="text-lg font-bold">{exerciseData.reduce((sum, ex) => sum + ex.calories, 0)} kcal</div>
              )}
            </div>

            {/* 步数 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center min-w-[120px] flex-shrink-0">
              <div className="mx-auto mb-2 text-green-400">
                <TrendingUp className="w-6 h-6 mx-auto" />
              </div>
              <div className="text-xs mb-1">步数</div>
              <div className="text-lg font-bold">{stepsData.value.toLocaleString()}</div>
            </div>

            {/* 心率 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center min-w-[120px] flex-shrink-0">
              <div className="mx-auto mb-2 text-green-400">
                <Heart className="w-6 h-6 mx-auto" />
              </div>
              <div className="text-xs mb-1">心率</div>
              <div className="text-lg font-bold">{heartRateData.value} bpm</div>
            </div>

            {/* 睡眠 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center min-w-[120px] flex-shrink-0">
              <div className="mx-auto mb-2 text-green-400">
                <Moon className="w-6 h-6 mx-auto" />
              </div>
              <div className="text-xs mb-1">睡眠</div>
              <div className="text-lg font-bold">{sleepData.value} h</div>
            </div>

            {/* 血压 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center min-w-[120px] flex-shrink-0">
              <div className={`mx-auto mb-2 ${bloodPressureData.length > 0 ? "text-green-400" : "text-white/60"}`}>
                {bloodPressureData.length > 0 ? <Check className="w-6 h-6 mx-auto" /> : <Heart className="w-6 h-6 mx-auto" />}
              </div>
              <div className="text-xs mb-1">血压</div>
              {bloodPressureData.length > 0 && (
                <div className="text-sm font-bold">{bloodPressureData[0].systolic}/{bloodPressureData[0].diastolic}</div>
              )}
            </div>

            {/* 血糖 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center min-w-[120px] flex-shrink-0">
              <div className={`mx-auto mb-2 ${bloodSugarData ? "text-green-400" : "text-white/60"}`}>
                {bloodSugarData ? <Check className="w-6 h-6 mx-auto" /> : <Droplet className="w-6 h-6 mx-auto" />}
              </div>
              <div className="text-xs mb-1">血糖</div>
              {bloodSugarData && (
                <div className="text-lg font-bold">{bloodSugarData.value}</div>
              )}
            </div>

            {/* 腰围 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center min-w-[120px] flex-shrink-0">
              <div className={`mx-auto mb-2 ${waistData ? "text-green-400" : "text-white/60"}`}>
                {waistData ? <Check className="w-6 h-6 mx-auto" /> : <Ruler className="w-6 h-6 mx-auto" />}
              </div>
              <div className="text-xs mb-1">腰围</div>
              {waistData && (
                <div className="text-lg font-bold">{waistData.value} cm</div>
              )}
            </div>
          </div>
        </motion.div>

        {/* 标签切换 */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: "all" as const, label: "全部", icon: Calendar },
            { id: "weight" as const, label: "体重", icon: Weight },
            { id: "steps" as const, label: "步数", icon: TrendingUp },
            { id: "diet" as const, label: "饮食", icon: Utensils },
            { id: "exercise" as const, label: "运动", icon: Activity },
            { id: "heart-rate" as const, label: "心率", icon: Heart },
            { id: "sleep" as const, label: "睡眠", icon: Moon },
            { id: "blood-pressure" as const, label: "血压", icon: Heart },
            { id: "blood-sugar" as const, label: "血糖", icon: Droplet },
            { id: "waist" as const, label: "腰围", icon: Ruler },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={
                activeTab === tab.id
                  ? {
                      background: "#2B5BFF",
                      color: "#FFFFFF",
                      borderRadius: "16px",
                      padding: "8px 16px",
                      fontWeight: 500,
                      border: "none",
                      boxShadow: "0 4px 12px rgba(43, 91, 255, 0.25)",
                      cursor: "pointer"
                    }
                  : {
                      background: "rgba(255, 255, 255, 0.9)",
                      color: "#8A8A93",
                      borderRadius: "16px",
                      padding: "8px 16px",
                      fontWeight: 500,
                      border: "1px solid rgba(43, 91, 255, 0.15)",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                      cursor: "pointer"
                    }
              }
              className="flex items-center gap-2 transition-all whitespace-nowrap"
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* 体重打卡 */}
        {(activeTab === "all" || activeTab === "weight") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: weightData.autoSynced 
                ? "rgba(59, 130, 246, 0.04)" 
                : "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(20px)",
              borderRadius: "24px",
              padding: "24px",
              border: weightData.autoSynced 
                ? "1px solid rgba(59, 130, 246, 0.15)" 
                : "1px solid rgba(43, 91, 255, 0.08)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)"
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Weight className="w-5 h-5" style={{ color: "#2B5BFF" }} />
                <h3 style={{ fontWeight: 600, fontSize: "16px", color: "#1A1A1A" }}>体重打卡</h3>
                {weightData.autoSynced && (
                  <div 
                    className="px-2 py-0.5 rounded flex items-center gap-1"
                    style={{
                      background: "rgba(59, 130, 246, 0.15)",
                      fontSize: "11px",
                      color: "#3B82F6",
                      fontWeight: 600
                    }}
                  >
                    <Bluetooth className="w-3 h-3" />
                    设备同步
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {weightChecked && (
                  <>
                    <span className="text-sm text-green-600 flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      已完成
                    </span>
                    <button
                      onClick={handleEditWeight}
                      className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {weightChecked ? (
              <div className="space-y-4">
                <div style={{
                  background: "linear-gradient(135deg, #EAEBFF 0%, #F5F0FF 100%)",
                  borderRadius: "16px",
                  padding: "24px",
                  border: "1px solid rgba(43, 91, 255, 0.1)"
                }}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div style={{ fontSize: "13px", color: "#8A8A93", marginBottom: "4px" }}>今日体重</div>
                      <div style={{ fontSize: "32px", fontWeight: 700, color: "#2B5BFF" }}>
                        {weightData.value} <span style={{ fontSize: "18px" }}>kg</span>
                      </div>
                    </div>
                    <div style={{ fontSize: "13px", color: "#8A8A93" }}>{weightData.time}</div>
                  </div>
                  {weightData.note && (
                    <div style={{ paddingTop: "16px", borderTop: "1px solid rgba(43, 91, 255, 0.1)" }}>
                      <div style={{ fontSize: "13px", color: "#8A8A93", marginBottom: "4px" }}>备注</div>
                      <div style={{ color: "#1A1A1A", fontSize: "14px" }}>{weightData.note}</div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div 
                  style={{
                    width: "64px",
                    height: "64px",
                    margin: "0 auto 16px",
                    background: "#EAEBFF",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Weight className="w-8 h-8" style={{ color: "#2B5BFF" }} />
                </div>
                <p style={{ color: "#8A8A93", marginBottom: "16px", fontSize: "14px" }}>还未进行体重打卡</p>
                <button
                  onClick={() => setEditingWeight(true)}
                  style={{
                    padding: "12px 24px",
                    background: "#2B5BFF",
                    color: "#FFFFFF",
                    borderRadius: "16px",
                    fontWeight: 500,
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(43, 91, 255, 0.25)"
                  }}
                  className="hover:opacity-90 transition-opacity"
                >
                  去打卡
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* 饮食打卡 */}
        {(activeTab === "all" || activeTab === "diet") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(20px)",
              borderRadius: "24px",
              padding: "24px",
              border: "1px solid rgba(43, 91, 255, 0.08)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)"
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Utensils className="w-5 h-5" style={{ color: "#2B5BFF" }} />
                <h3 style={{ fontWeight: 600, fontSize: "16px", color: "#1A1A1A" }}>饮食打卡</h3>
                {/* 只有打卡后且有非代餐的饮食项才显示手动打卡标签 */}
                {hasDietData() && Object.values(mealData).some(items => items.some(item => !item.isMealReplacement)) && (
                  <div 
                    className="px-2 py-0.5 rounded flex items-center gap-1"
                    style={{
                      background: "rgba(107, 114, 128, 0.1)",
                      fontSize: "11px",
                      color: "#6B7280",
                      fontWeight: 600
                    }}
                  >
                    <Edit2 className="w-3 h-3" />
                    手动打卡
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {hasDietData() && (
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    已完成
                  </span>
                )}
                <button
                  onClick={() => setAddingDiet(true)}
                  className="p-2 hover:bg-orange-50 rounded-lg transition-colors text-orange-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {hasDietData() ? (
              <div className="space-y-4">
                {/* 总摄入量卡片 */}
                <div style={{
                  background: "linear-gradient(135deg, #EAEBFF 0%, #F5F0FF 100%)",
                  borderRadius: "16px",
                  padding: "24px",
                  border: "1px solid rgba(43, 91, 255, 0.1)"
                }}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div style={{ fontSize: "13px", color: "#8A8A93", marginBottom: "4px" }}>今日总摄入</div>
                      <div style={{ fontSize: "32px", fontWeight: 700, color: "#2B5BFF" }}>
                        {totalCalories} <span style={{ fontSize: "18px" }}>kcal</span>
                      </div>
                    </div>
                    <div style={{ fontSize: "13px", color: "#8A8A93" }}>
                      目标：1800 kcal
                    </div>
                  </div>

                  {/* 三大营养素占比图 */}
                  <div style={{
                    background: "#FFFFFF",
                    borderRadius: "16px",
                    padding: "16px",
                    border: "1px solid rgba(43, 91, 255, 0.08)"
                  }}>
                    <div style={{ fontSize: "13px", fontWeight: 500, color: "#1A1A1A", marginBottom: "12px", textAlign: "center" }}>营养素分布</div>
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie
                          data={nutritionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name} ${value}%`}
                          outerRadius={60}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {nutritionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 代餐套餐购买入口 */}
                <div className="mt-4 p-4 rounded-xl" style={{ background: "rgba(43, 91, 255, 0.06)", border: "1px solid rgba(43, 91, 255, 0.15)" }}>
                  <button
                    onClick={() => navigate('/meal-packages')}
                    className="w-full flex items-center justify-between hover:opacity-80 transition-opacity"
                  >
                    <div className="flex items-center gap-2">
                      <Coffee className="w-5 h-5" style={{ color: "#2B5BFF" }} />
                      <span style={{ fontSize: "15px", color: "#2B5BFF", fontWeight: 600 }}>
                        购买代餐套餐
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5" style={{ color: "#2B5BFF" }} />
                  </button>
                </div>

                {/* 餐次详情 */}
                <div className="space-y-3">
                  {(Object.keys(mealTypeLabels) as MealType[]).map((mealType) => {
                    const meal = mealData[mealType];
                    const mealInfo = mealTypeLabels[mealType];
                    
                    // 已打卡的餐次
                    if (meal.length > 0) {
                      return (
                        <div key={mealType} style={{
                          border: "1px solid rgba(43, 91, 255, 0.12)",
                          borderRadius: "16px",
                          padding: "16px",
                          background: "rgba(255, 255, 255, 0.5)"
                        }}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xl">{mealInfo.icon}</span>
                              <span className="font-medium">{mealInfo.name}</span>
                              <span className="text-sm text-gray-500">
                                {getMealCalories(meal)} kcal ({getMealPercentage(meal)}%)
                              </span>
                              {/* 如果包含代餐，显示代餐标签 */}
                              {meal.some(item => item.isMealReplacement) && (
                                <div 
                                  className="px-2 py-0.5 rounded flex items-center gap-1"
                                  style={{
                                    background: "rgba(251, 146, 60, 0.1)",
                                    fontSize: "11px",
                                    color: "#FB923C",
                                    fontWeight: 600
                                  }}
                                >
                                  <Coffee className="w-3 h-3" />
                                  含代餐
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => {
                                setSelectedMealType(mealType);
                                setEditingMeal(mealType);
                              }}
                              className="text-sm text-blue-600 hover:text-blue-700"
                            >
                              编辑
                            </button>
                          </div>
                          <div className="space-y-2">
                            {meal.map((food, index) => (
                              <div key={index} className="flex items-center gap-3 text-sm">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                  {food.image ? (
                                    <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <Utensils className="w-6 h-6 text-gray-400" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <div className="font-medium text-gray-700">{food.name}</div>
                                    {food.isMealReplacement && (
                                      <div 
                                        className="px-1.5 py-0.5 rounded flex items-center gap-1"
                                        style={{
                                          background: "rgba(251, 146, 60, 0.1)",
                                          fontSize: "10px",
                                          color: "#FB923C",
                                          fontWeight: 600
                                        }}
                                      >
                                        <Coffee className="w-2.5 h-2.5" />
                                        代餐
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-gray-500">{food.amount}</div>
                                </div>
                                <div className="text-gray-600">{food.calories} kcal</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    } else {
                      // 未打卡的餐次
                      return (
                        <div key={mealType} style={{
                          border: "2px dashed rgba(138, 138, 147, 0.3)",
                          borderRadius: "16px",
                          padding: "16px",
                          background: "rgba(234, 235, 255, 0.3)"
                        }}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{mealInfo.icon}</span>
                              <span className="font-medium text-gray-600">{mealInfo.name}</span>
                              <span style={{
                                fontSize: "11px",
                                background: "rgba(138, 138, 147, 0.15)",
                                color: "#8A8A93",
                                padding: "2px 8px",
                                borderRadius: "4px"
                              }}>
                                未打卡
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedMealType(mealType);
                                setAddingDiet(true);
                              }}
                              className="flex-1 flex items-center justify-center gap-2 py-2 bg-white border border-orange-300 text-orange-600 rounded-lg text-sm font-medium hover:bg-orange-50 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                              去打卡
                            </button>
                            <label className="flex items-center justify-center gap-2 py-2 px-3 bg-white border border-gray-300 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">
                              <Camera className="w-4 h-4" />
                              拍照
                              <input
                                type="file"
                                accept="image/*"
                                capture="environment"
                                onChange={(e) => {
                                  handleImageUpload(e);
                                  setSelectedMealType(mealType);
                                  setAddingDiet(true);
                                }}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>

                <button
                  onClick={() => setAddingDiet(true)}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-orange-50 text-orange-600 border border-orange-200 rounded-lg font-medium hover:bg-orange-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  添加饮食记录
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-orange-50 rounded-full flex items-center justify-center">
                  <Utensils className="w-8 h-8 text-orange-500" />
                </div>
                <p className="text-gray-500 mb-4">还未进行饮食打卡</p>
                <button
                  onClick={() => setAddingDiet(true)}
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                >
                  去打卡
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* 运动打卡 */}
        {(activeTab === "all" || activeTab === "exercise") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(20px)",
              borderRadius: "24px",
              padding: "24px",
              border: "1px solid rgba(43, 91, 255, 0.08)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)"
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5" style={{ color: "#2B5BFF" }} />
                <h3 style={{ fontWeight: 600, fontSize: "16px", color: "#1A1A1A" }}>运动打卡</h3>
              </div>
              {exerciseChecked && (
                <span className="text-sm text-green-600 flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  已完成
                </span>
              )}
            </div>

            {exerciseChecked && exerciseData.length > 0 ? (
              <div className="space-y-4">
                {/* 总消耗卡片 */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">今日总消耗</div>
                      <div className="text-3xl font-bold text-green-600">
                        {exerciseData.reduce((sum, ex) => sum + ex.calories, 0)} <span className="text-lg">kcal</span>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>运动时长</div>
                      <div className="text-lg font-semibold text-green-600">
                        {exerciseData.reduce((sum, ex) => sum + ex.duration, 0)} 分钟
                      </div>
                    </div>
                  </div>
                </div>

                {/* 运动详情 */}
                <div className="space-y-3">
                  {exerciseData.map((exercise, index) => (
                    <div 
                      key={index} 
                      className="rounded-lg p-4"
                      style={{
                        background: exercise.autoSynced ? "rgba(59, 130, 246, 0.04)" : "#FFFFFF",
                        border: exercise.autoSynced ? "1px solid rgba(59, 130, 246, 0.15)" : "1px solid #E5E7EB"
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Activity className="w-5 h-5 text-green-500" />
                          <span className="font-medium">{exercise.type}</span>
                          {exercise.autoSynced ? (
                            <div 
                              className="px-2 py-0.5 rounded flex items-center gap-1"
                              style={{
                                background: "rgba(59, 130, 246, 0.15)",
                                fontSize: "11px",
                                color: "#3B82F6",
                                fontWeight: 600
                              }}
                            >
                              <Bluetooth className="w-3 h-3" />
                              设备同步
                            </div>
                          ) : (
                            <div 
                              className="px-2 py-0.5 rounded flex items-center gap-1"
                              style={{
                                background: "rgba(107, 114, 128, 0.1)",
                                fontSize: "11px",
                                color: "#6B7280",
                                fontWeight: 600
                              }}
                            >
                              <Edit2 className="w-3 h-3" />
                              手动打卡
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">{exercise.time}</span>
                          <button
                            onClick={() => handleRemoveExercise(index)}
                            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-red-500"
                            title="删除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <div className="text-gray-500">时长</div>
                          <div className="font-medium text-gray-700">{exercise.duration} 分钟</div>
                        </div>
                        <div>
                          <div className="text-gray-500">强度</div>
                          <div className="font-medium text-gray-700">{exercise.intensity}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">消耗</div>
                          <div className="font-medium text-green-600">{exercise.calories} kcal</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setEditingExercise(true)}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-green-50 text-green-600 border border-green-200 rounded-lg font-medium hover:bg-green-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  添加运动
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div 
                  style={{
                    width: "64px",
                    height: "64px",
                    margin: "0 auto 16px",
                    background: "#EAEBFF",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Activity className="w-8 h-8" style={{ color: "#2B5BFF" }} />
                </div>
                <p style={{ color: "#8A8A93", marginBottom: "16px", fontSize: "14px" }}>还未进行运动打卡</p>
                <button
                  onClick={() => setEditingExercise(true)}
                  style={{
                    padding: "12px 24px",
                    background: "#2B5BFF",
                    color: "#FFFFFF",
                    borderRadius: "16px",
                    fontWeight: 500,
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(43, 91, 255, 0.25)"
                  }}
                  className="hover:opacity-90 transition-opacity"
                >
                  去打卡
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* 步数打卡（设备自动同步） */}
        {(activeTab === "all" || activeTab === "steps") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: "rgba(59, 130, 246, 0.04)",
              backdropFilter: "blur(20px)",
              borderRadius: "24px",
              padding: "24px",
              border: "1px solid rgba(59, 130, 246, 0.15)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)"
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" style={{ color: "#2B5BFF" }} />
                <h3 style={{ fontWeight: 600, fontSize: "16px", color: "#1A1A1A" }}>步数打卡</h3>
                <div 
                  className="px-2 py-0.5 rounded flex items-center gap-1"
                  style={{
                    background: "rgba(59, 130, 246, 0.15)",
                    fontSize: "11px",
                    color: "#3B82F6",
                    fontWeight: 600
                  }}
                >
                  <Bluetooth className="w-3 h-3" />
                  设备同步
                </div>
              </div>
            </div>

            <div className="text-center py-8">
              <div className="text-6xl font-bold mb-2" style={{ color: "#2B5BFF" }}>
                {stepsData.value.toLocaleString()}
              </div>
              <div className="text-lg text-gray-500 mb-1">步</div>
              <div className="text-sm text-gray-400">更新时间：{stepsData.time}</div>
            </div>

            <div className="mt-4 p-4 rounded-xl" style={{ background: "rgba(59, 130, 246, 0.06)" }}>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">今日目标</span>
                <span className="text-sm font-semibold" style={{ color: "#2B5BFF" }}>10,000 步</span>
              </div>
              <div className="mt-2 h-2 bg-white rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full"
                  style={{ 
                    width: `${Math.min((stepsData.value / 10000) * 100, 100)}%`,
                    background: "#2B5BFF"
                  }}
                />
              </div>
              <div className="mt-1 text-xs text-gray-500 text-right">
                已完成 {Math.round((stepsData.value / 10000) * 100)}%
              </div>
            </div>
          </motion.div>
        )}

        {/* 心率打卡（设备自动同步） */}
        {(activeTab === "all" || activeTab === "heart-rate") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: "rgba(59, 130, 246, 0.04)",
              backdropFilter: "blur(20px)",
              borderRadius: "24px",
              padding: "24px",
              border: "1px solid rgba(59, 130, 246, 0.15)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)"
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5" style={{ color: "#EF4444" }} />
                <h3 style={{ fontWeight: 600, fontSize: "16px", color: "#1A1A1A" }}>心率打卡</h3>
                <div 
                  className="px-2 py-0.5 rounded flex items-center gap-1"
                  style={{
                    background: "rgba(59, 130, 246, 0.15)",
                    fontSize: "11px",
                    color: "#3B82F6",
                    fontWeight: 600
                  }}
                >
                  <Bluetooth className="w-3 h-3" />
                  设备同步
                </div>
              </div>
            </div>

            <div className="text-center py-8">
              <div className="text-6xl font-bold mb-2" style={{ color: "#EF4444" }}>
                {heartRateData.value}
              </div>
              <div className="text-lg text-gray-500 mb-1">bpm</div>
              <div className="text-sm text-gray-400">更新时间：{heartRateData.time}</div>
            </div>

            <div className="mt-4 p-4 rounded-xl" style={{ background: "rgba(16, 185, 129, 0.06)" }}>
              <div className="flex items-center gap-2 text-green-600">
                <Check className="w-5 h-5" />
                <span className="font-semibold">心率正常范围</span>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                静息心率：60-100 bpm
              </div>
            </div>
          </motion.div>
        )}

        {/* 睡眠打卡（设备自动同步） */}
        {(activeTab === "all" || activeTab === "sleep") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: "rgba(59, 130, 246, 0.04)",
              backdropFilter: "blur(20px)",
              borderRadius: "24px",
              padding: "24px",
              border: "1px solid rgba(59, 130, 246, 0.15)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)"
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Moon className="w-5 h-5" style={{ color: "#6366F1" }} />
                <h3 style={{ fontWeight: 600, fontSize: "16px", color: "#1A1A1A" }}>睡眠打卡</h3>
                <div 
                  className="px-2 py-0.5 rounded flex items-center gap-1"
                  style={{
                    background: "rgba(59, 130, 246, 0.15)",
                    fontSize: "11px",
                    color: "#3B82F6",
                    fontWeight: 600
                  }}
                >
                  <Bluetooth className="w-3 h-3" />
                  设备同步
                </div>
              </div>
            </div>

            <div className="text-center py-8">
              <div className="text-6xl font-bold mb-2" style={{ color: "#6366F1" }}>
                {sleepData.value}
              </div>
              <div className="text-lg text-gray-500 mb-1">小时</div>
              <div className="text-sm text-gray-400">记录时间：{sleepData.time}</div>
            </div>

            <div className="mt-4 p-4 rounded-xl" style={{ background: "rgba(99, 102, 241, 0.06)" }}>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">建议睡眠时长</span>
                <span className="text-sm font-semibold" style={{ color: "#6366F1" }}>7-9 小时</span>
              </div>
              <div className="mt-2 h-2 bg-white rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full"
                  style={{ 
                    width: `${Math.min((sleepData.value / 8) * 100, 100)}%`,
                    background: "#6366F1"
                  }}
                />
              </div>
              <div className="mt-1 text-xs text-gray-500 text-right">
                {sleepData.value >= 7 ? "睡眠充足" : "建议增加睡眠时间"}
              </div>
            </div>
          </motion.div>
        )}

        {/* 血压打卡 */}
        {(activeTab === "all" || activeTab === "blood-pressure") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(20px)",
              borderRadius: "24px",
              padding: "24px",
              border: "1px solid rgba(43, 91, 255, 0.08)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)"
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5" style={{ color: "#2B5BFF" }} />
                <h3 style={{ fontWeight: 600, fontSize: "16px", color: "#1A1A1A" }}>血压打卡</h3>
                {bloodPressureData.length > 0 && (
                  <div 
                    className="px-2 py-0.5 rounded flex items-center gap-1"
                    style={{
                      background: "rgba(107, 114, 128, 0.1)",
                      fontSize: "11px",
                      color: "#6B7280",
                      fontWeight: 600
                    }}
                  >
                    <Edit2 className="w-3 h-3" />
                    手动打卡
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {bloodPressureData.length > 0 && (
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    已完成
                  </span>
                )}
                <button
                  onClick={() => setEditingBloodPressure(true)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {bloodPressureData.length > 0 ? (
              <div className="space-y-3">
                {bloodPressureData.map((record, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-50 to-pink-50 rounded-full flex items-center justify-center">
                          <Heart className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">测量时间</div>
                          <div className="font-medium text-gray-700">{record.time}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveBloodPressure(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">收缩压</div>
                        <div className="text-2xl font-bold text-red-600">{record.systolic} <span className="text-sm">mmHg</span></div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">舒张压</div>
                        <div className="text-2xl font-bold text-pink-600">{record.diastolic} <span className="text-sm">mmHg</span></div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      {record.systolic < 120 && record.diastolic < 80 ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          ✓ 正常血压
                        </span>
                      ) : record.systolic >= 140 || record.diastolic >= 90 ? (
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                          ⚠️ 高血压
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                          ⚡ 血压偏高
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
                  <Heart className="w-8 h-8 text-red-500" />
                </div>
                <p className="text-gray-500 mb-4">还未进行血压打卡</p>
                <button
                  onClick={() => setEditingBloodPressure(true)}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  去打卡
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* 血糖打卡 */}
        {(activeTab === "all" || activeTab === "blood-sugar") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(20px)",
              borderRadius: "24px",
              padding: "24px",
              border: "1px solid rgba(43, 91, 255, 0.08)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)"
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Droplet className="w-5 h-5" style={{ color: "#2B5BFF" }} />
                <h3 style={{ fontWeight: 600, fontSize: "16px", color: "#1A1A1A" }}>血糖打卡</h3>
                {bloodSugarData.length > 0 && (
                  <div 
                    className="px-2 py-0.5 rounded flex items-center gap-1"
                    style={{
                      background: "rgba(107, 114, 128, 0.1)",
                      fontSize: "11px",
                      color: "#6B7280",
                      fontWeight: 600
                    }}
                  >
                    <Edit2 className="w-3 h-3" />
                    手动打卡
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {bloodSugarData.length > 0 && (
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    已完成
                  </span>
                )}
                <button
                  onClick={() => setEditingBloodSugar(true)}
                  className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {bloodSugarData.length > 0 ? (
              <div className="space-y-3">
                {bloodSugarData.map((record, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-full flex items-center justify-center">
                          <Droplet className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">{record.type} · {record.time}</div>
                          <div className="text-2xl font-bold text-blue-600">{record.value} <span className="text-sm">mmol/L</span></div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveBloodSugar(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      {record.type === "空腹" ? (
                        record.value < 6.1 ? (
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                            ✓ 正常
                          </span>
                        ) : record.value >= 7.0 ? (
                          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                            ⚠️ 空腹血糖偏高
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                            ⚡ 空腹血糖受损
                          </span>
                        )
                      ) : (
                        record.value < 7.8 ? (
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                            ✓ 正常
                          </span>
                        ) : record.value >= 11.1 ? (
                          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                            ⚠️ 餐后血糖偏高
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                            ⚡ 糖耐量异常
                          </span>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
                  <Droplet className="w-8 h-8 text-blue-500" />
                </div>
                <p className="text-gray-500 mb-4">还未进行血糖打卡</p>
                <button
                  onClick={() => setEditingBloodSugar(true)}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  去打卡
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* 腰围打卡 */}
        {(activeTab === "all" || activeTab === "waist") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(20px)",
              borderRadius: "24px",
              padding: "24px",
              border: "1px solid rgba(43, 91, 255, 0.08)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)"
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5" style={{ color: "#2B5BFF" }} />
                <h3 style={{ fontWeight: 600, fontSize: "16px", color: "#1A1A1A" }}>腰围打卡</h3>
                {waistData && (
                  <div 
                    className="px-2 py-0.5 rounded flex items-center gap-1"
                    style={{
                      background: "rgba(107, 114, 128, 0.1)",
                      fontSize: "11px",
                      color: "#6B7280",
                      fontWeight: 600
                    }}
                  >
                    <Edit2 className="w-3 h-3" />
                    手动打卡
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {waistData && (
                  <>
                    <span className="text-sm text-green-600 flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      已完成
                    </span>
                    <button
                      onClick={handleEditWaist}
                      className="p-2 hover:bg-purple-50 rounded-lg transition-colors text-purple-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {waistData ? (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">今日腰围</div>
                      <div className="text-3xl font-bold text-purple-600">{waistData.value} <span className="text-lg">cm</span></div>
                    </div>
                    <div className="text-sm text-gray-500">{waistData.time}</div>
                  </div>
                  <div className="pt-3 border-t border-purple-100">
                    {waistData.value < 85 ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        ✓ 腰围正常
                      </span>
                    ) : waistData.value >= 90 ? (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                        ⚠️ 中心性肥胖
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                        ⚡ 腰围偏大
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-50 rounded-full flex items-center justify-center">
                  <Ruler className="w-8 h-8 text-purple-500" />
                </div>
                <p className="text-gray-500 mb-4">还未进行腰围打卡</p>
                <button
                  onClick={() => setEditingWaist(true)}
                  className="px-6 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors"
                >
                  去打卡
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* 体重编辑弹窗 */}
      <AnimatePresence>
        {editingWeight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setEditingWeight(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(20px)",
                borderRadius: "24px",
                padding: "24px",
                maxWidth: "28rem",
                width: "100%",
                border: "1px solid rgba(43, 91, 255, 0.1)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)"
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#1A1A1A" }}>体重打卡</h3>
                <button
                  onClick={() => setEditingWeight(false)}
                  style={{
                    padding: "8px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "8px"
                  }}
                  className="hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" style={{ color: "#8A8A93" }} />
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 500, marginBottom: "8px", color: "#1A1A1A" }}>今日体重（kg）</label>
                  <input
                    type="number"
                    value={tempWeight}
                    onChange={(e) => setTempWeight(e.target.value)}
                    placeholder="请输入体重"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "1px solid rgba(43, 91, 255, 0.2)",
                      borderRadius: "16px",
                      fontSize: "14px",
                      color: "#1A1A1A",
                      background: "rgba(255, 255, 255, 0.8)"
                    }}
                    className="focus:outline-none focus:ring-2 focus:ring-blue-500"
                    step="0.1"
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 500, marginBottom: "8px", color: "#1A1A1A" }}>备注（可选）</label>
                  <textarea
                    value={tempNote}
                    onChange={(e) => setTempNote(e.target.value)}
                    placeholder="记录今日状态、饮食等"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "1px solid rgba(43, 91, 255, 0.2)",
                      borderRadius: "16px",
                      fontSize: "14px",
                      color: "#1A1A1A",
                      background: "rgba(255, 255, 255, 0.8)",
                      resize: "none"
                    }}
                    className="focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setEditingWeight(false)}
                    style={{
                      flex: 1,
                      padding: "12px 24px",
                      background: "rgba(234, 235, 255, 0.5)",
                      color: "#8A8A93",
                      borderRadius: "16px",
                      fontWeight: 500,
                      border: "none",
                      cursor: "pointer"
                    }}
                    className="hover:bg-gray-200 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSaveWeight}
                    disabled={!tempWeight}
                    style={{
                      flex: 1,
                      padding: "12px 24px",
                      background: !tempWeight ? "#E0E0E0" : "#2B5BFF",
                      color: "#FFFFFF",
                      borderRadius: "16px",
                      fontWeight: 500,
                      border: "none",
                      cursor: !tempWeight ? "not-allowed" : "pointer",
                      boxShadow: !tempWeight ? "none" : "0 4px 12px rgba(43, 91, 255, 0.25)"
                    }}
                    className="hover:opacity-90 transition-opacity"
                  >
                    保存
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 饮食添加/编辑弹窗 */}
      <AnimatePresence>
        {(addingDiet || editingMeal) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={() => {
              setAddingDiet(false);
              setEditingMeal(null);
              setIsMealReplacementInput(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full my-8"
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "24px",
                padding: "24px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.5)"
              }}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: "16px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#1A1A1A" }}>
                  {editingMeal ? `编辑${mealTypeLabels[editingMeal].name}` : "添加饮食记录"}
                </h3>
                <button
                  onClick={() => {
                    setAddingDiet(false);
                    setEditingMeal(null);
                  }}
                  className="p-2 rounded-lg transition-colors"
                  style={{
                    backgroundColor: "transparent",
                    color: "#8A8A93"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#EAEBFF"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* 餐次选择 */}
                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#1A1A1A", marginBottom: "8px" }}>餐次</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(Object.keys(mealTypeLabels) as MealType[]).map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedMealType(type)}
                        className="py-2 px-3 text-sm font-medium transition-all"
                        style={{
                          borderRadius: "16px",
                          backgroundColor: selectedMealType === type ? "#2B5BFF" : "#EAEBFF",
                          color: selectedMealType === type ? "#FFFFFF" : "#1A1A1A",
                          border: "none",
                          cursor: "pointer"
                        }}
                        onMouseEnter={(e) => {
                          if (selectedMealType !== type) {
                            e.currentTarget.style.backgroundColor = "#D6D9FF";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedMealType !== type) {
                            e.currentTarget.style.backgroundColor = "#EAEBFF";
                          }
                        }}
                      >
                        {mealTypeLabels[type].icon} {mealTypeLabels[type].name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 图片上传 */}
                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#1A1A1A", marginBottom: "8px" }}>食物图片</label>
                  <div className="flex items-center gap-3">
                    <div 
                      className="relative rounded-lg overflow-hidden"
                      style={{
                        width: "96px",
                        height: "96px",
                        border: "2px solid #EAEBFF",
                        backgroundColor: "#FAFAFF"
                      }}
                    >
                      {uploadedImage ? (
                        <>
                          <img src={uploadedImage} alt="上传的食物" className="w-full h-full object-cover" />
                          <button
                            onClick={() => setUploadedImage(null)}
                            className="absolute top-1 right-1 p-1 text-white rounded-full transition-colors"
                            style={{
                              backgroundColor: "#FF4444",
                              boxShadow: "0 2px 8px rgba(255, 68, 68, 0.3)"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#FF0000"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#FF4444"}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon style={{ width: "40px", height: "40px", color: "#8A8A93" }} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label 
                        className="block w-full text-center text-sm font-medium cursor-pointer transition-all"
                        style={{
                          padding: "8px 16px",
                          background: "linear-gradient(135deg, #2B5BFF 0%, #6B8FFF 100%)",
                          color: "#FFFFFF",
                          borderRadius: "16px",
                          border: "none"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-1px)"}
                        onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Camera className="w-4 h-4" />
                          {uploadedImage ? "更换图片" : "上传图片"}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                      <label 
                        className="block w-full text-center text-sm font-medium cursor-pointer transition-all"
                        style={{
                          padding: "8px 16px",
                          backgroundColor: "#EAEBFF",
                          color: "#2B5BFF",
                          borderRadius: "16px",
                          border: "1px solid rgba(43, 91, 255, 0.2)"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#D6D9FF";
                          e.currentTarget.style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#EAEBFF";
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Camera className="w-4 h-4" />
                          拍照
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* 食物选择 */}
                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#1A1A1A", marginBottom: "8px" }}>选择食物</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={selectedFood || foodSearchText}
                      onChange={(e) => {
                        setFoodSearchText(e.target.value);
                        setSelectedFood("");
                        setIsFoodDropdownOpen(true);
                      }}
                      onFocus={(e) => {
                        setIsFoodDropdownOpen(true);
                        e.currentTarget.style.borderColor = "#2B5BFF";
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(43, 91, 255, 0.1)";
                      }}
                      onBlur={(e) => {
                        setTimeout(() => setIsFoodDropdownOpen(false), 200);
                        e.currentTarget.style.borderColor = "#EAEBFF";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                      placeholder="搜索食物"
                      className="w-full transition-all"
                      style={{
                        padding: "12px 16px",
                        border: "1px solid #EAEBFF",
                        borderRadius: "16px",
                        fontSize: "14px",
                        color: "#1A1A1A",
                        outline: "none"
                      }}
                    />
                    {isFoodDropdownOpen && foodSearchText && (
                      <div 
                        className="absolute left-0 right-0 top-full overflow-y-auto z-10"
                        style={{
                          marginTop: "4px",
                          backgroundColor: "#FFFFFF",
                          border: "1px solid #EAEBFF",
                          borderRadius: "16px",
                          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                          maxHeight: "240px"
                        }}
                      >
                        {COMMON_FOODS
                          .filter(food =>
                            food.name.toLowerCase().includes(foodSearchText.toLowerCase())
                          )
                          .map((food) => (
                            <button
                              key={food.name}
                              onClick={() => {
                                setSelectedFood(food.name);
                                setFoodSearchText("");
                                setIsFoodDropdownOpen(false);
                              }}
                              className="w-full text-left transition-colors"
                              style={{
                                padding: "12px 16px",
                                fontSize: "14px",
                                borderBottom: "1px solid #EAEBFF",
                                backgroundColor: "transparent",
                                border: "none",
                                cursor: "pointer"
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#FAFAFF"}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                            >
                              <div style={{ fontWeight: 500, color: "#1A1A1A" }}>{food.name}</div>
                              <div style={{ fontSize: "12px", color: "#8A8A93", marginTop: "2px" }}>{food.calories}kcal / {food.unit}</div>
                            </button>
                          ))}
                        {COMMON_FOODS.filter(food =>
                          food.name.toLowerCase().includes(foodSearchText.toLowerCase())
                        ).length === 0 && (
                          <div style={{ padding: "12px 16px", textAlign: "center", fontSize: "14px", color: "#8A8A93" }}>
                            未找到匹配的食物
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {selectedFood && (
                    <div className="flex items-center gap-2" style={{ marginTop: "8px", fontSize: "14px" }}>
                      <span 
                        className="font-medium"
                        style={{
                          padding: "4px 12px",
                          backgroundColor: "#EAEBFF",
                          color: "#2B5BFF",
                          borderRadius: "16px"
                        }}
                      >
                        已选择：{selectedFood}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedFood("");
                          setFoodSearchText("");
                        }}
                        className="transition-colors"
                        style={{
                          color: "#8A8A93",
                          backgroundColor: "transparent",
                          border: "none",
                          cursor: "pointer"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = "#FF4444"}
                        onMouseLeave={(e) => e.currentTarget.style.color = "#8A8A93"}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* 摄入量 */}
                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#1A1A1A", marginBottom: "8px" }}>摄入量（重量）</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={foodAmount}
                      onChange={(e) => setFoodAmount(e.target.value)}
                      placeholder="重量"
                      className="flex-1 transition-all"
                      style={{
                        padding: "12px 16px",
                        border: "1px solid #EAEBFF",
                        borderRadius: "16px",
                        fontSize: "14px",
                        color: "#1A1A1A",
                        outline: "none"
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#2B5BFF";
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(43, 91, 255, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#EAEBFF";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                      step="1"
                      min="1"
                    />
                    <div 
                      className="flex items-center font-medium"
                      style={{
                        padding: "12px 16px",
                        backgroundColor: "#EAEBFF",
                        borderRadius: "16px",
                        color: "#1A1A1A"
                      }}
                    >
                      g
                    </div>
                  </div>
                  {selectedFood && foodAmount && (
                    <div style={{ marginTop: "8px", fontSize: "14px", color: "#8A8A93" }}>
                      预计热量：
                      <span style={{ fontWeight: 600, color: "#2B5BFF" }}>
                        {Math.round(
                          (parseFloat(foodAmount) / 100) *
                          (COMMON_FOODS.find(f => f.name === selectedFood)?.calories || 0)
                        )} kcal
                      </span>
                    </div>
                  )}
                </div>

                {/* 是否代餐选项 */}
                <div>
                  <label 
                    className="flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-all"
                    style={{
                      background: isMealReplacementInput ? "rgba(251, 146, 60, 0.08)" : "rgba(0, 0, 0, 0.02)",
                      border: isMealReplacementInput ? "1px solid rgba(251, 146, 60, 0.2)" : "1px solid rgba(0, 0, 0, 0.06)"
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isMealReplacementInput}
                      onChange={(e) => setIsMealReplacementInput(e.target.checked)}
                      className="w-5 h-5 rounded cursor-pointer"
                      style={{ accentColor: "#FB923C" }}
                    />
                    <div className="flex items-center gap-2">
                      <Coffee className="w-4 h-4" style={{ color: "#FB923C" }} />
                      <span style={{ fontSize: "14px", fontWeight: 500, color: "#1A1A1A" }}>标记为代餐</span>
                    </div>
                  </label>
                  {isMealReplacementInput && (
                    <div style={{ marginTop: "8px", fontSize: "12px", color: "#FB923C", paddingLeft: "12px" }}>
                      代餐将显示在代餐管理中，可以单独追踪完成状态
                    </div>
                  )}
                </div>

                {/* 已添加的食物列表（编辑模式） */}
                {editingMeal && mealData[editingMeal].length > 0 && (
                  <div>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#1A1A1A", marginBottom: "8px" }}>已记录的食物</label>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "160px", overflowY: "auto" }}>
                      {mealData[editingMeal].map((food, index) => (
                        <div 
                          key={index} 
                          className="flex items-center gap-2"
                          style={{
                            padding: "8px",
                            backgroundColor: "#FAFAFF",
                            borderRadius: "16px",
                            border: "1px solid #EAEBFF"
                          }}
                        >
                          <div className="flex-1" style={{ fontSize: "14px", color: "#1A1A1A" }}>
                            <span style={{ fontWeight: 500 }}>{food.name}</span> {food.amount} - {food.calories}kcal
                          </div>
                          <button
                            onClick={() => handleRemoveFood(editingMeal, index)}
                            className="p-1 transition-colors"
                            style={{
                              color: "#FF4444",
                              backgroundColor: "transparent",
                              border: "none",
                              cursor: "pointer",
                              borderRadius: "8px"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#FFE5E5"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setAddingDiet(false);
                      setEditingMeal(null);
                      setSelectedFood("");
                      setFoodAmount("");
                      setUploadedImage(null);
                      setIsMealReplacementInput(false);
                    }}
                    className="flex-1 font-medium transition-all"
                    style={{
                      padding: "12px",
                      backgroundColor: "#EAEBFF",
                      color: "#1A1A1A",
                      borderRadius: "16px",
                      border: "none",
                      cursor: "pointer"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#D6D9FF"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#EAEBFF"}
                  >
                    {editingMeal ? "完成" : "取消"}
                  </button>
                  <button
                    onClick={handleAddFood}
                    disabled={!selectedFood || !foodAmount}
                    className="flex-1 font-medium transition-all"
                    style={{
                      padding: "12px",
                      background: !selectedFood || !foodAmount ? "#8A8A93" : "linear-gradient(135deg, #2B5BFF 0%, #6B8FFF 100%)",
                      color: "#FFFFFF",
                      borderRadius: "16px",
                      border: "none",
                      cursor: !selectedFood || !foodAmount ? "not-allowed" : "pointer",
                      opacity: !selectedFood || !foodAmount ? 0.5 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (selectedFood && foodAmount) {
                        e.currentTarget.style.transform = "translateY(-1px)";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(43, 91, 255, 0.3)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedFood && foodAmount) {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }
                    }}
                  >
                    {editingMeal ? "添加更多" : "添加"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 运动添加弹窗 */}
      <AnimatePresence>
        {editingExercise && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setEditingExercise(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">运动打卡</h3>
                <button
                  onClick={() => setEditingExercise(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* 运动类型 */}
                <div>
                  <label className="block text-sm font-medium mb-2">运动类型</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={selectedExerciseType || exerciseSearchText}
                      onChange={(e) => {
                        const text = e.target.value;
                        setExerciseSearchText(text);
                        setIsExerciseDropdownOpen(true);
                        
                        // 智能匹配：如果完全匹配某个运动类型，自动选择
                        const exactMatch = EXERCISE_TYPES.find(
                          exercise => exercise.name.toLowerCase() === text.toLowerCase()
                        );
                        if (exactMatch) {
                          setSelectedExerciseType(exactMatch.name);
                          setExerciseSearchText("");
                          setIsExerciseDropdownOpen(false);
                        } else {
                          setSelectedExerciseType("");
                        }
                      }}
                      onKeyDown={(e) => {
                        // 按回车键自动选择第一个匹配项
                        if (e.key === 'Enter' && exerciseSearchText) {
                          const firstMatch = EXERCISE_TYPES.find(exercise =>
                            exercise.name.toLowerCase().includes(exerciseSearchText.toLowerCase())
                          );
                          if (firstMatch) {
                            setSelectedExerciseType(firstMatch.name);
                            setExerciseSearchText("");
                            setIsExerciseDropdownOpen(false);
                          }
                        }
                      }}
                      onFocus={() => setIsExerciseDropdownOpen(true)}
                      onBlur={() => setTimeout(() => setIsExerciseDropdownOpen(false), 200)}
                      placeholder="搜索运动类型（可按回车选择）"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    {isExerciseDropdownOpen && exerciseSearchText && (
                      <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
                        {EXERCISE_TYPES
                          .filter(exercise =>
                            exercise.name.toLowerCase().includes(exerciseSearchText.toLowerCase())
                          )
                          .map((exercise) => (
                            <button
                              key={exercise.name}
                              onClick={() => {
                                setSelectedExerciseType(exercise.name);
                                setExerciseSearchText("");
                                setIsExerciseDropdownOpen(false);
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-green-50 transition-colors text-sm border-b border-gray-100 last:border-b-0"
                            >
                              <div className="font-medium text-gray-900">{exercise.name}</div>
                              <div className="text-xs text-gray-500">{exercise.caloriesPerMin}kcal/分钟</div>
                            </button>
                          ))}
                        {EXERCISE_TYPES.filter(exercise =>
                          exercise.name.toLowerCase().includes(exerciseSearchText.toLowerCase())
                        ).length === 0 && (
                          <div className="px-4 py-3 text-center text-sm text-gray-500">
                            未找到匹配的运动类型
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {selectedExerciseType && (
                    <div className="mt-2 flex items-center gap-2 text-sm">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                        已选择：{selectedExerciseType}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedExerciseType("");
                          setExerciseSearchText("");
                        }}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* 运动时长 */}
                <div>
                  <label className="block text-sm font-medium mb-2">运动时长（分钟）</label>
                  <input
                    type="number"
                    value={exerciseDuration}
                    onChange={(e) => setExerciseDuration(e.target.value)}
                    placeholder="请输入时长"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    step="1"
                    min="1"
                  />
                </div>

                {/* 运动强度 */}
                <div>
                  <label className="block text-sm font-medium mb-2">运动强度</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["低", "中等", "高"].map((intensity) => (
                      <button
                        key={intensity}
                        onClick={() => setExerciseIntensity(intensity)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                          exerciseIntensity === intensity
                            ? "bg-green-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {intensity}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 预计消耗 */}
                {selectedExerciseType && exerciseDuration && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-sm text-gray-600 mb-1">预计消耗</div>
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round(
                        (EXERCISE_TYPES.find(e => e.name === selectedExerciseType)?.caloriesPerMin || 0) *
                        parseInt(exerciseDuration) *
                        (exerciseIntensity === "低" ? 0.7 : exerciseIntensity === "高" ? 1.3 : 1)
                      )} kcal
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setEditingExercise(false)}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleAddExercise}
                    disabled={!selectedExerciseType || !exerciseDuration}
                    className="flex-1 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    保存
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 血压编辑弹窗 */}
      <AnimatePresence>
        {editingBloodPressure && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setEditingBloodPressure(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">血压打卡</h3>
                <button
                  onClick={() => setEditingBloodPressure(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">收缩压（mmHg）</label>
                  <input
                    type="number"
                    value={tempSystolic}
                    onChange={(e) => setTempSystolic(e.target.value)}
                    placeholder="请输入收缩压"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    step="1"
                    min="60"
                    max="200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">舒张压（mmHg）</label>
                  <input
                    type="number"
                    value={tempDiastolic}
                    onChange={(e) => setTempDiastolic(e.target.value)}
                    placeholder="请输入舒张压"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    step="1"
                    min="40"
                    max="130"
                  />
                </div>

                <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
                  <div className="font-medium mb-2">参考标准：</div>
                  <div>• 正常：收缩压 &lt; 120 且舒张压 &lt; 80</div>
                  <div>• 高血压：收缩压 ≥ 140 或舒张压 ≥ 90</div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setEditingBloodPressure(false)}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleAddBloodPressure}
                    disabled={!tempSystolic || !tempDiastolic}
                    className="flex-1 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    保存
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 血糖编辑弹窗 */}
      <AnimatePresence>
        {editingBloodSugar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setEditingBloodSugar(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">血糖打卡</h3>
                <button
                  onClick={() => setEditingBloodSugar(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">测量类型</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["空腹", "餐后"] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setTempBloodSugarType(type)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                          tempBloodSugarType === type
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {type}血糖
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">血糖值（mmol/L）</label>
                  <input
                    type="number"
                    value={tempBloodSugar}
                    onChange={(e) => setTempBloodSugar(e.target.value)}
                    placeholder="请输入血糖值"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    step="0.1"
                    min="2"
                    max="30"
                  />
                </div>

                <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
                  <div className="font-medium mb-2">参考标准：</div>
                  <div>• 空腹血糖正常：3.9-6.1 mmol/L</div>
                  <div>• 餐后2小时血糖正常：&lt; 7.8 mmol/L</div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setEditingBloodSugar(false)}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    取���
                  </button>
                  <button
                    onClick={handleAddBloodSugar}
                    disabled={!tempBloodSugar}
                    className="flex-1 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    保存
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 腰围编辑弹窗 */}
      <AnimatePresence>
        {editingWaist && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setEditingWaist(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">腰围打卡</h3>
                <button
                  onClick={() => setEditingWaist(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">腰围（cm）</label>
                  <input
                    type="number"
                    value={tempWaist}
                    onChange={(e) => setTempWaist(e.target.value)}
                    placeholder="请输入腰围"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    step="0.1"
                    min="50"
                    max="150"
                  />
                </div>

                <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
                  <div className="font-medium mb-2">参考标准：</div>
                  <div>• 男性：腰围 &lt; 90 cm 为正常</div>
                  <div>• 女性：腰围 &lt; 85 cm 为正常</div>
                  <div className="mt-2 text-xs">※ 腰围过大提示中心性肥胖风险</div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setEditingWaist(false)}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSaveWaist}
                    disabled={!tempWaist}
                    className="flex-1 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    保存
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 日历弹窗 */}
      <CalendarModal 
        isOpen={showCalendar}
        onClose={() => setShowCalendar(false)}
        checkinData={checkinHistory}
        type="checkin"
      />
    </div>
  );
}