// 这个文件包含所有指标的新代码，用于替换Data.tsx中对应的部分

// ========== 距离指标 (替换行 1074-1173) ==========
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
  <div className="flex justify-center mb-4">
    <PeriodSelector selected={indicatorPeriod} onChange={setIndicatorPeriod} />
  </div>
  <div className="h-48">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={distanceData[indicatorPeriod]}>
        <defs>
          <linearGradient id="colorDistance" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FBBF24" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#FBBF24" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#EAEBFF" />
        <XAxis dataKey="date" stroke="#8A8A93" style={{ fontSize: "12px" }} />
        <YAxis stroke="#8A8A93" style={{ fontSize: "12px" }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #EAEBFF",
            borderRadius: "16px",
            fontSize: "12px",
            boxShadow: "0 4px 20px rgba(43, 91, 255, 0.05)"
          }}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="value"
          name="距离(公里)"
          stroke="#FBBF24"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorDistance)"
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
</IndicatorCard>

// ========== 心率指标 (替换行 1174-1265) ==========
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
  <div className="flex justify-center mb-4">
    <PeriodSelector selected={indicatorPeriod} onChange={setIndicatorPeriod} />
  </div>
  <div className="h-48">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={heartRateData[indicatorPeriod]}>
        <CartesianGrid strokeDasharray="3 3" stroke="#EAEBFF" />
        <XAxis dataKey="date" stroke="#8A8A93" style={{ fontSize: "12px" }} />
        <YAxis stroke="#8A8A93" style={{ fontSize: "12px" }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #EAEBFF",
            borderRadius: "16px",
            fontSize: "12px",
            boxShadow: "0 4px 20px rgba(43, 91, 255, 0.05)"
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="value"
          name="心率(bpm)"
          stroke="#EA580C"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
</IndicatorCard>

// ========== 血氧指标 ==========
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
  <div className="flex justify-center mb-4">
    <PeriodSelector selected={indicatorPeriod} onChange={setIndicatorPeriod} />
  </div>
  <div className="h-48">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={bloodOxygenData[indicatorPeriod]}>
        <CartesianGrid strokeDasharray="3 3" stroke="#EAEBFF" />
        <XAxis dataKey="date" stroke="#8A8A93" style={{ fontSize: "12px" }} />
        <YAxis stroke="#8A8A93" style={{ fontSize: "12px" }} domain={[90, 100]} />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #EAEBFF",
            borderRadius: "16px",
            fontSize: "12px",
            boxShadow: "0 4px 20px rgba(43, 91, 255, 0.05)"
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="value"
          name="血氧(%)"
          stroke="#06B6D4"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
</IndicatorCard>

// 体温、压力、睡眠、血压、血糖、腰围等其他指标按照相同模式更新...
