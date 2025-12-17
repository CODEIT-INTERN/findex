import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">대시보드</h1>
      <div className="flex flex-col space-y-4">
        <Link to="/IndexManagement">📈 지수 관리</Link>
        <Link to="/data-management">🗄️ 데이터 관리</Link>
        <Link to="/integrations">🔗 통합 관리</Link>
      </div>
    </div>
  );
}
