import { useEffect, useMemo, useState } from "react";
import type { SortDescriptor } from "react-aria-components";
import { Edit01, RefreshCcw05, Star01, Trash01 } from "@untitledui/icons";
import { Button } from "@/components/common/buttons/Button";
import { Empty } from "@/components/common/Empty";
import ConfirmModal from "@/components/common/modals/ConfirmModal";
import { Table } from "@/components/common/table/Table";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import type { IndexInfoResponse } from "@/model/indexInfo";
import { useIndexIndexListStore } from "@/store/indexInfoListStore";
import { isActiveSortColumn, sortByDescriptor } from "@/utils/sort";

const IndexTable = () => {
  const { items, isLoading, error, hasNext, filters, fetch, fetchNext } =
    useIndexIndexListStore();

  // 테이블 정렬
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "indexClassification",
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
    return sortByDescriptor<IndexInfoResponse>(items, sortDescriptor);
  }, [items, sortDescriptor]);

  useEffect(() => {
    fetch();
  }, [fetch, filters]);

  const hasNoData = !isLoading && !error && sortedItems.length === 0;

  // 모달 상태들
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isLinkModalOpen, setLinkModalOpen] = useState(false);

  // 삭제 핸들러
  const handleDelete = () => {
    setDeleteModalOpen(false);
  };
  // 연동 핸들러
  const handleLink = () => {
    setLinkModalOpen(false);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {hasNoData ? (
        <div className="flex flex-1 items-center justify-center">
          <Empty
            message="등록된 지수 정보가 없습니다."
            button={
              <Button
                iconLeading={<RefreshCcw05 size={20} stroke="white" />}
                showTextWhileLoading
                onClick={() => setLinkModalOpen(true)}
              >
                Open API 연동
              </Button>
            }
          />
        </div>
      ) : (
        <div className="scrollbar-thin flex-1 overflow-auto">
          <Table
            aria-label="데이터 목록"
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
          >
            <Table.Header>
              <Table.Head
                id="indexClassification"
                label="분류"
                isRowHeader
                allowsSorting
                isActive={isActiveSortColumn(
                  "indexClassification",
                  sortDescriptor,
                )}
              />
              <Table.Head
                id="indexName"
                label="지수"
                allowsSorting
                isActive={isActiveSortColumn("indexName", sortDescriptor)}
              />
              <Table.Head
                id="employedItemsCount"
                label="채용 종목 수"
                allowsSorting
                isActive={isActiveSortColumn(
                  "employedItemsCount",
                  sortDescriptor,
                )}
              />
              <Table.Head
                id="basePointInTime"
                label="기준 시점"
                allowsSorting
                isActive={isActiveSortColumn("basePointInTime", sortDescriptor)}
              />
              <Table.Head
                id="baseIndex"
                label="기준 지수"
                allowsSorting
                isActive={isActiveSortColumn("baseIndex", sortDescriptor)}
              />
              <Table.Head
                id="sourceType"
                label="소스 타입"
                allowsSorting
                isActive={isActiveSortColumn("sourceType", sortDescriptor)}
              />
              <Table.Head
                id="favorite"
                label="즐겨찾기"
                allowsSorting
                isActive={isActiveSortColumn("favorite", sortDescriptor)}
              />
              <Table.Head id="actions" />
            </Table.Header>

            <Table.Body items={sortedItems}>
              {(item) => (
                <Table.Row id={item.id} key={item.id}>
                  <Table.Cell>{item.indexClassification}</Table.Cell>
                  <Table.Cell>{item.indexName}</Table.Cell>
                  <Table.Cell>{item.employedItemsCount}</Table.Cell>
                  <Table.Cell>{item.basePointInTime}</Table.Cell>
                  <Table.Cell>{item.baseIndex}</Table.Cell>
                  <Table.Cell>{item.sourceType}</Table.Cell>
                  <Table.Cell>
                    {item.favorite ? (
                      <Star01 size={20} stroke="#FDB022" fill="#FDB022" />
                    ) : (
                      <Star01 size={20} stroke="#E9EAEB" fill="#E9EAEB" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex justify-end gap-0.5">
                      <Button
                        color="tertiary"
                        iconLeading={Trash01}
                        onClick={() => setDeleteModalOpen(true)}
                      />
                      <Button
                        color="tertiary"
                        iconLeading={Edit01}
                        onClick={() => setLinkModalOpen(true)}
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
        </div>
      )}

      {/* -------------------------모달------------------------ */}
      {/* 삭제 컨펌 모달 */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="지수 정보 삭제"
      >
        <p className="text-sm text-gray-500">
          정말로 이 지수 정보를 삭제하시겠습니까?
        </p>
      </ConfirmModal>

      {/* 연동 컨펌 모달 */}
      <ConfirmModal
        isOpen={isLinkModalOpen}
        onClose={() => setLinkModalOpen(false)}
        onConfirm={handleLink}
        title="지수 정보 연동"
        variant="primary"
      >
        <p className="text-sm text-gray-500">
          Open API를 통해 최신 지수 정보를 연동합니다.
        </p>
      </ConfirmModal>
    </div>
  );
};

export default IndexTable;
