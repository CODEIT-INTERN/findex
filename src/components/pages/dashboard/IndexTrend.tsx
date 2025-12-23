import { ArrowDown, ArrowUp } from "@untitledui/icons";
import { ProgressBar } from "@/components/common/progress-indicators/ProgressIndicators";

interface Props {
  diff: number;
  rate?: number;
  progressValue?: number;
}

export const IndexTrend = ({ diff, rate, progressValue }: Props) => {
  const isUp = rate > 0 || diff > 0;
  const isDown = rate < 0 || diff < 0;
  // 값에 따른 상태
  const statusColor = isUp
    ? "text-text-success-primary"
    : "text-fg-error-primary";

  const iconColor = isUp ? "#079455" : "#D92D20";

  // 프로그래스바 색상
  const progressColor = isUp
    ? "bg-text-success-primary"
    : "bg-fg-error-primary";

  return (
    <div className="w-full">
      <div className="flex items-center gap-0.5 pb-2">
        {isUp && <ArrowUp size={16} color={iconColor} />}
        {isDown && <ArrowDown size={16} color={iconColor} />}
        <span className={`${statusColor} text-sm font-medium`}>
          {Math.abs(diff).toLocaleString()}
          {rate !== undefined && ` (${rate.toLocaleString()}%)`}
        </span>
      </div>

      {progressValue !== undefined && (
        <ProgressBar
          min={0}
          max={100}
          value={progressValue}
          progressClassName={progressColor}
        />
      )}
    </div>
  );
};
