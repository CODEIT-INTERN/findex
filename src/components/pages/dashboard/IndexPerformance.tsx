import { useEffect, useState } from "react";
import { getIndexPerformanceRank } from "@/api/indexDataApi";
import { Select } from "@/components/common/select/Select";
import { Table } from "@/components/common/table/Table";
import {
  DateUnitOptions,
  type DateUnitKey,
} from "@/constants/dashboardOptions";
import type { IndexPerformanceResponse } from "@/model/dashboard";
import { IndexTrend } from "./IndexTrend";

const IndexPerformance = () => {
  const [selectedId, setSelectedId] = useState<number>(DateUnitOptions[0].id);
  const [rankData, setRankData] = useState<IndexPerformanceResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  // 현재 선택된 ID에 해당하는 periodType (DAILY, WEEKLY 등)
  const currentPeriodType = (DateUnitOptions.find(
    (opt) => opt.id === selectedId,
  )?.value || "DAILY") as DateUnitKey;

  // 지수 성과 로드
  const fetchRankData = async (period: string) => {
    setIsLoading(true);
    try {
      const response = await getIndexPerformanceRank({
        periodType: period as any,
        limit: 10,
      });
      setRankData(response);
    } catch (error) {
      console.error("랭킹 조회 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 기간 변경 시 데이터 리로딩
  useEffect(() => {
    fetchRankData(currentPeriodType);
  }, [currentPeriodType]);

  const handleUnitChange = (id: number) => {
    setSelectedId(id);
  };

  const hasNoData = !isLoading && !error && rankData.length === 0;

  // 현재 선택된 id를 바탕으로 백엔드용 string key(value)를 찾음
  // const selectedValue = DateUnitOptions.find((opt) => opt.id === selectedId)
  //   ?.value as DateUnitKey;

  // const handleUnitChange = (id: number) => {
  //   setSelectedId(id);
  //   const apiValue = DateUnitOptions.find((opt) => opt.id === id)?.value;
  //   console.log("백엔드로 보낼 키:", apiValue);
  // };
  return (
    <div className="flex flex-col rounded-xl bg-white shadow-xs">
      <div className="border-secondary flex w-full justify-between border-b px-6 py-5">
        <span className="text-lg font-semibold">지수 성과</span>
        <Select
          items={DateUnitOptions}
          aria-label="지수 성과 조회 단위 선택"
          defaultValue={DateUnitOptions[0].id}
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
      {hasNoData ? (
        <p className="text-text-tertiary flex h-72 w-full items-center justify-center text-sm font-semibold">
          데이터가 없습니다.
        </p>
      ) : (
        <Table aria-label="데이터 목록">
          <Table.Header>
            <Table.Head id="rank" label="순위" />
            <Table.Head id="indexName" label="지수" />
            <Table.Head id="versus" label="대비" />
            <Table.Head id="fluctuationRate" label="등락률" />
            <Table.Head id="currentPrice" label="현재" />
            <Table.Head id="beforePrice" label="이전" />
          </Table.Header>

          <Table.Body items={rankData}>
            {(item) => (
              <Table.Row
                id={item.performance.indexInfoId}
                key={item.performance.indexInfoId}
              >
                <Table.Cell>{item.rank}</Table.Cell>
                <Table.Cell>
                  <div className="flex flex-col">
                    <p className="text-text-primary text-sm font-medium">
                      {item.performance.indexClassification}
                    </p>
                    <p>{item.performance.indexName}</p>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <IndexTrend diff={item.performance.versus} />
                </Table.Cell>
                <Table.Cell>
                  <IndexTrend rate={item.performance.fluctuationRate} />
                </Table.Cell>
                <Table.Cell>
                  {item.performance.currentPrice.toLocaleString()}
                </Table.Cell>
                <Table.Cell>
                  {item.performance.beforePrice.toLocaleString()}
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      )}
    </div>
  );
};

export default IndexPerformance;
