import { useEffect, useState } from "react";
import { getIndexChart } from "@/api/dashboardApi";
import { Select } from "@/components/common/select/Select";
import { PeriodOptions, type PeriodKey } from "@/constants/dashboardOptions";
import type { IndexChartResponse } from "@/model/dashboard";
import { IndexLineChart } from "./IndexLineChart";

const IndexChart = () => {
  const [selectedPeriodId, setSelectedPeriodId] = useState<number>(
    PeriodOptions[0].id,
  );
  const [chartData, setChartData] = useState<IndexChartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // TODO: 현재 선택된 지수 ID (임시로 1번, 실제로는 상위 컴포넌트나 지수 선택 Select에서 받아와야 함)
  const [indexInfoId, setIndexInfoId] = useState<number>(120);

  // 현재 선택된 id를 바탕으로 백엔드용 string key(selectedValue) 도출
  const selectedValue = (PeriodOptions.find(
    (opt) => opt.id === selectedPeriodId,
  )?.value || "DAILY") as PeriodKey;

  // API 호출 로직
  const fetchChartData = async (id: number, period: PeriodKey) => {
    setIsLoading(true);
    try {
      // API 응답이 배열로 정의되어 있으므로 [0] 혹은 적절한 처리가 필요함
      const response = await getIndexChart(id, { periodType: period as never });
      const result = Array.isArray(response) ? response[0] : response;

      setChartData(result);
    } catch (error) {
      console.error("차트 데이터 로드 실패:", error);
      setChartData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 지수 ID나 기간이 바뀔 때마다 데이터 리로딩
  useEffect(() => {
    fetchChartData(indexInfoId, selectedValue);
  }, [indexInfoId, selectedValue]);

  const handleUnitChange = (id: number) => {
    setSelectedPeriodId(id);
  };
  // const handleUnitChange = (id: number) => {
  //   setSelectedId(id);
  //   const apiValue = PeriodOptions.find((opt) => opt.id === id)?.value;
  //   console.log("백엔드로 보낼 키:", apiValue);
  // };
  return (
    <div className="flex flex-col rounded-xl bg-white shadow-xs">
      <div className="border-secondary flex w-full justify-between border-b px-6 py-5">
        <span className="text-lg font-semibold">지수 차트</span>
        <Select
          items={PeriodOptions}
          aria-label="지수 차트 조회 단위 선택"
          defaultValue={PeriodOptions[0].id}
          onChange={(key) => handleUnitChange(Number(key))}
          className="w-28"
        >
          {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
        </Select>
        {/* <Select
            items={summaries}
            aria-label="지수 선택"
            popoverClassName="scrollbar-thin"
            defaultValue={summaries[0].id}
            searchable
            onChange={(key) => handleIndexSelectChange(key as number)}
            className="w-42"
          >
            {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
          </Select> */}
      </div>
      <div className="p-6">
        {isLoading ? (
          <div className="text-text-tertiary">데이터 로딩 중...</div>
        ) : chartData &&
          chartData.dataPoints &&
          chartData.dataPoints.length > 0 ? (
          <IndexLineChart data={chartData} />
        ) : (
          <p className="text-text-tertiary flex h-72 w-full items-center justify-center text-sm font-semibold">
            지수를 선택해주세요.
          </p>
        )}
      </div>
    </div>
  );
};

export default IndexChart;
