import { useEffect } from "react";
import { useSyncJobListStore } from "@/store/syncJobStore";
import { formatDateSync } from "@/utils/date";
import { StatCard } from "./StatCard";

export const StatSection = () => {
  const { fetchStats, isLoadingStats, totalSuccess, totalFailed, latestSync } =
    useSyncJobListStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const { datePart, timePart } = formatDateSync(latestSync ?? "");

  return (
    <section className="grid grid-cols-3 gap-5 max-md:grid-cols-1">
      <StatCard
        type="success"
        title="연동 성공"
        subtitle="최근 7일간"
        unit="건"
        value={totalSuccess.toLocaleString("ko-KR")}
      />
      <StatCard
        type="error"
        title="연동 실패"
        subtitle="최근 7일간"
        unit="건"
        value={totalFailed.toLocaleString("ko-KR")}
      />
      <StatCard
        type="pending"
        title="마지막 연동"
        subtitle={datePart}
        unit=""
        value={timePart}
      />
    </section>
  );
};
