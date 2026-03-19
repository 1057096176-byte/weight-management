import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router";
import { ArrowLeft, AlertCircle, History, RotateCcw } from "lucide-react";
import { ChatInput } from "../components/ChatInput";
import { ChatMessage } from "../components/ChatMessage";
import { RecommendationResult } from "../components/RecommendationResult";
import { motion } from "motion/react";

type TriageStage = "basic" | "symptoms" | "risk" | "complete";

interface Message {
  id: string;
  message: string;
  isUser: boolean;
  time: string;
  options?: string[];
}

interface Doctor {
  id: string;
  name: string;
  avatar: string;
  title: string;
  specialty: string;
  expertise: string;
  served: string;
  rating: string;
  gradient: string;
  bgGradient: string;
  borderColor: string;
}

interface Department {
  name: string;
  matchRate: number;
  description: string;
  tags: string[];
  type: "primary" | "secondary";
}

interface TriageData {
  messages: Message[];
  stage: TriageStage;
  questionIndex: number;
  recommendation?: {
    departments: Department[];
    doctors: Doctor[];
  };
}

export default function Triage() {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<TriageStage>("basic");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [recommendation, setRecommendation] = useState<{
    departments: Department[];
    doctors: Doctor[];
  } | null>(null);
  
  // 从 localStorage 加载历史记录
  const loadHistory = () => {
    const saved = localStorage.getItem("triageHistory");
    if (saved) {
      const data: TriageData = JSON.parse(saved);
      return {
        messages: data.messages || [],
        stage: data.stage || "basic",
        questionIndex: data.questionIndex || 0,
        recommendation: data.recommendation || null,
      };
    }
    return null;
  };

  const history = loadHistory();
  
  const [messages, setMessages] = useState<Message[]>(
    history?.messages || [
      {
        id: "welcome",
        message: "您好！我是智能导诊助手 🤖\n\n接下来我会通过几个问题了解您的情况，为您推荐最合适的科室和医生。整个过程大约需要3-5分钟。\n\n让我们开始吧！",
        isUser: false,
        time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
      },
      {
        id: "q1",
        message: "首先，请问您的年龄是多少？",
        isUser: false,
        time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
        options: ["18-25岁", "26-35岁", "36-45岁", "46-60岁", "60岁以上"],
      },
    ]
  );

  // 初始化状态时，恢复历史数据
  useEffect(() => {
    if (history) {
      if (history.stage) setStage(history.stage);
      if (history.questionIndex) setQuestionIndex(history.questionIndex);
      if (history.recommendation) setRecommendation(history.recommendation);
    }
  }, []);

  // 问题库
  const questions = {
    basic: [
      {
        question: "请问您的性别是？",
        options: ["男", "女"],
      },
      {
        question: "您目前的身高和体重是多少？\n（请输入，例如：身高170cm，体重70kg）",
        options: undefined,
      },
      {
        question: "您的体重管理目标是什么？",
        options: ["减重", "增重", "塑形", "健康管理"],
      },
      {
        question: "您希望达到的目标体重是多少公斤？",
        options: undefined,
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
      {
        question: "您是否有以下消化系统问题？\n\n• 便秘或腹泻\n• 胃痛或胃胀\n• 消化不良",
        options: ["有", "没有"],
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
        question: "您是否正在服用任何药物？",
        options: ["是", "否"],
      },
      {
        question: "最后一个问题：您之前是否尝试过减重？结果如何？",
        options: ["从未尝试", "尝试过但反弹", "尝试过有效果", "多次尝试失败"],
      },
    ],
  };

  const stageInfo = {
    basic: { label: "基础信息", progress: 33, color: "bg-blue-500" },
    symptoms: { label: "症状评估", progress: 66, color: "bg-purple-500" },
    risk: { label: "风险评估", progress: 100, color: "bg-green-500" },
    complete: { label: "评估完成", progress: 100, color: "bg-green-500" },
  };

  // 保存历史记录
  useEffect(() => {
    localStorage.setItem(
      "triageHistory",
      JSON.stringify({
        messages,
        stage,
        questionIndex,
        recommendation,
      })
    );
  }, [messages, stage, questionIndex, recommendation]);

  // 自动滚动到最新消息
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const askNextQuestion = () => {
    const currentQuestions = questions[stage as keyof typeof questions];
    
    if (!currentQuestions || questionIndex >= currentQuestions.length) {
      // 当前阶段问题结束，进入下一阶段
      if (stage === "basic") {
        setStage("symptoms");
        setQuestionIndex(0);
        setTimeout(() => {
          addAIMessage(
            "很好！基础信息已收集完成。\n\n接下来进入症状评估阶段，了解您的身体状况和生活习惯。"
          );
          setTimeout(() => {
            const firstQuestion = questions.symptoms[0];
            addAIMessage(firstQuestion.question, firstQuestion.options);
          }, 1000);
        }, 1000);
      } else if (stage === "symptoms") {
        setStage("risk");
        setQuestionIndex(0);
        setTimeout(() => {
          addAIMessage(
            "症状评估完成！\n\n现在进入最后一个阶段：风险评估。这将帮助我们更好地为您制定安全有效的方案。"
          );
          setTimeout(() => {
            const firstQuestion = questions.risk[0];
            addAIMessage(firstQuestion.question, firstQuestion.options);
          }, 1000);
        }, 1000);
      } else if (stage === "risk") {
        // 完成所有评估
        setStage("complete");
        setTimeout(() => {
          addAIMessage(
            "🎉 太棒了！所有信息已收集完成。\n\n正在为您分析并匹配最合适的科室和医生..."
          );
          // 自动生成推荐结果
          setTimeout(() => {
            generateRecommendation();
          }, 2000);
        }, 1000);
      }
      return;
    }

    const nextQuestion = currentQuestions[questionIndex];
    setTimeout(() => {
      addAIMessage(nextQuestion.question, nextQuestion.options);
    }, 1000);
  };

  const addAIMessage = (message: string, options?: string[]) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        message,
        isUser: false,
        time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
        options,
      },
    ]);
  };

  // 生成推荐结果
  const generateRecommendation = () => {
    // 模拟医生推荐数据
    const recommendedDoctors: Doctor[] = [
      {
        id: "1",
        name: "李明医生",
        avatar: "👨‍⚕️",
        title: "主任医师",
        specialty: "内分泌科专家",
        expertise: "肥胖症、代谢综合征、糖尿病、甲状腺疾病",
        served: "15,842",
        rating: "4.9",
        gradient: "from-blue-400 to-purple-400",
        bgGradient: "from-blue-50 to-purple-50",
        borderColor: "border-blue-100",
      },
      {
        id: "2",
        name: "王芳医生",
        avatar: "👩‍⚕️",
        title: "副主任医师",
        specialty: "营养科专家",
        expertise: "营养评估、饮食计划、女性体重管理",
        served: "12,356",
        rating: "4.8",
        gradient: "from-purple-400 to-pink-400",
        bgGradient: "from-purple-50 to-pink-50",
        borderColor: "border-purple-100",
      },
    ];

    const recommendedDepartments: Department[] = [
      {
        name: "内分泌科",
        matchRate: 95,
        description: "内分泌科专注于体重管理、代谢调节和内分泌系统健康。该科室擅长诊疗肥胖症、代谢综合征、糖尿病、甲状腺疾病等与体重和代谢相关的疾病。",
        tags: ["体重管理", "代谢调节", "营养指导"],
        type: "primary",
      },
      {
        name: "营养科",
        matchRate: 88,
        description: "营养科提供专业的饮食计划制定和营养健康管理服务。该科室能够为您进行全面的营养评估，制定个性化饮食方案，特别适合需要系统性饮食调整的人群。",
        tags: ["饮食计划", "营养评估"],
        type: "secondary",
      },
    ];

    setRecommendation({
      doctors: recommendedDoctors,
      departments: recommendedDepartments,
    });
  };

  const handleSendMessage = (message: string) => {
    // 添加用户消息
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        message,
        isUser: true,
        time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);

    // 增加问题索引
    setQuestionIndex((prev) => prev + 1);

    // 询问下一个问题
    setTimeout(() => {
      askNextQuestion();
    }, 500);
  };

  const handleOptionClick = (option: string) => {
    handleSendMessage(option);
  };

  const handleBackToHome = () => {
    if (stage !== "complete" && messages.length > 2) {
      if (window.confirm("导诊还未完成，确定要返回吗？您的进度将被保存。")) {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  };

  const clearHistory = () => {
    localStorage.removeItem("triageHistory");
    window.location.reload();
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={handleBackToHome}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-semibold">智能导诊</h1>
          {(history || stage === "complete") && (
            <button
              onClick={clearHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg transition-all hover:shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              {stage === "complete" ? "重新导诊" : "重新开始"}
            </button>
          )}
          {!history && stage !== "complete" && <div className="w-20" />}
        </div>

        {/* 进度指示器 */}
        {stage !== "complete" && (
          <div className="px-4 pb-3">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
              <span className={stage === "basic" ? "font-medium text-blue-600" : ""}>
                基础信息
              </span>
              <span className={stage === "symptoms" ? "font-medium text-purple-600" : ""}>
                症状评估
              </span>
              <span className={stage === "risk" ? "font-medium text-green-600" : ""}>
                风险评估
              </span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stageInfo[stage].progress}%` }}
                transition={{ duration: 0.5 }}
                className={`h-full ${stageInfo[stage].color} rounded-full`}
              />
            </div>
          </div>
        )}
      </div>

      {/* 提示信息 */}
      {stage !== "complete" && (
        <div className="bg-blue-50 border-b border-blue-100 px-4 py-3">
          <div className="flex items-start gap-2 text-sm">
            <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-blue-800">
              当前进行：<span className="font-medium">{stageInfo[stage].label}</span>
              {stage === "basic" && "，请如实填写以获得最准确的方案"}
              {stage === "symptoms" && "，了解您的身体状况"}
              {stage === "risk" && "，马上就要完成了！"}
            </p>
          </div>
        </div>
      )}

      {/* 聊天区域 */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 space-y-4">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} {...msg} onOptionClick={handleOptionClick} />
          ))}

          {/* 推荐科室与医生分身卡片 - 使用模块化组件 */}
          {stage === "complete" && (
            <RecommendationResult 
              departments={recommendation?.departments}
              doctors={recommendation?.doctors}
            />
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 底部输入框 */}
      {stage !== "complete" && (
        <ChatInput
          onSend={handleSendMessage}
          placeholder="输入您的回答..."
        />
      )}
    </div>
  );
}