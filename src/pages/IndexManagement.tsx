import IndexFilterSection from "@/components/pages/indexManagement/IndexFilterSection";
import IndexTable from "@/components/pages/indexManagement/IndexTable";

const IndexManagement = () => {
  return (
    <div>
      지수관리
      <IndexFilterSection />
      <IndexTable />
    </div>
  );
};

export default IndexManagement;
