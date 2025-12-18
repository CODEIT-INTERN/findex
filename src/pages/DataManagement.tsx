import DataManagementFilter from "@/components/data-management/DataManagementFilter";
import DataManagementHeader from "@/components/data-management/DataManagementHeader";
import DataManagementTable from "@/components/data-management/DataManagementTable";

export default function DataManagement() {
  return (
    <div className="border-secondary flex min-h-0 flex-1 flex-col rounded-xl border bg-white">
      <DataManagementHeader />
      <DataManagementFilter />
      <DataManagementTable />
    </div>
  );
}
