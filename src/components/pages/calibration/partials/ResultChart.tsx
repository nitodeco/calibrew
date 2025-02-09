import { FC } from "react";
import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CalibrationHistoryEntry } from "@/hooks/use-store";

interface ResultHistoryChartProps {
  history: CalibrationHistoryEntry[];
}

export const ResultHistoryChart: FC<ResultHistoryChartProps> = ({
  history,
}) => {
  const chartData = history
    .map((entry, index) => ({
      step: `Step ${index + 1}`,
      tasteBalance: entry.formData.tasteBalance,
      grindSize: entry.formData.grindSize,
    }))
    .reverse();

  const chartConfig = {
    tasteBalance: {
      label: "Taste Balance",
      color: "hsl(var(--chart-1))",
    },
    grindSize: {
      label: "Grind Size",
      color: "hsl(var(--chart-2))",
    },
  };

  if (history.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center py-4">
        Previous extractions will be shown here
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="h-[200px]">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 16,
                right: 16,
                bottom: 16,
                left: 16,
              }}
            >
              <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
              <XAxis
                dataKey="step"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={[0, 100]}
                stroke="hsl(var(--muted-foreground))"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="tasteBalance"
                stroke="hsl(var(--chart-1))"
                fill="hsl(var(--chart-1))"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="grindSize"
                stroke="hsl(var(--chart-2))"
                fill="hsl(var(--chart-2))"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Last {chartData.length} attempts</span>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          <span>
            {chartData[chartData.length - 1]?.tasteBalance === 50
              ? "Perfect balance"
              : "Getting closer to perfect balance"}
          </span>
        </div>
      </div>
    </div>
  );
};
