# 健康管理应用 - 设计系统规范

## 1. 颜色规范

### 1.1 主色系（Primary）
蓝绿色系，体现健康与科技感

```css
--primary: #1ABC9C
--primary-foreground: #ffffff
--primary-hover: #16a085
```

**使用场景：**
- 主要按钮（CTA按钮）
- 强调文字
- 重要操作提示
- 链接悬停状态

**Tailwind类名：**
- `bg-primary` - 主色背景
- `text-primary` - 主色文字
- `border-primary` - 主色边框

---

### 1.2 辅色系（Secondary）
柔和蓝色，体现信任与医疗专业

```css
--secondary: #3498DB
--secondary-foreground: #ffffff
--secondary-hover: #2980b9
```

**使用场景：**
- 次级按钮
- 标签
- 信息提示
- 辅助操作

**Tailwind类名：**
- `bg-secondary` - 辅色背景
- `text-secondary` - 辅色文字

---

### 1.3 背景色系

#### 主背景
```css
--background: #F7F9FB
```
浅灰偏蓝，减轻视觉疲劳

#### 卡片背景
```css
--card: #FFFFFF
```
白色卡片，凸显信息层级

**使用场景：**
- `bg-background` - 页面主背景
- `bg-card` / `bg-white` - 卡片背景

---

### 1.4 文字颜色

```css
--text-primary: #222222     /* 标题文字 */
--text-body: #444444         /* 正文内容 */
--text-secondary: #888888    /* 次要信息 */
--text-placeholder: #BBBBBB  /* 占位提示 */
```

**使用示例：**
- 标题：`text-[#222222]`
- 正文：`text-[#444444]`
- 次要信息：`text-[#888888]`
- 占位符：`placeholder:text-[#BBBBBB]`

---

### 1.5 状态颜色（红绿灯机制）

#### 绿灯（良好）
```css
--status-success: #27AE60
```
**使用场景：**
- 数据正常提示
- 成功操作反馈
- 达标指标

#### 黄灯（警示）
```css
--status-warning: #F1C40F
```
**使用场景：**
- 需要关注的数据
- 警告提示
- 临界值提醒

#### 红灯（高危）
```css
--status-danger: #E74C3C
--destructive: #E74C3C
```
**使用场景：**
- 异常数据
- 错误提示
- 高危预警
- 删除操作

**Tailwind类名：**
- `text-green-600` → 使用 `text-[#27AE60]`
- `text-yellow-500` → 使用 `text-[#F1C40F]`
- `text-red-500` → 使用 `text-[#E74C3C]`

---

### 1.6 边框与分割线

```css
--border: #E0E6ED        /* 标准边框 */
--divider: #EDF2F7       /* 分割线 */
```

**使用场景：**
- `border-[#E0E6ED]` - 卡片边框、输入框边框
- `border-[#EDF2F7]` - 内容分割线

---

## 2. 图表颜色

用于数据可视化（Recharts）

```css
--chart-1: #1ABC9C  /* 主色 - 体重趋势 */
--chart-2: #3498DB  /* 辅色 - 次要指标 */
--chart-3: #27AE60  /* 成功 - 达标数据 */
--chart-4: #F1C40F  /* 警告 - 临界数据 */
--chart-5: #E74C3C  /* 危险 - 异常数据 */
```

---

## 3. 按钮规范

### 3.1 主按钮
```tsx
<button className="px-6 py-3 bg-[#1ABC9C] text-white rounded-lg hover:bg-[#16a085] transition-colors">
  确认
</button>
```

**特点：**
- 背景色：`#1ABC9C`
- 文字：白色
- 圆角：`8-12px` (`rounded-lg` / `rounded-xl`)
- 悬停：颜色加深

### 3.2 次按钮
```tsx
<button className="px-6 py-3 border-2 border-[#1ABC9C] text-[#1ABC9C] bg-white rounded-lg hover:bg-[#E8F8F5] transition-colors">
  取消
</button>
```

**特点：**
- 边框：主色描边
- 文字：主色
- 背景：白色/透明
- 悬停：浅色背景

### 3.3 危险按钮
```tsx
<button className="px-6 py-3 bg-[#E74C3C] text-white rounded-lg hover:bg-[#c0392b] transition-colors">
  删除
</button>
```

---

## 4. 表单控件

### 4.1 输入框
```tsx
<input 
  className="w-full px-4 py-3 border-2 border-[#E0E6ED] rounded-lg focus:border-[#1ABC9C] focus:outline-none transition-colors"
  placeholder="请输入..."
/>
```

**特点：**
- 边框：`#E0E6ED`
- 聚焦：`#1ABC9C`
- 圆角：`6px` (`rounded-lg`)
- 占位符：`#BBBBBB`

### 4.2 标签/徽章
```tsx
{/* 主色标签 */}
<span className="px-3 py-1 bg-[#E8F8F5] text-[#1ABC9C] rounded-md text-sm font-medium">
  标签
</span>

{/* 成功标签 */}
<span className="px-3 py-1 bg-green-50 text-[#27AE60] rounded-md text-sm font-medium">
  正常
</span>

{/* 警告标签 */}
<span className="px-3 py-1 bg-yellow-50 text-[#F1C40F] rounded-md text-sm font-medium">
  注意
</span>

{/* 危险标签 */}
<span className="px-3 py-1 bg-red-50 text-[#E74C3C] rounded-md text-sm font-medium">
  异常
</span>
```

---

## 5. 字体规范

### 5.1 字体家族
使用系统默认字体：
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
```

### 5.2 字号层级

| 用途 | 字号 | Tailwind 类 |
|------|------|-------------|
| 页面主标题 | 18-20px | `text-lg` / `text-xl` |
| 模块标题 | 16px | `text-base` |
| 正文内容 | 14px | `text-sm` |
| 辅助说明 | 12px | `text-xs` |

### 5.3 字重

| 用途 | 字重 | Tailwind 类 |
|------|------|-------------|
| 标题/强调 | 500-600 | `font-medium` / `font-semibold` |
| 正文 | 400 | `font-normal` |

---

## 6. 圆角规范

| 用途 | 圆角值 | Tailwind 类 |
|------|--------|-------------|
| 按钮 | 8-12px | `rounded-lg` / `rounded-xl` |
| 卡片 | 12-16px | `rounded-xl` / `rounded-2xl` |
| 输入框 | 6-8px | `rounded-lg` |
| 标签 | 4-6px | `rounded` / `rounded-md` |
| 头像 | 50% | `rounded-full` |

---

## 7. 阴影规范

```tsx
{/* 轻微阴影 - 卡片 */}
<div className="shadow-sm">...</div>

{/* 标准阴影 - 悬浮卡片 */}
<div className="shadow">...</div>

{/* 较深阴影 - 弹窗 */}
<div className="shadow-lg">...</div>

{/* 超大阴影 - 侧边栏 */}
<div className="shadow-xl">...</div>
```

---

## 8. 间距规范

基于 4px 网格系统：

| 用途 | 间距 | Tailwind 类 |
|------|------|-------------|
| 元素内边距（小）| 8px | `p-2` |
| 元素内边距（中）| 12-16px | `p-3` / `p-4` |
| 元素内边距（大）| 24px | `p-6` |
| 元素外边距（小）| 8px | `m-2` |
| 元素外边距（中）| 12-16px | `m-3` / `m-4` |
| 模块间距 | 16-24px | `space-y-4` / `space-y-6` |

---

## 9. 图标规范

### 9.1 图标库
使用 **Lucide React** 图标库

```tsx
import { Heart, Activity, Calendar } from "lucide-react";
```

### 9.2 图标尺寸

| 场景 | 尺寸 | 类名 |
|------|------|------|
| 小图标 | 16px | `w-4 h-4` |
| 标准图标 | 20px | `w-5 h-5` |
| 大图标 | 24px | `w-6 h-6` |
| 超大图标 | 32px | `w-8 h-8` |

### 9.3 图标颜色

应与文字颜色保持一致：
```tsx
{/* 主色图标 */}
<Heart className="w-5 h-5 text-[#1ABC9C]" />

{/* 辅色图标 */}
<Activity className="w-5 h-5 text-[#3498DB]" />

{/* 状态图标 */}
<AlertCircle className="w-5 h-5 text-[#E74C3C]" />
```

---

## 10. 动画规范

使用 **Motion** (Framer Motion) 库

### 10.1 基础动画
```tsx
import { motion } from "motion/react";

{/* 淡入 */}
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  内容
</motion.div>

{/* 上滑淡入 */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  内容
</motion.div>
```

### 10.2 列表动画
```tsx
{items.map((item, index) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
  >
    {item.content}
  </motion.div>
))}
```

---

## 11. 常用组件示例

### 11.1 状态卡片
```tsx
{/* 正常状态 */}
<div className="p-4 bg-green-50 border border-green-200 rounded-xl">
  <div className="flex items-center gap-2 text-[#27AE60]">
    <CheckCircle className="w-5 h-5" />
    <span className="font-medium">数据正常</span>
  </div>
</div>

{/* 警告状态 */}
<div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
  <div className="flex items-center gap-2 text-[#F1C40F]">
    <AlertTriangle className="w-5 h-5" />
    <span className="font-medium">需要关注</span>
  </div>
</div>

{/* 危险状态 */}
<div className="p-4 bg-red-50 border border-red-200 rounded-xl">
  <div className="flex items-center gap-2 text-[#E74C3C]">
    <AlertCircle className="w-5 h-5" />
    <span className="font-medium">异常预警</span>
  </div>
</div>
```

### 11.2 数据卡片
```tsx
<div className="bg-white rounded-xl p-6 border border-[#E0E6ED]">
  <div className="text-sm text-[#888888] mb-1">体重</div>
  <div className="text-2xl font-semibold text-[#222222]">73.5 kg</div>
  <div className="text-xs text-[#27AE60] mt-1">↓ 0.5kg</div>
</div>
```

---

## 12. 响应式设计

### 12.1 断点
```css
sm: 640px   /* 小屏幕 */
md: 768px   /* 平板 */
lg: 1024px  /* 桌面 */
xl: 1280px  /* 大屏幕 */
```

### 12.2 容器
```tsx
<div className="max-w-4xl mx-auto px-4">
  {/* 内容限制最大宽度，居中显示 */}
</div>
```

---

## 13. 无障碍设计

### 13.1 对比度
- 确保文字与背景对比度 ≥ 4.5:1
- 主色 `#1ABC9C` 在白色背景上符合 WCAG AA 标准

### 13.2 焦点状态
```tsx
<button className="focus:outline-none focus:ring-2 focus:ring-[#1ABC9C] focus:ring-offset-2">
  按钮
</button>
```

---

## 14. 使用建议

### ✅ 推荐做法
1. 优先使用设计系统中定义的颜色
2. 保持一致的圆角和间距
3. 使用语义化的颜色（成功用绿色，警告用黄色，错误用红色）
4. 为交互元素添加过渡动画
5. 保持视觉层级清晰

### ❌ 避免做法
1. 不要随意使用新颜色
2. 避免过多的动画效果
3. 不要让重要信息淹没在装饰中
4. 避免过小的点击区域（最小 44x44px）
5. 不要忽略加载和错误状态

---

## 15. 更新日志

**2026-02-27**
- 初始化设计系统
- 应用健康管理风格配色方案
- 定义主色（#1ABC9C）和辅色（#3498DB）
- 建立红绿灯状态色机制
