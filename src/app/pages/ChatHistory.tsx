import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Trash2 } from "lucide-react";
import { ChatMessage } from "../components/ChatMessage";
import { ChatInput } from "../components/ChatInput";
import { motion } from "motion/react";

// 模拟历史对话数据
const mockHistoryData: Record<string, {
  title: string;
  time: string;
  messages: Array<{
    id: string;
    message: string;
    isUser: boolean;
    time: string;
  }>;
}> = {
  "1": {
    title: "关于运动计划的问题",
    time: "2小时前",
    messages: [
      {
        id: "1",
        message: "你好，我想了解一下如何制定适合自己的运动计划？",
        isUser: true,
        time: "14:30",
      },
      {
        id: "2",
        message: "您好！很高兴为您解答运动计划相关的问题。\n\n制定适合的运动计划需要考虑以下几个方面：\n\n1️⃣ **评估当前体能水平**\n• 了解自己的运动基础\n• 是否有运动禁忌症\n• 身体状况和健康指标\n\n2️⃣ **设定明确目标**\n• 减重、增肌还是提升体能\n• 短期和长期目标\n• 可量化的指标\n\n3️⃣ **选择合适的运动类型**\n• 有氧运动：跑步、游泳、骑行\n• 力量训练：器械、自重训练\n• 柔韧性训练：瑜伽、拉伸\n\n您目前的运动基础如何？有特定的健康目标吗？",
        isUser: false,
        time: "14:31",
      },
      {
        id: "3",
        message: "我基本没有运动基础，主要想减重，目标是减掉10公斤。",
        isUser: true,
        time: "14:33",
      },
      {
        id: "4",
        message: "非常好！针对您的情况，我为您制定以下建议：\n\n**初级减重运动计划**\n\n📅 **第1-2周（适应期）**\n• 快走：每次20-30分钟，每周3-4次\n• 简单拉伸：每次10分钟\n• 强度：微微出汗即可\n\n📅 **第3-4周（提升期）**\n• 快走/慢跑：每次30-40分钟，每周4-5次\n• 简单力量训练：深蹲、平板支撑\n• 强度：能正常对话\n\n📅 **第5-8周（稳定期）**\n• 慢跑：每次40-50分钟，每周5次\n• 力量训练：每周2-3次\n• 强度：稍感吃力但能坚持\n\n⚠️ **重要提醒**\n• 运动前热身5-10分钟\n• 运动后拉伸10分钟\n• 循序渐进，避免受伤\n• 配合饮食控制效果更佳\n\n需要我为您制定详细的周计划吗？",
        isUser: false,
        time: "14:35",
      },
      {
        id: "5",
        message: "好的，麻烦您帮我制定一个详细的第一周计划。",
        isUser: true,
        time: "14:37",
      },
      {
        id: "6",
        message: "为您制定了第一周详细计划：\n\n**第一周运动计划（适应期）**\n\n🗓️ **周一**\n• 07:00 快走 25分钟\n• 拉伸 10分钟\n• 目标：2000步以上\n\n🗓️ **周二**\n• 休息日\n• 可进行轻度散步\n\n🗓️ **周三**\n• 07:00 快走 25分钟\n• 拉伸 10分钟\n• 增加小幅度摆臂\n\n🗓️ **周四**\n• 休息日或瑜伽 15分钟\n\n🗓️ **周五**\n• 07:00 快走 30分钟\n• 拉伸 10分钟\n• 可选择公园、操场\n\n🗓️ **周六**\n• 09:00 快走 30分钟\n• 简单力量：深蹲 2组×10次\n\n🗓️ **周日**\n• 休息日\n• 回顾本周完成情况\n\n💡 **温馨提示**\n• 穿合适的运动鞋\n• 带好水瓶，及时补水\n• 记录每次运动感受\n• 完成后记得打卡\n\n要开始执行了吗？我可以帮您设置提醒哦！",
        isUser: false,
        time: "14:39",
      },
    ],
  },
  "2": {
    title: "饮食建议咨询",
    time: "昨天",
    messages: [
      {
        id: "1",
        message: "我想咨询一下减重期间的饮食应该怎么安排？",
        isUser: true,
        time: "昨天 15:20",
      },
      {
        id: "2",
        message: "您好！减重期间的饮食安排非常重要，需要做到科学、健康、可持续。\n\n**基本原则：**\n\n🔸 **热量控制**\n• 女性：1200-1500千卡/天\n• 男性：1500-1800千卡/天\n• 不建议低于基础代谢率\n\n🔸 **营养均衡**\n• 碳水化合物：45-55%\n• 蛋白质：20-30%\n• 脂肪：20-30%\n\n🔸 **饮食结构**\n• 优质蛋白：鸡胸肉、鱼类、豆制品\n• 复杂碳水：糙米、全麦、燕麦\n• 健康脂肪：坚果、橄榄油、鳄梨\n• 大量蔬菜：500g以上/天\n• 适量水果：200-300g/天\n\n您目前的饮食习惯是怎样的？",
        isUser: false,
        time: "昨天 15:21",
      },
      {
        id: "3",
        message: "我平时早餐经常不吃，午餐外卖，晚餐比较丰盛。",
        isUser: true,
        time: "昨天 15:23",
      },
      {
        id: "4",
        message: "我理解您的情况，这是很多上班族的饮食模式。让我为您做一些调整建议：\n\n**需要改善的地方：**\n\n❌ **不吃早餐**\n• 会降低代谢率\n• 容易午餐吃太多\n• 影响血糖稳定\n\n✅ **改善方案：**\n• 准备简单早餐：燕麦+鸡蛋+水果\n• 或前一晚准备隔夜燕麦\n• 至少喝一杯牛奶/豆浆\n\n❌ **外卖午餐**\n• 油盐糖往往超标\n• 蔬菜量不足\n• 不易控制热量\n\n✅ **改善方案：**\n• 选择轻食类外卖\n• 自带蔬菜沙拉\n• 或周末备餐（meal prep）\n\n❌ **晚餐丰盛**\n• 睡前消化负担重\n• 易转化为脂肪储存\n\n✅ **改善方案：**\n• 晚餐减量至7成饱\n• 增加蔬菜比例\n• 睡前3小时不进食\n\n需要我为您设计一周的详细食谱吗？",
        isUser: false,
        time: "昨天 15:25",
      },
    ],
  },
};

export default function ChatHistory() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const historyData = id ? mockHistoryData[id] : null;
  const [messages, setMessages] = useState(historyData?.messages || []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!historyData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">对话记录不存在</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  const handleSendMessage = (message: string) => {
    const newMessage = {
      id: Date.now().toString(),
      message,
      isUser: true,
      time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages([...messages, newMessage]);

    // 模拟AI回复
    setTimeout(() => {
      const replyMessage = {
        id: (Date.now() + 1).toString(),
        message: "感谢您的提问！我会根据您之前的对话历史继续为您提供帮助。\n\n请问您还有什么其他问题吗？",
        isUser: false,
        time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, replyMessage]);
    }, 1000);
  };

  const handleDeleteHistory = () => {
    if (confirm("确定要删除这条对话记录吗？")) {
      // 实际应该调用API删除
      navigate(-1);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-semibold">{historyData.title}</h1>
            <p className="text-xs text-gray-500">{historyData.time}</p>
          </div>
        </div>
        <button
          onClick={handleDeleteHistory}
          className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* 聊天内容区域 */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4">
          {/* 历史标记 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-center"
          >
            <p className="text-sm text-amber-700">
              📜 这是历史对话记录，您可以继续提问
            </p>
          </motion.div>

          {/* 聊天消息 */}
          <div className="space-y-4">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} {...msg} />
            ))}
          </div>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 输入框 */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto p-4">
          <ChatInput onSend={handleSendMessage} placeholder="继续对话..." />
        </div>
      </div>
    </div>
  );
}
