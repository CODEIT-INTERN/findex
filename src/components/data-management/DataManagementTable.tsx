import { useEffect, useMemo, useState } from "react";
import type { SortDescriptor } from "react-aria-components";
import { Edit01, Trash01 } from "@untitledui/icons";
import { Button } from "@/components/common/buttons/Button";
import { Table } from "@/components/common/table/Table";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import type { IndexDataDto } from "@/model/indexData";
import { useIndexDataListStore } from "@/store/indexDataListStore";
import { isActiveSortColumn, sortByDescriptor } from "@/utils/sort";

interface DataManagementTableProps {
  onEdit: (item: IndexDataDto) => void;
  onDelete: (item: IndexDataDto) => void;
}

export default function DataManagementTable({
  onEdit,
  onDelete,
}: DataManagementTableProps) {
  const { items, isLoading, error, hasNext, filters, fetch, fetchNext } =
    useIndexDataListStore();

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
    return sortByDescriptor<IndexDataDto>(items, sortDescriptor);
  }, [items, sortDescriptor]);

  useEffect(() => {
    fetch();
  }, [fetch, filters]);

  const hasNoData = !isLoading && !error && sortedItems.length === 0;

  return (
    <div className="scrollbar-thin flex-1 overflow-auto">
      <Table
        aria-label="데이터 목록"
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
      >
        <Table.Header>
          <Table.Head
            id="date"
            label="날짜"
            isRowHeader
            allowsSorting
            isActive={isActiveSortColumn("date", sortDescriptor)}
          />
          <Table.Head
            id="marketPrice"
            label="시가"
            allowsSorting
            isActive={isActiveSortColumn("marketPrice", sortDescriptor)}
          />
          <Table.Head
            id="closingPrice"
            label="종가"
            allowsSorting
            isActive={isActiveSortColumn("closingPrice", sortDescriptor)}
          />
          <Table.Head
            id="highPrice"
            label="고가"
            allowsSorting
            isActive={isActiveSortColumn("highPrice", sortDescriptor)}
          />
          <Table.Head
            id="lowPrice"
            label="저가"
            allowsSorting
            isActive={isActiveSortColumn("lowPrice", sortDescriptor)}
          />
          <Table.Head
            id="tradingQuantity"
            label="거래량"
            allowsSorting
            isActive={isActiveSortColumn("tradingQuantity", sortDescriptor)}
          />
          <Table.Head
            id="versus"
            label="대비"
            allowsSorting
            isActive={isActiveSortColumn("versus", sortDescriptor)}
          />
          <Table.Head
            id="fluctuationRate"
            label="등락률"
            allowsSorting
            isActive={isActiveSortColumn("fluctuationRate", sortDescriptor)}
          />
          <Table.Head
            id="sourceType"
            label="소스 타입"
            allowsSorting
            isActive={isActiveSortColumn("sourceType", sortDescriptor)}
          />
          <Table.Head id="actions" />
        </Table.Header>

        <Table.Body items={sortedItems}>
          {(item) => (
            <Table.Row id={item.id} key={item.id}>
              <Table.Cell className="min-w-35">{item.baseDate}</Table.Cell>
              <Table.Cell>{item.marketPrice.toLocaleString("kr")}</Table.Cell>
              <Table.Cell>{item.closingPrice}</Table.Cell>
              <Table.Cell>{item.highPrice}</Table.Cell>
              <Table.Cell>{item.lowPrice}</Table.Cell>
              <Table.Cell>
                {item.tradingQuantity.toLocaleString("kr")}
              </Table.Cell>
              <Table.Cell>{item.versus}</Table.Cell>
              <Table.Cell>{item.fluctuationRate}</Table.Cell>
              <Table.Cell>{item.sourceType}</Table.Cell>
              <Table.Cell className="max-w-26">
                <div className="inline-flex justify-end gap-0.5">
                  <Button
                    color="tertiary"
                    iconLeading={Trash01}
                    className="size-7 text-gray-400"
                    onClick={() => onDelete(item)}
                  />
                  <Button
                    color="tertiary"
                    iconLeading={Edit01}
                    className="size-7 text-gray-400"
                    onClick={() => onEdit(item)}
                  />
                </div>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>

      {hasNext && <div ref={loadMoreRef} className="h-4" />}

      <div className="flex flex-col items-center justify-center gap-1 py-2 text-center text-sm text-gray-600">
        {error && <span className="text-red-500">{error.message}</span>}
        {isLoading && <span>불러오는 중...</span>}
      </div>

      {hasNoData && (
        <div className="flex h-[calc(100%-80px)] flex-1 flex-col items-center justify-center text-center">
          <span className="text-disabled">현재 표시할 부서가 없습니다</span>
        </div>
      )}
    </div>
  );
}
