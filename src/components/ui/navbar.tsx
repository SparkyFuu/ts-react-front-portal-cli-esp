import logo from "@/assets/images/ENERGYASSET-LOGO_con_slogan.png";
import {
  FiBarChart2,
  FiBell,
  FiChevronDown,
  FiFileText,
  FiGift,
  FiHome,
  FiLogOut,
  FiMail,
  FiMoreHorizontal,
  FiPackage,
  FiSettings,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import type { IconType } from "react-icons";
import { useDispatch } from "react-redux";
import { logout } from "@/pages/auth/features/authSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type NavItem = {
  label: string;
  href: string;
  icon?: IconType;
};

const PUBLIC_NAV_ITEMS: NavItem[] = [
  { label: "Inicio", href: "/login" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Servicios", href: "/servicios" },
  { label: "Contacto", href: "/contacto" },
];

const PORTAL_NAV_ITEMS: NavItem[] = [
  { label: "Inicio", href: "/dashboard", icon: FiHome },
  { label: "Consumo", href: "/consumo", icon: FiBarChart2 },
  { label: "Facturas", href: "/facturas", icon: FiFileText },
  { label: "Productos", href: "/productos", icon: FiPackage },
  { label: "Plan Amigo", href: "/plan-amigo", icon: FiGift },
  { label: "Contacto", href: "/contacto", icon: FiMail },
  { label: "Área de clientes", href: "/area-clientes", icon: FiUsers },
];

const STANDARD_BOTTOM_ITEMS: NavItem[] = [
  { label: "Inicio", href: "/dashboard", icon: FiHome },
  { label: "Consumo", href: "/consumo", icon: FiBarChart2 },
  { label: "Plan Amigo", href: "/plan-amigo", icon: FiGift },
  { label: "Facturas", href: "/facturas", icon: FiFileText },
  { label: "Contacto", href: "/contacto", icon: FiMail },
];

const AREA_BOTTOM_ITEMS: NavItem[] = [
  { label: "Inicio", href: "/dashboard", icon: FiHome },
  { label: "Consumo", href: "/consumo", icon: FiBarChart2 },
  { label: "Facturas", href: "/facturas", icon: FiFileText },
  { label: "Área", href: "/area-clientes", icon: FiUser },
  { label: "Más", href: "/mas", icon: FiMoreHorizontal },
];

const Navbar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const isPublic = location.pathname === "/login";
  const navItems: NavItem[] = isPublic ? PUBLIC_NAV_ITEMS : PORTAL_NAV_ITEMS;
  const bottomItems =
    location.pathname === "/area-clientes" ? AREA_BOTTOM_ITEMS : STANDARD_BOTTOM_ITEMS;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <>
    <header
      className={`top-0 z-40 border-b border-gray-100 bg-white ${
        isPublic ? "hidden md:sticky md:block" : "sticky"
      }`}
    >
      <div className="flex h-24 items-center justify-between gap-6 px-6 md:px-10 lg:px-14">
        <a href="/" className="flex min-w-0 shrink-0 items-center select-none">
          <span className="sr-only">ENERGYASSET</span>
          <img
            src={logo}
            alt=""
            className="h-12 w-auto object-contain md:h-16"
            loading="lazy"
          />
        </a>

        <nav
          className={`hidden flex-1 items-center justify-center ${
            isPublic ? "gap-14" : "gap-8"
          } lg:flex`}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `relative flex items-center gap-2 px-1 py-2 text-base font-semibold transition-colors ${
                  isActive
                    ? "text-[#0b82df]"
                    : "text-[#18233c] hover:text-[#0b82df]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {Icon && <Icon className="h-5 w-5" />}
                  {item.label}
                  <span
                    className={`absolute -bottom-2 left-0 h-1 rounded-full bg-[#0b82df] transition-[width,opacity] ${
                      isActive ? "w-full opacity-100" : "w-0 opacity-0"
                    }`}
                  />
                </>
              )}
            </NavLink>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-5">
          <nav className="hidden items-center gap-5 xl:hidden md:flex lg:hidden">
            {navItems.slice(0, 3).map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  `text-sm font-semibold ${
                    isActive ? "text-[#0b82df]" : "text-[#18233c]"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {!isPublic && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => toast.info("No tienes notificaciones nuevas")}
                  className="relative hidden h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-[#18233c] transition hover:border-[#0b82df] hover:bg-[#eef6ff] hover:text-[#0b82df] focus:outline-none focus:ring-4 focus:ring-[#0b82df]/15 md:flex"
                  aria-label="Notificaciones"
                >
                  <FiBell className="h-5 w-5" />
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Ver notificaciones</TooltipContent>
            </Tooltip>
          )}

          {!isPublic && (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-3 rounded-lg outline-none transition hover:bg-[#f7fbff] focus:ring-4 focus:ring-[#0b82df]/15">
                <span className="flex items-center gap-3 md:border-l md:border-gray-200 md:pl-5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#0b82df] bg-white text-base font-bold text-[#0b82df] md:h-12 md:w-12 md:border-0 md:bg-[#0b82df] md:text-white">
                    M
                  </span>
                  <span className="hidden text-left leading-tight md:block">
                    <span className="block text-sm font-semibold text-[#18233c]">
                      Hola,
                    </span>
                    <span className="block text-sm text-[#18233c]">María</span>
                  </span>
                </span>
                <FiChevronDown className="h-5 w-5 text-[#63708a]" />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="text-xs">
                  Portal cliente
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => navigate("/profile")}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <FiSettings className="text-[#0b82df]" />
                  <span>Configuración</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex cursor-pointer items-center gap-2 text-red-500 focus:text-red-600"
                >
                  <FiLogOut />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

    </header>
    {!isPublic && (
      <nav className="fixed inset-x-0 bottom-0 z-50 grid h-20 grid-cols-5 border-t border-gray-200 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_30px_rgba(15,38,71,0.08)] backdrop-blur md:hidden">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-semibold transition ${
                  isActive
                    ? "text-[#0b82df]"
                    : "text-gray-500 hover:bg-[#eef6ff] hover:text-[#0b82df]"
                }`
              }
            >
              {Icon && <Icon className="h-7 w-7" />}
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    )}
    </>
  );
};

export default Navbar;
