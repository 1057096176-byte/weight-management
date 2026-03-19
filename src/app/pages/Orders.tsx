import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, ShoppingBag, Clock, CheckCircle, X, Package, Truck, ShoppingCart } from "lucide-react";
import { PaymentModal } from "../components/PaymentModal";

interface Order {
  id: string;
  orderNumber: string;
  name: string;
  price: number;
  date: string;
  status: "待发货" | "待收货" | "已完成";
  address: string;
  phone: string;
  recipient: string;
  logistics?: {
    company: string;
    trackingNumber: string;
    timeline: {
      time: string;
      status: string;
      location?: string;
    }[];
  };
}

type FilterStatus = "全部" | "待发货" | "待收货" | "已完成";

export default function Orders() {
  const navigate = useNavigate();

  const [orders] = useState<Order[]>([
    {
      id: "1",
      orderNumber: "20260315001",
      name: "营养代餐套餐 x1",
      price: 299,
      date: "2026-03-15 14:30",
      status: "待收货",
      recipient: "张小明",
      phone: "13800138000",
      address: "广东省广州市天河区天河路123号",
      logistics: {
        company: "顺丰速运",
        trackingNumber: "SF1234567890",
        timeline: [
          { time: "2026-03-16 10:30", status: "快件已送达", location: "广州市天河区天河路123号" },
          { time: "2026-03-16 08:15", status: "派送中，快递员张师傅，联系电话：13912345678" },
          { time: "2026-03-16 06:00", status: "到达广州天河中转站" },
          { time: "2026-03-15 20:30", status: "已从深圳分拨中心发出" },
          { time: "2026-03-15 18:00", status: "深圳分拨中心已收件" },
        ]
      }
    },
    {
      id: "2",
      orderNumber: "20260314002",
      name: "优选代餐套餐 x2",
      price: 499,
      date: "2026-03-14 10:20",
      status: "待发货",
      recipient: "李华",
      phone: "13900139000",
      address: "广东省深圳市南山区科技园456号",
    },
    {
      id: "3",
      orderNumber: "20260310003",
      name: "健康管理套餐 x1",
      price: 399,
      date: "2026-03-10 16:45",
      status: "已完成",
      recipient: "王芳",
      phone: "13700137000",
      address: "浙江省杭州市西湖区文三路789号",
      logistics: {
        company: "中通快递",
        trackingNumber: "ZT9876543210",
        timeline: [
          { time: "2026-03-12 14:20", status: "已签收，签收人：本人" },
          { time: "2026-03-12 09:30", status: "派送中" },
          { time: "2026-03-12 06:00", status: "到达杭州西湖区投递部" },
          { time: "2026-03-11 18:30", status: "到达杭州转运中心" },
          { time: "2026-03-11 08:00", status: "已从广州发出" },
        ]
      }
    },
    {
      id: "4",
      orderNumber: "20260305004",
      name: "基础代餐套餐 x1",
      price: 199,
      date: "2026-03-05 11:15",
      status: "已完成",
      recipient: "刘强",
      phone: "13600136000",
      address: "江苏省南京市鼓楼区中山路321号",
      logistics: {
        company: "韵达快递",
        trackingNumber: "YD5678901234",
        timeline: [
          { time: "2026-03-07 15:45", status: "已签收" },
          { time: "2026-03-07 10:20", status: "派送中" },
          { time: "2026-03-06 20:00", status: "到达南京鼓楼区" },
        ]
      }
    },
  ]);

  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>("全部");
  
  // 再次购买相关状态
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [repurchaseOrder, setRepurchaseOrder] = useState<Order | null>(null);

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "待发货": return "#2B5BFF";
      case "待收货": return "#6B8FFF";
      case "已完成": return "#4CAF50";
    }
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "待发货": return Package;
      case "待收货": return Truck;
      case "已完成": return CheckCircle;
    }
  };

  // 筛选订单
  const filteredOrders = orders.filter(order => {
    if (selectedStatus === "全部") return true;
    return order.status === selectedStatus;
  });

  const handleViewDetail = (order: Order) => {
    navigate(`/order-detail/${order.id}`, { state: { order } });
  };

  const handleRepurchase = (order: Order) => {
    setRepurchaseOrder(order);
    setShowPaymentModal(true);
  };

  const statusTabs: FilterStatus[] = ["全部", "待发货", "待收货", "已完成"];

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
        className="sticky top-0 z-10"
        style={{
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #EAEBFF",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.02)"
        }}
      >
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg transition-colors"
            style={{ color: "#1A1A1A" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#EAEBFF"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 style={{ fontSize: "16px", fontWeight: 600, color: "#1A1A1A" }}>我的订单</h1>
          <div style={{ width: "36px" }} />
        </div>

        {/* 状态筛选标签 */}
        <div style={{
          padding: "12px 16px",
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          borderTop: "1px solid #EAEBFF"
        }}>
          {statusTabs.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              style={{
                padding: "8px 20px",
                borderRadius: "20px",
                border: "none",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
                background: selectedStatus === status ? "#2B5BFF" : "#F5F5F5",
                color: selectedStatus === status ? "#FFFFFF" : "#8A8A93"
              }}
              onMouseEnter={(e) => {
                if (selectedStatus !== status) {
                  e.currentTarget.style.background = "#EAEBFF";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedStatus !== status) {
                  e.currentTarget.style.background = "#F5F5F5";
                }
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {filteredOrders.length === 0 ? (
          <div style={{
            padding: "60px 20px",
            textAlign: "center"
          }}>
            <ShoppingBag className="w-16 h-16 mx-auto" style={{ color: "#D1D5DB", marginBottom: "16px" }} />
            <p style={{ fontSize: "16px", color: "#8A8A93" }}>暂无{selectedStatus}订单</p>
          </div>
        ) : (
          filteredOrders.map((order, index) => {
            const StatusIcon = getStatusIcon(order.status);
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "24px",
                  padding: "20px",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.5)"
                }}
              >
                <div className="flex items-center justify-between" style={{ marginBottom: "16px" }}>
                  <span style={{ fontSize: "14px", color: "#8A8A93" }}>订单号：{order.orderNumber}</span>
                  <div className="flex items-center gap-2">
                    <StatusIcon className="w-4 h-4" style={{ color: getStatusColor(order.status) }} />
                    <span style={{ fontSize: "14px", fontWeight: 500, color: getStatusColor(order.status) }}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1A1A1A", marginBottom: "8px" }}>
                    {order.name}
                  </h3>
                  <p style={{ fontSize: "14px", color: "#8A8A93", marginBottom: "4px" }}>{order.date}</p>
                  <p style={{ fontSize: "14px", color: "#8A8A93" }}>
                    {order.recipient} {order.phone}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <span style={{ fontSize: "18px", fontWeight: 700, color: "#2B5BFF" }}>
                    ¥{order.price}
                  </span>
                  <div className="flex items-center gap-2">
                    {order.status === "已完成" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRepurchase(order);
                        }}
                        className="font-medium transition-all flex items-center gap-1.5"
                        style={{
                          padding: "8px 16px",
                          background: "linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)",
                          color: "#FFFFFF",
                          borderRadius: "12px",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "14px",
                          boxShadow: "0 2px 8px rgba(76, 175, 80, 0.2)"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-1px)";
                          e.currentTarget.style.boxShadow = "0 4px 12px rgba(76, 175, 80, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 2px 8px rgba(76, 175, 80, 0.2)";
                        }}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        再次购买
                      </button>
                    )}
                    <button
                      onClick={() => handleViewDetail(order)}
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
                      查看详情
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* 再次购买支付模态框 */}
      {showPaymentModal && repurchaseOrder && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          order={repurchaseOrder}
          onSuccess={() => {
            setShowPaymentModal(false);
            // 可以在这里添加其他成功后的逻辑，比如显示提示消息
          }}
        />
      )}
    </div>
  );
}