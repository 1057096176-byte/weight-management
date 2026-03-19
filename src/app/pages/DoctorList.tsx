import { useNavigate } from "react-router";
import { ArrowLeft, Users, ChevronRight, Star } from "lucide-react";
import { motion } from "motion/react";

export default function DoctorList() {
  const navigate = useNavigate();

  const doctors = [
    {
      id: "1",
      name: "李明",
      title: "主任医师",
      specialty: "内分泌科专家",
      expertise: "肥胖症、代谢综合征、糖尿病、甲状腺疾病",
      avatar: "👨‍⚕️",
      rating: 4.9,
      consultCount: 1580,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      id: "2",
      name: "王芳",
      title: "副主任医师",
      specialty: "营养科专家",
      expertise: "营养评估、膳食方案、减重营养指导",
      avatar: "👩‍⚕️",
      rating: 4.8,
      consultCount: 1320,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      id: "3",
      name: "张强",
      title: "主治医师",
      specialty: "运动医学专家",
      expertise: "运动处方、康复训练、运动损伤防护",
      avatar: "👨‍⚕️",
      rating: 4.7,
      consultCount: 980,
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      id: "4",
      name: "刘敏",
      title: "主任医师",
      specialty: "心理健康专家",
      expertise: "饮食行为、情绪管理、心理健康咨询",
      avatar: "👩‍⚕️",
      rating: 4.9,
      consultCount: 1150,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(180deg, #FFF5F8 0%, #F5F3FF 100%)",
        backgroundColor: "#FAFAFF"
      }}
    >
      {/* 顶部导航栏 */}
      <header 
        className="px-4 py-3 sticky top-0 z-10"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.05)"
        }}
      >
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            style={{ borderRadius: "8px" }}
          >
            <ArrowLeft className="w-5 h-5" style={{ color: "#1A1A1A" }} />
          </button>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" style={{ color: "#2B5BFF" }} />
            <h1 style={{ fontSize: "17px", fontWeight: 600, color: "#1A1A1A" }}>医生分身</h1>
          </div>
        </div>
      </header>

      {/* 主体内容 */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* 说明卡片 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              backgroundColor: "#EAEBFF",
              borderRadius: "24px",
              padding: "16px",
              marginBottom: "24px"
            }}
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl">🤖</div>
              <div className="flex-1">
                <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#1A1A1A", marginBottom: "8px" }}>
                  AI医生分身服务
                </h2>
                <p style={{ fontSize: "13px", color: "#8A8A93", lineHeight: "18px" }}>
                  选择您需要咨询的专业领域，AI医生分身将为您提供24小时智能健康咨询服务，包括专业建议、个性化方案和健康指导。
                </p>
              </div>
            </div>
          </motion.div>

          {/* 医生列表 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {doctors.map((doctor, index) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(`/doctor/${doctor.id}`)}
                className="cursor-pointer group"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "24px",
                  padding: "16px",
                  border: "1px solid rgba(0, 0, 0, 0.05)",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(43, 91, 255, 0.12)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.05)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div className="flex items-start gap-4">
                  {/* 医生头像 */}
                  <div 
                    className="flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform"
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "16px",
                      background: "linear-gradient(135deg, #EAEBFF 0%, #FFFFFF 100%)"
                    }}
                  >
                    {doctor.avatar}
                  </div>

                  {/* 医生信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2" style={{ marginBottom: "4px" }}>
                      <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#1A1A1A" }}>
                        {doctor.name} {doctor.title}
                      </h3>
                    </div>
                    <p style={{ fontSize: "13px", fontWeight: 500, color: "#2B5BFF", marginBottom: "8px" }}>
                      {doctor.specialty}
                    </p>
                    <p style={{ fontSize: "13px", color: "#8A8A93", marginBottom: "12px", lineHeight: "18px" }} className="line-clamp-2">
                      擅长：{doctor.expertise}
                    </p>

                    {/* 评分和咨询量 */}
                    <div className="flex items-center gap-4" style={{ fontSize: "12px", color: "#8A8A93" }}>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                        <span style={{ fontWeight: 500, color: "#1A1A1A" }}>{doctor.rating}</span>
                      </div>
                      <div>已咨询 {doctor.consultCount.toLocaleString()} 次</div>
                    </div>
                  </div>

                  {/* 右侧箭头 */}
                  <ChevronRight 
                    className="flex-shrink-0 group-hover:translate-x-1 transition-all" 
                    style={{ width: "20px", height: "20px", color: "#8A8A93" }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* 底部提示 */}
          <div style={{ marginTop: "24px", textAlign: "center", fontSize: "13px", color: "#8A8A93" }}>
            <p>AI医生分身基于真实医生的专业知识训练</p>
            <p style={{ marginTop: "4px" }}>提供初步健康建议，不替代实际就诊</p>
          </div>
        </div>
      </div>
    </div>
  );
}