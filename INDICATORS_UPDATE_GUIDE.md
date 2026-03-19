# 指标更新指南

由于Data.tsx文件太大（2398行），包含15个指标，我会为您提供每个指标的新代码模板。

## 已更新的指标 ✓
1. 步数 (IndicatorCard)
2. 热量 (IndicatorCard) 

## 需要更新的指标：

### 3. 距离 - 使用IndicatorCard
```tsx
<IndicatorCard
  icon={<Zap className="w-4 h-4" />}
  iconColor="#FBBF24"
  iconBg="linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)"
  title="运动距离"
  value={getLatestValue(distanceData["7days"])}
  unit="公里"
  data={distanceData["7days"]}
  chartColor="#FBBF24"
  expanded={expandedIndicator === "distance"}
  onToggle={() => setExpandedIndicator(expandedIndicator === "distance" ? null : "distance")}
  syncStatus="synced"
>
  {/* 展开内容保持不变,只需移除mt-4 */}
</IndicatorCard>
```

### 4. 心率 - 使用IndicatorCard  
```tsx
<IndicatorCard
  icon={<Heart className="w-4 h-4" />}
  iconColor="#EA580C"
  iconBg="linear-gradient(135deg, #FED7AA 0%, #FDBA74 100%)"
  title="心率"
  value={getLatestValue(heartRateData["7days"])}
  unit="bpm"
  data={heartRateData["7days"]}
  chartColor="#EA580C"
  expanded={expandedIndicator === "heartRate"}
  onToggle={() => setExpandedIndicator(expandedIndicator === "heartRate" ? null : "heartRate")}
  syncStatus="synced"
>
  {/* 展开内容 */}
</IndicatorCard>
```

### 5. 血氧 - 使用IndicatorCard
```tsx
<IndicatorCard
  icon={<Droplet className="w-4 h-4" />}
  iconColor="#06B6D4"
  iconBg="linear-gradient(135deg, #A5F3FC 0%, #67E8F9 100%)"
  title="血氧饱和度"
  value={getLatestValue(bloodOxygenData["7days"])}
  unit="%"
  data={bloodOxygenData["7days"]}
  chartColor="#06B6D4"
  expanded={expandedIndicator === "bloodOxygen"}
  onToggle={() => setExpandedIndicator(expandedIndicator === "bloodOxygen" ? null : "bloodOxygen")}
  syncStatus="synced"
>
  {/* 展开内容 */}
</IndicatorCard>
```

### 6. 体温 - 使用IndicatorCard
```tsx
<IndicatorCard
  icon={<Thermometer className="w-4 h-4" />}
  iconColor="#F43F5E"
  iconBg="linear-gradient(135deg, #FECDD3 0%, #FDA4AF 100%)"
  title="体温"
  value={getLatestValue(temperatureData["7days"])}
  unit="°C"
  data={temperatureData["7days"]}
  chartColor="#F43F5E"
  expanded={expandedIndicator === "temperature"}
  onToggle={() => setExpandedIndicator(expandedIndicator === "temperature" ? null : "temperature")}
  syncStatus="synced"
>
  {/* 展开内容 */}
</IndicatorCard>
```

### 7. 压力 - 使用IndicatorCard
```tsx
<IndicatorCard
  icon={<Brain className="w-4 h-4" />}
  iconColor="#8B5CF6"
  iconBg="linear-gradient(135deg, #DDD6FE 0%, #C4B5FD 100%)"
  title="压力指数"
  value={getLatestValue(stressData["7days"])}
  unit=""
  data={stressData["7days"]}
  chartColor="#8B5CF6"
  expanded={expandedIndicator === "stress"}
  onToggle={() => setExpandedIndicator(expandedIndicator === "stress" ? null : "stress")}
  syncStatus="synced"
>
  {/* 展开内容 */}
</IndicatorCard>
```

### 8-12. 睡眠相关 - 使用SleepCard（合并5个指标）
```tsx
<SleepCard
  title="睡眠情况"
  subIndicators={[
    { label: "总时长", value: getLatestValue(totalSleepData["7days"]), unit: "小时" },
    { label: "深睡", value: getLatestValue(deepSleepData["7days"]), unit: "小时" },
    { label: "浅睡", value: getLatestValue(lightSleepData["7days"]), unit: "小时" },
  ]}
  data={totalSleepData["7days"]}
  chartColor="#6366F1"
  expanded={expandedIndicator === "sleep"}
  onToggle={() => setExpandedIndicator(expandedIndicator === "sleep" ? null : "sleep")}
>
  <div className="flex justify-center mb-4">
    <PeriodSelector selected={indicatorPeriod} onChange={setIndicatorPeriod} />
  </div>
  {/* 可以展示多个图表或合并的睡眠质量图 */}
</SleepCard>
```

### 13. 血压 - 使用IndicatorCard (手动记录)
```tsx
<IndicatorCard
  icon={<Activity className="w-4 h-4" />}
  iconColor="#EF4444"
  iconBg="linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)"
  title="血压"
  value={`${getLatestValue(bloodPressureData["7days"], "systolic")}/${getLatestValue(bloodPressureData["7days"], "diastolic")}`}
  unit="mmHg"
  data={bloodPressureData["7days"].map(d => ({ value: d.systolic }))}
  chartColor="#EF4444"
  expanded={expandedIndicator === "blood-pressure"}
  onToggle={() => setExpandedIndicator(expandedIndicator === "blood-pressure" ? null : "blood-pressure")}
  syncStatus="manual"
>
  {/* 展开内容 */}
</IndicatorCard>
```

### 14. 血糖 - 使用IndicatorCard (手动记录)
```tsx
<IndicatorCard
  icon={<Droplet className="w-4 h-4" />}
  iconColor="#10B981"
  iconBg="linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)"
  title="血糖"
  value={getLatestValue(bloodSugarData["7days"], "fasting")}
  unit="mmol/L"
  data={bloodSugarData["7days"].map(d => ({ value: d.fasting }))}
  chartColor="#10B981"
  expanded={expandedIndicator === "blood-sugar"}
  onToggle={() => setExpandedIndicator(expandedIndicator === "blood-sugar" ? null : "blood-sugar")}
  syncStatus="manual"
>
  {/* 展开内容 */}
</IndicatorCard>
```

### 15. 腰围 - 使用IndicatorCard (手动记录)
```tsx
<IndicatorCard
  icon={<Ruler className="w-4 h-4" />}
  iconColor="#F59E0B"
  iconBg="linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)"
  title="腰围"
  value={getLatestValue(waistData["7days"], "waist")}
  unit="cm"
  data={waistData["7days"].map(d => ({ value: d.waist }))}
  chartColor="#F59E0B"
  expanded={expandedIndicator === "waist"}
  onToggle={() => setExpandedIndicator(expandedIndicator === "waist" ? null : "waist")}
  syncStatus="manual"
>
  {/* 展开内容 */}
</IndicatorCard>
```

## 重要提醒
1. 所有原来的展开内容（图表）保持不变
2. 只需将外层的 motion.div 结构替换为对应的Card组件
3. 移除 mt-4，统一使用 mb-4
4. 睡眠相关的5个指标可以合并为一个SleepCard
