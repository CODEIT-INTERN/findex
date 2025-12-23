import { useMemo, useState } from "react";
import type { SortDescriptor } from "react-aria-components";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import type { SyncJobDto } from "@/model/sync";
import { useIndexInfoSummaryStore } from "@/store/indexInfoSummaryStore";
import { useSyncJobListStore } from "@/store/syncJobStore";
import { formatDateSync } from "@/utils/date";
import { isActiveSortColumn, sortByDescriptor } from "@/utils/sort";
import { Badge } from "../../common/badges/Badge";
import { Empty } from "../../common/Empty";
import { Table } from "../../common/table/Table";

export const SyncHistoryTable = () => {
  const {
    items: histories,
    fetchNext,
    isLoading,
    hasNext,
    error,
  } = useSyncJobListStore();
  const { items: summaries } = useIndexInfoSummaryStore();

  // 테이블 정렬
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "date",
    direction: "descending",
  });

  // 무한 스크롤 유틸
  const { loadMoreRef } = useInfiniteScroll({
    hasNext,
    isLoading,
    onLoadMore: fetchNext,
    rootMargin: "0px 0px 200px 0px",
  });

  // 아이템 정렬
  const sortedItems = useMemo(() => {
    return sortByDescriptor<SyncJobDto>(histories, sortDescriptor);
  }, [histories, sortDescriptor]);

  const getIndexInfo = (indexInfoId: number) => {
    const indexInfo = summaries.find((summary) => summary.id === indexInfoId);
    return indexInfo;
  };

  return (
    <div className="scrollbar-thin flex flex-1 flex-col overflow-auto bg-white">
      <Table
        aria-label="데이터 목록"
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
        selectionMode="none"
      >
        <Table.Header>
          <Table.Head id="type" label="유형" isRowHeader />
          <Table.Head id="index" label="지수" />
          <Table.Head
            id="targetDate"
            label="대상 날짜"
            allowsSorting
            isActive={isActiveSortColumn("targetDate", sortDescriptor)}
          />
          <Table.Head id="worker" label="작업자" />
          <Table.Head
            id="jobTime"
            label="작업 일시"
            allowsSorting
            isActive={isActiveSortColumn("jobTime", sortDescriptor)}
          />
          <Table.Head id="tradingQuantity" label="처리 결과" />
        </Table.Header>

        <Table.Body items={sortedItems}>
          {(item) => {
            const targetDate = item.targetDate
              ? formatDateSync(item.targetDate).datePart
              : "날짜 정보 없음";
            const jobTime = item.jobTime
              ? formatDateSync(item.jobTime).datePart
              : "날짜 정보 없음";

            return (
              <Table.Row id={item.id} key={item.id}>
                <Table.Cell className="min-w-35">
                  <Badge kind="job" value={item.jobType} />
                </Table.Cell>
                <Table.Cell>
                  <div>
                    <p className="text-sm leading-5 font-medium">
                      {getIndexInfo(item.indexInfoId)?.indexName}
                    </p>
                    <p className="text-quaternary text-sm leading-5 font-normal">
                      {getIndexInfo(item.indexInfoId)?.indexClassification}
                    </p>
                  </div>
                </Table.Cell>
                <Table.Cell>{targetDate}</Table.Cell>
                <Table.Cell>{item.worker}</Table.Cell>
                <Table.Cell>{jobTime}</Table.Cell>
                <Table.Cell>
                  <Badge kind="result" value={item.result} />
                </Table.Cell>
              </Table.Row>
            );
          }}
        </Table.Body>
      </Table>

      {hasNext && <div ref={loadMoreRef} className="h-4" />}

      <div className="flex flex-col items-center justify-center gap-1 py-2 text-center text-sm text-gray-600">
        {error && <span className="text-red-500">{error.message}</span>}
        {isLoading && <span>불러오는 중...</span>}
      </div>

      {!isLoading && histories.length === 0 && (
        <div className="flex flex-1 flex-col items-center justify-center">
          <Empty message="연동 이력이 없습니다." />
        </div>
      )}
    </div>
  );
};
