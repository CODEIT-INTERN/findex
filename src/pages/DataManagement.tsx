import { useState } from "react";
import DataManagementFilter from "@/components/data-management/DataManagementFilter";
import DataManagementHeader from "@/components/data-management/DataManagementHeader";
import DataManagementTable from "@/components/data-management/DataManagementTable";

export interface Index {
  id: number;
  label: string;
}

export default function DataManagement() {
  const [selectedIndex, setSelectedIndex] = useState<Index | null>(null);
  console.log("selectedIndex :", selectedIndex);

  const onIndexChange = (index: Index) => {
    setSelectedIndex(index);
  };

  return (
    <div className="border-secondary flex min-h-0 flex-1 flex-col rounded-xl border bg-white">
      <DataManagementHeader index={selectedIndex} />
      <DataManagementFilter onIndexChange={onIndexChange} />
      <DataManagementTable />
    </div>
  );
}
