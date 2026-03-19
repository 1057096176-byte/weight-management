import { ResponsiveContainer } from "recharts";
import { ReactNode } from "react";

interface SafeResponsiveContainerProps {
  width?: string | number;
  height?: string | number;
  minHeight?: number;
  children: ReactNode;
}

export function SafeResponsiveContainer({ 
  width = "100%", 
  height = "100%",
  minHeight,
  children 
}: SafeResponsiveContainerProps) {
  return (
    <ResponsiveContainer 
      width={width} 
      height={height}
      minHeight={minHeight}
      debounce={1}
    >
      {children}
    </ResponsiveContainer>
  );
}
