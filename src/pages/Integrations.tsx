import { IndexSyncListSection } from "@/components/integrations/IndexSyncListSection";
import { StatSection } from "@/components/integrations/StatSection";
import { SyncHistorySection } from "@/components/integrations/SyncHistorySection";

export default function Integrations() {
  return (
    <div className="scrollbar-thin flex min-h-0 flex-1 flex-col gap-6 overflow-auto">
      <StatSection />
      <div className="flex min-h-80 flex-1 gap-5">
        <IndexSyncListSection />
        <SyncHistorySection />
      </div>
    </div>
  );
}
