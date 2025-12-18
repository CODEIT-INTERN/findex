import { Link, NavLink } from "react-router-dom";
import { NAV_ITEMS } from "@/constants/navigation";
import { cx } from "@/utils/cx";
import Logo from "/logo.png";

export default function Navigation() {
  return (
    <nav className="flex justify-between py-6">
      {/* 브랜드 영역 */}
      <Link to={"/"}>
        <img src={Logo} alt="logo" />
      </Link>
      {/* 네비게이션 섹션들 */}
      <div className="flex items-center gap-5">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              cx(
                "text-tertiary rounded-full px-6 py-2 text-lg font-semibold",
                isActive ? "bg-primary-solid text-white" : "hover:bg-gray-200",
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
