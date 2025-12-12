import { Outlet } from "react-router-dom";
import Navigation from "@/components/layout/Navigation";
import Header from "../common/Header";

export default function Layout() {
  return (
    <div className="text-primary min-h-screen bg-slate-50">
      <div className="flex min-h-screen flex-col">
        {/* 헤더바 */}
        <Navigation />

        {/* 메인 컨텐츠 영역 */}
        <main className="flex-1">
          <Header />
          <div className="mx-auto w-full max-w-7xl px-4 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
