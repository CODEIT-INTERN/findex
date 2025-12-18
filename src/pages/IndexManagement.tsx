import IndexFilterSection from "@/components/pages/indexManagement/IndexManagementFilter";
import IndexHeader from "@/components/pages/indexManagement/IndexManagementHeader";
import IndexTable from "@/components/pages/indexManagement/IndexManagementTable";

const IndexManagement = () => {
  return (
    <div className="border-secondary rounded-xl border bg-white shadow-xs">
      <IndexHeader />
      <IndexFilterSection />
      <IndexTable />
    </div>
  );
};

export default IndexManagement;
