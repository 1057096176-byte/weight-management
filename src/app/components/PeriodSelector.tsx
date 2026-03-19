type TimePeriod = "1day" | "7days" | "30days" | "180days";

interface PeriodSelectorProps {
  selected: TimePeriod;
  onChange: (period: TimePeriod) => void;
}

export function PeriodSelector({ selected, onChange }: PeriodSelectorProps) {
  const periods: { value: TimePeriod; label: string }[] = [
    { value: "1day", label: "日" },
    { value: "7days", label: "周" },
    { value: "30days", label: "月" },
    { value: "180days", label: "6个月" },
  ];

  return (
    <div
      className="inline-flex"
      style={{
        backgroundColor: "#F9FAFB",
        borderRadius: "12px",
        padding: "4px",
        gap: "4px"
      }}
    >
      {periods.map((period) => (
        <button
          key={period.value}
          onClick={() => onChange(period.value)}
          style={{
            padding: "6px 16px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: 500,
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s ease",
            backgroundColor: selected === period.value ? "#2B5BFF" : "transparent",
            color: selected === period.value ? "#FFFFFF" : "#8A8A93"
          }}
          onMouseEnter={(e) => {
            if (selected !== period.value) {
              e.currentTarget.style.backgroundColor = "rgba(43, 91, 255, 0.1)";
            }
          }}
          onMouseLeave={(e) => {
            if (selected !== period.value) {
              e.currentTarget.style.backgroundColor = "transparent";
            }
          }}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}