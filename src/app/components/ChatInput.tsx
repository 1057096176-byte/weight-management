import { useState } from "react";
import { Send, Mic, Image as ImageIcon, Square, Radio, ArrowUp } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string, image?: File) => void;
  placeholder?: string;
  showImageUpload?: boolean;
}

export function ChatInput({ onSend, placeholder = "输入消息...", showImageUpload = false }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showVoiceOptions, setShowVoiceOptions] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isPressing, setIsPressing] = useState(false);
  const [slideToConvert, setSlideToConvert] = useState(false);
  const [startY, setStartY] = useState(0);

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSend("", file);
    }
  };

  const handleVoiceClick = () => {
    setIsVoiceMode(!isVoiceMode);
    setShowVoiceOptions(false);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setShowVoiceOptions(false);
    // 模拟录音
    setTimeout(() => {
      setIsRecording(false);
      onSend("这是语音转换的文本内容");
    }, 2000);
  };

  const handleVoiceToText = () => {
    setShowVoiceOptions(false);
    // 模拟语音转文字
    setTimeout(() => {
      setMessage("这是语音识别转换的文字");
      setIsVoiceMode(false);
    }, 1500);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isVoiceMode) return;
    setStartY(e.clientY);
    setIsPressing(true);
    setIsRecording(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPressing) return;
    const currentY = e.clientY;
    if (currentY < startY - 50) {
      setSlideToConvert(true);
    } else {
      setSlideToConvert(false);
    }
  };

  const handleMouseUp = () => {
    if (!isPressing) return;
    setIsPressing(false);
    setIsRecording(false);
    
    if (slideToConvert) {
      // 语音转文字
      handleVoiceToText();
    } else {
      // 发送语音
      setTimeout(() => {
        onSend("这是语音消息");
        setIsVoiceMode(false);
      }, 500);
    }
    setSlideToConvert(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isVoiceMode) return;
    setStartY(e.touches[0].clientY);
    setIsPressing(true);
    setIsRecording(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPressing) return;
    const currentY = e.touches[0].clientY;
    if (currentY < startY - 50) {
      setSlideToConvert(true);
    } else {
      setSlideToConvert(false);
    }
  };

  const handleTouchEnd = () => {
    if (!isPressing) return;
    setIsPressing(false);
    setIsRecording(false);
    
    if (slideToConvert) {
      // 语音转文字
      handleVoiceToText();
    } else {
      // 发送语音
      setTimeout(() => {
        onSend("这是语音消息");
        setIsVoiceMode(false);
      }, 500);
    }
    setSlideToConvert(false);
  };

  return (
    <div 
      className="relative"
      style={{
        padding: "16px 12px",
        backgroundColor: "transparent",
        zIndex: 10
      }}
    >
      {/* 语音选项菜单 */}
      {showVoiceOptions && (
        <div 
          className="absolute bottom-full left-4 right-4 mb-2 rounded-2xl z-10"
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid rgba(234, 235, 255, 0.8)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
            padding: "8px"
          }}
        >
          <button
            onClick={handleStartRecording}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left"
            style={{
              backgroundColor: "transparent"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#EAEBFF"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "#EAEBFF"
              }}
            >
              <Mic className="w-5 h-5" style={{ color: "#2B5BFF" }} />
            </div>
            <div>
              <div style={{ fontWeight: 500, fontSize: "14px", color: "#1A1A1A" }}>发送语音</div>
              <div style={{ fontSize: "12px", color: "#8A8A93" }}>按住说话，松开发送</div>
            </div>
          </button>
          <button
            onClick={handleVoiceToText}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left"
            style={{
              backgroundColor: "transparent"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#EAEBFF"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "#EAEBFF"
              }}
            >
              <Mic className="w-5 h-5" style={{ color: "#2B5BFF" }} />
            </div>
            <div>
              <div style={{ fontWeight: 500, fontSize: "14px", color: "#1A1A1A" }}>语音转文字</div>
              <div style={{ fontSize: "12px", color: "#8A8A93" }}>将语音识别为文字后发送</div>
            </div>
          </button>
        </div>
      )}

      {/* 录音状态提示 */}
      {isRecording && (
        <div 
          className="absolute bottom-full left-4 right-4 mb-2 rounded-2xl z-10"
          style={{
            backgroundColor: "#EF4444",
            color: "#FFFFFF",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
            padding: "16px"
          }}
        >
          <div className="flex items-center justify-center gap-3">
            <div className="flex gap-1">
              <span className="w-1 h-6 bg-white rounded-full animate-pulse" style={{ animationDelay: "0ms" }}></span>
              <span className="w-1 h-6 bg-white rounded-full animate-pulse" style={{ animationDelay: "150ms" }}></span>
              <span className="w-1 h-6 bg-white rounded-full animate-pulse" style={{ animationDelay: "300ms" }}></span>
            </div>
            <span>正在录音...</span>
          </div>
        </div>
      )}

      {/* 按住说话提示 - 语音模式 */}
      {isPressing && (
        <div 
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 rounded-2xl z-10 transition-all"
          style={{
            backgroundColor: slideToConvert ? "#2B5BFF" : "#EF4444",
            color: "#FFFFFF",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            padding: "20px 32px",
            minWidth: "200px"
          }}
        >
          <div className="flex flex-col items-center gap-3">
            {slideToConvert ? (
              <>
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <ArrowUp className="w-6 h-6" />
                </div>
                <span className="font-medium">松开转文字</span>
              </>
            ) : (
              <>
                <div className="flex gap-1">
                  <span className="w-1 h-8 bg-white rounded-full animate-pulse" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-1 h-8 bg-white rounded-full animate-pulse" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-1 h-8 bg-white rounded-full animate-pulse" style={{ animationDelay: "300ms" }}></span>
                </div>
                <span className="font-medium">正在录音...</span>
                <div className="flex items-center gap-2 text-sm opacity-80">
                  <ArrowUp className="w-4 h-4" />
                  <span>上滑转文字</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 主输入区 - 按照 Figma 设计 */}
      <div className="flex items-center gap-2 max-w-4xl mx-auto w-full">
        {/* 左侧：语音按钮 - 圆形 */}
        <button
          onClick={handleVoiceClick}
          className="flex-shrink-0 flex items-center justify-center transition-all"
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            backgroundColor: isVoiceMode ? "#2B5BFF" : "#FFFFFF",
            boxShadow: "5px 0px 6.6px rgba(175, 180, 199, 0.17)",
            border: "none"
          }}
          title={isVoiceMode ? "切换到文字输入" : "切换到语音输入"}
        >
          <Radio className="w-6 h-6" style={{ color: isVoiceMode ? "#FFFFFF" : "#8A8A93" }} />
        </button>
        
        {/* 中间：输入框或按住说话区域 */}
        {isVoiceMode ? (
          <div 
            className="flex-1 cursor-pointer user-select-none"
            style={{
              height: "50px",
              background: "#FFFFFF",
              border: "1px solid #FFFFFF",
              boxShadow: "inset 0px 7px 6px rgba(241, 244, 255, 0.52)",
              borderRadius: "68px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: "24px",
              paddingRight: "24px"
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <span
              style={{
                color: isPressing ? "#2B5BFF" : "#BEC7DB",
                fontSize: "15px",
                fontWeight: 400,
                lineHeight: "18px"
              }}
            >
              {isPressing ? "松开发送" : "按住说话"}
            </span>
          </div>
        ) : (
          <div 
            className="flex-1"
            style={{
              height: "50px",
              background: "#FFFFFF",
              border: "1px solid #FFFFFF",
              boxShadow: "inset 0px 7px 6px rgba(241, 244, 255, 0.52)",
              borderRadius: "68px",
              display: "flex",
              alignItems: "center",
              paddingLeft: "24px",
              paddingRight: "24px"
            }}
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="发消息或按住说话..."
              className="w-full outline-none bg-transparent placeholder-[#BEC7DB]"
              style={{
                border: "none",
                color: "#1A1A1A",
                fontSize: "15px",
                fontWeight: 400,
                lineHeight: "18px"
              }}
            />
          </div>
        )}

        {/* 右侧：图片上传按钮 - 圆形 */}
        {showImageUpload && (
          <label 
            className="flex-shrink-0 flex items-center justify-center cursor-pointer transition-all"
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              backgroundColor: "#FFFFFF",
              boxShadow: "5px 0px 6.6px rgba(175, 180, 199, 0.17)",
              border: "none"
            }}
          >
            <ImageIcon className="w-6 h-6" style={{ color: "#8A8A93" }} />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        )}
      </div>
    </div>
  );
}