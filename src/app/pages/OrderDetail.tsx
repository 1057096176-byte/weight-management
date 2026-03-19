import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Package, MapPin, Phone, User, Truck, CheckCircle, Clock } from "lucide-react";

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

// 模拟订单数据库
const ordersData: Order[] = [
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
];

export default function OrderDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  
  // 优先从 location.state 获取，否则从订单数据中查找
  const [order, setOrder] = useState<Order | null>(null);
  
  useEffect(() => {
    const stateOrder = location.state?.order as Order;
    if (stateOrder) {
      setOrder(stateOrder);
    } else if (params.id) {
      const foundOrder = ordersData.find(o => o.id === params.id);
      setOrder(foundOrder || null);
    }
  }, [location.state, params.id]);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FAFAFF" }}>
        <div style={{ textAlign: "center" }}>
          <Package className="w-16 h-16 mx-auto" style={{ color: "#D1D5DB", marginBottom: "16px" }} />
          <p style={{ fontSize: "16px", color: "#8A8A93", marginBottom: "24px" }}>订单不存在</p>
          <button
            onClick={() => navigate("/orders")}
            style={{
              padding: "12px 24px",
              background: "#2B5BFF",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            返回订单列表
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "待发货": return "#2B5BFF";
      case "待收货": return "#6B8FFF";
      case "已完成": return "#4CAF50";
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
        <h1 style={{ fontSize: "16px", fontWeight: 600, color: "#1A1A1A" }}>订单详情</h1>
        <div style={{ width: "36px" }} />
      </div>

      <div className="max-w-4xl mx-auto p-4" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* 订单状态 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "24px",
            padding: "24px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.5)"
          }}
        >
          <div className="flex items-center gap-3" style={{ marginBottom: "16px" }}>
            {order.status === "待发货" && <Package className="w-6 h-6" style={{ color: getStatusColor(order.status) }} />}
            {order.status === "待收货" && <Truck className="w-6 h-6" style={{ color: getStatusColor(order.status) }} />}
            {order.status === "已完成" && <CheckCircle className="w-6 h-6" style={{ color: getStatusColor(order.status) }} />}
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#1A1A1A", marginBottom: "4px" }}>
                {order.status}
              </h2>
              {order.status === "待发货" && (
                <p style={{ fontSize: "14px", color: "#8A8A93" }}>商品正在准备中，我们会尽快发货</p>
              )}
              {order.status === "待收货" && (
                <p style={{ fontSize: "14px", color: "#8A8A93" }}>您的包裹正在配送中</p>
              )}
              {order.status === "已完成" && (
                <p style={{ fontSize: "14px", color: "#8A8A93" }}>感谢您的购买</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* 物流信息 */}
        {order.logistics && (
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
            <h3 style={{
              fontSize: "16px",
              fontWeight: 600,
              color: "#1A1A1A",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <Truck className="w-5 h-5" style={{ color: "#2B5BFF" }} />
              物流信息
            </h3>

            <div style={{
              padding: "16px",
              backgroundColor: "#F8F9FF",
              borderRadius: "16px",
              marginBottom: "20px"
            }}>
              <div className="flex items-center justify-between" style={{ marginBottom: "8px" }}>
                <span style={{ fontSize: "14px", color: "#8A8A93" }}>物流公司</span>
                <span style={{ fontSize: "14px", fontWeight: 500, color: "#1A1A1A" }}>
                  {order.logistics.company}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ fontSize: "14px", color: "#8A8A93" }}>运单号</span>
                <span style={{ fontSize: "14px", fontWeight: 500, color: "#2B5BFF" }}>
                  {order.logistics.trackingNumber}
                </span>
              </div>
            </div>

            {/* 物流时间轴 */}
            <div style={{ position: "relative" }}>
              {order.logistics.timeline.map((item, index) => (
                <div
                  key={index}
                  style={{
                    position: "relative",
                    paddingLeft: "32px",
                    paddingBottom: index === order.logistics!.timeline.length - 1 ? "0" : "24px"
                  }}
                >
                  {/* 时间轴线 */}
                  {index !== order.logistics!.timeline.length - 1 && (
                    <div style={{
                      position: "absolute",
                      left: "7px",
                      top: "24px",
                      bottom: "0",
                      width: "2px",
                      background: index === 0 ? "#2B5BFF" : "#E5E7EB"
                    }} />
                  )}

                  {/* 时间轴点 */}
                  <div style={{
                    position: "absolute",
                    left: "0",
                    top: "4px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    background: index === 0 ? "#2B5BFF" : "#E5E7EB",
                    border: `3px solid ${index === 0 ? "#EEF2FF" : "#F9FAFB"}`
                  }} />

                  <div>
                    <p style={{
                      fontSize: "14px",
                      fontWeight: index === 0 ? 600 : 500,
                      color: index === 0 ? "#1A1A1A" : "#6B7280",
                      marginBottom: "4px"
                    }}>
                      {item.status}
                    </p>
                    <p style={{ fontSize: "13px", color: "#8A8A93" }}>
                      {item.time}
                    </p>
                    {item.location && (
                      <p style={{ fontSize: "13px", color: "#8A8A93", marginTop: "2px" }}>
                        {item.location}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 商品信息 */}
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
          <h3 style={{
            fontSize: "16px",
            fontWeight: 600,
            color: "#1A1A1A",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <Package className="w-5 h-5" style={{ color: "#2B5BFF" }} />
            商品信息
          </h3>

          <div style={{
            padding: "16px",
            backgroundColor: "#F8F9FF",
            borderRadius: "16px",
            marginBottom: "16px"
          }}>
            <div className="flex items-center justify-between">
              <span style={{ fontSize: "15px", fontWeight: 500, color: "#1A1A1A" }}>
                {order.name}
              </span>
              <span style={{ fontSize: "16px", fontWeight: 600, color: "#2B5BFF" }}>
                ¥{order.price}
              </span>
            </div>
          </div>

          <div style={{
            paddingTop: "16px",
            borderTop: "1px solid #EAEBFF"
          }}>
            <div className="flex items-center justify-between" style={{ marginBottom: "12px" }}>
              <span style={{ fontSize: "14px", color: "#8A8A93" }}>订单编号</span>
              <span style={{ fontSize: "14px", fontWeight: 500, color: "#1A1A1A" }}>
                {order.orderNumber}
              </span>
            </div>
            <div className="flex items-center justify-between" style={{ marginBottom: "12px" }}>
              <span style={{ fontSize: "14px", color: "#8A8A93" }}>下单时间</span>
              <span style={{ fontSize: "14px", fontWeight: 500, color: "#1A1A1A" }}>
                {order.date}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ fontSize: "16px", fontWeight: 600, color: "#1A1A1A" }}>总计</span>
              <span style={{ fontSize: "20px", fontWeight: 700, color: "#2B5BFF" }}>
                ¥{order.price}
              </span>
            </div>
          </div>
        </motion.div>

        {/* 收货地址 */}
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
          <h3 style={{
            fontSize: "16px",
            fontWeight: 600,
            color: "#1A1A1A",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <MapPin className="w-5 h-5" style={{ color: "#2B5BFF" }} />
            收货信息
          </h3>

          <div style={{
            padding: "16px",
            backgroundColor: "#F8F9FF",
            borderRadius: "16px"
          }}>
            <div className="flex items-center gap-2" style={{ marginBottom: "8px" }}>
              <User className="w-4 h-4" style={{ color: "#8A8A93" }} />
              <span style={{ fontSize: "15px", fontWeight: 500, color: "#1A1A1A" }}>
                {order.recipient}
              </span>
            </div>
            <div className="flex items-center gap-2" style={{ marginBottom: "8px" }}>
              <Phone className="w-4 h-4" style={{ color: "#8A8A93" }} />
              <span style={{ fontSize: "14px", color: "#1A1A1A" }}>
                {order.phone}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5" style={{ color: "#8A8A93" }} />
              <span style={{ fontSize: "14px", color: "#1A1A1A", lineHeight: "1.6" }}>
                {order.address}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}