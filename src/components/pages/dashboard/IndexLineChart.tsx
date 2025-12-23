import {
  Area,
  AreaChart,
  CartesianGrid,
  Label,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { ChartLegendContent } from "@/components/common/charts/ChartsBase";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import type { IndexChartResponse } from "@/model/dashboard";
import { cx } from "@/utils/cx";

interface IndexLineChartProps {
  data: IndexChartResponse;
}

export const IndexLineChart = ({ data }: IndexLineChartProps) => {
  const isDesktop = useBreakpoint("lg");

  // 최신순으로 오는 데이터를 시간 순서(과거 -> 현재)로 뒤집고 하나로 합침
  const combinedData = [...data.dataPoints].reverse().map((point) => {
    const ma5Point = data.ma5DataPoints?.find((m) => m.date === point.date);
    const ma20Point = data.ma20DataPoints?.find((m) => m.date === point.date);

    return {
      date: point.date,
      close: point.value,
      ma5: ma5Point?.value,
      ma20: ma20Point?.value,
    };
  });

  if (!combinedData.length) {
    return (
      <div className="text-tertiary flex h-72 items-center justify-center">
        데이터가 없습니다.
      </div>
    );
  }

  const colors: Record<string, string> = {
    A: "text-[#6172F3]",
    B: "text-[#FF4405]",
    C: "text-[#36BFFA]",
  };

  return (
    <div className="flex h-72 flex-col gap-2">
      <ResponsiveContainer className="h-full">
        <AreaChart
          data={combinedData}
          className="text-tertiary [&_.recharts-text]:text-xs"
          margin={{
            top: isDesktop ? 12 : 6,
            bottom: isDesktop ? 16 : 0,
          }}
        >
          <CartesianGrid
            vertical={false}
            stroke="currentColor"
            className="text-utility-gray-100"
          />
          <Legend
            align="center"
            verticalAlign="bottom"
            layout="horizontal"
            content={<ChartLegendContent className="-translate-y-2" />}
            wrapperStyle={{
              paddingTop: "32px",
            }}
          />

          <XAxis
            fill="currentColor"
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
            dataKey="date"
            // 2025-12-04 -> 12.04 형식으로 포맷팅
            tickFormatter={(value: string) => {
              const parts = value.split("-");
              return parts.length >= 3 ? `${parts[1]}.${parts[2]}` : value;
            }}
            padding={{ left: 0, right: 0 }}
          ></XAxis>

          <YAxis
            fill="currentColor"
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
            tickFormatter={(value) => Number(value).toLocaleString()}
            domain={["auto", "auto"]}
          ></YAxis>

          <Area
            isAnimationActive={false}
            className={cx(
              colors["A"],
              "[&_.recharts-area-area]:translate-y-1.5 [&_.recharts-area-area]:[clip-path:inset(0_0_6px_0)]",
            )}
            dataKey="close"
            name="종가"
            type="monotone"
            stroke="currentColor"
            strokeWidth={2}
            fill="url(#gradient)"
            fillOpacity={0.1}
            activeDot={{
              className: "fill-bg-primary stroke-[#6172F3] stroke-2",
            }}
          />

          <Area
            isAnimationActive={false}
            className={cx(
              colors["B"],
              "[&_.recharts-area-area]:translate-y-1.5 [&_.recharts-area-area]:[clip-path:inset(0_0_6px_0)]",
            )}
            dataKey="ma5"
            name="5일 평균"
            type="monotone"
            stroke="currentColor"
            strokeWidth={2}
            fill="none"
            activeDot={{
              className: "fill-bg-primary stroke-[#FF4405] stroke-2",
            }}
          />

          <Area
            isAnimationActive={false}
            className={cx(
              colors["C"],
              "[&_.recharts-area-area]:translate-y-1.5 [&_.recharts-area-area]:[clip-path:inset(0_0_6px_0)]",
            )}
            dataKey="ma20"
            name="20일 이동 평균"
            type="monotone"
            stroke="currentColor"
            strokeWidth={2}
            fill="none"
            activeDot={{
              className: "fill-bg-primary stroke-[#36BFFA] stroke-2",
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
