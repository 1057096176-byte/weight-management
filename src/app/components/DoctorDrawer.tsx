import { useState } from "react";
import { useNavigate } from "react-router";
import { X, QrCode } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DoctorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DoctorDrawer({ isOpen, onClose }: DoctorDrawerProps) {
  const navigate = useNavigate();
  const [selectedDoctorQR, setSelectedDoctorQR] = useState<string | null>(null);

  const doctors = [
    {
      id: "1",
      name: "李明",
      title: "主任医师",
      specialty: "内分泌科专家",
      expertise: "肥胖症、代谢综合征、糖尿病、甲状腺疾病",
      avatar: "👨‍⚕️",
    },
    {
      id: "2",
      name: "王芳",
      title: "副主任医师",
      specialty: "营养科专家",
      expertise: "营养评估、膳食方案、减重营养指导",
      avatar: "👩‍⚕️",
    },
    {
      id: "3",
      name: "张强",
      title: "主治医师",
      specialty: "运动医学专家",
      expertise: "运动处方、康复训练、运动损伤防护",
      avatar: "👨‍⚕️",
    },
    {
      id: "4",
      name: "刘敏",
      title: "主任医师",
      specialty: "心理健康专家",
      expertise: "饮食行为、情绪管理、心理健康咨询",
      avatar: "👩‍⚕️",
    },
  ];

  const handleDoctorClick = (doctorId: string) => {
    navigate(`/doctor/${doctorId}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              zIndex: 40,
            }}
          />

          {/* 抽屉内容 */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              maxHeight: "85vh",
              backgroundColor: "#FFFFFF",
              borderTopLeftRadius: "24px",
              borderTopRightRadius: "24px",
              zIndex: 50,
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 -4px 32px rgba(0, 0, 0, 0.12)",
            }}
          >
            {/* 顶部拖动条 */}
            <div
              style={{
                padding: "12px 0 8px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "4px",
                  backgroundColor: "#E0E0E0",
                  borderRadius: "2px",
                }}
              />
            </div>

            {/* 标题栏 */}
            <div
              style={{
                padding: "0 16px 16px",
                borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
              }}
            >
              <div className="flex items-center justify-between">
                <h2
                  style={{
                    fontSize: "17px",
                    fontWeight: 600,
                    color: "#1A1A1A",
                  }}
                >
                  医生分身
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  style={{ borderRadius: "8px" }}
                >
                  <X className="w-5 h-5" style={{ color: "#8A8A93" }} />
                </button>
              </div>
            </div>

            {/* 滚动内容区域 */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "16px",
              }}
            >
              {/* 医生列表 */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: "12px" }}
              >
                {doctors.map((doctor, index) => (
                  <motion.div
                    key={doctor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    onClick={() => handleDoctorClick(doctor.id)}
                    className="cursor-pointer group"
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "16px",
                      padding: "12px",
                      border: "1px solid rgba(0, 0, 0, 0.05)",
                      boxShadow: "0 2px 12px rgba(0, 0, 0, 0.04)",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 4px 20px rgba(43, 91, 255, 0.12)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 2px 12px rgba(0, 0, 0, 0.04)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <div className="flex items-start gap-3">
                      {/* 医生头像 */}
                      <div
                        className="flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform"
                        style={{
                          width: "56px",
                          height: "56px",
                          borderRadius: "12px",
                          background:
                            "linear-gradient(135deg, #EAEBFF 0%, #FFFFFF 100%)",
                        }}
                      >
                        {doctor.avatar}
                      </div>

                      {/* 医生信息 */}
                      <div className="flex-1 min-w-0">
                        <div
                          className="flex items-center gap-2"
                          style={{ marginBottom: "4px" }}
                        >
                          <h3
                            style={{
                              fontSize: "15px",
                              fontWeight: 600,
                              color: "#1A1A1A",
                            }}
                          >
                            {doctor.name} {doctor.title}
                          </h3>
                        </div>
                        <p
                          style={{
                            fontSize: "13px",
                            fontWeight: 500,
                            color: "#2B5BFF",
                            marginBottom: "4px",
                          }}
                        >
                          {doctor.specialty}
                        </p>
                        <p
                          style={{
                            fontSize: "12px",
                            color: "#8A8A93",
                            lineHeight: "16px",
                          }}
                          className="line-clamp-2"
                        >
                          擅长：{doctor.expertise}
                        </p>
                      </div>

                      {/* 右侧箭头 */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDoctorQR(doctor.id);
                        }}
                        className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        style={{ borderRadius: "8px" }}
                      >
                        <QrCode
                          style={{
                            width: "18px",
                            height: "18px",
                            color: "#2B5BFF",
                          }}
                        />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* 底部提示 */}
              <div
                style={{
                  marginTop: "16px",
                  textAlign: "center",
                  fontSize: "12px",
                  color: "#8A8A93",
                  paddingBottom: "8px",
                }}
              >
                <p>AI医生分身基于真实医生的专业知识训练</p>
                <p style={{ marginTop: "4px" }}>
                  提供初步健康建议，不替代实际就诊
                </p>
              </div>
            </div>
          </motion.div>

          {/* 二维码大图弹窗 */}
          <AnimatePresence>
            {selectedDoctorQR && (
              <>
                {/* 二维码背景遮罩 */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedDoctorQR(null)}
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    zIndex: 60,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "16px",
                  }}
                >
                  {/* 二维码卡片 */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "24px",
                      padding: "24px",
                      maxWidth: "360px",
                      width: "100%",
                      boxShadow: "0 8px 40px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    {/* 关闭按钮 */}
                    <div className="flex justify-end mb-3">
                      <button
                        onClick={() => setSelectedDoctorQR(null)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        style={{ borderRadius: "8px" }}
                      >
                        <X className="w-5 h-5" style={{ color: "#8A8A93" }} />
                      </button>
                    </div>

                    {/* 医生信息 */}
                    {doctors
                      .filter((d) => d.id === selectedDoctorQR)
                      .map((doctor) => (
                        <div key={doctor.id} className="text-center">
                          <div
                            className="text-4xl mb-3 mx-auto"
                            style={{
                              width: "64px",
                              height: "64px",
                              borderRadius: "16px",
                              background:
                                "linear-gradient(135deg, #EAEBFF 0%, #FFFFFF 100%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {doctor.avatar}
                          </div>
                          <h3
                            style={{
                              fontSize: "17px",
                              fontWeight: 600,
                              color: "#1A1A1A",
                              marginBottom: "4px",
                            }}
                          >
                            {doctor.name} {doctor.title}
                          </h3>
                          <p
                            style={{
                              fontSize: "14px",
                              color: "#2B5BFF",
                              marginBottom: "20px",
                            }}
                          >
                            {doctor.specialty}
                          </p>

                          {/* 二维码图片占位 */}
                          <div
                            style={{
                              width: "100%",
                              aspectRatio: "1",
                              backgroundColor: "#F5F5F5",
                              borderRadius: "16px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginBottom: "16px",
                              border: "1px solid rgba(0, 0, 0, 0.05)",
                            }}
                          >
                            <div className="text-center">
                              <QrCode
                                className="mx-auto mb-2"
                                style={{
                                  width: "80px",
                                  height: "80px",
                                  color: "#2B5BFF",
                                }}
                              />
                              <p
                                style={{
                                  fontSize: "13px",
                                  color: "#8A8A93",
                                }}
                              >
                                扫码咨询医生分身
                              </p>
                            </div>
                          </div>

                          <p
                            style={{
                              fontSize: "12px",
                              color: "#8A8A93",
                              lineHeight: "18px",
                            }}
                          >
                            长按保存二维码，微信扫码即可开始咨询
                          </p>
                        </div>
                      ))}
                  </motion.div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}