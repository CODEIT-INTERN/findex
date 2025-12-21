import { useEffect, useMemo, useState } from "react";
import type { SortDescriptor } from "react-aria-components";
import { Edit01, RefreshCcw05, Trash01 } from "@untitledui/icons";
import { deleteIndexData } from "@/api/indexDataApi";
import { Button } from "@/components/common/buttons/Button";
import { Table } from "@/components/common/table/Table";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import type { IndexDataDto } from "@/model/indexData";
import type { Index } from "@/pages/DataManagement";
import { useIndexDataListStore } from "@/store/indexDataListStore";
import { useModalStore } from "@/store/modalStore";
import { useToastStore } from "@/store/toastStore";
import { isActiveSortColumn, sortByDescriptor } from "@/utils/sort";
import { Empty } from "../common/Empty";

interface DataManagementTableProps {
  index: Index | null;
}

export default function DataManagementTable({
  index,
}: DataManagementTableProps) {
  const { items, isLoading, error, hasNext, filters, fetch, fetchNext } =
    useIndexDataListStore();
  const { successToast, errorToast } = useToastStore();
  const { openConfirm, openIndexDataForm, openIndexDataSync, close } =
    useModalStore();

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

  // 지수 데이터 삭제
  const handleDeleteIndexData = async (id: number) => {
    if (!id) return;
    try {
      await deleteIndexData(id);
      successToast("성공적으로 삭제되었습니다.");
      await fetch();
    } catch (error) {
      console.log(error);
      errorToast("삭제에 실패하였습니다.");
    } finally {
      close();
    }
  };

  // 지수 상세 모달 열기
  const handleRowClick = (indexData: IndexDataDto) => {
    openIndexDataForm({
      mode: "view",
      initial: indexData,
    });
  };

  // 지수 삭제 핸들러
  const handleDeleteClick = (id: number) => {
    openConfirm({
      title: "지수 데이터 삭제",
      description: "정말로 이 지수 데이터를 삭제하겠습니다까?",
      onConfirm: () => {
        handleDeleteIndexData(id);
      },
    });
  };

  // 지수 수정 모달 열기
  const handleEditClick = (indexData: IndexDataDto) => {
    openIndexDataForm({
      mode: "edit",
      initial: indexData,
    });
  };

  // 지수 연동 클릭
  const handleSyncApiClick = () => {
    if (!index) return;
    openIndexDataSync({
      index: index,
    });
  };

  useEffect(() => {
    void fetch();
  }, [fetch, filters]);

  const hasNoData = !isLoading && !error && sortedItems.length === 0;

  return (
    <div className="scrollbar-thin flex flex-1 flex-col overflow-auto">
      <Table
        aria-label="데이터 목록"
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
        selectionMode="none"
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
            <Table.Row
              id={item.id}
              key={item.id}
              onAction={() => handleRowClick(item)}
              className="hover:cursor-pointer"
            >
              <Table.Cell className="min-w-35">{item.baseDate}</Table.Cell>
              <Table.Cell>
                {item.marketPrice.toLocaleString("ko-KR")}
              </Table.Cell>
              <Table.Cell>{item.closingPrice}</Table.Cell>
              <Table.Cell>{item.highPrice}</Table.Cell>
              <Table.Cell>{item.lowPrice}</Table.Cell>
              <Table.Cell>
                {item.tradingQuantity.toLocaleString("ko-KR")}
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
                    onClick={() => handleDeleteClick(item.id)}
                  />
                  <Button
                    color="tertiary"
                    iconLeading={Edit01}
                    className="size-7 text-gray-400"
                    onClick={() => handleEditClick(item)}
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
        <div className="flex flex-1 flex-col items-center justify-center">
          <Empty
            message="등록된 데이터가 없습니다"
            button={
              <Button
                iconLeading={<RefreshCcw05 size={20} />}
                onClick={handleSyncApiClick}
              >
                Open API 연동
              </Button>
            }
          />
        </div>
      )}
    </div>
  );
}
