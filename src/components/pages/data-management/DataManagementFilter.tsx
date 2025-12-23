import { useEffect, useMemo, useRef, useState } from "react";
import type { DateRange } from "react-aria-components";
import { DateRangePicker } from "@/components/common/date-picker/DateRangePicker";
import type { Index } from "@/pages/DataManagement";
import { useIndexDataListStore } from "@/store/indexDataListStore";
import { useIndexInfoSummaryStore } from "@/store/indexInfoSummaryStore";
import { formatDateRange } from "@/utils/date";
import { Select } from "../../common/select/Select";

interface DataManagementFilterProps {
  onIndexChange: (index: Index) => void;
}

export default function DataManagementFilter({
  onIndexChange,
}: DataManagementFilterProps) {
  const [tempDateRange, setTempDateRange] = useState<DateRange | null>(null);

  const isInitializedRef = useRef(false);

  const { setFilters } = useIndexDataListStore();
  const { items, fetch, isLoading } = useIndexInfoSummaryStore();

  const summaries = useMemo(() => {
    const mappedItems = items.map((item) => ({
      id: item.id,
      label: item.indexName,
    }));

    return [...mappedItems];
  }, [items]);

  const handleDateChange = (value: DateRange | null) => {
    setTempDateRange(value);
  };

  // 날짜 범위 적용
  const handleDateApply = () => {
    if (!tempDateRange) return;
    const { start, end } = formatDateRange(tempDateRange);

    setFilters({
      startDate: start,
      endDate: end,
    });
  };

  // 취소 버튼 클릭 시 tempDateRange 초기화
  const handleDateCancel = () => {
    setTempDateRange(null);
    setFilters({
      startDate: "",
      endDate: "",
    });
  };

  // 지수 선택 핸들러
  const handleSelectChange = (id: number) => {
    const selectedItem = summaries.find((item) => item.id === id);
    if (selectedItem) onIndexChange(selectedItem);
    setFilters({ indexInfoId: id });
  };

  // 지수 정보 요약 목록 조회
  useEffect(() => {
    void fetch();
  }, [fetch]);

  // 초기 로딩 완료 시 첫 번째 아이템 자동 선택 (한 번만)
  useEffect(() => {
    if (!isLoading && summaries.length > 0 && !isInitializedRef.current) {
      onIndexChange(summaries[0]);
      setFilters({ indexInfoId: summaries[0].id });
      isInitializedRef.current = true;
    }
  }, [isLoading, summaries, onIndexChange, setFilters]);

  return (
    <div className="flex gap-3 px-6 py-5">
      {!isLoading && summaries.length > 0 ? (
        <>
          <Select
            items={summaries}
            aria-label="지수 선택"
            popoverClassName="scrollbar-thin"
            defaultValue={summaries[0].id}
            searchable
            onChange={(key) => handleSelectChange(key as number)}
            className="w-42"
          >
            {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
          </Select>

          <DateRangePicker
            aria-label="날짜 선택"
            placeholder="날짜를 선택해주세요"
            value={tempDateRange}
            onChange={(value) => handleDateChange(value)}
            onApply={handleDateApply}
            onCancel={handleDateCancel}
            className="min-w-66"
          />
        </>
      ) : (
        <>
          <div className="h-10 w-42 animate-pulse rounded-lg bg-gray-200" />
          <div className="h-10 w-66 animate-pulse rounded-lg bg-gray-200" />
        </>
      )}
    </div>
  );
}
