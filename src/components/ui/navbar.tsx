import logo from "@/assets/images/ENERGYASSET-LOGO_con_slogan.png";
import {
  FiChevronDown,
  FiFileText,
  FiHome,
  FiLogOut,
  FiSettings,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import type { IconType } from "react-icons";
import { useDispatch } from "react-redux";
import {
  logout,
  selectAuthOptions,
  selectUser,
  setPortalViewAsUser,
  type AuthUser,
} from "@/pages/auth/features/authSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { useEffect, useMemo, useState } from "react";
import Select, { type SingleValue, type StylesConfig } from "react-select";
import { fetchPortalViewerAccounts } from "@/pages/portalClient/services";

type NavItem = {
  label: string;
  href: string;
  icon?: IconType;
};

type AccountOption = {
  label: string;
  value: number | "self";
  user: AuthUser | null;
};

const accountSelectStyles: StylesConfig<AccountOption, false> = {
  control: (base, state) => ({
    ...base,
    minHeight: "42px",
    borderColor: state.isFocused ? "#0b82df" : "#dbeafe",
    borderRadius: "10px",
    boxShadow: state.isFocused ? "0 0 0 4px rgba(11,130,223,0.12)" : "none",
    cursor: "pointer",
  }),
  indicatorSeparator: () => ({ display: "none" }),
  menu: (base) => ({
    ...base,
    zIndex: 80,
    borderRadius: "12px",
    overflow: "hidden",
  }),
  option: (base, state) => ({
    ...base,
    background: state.isSelected
      ? "#0b82df"
      : state.isFocused
        ? "#eef6ff"
        : "white",
    color: state.isSelected ? "white" : "#07133d",
    cursor: "pointer",
  }),
};

const PORTAL_NAV_ITEMS: NavItem[] = [
  { label: "Inicio", href: "/dashboard", icon: FiHome },
  { label: "Facturas", href: "/facturas", icon: FiFileText },
  // { label: "Productos", href: "/productos", icon: FiPackage },
  // { label: "Plan Amigo", href: "/plan-amigo", icon: FiGift },
  { label: "Área de clientes", href: "/area-clientes", icon: FiUsers },
];

const STANDARD_BOTTOM_ITEMS: NavItem[] = [
  { label: "Inicio", href: "/dashboard", icon: FiHome },
  { label: "Facturas", href: "/facturas", icon: FiFileText },
  { label: "Área", href: "/area-clientes", icon: FiUser },
];

const AREA_BOTTOM_ITEMS: NavItem[] = [
  { label: "Inicio", href: "/dashboard", icon: FiHome },
  { label: "Facturas", href: "/facturas", icon: FiFileText },
  { label: "Área", href: "/area-clientes", icon: FiUser },
];

const Navbar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAppSelector(selectAuthOptions);
  const user = useAppSelector(selectUser);
  const [portalAccounts, setPortalAccounts] = useState<AuthUser[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(false);
  const isPublic = location.pathname === "/login";
  const navItems: NavItem[] = isPublic ? [] : PORTAL_NAV_ITEMS;
  const bottomItems =
    location.pathname === "/mas" ? AREA_BOTTOM_ITEMS : STANDARD_BOTTOM_ITEMS;
  const displayName = user.name?.trim() || user.email?.split("@")[0] || "Cliente";
  const firstName = displayName.split(/\s+/)[0] || "Cliente";
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "C";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  const accountOptions = useMemo<AccountOption[]>(
    () => [
      {
        label: `${user.name || user.email || "Mi cuenta"} (mi sesión)`,
        value: "self",
        user: null,
      },
      ...portalAccounts
        .filter((account) => Number(account.id) !== Number(user.id))
        .map((account) => ({
          label: `${account.name || account.email || `Cliente ${account.id}`} · ${
            account.email || "sin email"
          }`,
          value: Number(account.id),
          user: account,
        })),
    ],
    [portalAccounts, user.email, user.id, user.name],
  );
  const selectedAccountOption = auth.viewAsUser?.id
    ? accountOptions.find(
        (option) => Number(option.value) === Number(auth.viewAsUser?.id),
      ) || {
        label: `${auth.viewAsUser.name || auth.viewAsUser.email || `Cliente ${auth.viewAsUser.id}`} · ${
          auth.viewAsUser.email || "sin email"
        }`,
        value: Number(auth.viewAsUser.id),
        user: auth.viewAsUser,
      }
    : accountOptions.find((option) => option.value === "self") ||
      accountOptions[0];

  useEffect(() => {
    if (!auth.viewAsUser || (!isPublic && user.isAdmin)) return;

    dispatch(setPortalViewAsUser(null));
  }, [auth.viewAsUser, dispatch, isPublic, user.isAdmin]);

  useEffect(() => {
    if (isPublic || !user.isAdmin) {
      setPortalAccounts([]);
      return;
    }

    let active = true;

    const loadAccounts = async () => {
      setAccountsLoading(true);
      try {
        const response = await fetchPortalViewerAccounts();
        if (active) setPortalAccounts(response.rows);
      } catch {
        if (active) setPortalAccounts([]);
      } finally {
        if (active) setAccountsLoading(false);
      }
    };

    loadAccounts();

    return () => {
      active = false;
    };
  }, [dispatch, isPublic, user.isAdmin]);

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
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-3 rounded-lg outline-none transition hover:bg-[#f7fbff] focus:ring-4 focus:ring-[#0b82df]/15">
                <span className="flex items-center gap-3 md:border-l md:border-gray-200 md:pl-5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#0b82df] bg-white text-base font-bold text-[#0b82df] md:h-12 md:w-12 md:border-0 md:bg-[#0b82df] md:text-white">
                    {initials}
                  </span>
                  <span className="hidden text-left leading-tight md:block">
                    <span className="block text-sm font-semibold text-[#18233c]">
                      Hola,
                    </span>
                    <span className="block text-sm text-[#18233c]">{firstName}</span>
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
                  onClick={() => navigate("/change-password")}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <FiUser className="text-[#0b82df]" />
                  <span>Cambiar contraseña</span>
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
    {!isPublic && user.isAdmin && (
      <section className="sticky top-24 z-30 border-b border-[#dbeafe] bg-[#f7fbff] px-6 py-3 md:px-10 lg:px-14">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0b82df]">
              Vista administrador
            </p>
            <p className="text-sm text-[#07133d]">
              Selecciona un cliente para ver el portal tal como lo ve esa cuenta.
            </p>
          </div>
          <div className="min-w-0 md:w-[30rem]">
            <Select<AccountOption, false>
              aria-label="Seleccionar cliente del portal"
              options={accountOptions}
              value={selectedAccountOption}
              isLoading={accountsLoading}
              isSearchable
              styles={accountSelectStyles}
              noOptionsMessage={() => "No hay clientes disponibles"}
              onChange={(option: SingleValue<AccountOption>) => {
                dispatch(setPortalViewAsUser(option?.user || null));
              }}
            />
          </div>
        </div>
      </section>
    )}
    {!isPublic && (
      <nav className="fixed inset-x-0 bottom-0 z-50 grid h-20 grid-cols-3 border-t border-gray-200 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_30px_rgba(15,38,71,0.08)] backdrop-blur md:hidden">
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
