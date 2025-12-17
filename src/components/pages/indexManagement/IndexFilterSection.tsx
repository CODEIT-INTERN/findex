import { useState } from "react";
import { DropdownButton } from "@/components/common/dropdown/DropdownButton";
import { FavoriteOptions } from "@/constants/indexInfoOptions";

const IndexFilterSection = () => {
  const [selectedViewKey, setSelectedViewKey] = useState<string | null>("all");
  const handleViewChange = (key: string) => {
    setSelectedViewKey(key);
  };
  return (
    <div className="space-y-3">
      <DropdownButton
        label={FavoriteOptions}
        value={selectedViewKey}
        onChange={handleViewChange}
        placeholder="옵션 선택"
        className="w-36"
      />
    </div>
  );
};

export default IndexFilterSection;
