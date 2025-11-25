import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLayerGroup,
  faWarehouse,
  faBox,
  faMoneyBill,
  faUtensils,
  faMagnifyingGlassChart,
  faRetweet,
  faLeaf,
  faTruckField,
  faUsers,
  faCircleUser,
} from "@fortawesome/free-solid-svg-icons";

type NavItem = { label: string; href: string; icon: any };

const items: NavItem[] = [
  { label: "Thống kê", href: "/", icon: faMagnifyingGlassChart },
  { label: "Loại sản phẩm", href: "/categories", icon: faLayerGroup },
  { label: "Kho", href: "/warehouse", icon: faWarehouse },
  { label: "Đơn hàng", href: "/orders", icon: faBox },
  { label: "Thanh toán", href: "/payments", icon: faMoneyBill },
  { label: "Sản phẩm", href: "/products", icon: faUtensils },
  { label: "Nhà cung cấp", href: "/suppliers", icon: faTruckField },
  { label: "Nhân viên", href: "/staff", icon: faUsers },
];

export default function Sidebar({
  collapsed = true,
  onMouseEnter,
  onMouseLeave,
}: {
  collapsed?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  return (
    <aside
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 z-40 flex flex-col justify-between transition-all duration-300 ease-in-out shadow-sm ${collapsed ? "w-[64px]" : "w-64"
        }`}
      style={{ color: "var(--foreground)", transitionProperty: 'width, background-color' }}>
      <div>
        <div className={`flex items-center p-4`}
          style={{
            overflow: "hidden"
          }}>
          <div className={`flex items-center font-semibold text-green-800`}
            style={{ gap: "15px" }}>
            <div className="w-[32px] h-9 rounded-md bg-green-100 flex items-center justify-center text-green-700">
              <FontAwesomeIcon icon={faLeaf} />
            </div>
            <span className="text-lg whitespace-nowrap">Green Store</span>
          </div>
        </div>

        <nav className="mt-2 flex flex-col gap-1 p-2" style={{ overflow: "hidden" }} aria-label="Main navigation">
          {items.map((it) => (
            <Link
              key={it.label}
              href={it.href}
              style={{ gap: "15px" }}
              className={`group flex items-center w-100 p-2 rounded transition-colors duration-150 hover:bg-linear-to-r hover:from-green-600 hover:to-green-500`}>
              <div className="flex justify-center w-[32px]">
                <span className={`text-foreground group-hover:text-white`}>
                  <FontAwesomeIcon icon={it.icon} />
                </span>
              </div>
              <span className="truncate text-foreground group-hover:text-white">
                {it.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-3">
        <div className={`flex items-center`} style={{overflow: "hidden"}}>
          <div className={`flex items-center`}
          style={{gap: "15px"}}>
            <div className="w-[32px] h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700">
              <FontAwesomeIcon icon={faCircleUser} />
            </div>
            <div>
              <div className="font-medium text-sm" style={{ color: "var(--foreground)" }}>Admin</div>
              <div className="text-sm" style={{ color: "var(--foreground)", opacity: 0.8 }}>admin@gmail.com</div>
            </div>
          </div>
          <button aria-label="Settings" className="p-2 rounded hover:bg-gray-100 text-foreground" style={{ color: 'var(--foreground)' }}>
              <FontAwesomeIcon icon={faRetweet} />
          </button>
        </div>
      </div>
    </aside>
  );
}
