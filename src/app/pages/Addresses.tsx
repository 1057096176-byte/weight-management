import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, MapPin, Plus, Trash2, CheckCircle, User, Phone, X, ChevronDown, Search } from "lucide-react";

interface Address {
  id: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  isDefault: boolean;
}

// 省市区数据
const regionData: { [key: string]: { [key: string]: string[] } } = {
  "广东省": {
    "广州市": ["天河区", "越秀区", "海珠区", "荔湾区", "白云区", "黄埔区", "番禺区", "花都区", "南沙区", "从化区", "增城区"],
    "深圳市": ["福田区", "罗湖区", "南山区", "宝安区", "龙岗区", "盐田区", "龙华区", "坪山区", "光明区", "大鹏新区"],
    "珠海市": ["香洲区", "斗门区", "金湾区"],
    "东莞市": ["东莞市区"],
    "佛山市": ["禅城区", "南海区", "顺德区", "三水区", "高明区"]
  },
  "北京市": {
    "北京市": ["东城区", "西城区", "朝阳区", "丰台区", "石景山区", "海淀区", "门头沟区", "房山区", "通州区", "顺义区", "昌平���", "大兴区", "怀柔区", "平谷区", "密云区", "延庆区"]
  },
  "上海市": {
    "上海市": ["黄浦区", "徐汇区", "长宁区", "静安区", "普陀区", "虹口区", "杨浦区", "闵行区", "宝山区", "嘉定区", "浦东新区", "金山区", "松江区", "青浦区", "奉贤区", "崇明区"]
  },
  "浙江省": {
    "杭州市": ["上城区", "下城区", "江干区", "拱墅区", "西湖区", "滨江区", "萧山区", "余杭区", "富阳区", "临安区"],
    "宁波市": ["海曙区", "江北区", "北仑区", "镇海区", "鄞州区", "奉化区"],
    "温州市": ["鹿城区", "龙湾区", "瓯海区", "洞头区"]
  },
  "江苏省": {
    "南京市": ["玄武区", "秦淮区", "建邺区", "鼓楼区", "浦口区", "栖霞区", "雨花台区", "江宁区", "六合区", "溧水区", "高淳区"],
    "苏州市": ["姑苏区", "虎丘区", "吴中区", "相城区", "吴江区"],
    "无锡市": ["梁溪区", "滨湖区", "惠山区", "锡山区", "新吴区"]
  }
};

const provinces = Object.keys(regionData);

export default function Addresses() {
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      name: "张小明",
      phone: "13800138000",
      province: "广东省",
      city: "广州市",
      district: "天河区",
      detail: "天河路123号",
      isDefault: true
    },
    {
      id: "2",
      name: "李华",
      phone: "13900139000",
      province: "广东省",
      city: "深圳市",
      district: "南山区",
      detail: "科技园456号",
      isDefault: false
    }
  ]);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [currentAddress, setCurrentAddress] = useState({
    name: "",
    phone: "",
    province: "",
    city: "",
    district: "",
    detail: ""
  });
  const [setAsDefault, setSetAsDefault] = useState(false);

  // 下拉框状态
  const [openDropdown, setOpenDropdown] = useState<"province" | "city" | "district" | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");

  // 获取可用的市
  const getCities = () => {
    if (!currentAddress.province) return [];
    return Object.keys(regionData[currentAddress.province] || {});
  };

  // 获取可用的区
  const getDistricts = () => {
    if (!currentAddress.province || !currentAddress.city) return [];
    return regionData[currentAddress.province]?.[currentAddress.city] || [];
  };

  // 搜索过滤
  const filterOptions = (options: string[]) => {
    if (!searchKeyword) return options;
    return options.filter(opt => opt.toLowerCase().includes(searchKeyword.toLowerCase()));
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  const handleDelete = (id: string) => {
    if (confirm("确定要删除这个地址吗？")) {
      setAddresses(addresses.filter(addr => addr.id !== id));
    }
  };

  const handleAdd = () => {
    setCurrentAddress({
      name: "",
      phone: "",
      province: "",
      city: "",
      district: "",
      detail: ""
    });
    setSetAsDefault(false);
    setShowAddressForm(true);
  };

  const isAddressFormValid = () => {
    return (
      currentAddress.name.trim() !== "" &&
      currentAddress.phone.trim() !== "" &&
      currentAddress.province.trim() !== "" &&
      currentAddress.city.trim() !== "" &&
      currentAddress.district.trim() !== "" &&
      currentAddress.detail.trim() !== ""
    );
  };

  const handleSaveAddress = () => {
    if (!isAddressFormValid()) return;

    const newAddress: Address = {
      id: Date.now().toString(),
      ...currentAddress,
      isDefault: setAsDefault || addresses.length === 0
    };
    
    // 如果设为默认，需要将其他地址的isDefault设为false
    if (newAddress.isDefault) {
      setAddresses([...addresses.map(addr => ({ ...addr, isDefault: false })), newAddress]);
    } else {
      setAddresses([...addresses, newAddress]);
    }
    
    setShowAddressForm(false);
    setSetAsDefault(false);
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
        <h1 style={{ fontSize: "16px", fontWeight: 600, color: "#1A1A1A" }}>我的地址</h1>
        <button
          onClick={handleAdd}
          className="p-2 rounded-lg transition-colors"
          style={{ color: "#2B5BFF" }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#EAEBFF"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-4xl mx-auto p-4" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {addresses.map((address, index) => (
          <motion.div
            key={address.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "24px",
              padding: "20px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
              border: address.isDefault ? "2px solid #2B5BFF" : "1px solid rgba(255, 255, 255, 0.5)",
              position: "relative"
            }}
          >
            {/* 删除按钮 - 右上角 */}
            <button
              onClick={() => handleDelete(address.id)}
              className="transition-all flex items-center justify-center"
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                width: "32px",
                height: "32px",
                backgroundColor: "#FFE5E5",
                color: "#FF4444",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#FF4444";
                e.currentTarget.style.color = "#FFFFFF";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#FFE5E5";
                e.currentTarget.style.color = "#FF4444";
              }}
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="flex items-start justify-between" style={{ marginBottom: "12px", paddingRight: "40px" }}>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" style={{ color: "#2B5BFF" }} />
                <div>
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: "16px", fontWeight: 600, color: "#1A1A1A" }}>
                      {address.name}
                    </span>
                    <span style={{ fontSize: "14px", color: "#8A8A93" }}>{address.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            <p style={{ fontSize: "14px", color: "#8A8A93", marginBottom: "8px", lineHeight: "1.6" }}>
              {address.province} {address.city} {address.district} {address.detail}
            </p>

            {address.isDefault && (
              <div className="flex items-center gap-1" style={{ marginBottom: "16px" }}>
                <CheckCircle className="w-4 h-4" style={{ color: "#2B5BFF" }} />
                <span style={{ fontSize: "12px", fontWeight: 500, color: "#2B5BFF" }}>默认地址</span>
              </div>
            )}

            {!address.isDefault && (
              <div>
                <button
                  onClick={() => handleSetDefault(address.id)}
                  className="font-medium transition-all"
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#EAEBFF",
                    color: "#2B5BFF",
                    borderRadius: "12px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#2B5BFF";
                    e.currentTarget.style.color = "#FFFFFF";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#EAEBFF";
                    e.currentTarget.style.color = "#2B5BFF";
                  }}
                >
                  设为默认
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* 新增地址弹窗 */}
      <AnimatePresence>
        {showAddressForm && (
          <>
            {/* 背景遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowAddressForm(false);
                setOpenDropdown(null);
              }}
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 50
              }}
            />

            {/* 上滑弹窗 */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                maxHeight: "90vh",
                backgroundColor: "#FFFFFF",
                borderTopLeftRadius: "32px",
                borderTopRightRadius: "32px",
                boxShadow: "0 -8px 40px rgba(0, 0, 0, 0.12)",
                zIndex: 51,
                display: "flex",
                flexDirection: "column"
              }}
            >
              {/* 顶部标题栏 */}
              <div style={{
                padding: "24px 24px 16px",
                borderBottom: "1px solid #EAEBFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}>
                <h2 style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  fontSize: "18px",
                  color: "#1A1A1A",
                  margin: 0
                }}>
                  新增地址
                </h2>
                <button
                  onClick={() => {
                    setShowAddressForm(false);
                    setOpenDropdown(null);
                  }}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#EAEBFF",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(43, 91, 255, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#EAEBFF";
                  }}
                >
                  <X className="w-5 h-5" style={{ color: "#8A8A93" }} />
                </button>
              </div>

              {/* 内容区 - 可滚动 */}
              <div style={{
                flex: 1,
                overflowY: "auto",
                padding: "24px 24px 32px"
              }}>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px"
                }}>
                  {/* 收货人姓名 */}
                  <div>
                    <label style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 600,
                      fontSize: "14px",
                      color: "#1A1A1A",
                      marginBottom: "8px",
                      display: "block"
                    }}>
                      收货人姓名
                    </label>
                    <div style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center"
                    }}>
                      <User className="w-5 h-5" style={{
                        position: "absolute",
                        left: "16px",
                        color: "#8A8A93"
                      }} />
                      <input
                        type="text"
                        value={currentAddress.name}
                        onChange={(e) => setCurrentAddress({ ...currentAddress, name: e.target.value })}
                        placeholder="请输入收货人姓名"
                        style={{
                          width: "100%",
                          padding: "14px 16px 14px 48px",
                          border: "2px solid #EAEBFF",
                          borderRadius: "16px",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "15px",
                          color: "#1A1A1A",
                          outline: "none",
                          transition: "all 0.2s"
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#2B5BFF";
                          e.currentTarget.style.background = "rgba(43, 91, 255, 0.02)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "#EAEBFF";
                          e.currentTarget.style.background = "#FFFFFF";
                        }}
                      />
                    </div>
                  </div>

                  {/* 手机号码 */}
                  <div>
                    <label style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 600,
                      fontSize: "14px",
                      color: "#1A1A1A",
                      marginBottom: "8px",
                      display: "block"
                    }}>
                      手机号码
                    </label>
                    <div style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center"
                    }}>
                      <Phone className="w-5 h-5" style={{
                        position: "absolute",
                        left: "16px",
                        color: "#8A8A93"
                      }} />
                      <input
                        type="tel"
                        value={currentAddress.phone}
                        onChange={(e) => setCurrentAddress({ ...currentAddress, phone: e.target.value })}
                        placeholder="请输入手机号码"
                        style={{
                          width: "100%",
                          padding: "14px 16px 14px 48px",
                          border: "2px solid #EAEBFF",
                          borderRadius: "16px",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "15px",
                          color: "#1A1A1A",
                          outline: "none",
                          transition: "all 0.2s"
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#2B5BFF";
                          e.currentTarget.style.background = "rgba(43, 91, 255, 0.02)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "#EAEBFF";
                          e.currentTarget.style.background = "#FFFFFF";
                        }}
                      />
                    </div>
                  </div>

                  {/* 省市区 */}
                  <div>
                    <label style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 600,
                      fontSize: "14px",
                      color: "#1A1A1A",
                      marginBottom: "8px",
                      display: "block"
                    }}>
                      所在地区
                    </label>
                    <div style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px"
                    }}>
                      {/* 省份选择器 */}
                      <div style={{
                        position: "relative",
                        flex: "1 1 calc(33.333% - 6px)",
                        minWidth: "120px"
                      }}>
                        <button
                          type="button"
                          onClick={() => {
                            setOpenDropdown(openDropdown === "province" ? null : "province");
                            setSearchKeyword("");
                          }}
                          style={{
                            width: "100%",
                            padding: "14px 40px 14px 16px",
                            border: "2px solid #EAEBFF",
                            borderRadius: "16px",
                            fontFamily: "Inter, sans-serif",
                            fontSize: "15px",
                            color: currentAddress.province ? "#1A1A1A" : "#8A8A93",
                            outline: "none",
                            transition: "all 0.2s",
                            background: "#FFFFFF",
                            cursor: "pointer",
                            textAlign: "left"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#2B5BFF";
                            e.currentTarget.style.background = "rgba(43, 91, 255, 0.02)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "#EAEBFF";
                            e.currentTarget.style.background = "#FFFFFF";
                          }}
                        >
                          {currentAddress.province || "请选择省"}
                        </button>
                        <ChevronDown className="w-5 h-5" style={{
                          position: "absolute",
                          right: "16px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#8A8A93",
                          pointerEvents: "none"
                        }} />
                        {openDropdown === "province" && (
                          <div style={{
                            position: "absolute",
                            top: "calc(100% + 8px)",
                            left: 0,
                            right: 0,
                            backgroundColor: "#FFFFFF",
                            border: "2px solid #EAEBFF",
                            borderRadius: "16px",
                            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                            zIndex: 100,
                            overflow: "hidden"
                          }}>
                            <div style={{
                              padding: "12px",
                              borderBottom: "1px solid #EAEBFF"
                            }}>
                              <div style={{ position: "relative" }}>
                                <Search className="w-4 h-4" style={{
                                  position: "absolute",
                                  left: "12px",
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                  color: "#8A8A93",
                                  pointerEvents: "none"
                                }} />
                                <input
                                  type="text"
                                  value={searchKeyword}
                                  onChange={(e) => setSearchKeyword(e.target.value)}
                                  placeholder="搜索省份"
                                  onClick={(e) => e.stopPropagation()}
                                  style={{
                                    width: "100%",
                                    padding: "8px 12px 8px 36px",
                                    border: "1px solid #EAEBFF",
                                    borderRadius: "12px",
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: "14px",
                                    color: "#1A1A1A",
                                    outline: "none"
                                  }}
                                />
                              </div>
                            </div>
                            <div style={{
                              maxHeight: "200px",
                              overflowY: "auto",
                              padding: "8px 0"
                            }}>
                              {filterOptions(provinces).map(province => (
                                <div
                                  key={province}
                                  onClick={() => {
                                    setCurrentAddress({ ...currentAddress, province, city: "", district: "" });
                                    setOpenDropdown(null);
                                    setSearchKeyword("");
                                  }}
                                  style={{
                                    padding: "10px 16px",
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: "14px",
                                    color: "#1A1A1A"
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "#EAEBFF";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "transparent";
                                  }}
                                >
                                  {province}
                                </div>
                              ))}
                              {filterOptions(provinces).length === 0 && (
                                <div style={{
                                  padding: "16px",
                                  textAlign: "center",
                                  color: "#8A8A93",
                                  fontSize: "14px"
                                }}>
                                  未找到匹配的省份
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 城市选择器 */}
                      <div style={{
                        position: "relative",
                        flex: "1 1 calc(33.333% - 6px)",
                        minWidth: "120px"
                      }}>
                        <button
                          type="button"
                          onClick={() => {
                            if (currentAddress.province) {
                              setOpenDropdown(openDropdown === "city" ? null : "city");
                              setSearchKeyword("");
                            }
                          }}
                          disabled={!currentAddress.province}
                          style={{
                            width: "100%",
                            padding: "14px 40px 14px 16px",
                            border: "2px solid #EAEBFF",
                            borderRadius: "16px",
                            fontFamily: "Inter, sans-serif",
                            fontSize: "15px",
                            color: currentAddress.city ? "#1A1A1A" : "#8A8A93",
                            outline: "none",
                            transition: "all 0.2s",
                            background: currentAddress.province ? "#FFFFFF" : "#F5F5F5",
                            cursor: currentAddress.province ? "pointer" : "not-allowed",
                            textAlign: "left"
                          }}
                          onMouseEnter={(e) => {
                            if (currentAddress.province) {
                              e.currentTarget.style.borderColor = "#2B5BFF";
                              e.currentTarget.style.background = "rgba(43, 91, 255, 0.02)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (currentAddress.province) {
                              e.currentTarget.style.borderColor = "#EAEBFF";
                              e.currentTarget.style.background = "#FFFFFF";
                            }
                          }}
                        >
                          {currentAddress.city || "请选择市"}
                        </button>
                        <ChevronDown className="w-5 h-5" style={{
                          position: "absolute",
                          right: "16px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#8A8A93",
                          pointerEvents: "none"
                        }} />
                        {openDropdown === "city" && (
                          <div style={{
                            position: "absolute",
                            top: "calc(100% + 8px)",
                            left: 0,
                            right: 0,
                            backgroundColor: "#FFFFFF",
                            border: "2px solid #EAEBFF",
                            borderRadius: "16px",
                            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                            zIndex: 100,
                            overflow: "hidden"
                          }}>
                            <div style={{
                              padding: "12px",
                              borderBottom: "1px solid #EAEBFF"
                            }}>
                              <div style={{ position: "relative" }}>
                                <Search className="w-4 h-4" style={{
                                  position: "absolute",
                                  left: "12px",
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                  color: "#8A8A93",
                                  pointerEvents: "none"
                                }} />
                                <input
                                  type="text"
                                  value={searchKeyword}
                                  onChange={(e) => setSearchKeyword(e.target.value)}
                                  placeholder="搜索城市"
                                  onClick={(e) => e.stopPropagation()}
                                  style={{
                                    width: "100%",
                                    padding: "8px 12px 8px 36px",
                                    border: "1px solid #EAEBFF",
                                    borderRadius: "12px",
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: "14px",
                                    color: "#1A1A1A",
                                    outline: "none"
                                  }}
                                />
                              </div>
                            </div>
                            <div style={{
                              maxHeight: "200px",
                              overflowY: "auto",
                              padding: "8px 0"
                            }}>
                              {filterOptions(getCities()).map(city => (
                                <div
                                  key={city}
                                  onClick={() => {
                                    setCurrentAddress({ ...currentAddress, city, district: "" });
                                    setOpenDropdown(null);
                                    setSearchKeyword("");
                                  }}
                                  style={{
                                    padding: "10px 16px",
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: "14px",
                                    color: "#1A1A1A"
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "#EAEBFF";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "transparent";
                                  }}
                                >
                                  {city}
                                </div>
                              ))}
                              {filterOptions(getCities()).length === 0 && (
                                <div style={{
                                  padding: "16px",
                                  textAlign: "center",
                                  color: "#8A8A93",
                                  fontSize: "14px"
                                }}>
                                  未找到匹配的城市
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 区县选择器 */}
                      <div style={{
                        position: "relative",
                        flex: "1 1 calc(33.333% - 6px)",
                        minWidth: "120px"
                      }}>
                        <button
                          type="button"
                          onClick={() => {
                            if (currentAddress.city) {
                              setOpenDropdown(openDropdown === "district" ? null : "district");
                              setSearchKeyword("");
                            }
                          }}
                          disabled={!currentAddress.city}
                          style={{
                            width: "100%",
                            padding: "14px 40px 14px 16px",
                            border: "2px solid #EAEBFF",
                            borderRadius: "16px",
                            fontFamily: "Inter, sans-serif",
                            fontSize: "15px",
                            color: currentAddress.district ? "#1A1A1A" : "#8A8A93",
                            outline: "none",
                            transition: "all 0.2s",
                            background: currentAddress.city ? "#FFFFFF" : "#F5F5F5",
                            cursor: currentAddress.city ? "pointer" : "not-allowed",
                            textAlign: "left"
                          }}
                          onMouseEnter={(e) => {
                            if (currentAddress.city) {
                              e.currentTarget.style.borderColor = "#2B5BFF";
                              e.currentTarget.style.background = "rgba(43, 91, 255, 0.02)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (currentAddress.city) {
                              e.currentTarget.style.borderColor = "#EAEBFF";
                              e.currentTarget.style.background = "#FFFFFF";
                            }
                          }}
                        >
                          {currentAddress.district || "请选择区"}
                        </button>
                        <ChevronDown className="w-5 h-5" style={{
                          position: "absolute",
                          right: "16px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#8A8A93",
                          pointerEvents: "none"
                        }} />
                        {openDropdown === "district" && (
                          <div style={{
                            position: "absolute",
                            top: "calc(100% + 8px)",
                            left: 0,
                            right: 0,
                            backgroundColor: "#FFFFFF",
                            border: "2px solid #EAEBFF",
                            borderRadius: "16px",
                            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                            zIndex: 100,
                            overflow: "hidden"
                          }}>
                            <div style={{
                              padding: "12px",
                              borderBottom: "1px solid #EAEBFF"
                            }}>
                              <div style={{ position: "relative" }}>
                                <Search className="w-4 h-4" style={{
                                  position: "absolute",
                                  left: "12px",
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                  color: "#8A8A93",
                                  pointerEvents: "none"
                                }} />
                                <input
                                  type="text"
                                  value={searchKeyword}
                                  onChange={(e) => setSearchKeyword(e.target.value)}
                                  placeholder="搜索区县"
                                  onClick={(e) => e.stopPropagation()}
                                  style={{
                                    width: "100%",
                                    padding: "8px 12px 8px 36px",
                                    border: "1px solid #EAEBFF",
                                    borderRadius: "12px",
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: "14px",
                                    color: "#1A1A1A",
                                    outline: "none"
                                  }}
                                />
                              </div>
                            </div>
                            <div style={{
                              maxHeight: "200px",
                              overflowY: "auto",
                              padding: "8px 0"
                            }}>
                              {filterOptions(getDistricts()).map(district => (
                                <div
                                  key={district}
                                  onClick={() => {
                                    setCurrentAddress({ ...currentAddress, district });
                                    setOpenDropdown(null);
                                    setSearchKeyword("");
                                  }}
                                  style={{
                                    padding: "10px 16px",
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: "14px",
                                    color: "#1A1A1A"
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "#EAEBFF";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "transparent";
                                  }}
                                >
                                  {district}
                                </div>
                              ))}
                              {filterOptions(getDistricts()).length === 0 && (
                                <div style={{
                                  padding: "16px",
                                  textAlign: "center",
                                  color: "#8A8A93",
                                  fontSize: "14px"
                                }}>
                                  未找到匹配的区县
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 详细地址 */}
                  <div>
                    <label style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 600,
                      fontSize: "14px",
                      color: "#1A1A1A",
                      marginBottom: "8px",
                      display: "block"
                    }}>
                      详细地址
                    </label>
                    <div style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "flex-start"
                    }}>
                      <MapPin className="w-5 h-5" style={{
                        position: "absolute",
                        left: "16px",
                        top: "14px",
                        color: "#8A8A93"
                      }} />
                      <textarea
                        value={currentAddress.detail}
                        onChange={(e) => setCurrentAddress({ ...currentAddress, detail: e.target.value })}
                        placeholder="请输入详细地址（街道、门牌号等）"
                        rows={3}
                        style={{
                          width: "100%",
                          padding: "14px 16px 14px 48px",
                          border: "2px solid #EAEBFF",
                          borderRadius: "16px",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "15px",
                          color: "#1A1A1A",
                          outline: "none",
                          transition: "all 0.2s",
                          resize: "none"
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#2B5BFF";
                          e.currentTarget.style.background = "rgba(43, 91, 255, 0.02)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "#EAEBFF";
                          e.currentTarget.style.background = "#FFFFFF";
                        }}
                      />
                    </div>
                  </div>

                  {/* 设为默认地址 */}
                  <div
                    onClick={() => setSetAsDefault(!setAsDefault)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "16px",
                      borderRadius: "16px",
                      border: "2px solid #EAEBFF",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      background: setAsDefault ? "rgba(43, 91, 255, 0.04)" : "#FFFFFF"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#2B5BFF";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#EAEBFF";
                    }}
                  >
                    <div style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "6px",
                      border: setAsDefault ? "2px solid #2B5BFF" : "2px solid #D1D5DB",
                      background: setAsDefault ? "#2B5BFF" : "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s"
                    }}>
                      {setAsDefault && (
                        <CheckCircle className="w-4 h-4" style={{ color: "#FFFFFF" }} />
                      )}
                    </div>
                    <span style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "15px",
                      fontWeight: 500,
                      color: "#1A1A1A"
                    }}>
                      设为默认地址
                    </span>
                  </div>
                </div>

                {/* 保存地址按钮 */}
                <button
                  onClick={handleSaveAddress}
                  disabled={!isAddressFormValid()}
                  style={{
                    width: "100%",
                    padding: "16px",
                    marginTop: "24px",
                    background: isAddressFormValid()
                      ? "#2B5BFF"
                      : "#D1D5DB",
                    border: "none",
                    borderRadius: "16px",
                    cursor: isAddressFormValid() ? "pointer" : "not-allowed",
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 600,
                    fontSize: "16px",
                    color: "#FFFFFF",
                    boxShadow: isAddressFormValid()
                      ? "0 4px 20px rgba(43, 91, 255, 0.2)"
                      : "none",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    if (isAddressFormValid()) {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 6px 24px rgba(43, 91, 255, 0.3)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isAddressFormValid()) {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 20px rgba(43, 91, 255, 0.2)";
                    }
                  }}
                >
                  保存地址
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
