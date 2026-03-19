import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, MapPin, ChevronRight, Plus, Trash2 } from "lucide-react";

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

interface OrdersAddressSectionProps {
  addresses: Address[];
  onAddAddress: () => void;
  onDeleteAddress: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export function OrdersAddressSection({
  addresses,
  onAddAddress,
  onDeleteAddress,
  onSetDefault
}: OrdersAddressSectionProps) {
  const navigate = useNavigate();
  const [showAddressModal, setShowAddressModal] = useState(false);

  return (
    <>
      {/* 我的订单 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onClick={() => navigate('/orders')}
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "24px",
          padding: "20px 24px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.5)",
          cursor: "pointer"
        }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center"
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "#EAEBFF",
                borderRadius: "12px"
              }}
            >
              <ShoppingBag className="w-5 h-5" style={{ color: "#2B5BFF" }} />
            </div>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1A1A1A", marginBottom: "2px" }}>
                我的订单
              </h3>
              <p style={{ fontSize: "13px", color: "#8A8A93" }}>查看代餐服务包订单状态</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5" style={{ color: "#8A8A93" }} />
        </div>
      </motion.div>

      {/* 我的地址 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
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
            <MapPin className="w-5 h-5" style={{ color: "#2B5BFF" }} />
            <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1A1A1A" }}>我的地址</h3>
          </div>
          <button
            onClick={() => setShowAddressModal(true)}
            className="transition-all flex items-center gap-1"
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
            <Plus className="w-4 h-4" />
            添加
          </button>
        </div>

        {addresses.length === 0 ? (
          <div
            style={{
              padding: "40px 20px",
              textAlign: "center",
              backgroundColor: "#FAFAFF",
              borderRadius: "16px"
            }}
          >
            <MapPin className="w-12 h-12 mx-auto mb-3" style={{ color: "#8A8A93" }} />
            <p style={{ fontSize: "14px", color: "#8A8A93", marginBottom: "16px" }}>
              暂无收货地址
            </p>
            <button
              onClick={() => setShowAddressModal(true)}
              className="transition-all"
              style={{
                padding: "10px 24px",
                background: "linear-gradient(135deg, #2B5BFF 0%, #6B8FFF 100%)",
                color: "#FFFFFF",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 500
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
              添加收货地址
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {addresses.map((address) => (
              <div
                key={address.id}
                style={{
                  padding: "16px",
                  backgroundColor: "#FAFAFF",
                  border: address.isDefault ? "2px solid #2B5BFF" : "1px solid #EAEBFF",
                  borderRadius: "16px",
                  position: "relative"
                }}
              >
                {address.isDefault && (
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      padding: "2px 8px",
                      backgroundColor: "#2B5BFF",
                      color: "#FFFFFF",
                      fontSize: "11px",
                      fontWeight: 600,
                      borderRadius: "4px"
                    }}
                  >
                    默认
                  </div>
                )}
                
                <div style={{ marginBottom: "8px" }}>
                  <div className="flex items-center gap-2" style={{ marginBottom: "4px" }}>
                    <span style={{ fontSize: "15px", fontWeight: 600, color: "#1A1A1A" }}>
                      {address.name}
                    </span>
                    <span style={{ fontSize: "14px", color: "#8A8A93" }}>{address.phone}</span>
                  </div>
                  <p style={{ fontSize: "14px", color: "#8A8A93", lineHeight: "1.5" }}>
                    {address.province} {address.city} {address.district} {address.detail}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {!address.isDefault && (
                    <button
                      onClick={() => onSetDefault(address.id)}
                      className="transition-colors"
                      style={{
                        padding: "6px 12px",
                        fontSize: "12px",
                        fontWeight: 500,
                        color: "#2B5BFF",
                        backgroundColor: "#EAEBFF",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#D6DAFF"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#EAEBFF"}
                    >
                      设为默认
                    </button>
                  )}
                  <button
                    className="transition-colors"
                    style={{
                      padding: "6px 12px",
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "#8A8A93",
                      backgroundColor: "#F5F5F5",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#E8E8E8"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#F5F5F5"}
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => onDeleteAddress(address.id)}
                    className="transition-colors flex items-center gap-1"
                    style={{
                      padding: "6px 12px",
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "#FF4444",
                      backgroundColor: "#FFE5E5",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#FFD0D0"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#FFE5E5"}
                  >
                    <Trash2 className="w-3 h-3" />
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* 添加地址弹窗 */}
      <AnimatePresence>
        {showAddressModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            onClick={() => setShowAddressModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full"
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "24px",
                padding: "24px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)"
              }}
            >
              <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#1A1A1A", marginBottom: "20px" }}>
                添加收货地址
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "13px", color: "#8A8A93", marginBottom: "8px", display: "block" }}>
                    收货人
                  </label>
                  <input
                    type="text"
                    placeholder="请输入收货人姓名"
                    className="w-full"
                    style={{
                      padding: "12px 16px",
                      border: "1px solid #EAEBFF",
                      borderRadius: "12px",
                      fontSize: "14px",
                      color: "#1A1A1A",
                      outline: "none"
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ fontSize: "13px", color: "#8A8A93", marginBottom: "8px", display: "block" }}>
                    联系电话
                  </label>
                  <input
                    type="tel"
                    placeholder="请输入手机号码"
                    className="w-full"
                    style={{
                      padding: "12px 16px",
                      border: "1px solid #EAEBFF",
                      borderRadius: "12px",
                      fontSize: "14px",
                      color: "#1A1A1A",
                      outline: "none"
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "13px", color: "#8A8A93", marginBottom: "8px", display: "block" }}>
                    所在地区
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["省份", "城市", "区县"].map((placeholder, idx) => (
                      <select
                        key={idx}
                        className="w-full"
                        style={{
                          padding: "12px 8px",
                          border: "1px solid #EAEBFF",
                          borderRadius: "12px",
                          fontSize: "14px",
                          color: "#1A1A1A",
                          outline: "none"
                        }}
                      >
                        <option>{placeholder}</option>
                      </select>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "13px", color: "#8A8A93", marginBottom: "8px", display: "block" }}>
                    详细地址
                  </label>
                  <textarea
                    placeholder="请输入详细地址（街道、门牌号等）"
                    className="w-full"
                    rows={3}
                    style={{
                      padding: "12px 16px",
                      border: "1px solid #EAEBFF",
                      borderRadius: "12px",
                      fontSize: "14px",
                      color: "#1A1A1A",
                      outline: "none",
                      resize: "none"
                    }}
                  />
                </div>

                <label className="flex items-center gap-2" style={{ cursor: "pointer" }}>
                  <input type="checkbox" />
                  <span style={{ fontSize: "14px", color: "#1A1A1A" }}>设为默认地址</span>
                </label>
              </div>

              <div className="flex gap-3" style={{ marginTop: "24px" }}>
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="flex-1 transition-all"
                  style={{
                    padding: "12px",
                    border: "1px solid #EAEBFF",
                    borderRadius: "16px",
                    color: "#1A1A1A",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: 500
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#FAFAFF"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    onAddAddress();
                    setShowAddressModal(false);
                  }}
                  className="flex-1 transition-all"
                  style={{
                    padding: "12px",
                    background: "linear-gradient(135deg, #2B5BFF 0%, #6B8FFF 100%)",
                    color: "#FFFFFF",
                    borderRadius: "16px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: 500
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
                  保存
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
