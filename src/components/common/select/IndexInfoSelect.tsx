import { useEffect, useMemo } from "react";
import type { SelectProps } from "react-aria-components";
import { useIndexInfoSummaryStore } from "@/store/indexInfoSummaryStore";
import { Select } from "./Select";

export default function IndexInfoSelect({ ...rest }: SelectProps) {
  const { items, fetch } = useIndexInfoSummaryStore();

  const summaries = useMemo(() => {
    const allOption = {
      id: -1,
      label: "전체 지수",
    };

    const mappedItems = items.map((item) => ({
      id: item.id,
      label: item.indexName,
    }));

    return [allOption, ...mappedItems];
  }, [items]);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  return (
    <Select
      items={summaries}
      popoverClassName="scrollbar-thin"
      defaultValue={-1}
      searchable
      {...rest}
    >
      {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
    </Select>
  );
}
