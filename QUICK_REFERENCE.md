# 快速参考卡片 🚀

## 📱 页面访问

| 页面 | 路径 | 功能 |
|------|------|------|
| 信息绑定 | `/bind` | 一键绑定用户 |
| 首页 | `/` | 主要入口 |
| 智能导诊 | `/triage` | 健康评估 |
| 医生分身 | `/doctor/:id` | 专业问诊 |
| 干预方案 | `/plan` | 查看方案 |
| 打卡中心 | `/checkin` | 每日打卡 |
| 数据分析 | `/data` | 趋势图表 |
| 个人中心 | `/profile` | 用户设置 |

---

## 🎭 用户状态

| 状态代码 | 说明 | 显示内容 |
|---------|------|---------|
| `new` | 新用户 | 欢迎引导 + 开始导诊 |
| `no_plan` | 无方案 | "立即进行智能导诊，获取专属体重管理方案" |
| `has_plan` | 有方案 | 方案名称 + 执行天数 + 任务进度 |

**切换状态**：
```typescript
// 在 /src/app/pages/Home.tsx 第16行
const userStatus = "has_plan"; // 改成你需要的状态
```

---

## 🎨 首页布局（从上到下）

```
1. [顶部导航] ≡ 菜单 + 标题
2. [医生卡片] 问候语（左）+ 头像（右）
3. [状态卡片] 根据用户状态显示不同内容
4. [常见问题] 3个快捷提问按钮
5. [聊天消息] 对话历史
6. [功能入口栏] 横向滚动，3个彩色按钮
7. [底部输入框] 文本 + 语音 + 发送
```

---

## 🚀 功能入口栏（3个）

| 序号 | 功能 | 颜色 | 路径 |
|------|------|------|------|
| 1 | 📅 今日打卡 | 蓝色 | /checkin |
| 2 | 🩺 智能导诊 | 紫色 | /triage |
| 3 | 📊 数据 | 绿色 | /data |

**特点**：
- 横向滑动查看
- 左图标 + 右名称
- 自动隐藏滚动条

---

## 📂 侧边栏内容

### 点击左上角菜单打开

**1. 用户信息**
- 头像 + 姓名
- 状态说明

**2. 主要功能**
- 📩 消息（带未读提示）
- 🩺 智能导诊
- 📅 今日打卡
- 📊 数据与预警
- ⚙️ 个人中心

**3. 历史记录**
- 最近使用医生分身
- 最近对话记录

---

## 💬 智能回复关键词

| 用户输入 | AI回复主题 |
|---------|-----------|
| 减重、减肥 | 科学减重建议 |
| 饮食、吃什么、食谱 | 健康饮食指导 |
| 运动、锻炼 | 运动方案推荐 |
| 打卡、记录 | 打卡功能介绍 |
| 导诊、咨询 | 导诊流程说明 |
| 其他 | 通用回复 |

---

## 🎤 语音输入

**使用步骤**：
1. 点击麦克风图标
2. 选择模式：
   - 发送语音
   - 语音转文字
3. 开始录音
4. 自动处理发送

---

## 📊 方案信息配置

```typescript
// 在 /src/app/pages/Home.tsx 第30行
const planInfo = {
  name: "轻盈计划",           // 方案名称
  daysRunning: 15,            // 执行天数
  estimatedCompletion: "2026年5月26日",  // 预计完成
  todayProgress: 65,          // 今日进度(%)
};
```

---

## 🎯 常见问题配置

```typescript
// 在 /src/app/pages/Home.tsx 第38行
const commonQuestions = [
  "如何科学减重？",
  "今天吃什么比较健康？",
  "适合我的运动方案"
];
```

---

## 🛠️ 关键组件

| 组件 | 文件 | 功能 |
|------|------|------|
| Home | pages/Home.tsx | 首页主逻辑 |
| Bind | pages/Bind.tsx | 信息绑定 |
| Sidebar | components/Sidebar.tsx | 侧边栏 |
| QuickActions | components/QuickActions.tsx | 功能入口栏 |
| ChatInput | components/ChatInput.tsx | 输入框 |
| ChatMessage | components/ChatMessage.tsx | 消息展示 |

---

## 📝 快速修改指南

### 修改用户名
```typescript
// Sidebar.tsx 第51行
<div className="font-medium">你的名字</div>
```

### 修改问候语
```typescript
// Home.tsx 第163行
{isNewUser ? "您好！..." : "你的问候语"}
```

### 修改方案名称
```typescript
// Home.tsx 第30行
name: "你的方案名称",
```

### 添加功能入口
```typescript
// QuickActions.tsx 第5行
{
  icon: YourIcon,
  label: "功能名",
  to: "/path",
  bgColor: "bg-gradient-to-r from-color-500 to-color-600",
}
```

---

## 🎨 颜色渐变类

```css
/* 蓝色 */
bg-gradient-to-r from-blue-500 to-blue-600

/* 紫色 */
bg-gradient-to-r from-purple-500 to-purple-600

/* 绿色 */
bg-gradient-to-r from-green-500 to-green-600

/* 橙色 */
bg-gradient-to-r from-orange-500 to-orange-600

/* 粉色 */
bg-gradient-to-r from-pink-500 to-pink-600

/* 红色 */
bg-gradient-to-r from-red-500 to-red-600
```

---

## 🔧 调试技巧

### 查看不同用户状态
```typescript
// 首页 Home.tsx 第16行
const userStatus = "new";      // 新用户界面
const userStatus = "no_plan";  // 无方案界面
const userStatus = "has_plan"; // 有方案界面
```

### 修改今日进度
```typescript
// 首页 Home.tsx 第35行
todayProgress: 80,  // 改成 0-100 的数字
```

### 添加聊天消息
```typescript
// 首页 Home.tsx 第20行
messages 数组中添加：
{
  id: "msg_id",
  message: "你的消息内容",
  isUser: true,  // true=用户, false=AI
  time: "14:30",
}
```

---

## 📱 测试场景

### 场景1：新用户首次使用
1. 访问 `/bind`
2. 点击"一键绑定"
3. 等待绑定完成
4. 跳转到首页（new状态）
5. 查看欢迎引导
6. 点击"开始智能导诊"

### 场景2：老用户查看进度
1. 设置 `userStatus = "has_plan"`
2. 刷新首页
3. 查看方案状态卡片
4. 点击"去打卡"或"查看数据"

### 场景3：语音输入测试
1. 点击输入框的麦克风图标
2. 选择"语音转文字"
3. 开始录音
4. 查看转换结果

### 场景4：侧边栏功能
1. 点击左上角菜单
2. 查看用户信息和功能列表
3. 点击"最近使用医生分身"
4. 跳转到医生详情页

---

## 🚀 性能优化建议

1. **图片优化**：使用 WebP 格式
2. **懒加载**：长列表使用虚拟滚动
3. **代码分割**：路由级别的代码分割
4. **缓存策略**：缓存常用数据
5. **减少重渲染**：使用 React.memo

---

## 📚 相关文档

| 文档 | 内容 |
|------|------|
| COMPLETE_GUIDE.md | 完整使用指南 |
| HOME_PAGE_GUIDE.md | 首页详细说明 |
| QUICK_ACTIONS_DESIGN.md | 功能入口栏设计 |
| UPDATE_SUMMARY.md | 更新说明 |
| FINAL_UPDATE.md | 最终总结 |

---

## ✅ 检查清单

开发完成前检查：

- [ ] 所有用户状态都能正常显示
- [ ] 常见问题能正确触发回复
- [ ] 功能入口栏可以滑动
- [ ] 侧边栏能正常打开关闭
- [ ] 语音功能有提示
- [ ] 绑定页面流程完整
- [ ] 所有路由都能访问
- [ ] 响应式布局正常
- [ ] 动画效果流畅
- [ ] 无控制台错误

---

## 🎉 完成！

所有功能已实现，可以开始使用和测试了！
