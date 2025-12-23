import { useEffect, useMemo, useState } from "react";
import type { DateRange } from "react-aria-components";
import { SearchMd } from "@untitledui/icons";
import {
  IndexJobTypeOptions,
  IndexSyncStatusOptions,
} from "@/constants/integrationsLabels";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useIndexInfoSummaryStore } from "@/store/indexInfoSummaryStore";
import { useSyncJobListStore } from "@/store/syncJobStore";
import type { JobType, ResultType } from "@/types/enums";
import { formatSyncDateValue } from "@/utils/date";
import { DateRangePicker } from "../../common/date-picker/DateRangePicker";
import { Input } from "../../common/input/Input";
import { Select } from "../../common/select/Select";
import { SyncHistoryTable } from "./SyncHistoryTable";

export const SyncHistorySection = () => {
  const [keyword, setKeyword] = useState("");
  const [tempDateRange, setTempDateRange] = useState<DateRange | null>(null);

  const { items: indexInfoItems, fetch: fetchInfoItems } =
    useIndexInfoSummaryStore();
  const { filters, setFilters, fetch: fetchIndexItems } = useSyncJobListStore();

  const debouncedKeyword = useDebouncedValue(keyword);

  const summaries = useMemo(() => {
    const allOption = {
      id: -1,
      label: "전체 지수",
    };

    const mappedItems = indexInfoItems.map((item) => ({
      id: item.id,
      label: item.indexName,
    }));

    return [allOption, ...mappedItems];
  }, [indexInfoItems]);

  const handleKeywordChange = (value: string) => {
    setKeyword(value);
  };

  const handleDateChange = (value: DateRange | null) => {
    setTempDateRange(value);
  };

  // 지수 선택 핸들러
  const handleIndexSelectChange = (id: number) => {
    const selectedItem = summaries.find((item) => item.id === id);
    setFilters({
      indexInfoId: selectedItem?.id,
    });
  };

  // 지수 상태 선택
  const handleIndexStatusChange = (id: number) => {
    const selectedItem = IndexSyncStatusOptions.find(
      (item) => item.id === Number(id),
    );
    const value = selectedItem?.value;

    if (value === "") {
      setFilters({ status: undefined });
    } else {
      setFilters({ status: value as ResultType });
    }
  };

  // 지수 유형 선택
  const handleJobTypeChange = (id: number) => {
    const selectedItem = IndexJobTypeOptions.find(
      (item) => item.id === Number(id),
    );
    const value = selectedItem?.value;

    if (value === "") {
      setFilters({ jobType: undefined });
    } else {
      setFilters({ jobType: value as JobType });
    }
  };

  // 날짜 범위 적용
  const handleDateApply = () => {
    if (!tempDateRange) return;
    const jobTimeFrom = formatSyncDateValue(tempDateRange.start);
    const jobTimeTo = formatSyncDateValue(tempDateRange.end);

    setFilters({
      jobTimeFrom,
      jobTimeTo,
    });
  };

  // 취소 버튼 클릭 시 tempDateRange 초기화
  const handleDateCancel = () => {
    setTempDateRange(null);
    setFilters({
      jobTimeFrom: "",
      jobTimeTo: "",
    });
  };

  // 지수 정보 요약 목록 조회
  useEffect(() => {
    void fetchInfoItems();
  }, [fetchInfoItems]);

  // 초기 로딩 완료 시 첫 번째 아이템 자동 선택 (한 번만)
  useEffect(() => {
    void fetchIndexItems();
  }, [fetchIndexItems, filters]);

  useEffect(() => {
    setFilters({
      worker: debouncedKeyword.trim() || undefined,
    });
  }, [debouncedKeyword, setFilters]);

  // Select의 현재 값
  const currentJobTypeId =
    filters.jobType === undefined
      ? IndexJobTypeOptions[0].id
      : (IndexJobTypeOptions.find((opt) => opt.value === filters.jobType)?.id ??
        IndexJobTypeOptions[0].id);

  const currentIndexId = filters.indexInfoId ?? -1;

  const currentStatusId =
    filters.status === undefined
      ? IndexSyncStatusOptions[0].id
      : (IndexSyncStatusOptions.find((opt) => opt.value === filters.status)
          ?.id ?? IndexSyncStatusOptions[0].id);

  return (
    <section className="border-secondary flex flex-1 flex-col overflow-hidden rounded-xl border shadow-xs">
      <div className="border-secondary flex justify-between gap-3 border-b px-6 py-5">
        <h2 className="shrink-0 text-lg leading-7 font-semibold">연동 이력</h2>
        <Input
          placeholder="작업자명"
          icon={SearchMd}
          onChange={(value) => handleKeywordChange(value)}
          className="w-42"
        />
      </div>
      {/* 연동 이력 필터 */}
      <div className="border-secondary scrollbar-thin flex items-center justify-between gap-3 overflow-x-auto border-b px-6 py-5">
        <div className="flex items-center gap-3">
          <Select
            items={IndexJobTypeOptions}
            aria-label="지수 연동 상태 선택"
            value={currentJobTypeId}
            onChange={(key) => handleJobTypeChange(key as number)}
            className="w-30"
          >
            {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
          </Select>
          <Select
            items={summaries}
            aria-label="지수 선택"
            popoverClassName="scrollbar-thin"
            value={currentIndexId}
            searchable
            onChange={(key) => handleIndexSelectChange(key as number)}
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
        </div>

        <Select
          items={IndexSyncStatusOptions}
          aria-label="지수 연동 상태 선택"
          value={currentStatusId}
          onChange={(key) => handleIndexStatusChange(key as number)}
          className="w-36"
        >
          {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
        </Select>
      </div>
      {/* 연동 이력 테이블 */}
      <SyncHistoryTable />
    </section>
  );
};
