import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, User, Target, Shield, ChevronRight, Edit, X, Save, LogOut, FileText, Eye, Calendar, Ruler, TrendingDown, TrendingUp, Watch, ShoppingBag, MapPin } from "lucide-react";

interface UserInfo {
  name: string;
  nickname: string;
  gender: "男" | "女";
  age: number;
  height: number;
  currentWeight: number;
  yesterdayWeight: number;
  targetWeight: number;
  startWeight: number;
  startDate: string;
  targetDate: string;
}

type EditField = "name" | "nickname" | "gender" | "age" | "height" | "target" | null;

export default function Profile() {
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingField, setEditingField] = useState<EditField>(null);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [privacyContent, setPrivacyContent] = useState<"auth" | "data" | "privacy" | "agreement" | null>(null);

  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "张小明",
    nickname: "小明",
    gender: "男",
    age: 32,
    height: 175,
    currentWeight: 73.5,
    yesterdayWeight: 74.0,
    targetWeight: 65,
    startWeight: 82,
    startDate: "2025-12-01",
    targetDate: "2026-05-26"
  });

  const [tempValue, setTempValue] = useState("");

  const openEditModal = (field: EditField) => {
    setEditingField(field);
    setShowEditModal(true);
    
    switch(field) {
      case "name":
        setTempValue(userInfo.name);
        break;
      case "nickname":
        setTempValue(userInfo.nickname);
        break;
      case "gender":
        setTempValue(userInfo.gender);
        break;
      case "age":
        setTempValue(userInfo.age.toString());
        break;
      case "height":
        setTempValue(userInfo.height.toString());
        break;
      case "target":
        setTempValue(userInfo.targetWeight.toString());
        break;
    }
  };

  const saveEdit = () => {
    if (!tempValue.trim()) return;

    const newInfo = { ...userInfo };
    
    switch(editingField) {
      case "name":
        newInfo.name = tempValue;
        break;
      case "nickname":
        newInfo.nickname = tempValue;
        break;
      case "gender":
        newInfo.gender = tempValue as "男" | "女";
        break;
      case "age":
        newInfo.age = parseInt(tempValue);
        break;
      case "height":
        newInfo.height = parseInt(tempValue);
        break;
      case "target":
        newInfo.targetWeight = parseFloat(tempValue);
        break;
    }
    
    setUserInfo(newInfo);
    setShowEditModal(false);
    setTempValue("");
  };

  const calculateProgress = () => {
    const totalLoss = userInfo.startWeight - userInfo.targetWeight;
    const currentLoss = userInfo.startWeight - userInfo.currentWeight;
    return Math.round((currentLoss / totalLoss) * 100);
  };

  const progress = calculateProgress();

  const openPrivacyModal = (type: "auth" | "data" | "privacy" | "agreement") => {
    setPrivacyContent(type);
    setShowPrivacyModal(true);
  };

  const getEditTitle = () => {
    switch(editingField) {
      case "name": return "编辑姓名";
      case "nickname": return "编辑昵称";
      case "gender": return "选择性别";
      case "age": return "编辑年龄";
      case "height": return "编辑身高";
      case "target": return "调整目标体重";
      default: return "编辑";
    }
  };

  const getPrivacyTitle = () => {
    switch(privacyContent) {
      case "auth": return "授权管理";
      case "data": return "数据使用说明";
      case "privacy": return "隐私设置";
      case "agreement": return "用户协议";
      default: return "";
    }
  };

  return (
    <div 
      className="min-h-screen pb-20"
      style={{
        background: "linear-gradient(180deg, #FFF5F8 0%, #F5F3FF 100%)",
        backgroundColor: "#FAFAFF"
      }}
    >
      {/* 顶部导航 */}
      <div 
        className="px-4 py-3 flex items-center justify-between sticky top-0 z-10"
        style={{
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #EAEBFF",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.02)"
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg transition-colors"
          style={{ color: "#1A1A1A" }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#EAEBFF"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 style={{ fontSize: "16px", fontWeight: 600, color: "#1A1A1A" }}>个人中心</h1>
        <div style={{ width: "36px" }} />
      </div>

      <div className="max-w-4xl mx-auto p-4" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* 个人信息卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: "linear-gradient(135deg, #2B5BFF 0%, #6B8FFF 100%)",
            borderRadius: "24px",
            padding: "24px",
            color: "#FFFFFF",
            boxShadow: "0 4px 20px rgba(43, 91, 255, 0.2)"
          }}
        >
          <div className="flex items-center gap-4" style={{ marginBottom: "16px" }}>
            <div 
              className="flex items-center justify-center"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                fontSize: "32px",
                fontWeight: 600
              }}
            >
              {userInfo.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h2 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "4px", color: "#FFFFFF" }}>{userInfo.name}</h2>
              <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.9)" }}>
                {userInfo.gender} · {userInfo.age}岁 · {userInfo.height}cm
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div 
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(10px)",
                borderRadius: "16px",
                padding: "12px"
              }}
            >
              <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.8)", marginBottom: "4px" }}>当前体重</div>
              <div className="flex items-baseline gap-2">
                <span style={{ fontSize: "18px", fontWeight: 700 }}>{userInfo.currentWeight} kg</span>
                {(() => {
                  const diff = userInfo.currentWeight - userInfo.yesterdayWeight;
                  const isDecrease = diff < 0;
                  const Icon = isDecrease ? TrendingDown : TrendingUp;
                  return (
                    <div 
                      className="flex items-center gap-1"
                      style={{
                        fontSize: "11px",
                        color: isDecrease ? "rgba(76, 175, 80, 1)" : "rgba(255, 152, 0, 1)",
                        backgroundColor: isDecrease ? "rgba(76, 175, 80, 0.15)" : "rgba(255, 152, 0, 0.15)",
                        padding: "2px 6px",
                        borderRadius: "4px"
                      }}
                    >
                      <Icon style={{ width: "12px", height: "12px" }} />
                      <span style={{ fontWeight: 600 }}>{Math.abs(diff).toFixed(1)}</span>
                    </div>
                  );
                })()}
              </div>
            </div>
            <div 
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(10px)",
                borderRadius: "16px",
                padding: "12px"
              }}
            >
              <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.8)", marginBottom: "4px" }}>目标体重</div>
              <div style={{ fontSize: "18px", fontWeight: 700 }}>{userInfo.targetWeight} kg</div>
            </div>
          </div>
        </motion.div>

        {/* 快捷入口 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "24px",
            padding: "24px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.5)"
          }}
        >
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => navigate("/profile/devices")}
              className="flex flex-col items-center gap-3 transition-all"
              style={{
                padding: "16px",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#FAFAFF";
                e.currentTarget.style.borderRadius = "16px";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: "56px",
                  height: "56px",
                  backgroundColor: "#EAEBFF",
                  borderRadius: "16px"
                }}
              >
                <Watch className="w-6 h-6" style={{ color: "#2B5BFF" }} />
              </div>
              <span style={{ fontSize: "14px", fontWeight: 500, color: "#1A1A1A" }}>智能设备</span>
            </button>

            <button
              onClick={() => navigate("/profile/orders")}
              className="flex flex-col items-center gap-3 transition-all"
              style={{
                padding: "16px",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#FAFAFF";
                e.currentTarget.style.borderRadius = "16px";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: "56px",
                  height: "56px",
                  backgroundColor: "#EAEBFF",
                  borderRadius: "16px"
                }}
              >
                <ShoppingBag className="w-6 h-6" style={{ color: "#2B5BFF" }} />
              </div>
              <span style={{ fontSize: "14px", fontWeight: 500, color: "#1A1A1A" }}>我的订单</span>
            </button>

            <button
              onClick={() => navigate("/profile/addresses")}
              className="flex flex-col items-center gap-3 transition-all"
              style={{
                padding: "16px",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#FAFAFF";
                e.currentTarget.style.borderRadius = "16px";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: "56px",
                  height: "56px",
                  backgroundColor: "#EAEBFF",
                  borderRadius: "16px"
                }}
              >
                <MapPin className="w-6 h-6" style={{ color: "#2B5BFF" }} />
              </div>
              <span style={{ fontSize: "14px", fontWeight: 500, color: "#1A1A1A" }}>我的地址</span>
            </button>
          </div>
        </motion.div>

        {/* 个人信息 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "24px",
            padding: "24px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.5)"
          }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: "16px" }}>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" style={{ color: "#2B5BFF" }} />
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1A1A1A" }}>个人信息</h3>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              { label: "姓名", value: userInfo.name, field: "name" as EditField, icon: User },
              { label: "昵称", value: userInfo.nickname, field: "nickname" as EditField, icon: Edit },
              { label: "性别", value: userInfo.gender, field: "gender" as EditField, icon: User },
              { label: "年龄", value: `${userInfo.age}岁`, field: "age" as EditField, icon: Calendar },
              { label: "身高", value: `${userInfo.height} cm`, field: "height" as EditField, icon: Ruler },
            ].map((item, index) => (
              <button
                key={index}
                onClick={() => openEditModal(item.field)}
                className="w-full flex items-center justify-between p-3 rounded-lg transition-colors"
                style={{ backgroundColor: "transparent", cursor: "pointer", border: "none" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#FAFAFF"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="flex items-center justify-center"
                    style={{
                      width: "32px",
                      height: "32px",
                      backgroundColor: "#EAEBFF",
                      borderRadius: "12px"
                    }}
                  >
                    <item.icon className="w-4 h-4" style={{ color: "#2B5BFF" }} />
                  </div>
                  <span style={{ fontSize: "14px", color: "#8A8A93" }}>{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: "14px", fontWeight: 500, color: "#1A1A1A" }}>{item.value}</span>
                  <ChevronRight className="w-4 h-4" style={{ color: "#8A8A93" }} />
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* 目标管理 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "24px",
            padding: "24px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.5)"
          }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: "16px" }}>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5" style={{ color: "#2B5BFF" }} />
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1A1A1A" }}>目标管理</h3>
            </div>
            <button 
              onClick={() => openEditModal("target")}
              className="transition-colors"
              style={{ 
                fontSize: "14px", 
                fontWeight: 500,
                color: "#2B5BFF",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = "0.8"}
              onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
            >
              调整目标
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div 
              style={{
                padding: "16px",
                background: "linear-gradient(135deg, #EAEBFF 0%, #F5F3FF 100%)",
                border: "1px solid rgba(43, 91, 255, 0.1)",
                borderRadius: "16px"
              }}
            >
              <div className="grid grid-cols-3 gap-3" style={{ marginBottom: "12px" }}>
                <div>
                  <div style={{ fontSize: "12px", color: "#8A8A93", marginBottom: "4px" }}>起始体重</div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: "#1A1A1A" }}>{userInfo.startWeight} kg</div>
                </div>
                <div>
                  <div style={{ fontSize: "12px", color: "#8A8A93", marginBottom: "4px" }}>当前体重</div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: "#2B5BFF" }}>{userInfo.currentWeight} kg</div>
                </div>
                <div>
                  <div style={{ fontSize: "12px", color: "#8A8A93", marginBottom: "4px" }}>目标体重</div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: "#6B8FFF" }}>{userInfo.targetWeight} kg</div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px" }}>
                <div className="flex justify-between">
                  <span style={{ color: "#8A8A93" }}>已减重</span>
                  <span style={{ fontWeight: 600, color: "#4CAF50" }}>
                    {(userInfo.startWeight - userInfo.currentWeight).toFixed(1)} kg
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#8A8A93" }}>距离目标</span>
                  <span style={{ fontWeight: 600, color: "#FF9800" }}>
                    {(userInfo.currentWeight - userInfo.targetWeight).toFixed(1)} kg
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#8A8A93" }}>预计完成</span>
                  <span style={{ fontWeight: 600, color: "#1A1A1A" }}>{userInfo.targetDate}</span>
                </div>
              </div>
            </div>

            <div 
              style={{
                padding: "16px",
                backgroundColor: "#FAFAFF",
                borderRadius: "16px",
                border: "1px solid #EAEBFF"
              }}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: "8px" }}>
                <span style={{ fontSize: "14px", color: "#8A8A93" }}>完成进度</span>
                <span style={{ fontSize: "18px", fontWeight: 700, color: "#2B5BFF" }}>{progress}%</span>
              </div>
              <div 
                className="overflow-hidden"
                style={{
                  height: "12px",
                  backgroundColor: "#EAEBFF",
                  borderRadius: "16px"
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full"
                  style={{
                    background: "linear-gradient(90deg, #2B5BFF 0%, #6B8FFF 100%)",
                    borderRadius: "16px"
                  }}
                />
              </div>
              <div style={{ fontSize: "12px", color: "#8A8A93", marginTop: "8px" }}>
                加油！还有 {100 - progress}% 就达成目标了
              </div>
            </div>
          </div>
        </motion.div>

        {/* 账号与隐私 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "24px",
            padding: "24px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.5)"
          }}
        >
          <div className="flex items-center gap-2" style={{ marginBottom: "16px" }}>
            <Shield className="w-5 h-5" style={{ color: "#2B5BFF" }} />
            <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1A1A1A" }}>账号与隐私</h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              { label: "授权管理", action: "管理", icon: FileText, type: "auth" as const },
              { label: "数据使用说明", action: "查看", icon: FileText, type: "data" as const },
              { label: "隐私设置", action: "设置", icon: Eye, type: "privacy" as const },
              { label: "用户协议", action: "查看", icon: FileText, type: "agreement" as const },
            ].map((item, index) => (
              <button
                key={index}
                onClick={() => openPrivacyModal(item.type)}
                className="w-full flex items-center justify-between p-3 rounded-lg transition-colors"
                style={{ backgroundColor: "transparent" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#FAFAFF"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="flex items-center justify-center"
                    style={{
                      width: "32px",
                      height: "32px",
                      backgroundColor: "#EAEBFF",
                      borderRadius: "12px"
                    }}
                  >
                    <item.icon className="w-4 h-4" style={{ color: "#2B5BFF" }} />
                  </div>
                  <span style={{ fontSize: "14px", color: "#1A1A1A" }}>{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: "14px", color: "#8A8A93" }}>{item.action}</span>
                  <ChevronRight className="w-4 h-4" style={{ color: "#8A8A93" }} />
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* 退出登录 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button 
            className="w-full flex items-center justify-center gap-2 font-medium transition-all"
            style={{
              padding: "12px",
              backgroundColor: "#FFFFFF",
              border: "2px solid #FFE5E5",
              color: "#FF4444",
              borderRadius: "16px",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#FFE5E5";
              e.currentTarget.style.borderColor = "#FF4444";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#FFFFFF";
              e.currentTarget.style.borderColor = "#FFE5E5";
            }}
          >
            <LogOut className="w-5 h-5" />
            退出登录
          </button>
        </motion.div>
      </div>

      {/* 编辑弹窗 */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-sm w-full"
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "24px",
                padding: "24px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.5)"
              }}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: "24px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#1A1A1A" }}>{getEditTitle()}</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: "#8A8A93" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#EAEBFF"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {editingField === "gender" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
                  {["男", "女"].map((gender) => (
                    <button
                      key={gender}
                      onClick={() => setTempValue(gender)}
                      className="w-full p-4 transition-all"
                      style={{
                        borderRadius: "16px",
                        border: tempValue === gender ? "2px solid #2B5BFF" : "1px solid #EAEBFF",
                        backgroundColor: tempValue === gender ? "#EAEBFF" : "transparent"
                      }}
                    >
                      <span style={{ fontSize: "14px", fontWeight: 500, color: "#1A1A1A" }}>{gender}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div style={{ marginBottom: "24px" }}>
                  <input
                    type={editingField === "age" || editingField === "height" || editingField === "target" ? "number" : "text"}
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    placeholder={`请输入${getEditTitle().replace("编辑", "").replace("调整", "")}`}
                    className="w-full transition-all"
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
                    autoFocus
                  />
                  {editingField === "target" && (
                    <p style={{ fontSize: "12px", color: "#8A8A93", marginTop: "8px" }}>
                      建议：根据健康标准，您的理想体重范围是 60-75 kg
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 font-medium transition-all"
                  style={{
                    padding: "12px",
                    border: "1px solid #EAEBFF",
                    borderRadius: "16px",
                    color: "#1A1A1A",
                    backgroundColor: "transparent",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#FAFAFF"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  取消
                </button>
                <button
                  onClick={saveEdit}
                  className="flex-1 font-medium transition-all flex items-center justify-center gap-2"
                  style={{
                    padding: "12px",
                    background: "linear-gradient(135deg, #2B5BFF 0%, #6B8FFF 100%)",
                    color: "#FFFFFF",
                    borderRadius: "16px",
                    border: "none",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(43, 91, 255, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <Save className="w-5 h-5" />
                  保存
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 隐私详情弹窗 */}
      <AnimatePresence>
        {showPrivacyModal && privacyContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            onClick={() => setShowPrivacyModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full overflow-y-auto"
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "24px",
                padding: "24px",
                maxHeight: "80vh",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.5)"
              }}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: "24px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#1A1A1A" }}>{getPrivacyTitle()}</h3>
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: "#8A8A93" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#EAEBFF"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "14px", color: "#8A8A93" }}>
                {privacyContent === "auth" && (
                  <>
                    <div>
                      <h4 style={{ fontWeight: 600, color: "#1A1A1A", marginBottom: "8px" }}>已授权的服务</h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {["微信登录", "健康数据读取", "通知推送"].map((item, i) => (
                          <div 
                            key={i} 
                            className="flex items-center justify-between p-3"
                            style={{
                              backgroundColor: "#FAFAFF",
                              borderRadius: "16px",
                              border: "1px solid #EAEBFF"
                            }}
                          >
                            <span style={{ color: "#1A1A1A" }}>{item}</span>
                            <button 
                              className="transition-colors"
                              style={{ 
                                fontSize: "12px", 
                                color: "#2B5BFF",
                                backgroundColor: "transparent",
                                border: "none",
                                cursor: "pointer"
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.opacity = "0.7"}
                              onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                            >
                              取消授权
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: "12px", color: "#8A8A93" }}>
                      您可以随时取消授权。取消后，相关功能可能无法正常使用。
                    </p>
                  </>
                )}

                {privacyContent === "data" && (
                  <>
                    <div>
                      <h4 style={{ fontWeight: 600, color: "#1A1A1A", marginBottom: "8px" }}>数据收集说明</h4>
                      <p style={{ marginBottom: "12px" }}>我们会收集以下类型的数据以提供更好的服务：</p>
                      <ul className="list-disc list-inside space-y-2 ml-2">
                        <li>基本信息：姓名、性别、年龄、身高等</li>
                        <li>健康数据：体重、血压、血糖、腰围等</li>
                        <li>行为数据：打卡记录、饮食记录、运动记录</li>
                        <li>使用数据：页面访问、功能使用情况</li>
                      </ul>
                    </div>
                    <div>
                      <h4 style={{ fontWeight: 600, color: "#1A1A1A", marginBottom: "8px" }}>数据使用说明</h4>
                      <ul className="list-disc list-inside space-y-2 ml-2">
                        <li>用于个性化健康管理方案制定</li>
                        <li>用于数据分析和趋势预测</li>
                        <li>用于改进产品功能和用户体验</li>
                        <li>不会向第三方出售或共享您的个人数据</li>
                      </ul>
                    </div>
                  </>
                )}

                {privacyContent === "privacy" && (
                  <>
                    <div>
                      <h4 style={{ fontWeight: 600, color: "#1A1A1A", marginBottom: "8px" }}>隐私设置</h4>
                      <p style={{ fontSize: "12px", color: "#8A8A93", marginBottom: "12px" }}>
                        修改隐私设置可能影响部分功能的使用体验。
                      </p>
                    </div>
                  </>
                )}

                {privacyContent === "agreement" && (
                  <>
                    <div>
                      <h4 style={{ fontWeight: 600, color: "#1A1A1A", marginBottom: "8px" }}>用户协议</h4>
                      <p style={{ marginBottom: "12px" }}>更新日期：2026年2月27日</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div>
                          <h5 style={{ fontSize: "14px", fontWeight: 500, color: "#1A1A1A", marginBottom: "4px" }}>1. 服务说明</h5>
                          <p>本应用提供健康管理、智能导诊、医生问诊等服务。使用本服务即表示您同意遵守本协议。</p>
                        </div>
                        <div>
                          <h5 style={{ fontSize: "14px", fontWeight: 500, color: "#1A1A1A", marginBottom: "4px" }}>2. 用户责任</h5>
                          <p>用户应确保提供的健康信息真实准确。本应用不对用户自主决策的健康行为负责。</p>
                        </div>
                        <div>
                          <h5 style={{ fontSize: "14px", fontWeight: 500, color: "#1A1A1A", marginBottom: "4px" }}>3. 免责声明</h5>
                          <p>本应用提供的建议仅供参考，不能替代专业医疗意见。如有严重健康问题，请及时就医。</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={() => setShowPrivacyModal(false)}
                className="w-full font-medium transition-all"
                style={{
                  marginTop: "24px",
                  padding: "12px",
                  background: "linear-gradient(135deg, #2B5BFF 0%, #6B8FFF 100%)",
                  color: "#FFFFFF",
                  borderRadius: "16px",
                  border: "none",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(43, 91, 255, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                我知道了
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
