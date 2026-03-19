import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CreditCard, CheckCircle, Loader, MapPin, User, Phone, Plus, Check, Minus } from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  name: string;
  price: number;
  date: string;
  status: string;
  address: string;
  phone: string;
  recipient: string;
}

interface PaymentModalProps {
  isOpen?: boolean;
  amount?: number;
  productName?: string;
  productDesc?: string;
  productImage?: string;
  order?: Order;
  onClose: () => void;
  onSuccess?: () => void;
}

interface ShippingAddress {
  id: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  isDefault?: boolean;
}

export function PaymentModal({ 
  isOpen = true,
  amount: propAmount,
  productName: propProductName,
  productDesc: propProductDesc,
  productImage: propProductImage,
  order,
  onClose, 
  onSuccess 
}: PaymentModalProps) {
  // 从订单或props中获取产品信息
  const productName = order?.name.replace(/\s*x\d+\s*$/, '') || propProductName || "代餐营养套装";
  const productDesc = propProductDesc || "30天全营养代餐方案";
  const productImage = propProductImage || "🥤";
  const unitPrice = order?.price || propAmount || 899;
  
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<"wechat" | "alipay">("wechat");
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success">("idle");
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ShippingAddress | null>(null);
  
  // 模拟已有地址数据
  const [savedAddresses, setSavedAddresses] = useState<ShippingAddress[]>([
    {
      id: "1",
      name: "张三",
      phone: "138****8888",
      province: "广东省",
      city: "深圳市",
      district: "南山区",
      detail: "科技园南区深圳湾科技生态园10栋A座2001",
      isDefault: true,
    },
  ]);

  const [newAddress, setNewAddress] = useState<Omit<ShippingAddress, "id">>({
    name: "",
    phone: "",
    province: "",
    city: "",
    district: "",
    detail: "",
  });

  useEffect(() => {
    if (savedAddresses.length > 0 && !selectedAddressId) {
      const defaultAddr = savedAddresses.find(addr => addr.isDefault) || savedAddresses[0];
      setSelectedAddressId(defaultAddr.id);
    }
  }, [savedAddresses, selectedAddressId]);

  const isAddressFormValid = () => {
    const addr = editingAddress || newAddress;
    return (
      addr.name.trim() !== "" &&
      addr.phone.trim() !== "" &&
      addr.province.trim() !== "" &&
      addr.city.trim() !== "" &&
      addr.district.trim() !== "" &&
      addr.detail.trim() !== ""
    );
  };

  const handleSaveAddress = () => {
    if (!isAddressFormValid()) return;

    if (editingAddress) {
      // 更新现有地址
      setSavedAddresses(savedAddresses.map(addr => 
        addr.id === editingAddress.id ? { ...editingAddress } : addr
      ));
      setSelectedAddressId(editingAddress.id);
    } else {
      // 添加新地址
      const newAddr: ShippingAddress = {
        ...newAddress,
        id: Date.now().toString(),
        isDefault: savedAddresses.length === 0,
      };
      setSavedAddresses([...savedAddresses, newAddr]);
      setSelectedAddressId(newAddr.id);
    }

    setShowAddressForm(false);
    setEditingAddress(null);
    setNewAddress({
      name: "",
      phone: "",
      province: "",
      city: "",
      district: "",
      detail: "",
    });
  };

  const handleEditAddress = (address: ShippingAddress) => {
    setEditingAddress(address);
    setShowAddressForm(true);
  };

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    setNewAddress({
      name: "",
      phone: "",
      province: "",
      city: "",
      district: "",
      detail: "",
    });
    setShowAddressForm(true);
  };

  const handlePay = () => {
    if (!selectedAddressId) return;
    
    setPaymentStatus("processing");
    
    // 模拟支付处理
    setTimeout(() => {
      setPaymentStatus("success");
      
      // 2秒后关闭弹窗并调用成功回调
      setTimeout(() => {
        onSuccess?.();
        handleClose();
      }, 2000);
    }, 2000);
  };

  const handleClose = () => {
    onClose();
    // 延迟重置状态，等待动画完成
    setTimeout(() => {
      setPaymentStatus("idle");
      setShowAddressForm(false);
      setEditingAddress(null);
    }, 300);
  };

  useEffect(() => {
    if (!isOpen) {
      setPaymentStatus("idle");
    }
  }, [isOpen]);

  const currentAddress = editingAddress || newAddress;
  const setCurrentAddress = (addr: Partial<ShippingAddress>) => {
    if (editingAddress) {
      setEditingAddress({ ...editingAddress, ...addr });
    } else {
      setNewAddress({ ...newAddress, ...addr });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 遮罩层 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={paymentStatus === "idle" && !showAddressForm ? handleClose : undefined}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(4px)",
              zIndex: 1001,
            }}
          />

          {/* 抽屉内容 - 从底部弹出 */}
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
              backgroundColor: "#FFFFFF",
              borderTopLeftRadius: "24px",
              borderTopRightRadius: "24px",
              boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.1)",
              zIndex: 1002,
              overflow: "hidden",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {paymentStatus === "success" ? (
              // 支付成功页面
              <div style={{
                padding: "48px 24px",
                textAlign: "center",
              }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 15, stiffness: 300 }}
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "#2B5BFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 24px",
                  }}
                >
                  <CheckCircle className="w-12 h-12" style={{ color: "#FFFFFF" }} />
                </motion.div>
                <h3 style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 700,
                  fontSize: "24px",
                  color: "#1A1A1A",
                  marginBottom: "8px",
                }}>
                  支付成功！
                </h3>
                <p style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  color: "#8A8A93",
                  marginBottom: "24px",
                }}>
                  您的订单已确认，我们会在48小时内配送到家
                </p>
                <div style={{
                  padding: "16px",
                  borderRadius: "16px",
                  background: "#EAEBFF",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "13px",
                  color: "#8A8A93",
                }}>
                  订单金额：<span style={{
                    fontWeight: 600,
                    color: "#1A1A1A",
                    fontSize: "16px",
                  }}>¥{unitPrice * quantity}</span>
                </div>
              </div>
            ) : (
              <>
                {/* 拖拽指示器 */}
                <div style={{
                  padding: "12px 0",
                  display: "flex",
                  justifyContent: "center",
                }}>
                  <div style={{
                    width: "40px",
                    height: "4px",
                    borderRadius: "2px",
                    background: "#D1D5DB",
                  }} />
                </div>

                {/* 头部 */}
                <div style={{
                  padding: "0 24px 16px",
                  borderBottom: "1px solid #EAEBFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                  <h2 style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 700,
                    fontSize: "20px",
                    color: "#1A1A1A",
                    margin: 0,
                  }}>
                    {showAddressForm ? (editingAddress ? "编辑地址" : "新增地址") : "确认订单"}
                  </h2>
                  {paymentStatus === "idle" && (
                    <button
                      onClick={() => {
                        if (showAddressForm) {
                          setShowAddressForm(false);
                          setEditingAddress(null);
                        } else {
                          handleClose();
                        }
                      }}
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        border: "none",
                        background: "#EAEBFF",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s",
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
                  )}
                </div>

                {/* 内容区 - 可滚动 */}
                <div style={{ 
                  flex: 1, 
                  overflowY: "auto",
                  padding: "24px 24px 32px" 
                }}>
                  {showAddressForm ? (
                    // 地址表单
                    <>
                      <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}>
                        {/* 收货人姓名 */}
                        <div>
                          <label style={{
                            fontFamily: "Inter, sans-serif",
                            fontWeight: 600,
                            fontSize: "14px",
                            color: "#1A1A1A",
                            marginBottom: "8px",
                            display: "block",
                          }}>
                            收货人姓名
                          </label>
                          <div style={{
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                          }}>
                            <User className="w-5 h-5" style={{
                              position: "absolute",
                              left: "16px",
                              color: "#8A8A93",
                            }} />
                            <input
                              type="text"
                              value={currentAddress.name}
                              onChange={(e) => setCurrentAddress({ name: e.target.value })}
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
                                transition: "all 0.2s",
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
                            display: "block",
                          }}>
                            手机号码
                          </label>
                          <div style={{
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                          }}>
                            <Phone className="w-5 h-5" style={{
                              position: "absolute",
                              left: "16px",
                              color: "#8A8A93",
                            }} />
                            <input
                              type="tel"
                              value={currentAddress.phone}
                              onChange={(e) => setCurrentAddress({ phone: e.target.value })}
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
                                transition: "all 0.2s",
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
                            display: "block",
                          }}>
                            所在地区
                          </label>
                          <div style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr 1fr",
                            gap: "8px",
                          }}>
                            <input
                              type="text"
                              value={currentAddress.province}
                              onChange={(e) => setCurrentAddress({ province: e.target.value })}
                              placeholder="省"
                              style={{
                                padding: "14px 16px",
                                border: "2px solid #EAEBFF",
                                borderRadius: "16px",
                                fontFamily: "Inter, sans-serif",
                                fontSize: "15px",
                                color: "#1A1A1A",
                                outline: "none",
                                transition: "all 0.2s",
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
                            <input
                              type="text"
                              value={currentAddress.city}
                              onChange={(e) => setCurrentAddress({ city: e.target.value })}
                              placeholder="市"
                              style={{
                                padding: "14px 16px",
                                border: "2px solid #EAEBFF",
                                borderRadius: "16px",
                                fontFamily: "Inter, sans-serif",
                                fontSize: "15px",
                                color: "#1A1A1A",
                                outline: "none",
                                transition: "all 0.2s",
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
                            <input
                              type="text"
                              value={currentAddress.district}
                              onChange={(e) => setCurrentAddress({ district: e.target.value })}
                              placeholder="区"
                              style={{
                                padding: "14px 16px",
                                border: "2px solid #EAEBFF",
                                borderRadius: "16px",
                                fontFamily: "Inter, sans-serif",
                                fontSize: "15px",
                                color: "#1A1A1A",
                                outline: "none",
                                transition: "all 0.2s",
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

                        {/* 详细地址 */}
                        <div>
                          <label style={{
                            fontFamily: "Inter, sans-serif",
                            fontWeight: 600,
                            fontSize: "14px",
                            color: "#1A1A1A",
                            marginBottom: "8px",
                            display: "block",
                          }}>
                            详细地址
                          </label>
                          <div style={{
                            position: "relative",
                            display: "flex",
                            alignItems: "flex-start",
                          }}>
                            <MapPin className="w-5 h-5" style={{
                              position: "absolute",
                              left: "16px",
                              top: "14px",
                              color: "#8A8A93",
                            }} />
                            <textarea
                              value={currentAddress.detail}
                              onChange={(e) => setCurrentAddress({ detail: e.target.value })}
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
                                resize: "none",
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
                          transition: "all 0.2s",
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
                    </>
                  ) : (
                    // 订单确认页面
                    <>
                      {/* 商品信息 */}
                      <div style={{
                        padding: "16px",
                        borderRadius: "16px",
                        background: "#EAEBFF",
                        marginBottom: "24px",
                      }}>
                        <h3 style={{
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 600,
                          fontSize: "14px",
                          color: "#1A1A1A",
                          marginBottom: "12px",
                        }}>
                          商品信息
                        </h3>
                        <div style={{
                          display: "flex",
                          gap: "12px",
                          alignItems: "center",
                        }}>
                          <div style={{
                            fontSize: "48px",
                            flexShrink: 0,
                          }}>
                            {productImage}
                          </div>
                          <div style={{ flex: 1 }}>
                            <h5 style={{
                              fontFamily: "Inter, sans-serif",
                              fontWeight: 600,
                              fontSize: "15px",
                              color: "#131142",
                              marginBottom: "4px",
                            }}>
                              {productName}
                            </h5>
                            <p style={{
                              fontFamily: "PingFang SC, sans-serif",
                              fontSize: "13px",
                              color: "#7F88AA",
                            }}>
                              {productDesc}
                            </p>
                          </div>
                          <div style={{
                            fontFamily: "Inter, sans-serif",
                            fontWeight: 700,
                            fontSize: "18px",
                            color: "#2B5BFF",
                          }}>
                            ¥{unitPrice * quantity}
                          </div>
                        </div>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginTop: "12px",
                        }}>
                          <button
                            onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              border: "none",
                              background: "#EAEBFF",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "rgba(43, 91, 255, 0.15)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "#EAEBFF";
                            }}
                          >
                            <Minus className="w-5 h-5" style={{ color: "#8A8A93" }} />
                          </button>
                          <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                            style={{
                              width: "64px",
                              padding: "10px 16px",
                              border: "2px solid #EAEBFF",
                              borderRadius: "16px",
                              fontFamily: "Inter, sans-serif",
                              fontSize: "15px",
                              color: "#1A1A1A",
                              outline: "none",
                              transition: "all 0.2s",
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
                          <button
                            onClick={() => setQuantity(quantity + 1)}
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              border: "none",
                              background: "#EAEBFF",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "rgba(43, 91, 255, 0.15)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "#EAEBFF";
                            }}
                          >
                            <Plus className="w-5 h-5" style={{ color: "#8A8A93" }} />
                          </button>
                        </div>
                      </div>

                      {/* 收货地址选择 */}
                      <div style={{ marginBottom: "24px" }}>
                        <h3 style={{
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 600,
                          fontSize: "14px",
                          color: "#1A1A1A",
                          marginBottom: "16px",
                        }}>
                          收货地址
                        </h3>
                        <div style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}>
                          {/* 已有地址列表 */}
                          {savedAddresses.map((address) => (
                            <div
                              key={address.id}
                              onClick={() => setSelectedAddressId(address.id)}
                              style={{
                                padding: "16px",
                                borderRadius: "16px",
                                border: selectedAddressId === address.id
                                  ? "2px solid #2B5BFF"
                                  : "2px solid #EAEBFF",
                                background: selectedAddressId === address.id
                                  ? "rgba(43, 91, 255, 0.04)"
                                  : "#FFFFFF",
                                cursor: "pointer",
                                transition: "all 0.2s",
                                position: "relative",
                              }}
                            >
                              <div style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "12px",
                              }}>
                                <MapPin className="w-5 h-5" style={{
                                  color: selectedAddressId === address.id ? "#2B5BFF" : "#8A8A93",
                                  marginTop: "2px",
                                  flexShrink: 0,
                                }} />
                                <div style={{ flex: 1 }}>
                                  <div style={{
                                    fontFamily: "Inter, sans-serif",
                                    fontWeight: 600,
                                    fontSize: "15px",
                                    color: "#1A1A1A",
                                    marginBottom: "4px",
                                  }}>
                                    {address.name} {address.phone}
                                  </div>
                                  <div style={{
                                    fontFamily: "PingFang SC, sans-serif",
                                    fontSize: "13px",
                                    color: "#8A8A93",
                                    lineHeight: "1.5",
                                  }}>
                                    {address.province} {address.city} {address.district} {address.detail}
                                  </div>
                                </div>
                                <div style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "flex-end",
                                  gap: "8px",
                                }}>
                                  {selectedAddressId === address.id && (
                                    <div style={{
                                      width: "20px",
                                      height: "20px",
                                      borderRadius: "50%",
                                      background: "#2B5BFF",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}>
                                      <Check className="w-3 h-3" style={{ color: "#FFFFFF" }} />
                                    </div>
                                  )}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditAddress(address);
                                    }}
                                    style={{
                                      fontFamily: "Inter, sans-serif",
                                      fontSize: "12px",
                                      color: "#2B5BFF",
                                      background: "none",
                                      border: "none",
                                      cursor: "pointer",
                                      padding: "4px",
                                    }}
                                  >
                                    编辑
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}

                          {/* 新增地址按钮 */}
                          <button
                            onClick={handleAddNewAddress}
                            style={{
                              padding: "16px",
                              borderRadius: "16px",
                              border: "2px dashed #2B5BFF",
                              background: "rgba(43, 91, 255, 0.02)",
                              cursor: "pointer",
                              transition: "all 0.2s",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "8px",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "rgba(43, 91, 255, 0.08)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "rgba(43, 91, 255, 0.02)";
                            }}
                          >
                            <Plus className="w-5 h-5" style={{ color: "#2B5BFF" }} />
                            <span style={{
                              fontFamily: "Inter, sans-serif",
                              fontWeight: 600,
                              fontSize: "15px",
                              color: "#2B5BFF",
                            }}>
                              新增收货地址
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* 支付方式选择 */}
                      <div style={{ marginBottom: "24px" }}>
                        <h3 style={{
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 600,
                          fontSize: "14px",
                          color: "#1A1A1A",
                          marginBottom: "16px",
                        }}>
                          支付方式
                        </h3>
                        <div style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}>
                          {/* 微信支付 */}
                          <div
                            onClick={() => paymentStatus === "idle" && setPaymentMethod("wechat")}
                            style={{
                              padding: "16px",
                              borderRadius: "16px",
                              border: paymentMethod === "wechat"
                                ? "2px solid #2B5BFF"
                                : "2px solid #EAEBFF",
                              background: paymentMethod === "wechat"
                                ? "rgba(43, 91, 255, 0.04)"
                                : "#FFFFFF",
                              cursor: paymentStatus === "idle" ? "pointer" : "not-allowed",
                              transition: "all 0.2s",
                              display: "flex",
                              alignItems: "center",
                              gap: "16px",
                              opacity: paymentStatus === "idle" ? 1 : 0.6,
                            }}
                          >
                            <div style={{
                              width: "48px",
                              height: "48px",
                              borderRadius: "16px",
                              background: "#07C160",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "24px",
                            }}>
                              💬
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{
                                fontFamily: "Inter, sans-serif",
                                fontWeight: 600,
                                fontSize: "15px",
                                color: "#1A1A1A",
                                marginBottom: "4px",
                              }}>
                                微信支付
                              </div>
                              <div style={{
                                fontFamily: "Inter, sans-serif",
                                fontSize: "12px",
                                color: "#8A8A93",
                              }}>
                                推荐使用
                              </div>
                            </div>
                            <div style={{
                              width: "20px",
                              height: "20px",
                              borderRadius: "50%",
                              border: paymentMethod === "wechat"
                                ? "6px solid #2B5BFF"
                                : "2px solid #D1D5DB",
                              background: "#FFFFFF",
                            }} />
                          </div>

                          {/* 支付宝 */}
                          <div
                            onClick={() => paymentStatus === "idle" && setPaymentMethod("alipay")}
                            style={{
                              padding: "16px",
                              borderRadius: "16px",
                              border: paymentMethod === "alipay"
                                ? "2px solid #2B5BFF"
                                : "2px solid #EAEBFF",
                              background: paymentMethod === "alipay"
                                ? "rgba(43, 91, 255, 0.04)"
                                : "#FFFFFF",
                              cursor: paymentStatus === "idle" ? "pointer" : "not-allowed",
                              transition: "all 0.2s",
                              display: "flex",
                              alignItems: "center",
                              gap: "16px",
                              opacity: paymentStatus === "idle" ? 1 : 0.6,
                            }}
                          >
                            <div style={{
                              width: "48px",
                              height: "48px",
                              borderRadius: "16px",
                              background: "#1677FF",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "24px",
                            }}>
                              💳
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{
                                fontFamily: "Inter, sans-serif",
                                fontWeight: 600,
                                fontSize: "15px",
                                color: "#1A1A1A",
                                marginBottom: "4px",
                              }}>
                                支付宝
                              </div>
                              <div style={{
                                fontFamily: "Inter, sans-serif",
                                fontSize: "12px",
                                color: "#8A8A93",
                              }}>
                                便捷支付
                              </div>
                            </div>
                            <div style={{
                              width: "20px",
                              height: "20px",
                              borderRadius: "50%",
                              border: paymentMethod === "alipay"
                                ? "6px solid #2B5BFF"
                                : "2px solid #D1D5DB",
                              background: "#FFFFFF",
                            }} />
                          </div>
                        </div>
                      </div>

                      {/* 支付按钮 */}
                      <button
                        onClick={handlePay}
                        disabled={paymentStatus !== "idle" || !selectedAddressId}
                        style={{
                          width: "100%",
                          padding: "16px",
                          background: (paymentStatus === "idle" && selectedAddressId)
                            ? "#2B5BFF"
                            : "#D1D5DB",
                          border: "none",
                          borderRadius: "16px",
                          cursor: (paymentStatus === "idle" && selectedAddressId) ? "pointer" : "not-allowed",
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 600,
                          fontSize: "16px",
                          color: "#FFFFFF",
                          boxShadow: (paymentStatus === "idle" && selectedAddressId)
                            ? "0 4px 20px rgba(43, 91, 255, 0.2)"
                            : "none",
                          transition: "all 0.2s",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                        }}
                        onMouseEnter={(e) => {
                          if (paymentStatus === "idle" && selectedAddressId) {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 6px 24px rgba(43, 91, 255, 0.3)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (paymentStatus === "idle" && selectedAddressId) {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 4px 20px rgba(43, 91, 255, 0.2)";
                          }
                        }}
                      >
                        {paymentStatus === "processing" ? (
                          <>
                            <Loader className="w-5 h-5 animate-spin" />
                            支付处理中...
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-5 h-5" />
                            确认支付 ¥{unitPrice * quantity}
                          </>
                        )}
                      </button>

                      {/* 安全提示 */}
                      <div style={{
                        marginTop: "16px",
                        padding: "12px",
                        borderRadius: "16px",
                        background: "rgba(43, 91, 255, 0.04)",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}>
                        <div style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          background: "rgba(43, 91, 255, 0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}>
                          🔒
                        </div>
                        <span style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "12px",
                          color: "#2B5BFF",
                        }}>
                          支付信息已加密，请放心支付
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}