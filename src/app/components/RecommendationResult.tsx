import { Link } from "react-router";
import { Users, Stethoscope, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

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

interface RecommendationResultProps {
  onDoctorClick?: (doctorId: string) => void;
  departments?: Department[];
  doctors?: Doctor[];
}

export function RecommendationResult({ 
  onDoctorClick,
  departments: customDepartments,
  doctors: customDoctors 
}: RecommendationResultProps) {
  // 默认科室数据
  const defaultDepartments: Department[] = [
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

  // 默认医生数据
  const defaultDoctors: Doctor[] = [
    {
      id: "1",
      name: "李明医生",
      avatar: "👨‍⚕️",
      title: "主任医师",
      specialty: "内分泌科专家，20年体重管理经验",
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
      specialty: "营养科专家，专注女性体重管理",
      expertise: "营养评估、饮食计划、孕期体重管理",
      served: "12,356",
      rating: "4.8",
      gradient: "from-purple-400 to-pink-400",
      bgGradient: "from-purple-50 to-pink-50",
      borderColor: "border-purple-100",
    },
  ];

  const departments = customDepartments || defaultDepartments;
  const doctors = customDoctors || defaultDoctors;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* 一整个模块化展示：推荐科室与医生分身 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md"
      >
        {/* 评估完成提示 - icon+一句话 */}
        <div className="flex items-center gap-2 mb-6 pb-6 border-b border-gray-200">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="text-gray-700 font-medium">已为您完成评估分析，以下是推荐的科室和医生</span>
        </div>

        {/* 第一块：推荐科室与病种文本内容 */}
        <div className="mb-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">推荐科室与病种</h3>
              <p className="text-sm text-gray-600">根据您的情况分析如下</p>
            </div>
          </div>

          {/* 文本内容展示 */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 space-y-4">
            {departments.map((dept, index) => (
              <div key={index} className={index > 0 ? "pt-3 border-t border-blue-100" : ""}>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span className={`w-6 h-6 ${dept.type === "primary" ? "bg-blue-500" : "bg-purple-500"} text-white rounded-full flex items-center justify-center text-xs`}>
                    {index + 1}
                  </span>
                  {dept.type === "primary" ? "推荐科室" : "备选科室"}：{dept.name}
                  <span className={`ml-auto px-2 py-0.5 ${dept.type === "primary" ? "bg-blue-500" : "bg-purple-500"} text-white text-xs font-medium rounded-full`}>
                    匹配度 {dept.matchRate}%
                  </span>
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed pl-8">
                  {dept.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-2 pl-8">
                  {dept.tags.map((tag, tagIndex) => (
                    <span 
                      key={tagIndex}
                      className={`px-2.5 py-1 bg-white text-gray-700 text-xs rounded-lg border ${dept.type === "primary" ? "border-blue-200" : "border-purple-200"}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 分隔线 */}
        <div className="border-t border-gray-200 my-6"></div>

        {/* 第二块：医生分身卡片 */}
        <div>
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">推荐医生分身</h3>
              <p className="text-sm text-gray-600">为您匹配的专业医生，可立即开始问诊</p>
            </div>
          </div>

          {/* 医生卡片列表 */}
          <div className="space-y-3">
            {doctors.map((doctor, index) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <Link
                  to={`/doctor/${doctor.id}`}
                  onClick={() => onDoctorClick?.(doctor.id)}
                  className={`block bg-gradient-to-r ${doctor.bgGradient} rounded-xl p-4 border ${doctor.borderColor} hover:shadow-lg transition-all duration-200 group`}
                >
                  <div className="flex items-start gap-4">
                    {/* 医生头像 */}
                    <div
                      className={`w-16 h-16 rounded-xl bg-gradient-to-br ${doctor.gradient} flex items-center justify-center text-2xl flex-shrink-0 shadow-md group-hover:scale-105 transition-transform`}
                    >
                      {doctor.avatar}
                    </div>

                    {/* 医生信息 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{doctor.name}</h4>
                        <span className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium rounded">
                          {doctor.title}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2 font-medium">
                        {doctor.specialty}
                      </p>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                        <span className="font-medium">擅长：</span>
                        {doctor.expertise}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          💬 已服务 {doctor.served} 人
                        </span>
                        <span className="flex items-center gap-1">
                          ⭐ {doctor.rating} 分
                        </span>
                      </div>
                    </div>

                    {/* 箭头指示 */}
                    <div className="flex-shrink-0 self-center">
                      <svg
                        className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 底部提示信息 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-5 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100"
        >
          <p className="text-sm text-blue-800 flex items-start gap-2">
            <span className="text-base">💡</span>
            <span>
              <span className="font-medium">温馨提示：</span>
              点击医生卡片即可开始一对一问诊，医生分身将根据您的情况提供个性化建议。返回此页面后，您的导诊记录和推荐结果仍会保留。
            </span>
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}