import { Link } from "react-router";
import { Home, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

export default function NotFound() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50/30 via-purple-50/20 to-blue-50/30" />
      
      {/* 装饰性模糊圆圈 */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[#2B5BFF]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg w-full text-center"
        >
          {/* 404 图标 - 毛玻璃卡片 */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
            className="mb-8"
          >
            <div className="w-40 h-40 mx-auto rounded-3xl backdrop-blur-xl bg-white/60 border border-white/40 shadow-lg flex items-center justify-center relative overflow-hidden">
              {/* 内部渐变光晕 */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#2B5BFF]/10 to-purple-500/10" />
              <span className="text-7xl relative z-10">🤔</span>
            </div>
          </motion.div>

          {/* 标题区域 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-6xl font-bold mb-4" style={{ 
              background: 'linear-gradient(135deg, #2B5BFF 0%, #7B5BFF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              404
            </h1>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">页面未找到</h2>
            <p className="text-gray-600 mb-10 text-base">
              抱歉，您访问的页面不存在或已被移除
            </p>
          </motion.div>

          {/* 操作按钮 - 毛玻璃风格 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
          >
            <Link
              to="/"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#2B5BFF] text-white rounded-2xl font-medium hover:bg-[#2347CC] transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              返回首页
            </Link>
            <button
              onClick={() => window.history.back()}
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 backdrop-blur-xl bg-white/60 text-gray-700 border border-white/40 rounded-2xl font-medium hover:bg-white/80 transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              返回上一页
            </button>
          </motion.div>

          {/* 帮助提示 - 毛玻璃卡片 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="p-5 backdrop-blur-xl bg-[#EAEBFF]/50 rounded-2xl border border-white/40 shadow-md"
          >
            <p className="text-sm text-[#2B5BFF] font-medium">
              💡 如果您认为这是一个错误，请联系技术支持
            </p>
          </motion.div>

          {/* 常用链接 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 flex flex-wrap gap-3 justify-center text-sm"
          >
            <Link to="/" className="text-gray-600 hover:text-[#2B5BFF] transition-colors">
              首页
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/triage" className="text-gray-600 hover:text-[#2B5BFF] transition-colors">
              智能导诊
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/data" className="text-gray-600 hover:text-[#2B5BFF] transition-colors">
              健康数据
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/profile" className="text-gray-600 hover:text-[#2B5BFF] transition-colors">
              个人中心
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}