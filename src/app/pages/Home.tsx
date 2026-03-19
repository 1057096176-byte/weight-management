import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Menu, Users, TrendingUp, TrendingDown, ArrowRight, X } from "lucide-react";
import { Sidebar } from "../components/Sidebar";
import { ChatMessage } from "../components/ChatMessage";
import { ChatInput } from "../components/ChatInput";
import { motion, AnimatePresence } from "motion/react";
import { QuickActions } from "../components/QuickActions";
import { HealthDataCardNew } from "../components/HealthDataCardNew";
import { DoctorDrawer } from "../components/DoctorDrawer";
import { DeviceDataCard } from "../components/DeviceDataCard";
import { MealReminderCard } from "../components/MealReminderCard";
import { MealProductCard } from "../components/MealProductCard";
import { MealProductDetailModal } from "../components/MealProductDetailModal";
import { PaymentModal } from "../components/PaymentModal";
import { DeviceBindingModal } from "../components/DeviceBindingModal";
import { DeviceInfoModal } from "../components/DeviceInfoModal";
import { MealServiceDrawer } from "../components/MealServiceDrawer";
import { MealProductList } from "../components/MealProductList";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [doctorDrawerOpen, setDoctorDrawerOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // 用户状态：'new' | 'existing'
  const [userStatus, setUserStatus] = useState<"new" | "existing">("new");
  const isNewUser = userStatus === "new";
  
  // 设备绑定状态
  const [hasDeviceBound, setHasDeviceBound] = useState(false);
  
  // 是否显示代餐提醒（仅老用户）
  const [showMealReminder, setShowMealReminder] = useState(false);
  
  // 病案号状态
  const [medicalRecordNumber, setMedicalRecordNumber] = useState("");
  const [showMedicalRecordModal, setShowMedicalRecordModal] = useState(false);
  const [tempMedicalRecord, setTempMedicalRecord] = useState("");
  const [showQRScanner, setShowQRScanner] = useState(false);
  
  // 设备相关弹窗状态
  const [showDeviceBindingModal, setShowDeviceBindingModal] = useState(false);
  const [showDeviceInfoModal, setShowDeviceInfoModal] = useState(false);
  
  // 蓝牙绑定流程状态
  type BluetoothBindingStage = "idle" | "searching" | "connecting" | "success";
  const [bluetoothBindingStage, setBluetoothBindingStage] = useState<BluetoothBindingStage>("idle");
  
  // 代餐商品相关状态
  const [showMealServiceDrawer, setShowMealServiceDrawer] = useState(false);
  const [showMealProductDetail, setShowMealProductDetail] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedMealPrice, setSelectedMealPrice] = useState(899);
  
  // 用户信息收集状态
  type UserInfoStage = "idle" | "phone" | "name" | "height" | "weight" | "complete";
  const [userInfoStage, setUserInfoStage] = useState<UserInfoStage>(isNewUser ? "phone" : "idle");
  
  // 导诊状态
  type TriageStage = "idle" | "basic" | "symptoms" | "risk" | "complete";
  const [triageStage, setTriageStage] = useState<TriageStage>("idle");
  const [triageQuestionIndex, setTriageQuestionIndex] = useState(0);
  
  // 导诊问题库
  const triageQuestions = {
    basic: [
      {
        question: "首先，请问您的年龄是多少？",
        options: ["18-25岁", "26-35岁", "36-45岁", "46-60岁", "60岁以上"],
      },
      {
        question: "请问您的性别是？",
        options: ["男", "女"],
      },
      {
        question: "您的体重管理目标是什么？",
        options: ["减重", "增重", "塑形", "健康管理"],
      },
    ],
    symptoms: [
      {
        question: "您是否有以下症状？\n\n• 经常感到疲劳乏力\n• 睡眠质量差或失眠\n• 食欲异常（暴饮暴食或食欲不振）\n• 情绪波动大",
        options: ["有", "没有", "部分有"],
      },
      {
        question: "您的饮食习惯如何？",
        options: ["规律三餐", "经常不吃早餐", "喜欢夜宵", "饮食不规律"],
      },
      {
        question: "您平时的运动习惯是？",
        options: ["每周3次以上", "偶尔运动", "很少运动", "完全不运动"],
      },
    ],
    risk: [
      {
        question: "您是否有以下慢性病史？\n\n• 高血压\n• 糖尿病\n• 高血脂\n• 心脏疾病",
        options: ["有", "没有"],
      },
      {
        question: "您的家族是否有肥胖或代谢疾病史？",
        options: ["有", "没有", "不清楚"],
      },
      {
        question: "最后一个问题：您之前是否尝试过减重？结果如何？",
        options: ["从未尝试", "尝试过但反弹", "尝试过有效果", "多次尝试失败"],
      },
    ],
  };
  
  // 切换用户状态按钮处理函数
  const toggleUserStatus = () => {
    setUserStatus(prev => prev === "new" ? "existing" : "new");
  };
  
  // 检查是否有未完成的导诊
  const checkTriageHistory = () => {
    const saved = localStorage.getItem("triageHistory");
    if (saved) {
      const data = JSON.parse(saved);
      return data.stage !== "complete" && data.messages.length > 2;
    }
    return false;
  };

  const [hasUnfinishedTriage, setHasUnfinishedTriage] = useState(checkTriageHistory());
  
  // 健康数据编辑弹窗状态
  const [showHealthDataModal, setShowHealthDataModal] = useState(false);
  const [tempHealthData, setTempHealthData] = useState({
    age: "",
    height: "",
    currentWeight: "",
    targetWeight: "",
  });
  
  // 消息列表状态
  const [messages, setMessages] = useState<any[]>([]);
  
  // 计划是否已开启状态
  const [isPlanActivated, setIsPlanActivated] = useState(false);
  
  // 用户健康数据（使用状态管理以支持编辑）
  const [healthData, setHealthData] = useState({
    age: isNewUser ? 0 : 30,
    height: isNewUser ? 0 : 163, // cm
    currentWeight: isNewUser ? 0 : 49, // kg
    yesterdayWeight: isNewUser ? 0 : 49.2, // 昨天的体重
    targetWeight: isNewUser ? 0 : 48, // kg
    bmi: isNewUser ? 0 : 23, // BMI = weight / (height/100)^2
  });
  
  const planInfo = {
    name: "轻盈计划",
    daysRunning: 2,
    estimatedCompletion: "10天",
    todayProgress: 63,
  };

  // 计算体重变化
  const weightChange = healthData.currentWeight - healthData.yesterdayWeight;
  const weightChangeText = weightChange > 0 ? `+${weightChange.toFixed(1)}kg` : `${weightChange.toFixed(1)}kg`;
  const weightChangeColor = weightChange > 0 ? "text-red-500" : weightChange < 0 ? "text-green-500" : "text-gray-500";
  const WeightChangeIcon = weightChange > 0 ? TrendingUp : TrendingDown;

  // BMI状态判断
  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { label: "偏瘦", color: "text-yellow-600", bg: "bg-yellow-50", barColor: "bg-yellow-500" };
    if (bmi < 24) return { label: "正常", color: "text-green-600", bg: "bg-green-50", barColor: "bg-green-500" };
    if (bmi < 28) return { label: "偏胖", color: "text-orange-600", bg: "bg-orange-50", barColor: "bg-orange-500" };
    return { label: "肥胖", color: "text-red-600", bg: "bg-red-50", barColor: "bg-red-500" };
  };

  const bmiStatus = getBMIStatus(healthData.bmi);

  // 所有常见问题库
  const allQuestions = [
    ["如何科学减重？", "今天吃什么比较健康？", "适合我的运动方案"],
    ["减重平台期怎么办？", "如何提高代谢率？", "晚餐吃什么不发胖？"],
    ["运动后肌肉酸痛正常吗？", "如何保持动力？", "怎样制定饮食计划？"],
  ];

  const [questionSet, setQuestionSet] = useState(0);
  const commonQuestions = allQuestions[questionSet];

  const handleRefreshQuestions = () => {
    setQuestionSet((prev) => (prev + 1) % allQuestions.length);
    
    // 更新消息列表中的常见问题卡片
    setMessages((prevMessages) => 
      prevMessages.map((msg) => 
        msg.id === "questions-card" 
          ? { ...msg, questions: allQuestions[(questionSet + 1) % allQuestions.length] }
          : msg
      )
    );
  };

  const handleSendMessage = (message: string, image?: File) => {
    // 如果有图片，先处理图片
    if (image) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now().toString(),
          message: `📷 [图片] ${message || "发送了一张图片"}`,
          isUser: true,
          time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);

      // AI回复
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            message: "我已收到您的图片。如果这是饮食或运动相关的照片，建议您前往打卡中心进行详细记录，系统会为您提供更准确的分析。",
            isUser: false,
            time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }, 1000);
      return;
    }

    if (!message.trim()) return;

    // 新用户信息收集流程
    if (isNewUser && userInfoStage !== "idle" && userInfoStage !== "complete") {
      // 添加用户消息
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now().toString(),
          message,
          isUser: true,
          time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);

      // 解析用户输入的信息
      setTimeout(() => {
        // 使用正则表达式提取信息
        const phoneMatch = message.match(/手机号[：:]\s*(\d+)/);
        const nameMatch = message.match(/姓名[：:]\s*([^\n\r]+)/);
        const heightMatch = message.match(/身高[：:]\s*(\d+)/);
        const weightMatch = message.match(/体重[：:]\s*(\d+\.?\d*)/);

        // 验证是否所有信息都已提供
        if (!phoneMatch || !nameMatch || !heightMatch || !weightMatch) {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              message: "❌ 信息不完整，请按照格式提供所有信息：\n\n手机号：\n姓名：\n身高：（cm）\n体重：（kg）\n\n示例：\n手机号：13800138000\n姓名：张三\n身高：170\n体重：65",
              isUser: false,
              time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
            },
          ]);
          return;
        }

        const phone = phoneMatch[1];
        const name = nameMatch[1].trim();
        const height = parseInt(heightMatch[1]);
        const weight = parseFloat(weightMatch[1]);

        // 验证手机号格式
        const phoneRegex = /^1[3-9]\d{9}$/;
        if (!phoneRegex.test(phone)) {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              message: "❌ 手机号格式不正确，请输入11位有效手机号。",
              isUser: false,
              time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
            },
          ]);
          return;
        }

        // 验证身高范围
        if (isNaN(height) || height < 100 || height > 250) {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              message: "❌ 身高数据不合理，请输入100-250cm之间的数值。",
              isUser: false,
              time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
            },
          ]);
          return;
        }

        // 验证体重范围
        if (isNaN(weight) || weight < 30 || weight > 300) {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              message: "❌ 体重数据不合理，请输入30-300kg之间的数值。",
              isUser: false,
              time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
            },
          ]);
          return;
        }

        // 所有验证通过，保存数据
        const bmi = weight / Math.pow(height / 100, 2);
        setHealthData((prev) => ({
          ...prev,
          height,
          currentWeight: weight,
          yesterdayWeight: weight,
          targetWeight: weight > 60 ? weight - 5 : weight,
          bmi: parseFloat(bmi.toFixed(2)),
        }));

        // 完成信息收集
        setUserInfoStage("complete");

        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              message: `✅ 太好了，${name}！您的基本信息已成功录入。\n\n📊 您的健康数据：\n• 身高：${height}cm\n• 体重：${weight}kg\n• BMI：${bmi.toFixed(1)}\n\n💡 如果您有邵逸夫医院的病案号，可以点击「我的健康数据」卡片中的「绑定病案号」进行绑定。`,
              isUser: false,
              time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
            },
          ]);

          // 推送导诊卡片
          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              {
                id: `triage-card-${Date.now()}`,
                message: "",
                isUser: false,
                time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
                isTriageCard: true,
              },
            ]);
          }, 1000);
        }, 1000);
      }, 1000);
      return;
    }

    console.log("Adding user message:", message);
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: Date.now().toString(),
        message,
        isUser: true,
        time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);

    // 根据内容智能回复
    setTimeout(() => {
      console.log("AI replying to:", message);
      let replyMessage = "我已收到您的消息，让我为您分析一下...";
      let showCheckinCard = false;
      let showQuickAccessCard = false;
      let showDoctorListCard = false;
      let quickAccessType: 'all' | 'checkin' | 'triage' | 'doctor' | null = null;
      
      // 检测"打卡""导诊""医生分身"关键词，显示快捷入口
      if (message.includes("打卡") && message.includes("导诊") || 
          message.includes("打卡") && message.includes("医生") ||
          message.includes("导诊") && message.includes("医生")) {
        replyMessage = "体重管理助手为您提供三大核心功能：\n\n📅 **打卡中心**：记录每日体重、饮食、运动数据\n🩺 **智能导诊**：全面评估健康状，匹配专业方案\n👨‍⚕️ **医生分身**：24小时在线问诊，获取专业指导\n\n请选择您需要的功能：";
        showQuickAccessCard = true;
        quickAccessType = 'all';
      } else if (message.includes("打卡")) {
        replyMessage = "✅ 打卡功能可以帮您：\n\n📊 记录每日体重变化\n🍽️ 追踪饮食摄入\n💪 统计运动消耗\n📈 生成数据分析报告\n\n坚持打卡是成功减重的关键！";
        showQuickAccessCard = true;
        quickAccessType = 'checkin';
      } else if (message.includes("导诊")) {
        replyMessage = "智能导诊可以帮您：\n\n 全面评估健康状况\n✅ 识别潜在风险因素\n✅ 匹配专业医生分身\n✅ 制定个性化方案\n\n整个过程大约需要5-10分钟。";
        showQuickAccessCard = true;
        quickAccessType = 'triage';
      } else if (message.includes("医生") || message.includes("分身") || message.includes("问诊") || message.includes("咨询医生")) {
        replyMessage = "医生分身可以为您提供：\n\n👨‍⚕️ 24小时在线问诊\n💊 专业健康指导\n📋 个性化方案制定\n🏥 线上线下就诊建议\n\n我们有多位专业医生分身，涵盖内分泌、营养、运动、心理等领域。";
        showQuickAccessCard = true;
        quickAccessType = 'doctor';
      }
      // 检测是否为打卡相关内容
      else if (message.includes("早餐") || message.includes("午餐") || message.includes("晚餐") || 
          message.includes("吃了") || message.includes("食物") || message.match(/\d+.*卡/)) {
        replyMessage = `✅ 已记录您的饮食信息！\n\n根据您的描述：\n"${message}"\n\n建议：\n• 记得搭配足够的蔬菜和蛋白质\n• 控制油脂摄入\n• 保持饮水充足\n\n💡 建议您前往打卡中心完善详细信息，系统会为您进行营养分析和热量计算。`;
        showCheckinCard = true;
      } else if (message.includes("运动") || message.includes("跑步") || message.includes("健身") || 
                 message.includes("锻炼") || message.includes("游泳") || message.includes("瑜伽")) {
        replyMessage = `💪 太棒了！坚持运动是健康生活的关键！\n\n根据您的描述：\n"${message}"\n\n运动建议：\n• 运动前做好热身\n• 运动后及时补充水分\n• 注意循序渐进，避过度疲劳\n\n💡 建议您前往打卡中心记录运动详情，系统会为您计算消耗的卡路里。`;
        showCheckinCard = true;
      }
      // 关键词匹配回复
      else if (message.includes("减重") || message.includes("减肥")) {
        replyMessage = "科学减重需要合理控制饮食和适量运动的结合。\n\n建议您：\n1️⃣ 每天控制热量摄入在1500-1800千卡\n2️⃣ 每周进行150分钟中等强度有氧运动\n3⃣ 保证充足睡眠和规律作息\n\n需要我为您制定详细的减重方案吗？";
      } else if (message.includes("饮食") || message.includes("吃什么") || message.includes("食谱")) {
        replyMessage = "康饮食建议：\n\n🥗 多吃：\n• 新鲜蔬菜水果\n• 全谷物（糙米、燕麦）\n• 优质蛋白（肉、鸡胸肉）\n\n🚫 少吃：\n• 高糖食物和饮料\n• 油食品\n• 加工肉制品\n\n需要查看详细的每日饮食方案吗？";
      }
      
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          message: replyMessage,
          isUser: false,
          time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);

      // 显示打卡中心卡片
      if (showCheckinCard) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 2).toString(),
              message: "",
              isUser: false,
              time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
              isCheckinCard: true,
            },
          ]);
        }, 500);
      }

      // 显示快捷入口卡片
      if (showQuickAccessCard) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 2).toString(),
              message: "",
              isUser: false,
              time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
              isQuickAccessCard: true,
              quickAccessType,
            },
          ]);
        }, 500);
      }

      // 显示医生列表卡片
      if (showDoctorListCard) {
        const doctors = [
          {
            id: "1",
            name: "李明医生",
            title: "主任医师",
            specialty: "内分泌科专家",
            expertise: "肥胖症、代谢综合征、糖尿病、甲状腺疾病",
            avatar: "👨‍⚕️",
            gradient: "from-blue-500 to-purple-500",
          },
          {
            id: "2",
            name: "王芳医生",
            title: "副主医师",
            specialty: "营养科专家",
            expertise: "营养评估、饮食调理、体重管理、慢性病营养干预",
            avatar: "👩‍⚕️",
            gradient: "from-green-500 to-teal-500",
          },
          {
            id: "3",
            name: "张伟医生",
            title: "主治医师",
            specialty: "运动医学专家",
            expertise: "运动处方、运动损伤、康复训练、体能评估",
            avatar: "👨‍⚕️",
            gradient: "from-orange-500 to-red-500",
          },
        ];

        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 2).toString(),
              message: "",
              isUser: false,
              time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
              isDoctorListCard: true,
              doctors,
            },
          ]);
        }, 500);
      }
    }, 1000);
  };

  const handleQuickQuestion = (question: string) => {
    console.log("handleQuickQuestion called with:", question);
    // 添加用户消息
    console.log("Adding user message:", question);
    setMessages(prev => [...prev, { id: Date.now().toString(), message: question, isUser: true, timestamp: new Date() }]);
    
    // 模拟 AI 回复
    setTimeout(() => {
      console.log("AI replying to:", question);
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        message: getAIResponse(question), 
        isUser: false, 
        timestamp: new Date() 
      }]);
    }, 1000);
  };

  // 处理智能导诊
  const handleTriageStart = () => {
    console.log("handleTriageStart called");
    
    // 设置导诊状态为basic，开始第一阶段
    setTriageStage("basic");
    setTriageQuestionIndex(0);
    
    // 页面上滑效果
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    
    // 添加用户消息
    setMessages(prev => [...prev, { 
      id: Date.now().toString(), 
      message: "我想开始智能导诊", 
      isUser: true, 
      time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
    }]);
    
    // AI 欢迎并开始第一个问题
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        message: "好的！我来帮您进行智能导诊评估。\n\n接下来我会通过几个问题了解您的情况，为您推荐最合适的科室和医生。整个过程大约需要3-5分钟。\n\n让我们开始吧！", 
        isUser: false, 
        time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
      }]);
      
      // 第一个问题
      setTimeout(() => {
        const firstQuestion = triageQuestions.basic[0];
        setMessages(prev => [...prev, { 
          id: (Date.now() + 2).toString(), 
          message: firstQuestion.question, 
          isUser: false, 
          time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
          options: firstQuestion.options
        }]);
      }, 1000);
    }, 1000);
  };

  // 处理导诊问题回答
  const handleTriageAnswer = (answer: string) => {
    console.log("Triage answer:", answer, "Stage:", triageStage, "Index:", triageQuestionIndex);
    
    // 特殊处理：如果导诊已完成，这是最后的选择（线上干预 vs 线下就诊）
    if (triageStage === "complete") {
      // 添加用户的选择
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        message: answer, 
        isUser: true, 
        time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
      }]);
      
      // 根据用户选择显示不内容
      if (answer.includes("不需要") || answer.includes("线上干预")) {
        // 路径A：生成线上干预方案
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            id: Date.now().toString(), 
            message: "太好了！我将为���制定个性化的线上体重管理方案。", 
            isUser: false, 
            time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
          }]);
          
          // 显示方案卡片（未开启状态）
          setTimeout(() => {
            setMessages(prev => [...prev, {
              id: (Date.now() + 1).toString(),
              message: "",
              isUser: false,
              time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
              isPlanCard: true,
              isActivated: false, // 未开启状态
            }]);
            
            // 推荐代餐商品
          }, 1500);
        }, 1000);
      } else {
        // 路径B：推荐线下就诊
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            id: Date.now().toString(), 
            message: "我理解您希望进行线下就诊。这是一个很明智的决定，线下就诊可以进行更全面的医学检查。\n\n我为您整理了详细的就诊指引，请看下方的建议。", 
            isUser: false, 
            time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
          }]);
          
          // 显示线下就诊卡片
          setTimeout(() => {
            setMessages(prev => [...prev, {
              id: (Date.now() + 1).toString(),
              message: "",
              isUser: false,
              time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
              isOfflineCard: true,
            }]);
          }, 1500);
        }, 1000);
      }
      return;
    }
    
    // 添加用户的回答
    setMessages(prev => [...prev, { 
      id: Date.now().toString(), 
      message: answer, 
      isUser: true, 
      time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
    }]);
    
    // 增加问题索引
    const nextIndex = triageQuestionIndex + 1;
    setTriageQuestionIndex(nextIndex);
    
    setTimeout(() => {
      askNextTriageQuestion(triageStage, nextIndex);
    }, 1000);
  };

  // 询问下一个导诊问题
  const askNextTriageQuestion = (stage: TriageStage, questionIndex: number) => {
    if (stage === "idle" || stage === "complete") return;
    
    const currentQuestions = triageQuestions[stage];
    
    if (questionIndex >= currentQuestions.length) {
      // 当前阶段结束，进入下一阶段
      if (stage === "basic") {
        setTriageStage("symptoms");
        setTriageQuestionIndex(0);
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            id: Date.now().toString(), 
            message: "很好！基信息已收集完成。\n\n接下来进入症状评估阶段，了解您的身体状况和生活习惯。", 
            isUser: false, 
            time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
          }]);
          
          setTimeout(() => {
            const firstQuestion = triageQuestions.symptoms[0];
            setMessages(prev => [...prev, { 
              id: (Date.now() + 1).toString(), 
              message: firstQuestion.question, 
              isUser: false, 
              time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
              options: firstQuestion.options
            }]);
          }, 1000);
        }, 500);
      } else if (stage === "symptoms") {
        setTriageStage("risk");
        setTriageQuestionIndex(0);
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            id: Date.now().toString(), 
            message: "症状评估完成！\n\n现在进入最后一个阶段：风险评估。这将帮助我们更好地为您制定安全有效的方案。", 
            isUser: false, 
            time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
          }]);
          
          setTimeout(() => {
            const firstQuestion = triageQuestions.risk[0];
            setMessages(prev => [...prev, { 
              id: (Date.now() + 1).toString(), 
              message: firstQuestion.question, 
              isUser: false, 
              time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
              options: firstQuestion.options
            }]);
          }, 1000);
        }, 500);
      } else if (stage === "risk") {
        // 完成所有评估
        setTriageStage("complete");
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            id: Date.now().toString(), 
            message: "🎉 太棒了！所有信息已收集完成。\n\n正在为您分析...", 
            isUser: false, 
            time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
          }]);
          
          // 显示评估结果和询问
          setTimeout(() => {
            setMessages(prev => [...prev, { 
              id: (Date.now() + 1).toString(), 
              message: "根据您的情况评估，您的健康状况适合进行线上体重管理预。\n\n我可以为您制定个性化的体重管理方案，包括饮食、运动和生活方式调整。\n\n您是否需要线下就诊进行更全面的医学检查？", 
              isUser: false, 
              time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
              options: ["不需要，开始线上干预", "需要，我想线下就诊"]
            }]);
          }, 2000);
        }, 500);
      }
      return;
    }
    
    // 询问当前阶段的下一个问题
    const nextQuestion = currentQuestions[questionIndex];
    setMessages(prev => [...prev, { 
      id: Date.now().toString(), 
      message: nextQuestion.question, 
      isUser: false, 
      time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
      options: nextQuestion.options
    }]);
  };

  // 获取 AI 回复
  const getAIResponse = (question: string) => {
    switch (question) {
      case "如何科学减重？":
        return "科学减重需要合理控制饮食和适量运动的结合。\n\n建议您：\n1️⃣ 每天控制热量摄入在1500-1800千卡\n2️⃣ 每周进行150分钟中等强度有氧运动\n3⃣ 保证充足睡眠和规律作息\n\n需要我为您制定详细的减重方案吗？";
      case "今天吃什么比较健康？":
        return "康饮食建：\n\n🥗 多吃：\n• 新鲜蔬菜水果\n• 全谷物（糙米、燕麦）\n• 优质蛋白（肉、鸡胸肉）\n\n🚫 少吃：\n• 高糖食物和饮料\n• 油食品\n• 加工肉制品\n\n需要查看详细的每日饮食方案吗？";
      case "适合我的运动方案":
        return "运动建议：\n\n• 运动前做好热身\n• 运动后及时补充水分\n• 注意循序渐进，避免过度疲劳\n\n💡 建议您前往打卡中心记录运动详情，系统会为您计消耗的卡路里。";
      default:
        return "我已收到您的消息，让我为您分析一下...";
    }
  };

  // 处理用户信息表单提交
  const handleUserInfoSubmit = (data: { phone: string; name: string; age: number; height: number; weight: number; medicalRecord?: string }) => {
    // 计算BMI
    const bmi = data.weight / Math.pow(data.height / 100, 2);
    
    // 更新健康数据
    setHealthData((prev) => ({
      ...prev,
      age: data.age,
      height: data.height,
      currentWeight: data.weight,
      yesterdayWeight: data.weight,
      targetWeight: data.weight > 60 ? data.weight - 5 : data.weight,
      bmi: parseFloat(bmi.toFixed(2)),
    }));

    // 如果填写了病案号，同时保存
    if (data.medicalRecord) {
      setMedicalRecordNumber(data.medicalRecord);
    }

    // 完成信息收集
    setUserInfoStage("complete");

    // 添加确认消息
    setTimeout(() => {
      const medicalRecordInfo = data.medicalRecord 
        ? `\n• 病案号：${data.medicalRecord}` 
        : '';
      
      const medicalRecordTip = data.medicalRecord
        ? ''
        : '\n\n💡 如果您有邵逸夫医院的病案号，可以点击「我的健康数据」卡片中的「绑定病案号」进行绑定。';
      
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          message: `✅ 太好了，${data.name}！您的基本信息已成功录入。\n\n📊 您的健康数据：\n• 年龄：${data.age}岁\n• 身高：${data.height}cm\n• 体重：${data.weight}kg\n• BMI${bmi.toFixed(1)}${medicalRecordInfo}${medicalRecordTip}`,
          isUser: false,
          time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);

      // 如果新用户未绑定设备，显示设备绑定提示弹窗
      if (!hasDeviceBound) {
        setTimeout(() => {
          setShowDeviceBindingModal(true);
        }, 1500);
      }
    }, 500);
  };

  // 打开编辑健康数据弹窗
  const handleOpenHealthDataModal = () => {
    setTempHealthData({
      age: healthData.age.toString(),
      height: healthData.height.toString(),
      currentWeight: healthData.currentWeight.toString(),
      targetWeight: healthData.targetWeight.toString(),
    });
    setShowHealthDataModal(true);
  };

  // 保存健康数据
  const handleSaveHealthData = () => {
    const age = parseInt(tempHealthData.age);
    const height = parseInt(tempHealthData.height);
    const currentWeight = parseFloat(tempHealthData.currentWeight);
    const targetWeight = parseFloat(tempHealthData.targetWeight);

    if (isNaN(age) || isNaN(height) || isNaN(currentWeight) || isNaN(targetWeight)) {
      alert("请输入有效的数据");
      return;
    }

    const bmi = currentWeight / Math.pow(height / 100, 2);

    setHealthData({
      ...healthData,
      age,
      height,
      currentWeight,
      targetWeight,
      bmi: parseFloat(bmi.toFixed(2)),
    });

    setShowHealthDataModal(false);
  };

  // 打开病案号绑定弹窗
  const handleOpenMedicalRecordModal = () => {
    setTempMedicalRecord(medicalRecordNumber);
    setShowQRScanner(false);
    setShowMedicalRecordModal(true);
  };

  // 推送导诊卡片
  const pushTriageCard = () => {
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `triage-card-${Date.now()}`,
          message: "",
          isUser: false,
          time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
          isTriageCard: true,
        },
      ]);
    }, 800);
  };

  // 处理代餐购买支付成功
  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setShowMealProductDetail(false);
    
    // 跳转到我的订单页面
    navigate('/orders');
  };

  // 保存病案号
  const handleSaveMedicalRecord = () => {
    if (!tempMedicalRecord.trim()) {
      alert("请输入病案号");
      return;
    }
    
    // 简单验证病案号格式（这里假设是8位数字）
    if (!/^\d{8,12}$/.test(tempMedicalRecord)) {
      alert("病案号格式不正确，请输入8-12位数字");
      return;
    }

    setMedicalRecordNumber(tempMedicalRecord);
    setShowMedicalRecordModal(false);
    
    // 显示成功提示消息
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          message: `✅ 病案号绑定成功！\n\n您的病案号：${tempMedicalRecord}`,
          isUser: false,
          time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 300);
  };

  // 模拟扫码绑定
  const handleQRCodeScan = () => {
    // 模拟扫码成功，生成一个随机病案号
    const mockMedicalRecord = Math.floor(10000000 + Math.random() * 90000000).toString();
    setTempMedicalRecord(mockMedicalRecord);
    setShowQRScanner(false);
    
    // 自动保存
    setTimeout(() => {
      setMedicalRecordNumber(mockMedicalRecord);
      setShowMedicalRecordModal(false);
      
      // 显示成功提示
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            message: `✅ 扫码成功！病案号已自动绑定。\n\n您的病案号：${mockMedicalRecord}\n\n现在您可以查看更完整的医疗记录和历史数据。`,
            isUser: false,
            time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }, 300);
    }, 1500);
  };

  useEffect(() => {
    console.log("Messages updated, count:", messages.length, messages);
    if (messagesEndRef.current) {
      // 使用 setTimeout 确保 DOM 已更新
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 100);
    }
  }, [messages]);

  // 当用户状态改变时，重置消息列表
  useEffect(() => {
    console.log("User status changed to:", userStatus);
    if (isNewUser) {
      // 新用户：更新健康数据为空
      setHealthData({
        age: 0,
        height: 0,
        currentWeight: 0,
        yesterdayWeight: 0,
        targetWeight: 0,
        bmi: 0,
      });
      
      // 设置初始消息 - 显示用户信息表单卡片
      setMessages([
        {
          id: "welcome-1",
          message: "您好！欢迎使用体重管理助手 👋",
          isUser: false,
          time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
        },
        {
          id: "user-info-form",
          message: "",
          isUser: false,
          time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
          isUserInfoFormCard: true,
        },
      ]);
      setUserInfoStage("phone");
    } else {
      // 老用户：设置正常的健康数据
      setHealthData({
        age: 30,
        height: 163,
        currentWeight: 49,
        yesterdayWeight: 49.2,
        targetWeight: 48,
        bmi: 23,
      });
      
      setMessages([
        {
          id: "questions-card",
          message: "",
          isUser: false,
          time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
          isQuestionCard: true,
          questions: allQuestions[0],
        },
      ]);
      setUserInfoStage("idle");
    }
    // 重置问题集索引
    setQuestionSet(0);
  }, [userStatus]);

  // 监听从Plan页面返回时的状态
  useEffect(() => {
    if (location.state?.planActivated) {
      // 设置计划已开启状态
      setIsPlanActivated(true);
      
      // 添加AI消息
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          message: "🎉 太棒了！您的轻盈计划已成功开启！",
          isUser: false,
          time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
        }]);
        
        // 添加计划卡片（已开启状态）
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            message: "",
            isUser: false,
            time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
            isPlanCard: true,
            isActivated: true, // 已开启状态
          }]);
        }, 500);
      }, 300);
      
      // 清除state以避免重复触发
      window.history.replaceState({}, document.title);
    }
  }, [location.state?.planActivated]);

  return (
    <div className="h-screen flex flex-col relative overflow-hidden" style={{ backgroundColor: "#FAFAFF" }}>
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

      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        onTriageStart={handleTriageStart}
      />

      {/* 顶部导航 */}
      <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between relative" style={{ zIndex: 10 }}>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="font-semibold">体重管理助手</h1>
        <div className="flex items-center gap-2">
          {/* 老用户：切换设备/代餐显示 */}
          {userStatus === "existing" && (
            <>
              <button
                onClick={() => setHasDeviceBound(!hasDeviceBound)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg transition-all"
                style={{
                  background: hasDeviceBound ? "rgba(16, 185, 129, 0.1)" : "rgba(156, 163, 175, 0.1)",
                  backdropFilter: "blur(10px)",
                  border: hasDeviceBound ? "1px solid rgba(16, 185, 129, 0.2)" : "1px solid rgba(156, 163, 175, 0.2)",
                  color: hasDeviceBound ? "#10B981" : "#6B7280",
                  fontWeight: 500
                }}
                title={hasDeviceBound ? "已绑定设备" : "未绑定设备"}
              >
                📱
              </button>
              <button
                onClick={() => setShowMealReminder(!showMealReminder)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg transition-all"
                style={{
                  background: showMealReminder ? "rgba(251, 146, 60, 0.1)" : "rgba(156, 163, 175, 0.1)",
                  backdropFilter: "blur(10px)",
                  border: showMealReminder ? "1px solid rgba(251, 146, 60, 0.2)" : "1px solid rgba(156, 163, 175, 0.2)",
                  color: showMealReminder ? "#FB923C" : "#6B7280",
                  fontWeight: 500
                }}
                title={showMealReminder ? "显示代餐提醒" : "隐藏代餐提醒"}
              >
                🥤
              </button>
            </>
          )}
          <button
            onClick={toggleUserStatus}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-all"
            style={{
              background: "rgba(43, 91, 255, 0.1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(43, 91, 255, 0.2)",
              color: "#2B5BFF",
              fontWeight: 500
            }}
            title="切换用户状态"
          >
            <Users className="w-3.5 h-3.5" />
            {userStatus === "new" ? "新用户" : "老用户"}
          </button>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 overflow-y-auto relative" ref={messagesContainerRef} style={{ zIndex: 1 }}>
        <div className="max-w-4xl mx-auto p-4 space-y-4">
          {/* 健康数据卡片 - 固定第一位所有用户都显示 */}
          <HealthDataCardNew
            healthData={healthData}
            onEdit={handleOpenHealthDataModal}
            onMedicalRecordClick={handleOpenMedicalRecordModal}
            hasMedicalRecord={!!medicalRecordNumber}
            time={new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}
            planInfo={userStatus === "existing" ? planInfo : undefined}
          />

          {/* 老用户：显示设备数据卡片（如果已绑定设备） */}
          {userStatus === "existing" && hasDeviceBound && (
            <DeviceDataCard />
          )}

          {/* 老用户：显示代餐提醒卡片 */}
          {userStatus === "existing" && showMealReminder && (
            <MealReminderCard
              onConfirm={() => {
                // 记录代餐打卡并跳转到打卡页面
                setShowMealReminder(false);
                setMessages(prev => [...prev, {
                  id: Date.now().toString(),
                  message: "✅ 已记录您的代餐打卡！\n\n早餐代餐奶昔已完成，继续保持哦~",
                  isUser: false,
                  time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
                }]);
                // 跳转到打卡页面
                navigate("/checkin");
              }}
              onViewMealDetails={() => {
                // 打开代餐服务抽屉查看详情
                setShowMealServiceDrawer(true);
              }}
            />
          )}

          {/* 未完成导诊提示 */}
          {hasUnfinishedTriage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">📋</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-amber-900 mb-1">
                    您有未完成的智能导诊
                  </h3>
                  <p className="text-sm text-amber-700 mb-3">
                    继续之前的导诊流程，完成后可获得专业的科室推荐和医生匹配
                  </p>
                  <Link
                    to="/triage"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-all shadow-md hover:shadow-lg"
                  >
                    继续导诊
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {/* 聊天消息 */}
          <div className="space-y-4">
            {messages.map((msg) => (
              <ChatMessage 
                key={msg.id} 
                {...msg}
                onQuestionClick={handleQuickQuestion}
                onRefreshQuestions={handleRefreshQuestions}
                onTriageStart={handleTriageStart}
                onTriageAnswer={handleTriageAnswer}
                onUserInfoSubmit={handleUserInfoSubmit}
                onMealProductClick={(product) => {
                  // 设置选中的代餐价格
                  setSelectedMealPrice(product.price);
                  // 直接打开支付弹窗
                  setShowPaymentModal(true);
                }}
              />
            ))}
          </div>
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 功能入口栏 */}
      <QuickActions 
        onTriageClick={handleTriageStart} 
        onDoctorClick={() => setDoctorDrawerOpen(true)}
        onDeviceClick={() => {
          // 根据设备绑定状态显示不同弹窗
          if (hasDeviceBound) {
            setShowDeviceInfoModal(true);
          } else {
            setShowDeviceBindingModal(true);
          }
        }}
        onMealServiceClick={() => {
          // 在对话中展示代餐服务列表
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            message: "我想看看代餐服务",
            isUser: true,
            time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
          }]);
          
          setTimeout(() => {
            setMessages(prev => [...prev, {
              id: (Date.now() + 1).toString(),
              message: "",
              isUser: false,
              time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
              isMealProductList: true
            }]);
          }, 800);
        }}
      />

      {/* 底部输框 */}
      <ChatInput
        onSend={handleSendMessage}
        placeholder="有什么我可以帮您的吗？"
        showImageUpload={true}
      />

      {/* 健数据编辑弹窗 */}
      <AnimatePresence>
        {showHealthDataModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowHealthDataModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">编辑健康数据</h3>
                <button
                  onClick={() => setShowHealthDataModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">年龄</label>
                  <input
                    type="number"
                    value={tempHealthData.age}
                    onChange={(e) => setTempHealthData({...tempHealthData, age: e.target.value})}
                    placeholder="请输入年龄"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">身高（cm）</label>
                  <input
                    type="number"
                    value={tempHealthData.height}
                    onChange={(e) => setTempHealthData({...tempHealthData, height: e.target.value})}
                    placeholder="请输入身高"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">当前体重（kg）</label>
                  <input
                    type="number"
                    step="0.1"
                    value={tempHealthData.currentWeight}
                    onChange={(e) => setTempHealthData({...tempHealthData, currentWeight: e.target.value})}
                    placeholder="请输入当前体重"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">目标体重（kg）</label>
                  <input
                    type="number"
                    step="0.1"
                    value={tempHealthData.targetWeight}
                    onChange={(e) => setTempHealthData({...tempHealthData, targetWeight: e.target.value})}
                    placeholder="请输入目标体重"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowHealthDataModal(false)}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSaveHealthData}
                    className="flex-1 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                  >
                    保存
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 医生列表抽屉 */}
      <DoctorDrawer
        isOpen={doctorDrawerOpen}
        onClose={() => setDoctorDrawerOpen(false)}
      />

      {/* 代餐服务列表弹窗 */}
      <MealServiceDrawer
        isOpen={showMealServiceDrawer}
        onClose={() => setShowMealServiceDrawer(false)}
        onProductClick={(product) => {
          setSelectedMealPrice(product.price);
          setShowMealServiceDrawer(false);
          setShowMealProductDetail(true);
        }}
      />

      {/* 代餐商品详情弹窗 */}
      <MealProductDetailModal
        isOpen={showMealProductDetail}
        onClose={() => setShowMealProductDetail(false)}
        onPurchase={() => {
          setShowPaymentModal(true);
        }}
      />

      {/* 支付弹窗 */}
      <PaymentModal
        isOpen={showPaymentModal}
        amount={selectedMealPrice}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePaymentSuccess}
      />

      {/* 设备绑定引导弹窗 */}
      <DeviceBindingModal
        isOpen={showDeviceBindingModal}
        onClose={() => setShowDeviceBindingModal(false)}
        onBindSuccess={() => {
          // 绑定成功，更新设备绑定状态
          setHasDeviceBound(true);
        }}
      />

      {/* 设备信息概览弹窗 */}
      <DeviceInfoModal
        isOpen={showDeviceInfoModal}
        onClose={() => setShowDeviceInfoModal(false)}
      />

      {/* 病案号绑定弹窗 */}
      <AnimatePresence>
        {showMedicalRecordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowMedicalRecordModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">
                  {medicalRecordNumber ? "修改病案号" : "绑定病案号"}
                </h3>
                <button
                  onClick={() => setShowMedicalRecordModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!showQRScanner ? (
                <>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        病案号
                      </label>
                      <input
                        type="text"
                        value={tempMedicalRecord}
                        onChange={(e) => setTempMedicalRecord(e.target.value)}
                        placeholder="请输入8-12位病案号"
                        maxLength={12}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        病案号可在邵逸夫医院就诊卡或病历本上找到
                      </p>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => {
                          setShowQRScanner(true);
                        }}
                        className="flex-1 py-3 bg-purple-50 text-purple-600 rounded-lg font-medium hover:bg-purple-100 transition-colors border-2 border-purple-200"
                      >
                        📱 扫码绑定
                      </button>
                      <button
                        onClick={handleSaveMedicalRecord}
                        className="flex-1 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                      >
                        保存
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  {/* 扫码界面 */}
                  <div className="bg-gray-100 rounded-xl p-8 flex flex-col items-center justify-center min-h-[300px]">
                    <div className="w-48 h-48 bg-white rounded-xl flex items-center justify-center mb-4 border-4 border-dashed border-blue-300 animate-pulse">
                      <div className="text-center">
                        <div className="text-6xl mb-2">📷</div>
                        <p className="text-sm text-gray-600">扫描中...</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 text-center">
                      请将二维码对准扫描框
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowQRScanner(false)}
                      className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                      取消
                    </button>
                    <button
                      onClick={handleQRCodeScan}
                      className="flex-1 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                    >
                      模拟扫码成功
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}