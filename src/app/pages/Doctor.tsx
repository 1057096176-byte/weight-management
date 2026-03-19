import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { ArrowLeft, RefreshCw, AlertTriangle, CheckCircle } from "lucide-react";
import { ChatInput } from "../components/ChatInput";
import { ChatMessage } from "../components/ChatMessage";
import { motion } from "motion/react";

export default function Doctor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 风险等级评估：根据对话内容自动判断
  // 'low' = 绿灯（线上干预）
  // 'medium' = 部分黄灯（可线上干预）
  // 'high' = 红灯/高危黄灯（需线下就诊）
  const [riskLevel, setRiskLevel] = useState<"low" | "medium" | "high">("low");
  
  // 方案生成状态：通过对话自动触发
  const [planGenerated, setPlanGenerated] = useState(false);
  
  // 对话轮次计数
  const [conversationRounds, setConversationRounds] = useState(0);
  
  // 🆕 AI是否已询问用户是否生成方案
  const [hasAskedForPlan, setHasAskedForPlan] = useState(false);
  
  // 从导诊页面获取的用户信息（模拟数据）
  const userTriageData = {
    age: 32,
    gender: "女",
    height: 165,
    weight: 75,
    bmi: 28.5,
    targetWeight: 65,
    symptoms: ["睡眠质差", "食欲不振"],
    chronicDiseases: "无",
    exerciseHabit: "偶尔运动",
    dietHabit: "经常外食",
  };

  const [messages, setMessages] = useState([
    {
      id: "1",
      message: `您好！我是李明医生的AI分身，专注于内分泌和体重管理领域，擅长肥胖症、代谢综合征、糖尿病、甲状腺疾病的诊疗和健康指导。\n\n很高兴为您提供专业的健康咨询服务！`,
      isUser: false,
      time: "14:45",
    },
    {
      id: "2",
      message: `根据您的导诊信息，我注意到：\n• 年龄：${userTriageData.age}岁\n• BMI：${userTriageData.bmi}（超重）\n• 症状：${userTriageData.symptoms.join("、")}\n• 慢性病史：${userTriageData.chronicDiseases}\n• 运动习惯：${userTriageData.exerciseHabit}\n\n您平时的饮食习惯如何？是否经常外食？`,
      isUser: false,
      time: "14:45",
      options: ["经常外食", "偶尔外食", "基本自己做饭"],
    },
  ]);

  // 常见问题库（三组，支持换一批）
  const allCommonQuestions = [
    ["如何科学减重不反弹？", "适合我的运动强度是多少？", "减重期间如何保证营养？"],
    ["减重过程中遇到平台期怎么办？", "如何控制食欲和饥饿感？", "减重会影响基础代谢吗？"],
    ["需要服用减重药物吗？", "如何避免皮肤松弛？", "减重后如何保持体重？"],
  ];

  const [currentQuestionSet, setCurrentQuestionSet] = useState(0);
  const [showQuestions, setShowQuestions] = useState(true);

  const doctorInfo = {
    name: "李明医生",
    title: "主任医师",
    specialty: "内分泌科专家",
    expertise: "肥胖症、代谢综合征、糖尿病、甲状腺疾病",
    avatar: "👨‍⚕️",
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = (message: string, image?: File) => {
    // 隐藏常见问题
    setShowQuestions(false);

    // 处理图片上传
    if (image) {
      setMessages([
        ...messages,
        {
          id: Date.now().toString(),
          message: `📷 [图片] ${message || "上传了一张图片"}`,
          isUser: true,
          time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);

      // 医生回复图片
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            message: "我已经收到您的图片。如果这是检查报告或相关症状照片，请结合文字描述告诉我具体情况，这样我能给您更准确的建议。",
            isUser: false,
            time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }, 1000);
      return;
    }

    if (!message.trim()) return;

    // 增加对话轮次
    const newRounds = conversationRounds + 1;
    setConversationRounds(newRounds);
    
    console.log('🔵 === 发送消息调试 ===');
    console.log('📝 消息内容:', message);
    console.log('🔢 对话轮次: 旧值=', conversationRounds, '→ 新值=', newRounds);
    console.log('💡 已询问方案状态:', hasAskedForPlan);
    console.log('✅ 方案已生成状态:', planGenerated);

    setMessages([
      ...messages,
      {
        id: Date.now().toString(),
        message,
        isUser: true,
        time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);

    // 模拟医生回复
    setTimeout(() => {
      let replyMessage = "我了解了。根据您的情况，我建议采取渐进式的体重管理方案。";
      let shouldGeneratePlan = false;
      let shouldRecommendOffline = false;
      let shouldAskForPlan = false; // 是否在回复中询问用户是否生成方案
      
      // 🆕 检测用户的肯定性回复
      const positiveKeywords = ["可以", "好的", "好啊", "好", "行", "确定", "是的", "嗯", "ok", "OK", "可", "要", "生成", "当然", "同意"];
      const negativeKeywords = ["不", "没", "别", "算了", "不用", "不要", "不需要", "不想", "拒绝", "不行"];
      
      // 先检测否定词
      const hasNegative = negativeKeywords.some(keyword => message.includes(keyword));
      const hasPositive = positiveKeywords.some(keyword => message.includes(keyword));
      
      // 如果有否定词，则不是肯定回复；否则检查是否有肯定词
      const isPositiveResponse = !hasNegative && hasPositive;
      
      // 🆕 检测用户是否提到线下就诊相关内容
      const offlineKeywords = ["线下", "医院", "就诊", "挂号", "预约", "去看", "面诊"];
      const wantsOffline = offlineKeywords.some(keyword => message.includes(keyword));
      
      console.log('💬 检测到否定关键词:', hasNegative);
      console.log('💬 检测到肯定关键词:', hasPositive);
      console.log('💬 最终判定为肯定性回复:', isPositiveResponse);
      console.log('🏥 检测到线下就诊意向:', wantsOffline);
      
      // 优先级1：如果AI已经询问过方案，且用户回复肯定，则生成方案
      if (hasAskedForPlan && isPositiveResponse && !planGenerated) {
        console.log('✅✅✅ 用户确��成方案，将触发方案生成');
        shouldGeneratePlan = true;
        replyMessage = ""; // 不需要额外回复，直接生成方案
        setHasAskedForPlan(false); // 重置询问状态
      } else if (hasAskedForPlan && !isPositiveResponse) {
        // 🔴 用户拒绝线上方案或明确提到线下就诊（无论是否已生成方案）
        if (wantsOffline) {
          replyMessage = "我理解您希望进行线下就诊。这是一个很明智的决定，线下就诊可以进行更全面的医学检查。\n\n我为您整理了详细的就诊指引，请查看下方的建议。";
          shouldRecommendOffline = true;
          console.log('🔴 用户明确要求线下就诊，触发路径B');
        } else {
          replyMessage = "好的，我理解。如果您对自己的健康状况有顾虑，也可以考虑先进行线下就诊，完成必要的医学检查后再制定方案。\n\n我为您整理了详细的就诊指引，请查看下方的建议。";
          shouldRecommendOffline = true;
          console.log('🔴 用户未确认线上方案，推荐线下就诊（路径B）');
        }
        setHasAskedForPlan(false); // 重置询问状态
        setPlanGenerated(false); // 重置方案生成状态，切换到线下就诊
      }
      // 优先级2：如果还没有询问过方案，根据消息内容决定是否询问
      else if (!hasAskedForPlan && !planGenerated) {
        // 检测高危风险关键词
        const highRiskKeywords = ["高血压", "糖尿病", "心脏", "胸闷", "头晕", "呼吸困难", "严重", "急性"];
        const hasHighRisk = highRiskKeywords.some(keyword => message.includes(keyword));
        
        console.log('🚨 检测到高危关键词:', hasHighRisk);
        
        if (hasHighRisk) {
          // 触发路径B：线下就诊推荐
          replyMessage = "我注意到您提到了一些需要重视的健康信号。根据您的描述，我建议您先进行线下就诊，完成专业的医学检查，以确保安全。请查看下方的详细建议。";
          shouldRecommendOffline = true;
          setRiskLevel("high");
          console.log('🔴 触发路径B：线下就诊推荐');
        }
        // 根据消息内容生成智能回复
        else if (message.includes("平台期")) {
          replyMessage = `平台期是减重过程中很正常的现象，不要灰心！\n\n突破平台期的建议：\n• 调整运动方式，增加运动强度或变换运动类型\n• 重新计算热量需求，可能需要微调饮食\n• 确保充足睡眠和水分摄入\n• 记录饮食日记，找出可能的问题\n\n通常坚持2-3周就能突破平台期。`;
          console.log('📊 匹配关键词: 平台期');
        } else if (message.includes("外食") || message.includes("自己做") || message.includes("做饭")) {
          replyMessage = `了解您的饮食习惯对制定方案很重要。\n\n${message.includes("外食") 
            ? "经常外食确实会增加热量控制的难度。建议：\n• 选择蒸、煮、烤的菜品\n• 少油少盐，主动要求\n• 控制份量，可以只吃七八分饱\n• 外食频率逐步降低至每周2-3次" 
            : "自己做饭是很好的习惯！这样能更好地控制食材和烹饪方式，有利于体重管理。"
          }\n\n基于您的情况，我可以为您生成一个详细的个性化干预方案。`;
          
          console.log('🍽️ 匹配关键词: 外食/做饭');
          console.log('🔍 检查条件: newRounds=', newRounds, '>=1?', newRounds >= 1);
          
          // 对话轮次>=1，询问用户是否生成方案
          if (newRounds >= 1) {
            shouldAskForPlan = true;
            console.log('✅ 满足条件！将询问用户是否生成方案');
          }
        } else if (message.includes("如何") || message.includes("减重") || message.includes("运动") || message.includes("营养")) {
          // 常见问题的智能回复
          if (message.includes("科学减重") || message.includes("不反弹")) {
            replyMessage = `科学减重不反弹的关键在于建立可持续的健康生活方式：\n\n核心原则：\n• 每周减重0.5-1kg为宜，避免快速减重\n• 保持合理热量赤字（每日300-500 kcal）\n• 营养均衡，不节食不极\n• 规律运动，培养长期习惯\n\n基于您的情况，我可以为您生成一个详细的个性化干预方案。`;
            console.log('💡 匹配关键词: 科学减重/不反弹');
          } else if (message.includes("运动强度")) {
            replyMessage = `根据您的BMI ${userTriageData.bmi}和运动习惯（${userTriageData.exerciseHabit}），建议：\n\n初期（1-2周）：\n• 快走：每天20-30分钟\n• 强度：微微出汗，能正常对话\n\n进阶期（3-8周）：\n• 快走/慢跑：每次30-40分钟\n• 游泳/骑行：每周2-3次\n\n提升期（9周后）：\n• 增加力量训练\n• 运动多样化\n\n基于您的情况，我可以为您生成一个详细的个性化干预方案。`;
            console.log('💪 匹配关键词: 运动强度');
          } else {
            replyMessage = `基于您的情况（BMI ${userTriageData.bmi}，${userTriageData.exerciseHabit}），我建议采用综合性的体重管理方案，包括饮食、运动和生活方式调整。\n\n我可以为您生成一个详细的个性化干预方案。`;
            console.log('📋 ���配关键词: 如何/重/运动/营养（通用）');
          }
          
          console.log('🔍 检查条件: newRounds=', newRounds, '>=2?', newRounds >= 2);
          
          // 常见问题对话>=2轮就询问用户是否生成方案
          if (newRounds >= 2) {
            shouldAskForPlan = true;
            console.log('✅ 满足条件！将询问用户是否生成方案');
          }
        } else {
          // 通用回复
          replyMessage = "我了解了。根据您的情况，我议采取渐进式的体重管理方案。";
          console.log('⚪ 未匹配特殊关键词，使用通用回复');
        }
      }
      
      console.log('🎯 最终决策: shouldGeneratePlan=', shouldGeneratePlan, ', shouldAskForPlan=', shouldAskForPlan, ', shouldRecommendOffline=', shouldRecommendOffline);
      console.log('🔵 ==================\n');
      
      // 🆕 如果需要推荐线下就诊，立即设置风险等级（不要延迟）
      if (shouldRecommendOffline) {
        setRiskLevel("high");
        console.log('🔴 立即设置 riskLevel = high');
      }
      
      // 发送医生回复消息
      if (replyMessage) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            message: replyMessage,
            isUser: false,
            time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }

      // 自动触发方案生成（路径A）
      if (shouldGeneratePlan) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 2).toString(),
              message: `好的！我已经根据您的情况，为您生成了一个为期3个月的个性化体重管理方案。\n\n方案包括\n✅ 详细的饮食能量目标和营养素分配\n✅ 一日三餐示例食谱\n✅ 每周运动计划（频次、类型、时长）\n✅ 生活方式调整建议\n\n请查看下方卡片了解详情。`,
              isUser: false,
              time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
            },
          ]);
          setPlanGenerated(true);
        }, 2000);
      }

      // 询问用户是否生成方案（设置询问状态）
      if (shouldAskForPlan) {
        setHasAskedForPlan(true);
        console.log('🔔 已设置询问状态，等待用户回复');
      }

      // 注意：线下就诊推荐的 riskLevel 已在上方立即设置，无需延迟
    }, 1500);
  };

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const handleRefreshQuestions = () => {
    setCurrentQuestionSet((prev) => (prev + 1) % allCommonQuestions.length);
  };

  const handleGeneratePlan = () => {
    setMessages([
      ...messages,
      {
        id: Date.now().toString(),
        message: "好的，请为我生成体重管理方案",
        isUser: true,
        time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          message: riskLevel === "high" 
            ? "根据您的健康评估结果，我发现您存在一些需要重视的健康风险指标。为了您的安全，我强烈建议您先进行线下就诊，完成必要的检查后，我们再为您制定个性化的干预方案。" 
            : `好的！我已经根据您的情况，为您生成了一个为期3个月的个性化体重管理方案。\n\n方案包括：\n✅ 详细的饮食能量目标和营养素分配\n✅ 一日三餐示例食谱\n✅ 每周运动计划（频次、类型、时长）\n✅ 生活方式调整建议\n\n请查看下方卡片了解详情。`,
          isUser: false,
          time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setPlanGenerated(true);
    }, 2000);
  };

  const handleRecommendOffline = () => {
    setRiskLevel("high");
    setMessages([
      ...messages,
      {
        id: Date.now().toString(),
        message: "我想了解是否需要线下就诊",
        isUser: true,
        time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          message: "根据您的情况评估，为了确保安全和效果，建议您进行线下就诊，完成必要的医学检查。请查看下方的详细建议。",
          isUser: false,
          time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1500);
  };

  return (
    <div 
      className="h-screen flex flex-col"
      style={{
        background: "linear-gradient(180deg, #FFF5F8 0%, #F5F3FF 100%)",
        backgroundColor: "#FAFAFF"
      }}
    >
      {/* 顶部导航 */}
      <div 
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.05)"
        }}
      >
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            style={{ borderRadius: "8px" }}
          >
            <ArrowLeft className="w-5 h-5" style={{ color: "#1A1A1A" }} />
          </button>
          <h1 style={{ fontSize: "17px", fontWeight: 600, color: "#1A1A1A" }}>医生分身问诊</h1>
          <div className="w-9" />
        </div>

        {/* 医生信息卡片 */}
        <div className="px-4 pb-3 flex items-center gap-3">
          <div 
            className="flex items-center justify-center text-2xl"
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #2B5BFF 0%, #6B8FFF 100%)"
            }}
          >
            {doctorInfo.avatar}
          </div>
          <div className="flex-1">
            <div style={{ fontSize: "15px", fontWeight: 500, color: "#1A1A1A" }}>
              {doctorInfo.name} · {doctorInfo.title}
            </div>
            <div style={{ fontSize: "12px", color: "#8A8A93", marginTop: "2px" }}>
              {doctorInfo.expertise}
            </div>
            <div className="flex items-center gap-2" style={{ marginTop: "6px" }}>
              <span 
                className="px-2 py-0.5 text-xs font-medium"
                style={{
                  backgroundColor: "#EAEBFF",
                  color: "#2B5BFF",
                  borderRadius: "4px"
                }}
              >
                {doctorInfo.specialty}
              </span>
              {planGenerated && (
                <span 
                  className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium"
                  style={{
                    backgroundColor: "#E8F5E9",
                    color: "#4CAF50",
                    borderRadius: "4px"
                  }}
                >
                  <CheckCircle className="w-3 h-3" />
                  已生成方案
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 聊天区域 */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 space-y-4">
          {/* 常见问题区域（初始显示，发送消息后隐藏，但向上滚动仍可见） */}
          {showQuestions && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "16px",
                padding: "16px",
                border: "1px solid rgba(0, 0, 0, 0.05)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)"
              }}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: "12px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: 500, color: "#1A1A1A" }}>💬 常见问题</h3>
                <button
                  onClick={handleRefreshQuestions}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  title="换一批"
                  style={{ borderRadius: "8px" }}
                >
                  <RefreshCw className="w-4 h-4" style={{ color: "#8A8A93" }} />
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {allCommonQuestions[currentQuestionSet].map((question, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleQuickQuestion(question)}
                    className="w-full text-left transition-all"
                    style={{
                      padding: "12px 16px",
                      background: "linear-gradient(135deg, #EAEBFF 0%, #FFFFFF 100%)",
                      borderRadius: "16px",
                      border: "1px solid rgba(43, 91, 255, 0.1)",
                      fontSize: "13px",
                      color: "#1A1A1A",
                      cursor: "pointer"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "linear-gradient(135deg, #D6D9FF 0%, #F0F0FF 100%)";
                      e.currentTarget.style.transform = "translateX(4px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "linear-gradient(135deg, #EAEBFF 0%, #FFFFFF 100%)";
                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    {question}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {messages.map((msg) => (
            <ChatMessage key={msg.id} {...msg} onOptionClick={handleSendMessage} />
          ))}

          {/* 路径B：线下就诊推荐卡片（高风险/红灯时显示） */}
          {riskLevel === "high" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border-2 border-red-200 shadow-lg"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-900 mb-1">
                    建议线下就诊（医疗级评估）
                  </h3>
                  <p className="text-sm text-red-700">
                    根据您的症状和健康状况评估，发现以下风险指标需要专业医疗检查。为确保您的安全，强烈建议前往正规医院进行全面检查。
                  </p>
                </div>
              </div>

              {/* 推荐科室及医生 */}
              <div className="space-y-3 mb-3">
                {/* 内分泌科医生推荐 */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-xs">🏥</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">首选：内分泌科</div>
                    <span className="ml-auto text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">优先推荐</span>
                  </div>
                  
                  {/* 医生卡片 */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-2xl shadow-md flex-shrink-0">
                        👨‍⚕️
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">张建华</h4>
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">主任医师</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">内分泌科 · 从业28年</p>
                        <p className="text-xs text-gray-700 leading-relaxed line-clamp-2">
                          擅长肥胖症、代谢综合征、糖尿病等内分泌疾病的诊疗，对复杂病例有丰富临床经验。已成功帮助数千名患者实现健康减重。
                        </p>
                      </div>
                    </div>
                    <button className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                      <span>📋</span>
                      预约挂号
                    </button>
                  </div>
                </div>

                {/* 营养科医生推荐 */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-xs">🥗</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">配合：营养科</div>
                    <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">辅助治疗</span>
                  </div>
                  
                  {/* 医生卡片 */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-2xl shadow-md flex-shrink-0">
                        👩‍⚕️
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">李明</h4>
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">副主任医师</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">临床营养科 · 从业15年</p>
                        <p className="text-xs text-gray-700 leading-relaxed line-clamp-2">
                          专注于体重管理和代谢性疾病营养干预，擅长为肥胖症患者定制个性化饮食方案，结合医学营养治疗帮助患者科学减重。
                        </p>
                      </div>
                    </div>
                    <button className="w-full py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-sm font-medium hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                      <span>📋</span>
                      预约挂号
                    </button>
                  </div>
                </div>

                {/* 心血管内科医生推荐 */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-xs">❤️</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">备选：心血管内科</div>
                    <span className="ml-auto text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">风险评估</span>
                  </div>
                  
                  {/* 医生卡片 */}
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-2xl shadow-md flex-shrink-0">
                        👨‍⚕️
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">王宇</h4>
                          <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded">主任医师</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">心血管内科 · 从业22年</p>
                        <p className="text-xs text-gray-700 leading-relaxed line-clamp-2">
                          擅长高血压、高血脂等心血管疾病诊疗，对肥胖相关心血管风险评估和管理有深入研究，提供综合心血管健康保护方案。
                        </p>
                      </div>
                    </div>
                    <button className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg text-sm font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                      <span>📋</span>
                      预约挂号
                    </button>
                  </div>
                </div>
              </div>

              {/* 建议检查项目 */}
              <div className="bg-white rounded-xl p-4 mb-3 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-xs">🔬</span>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">建议检查项目</div>
                </div>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center text-green-600 text-xs font-bold">✓</div>
                    <span className="text-gray-700">血压监测（含24小时动态血压）</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center text-green-600 text-xs font-bold">✓</div>
                    <span className="text-gray-700">血糖和糖化血红蛋白检查</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center text-green-600 text-xs font-bold">✓</div>
                    <span className="text-gray-700">血脂全套（总胆固醇、甘油三酯等）</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center text-green-600 text-xs font-bold">✓</div>
                    <span className="text-gray-700">甲状腺功能检查（TSH、T3、T4）</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center text-green-600 text-xs font-bold">✓</div>
                    <span className="text-gray-700">肝肾功能检查</span>
                  </div>
                </div>
              </div>

              {/* 挂号预约流程 */}
              <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs">📱</span>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">挂号/预约流程指引</div>
                </div>
                <div className="space-y-3">
                  {/* 步骤1 */}
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm mb-1">选择医院</div>
                      <p className="text-xs text-gray-600">建议选择三甲医院或专科医院，优先考虑内分泌科实力强的医疗机构</p>
                    </div>
                  </div>
                  {/* 步骤2 */}
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm mb-1">预约挂号</div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>• 医院官方APP/小程序</div>
                        <div>• 医院官方微信公众号</div>
                        <div>• 拨打医院预约电话</div>
                        <div>• 第三方平台（京医通、健康之路等）</div>
                      </div>
                    </div>
                  </div>
                  {/* 步骤3 */}
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm mb-1">就诊准备</div>
                      <p className="text-xs text-gray-600">携带身份证、医保卡、既往病历和检查报告，空腹前往（部分检查需空腹）</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 温馨提示 */}
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <span className="text-lg">💡</span>
                  <div className="flex-1 text-xs text-yellow-800">
                    <span className="font-medium">温馨提示：</span>
                    如遇紧急情况（如剧烈胸痛、呼吸困难、意识模糊等），请立即拨打120急救电话或前往最近的医院急诊科。
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 路径A：线上干预方案卡片（低风险/绿灯时显示） */}
          {riskLevel === "low" && planGenerated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl p-6 text-white shadow-lg"
            >
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-semibold">轻盈计划</h3>
                <span className="px-2 py-0.5 bg-white/20 rounded text-xs">轻量级干预</span>
              </div>
              <p className="text-blue-50 mb-4">
                个性化体重管理方案 · 预计3个月达成目标
              </p>
              
              {/* 方案概览 */}
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-4 space-y-3 text-sm">
                <div>
                  <div className="text-blue-100 mb-1">📊 能量与体重目标</div>
                  <div className="flex justify-between">
                    <span>目标体重</span>
                    <span className="font-medium">{userTriageData.targetWeight}kg（-{userTriageData.weight - userTriageData.targetWeight}kg）</span>
                  </div>
                  <div className="flex justify-between">
                    <span>每日热量目标</span>
                    <span className="font-medium">1500-1800 kcal</span>
                  </div>
                </div>

                <div>
                  <div className="text-blue-100 mb-1">🍽️ 宏量营养素分配</div>
                  <div className="flex justify-between">
                    <span>蛋白质</span>
                    <span className="font-medium">30%（90-108g/天）</span>
                  </div>
                  <div className="flex justify-between">
                    <span>碳水化合物</span>
                    <span className="font-medium">40%（150-180g/天）</span>
                  </div>
                  <div className="flex justify-between">
                    <span>脂肪</span>
                    <span className="font-medium">30%（50-60g/天）</span>
                  </div>
                </div>

                <div>
                  <div className="text-blue-100 mb-1">🏃‍♀️ 运动计划</div>
                  <div className="flex justify-between">
                    <span>每周运动频次</span>
                    <span className="font-medium">5次</span>
                  </div>
                  <div className="flex justify-between">
                    <span>每周运动时长</span>
                    <span className="font-medium">150-180分钟</span>
                  </div>
                  <div className="flex justify-between">
                    <span>运动类型</span>
                    <span className="font-medium">有氧+力量</span>
                  </div>
                </div>
              </div>

              <Link
                to="/plan"
                className="block w-full py-3 bg-white text-blue-600 rounded-lg text-center font-medium hover:shadow-lg transition-all"
              >
                查看完整方案并开启干预计划
              </Link>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 底部输入框：支持文本、语音和图片输入 */}
      <div className="bg-white border-t border-gray-200">
        <ChatInput
          onSend={handleSendMessage}
          placeholder="向医生提问..."
          showImageUpload={true}
        />
      </div>
    </div>
  );
}